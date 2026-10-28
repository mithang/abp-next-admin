import type { FieldMapToTime, FormSchema, TabFormSchema } from './types/form';
import type { CSSProperties, PropType } from 'vue';
import type { ColEx } from './types';
import type { TableActionType } from '/@/components/Table';
import type { ButtonProps } from 'ant-design-vue/es/button/buttonTypes';
import type { RowProps } from 'ant-design-vue/lib/grid/Row';
import { propTypes } from '/@/utils/propTypes';

export const basicProps = {
  model: {
    type: Object as PropType<Recordable>,
    default: () => ({}),
  },
  // Chiều rộng nhãn cố định
  labelWidth: {
    type: [Number, String] as PropType<number | string>,
    default: 0,
  },
  fieldMapToTime: {
    type: Array as PropType<FieldMapToTime>,
    default: () => [],
  },
  compact: propTypes.bool,
  // Quy tắc cấu hình form
  schemas: {
    type: Array as PropType<FormSchema[]>,
    default: () => [],
  },
  mergeDynamicData: {
    type: Object as PropType<Recordable>,
    default: null,
  },
  baseRowStyle: {
    type: Object as PropType<CSSProperties>,
  },
  baseColProps: {
    type: Object as PropType<Partial<ColEx>>,
  },
  autoSetPlaceHolder: propTypes.bool.def(true),
  // Nhấn Enter trên component INPUT có tự động submit không
  autoSubmitOnEnter: propTypes.bool.def(false),
  submitOnReset: propTypes.bool,
  submitOnChange: propTypes.bool,
  size: propTypes.oneOf(['default', 'small', 'large']).def('default'),
  // Vô hiệu hóa form
  disabled: propTypes.bool,
  emptySpan: {
    type: [Number, Object] as PropType<number | Recordable>,
    default: 0,
  },
  // Hiển thị nút thu gọn/mở rộng
  showAdvancedButton: propTypes.bool,
  // Chuyển đổi thời gian
  transformDateFunc: {
    type: Function as PropType<Fn>,
    default: (date: any) => {
      return date?.format?.('YYYY-MM-DD HH:mm:ss') ?? date;
    },
  },
  rulesMessageJoinLabel: propTypes.bool.def(true),
  // Quá 3 dòng tự động gấp lại
  autoAdvancedLine: propTypes.number.def(3),
  // Số dòng không bị gấp ảnh hưởng
  alwaysShowLines: propTypes.number.def(1),

  // Hiển thị nút thao tác
  showActionButtonGroup: propTypes.bool.def(true),
  // Cấu hình Col cột thao tác
  actionColOptions: Object as PropType<Partial<ColEx>>,
  // Hiển thị nút đặt lại
  showResetButton: propTypes.bool.def(true),
  // Có focus ô nhập đầu tiên không, chỉ có tác dụng khi form item đầu tiên là input
  autoFocusFirstItem: propTypes.bool,
  // Cấu hình nút đặt lại
  resetButtonOptions: Object as PropType<Partial<ButtonProps>>,

  // Hiển thị nút xác nhận
  showSubmitButton: propTypes.bool.def(true),
  // Cấu hình nút xác nhận
  submitButtonOptions: Object as PropType<Partial<ButtonProps>>,

  // Hàm đặt lại tùy chỉnh
  resetFunc: Function as PropType<() => Promise<void>>,
  submitFunc: Function as PropType<() => Promise<void>>,

  // Các props mặc định sau đây
  hideRequiredMark: propTypes.bool,

  labelCol: Object as PropType<Partial<ColEx>>,

  layout: propTypes.oneOf(['horizontal', 'vertical', 'inline']).def('horizontal'),
  tableAction: {
    type: Object as PropType<TableActionType>,
  },

  wrapperCol: Object as PropType<Partial<ColEx>>,

  colon: propTypes.bool,

  labelAlign: propTypes.string,

  rowProps: Object as PropType<RowProps>,
};

export const tabProps = {
  tab: propTypes.string,
  model: {
    type: Object as PropType<Recordable>,
    default: {},
  },
  // Chiều rộng nhãn cố định
  labelWidth: {
    type: [Number, String] as PropType<number | string>,
    default: 0,
  },
  fieldMapToTime: {
    type: Array as PropType<FieldMapToTime>,
    default: () => [],
  },
  compact: propTypes.bool,
  // Quy tắc cấu hình form
  schemas: {
    type: Array as PropType<TabFormSchema[]>,
    default: () => [],
  },
  mergeDynamicData: {
    type: Object as PropType<Recordable>,
    default: null,
  },
  baseRowStyle: {
    type: Object as PropType<CSSProperties>,
  },
  baseColProps: {
    type: Object as PropType<Partial<ColEx>>,
  },
  autoSetPlaceHolder: propTypes.bool.def(true),
  // Nhấn Enter trên component INPUT có tự động submit không
  autoSubmitOnEnter: propTypes.bool.def(false),
  submitOnReset: propTypes.bool,
  size: propTypes.oneOf(['default', 'small', 'large']).def('default'),
  // Vô hiệu hóa form
  disabled: propTypes.bool,
  emptySpan: {
    type: [Number, Object] as PropType<number>,
    default: 0,
  },
  // Hiển thị nút thu gọn/mở rộng
  showAdvancedButton: propTypes.bool,
  // Chuyển đổi thời gian
  transformDateFunc: {
    type: Function as PropType<Fn>,
    default: (date: any) => {
      return date._isAMomentObject ? date?.format('YYYY-MM-DD HH:mm:ss') : date;
    },
  },
  rulesMessageJoinLabel: propTypes.bool.def(true),
  // Quá 3 dòng tự động gấp lại
  autoAdvancedLine: propTypes.number.def(3),

  // Hiển thị nút thao tác
  showActionButtonGroup: propTypes.bool.def(true),
  // Cấu hình Col cột thao tác
  actionColOptions: Object as PropType<Partial<ColEx>>,
  // Hiển thị nút đặt lại
  showResetButton: propTypes.bool.def(true),
  // Có focus ô nhập đầu tiên không, chỉ có tác dụng khi form item đầu tiên là input
  autoFocusFirstItem: propTypes.bool,
  // Cấu hình nút đặt lại
  resetButtonOptions: Object as PropType<Partial<ButtonProps>>,

  // Hiển thị nút xác nhận
  showSubmitButton: propTypes.bool.def(true),
  // Cấu hình nút xác nhận
  submitButtonOptions: Object as PropType<Partial<ButtonProps>>,

  // Hàm đặt lại tùy chỉnh
  resetFunc: Function as PropType<() => Promise<void>>,
  submitFunc: Function as PropType<() => Promise<void>>,

  // Các props mặc định sau đây
  hideRequiredMark: propTypes.bool,

  labelCol: Object as PropType<Partial<ColEx>>,

  layout: propTypes.oneOf(['horizontal', 'vertical', 'inline']).def('horizontal'),
  tableAction: {
    type: Object as PropType<TableActionType>,
  },

  wrapperCol: Object as PropType<Partial<ColEx>>,

  colon: propTypes.bool,

  labelAlign: propTypes.string,

  rowProps: Object as PropType<RowProps>,
};
