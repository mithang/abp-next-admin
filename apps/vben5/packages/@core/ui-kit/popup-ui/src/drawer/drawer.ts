import type { Component, Ref } from 'vue';

import type { ClassType, MaybePromise } from '@vben-core/typings';

import type { DrawerApi } from './drawer-api';

export type DrawerPlacement = 'bottom' | 'left' | 'right' | 'top';

export type CloseIconPlacement = 'left' | 'right';

export interface DrawerProps {
  /**
   * Có gắn vào vùng nội dung hay không
   * @default false
   */
  appendToMain?: boolean;
  /**
   * Văn bản nút hủy
   */
  cancelText?: string;
  class?: ClassType;
  /**
   * Có hiển thị nút đóng hay không
   * @default true
   */
  closable?: boolean;
  /**
   * Vị trí nút đóng
   */
  closeIconPlacement?: CloseIconPlacement;
  /**
   * Nhấn vào lớp phủ của hộp thoại có đóng hộp thoại hay không
   * @default true
   */
  closeOnClickModal?: boolean;
  /**
   * Nhấn phím ESC có đóng hộp thoại hay không
   * @default true
   */
  closeOnPressEscape?: boolean;
  /**
   * Trạng thái loading của nút xác nhận
   * @default false
   */
  confirmLoading?: boolean;
  /**
   * Văn bản nút xác nhận
   */
  confirmText?: string;
  contentClass?: string;
  /**
   * Mô tả hộp thoại
   */
  description?: string;
  /**
   * Hủy ngăn kéo khi đóng
   */
  destroyOnClose?: boolean;
  /**
   * Có hiển thị phần chân hay không
   * @default true
   */
  footer?: boolean;
  /**
   * Kiểu phần chân hộp thoại
   */
  footerClass?: ClassType;
  /**
   * Có hiển thị thanh trên cùng hay không
   * @default true
   */
  header?: boolean;
  /**
   * Kiểu phần đầu hộp thoại
   */
  headerClass?: ClassType;
  /**
   * Hộp thoại có hiển thị hay không
   * @default false
   */
  loading?: boolean;
  /**
   * Có hiển thị lớp phủ hay không
   * @default true
   */
  modal?: boolean;

  /**
   * Có tự động lấy tiêu điểm hay không
   */
  openAutoFocus?: boolean;
  /**
   * Hiệu ứng làm mờ lớp phủ hộp thoại
   */
  overlayBlur?: number;
  /**
   * Vị trí ngăn kéo
   * @default right
   */
  placement?: DrawerPlacement;

  /**
   * Có hiển thị nút hủy hay không
   * @default true
   */
  showCancelButton?: boolean;
  /**
   * Có hiển thị nút xác nhận hay không
   * @default true
   */
  showConfirmButton?: boolean;
  /**
   * Đang gửi (khóa trạng thái ngăn kéo)
   */
  submitting?: boolean;
  /**
   * Tiêu đề hộp thoại
   */
  title?: string;
  /**
   * Gợi ý tiêu đề hộp thoại
   */
  titleTooltip?: string;
  /**
   * Cấp ngăn kéo
   */
  zIndex?: number;
}

export interface DrawerState extends DrawerProps {
  /** Trạng thái mở hộp thoại */
  isOpen?: boolean;
  /**
   * Dữ liệu dùng chung
   */
  sharedData?: Record<string, any>;
}

export type ExtendedDrawerApi = DrawerApi & {
  useStore: <T = NoInfer<DrawerState>>(
    selector?: (state: NoInfer<DrawerState>) => T,
  ) => Readonly<Ref<T>>;
};

export interface DrawerApiOptions extends DrawerState {
  /**
   * Thành phần ngăn kéo độc lập
   */
  connectedComponent?: Component;
  /**
   * Callback trước khi đóng, trả về false có thể ngăn việc đóng
   * @returns
   */
  onBeforeClose?: () => MaybePromise<boolean | undefined>;
  /**
   * Callback khi nhấn nút hủy
   */
  onCancel?: () => void;
  /**
   * Callback khi kết thúc hiệu ứng đóng hộp thoại
   * @returns
   */
  onClosed?: () => void;
  /**
   * Callback khi nhấn nút xác nhận
   */
  onConfirm?: () => void;
  /**
   * Callback khi trạng thái hộp thoại thay đổi
   * @param isOpen
   * @returns
   */
  onOpenChange?: (isOpen: boolean) => void;
  /**
   * Callback khi kết thúc hiệu ứng mở hộp thoại
   * @returns
   */
  onOpened?: () => void;
}
