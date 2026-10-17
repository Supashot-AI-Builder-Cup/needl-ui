# Deploy the React app to Cloud Run with GitHub Actions

This guide deploys the Vite frontend as a container to Google Cloud Run. The app uses `react-router`, so the container serves the built single-page app with SPA fallback routing. API calls still go to the separate needl-service URL configured at build time.

## 1. Create the app container files

The repository-root `Dockerfile` builds the Vite app and serves it with Nginx:

```dockerfile
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

The repository-root `nginx.conf` serves Vite assets and routes client-side paths such as `/result/...` back to `index.html`:

```nginx
server {
    listen 8080;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

The repository-root `.dockerignore` excludes local dependencies and environment files from the image build:

```text
node_modules
dist
.git
.env
.env.*
!.env.example
```

`VITE_API_URL` is public configuration embedded in browser assets during the image build. Never pass secrets through `VITE_*` variables.

Build and run locally to verify the image before setting up deployment:

```bash
docker build --build-arg VITE_API_URL=https://needl-service.example.run.app -t needl-ui .
docker run --rm -p 8080:8080 needl-ui
```

Open `http://localhost:8080`, then reload a nested route to confirm the SPA fallback works.

## 2. Prepare Google Cloud

Choose a Google Cloud project and region. The examples below use `asia-southeast2`; replace it if needed. Enable billing, then enable the required APIs:

```bash
gcloud config set project YOUR_PROJECT_ID
gcloud services enable run.googleapis.com artifactregistry.googleapis.com iam.googleapis.com iamcredentials.googleapis.com
```

Create an Artifact Registry Docker repository:

```bash
gcloud artifacts repositories create needl-ui \
  --repository-format=docker \
  --location=asia-southeast2 \
  --description="needl-ui container images"
```

Create a dedicated deploy service account and grant it permission to push images and deploy Cloud Run services:

```bash
gcloud iam service-accounts create github-deployer \
  --display-name="GitHub Actions deployer"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

gcloud iam service-accounts create needl-ui-runtime \
  --display-name="needl-ui Cloud Run runtime"

gcloud iam service-accounts add-iam-policy-binding \
  needl-ui-runtime@YOUR_PROJECT_ID.iam.gserviceaccount.com \
  --member="serviceAccount:github-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"
```

The last role lets the deployer attach the app's runtime identity. The frontend does not need cloud permissions at runtime; do not use the GitHub deployer as the runtime identity.

## 3. Configure keyless GitHub authentication

Use Workload Identity Federation so GitHub Actions does not need a long-lived JSON service-account key.

Create a Workload Identity Pool and GitHub OIDC provider. Restrict the provider to your repository by replacing `YOUR_GITHUB_ORG/YOUR_REPOSITORY`:

```bash
gcloud iam workload-identity-pools create github \
  --location=global \
  --display-name="GitHub Actions"

gcloud iam workload-identity-pools providers create-oidc github-provider \
  --location=global \
  --workload-identity-pool=github \
  --display-name="GitHub provider" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
  --attribute-condition="assertion.repository == 'YOUR_GITHUB_ORG/YOUR_REPOSITORY'"
```

Allow that repository's GitHub identity to impersonate the deploy service account:

```bash
gcloud iam service-accounts add-iam-policy-binding \
  github-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github/attribute.repository/YOUR_GITHUB_ORG/YOUR_REPOSITORY"
```

Find `PROJECT_NUMBER` in Google Cloud project settings or with:

```bash
gcloud projects describe YOUR_PROJECT_ID --format='value(projectNumber)'
```

In GitHub, open **Settings → Secrets and variables → Actions → Variables** and add:

| Variable | Value |
|---|---|
| `GCP_PROJECT_ID` | Google Cloud project ID |
| `GCP_PROJECT_NUMBER` | Numeric project number |
| `GCP_WIF_PROVIDER` | `projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github/providers/github-provider` |
| `GCP_DEPLOY_SERVICE_ACCOUNT` | `github-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com` |
| `GCP_RUNTIME_SERVICE_ACCOUNT` | `needl-ui-runtime@YOUR_PROJECT_ID.iam.gserviceaccount.com` |
| `GCP_REGION` | `asia-southeast2` (or chosen region) |
| `VITE_API_URL` | Public base URL of needl-service, without a trailing slash |

These are identifiers and public build configuration, not credentials. Keep repository variables scoped to the repository. Configure a GitHub Environment such as `production` if deployments need reviewer approval.

## 4. Add the GitHub Actions workflow

The workflow at `.github/workflows/deploy-cloud-run.yml` runs checks on pull requests and deploys successful pushes to `main`:

```yaml
name: Build and deploy to Cloud Run

on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build

  deploy:
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    needs: validate
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - id: auth
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ vars.GCP_WIF_PROVIDER }}
          service_account: ${{ vars.GCP_DEPLOY_SERVICE_ACCOUNT }}
      - uses: google-github-actions/setup-gcloud@v2
        with:
          project_id: ${{ vars.GCP_PROJECT_ID }}
      - name: Build and push image
        env:
          PROJECT_ID: ${{ vars.GCP_PROJECT_ID }}
          REGION: ${{ vars.GCP_REGION }}
          VITE_API_URL: ${{ vars.VITE_API_URL }}
        run: |
          gcloud auth configure-docker "${REGION}-docker.pkg.dev" --quiet
          IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/needl-ui/needl-ui:${GITHUB_SHA}"
          docker build --build-arg "VITE_API_URL=${VITE_API_URL}" --tag "$IMAGE" .
          docker push "$IMAGE"
          echo "IMAGE=$IMAGE" >> "$GITHUB_ENV"
      - name: Deploy to Cloud Run
        env:
          PROJECT_ID: ${{ vars.GCP_PROJECT_ID }}
          REGION: ${{ vars.GCP_REGION }}
          RUNTIME_SERVICE_ACCOUNT: ${{ vars.GCP_RUNTIME_SERVICE_ACCOUNT }}
        run: |
          gcloud run deploy needl-ui \
            --image "$IMAGE" \
            --region "$REGION" \
            --project "$PROJECT_ID" \
            --service-account "$RUNTIME_SERVICE_ACCOUNT" \
            --port 8080 \
            --allow-unauthenticated \
            --quiet
```

The workflow builds the Docker image with `VITE_API_URL` embedded, pushes it to Artifact Registry, then deploys that image. `--allow-unauthenticated` makes the public frontend reachable; omit it if the app must require Google authentication. If using a GitHub production Environment, add `environment: production` to the `deploy` job and define these variables in that environment.

The workflow above deploys on every push to `main`. Require the `validate` job to pass in GitHub branch protection before merging pull requests.

Commit the four repository files, push a branch, and open a pull request to `main`. Confirm the `validate` job passes. Merge the pull request; the push to `main` triggers the first deployment. Subsequent merges repeat the same build and deploy flow.

## 5. Connect the frontend to the API

After the first deployment, copy the Cloud Run service URL and add its origin to needl-service's `CORS_ORIGINS`. Keep `VITE_API_URL` pointed at the needl-service base URL, not the frontend's Cloud Run URL. Changing `VITE_API_URL` requires a new image build and deployment.

## 6. Verify deployment

1. Open the GitHub Actions run and confirm `validate` and `deploy` succeeded.
2. Open the Cloud Run URL printed in the deploy job.
3. Reload a nested route such as `/result/example`; Nginx should return the React app.
4. Run a product check and confirm API calls succeed in the browser Network tab. CORS failures mean needl-service's `CORS_ORIGINS` does not include the frontend origin.

## Deployment files

| File | Purpose |
|---|---|
| `Dockerfile` | Build the Vite app and serve it on Cloud Run's port 8080. |
| `nginx.conf` | Serve static assets and provide React Router SPA fallback. |
| `.dockerignore` | Exclude local dependencies, build output, Git metadata, and env files from the image build. |
| `.github/workflows/deploy-cloud-run.yml` | Validate pull requests and deploy `main` to Cloud Run. |

The Google Cloud resources and GitHub repository variables are configured outside the repository using the commands and settings above. Do not commit service-account keys or secrets. See the root [README](../README.md) for local development and the app flow.
