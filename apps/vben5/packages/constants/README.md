# @vben/constants

Dùng chung cho nhiều `app` các hằng số, kế thừa mọi khả năng của `@vben-core/shared/constants`. Nếu nghiệp vụ có hằng số dùng chung thì có thể đặt ở đây.

## Cách dùng

### Thêm dependency

```bash
# Vào thư mục ứng dụng đích, ví dụ apps/xxxx-app
# cd apps/xxxx-app
pnpm add @vben/constants
```

### Sử dụng

```ts
import { LOGIN_PATH } from '@vben/constants';
```
