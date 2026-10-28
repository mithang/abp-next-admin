import type { Arrayable } from '@vueuse/core';
import type { FlattenedItem } from 'reka-ui';

import type { Recordable } from '@vben-core/typings';

export interface TreeProps {
  /** Khi chọn đơn cho phép hủy lựa chọn đã có */
  allowClear?: boolean;
  /** Khi chọn không liên kết, tự động chọn nút cấp trên */
  autoCheckParent?: boolean;
  /** Hiển thị viền */
  bordered?: boolean;
  /** Hủy chọn liên kết cha-con */
  checkStrictly?: boolean;
  /** Tên trường cấp con */
  childrenField?: string;
  /** Các key được mở rộng mặc định */
  defaultExpandedKeys?: Array<number | string>;
  /** Cấp độ mở rộng mặc định (ưu tiên cao hơn defaultExpandedKeys) */
  defaultExpandedLevel?: number;
  /** Giá trị mặc định */
  defaultValue?: Arrayable<number | string>;
  /** Vô hiệu hóa */
  disabled?: boolean;
  /** Tên trường vô hiệu hóa */
  disabledField?: string;
  /** Tên class nút tùy chỉnh */
  getNodeClass?: (item: FlattenedItem<Recordable<any>>) => string;
  iconField?: string;
  /** Trường label */
  labelField?: string;
  /** Có chọn nhiều không */
  multiple?: boolean;
  /** Hiển thị biểu tượng do iconField chỉ định */
  showIcon?: boolean;
  /** Bật animation mở rộng/thu gọn */
  transition?: boolean;
  /** Dữ liệu cây */
  treeData: Recordable<any>[];
  /** Trường giá trị */
  valueField?: string;
}

export function treePropsDefaults() {
  return {
    allowClear: false,
    autoCheckParent: true,
    bordered: false,
    checkStrictly: false,
    defaultExpandedKeys: () => [],
    defaultExpandedLevel: 0,
    disabled: false,
    disabledField: 'disabled',
    iconField: 'icon',
    labelField: 'label',
    multiple: false,
    showIcon: true,
    transition: true,
    valueField: 'value',
    childrenField: 'children',
  };
}
