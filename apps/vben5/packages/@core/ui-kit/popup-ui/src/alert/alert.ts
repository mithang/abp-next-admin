import type { Component, VNode, VNodeArrayChildren } from 'vue';

import type { Recordable } from '@vben-core/typings';

import { createContext } from '@vben-core/shadcn-ui';

export type IconType = 'error' | 'info' | 'question' | 'success' | 'warning';

export type BeforeCloseScope = {
  isConfirm: boolean;
};

export type AlertProps = {
  /** Callback trước khi đóng, nếu trả về false thì hủy việc đóng */
  beforeClose?: (
    scope: BeforeCloseScope,
  ) => boolean | Promise<boolean | undefined> | undefined;
  /** Viền */
  bordered?: boolean;
  /**
   * Cách căn chỉnh nút
   * @default 'end'
   */
  buttonAlign?: 'center' | 'end' | 'start';
  /** Tiêu đề nút Hủy */
  cancelText?: string;
  /** Có hiển thị ở giữa hay không */
  centered?: boolean;
  /** Tiêu đề nút Xác nhận */
  confirmText?: string;
  /** Kiểu bổ sung cho vùng chứa hộp thoại */
  containerClass?: string;
  /** Nội dung nhắc của hộp thoại */
  content: Component | string;
  /** Kiểu bổ sung cho nội dung hộp thoại */
  contentClass?: string;
  /** Trong thời gian thực thi callback beforeClose, hiển thị một lớp phủ loading ở vùng nội dung*/
  contentMasking?: boolean;
  /** Nội dung chân hộp thoại (cùng vùng chứa với các nút) */
  footer?: Component | string;
  /** Biểu tượng hộp thoại (ở phía trước tiêu đề) */
  icon?: Component | IconType;
  /**
   * Hiệu ứng làm mờ lớp phủ hộp thoại
   */
  overlayBlur?: number;
  /** Có hiển thị nút Hủy hay không */
  showCancel?: boolean;
  /** Tiêu đề hộp thoại */
  title?: string;
};

/** Thuộc tính Prompt */
export type PromptProps<T = any> = {
  /** Callback trước khi đóng, nếu trả về false thì hủy việc đóng */
  beforeClose?: (scope: {
    isConfirm: boolean;
    value: T | undefined;
  }) => boolean | Promise<boolean | undefined> | undefined;
  /** Component dùng để nhận dữ liệu nhập của người dùng */
  component?: Component;
  /** Thuộc tính của component nhập liệu */
  componentProps?: Recordable<any>;
  /** Slot của component nhập liệu */
  componentSlots?:
    (() => any) | Recordable<unknown> | VNode | VNodeArrayChildren;
  /** Giá trị mặc định */
  defaultValue?: T;
  /** Tên thuộc tính giá trị của component nhập liệu */
  modelPropName?: string;
} & Omit<AlertProps, 'beforeClose'>;

/**
 * Ngữ cảnh Alert
 */
export type AlertContext = {
  /** Thực thi thao tác hủy */
  doCancel: () => void;
  /** Thực thi thao tác xác nhận */
  doConfirm: () => void;
};

export const [injectAlertContext, provideAlertContext] =
  createContext<AlertContext>('VbenAlertContext');

/**
 * Lấy ngữ cảnh Alert
 * @returns AlertContext
 */
export function useAlertContext() {
  const context = injectAlertContext();
  if (!context) {
    throw new Error('useAlertContext must be used within an AlertProvider');
  }
  return context;
}
