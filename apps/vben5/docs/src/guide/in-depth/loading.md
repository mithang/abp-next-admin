# Loading toàn cục

Loading toàn cục là hiệu ứng tải xuất hiện khi làm mới trang, thường là một biểu tượng xoay tròn:

![Global loading spinner](/guide/loading.png)

## Nguyên lý

Được thực hiện bởi plugin `vite-plugin-inject-app-loading`, plugin sẽ chèn một `loading html` toàn cục vào mỗi ứng dụng.

## Tắt

Nếu bạn không cần loading toàn cục, có thể tắt trong file `.env`:

```bash
VITE_INJECT_APP_LOADING=false
```

## Tùy chỉnh

Nếu bạn muốn tùy chỉnh loading toàn cục, có thể tạo một file `loading.html` trong thư mục ứng dụng, ngang cấp với `index.html`, plugin sẽ tự đọc và chèn. Html này có thể tự định nghĩa kiểu dáng và hiệu ứng.

::: tip

- Bạn có thể dùng cú pháp giống `index.html`, ví dụ biến `VITE_APP_TITLE`, để lấy tiêu đề của ứng dụng.
- Phải đảm bảo có một phần tử `id="__app-loading__"`.
- Thêm một class `hidden` cho phần tử `id="__app-loading__"`.
- Phải đảm bảo có một phần tử `style[data-app-loading="inject-css"]`.

```html{1,4}
<style data-app-loading="inject-css">
  #__app-loading__.hidden {
    pointer-events: none;
    visibility: hidden;
    opacity: 0;
    transition: all 1s ease-out;
  }
  /* ... */
</style>
<div id="__app-loading__">
  <!-- ... -->
  <div class="title"><%= VITE_APP_TITLE %></div>
</div>
```

:::
