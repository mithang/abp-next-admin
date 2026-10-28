---
outline: deep
---

# Phiên bản tinh gọn

Từ phiên bản `5.0` trở đi, chúng tôi không còn cung cấp kho lưu trữ hay nhánh tinh gọn nữa. Mục tiêu của chúng tôi là mang lại trải nghiệm phát triển nhất quán hơn, đồng thời giảm chi phí bảo trì. Tại đây, chúng tôi sẽ giới thiệu cách tinh gọn dự án của chính bạn và loại bỏ các tính năng không cần thiết.

## Tinh gọn ứng dụng

Trước tiên, hãy xác nhận phiên bản thư viện component `UI` mà bạn cần, sau đó xóa các ứng dụng tương ứng. Ví dụ, nếu bạn chọn dùng `Ant Design Vue`, bạn có thể xóa các ứng dụng khác, chỉ cần xóa hai thư mục dưới đây là được:

```bash
apps/web-ele
apps/web-naive

```

::: tip

Nếu dự án không tích hợp sẵn ứng dụng thư viện component `UI` mà bạn cần, bạn có thể xóa toàn bộ các ứng dụng khác. Sau đó tự tạo ứng dụng mới là được.

:::

## Tinh gọn code demo

Nếu bạn không cần code demo, bạn có thể xóa trực tiếp thư mục `playground`.

## Tinh gọn tài liệu

Nếu bạn không cần tài liệu, bạn có thể xóa trực tiếp thư mục `docs`.

## Tinh gọn dịch vụ Mock

Nếu bạn không cần dịch vụ `Mock`, bạn có thể xóa trực tiếp thư mục `apps/backend-mock`. Đồng thời, trong file `.env.development` của ứng dụng của bạn, hãy xóa biến `VITE_NITRO_MOCK`.

```bash
# Có bật dịch vụ Nitro Mock hay không, true là bật, false là tắt
VITE_NITRO_MOCK=false
```

## Cài đặt dependencies

Đến đây, bạn đã hoàn thành thao tác tinh gọn, tiếp theo bạn có thể cài đặt dependencies và khởi động dự án của mình:

```bash
# Thực thi tại thư mục gốc
pnpm install

```

## Điều chỉnh lệnh

Sau khi tinh gọn, bạn có thể cần điều chỉnh lệnh theo dự án của mình. Trong file `package.json` tại thư mục gốc, bạn có thể điều chỉnh trường `scripts` và loại bỏ các lệnh mà bạn không cần.

```json
{
  "scripts": {
    "build:antd": "pnpm run build --filter=@vben/web-antd",
    "build:docs": "pnpm run build --filter=@vben/docs",
    "build:ele": "pnpm run build --filter=@vben/web-ele",
    "build:naive": "pnpm run build --filter=@vben/web-naive",
    "build:tdesign": "pnpm run build --filter=@vben/web-tdesign",
    "build:play": "pnpm run build --filter=@vben/playground",
    "dev:antd": "pnpm -F @vben/web-antd run dev",
    "dev:docs": "pnpm -F @vben/docs run dev",
    "dev:ele": "pnpm -F @vben/web-ele run dev",
    "dev:play": "pnpm -F @vben/playground run dev",
    "dev:naive": "pnpm -F @vben/web-naive run dev"
  }
}
```

## Khác

Nếu bạn muốn tinh gọn thêm nữa, bạn có thể tham khảo tác dụng của các file hoặc thư mục dưới đây, đánh giá xem mình có cần hay không, không cần thì xóa là được:

- Thư mục `.changeset` dùng để quản lý thay đổi phiên bản
- Thư mục `.github` dùng để lưu file cấu hình GitHub
- Thư mục `.vscode` dùng để lưu file cấu hình VSCode, nếu bạn dùng trình soạn thảo khác thì có thể xóa
- Thư mục `./scripts/deploy` dùng để lưu script triển khai, nếu bạn không cần triển khai bằng docker thì có thể xóa

## Tinh gọn ứng dụng

Khi bạn đã xác định một ứng dụng nào đó, bạn vẫn có thể tinh gọn thêm:

### Xóa route và trang không cần thiết

- Trong file `src/router/routes` của ứng dụng, bạn có thể xóa các route không cần thiết. Trong đó, đối với thư mục `core`, nếu chỉ cần đăng nhập và quên mật khẩu, bạn có thể xóa các route khác, như quên mật khẩu, đăng ký, v.v. Sau khi xóa route, bạn có thể xóa các file trang tương ứng trong thư mục `src/views/_core`.

- Trong file `src/router/routes` của ứng dụng, bạn có thể xóa các route không cần thiết theo nhu cầu, như các thư mục `demos`, `vben`, v.v. Sau khi xóa route, bạn có thể xóa các file trang tương ứng trong thư mục `src/views`.

### Xóa component không cần thiết

- Trong thư mục `packages/effects/common-ui/src/ui` của ứng dụng, bạn có thể xóa các component không cần thiết, như các thư mục `about`, `dashboard`, v.v. Trước khi xóa, hãy đảm bảo route của bạn không tham chiếu đến các component này.
