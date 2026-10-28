import type { Component, Ref } from 'vue';

import type { MaybePromise } from '@vben-core/typings';

import type { ModalApi } from './modal-api';

export interface ModalProps {
  /**
   * Loại hiệu ứng
   * @default 'slide'
   */
  animationType?: 'scale' | 'slide';
  /**
   * Có gắn vào vùng nội dung hay không
   * @default false
   */
  appendToMain?: boolean;
  /**
   * Có hiển thị viền hay không
   * @default false
   */
  bordered?: boolean;
  /**
   * Chữ trên nút huỷ
   */
  cancelText?: string;
  /**
   * Có căn giữa hay không
   * @default false
   */
  centered?: boolean;

  class?: string;

  /**
   * Có hiển thị nút đóng ở góc trên bên phải hay không
   * @default true
   */
  closable?: boolean;
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
   * Vô hiệu hoá nút xác nhận
   */
  confirmDisabled?: boolean;
  /**
   * Trạng thái loading của nút xác nhận
   * @default false
   */
  confirmLoading?: boolean;
  /**
   * Chữ trên nút xác nhận
   */
  confirmText?: string;
  contentClass?: string;
  /**
   * Mô tả hộp thoại
   */
  description?: string;
  /**
   * Huỷ hộp thoại khi đóng
   */
  destroyOnClose?: boolean;
  /**
   * Có thể kéo thả hay không
   * @default false
   */
  draggable?: boolean;
  /**
   * Có hiển thị phần dưới hay không
   * @default true
   */
  footer?: boolean;
  footerClass?: string;
  /**
   * Có toàn màn hình hay không
   * @default false
   */
  fullscreen?: boolean;
  /**
   * Có hiển thị nút toàn màn hình hay không
   * @default true
   */
  fullscreenButton?: boolean;
  /**
   * Có hiển thị thanh trên cùng hay không
   * @default true
   */
  header?: boolean;
  headerClass?: string;
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
   * Có tự động focus hay không
   */
  openAutoFocus?: boolean;
  /**
   * Hiệu ứng làm mờ lớp phủ hộp thoại
   */
  overlayBlur?: number;
  /**
   * Có hiển thị nút huỷ hay không
   * @default true
   */
  showCancelButton?: boolean;
  /**
   * Có hiển thị nút xác nhận hay không
   * @default true
   */
  showConfirmButton?: boolean;
  /**
   * Đang gửi (khoá trạng thái hộp thoại)
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
   * Cấp của hộp thoại
   */
  zIndex?: number;
}

export interface ModalState extends ModalProps {
  /** Trạng thái mở hộp thoại */
  isOpen?: boolean;
  /**
   * Dữ liệu chung
   */
  sharedData?: Record<string, any>;
}

export type ExtendedModalApi = ModalApi & {
  useStore: <T = NoInfer<ModalState>>(
    selector?: (state: NoInfer<ModalState>) => T,
  ) => Readonly<Ref<T>>;
};

export interface ModalApiOptions extends ModalState {
  /**
   * Component hộp thoại độc lập
   */
  connectedComponent?: Component;
  /**
   * Callback trước khi đóng, trả về false có thể ngăn đóng
   * @returns
   */
  onBeforeClose?: () => MaybePromise<boolean | undefined>;
  /**
   * Callback khi nhấn nút huỷ
   */
  onCancel?: () => void;
  /**
   * Callback khi hiệu ứng đóng hộp thoại kết thúc
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
   * Callback khi hiệu ứng mở hộp thoại kết thúc
   * @returns
   */
  onOpened?: () => void;
}
