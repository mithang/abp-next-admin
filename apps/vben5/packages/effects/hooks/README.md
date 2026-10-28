# @vben/hooks

Hook dùng chung cho nhiều `app`, kế thừa mọi khả năng của `@vben/hooks`. Nếu nghiệp vụ có hook dùng chung thì có thể đặt ở đây.

## Cách dùng

### Thêm dependency

```bash
# Vào thư mục ứng dụng đích, ví dụ apps/xxxx-app
# cd apps/xxxx-app
pnpm add @vben/hooks
```

### Sử dụng

```ts
import { useNamespace } from '@vben/hooks';
```
