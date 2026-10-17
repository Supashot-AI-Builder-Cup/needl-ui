# needl-ui

needl frontend for checking Shopee listing risks, including impersonated stores, fake reviews, and BPOM/Halal claims. Built with React 19, TypeScript, Vite, and `react-router`.

Checks use **needl-service** through `POST /api/v1/verification-jobs` and `GET /api/v1/verification-jobs/{id}`. Completed product search results are saved in the browser's local history and shown on the homepage. Opening a saved result fetches its details through `GET /api/v1/verifications/{verification_id}`. See `.agents/docs/API_Contract.md`; API clients live in `src/services/api/`.

## Run locally

1. Start needl-service first (see its README); the default URL is `http://localhost:8000`.
2. Set the API URL if it differs from the default:

   ```bash
   cp .env.example .env.local   # set VITE_API_URL
   ```

3. Start the UI:

   ```bash
   npm install
   npm run dev      # http://localhost:5173
   npm run build    # typecheck + production build
   npm run lint
   npm test         # Vitest, single run
   ```

needl-service must allow the UI origin in `CORS_ORIGINS` (the default is `http://localhost:5173`).

Vitest 5 officially requires Node 22.12+ or 24 (`nvm use 24`). Tests also run on Node 20.19, with an npm engine warning.

## Production

`VITE_API_URL` is read at build time. Rebuild with the needl-service Cloud Run URL (printed by `deploy/deploy.sh`):

```bash
VITE_API_URL=https://needl-service-xxxxx.asia-southeast2.run.app npm run build
```

The UI hosting origin must be included in needl-service's `CORS_ORIGINS` (`deploy/env.yaml`).

For step-by-step frontend CI/CD deployment to Cloud Run, see [docs/CI-CD.md](docs/CI-CD.md).

With needl-service in `stub` mode, a link containing shop ID `218334561` returns a sample safe result; other links return a sample high-risk result:

- High risk: `https://shopee.co.id/Dermalune-10-Niacinamide-Alpha-Arbutin-Brightening-Serum-30ml-Original-i.773019284.25810442671`
- Safe: `https://shopee.co.id/Dermalune-Niacinamide-Brightening-Serum-30ml-Official-i.218334561.24019837712`

## Check flow

1. A link or screenshot is sent to `POST /verification-jobs`. Validation errors appear below the form.
2. The “Is this the product?” modal opens and polls the job, following `Retry-After`. The product card appears when the job includes a `preview`.
3. After “Continue checking,” the progress log follows the job's `progress` (`src/data/steps.ts`).
4. When the job completes, the result is kept in memory and added to local history, then the app opens `/result/:verificationId`.
5. The homepage reads history from localStorage. Opening or refreshing a result fetches details from `GET /api/v1/verifications/{verification_id}`.

Failed jobs show a message based on `error.code`. If a Shopee link cannot be fetched, the modal offers the Screenshot tab.

## Error messages

Backend errors are mapped in `src/services/api/errors.ts` to short localized messages that explain what happened and what the user can do. The UI never displays the server `message`, error code, HTTP status, or `request_id`. During development, failed requests are logged in the browser console (`[needl] request failed`) with the `request_id` for matching against server logs. Render crashes show a generic message through the `ErrorBoundary` in `RootLayout`. See the needl-service README's “What the UI message means” section for each message's meaning.

## Folder structure

```
src/
  app/          App (providers + router), routes, layout route
  pages/        HomePage, ResultPage — connect hooks to components
  components/   atomic design
    atoms/        smallest elements: Button, Pill, Icon, Bottle, Toast, ...
    molecules/    combined atoms: LinkField, Gauge, HistoryCard, CheckItem, evidence/*, ...
    organisms/    page sections: Header, Hero, PreviewModal, VerdictCard, CheckSection, ...
    templates/    data-free page layouts: AppShell, HomeTemplate, ResultTemplate
  context/      global state: preferences (theme + language), toast, check (results + history), draft (home input)
  hooks/        hooks shared across components
  lib/          framework-free functions: parseLink, gauge, severity, history, storage, ...
  services/api/ needl-service client: requests, jobs, screenshot FormData, error mapping
  data/         static UI data: checks, screenshot slots, progress steps
  i18n/         English and Indonesian text
  types/        domain types and API contract types
  styles/       color tokens (light/dark) and base CSS
```

## UI and logic conventions

Component names match their folder names. Each component folder (including `pages/`) contains:

| File | Contents |
|---|---|
| `index.tsx` | UI only: accept props and render JSX. `usePreferences()` is allowed for text. |
| `index.css` | Component styles (class names follow the `needl.html` prototype). Omitted when there are no component-specific styles. |
| `useNameHook.ts` | Component logic: state, effects, timers, animation, and event handlers. The filename matches the hook, for example `useGaugeAnimation.ts`. |

Import components through their folder, for example: `import { Gauge } from '../../molecules/Gauge'`.

For bugs:

- Wrong appearance: check `index.tsx` / `index.css` in the component folder.
- Wrong behavior (timer, animation, click): check the `use*.ts` file in that folder.
- Wrong calculation or validation: check `src/lib`.
- Wrong data: inspect the API response in the Network tab, then check `src/services/api/`.

## Local storage

`localStorage` stores `needl-theme`, `needl-lang`, and `needl-search-history`. Remove these keys to reset local preferences and search history.
