import type { AsTag } from 'reka-ui';

import type { Component } from 'vue';

import type { ButtonVariants, ButtonVariantSize } from '../../ui';

export interface VbenButtonProps {
  /**
   * The element or component this component should render as. Can be overwrite by `asChild`
   * @defaultValue "div"
   */
  as?: AsTag | Component;
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   *
   * Read our [Composition](https://www.reka-ui.com/docs/guides/composition) guide for more details.
   */
  asChild?: boolean;
  class?: any;
  disabled?: boolean;
  loading?: boolean;
  size?: ButtonVariantSize;
  variant?: ButtonVariants;
}

export type CustomRenderType = (() => Component | string) | string;

export type ValueType = boolean | number | string;

export interface VbenButtonGroupProps extends Pick<
  VbenButtonProps,
  'disabled'
> {
  /** Ở chế độ chọn đơn, cho phép xóa lựa chọn */
  allowClear?: boolean;
  /** Callback trước khi giá trị thay đổi */
  beforeChange?: (
    value: ValueType,
    isChecked: boolean,
  ) => boolean | PromiseLike<boolean | undefined> | undefined;
  /** Kiểu nút */
  btnClass?: any;
  /** Khoảng cách giữa các nút */
  gap?: number;
  /** Ở chế độ chọn nhiều, giới hạn số lượng chọn tối đa. 0 nghĩa là không giới hạn */
  maxCount?: number;
  /** Có cho phép chọn nhiều hay không */
  multiple?: boolean;
  /** Tùy chọn */
  options?: { [key: string]: any; label: CustomRenderType; value: ValueType }[];
  /** Hiển thị biểu tượng */
  showIcon?: boolean;
  /** Kích thước */
  size?: 'large' | 'middle' | 'small';
}
