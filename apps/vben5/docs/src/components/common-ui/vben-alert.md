---
outline: deep
---

# Vben Alert hộp nhắc nhẹ

Một số hộp thoại nhắc nhẹ do framework cung cấp, chỉ cần dùng mã js là có thể nhanh chóng tạo nhắc một cách động mà không cần viết bất kỳ mã nào trong template.

::: info Kịch bản ứng dụng

Chức năng mà Alert cung cấp tương tự như Modal, nhưng chỉ phù hợp với các kịch bản ứng dụng đơn giản. Ví dụ như tạm thời, tự động bật hộp thoại xác nhận dạng modal, hộp nhập liệu, v.v. Nếu có nhu cầu phức tạp hơn về hộp thoại, vui lòng sử dụng VbenModal

:::

::: tip Lưu ý

Các hộp thoại được tạo động bằng các phương thức nhanh alert, confirm, prompt mà Alert cung cấp, trong trường hợp đã mở, không hỗ trợ HMR (cập nhật nóng), sau khi thay đổi mã cần đóng các hộp thoại này rồi mở lại.

:::

::: tip README

Trong mã ví dụ bên dưới, tồn tại một số vấn đề về màu chủ đề chưa được điều chỉnh, thiếu kiểu dáng, những vấn đề này chỉ xuất hiện trong tài liệu, khi sử dụng thực tế sẽ không có những vấn đề này, có thể bỏ qua, không cần bận tâm.

:::

## Cách dùng cơ bản

Dùng `alert` để tạo hộp nhắc chỉ có một nút xác nhận.

<DemoPreview dir="demos/vben-alert/alert" />

Dùng `confirm` để tạo hộp nhắc có nút xác nhận và nút hủy.

<DemoPreview dir="demos/vben-alert/confirm" />

Dùng `prompt` để tạo hộp nhắc có nút xác nhận và nút hủy, nhận dữ liệu người dùng nhập vào.

<DemoPreview dir="demos/vben-alert/prompt" />

## useAlertContext

Khi content, footer, icon của hộp thoại sử dụng component tùy chỉnh, trong các component này có thể dùng `useAlertContext` để lấy đối tượng ngữ cảnh của hộp thoại hiện tại, dùng để chủ động điều khiển hộp thoại.

::: tip Lưu ý

`useAlertContext` chỉ có thể dùng trong setup hoặc component hàm.

:::

### Methods

| Phương thức | Mô tả              | Kiểu     | Yêu cầu phiên bản |
| --------- | ------------------ | -------- | -------- |
| doConfirm | Gọi thao tác xác nhận của hộp thoại | ()=>void | >5.5.4   |
| doCancel  | Gọi thao tác hủy của hộp thoại | ()=>void | >5.5.4   |

## Mô tả kiểu

```ts
/** Kiểu biểu tượng đặt sẵn */
export type IconType = 'error' | 'info' | 'question' | 'success' | 'warning';

export type BeforeCloseScope = {
  /** Có phải là đóng do nhấn nút xác nhận hay không */
  isConfirm: boolean;
};

/**
 * Thuộc tính alert
 */
export type AlertProps = {
  /** Callback trước khi đóng, nếu trả về false thì hủy việc đóng */
  beforeClose?: (
    scope: BeforeCloseScope,
  ) => boolean | Promise<boolean | undefined> | undefined;
  /** Viền */
  bordered?: boolean;
  /** Cách căn chỉnh nút */
  buttonAlign?: 'center' | 'end' | 'start';
  /** Tiêu đề của nút hủy */
  cancelText?: string;
  /** Có hiển thị ở giữa hay không */
  centered?: boolean;
  /** Tiêu đề của nút xác nhận */
  confirmText?: string;
  /** Kiểu bổ sung của vùng chứa hộp thoại */
  containerClass?: string;
  /** Nội dung nhắc của hộp thoại */
  content: Component | string;
  /** Kiểu bổ sung của nội dung hộp thoại */
  contentClass?: string;
  /** Trong thời gian thực thi callback beforeClose, hiển thị một lớp phủ loading trong vùng nội dung */
  contentMasking?: boolean;
  /** Nội dung cuối hộp thoại (nằm cùng vùng chứa với các nút) */
  footer?: Component | string;
  /** Biểu tượng của hộp thoại (ở phía trước tiêu đề) */
  icon?: Component | IconType;
  /**
   * Hiệu ứng làm mờ lớp phủ hộp thoại
   */
  overlayBlur?: number;
  /** Có hiển thị nút hủy hay không */
  showCancel?: boolean;
  /** Tiêu đề hộp thoại */
  title?: string;
};

/** Thuộc tính prompt */
export type PromptProps<T = any> = {
  /** Callback trước khi đóng, nếu trả về false thì hủy việc đóng */
  beforeClose?: (scope: {
    isConfirm: boolean;
    value: T | undefined;
  }) => boolean | Promise<boolean | undefined> | undefined;
  /** Component dùng để nhận dữ liệu người dùng nhập */
  component?: Component;
  /** Thuộc tính của component nhập liệu */
  componentProps?: Recordable<any>;
  /** Slot của component nhập liệu */
  componentSlots?: Recordable<Component>;
  /** Giá trị mặc định */
  defaultValue?: T;
  /** Tên thuộc tính giá trị của component nhập liệu */
  modelPropName?: string;
} & Omit<AlertProps, 'beforeClose'>;

/**
 * Chữ ký hàm
 * Chữ ký hàm của alert và confirm giống nhau.
 * confirm mặc định sẽ hiển thị nút hủy, còn alert mặc định chỉ có một nút
 *  */
export function alert(options: AlertProps): Promise<void>;
export function alert(
  message: string,
  options?: Partial<AlertProps>,
): Promise<void>;
export function alert(
  message: string,
  title?: string,
  options?: Partial<AlertProps>,
): Promise<void>;

/**
 * Chữ ký hàm của hộp nhập liệu bật lên.
 * Tham số của beforeClose sẽ nhận giá trị người dùng đang nhập
 * component chỉ định component nhận dữ liệu người dùng nhập, mặc định là Input
 * componentProps là dữ liệu thuộc tính được đặt cho component nhập liệu
 * defaultValue là giá trị mặc định
 * modelPropName là tên thuộc tính giá trị của component nhập liệu. Mặc định là modelValue
 */
export async function prompt<T = any>(
  options: Omit<AlertProps, 'beforeClose'> & {
    beforeClose?: (
      scope: BeforeCloseScope & {
        /** Giá trị hiện tại của component nhập liệu */
        value: T;
      },
    ) => boolean | Promise<boolean | undefined> | undefined;
    component?: Component;
    componentProps?: Recordable<any>;
    defaultValue?: T;
    modelPropName?: string;
  },
): Promise<T | undefined>;
```
