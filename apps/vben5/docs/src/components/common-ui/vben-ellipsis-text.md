---
outline: deep
---

# Vben EllipsisText Văn bản rút gọn

Component hiển thị văn bản do framework cung cấp, có thể cấu hình rút gọn khi quá dài, gợi ý tooltip, mở rộng/thu gọn và nhiều chức năng khác.

> Nếu trong tài liệu không có mô tả tham số, có thể thử tìm trong ví dụ trực tuyến

## Cách dùng cơ bản

Đặt nội dung văn bản qua slot mặc định, thuộc tính `maxWidth` đặt chiều rộng tối đa.

<DemoPreview dir="demos/vben-ellipsis-text/line" />

## Khối văn bản có thể thu gọn

Đặt số dòng sau khi thu gọn qua `line`, thuộc tính `expand` đặt có hỗ trợ mở rộng/thu gọn hay không.

<DemoPreview dir="demos/vben-ellipsis-text/expand" />

## Tùy chỉnh lớp nổi gợi ý

Tùy chỉnh thông tin gợi ý qua slot tên `tooltip`.

<DemoPreview dir="demos/vben-ellipsis-text/tooltip" />

## Tự động hiển thị tooltip

Đặt qua `tooltip-when-ellipsis`, chỉ kích hoạt tooltip khi độ dài văn bản vượt quá gây xuất hiện dấu ba chấm.

<DemoPreview dir="demos/vben-ellipsis-text/auto-display" />

## API

### Props

| Tên thuộc tính | Mô tả | Kiểu | Giá trị mặc định |
| --- | --- | --- | --- |
| expand | Hỗ trợ nhấp để mở rộng hoặc thu gọn | `boolean` | `false` |
| line | Số dòng tối đa của văn bản | `number` | `1` |
| maxWidth | Chiều rộng tối đa của vùng văn bản | `number \| string` | `'100%'` |
| placement | Vị trí của lớp nổi gợi ý | `'bottom'\|'left'\|'right'\|'top'` | `'top'` |
| tooltip | Bật gợi ý văn bản | `boolean` | `true` |
| tooltipWhenEllipsis | Nội dung vượt quá, tự động bật gợi ý văn bản | `boolean` | `false` |
| ellipsisThreshold | Chỉ có hiệu lực sau khi đặt tooltipWhenEllipsis, ngưỡng chênh lệch pixel phát hiện cắt ngắn văn bản, càng lớn thì phán đoán càng chặt chẽ, nếu gặp trường hợp bất thường có thể tự đặt ngưỡng | `number` | `3` |
| tooltipBackgroundColor | Màu nền của văn bản gợi ý | `string` | - |
| tooltipColor | Màu của văn bản gợi ý | `string` | - |
| tooltipFontSize | Cỡ của văn bản gợi ý | `string` | - |
| tooltipMaxWidth | Chiều rộng tối đa của lớp nổi gợi ý. Nếu không đặt thì giữ bằng chiều rộng văn bản | `number` | - |
| tooltipOverlayStyle | Kiểu vùng nội dung của hộp gợi ý | `CSSProperties` | `{ textAlign: 'justify' }` |

### Events

| Tên sự kiện       | Mô tả         | Kiểu                       |
| ------------ | ------------ | -------------------------- |
| expandChange | Trạng thái mở rộng thay đổi | `(isExpand:boolean)=>void` |

### Slots

| Tên slot  | Mô tả                             |
| ------- | -------------------------------- |
| tooltip | Khi bật gợi ý văn bản, dùng để tùy chỉnh nội dung gợi ý |
