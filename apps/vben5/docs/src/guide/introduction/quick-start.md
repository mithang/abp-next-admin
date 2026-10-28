---
outline: deep
---

# Bắt đầu nhanh {#quick-start}

## Chuẩn bị trước

::: info Yêu cầu môi trường

Trước khi khởi động dự án, bạn cần đảm bảo môi trường của mình đáp ứng các yêu cầu sau:

- [Node.js](https://nodejs.org/en) phiên bản 20.15.0 trở lên, nên sử dụng [fnm](https://github.com/Schniz/fnm) , [nvm](https://github.com/nvm-sh/nvm) hoặc trực tiếp sử dụng [pnpm](https://pnpm.io/cli/env) để quản lý phiên bản.
- [Git](https://git-scm.com/) phiên bản bất kỳ.

Để kiểm tra môi trường của bạn có đáp ứng các yêu cầu trên hay không, bạn có thể xem phiên bản bằng các lệnh sau:

```bash
# Chỉ cần xuất hiện phiên bản node LTS tương ứng là được
node -v
# Chỉ cần xuất hiện phiên bản git tương ứng là được
git -v
```

:::

## Khởi động dự án

### Lấy mã nguồn

::: code-group

```sh [GitHub]
# clone mã nguồn
git clone https://github.com/vbenjs/vue-vben-admin.git
```

```sh [Gitee]
# clone mã nguồn
# Mã nguồn trên Gitee có thể không phải là mới nhất
git clone https://gitee.com/annsion/vue-vben-admin.git
```

:::

::: danger Lưu ý

Lưu ý thư mục chứa mã nguồn và tất cả các thư mục cha không được chứa tiếng Trung, tiếng Hàn, tiếng Nhật và khoảng trắng, nếu không sau khi cài đặt phụ thuộc sẽ bị lỗi khi khởi động.

:::

### Cài đặt phụ thuộc

Mở terminal trong thư mục mã nguồn của bạn và thực thi các lệnh sau:

```bash
# Vào thư mục dự án
cd vue-vben-admin

# Cài đặt phụ thuộc bằng phiên bản pnpm mà dự án chỉ định
npm i -g corepack

# Cài đặt phụ thuộc
pnpm install
```

::: tip Lưu ý

- Dự án chỉ hỗ trợ sử dụng `pnpm` để cài đặt phụ thuộc, mặc định sẽ sử dụng `corepack` để cài đặt phiên bản `pnpm` đã chỉ định.:
- Nếu môi trường mạng của bạn không thể truy cập nguồn npm, bạn có thể đặt biến môi trường hệ thống `COREPACK_NPM_REGISTRY=https://registry.npmmirror.com`, sau đó thực thi `pnpm install`.
- Nếu bạn không muốn sử dụng `corepack`, bạn cần vô hiệu hóa `corepack`, sau đó sử dụng `pnpm` của riêng bạn để cài đặt.

:::

### Chạy dự án

#### Chọn dự án

Thực thi lệnh sau để chạy dự án:

```bash
# Khởi động dự án
pnpm dev
```

Lúc này, bạn sẽ thấy đầu ra tương tự như sau, hãy chọn dự án bạn cần chạy:

```bash
│
◆  Select the app you need to run [dev]:
│  ● @vben/web-antd
│  ○ @vben/web-antdv-next
│  ○ @vben/web-ele
│  ○ @vben/web-naive
│  ○ @vben/docs
│  ● @vben/playground
└
```

Bây giờ, bạn có thể truy cập `http://localhost:5555` trên trình duyệt để xem dự án.

#### Chạy dự án chỉ định

Nếu bạn không muốn chọn dự án, bạn có thể trực tiếp chạy các lệnh sau để chạy ứng dụng bạn cần:

```bash
pnpm run dev:antd
pnpm run dev:ele
pnpm run dev:naive
pnpm run dev:docs
pnpm run dev:play
```
