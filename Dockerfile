# needl-ui for Cloud Run: build the Vite app, then serve dist/ with nginx (non-root) on $PORT.

FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
# The API URL is compiled into the bundle. By default it comes from .env.production;
# pass --build-arg VITE_API_URL=https://... to build for another backend.
ARG VITE_API_URL=""
RUN if [ -n "$VITE_API_URL" ]; then \
      export VITE_API_URL; \
    else \
      unset VITE_API_URL; \
      grep -q '^VITE_API_URL=.' .env.production 2>/dev/null \
        || { echo "Set VITE_API_URL in .env.production or pass --build-arg VITE_API_URL=..." >&2; exit 1; }; \
    fi \
    && npm run build

FROM nginxinc/nginx-unprivileged:1.30-alpine
# Cloud Run sets PORT (8080 by default); nginx fills it into the template at startup.
ENV PORT=8080
COPY nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
