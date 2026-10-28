# Kiểm thử đơn vị

Dự án tích hợp sẵn [Vitest](https://vitest.dev/) làm công cụ kiểm thử đơn vị. Vitest là một test runner dựa trên Vite, cung cấp một bộ API đơn giản để viết các trường hợp kiểm thử.

## Viết trường hợp kiểm thử

Trong dự án, chúng ta quy ước tên file kiểm thử kết thúc bằng `.test.ts` hoặc đặt trong thư mục `__tests__`. Ví dụ, tạo file `utils.ts`, rồi file `utils.test.ts` cùng cấp,

```ts
// utils.test.ts
import { expect, test } from 'vitest';
import { sum } from './sum';

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

## Chạy kiểm thử

Chỉ cần chạy các lệnh sau tại thư mục gốc của monorepo:

```bash
pnpm test:unit
```

## Các kiểm thử đơn vị hiện có

Dự án đã có một số trường hợp kiểm thử đơn vị, bạn có thể tìm các file kết thúc bằng `.test.ts` để xem. Khi bạn thay đổi mã liên quan, hãy chạy kiểm thử đơn vị để đảm bảo tính đúng đắn của mã. Khuyến nghị trong quá trình phát triển hãy duy trì độ bao phủ kiểm thử, đồng thời chạy kiểm thử đơn vị trong quy trình CI/CD, đảm bảo kiểm thử đạt rồi mới triển khai dự án.

Tình hình kiểm thử đơn vị hiện có:

![](/guide/test.png)
