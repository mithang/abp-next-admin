# @vben/utils

Dùng chung cho nhiều `app` package công cụ, kế thừa mọi khả năng của `@vben-core/shared/utils`. Nếu nghiệp vụ có hàm công cụ dùng chung thì có thể đặt ở đây.

## Cách dùng

### Thêm dependency

```bash
# Vào thư mục ứng dụng đích, ví dụ apps/xxxx-app
# cd apps/xxxx-app
pnpm add @vben/utils
```

### Sử dụng

```ts
import { isString } from '@vben/utils';
```
