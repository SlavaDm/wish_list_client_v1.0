/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_SERVER: string;
  readonly VITE_PATH_TO_IMAGE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
