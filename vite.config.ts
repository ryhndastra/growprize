import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiBase = env.VITE_PROXY_TARGET || 'https://nexus.gtpscache.site';

  return {
    plugins: [react(), tailwindcss()],
    server: {
      // Proxy API calls so the browser sees a same-origin request during dev.
      // This lets the backend's session cookie work even if it is set as
      // SameSite=Lax, which cross-site fetches would otherwise block.
      proxy: {
        '/api': {
          target: apiBase,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
