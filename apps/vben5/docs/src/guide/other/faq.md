# Câu hỏi thường gặp #{faq}

::: tip Liệt kê một số câu hỏi thường gặp

Nếu có vấn đề, bạn có thể tìm ở đây trước, nếu không có thì có thể tìm kiếm hoặc gửi vấn đề của bạn tại [GitHub Issue](https://github.com/vbenjs/vue-vben-admin/issues), nếu là vấn đề mang tính thảo luận thì có thể tại [GitHub Discussions](https://github.com/vbenjs/vue-vben-admin/discussions)

:::

## Hướng dẫn

Khi gặp vấn đề, bạn có thể tra cứu từ các khía cạnh sau trước

1. Tìm kiếm trong [issue](https://github.com/vbenjs/vue-vben-admin/issues) của kho GitHub của mô-đun tương ứng
2. Tìm kiếm vấn đề từ [google](https://www.google.com)
3. Tìm kiếm vấn đề từ [Baidu](https://www.baidu.com)
4. Nếu không tìm thấy vấn đề trong danh sách dưới đây, bạn có thể đặt câu hỏi tại issue [issues](https://github.com/vbenjs/vue-vben-admin/issues)
5. Nếu không phải dạng vấn đề mà cần thảo luận, hãy đến [discussions](https://github.com/vbenjs/vue-vben-admin/discussions) để thảo luận

## Vấn đề về dependency

Trong dự án `Monorepo`, cần tạo thói quen mỗi lần `git pull` code đều chạy `pnpm install`, vì thường xuyên có package dependency mới được thêm vào, dự án đã cấu hình tự động chạy `pnpm install` trong `lefthook.yml`, nhưng đôi khi sẽ xảy ra vấn đề, nếu không tự động chạy thì nên chạy thủ công một lần.

## Về vấn đề cập nhật bộ nhớ đệm

Cấu hình dự án mặc định được lưu trong bộ nhớ đệm `localStorage`, vì vậy sau khi cập nhật phiên bản có thể một số cấu hình chưa thay đổi.

Cách giải quyết là mỗi lần cập nhật code thì sửa số phiên bản `version` trong `package.json`. Vì key của localStorage dựa theo số phiên bản. Vì vậy sau khi cập nhật, phiên bản khác nhau thì cấu hình trước đó sẽ mất hiệu lực. Chỉ cần đăng nhập lại là được

## Về vấn đề sửa file cấu hình

Khi sửa các file môi trường như `.env` và file `vite.config.ts`, vite sẽ tự động khởi động lại dịch vụ.

Tự động khởi động lại có khả năng xảy ra vấn đề, hãy chạy lại dự án là giải quyết được.

## Chạy local báo lỗi

Vì vite không chuyển đổi code ở local, và code có dùng các cú pháp tương đối mới như optional chaining. Vì vậy phát triển local cần dùng trình duyệt phiên bản cao hơn (`Chrome 90+`)

## Sau khi chuyển trang thì trang trống

Điều này là do đã bật animation chuyển route, và component trang tương ứng tồn tại nhiều nút gốc, chỉ cần thêm `<div></div>` ở lớp ngoài cùng của trang là được

**Ví dụ sai**

```vue
<template>
  <!-- Chú thích cũng tính là một nút -->
  <h1>text h1</h1>
  <h2>text h2</h2>
</template>
```

**Ví dụ đúng**

```vue
<template>
  <div>
    <h1>text h1</h1>
    <h2>text h2</h2>
  </div>
</template>
```

::: tip Gợi ý

- Nếu muốn dùng nhiều thẻ gốc, có thể tắt animation chuyển route
- Nút chú thích gốc dưới template cũng tính là một nút

:::

## Code của tôi chạy local được, đóng gói thì không được

Hiện tại phát hiện nguyên nhân này có thể là các nguyên nhân sau, có thể kiểm tra từ các nguyên nhân sau, nếu còn khả năng khác, hoan nghênh bổ sung

- Đã dùng biến ctx, bản thân ctx chưa được expose trong kiểu instance, phía Vue chính thức cũng nói không nên dùng thuộc tính này. Thuộc tính này chỉ dùng cho nội bộ.

```ts
import { getCurrentInstance } from 'vue';
getCurrentInstance().ctx.xxxx;
```

## Vấn đề cài đặt dependency

- Nếu không cài được dependency hoặc khởi động báo lỗi, có thể thử chạy `pnpm run reinstall`.
- Nếu không cài được dependency hoặc báo lỗi, có thể thử chuyển sang điểm phát sóng điện thoại để cài dependency.
- Nếu vẫn không được, có thể tự cấu hình mirror trong nước để cài đặt.
- Cũng có thể tạo file `.npmrc` ở thư mục gốc dự án, nội dung như sau

```bash
# .npmrc
registry = https://registry.npmmirror.com/
```

## File đóng gói quá lớn

- Trước hết, bản đầy đủ do tham chiếu khá nhiều file thư viện nên đóng gói sẽ tương đối lớn. Có thể dùng bản tinh gọn để phát triển

- Tiếp theo nên bật gzip, sau khi dùng dung lượng sẽ chỉ còn khoảng 1/3 so với ban đầu. gzip có thể do máy chủ bật trực tiếp. Nếu vậy, frontend không cần build file định dạng `.gz`, nếu frontend đã build file `.gz`, lấy nginx làm ví dụ, nginx cần bật tùy chọn `gzip_static: on`.

- Đồng thời với việc bật gzip còn có thể bật thêm `brotli`, nén tốt hơn gzip. Cả hai có thể cùng tồn tại

**Lưu ý**

- gzip_static: mô-đun này cần nginx cài đặt thêm, nginx mặc định chưa cài mô-đun này.

- Bật `brotli` cũng cần nginx cài đặt thêm mô-đun

## Lỗi khi chạy

Nếu xuất hiện lỗi tương tự dưới đây, hãy kiểm tra toàn bộ đường dẫn dự án (bao gồm mọi đường dẫn cha) không được xuất hiện tiếng Trung, tiếng Nhật, tiếng Hàn. Nếu không sẽ xuất hiện lỗi truy cập đường dẫn 404 gây ra vấn đề dưới đây

```ts
[vite] Failed to resolve module import "ant-design-vue/dist/antd.css-vben-adminode_modulesant-design-vuedistantd.css". (imported by /@/setup/ant-design-vue/index.ts)
```

## Vấn đề cảnh báo route trên console

Nếu thấy console có cảnh báo như sau, và trang **có thể mở bình thường** thì có thể bỏ qua cảnh báo này.

Về sau `vue-router` có thể cung cấp tùy chọn cấu hình để tắt cảnh báo

```ts
[Vue Router warn]: No match found for location with path "xxxx"
```

## Khởi động báo lỗi

Khi xuất hiện thông báo lỗi dưới đây, hãy kiểm tra số phiên bản nodejs của bạn có đáp ứng yêu cầu hay không

```bash
TypeError: str.matchAll is not a function
at Object.extractor (vue-vben-admin-main\node_modules@purge-icons\core\dist\index.js:146:27)
at Extract (vue-vben-admin-main\node_modules@purge-icons\core\dist\index.js:173:54)
```

## Triển khai nginx

Sau khi triển khai lên `nginx`, có thể xuất hiện lỗi sau:

```bash
Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "application/octet-stream". Strict MIME type checking is enforced for module scripts per HTML spec.
```

Cách giải quyết 1:

```bash
http {
    #Nếu có cấu hình này thì cần chú thích lại
    #include       mime.types;

    types {
      application/javascript js mjs;
    }
}
```

Cách giải quyết 2:

Vào file `mime.types` dưới `nginx`, đổi `application/javascript js;` thành `application/javascript js mjs;`
