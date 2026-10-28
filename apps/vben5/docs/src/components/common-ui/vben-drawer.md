---
outline: deep
---

# Vben Drawer Ngăn kéo

Component ngăn kéo do framework cung cấp, hỗ trợ `chiều cao tự động`, `loading` và các tính năng khác.

> Nếu trong tài liệu không có mô tả tham số, bạn có thể thử tìm trong ví dụ trực tuyến

::: info Lưu ý trước

Nếu bạn cảm thấy cách đóng gói của component hiện tại chưa đủ tốt, hoặc chưa hoàn toàn đáp ứng nhu cầu của bạn, bạn hoàn toàn có thể trực tiếp sử dụng component gốc, hoặc tự đóng gói một component phù hợp. Các component do framework cung cấp không phải là ràng buộc, dùng hay không hoàn toàn tùy thuộc vào nhu cầu và sự tự do của bạn.

:::

::: tip README

Trong code ví dụ bên dưới tồn tại một số vấn đề chưa thích ứng i18n và màu chủ đề; những vấn đề này chỉ xuất hiện trong tài liệu, khi sử dụng thực tế sẽ không có, có thể bỏ qua, không cần bận tâm.

:::

## Cách dùng cơ bản

Sử dụng `useVbenDrawer` để tạo ngăn kéo cơ bản nhất.

<DemoPreview dir="demos/vben-drawer/basic" />

## Tách component

Nội dung bên trong Drawer trong nghiệp vụ thông thường sẽ khá phức tạp, vì vậy chúng ta có thể tách nội dung bên trong drawer ra ngoài, cũng tiện cho việc tái sử dụng. Thông qua tham số `connectedComponent`, có thể kết nối component bên trong và bên ngoài mà không cần bất kỳ thao tác nào khác.

<DemoPreview dir="demos/vben-drawer/extra" />

## Tự động tính chiều cao

Cửa sổ bật lên sẽ tự động tính chiều cao nội dung, khi vượt quá một chiều cao nhất định sẽ xuất hiện thanh cuộn, đồng thời kết hợp hiệu ứng `loading` và sử dụng slot `prepend-footer`.

<DemoPreview dir="demos/vben-drawer/auto-height" />

## Sử dụng Api

Thông qua `drawerApi` có thể gọi các phương thức của drawer và sử dụng `setState` để cập nhật trạng thái của drawer.

<DemoPreview dir="demos/vben-drawer/dynamic" />

## Chia sẻ dữ liệu

Nếu bạn đã sử dụng tham số `connectedComponent`, thì component bên trong và bên ngoài sẽ chia sẻ dữ liệu, ví dụ như một số thao tác điền lại form. Có thể dùng `drawerApi` để lấy dữ liệu và đặt dữ liệu, kết hợp với `onOpenChange`, có thể đáp ứng phần lớn nhu cầu.

<DemoPreview dir="demos/vben-drawer/shared-data" />

::: info Chú ý

- `VbenDrawer` xử lý tham số theo thứ tự ưu tiên `slot` > `props` > `state` (trạng thái cập nhật qua api và tham số useVbenDrawer). Nếu bạn đã truyền `slot` hoặc `props`, thì `setState` sẽ không có hiệu lực, trong trường hợp này bạn có thể cập nhật trạng thái qua `slot` hoặc `props`.
- Nếu bạn sử dụng tham số `connectedComponent`, thì sẽ tồn tại 2 `useVbenDrawer`, lúc này, nếu đồng thời đặt cùng một tham số, thì sẽ lấy bên trong làm chuẩn (tức là code không đặt connectedComponent). Ví dụ đồng thời đặt `onConfirm`, thì sẽ lấy `onConfirm` bên trong làm chuẩn. Ngoại trừ sự kiện `onOpenChange`, cả trong và ngoài đều sẽ kích hoạt.
- Khi sử dụng tham số `connectedComponent`, có thể cấu hình thuộc tính `destroyOnClose` để quyết định khi đóng cửa sổ bật lên, có hủy `connectedComponent` hay không (tạo lại `connectedComponent`, điều này sẽ khôi phục tất cả biến, trạng thái, dữ liệu bên trong nó về trạng thái ban đầu).
- Nếu hành vi mặc định của ngăn kéo không phù hợp với kỳ vọng của bạn, bạn có thể sửa tham số `setDefaultDrawerProps` trong `src\bootstrap.ts` để đặt các thuộc tính mặc định, ví dụ mặc định ẩn nút toàn màn hình, sửa ZIndex mặc định, v.v.

:::

## API

```ts
// Drawer là component cửa sổ bật lên
// drawerApi là các phương thức của cửa sổ bật lên
const [Drawer, drawerApi] = useVbenDrawer({
  // Thuộc tính
  // Sự kiện
});
```

### Props

Tất cả thuộc tính đều có thể truyền vào tham số đầu tiên của `useVbenDrawer`.

| Tên thuộc tính | Mô tả | Kiểu | Giá trị mặc định |
| --- | --- | --- | --- |
| appendToMain | Có gắn vào khu vực nội dung hay không (mặc định gắn vào body) | `boolean` | `false` |
| connectedComponent | Kết nối một component Drawer khác | `Component` | - |
| destroyOnClose | Hủy khi đóng | `boolean` | `false` |
| title | Tiêu đề | `string\|slot` | - |
| titleTooltip | Thông tin gợi ý tiêu đề | `string\|slot` | - |
| description | Thông tin mô tả | `string\|slot` | - |
| isOpen | Trạng thái mở cửa sổ bật lên | `boolean` | `false` |
| loading | Trạng thái tải cửa sổ bật lên | `boolean` | `false` |
| closable | Hiển thị nút đóng | `boolean` | `true` |
| closeIconPlacement | Vị trí nút đóng | `'left'\|'right'` | `right` |
| modal | Hiển thị lớp phủ | `boolean` | `true` |
| header | Hiển thị header | `boolean` | `true` |
| footer | Hiển thị footer | `boolean\|slot` | `true` |
| confirmLoading | Trạng thái loading của nút xác nhận | `boolean` | `false` |
| closeOnClickModal | Nhấp vào lớp phủ để đóng cửa sổ bật lên | `boolean` | `true` |
| closeOnPressEscape | Đóng cửa sổ bật lên bằng phím esc | `boolean` | `true` |
| confirmText | Văn bản nút xác nhận | `string\|slot` | `Xác nhận` |
| cancelText | Văn bản nút hủy | `string\|slot` | `Hủy` |
| placement | Vị trí bật ra của ngăn kéo | `'left'\|'right'\|'top'\|'bottom'` | `right` |
| showCancelButton | Hiển thị nút hủy | `boolean` | `true` |
| showConfirmButton | Hiển thị nút xác nhận | `boolean` | `true` |
| class | class của modal, chiều rộng được cấu hình qua đây | `string` | - |
| contentClass | class của khu vực nội dung modal | `string` | - |
| footerClass | class của khu vực dưới cùng modal | `string` | - |
| headerClass | class của khu vực trên cùng modal | `string` | - |
| zIndex | Cấp ZIndex của ngăn kéo | `number` | `1000` |
| overlayBlur | Độ mờ của lớp phủ | `number` | - |

::: info appendToMain

`appendToMain` có thể chỉ định gắn ngăn kéo vào khu vực nội dung, khi mở ngăn kéo, phần ngoài khu vực nội dung (thanh tab, menu điều hướng, v.v.) sẽ không bị che. Theo mặc định, ngăn kéo sẽ được gắn vào body. Tuy nhiên: khi gắn vào khu vực nội dung, component `Page` đóng vai trò là container gốc của trang cần đặt thuộc tính `auto-content-height` để ngăn kéo có thể tính chiều cao chính xác.

:::

### Event

Các sự kiện sau đây chỉ có hiệu lực khi được truyền vào trong `useVbenDrawer({onCancel:()=>{}})`.

| Tên sự kiện | Mô tả | Kiểu | Giới hạn phiên bản |
| --- | --- | --- | --- |
| onBeforeClose | Kích hoạt trước khi đóng, trả về `false` thì cấm đóng | `()=>boolean` | --- |
| onCancel | Kích hoạt khi nhấp nút hủy | `()=>void` | --- |
| onClosed | Kích hoạt khi animation đóng phát xong | `()=>void` | >5.5.2 |
| onConfirm | Kích hoạt khi nhấp nút xác nhận | `()=>void` | --- |
| onOpenChange | Kích hoạt khi đóng hoặc mở cửa sổ bật lên | `(isOpen:boolean)=>void` | --- |
| onOpened | Kích hoạt khi animation mở phát xong | `()=>void` | >5.5.2 |

### Slots

Ngoài các thuộc tính có kiểu chứa `slot` ở trên, còn có thể tùy chỉnh nội dung của cửa sổ bật lên thông qua slot.

| Tên slot       | Mô tả                                               |
| -------------- | -------------------------------------------------- |
| default        | Slot mặc định - nội dung cửa sổ bật lên            |
| prepend-footer | Bên trái nút hủy                                   |
| center-footer  | Giữa nút hủy và nút xác nhận (chỉ có hiệu lực khi không dùng slot footer) |
| append-footer  | Bên phải nút xác nhận                              |
| close-icon     | Icon nút đóng                                      |
| extra          | Nội dung thêm (bên phải tiêu đề)                  |

### drawerApi

| Phương thức | Mô tả | Kiểu | Giới hạn phiên bản |
| --- | --- | --- | --- |
| setState | Đặt động thuộc tính trạng thái cửa sổ bật lên | `(((prev: ModalState) => Partial<ModalState>)\| Partial<ModalState>)=>drawerApi` |
| open | Mở cửa sổ bật lên | `()=>void` | --- |
| close | Đóng cửa sổ bật lên | `()=>void` | --- |
| setData | Đặt dữ liệu chia sẻ | `<T>(data:T)=>drawerApi` | --- |
| getData | Lấy dữ liệu chia sẻ | `<T>()=>T` | --- |
| useStore | Lấy trạng thái có thể phản ứng | - | --- |
| lock | Đánh dấu ngăn kéo đang gửi, khóa trạng thái hiện tại | `(isLock:boolean)=>drawerApi` | >5.5.3 |
| unlock | Thao tác ngược của phương thức lock, hủy trạng thái khóa của ngăn kéo, cũng là bí danh của lock(false) | `()=>drawerApi` | >5.5.3 |

::: info lock

Phương thức `lock` dùng để khóa trạng thái của ngăn kéo, thường dùng trong quá trình gửi dữ liệu để ngăn người dùng gửi trùng lặp, hoặc ngăn ngăn kéo bị đóng ngoài ý muốn, dữ liệu form bị thay đổi, v.v. Khi ở trạng thái khóa, nút xác nhận của ngăn kéo sẽ chuyển sang trạng thái loading, đồng thời vô hiệu hóa nút hủy và nút đóng, cấm đóng ngăn kéo bằng ESC hoặc nhấp vào lớp phủ, bật animation spinner của ngăn kéo để che nội dung cửa sổ bật lên. Khi gọi phương thức `close` để đóng ngăn kéo đang ở trạng thái khóa, nó sẽ tự động mở khóa. Để chủ động hủy trạng thái này, có thể gọi phương thức `unlock` hoặc gọi lại phương thức lock và truyền tham số false.

:::
