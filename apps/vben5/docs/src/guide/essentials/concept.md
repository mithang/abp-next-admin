# Khái niệm cơ bản

Trong phiên bản mới, toàn bộ dự án đã được tái cấu trúc. Bây giờ chúng tôi sẽ giới thiệu một số khái niệm cơ bản để bạn hiểu rõ hơn toàn bộ tài liệu. Hãy đọc kỹ phần này.

## Monorepo

Monorepo là toàn bộ kho của dự án, bao gồm tất cả mã nguồn, gói, ứng dụng, quy chuẩn, tài liệu, cấu hình, v.v., tức là toàn bộ nội dung của một thư mục `Monorepo`.

## Ứng dụng

Ứng dụng là một dự án hoàn chỉnh; một dự án có thể chứa nhiều ứng dụng, và các dự án này có thể tái sử dụng mã nguồn, gói, quy chuẩn, v.v. trong monorepo. Các ứng dụng đều được đặt trong thư mục `apps`. Mỗi ứng dụng đều độc lập, có thể chạy, build, kiểm thử và triển khai riêng, có thể dùng các thư viện component khác nhau, v.v.

::: tip

Ứng dụng không chỉ giới hạn ở ứng dụng frontend, mà còn có thể là ứng dụng backend, ứng dụng di động, v.v., ví dụ `apps/backend-mock` là một dịch vụ backend.

:::

## Gói

Gói là một mô-đun độc lập, có thể là một component, một công cụ, một thư viện, v.v. Gói có thể được nhiều ứng dụng tham chiếu, cũng có thể được các gói khác tham chiếu. Các gói đều được đặt trong thư mục `packages`.

Với các gói này, bạn có thể xem chúng như một gói `npm` độc lập, cách sử dụng giống hệt gói `npm`.

### Nhập gói

Nhập gói trong `package.json`:

```json {3}
{
  "dependencies": {
    "@vben/utils": "workspace:*"
  }
}
```

### Sử dụng gói

Nhập gói trong mã nguồn:

```ts
import { isString } from '@vben/utils';
```

## Bí danh

Trong dự án, bạn có thể thấy một số đường dẫn bắt đầu bằng `#`, ví dụ: `#/api`, `#/views`. Các đường dẫn này đều là bí danh, dùng để định vị nhanh tới một thư mục. Chúng không được triển khai qua `alias` của `vite`, mà dựa trên cơ chế [subpath imports](https://nodejs.org/api/packages.html#subpath-imports) của chính `Node.js`. Chỉ cần cấu hình trường `imports` trong `package.json` là được.

```json {3}
{
  "imports": {
    "#/*": "./src/*"
  }
}
```

Để IDE có thể nhận diện các bí danh này, chúng ta còn cần cấu hình trong `tsconfig.json`:

```json {5}
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "#/*": ["src/*"]
    }
  }
}
```

Như vậy, bạn có thể sử dụng bí danh trong mã nguồn.
