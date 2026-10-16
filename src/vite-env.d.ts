/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** needl-service base URL, e.g. http://localhost:8000 */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
