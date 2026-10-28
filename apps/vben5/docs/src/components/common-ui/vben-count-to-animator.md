---
outline: deep
---

# Vben CountToAnimator Hoạt ảnh số

Component hoạt ảnh số do framework cung cấp, hỗ trợ hiệu ứng hoạt ảnh số.

> Nếu trong tài liệu không có phần mô tả tham số, bạn có thể thử tìm trong ví dụ trực tuyến

::: info Lời nói đầu

Nếu bạn cảm thấy cách đóng gói component hiện tại chưa đủ tốt, hoặc chưa hoàn toàn phù hợp với nhu cầu của mình, bạn hoàn toàn có thể dùng trực tiếp component gốc, hoặc tự tay đóng gói một component phù hợp. Các component do framework cung cấp không phải là ràng buộc, dùng hay không hoàn toàn tùy thuộc vào nhu cầu và sự tự do của bạn.

:::

## Cách dùng cơ bản

Thông qua `start-val` và `end-val` để đặt giá trị bắt đầu và giá trị kết thúc của hoạt ảnh số, thời lượng `3000`ms.

<DemoPreview dir="demos/vben-count-to-animator/basic" />

## Tiền tố và dấu phân cách tùy chỉnh

Thông qua `prefix` và `separator` để đặt tiền tố và dấu phân cách của hoạt ảnh số.

<DemoPreview dir="demos/vben-count-to-animator/custom" />

### Props

| Tên thuộc tính     | Mô tả           | Kiểu      | Giá trị mặc định   |
| ---------- | -------------- | --------- | -------- |
| startVal   | Giá trị bắt đầu         | `number`  | `0`      |
| endVal     | Giá trị kết thúc         | `number`  | `2021`   |
| duration   | Thời lượng hoạt ảnh   | `number`  | `1500`   |
| autoplay   | Tự động thực thi       | `boolean` | `true`   |
| prefix     | Tiền tố           | `string`  | -        |
| suffix     | Hậu tố           | `string`  | -        |
| separator  | Dấu phân cách         | `string`  | `,`      |
| color      | Màu chữ       | `string`  | -        |
| useEasing  | Có bật hoạt ảnh hay không   | `boolean` | `true`   |
| transition | Hiệu ứng hoạt ảnh       | `string`  | `linear` |
| decimals   | Số chữ số thập phân giữ lại | `number`  | `0`      |

### Events

| Tên sự kiện         | Mô tả           | Kiểu           |
| -------------- | -------------- | -------------- |
| started        | Hoạt ảnh đã bắt đầu     | `()=>void`     |
| finished       | Hoạt ảnh đã kết thúc     | `()=>void`     |
| ~~onStarted~~  | ~~Hoạt ảnh đã bắt đầu~~ | ~~`()=>void`~~ |
| ~~onFinished~~ | ~~Hoạt ảnh đã kết thúc~~ | ~~`()=>void`~~ |

### Methods

| Tên phương thức | Mô tả         | Kiểu       |
| ------ | ------------ | ---------- |
| start  | Bắt đầu thực thi hoạt ảnh | `()=>void` |
| reset  | Đặt lại         | `()=>void` |
