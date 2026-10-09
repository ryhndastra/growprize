/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the Growprize backend, e.g. https://nexus.gtpscache */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
