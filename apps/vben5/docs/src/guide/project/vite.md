# Vite Config

Dự án đã đóng gói một lớp cấu hình vite và tích hợp một số plugin, thuận tiện để tái sử dụng trong nhiều package và ứng dụng, cách dùng như sau:

## Ứng dụng

```ts
// vite.config.mts
import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    // Cấu hình vite, tham khảo tài liệu chính thức của vite để ghi đè
    vite: {},
  };
});
```

## Package

```ts
// vite.config.mts
import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    library: {},
    // Cấu hình vite, tham khảo tài liệu chính thức của vite để ghi đè
    vite: {},
  };
});
```
