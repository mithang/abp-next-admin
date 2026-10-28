---
outline: deep
---

# Page Component trang thông thường

Cung cấp một component bố cục trang thông thường, gồm ba phần: đầu trang, vùng nội dung và chân trang.

::: info Lưu ý ban đầu

Component này là một component bố cục cơ bản. Nếu có thêm nhu cầu bố cục trang chung (ví dụ bố cục hai cột), bạn có thể tự đóng gói theo nhu cầu thực tế.

:::

## Cách dùng cơ bản

Chỉ cần dùng `Page` làm component gốc của trang nghiệp vụ của bạn là được.

### Props

| Tên thuộc tính | Mô tả | Kiểu | Giá trị mặc định | Ghi chú |
| --- | --- | --- | --- | --- |
| title | Tiêu đề trang | `string\|slot` | - | - |
| description | Mô tả trang (nội dung dưới tiêu đề) | `string\|slot` | - | - |
| contentClass | class của vùng nội dung | `string` | - | - |
| headerClass | class của vùng đầu trang | `string` | - | - |
| footerClass | class của vùng chân trang | `string` | - | - |
| autoContentHeight | Tự động điều chỉnh chiều cao vùng nội dung | `boolean` | `false` | - |

::: tip Lưu ý

Nếu cả ba `title`, `description`, `extra` đều không cung cấp nội dung hợp lệ (qua `props` hoặc `slots` đều được), thì vùng đầu trang sẽ không được render.

:::

### Slots

| Tên slot | Mô tả |
| ----------- | ------------ |
| default     | Nội dung trang     |
| title       | Tiêu đề trang     |
| description | Mô tả trang     |
| extra       | Phía phải đầu trang |
| footer      | Chân trang     |
