import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            // Backend ABP AllInOne local (giữ nguyên tiền tố /api, bản thân API ABP nằm dưới /api)
            target: 'http://localhost:30000',
            ws: true,
          },
        },
      },
    },
  };
});
