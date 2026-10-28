---
outline: deep
---

# Vben Modal Hộp thoại modal

Component hộp thoại modal do framework cung cấp, hỗ trợ `kéo thả`, `toàn màn hình`, `chiều cao tự động`, `loading` và các tính năng khác.

> Nếu trong tài liệu không có mô tả tham số, bạn có thể thử tìm trong ví dụ trực tuyến

::: info Lưu ý trước

Nếu bạn cảm thấy cách đóng gói component hiện tại chưa lý tưởng, hoặc chưa hoàn toàn phù hợp với nhu cầu của bạn, bạn có thể trực tiếp dùng component gốc, hoặc tự đóng gói một component phù hợp. Các component do framework cung cấp không phải là ràng buộc, dùng hay không hoàn toàn tùy thuộc vào nhu cầu và sự tự do của bạn.

:::

::: tip README

Trong mã ví dụ bên dưới, có một số vấn đề về quốc tế hóa, màu chủ đề chưa được điều chỉnh, những vấn đề này chỉ xuất hiện trong tài liệu, khi sử dụng thực tế sẽ không có những vấn đề này, có thể bỏ qua, không cần băn khoăn.

:::

## Cách dùng cơ bản

Dùng `useVbenModal` để tạo hộp thoại modal cơ bản nhất.

<DemoPreview dir="demos/vben-modal/basic" />

## Tách component

Nội dung trong Modal thường trong nghiệp vụ sẽ khá phức tạp, vì vậy chúng ta có thể tách nội dung trong modal ra ngoài, cũng tiện tái sử dụng. Thông qua tham số `connectedComponent`, có thể kết nối component trong và ngoài, mà không cần bất kỳ thao tác nào khác.

<DemoPreview dir="demos/vben-modal/extra" />

## Bật kéo thả

Thông qua tham số `draggable`, có thể bật tính năng kéo thả.

<DemoPreview dir="demos/vben-modal/draggable" />

## Tự động tính chiều cao

Hộp thoại sẽ tự động tính chiều cao nội dung, vượt quá một chiều cao nhất định sẽ xuất hiện thanh cuộn, đồng thời kết hợp hiệu ứng `loading` và sử dụng khe `prepend-footer`.

<DemoPreview dir="demos/vben-modal/auto-height" />

## Dùng Api

Thông qua `modalApi` có thể gọi các phương thức của modal và dùng `setState` để cập nhật trạng thái của modal.

<DemoPreview dir="demos/vben-modal/dynamic" />

## Chia sẻ dữ liệu

Nếu bạn dùng tham số `connectedComponent`, thì component trong và ngoài sẽ chia sẻ dữ liệu, ví dụ một số thao tác điền lại form. Có thể dùng `modalApi` để lấy dữ liệu và đặt dữ liệu, kết hợp với `onOpenChange`, có thể đáp ứng hầu hết nhu cầu.

<DemoPreview dir="demos/vben-modal/shared-data" />

## Loại hiệu ứng

Thông qua thuộc tính `animationType` có thể điều khiển hiệu ứng hoạt hình của hộp thoại:

- `slide` (mặc định): trượt vào/thoát từ phía trên xuống
- `scale`: hiệu ứng phóng to/mờ dần vào/ra

<DemoPreview dir="demos/vben-modal/animation-type" />

::: info Chú ý

- Thứ tự ưu tiên xử lý tham số của component `VbenModal` là `slot` > `props` > `state` (trạng thái cập nhật qua api và tham số useVbenModal). Nếu bạn đã truyền `slot` hoặc `props`, thì `setState` sẽ không có hiệu lực, trong trường hợp này bạn có thể cập nhật trạng thái qua `slot` hoặc `props`.
- Nếu bạn dùng tham số `connectedComponent`, thì sẽ có 2 `useVbenModal`, lúc này, nếu đồng thời đặt cùng một tham số, thì lấy bên trong làm chuẩn (tức là mã không đặt connectedComponent). Ví dụ đồng thời đặt `onConfirm`, thì lấy `onConfirm` bên trong làm chuẩn. Sự kiện `onOpenChange` là ngoại lệ, cả trong và ngoài đều kích hoạt. Ngoài ra, nếu đặt `destroyOnClose`, Modal bên trong và các component con của nó sẽ bị <b>hủy hoàn toàn</b> sau khi bị đóng.
- Nếu hành vi mặc định của hộp thoại không phù hợp với kỳ vọng của bạn, có thể sửa tham số của `setDefaultModalProps` trong `src\bootstrap.ts` để đặt các thuộc tính mặc định, ví dụ mặc định ẩn nút toàn màn hình, sửa ZIndex mặc định, v.v.

:::

## API

```ts
// Modal là component hộp thoại
// modalApi là các phương thức của hộp thoại
const [Modal, modalApi] = useVbenModal({
  // Thuộc tính
  // Sự kiện
});
```

### Props

Tất cả thuộc tính đều có thể truyền vào tham số đầu tiên của `useVbenModal`.

| Tên thuộc tính | Mô tả | Kiểu | Giá trị mặc định |
| --- | --- | --- | --- |
| appendToMain | Có gắn vào vùng nội dung hay không (mặc định gắn vào body) | `boolean` | `false` |
| connectedComponent | Kết nối một component Modal khác | `Component` | - |
| destroyOnClose | Hủy khi đóng | `boolean` | `false` |
| title | Tiêu đề | `string\|slot` | - |
| titleTooltip | Thông tin gợi ý tiêu đề | `string\|slot` | - |
| description | Thông tin mô tả | `string\|slot` | - |
| isOpen | Trạng thái mở hộp thoại | `boolean` | `false` |
| loading | Trạng thái tải của hộp thoại | `boolean` | `false` |
| fullscreen | Hiển thị toàn màn hình | `boolean` | `false` |
| fullscreenButton | Hiển thị nút toàn màn hình | `boolean` | `true` |
| draggable | Có thể kéo thả | `boolean` | `false` |
| closable | Hiển thị nút đóng | `boolean` | `true` |
| centered | Hiển thị ở giữa | `boolean` | `false` |
| modal | Hiển thị lớp phủ | `boolean` | `true` |
| header | Hiển thị header | `boolean` | `true` |
| footer | Hiển thị footer | `boolean\|slot` | `true` |
| confirmDisabled | Vô hiệu hóa nút xác nhận | `boolean` | `false` |
| confirmLoading | Trạng thái loading của nút xác nhận | `boolean` | `false` |
| closeOnClickModal | Nhấn vào lớp phủ để đóng hộp thoại | `boolean` | `true` |
| closeOnPressEscape | Nhấn esc để đóng hộp thoại | `boolean` | `true` |
| confirmText | Văn bản nút xác nhận | `string\|slot` | `Xác nhận` |
| cancelText | Văn bản nút hủy | `string\|slot` | `Hủy` |
| showCancelButton | Hiển thị nút hủy | `boolean` | `true` |
| showConfirmButton | Hiển thị nút xác nhận | `boolean` | `true` |
| class | class của modal, chiều rộng cấu hình qua đây | `string` | - |
| contentClass | class của vùng nội dung modal | `string` | - |
| footerClass | class của vùng dưới modal | `string` | - |
| headerClass | class của vùng trên modal | `string` | - |
| bordered | Có hiển thị border hay không | `boolean` | `false` |
| zIndex | Mức ZIndex của hộp thoại | `number` | `1000` |
| overlayBlur | Độ mờ của lớp phủ | `number` | - |
| animationType | Loại hiệu ứng | `'slide' \| 'scale'` | `'slide'` |
| submitting | Đánh dấu đang gửi, khóa trạng thái hiện tại của hộp thoại | `boolean` | `false` |

::: info appendToMain

`appendToMain` có thể chỉ định gắn hộp thoại vào vùng nội dung, khi mở loại hộp thoại này, phần ngoài vùng nội dung (thanh tab, menu điều hướng, v.v.) sẽ không bị che. Mặc định, hộp thoại sẽ gắn vào body. Tuy nhiên: khi gắn vào vùng nội dung, component `Page` đóng vai trò là vùng chứa gốc của trang, cần đặt thuộc tính `auto-content-height`, để hộp thoại có thể tính chiều cao chính xác.

:::

### Event

Các sự kiện sau chỉ có hiệu lực khi được truyền vào trong `useVbenModal({onCancel:()=>{}})` .

| Tên sự kiện | Mô tả | Kiểu | Phiên bản |
| --- | --- | --- | --- |
| onBeforeClose | Kích hoạt trước khi đóng, trả về `false` hoặc bị `reject` thì cấm đóng | `()=>Promise<boolean>\|boolean` | >5.5.2 hỗ trợ Promise |
| onCancel | Kích hoạt khi nhấn nút hủy | `()=>void` |  |
| onClosed | Kích hoạt khi hiệu ứng đóng phát xong | `()=>void` | >5.4.3 |
| onConfirm | Kích hoạt khi nhấn nút xác nhận | `()=>void` |  |
| onOpenChange | Kích hoạt khi đóng hoặc mở hộp thoại | `(isOpen:boolean)=>void` |  |
| onOpened | Kích hoạt khi hiệu ứng mở phát xong | `()=>void` | >5.4.3 |

### Slots

Ngoài các kiểu thuộc tính chứa `slot` ở trên, còn có thể tùy chỉnh nội dung hộp thoại qua khe.

| Tên khe         | Mô tả                                               |
| -------------- | -------------------------------------------------- |
| default        | Khe mặc định - nội dung hộp thoại                                |
| prepend-footer | Bên trái nút hủy                                       |
| center-footer  | Giữa nút hủy và nút xác nhận (chỉ có hiệu lực khi không dùng khe footer) |
| append-footer  | Bên phải nút xác nhận                                       |

### modalApi

| Phương thức | Mô tả | Kiểu | Phiên bản |
| --- | --- | --- | --- |
| setState | Đặt động các thuộc tính trạng thái hộp thoại | `(((prev: ModalState) => Partial<ModalState>)\| Partial<ModalState>)=>modalApi` | - |
| open | Mở hộp thoại | `()=>void` | - |
| close | Đóng hộp thoại | `()=>void` | - |
| setData | Đặt dữ liệu chia sẻ | `<T>(data:T)=>modalApi` | - |
| getData | Lấy dữ liệu chia sẻ | `<T>()=>T` | - |
| useStore | Lấy trạng thái có thể phản ứng | - | - |
| lock | Đánh dấu hộp thoại đang gửi, khóa trạng thái hiện tại | `(isLock:boolean)=>modalApi` | >5.5.2 |
| unlock | Thao tác ngược của phương thức lock, hủy trạng thái khóa của hộp thoại, cũng là bí danh của lock(false) | `()=>modalApi` | >5.5.3 |

::: info lock

Phương thức `lock` dùng để khóa trạng thái hiện tại của hộp thoại, thường dùng trong quá trình gửi dữ liệu để ngăn người dùng gửi trùng lặp hoặc hộp thoại bị đóng ngoài ý muốn, dữ liệu form bị thay đổi, v.v. Khi ở trạng thái khóa, nút xác nhận của hộp thoại sẽ chuyển thành trạng thái loading, đồng thời vô hiệu hóa nút hủy và nút đóng, cấm đóng hộp thoại bằng ESC hoặc nhấn vào lớp phủ, bật hiệu ứng spinner của hộp thoại để che nội dung hộp thoại. Khi gọi phương thức `close` để đóng hộp thoại đang ở trạng thái khóa, sẽ tự động mở khóa. Để chủ động hủy trạng thái này, có thể gọi phương thức `unlock` hoặc gọi lại phương thức lock và truyền tham số false.

:::
