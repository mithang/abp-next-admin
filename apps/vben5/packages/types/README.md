# @vben/types

Dùng cho các kiểu công cụ dùng chung cho nhiều `app`, kế thừa toàn bộ khả năng của `@vben-core/typings`. Các định nghĩa kiểu dùng chung cho nghiệp vụ có thể đặt tại đây.

## Cách dùng

### Thêm dependency

```bash
# Vào thư mục ứng dụng đích, ví dụ apps/xxxx-app
# cd apps/xxxx-app
pnpm add @vben/types
```

### Sử dụng

```ts
// Khuyến nghị thêm type
import type { SelectOption } from '@vben/types';
```
