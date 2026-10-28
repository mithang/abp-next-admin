import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // Địa chỉ đích của proxy mock
            target: 'http://localhost:5320/api',
            ws: true,
          },
        },
      },
    },
  };
});
