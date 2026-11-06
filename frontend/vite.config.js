import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// En desarrollo, las peticiones a /api, /covers y /uploads se reenvían al backend (puerto 4000)
const backend = 'http://localhost:4000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': backend,
      '/covers': backend,
      '/uploads': backend,
    },
  },
});
