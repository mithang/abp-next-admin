import { IAnyObject } from '../../../typings/base-type';
import { baseComponents, customComponents } from '../../../core/formItemConfig';

export const globalConfigState: { span: number } = {
  span: 24,
};
export interface IBaseFormAttrs {
  name: string; // Tên trường
  label: string; // Nhãn trường
  component?: string; // Điều khiển thuộc tính
  componentProps?: IAnyObject; // Thuộc tính truyền cho điều khiển
  exclude?: string[]; // Điều khiển cần loại trừ
  includes?: string[]; // Thành phần đáp ứng điều kiện
  on?: IAnyObject;
  children?: IBaseFormAttrs[];
  category?: 'control' | 'input';
}

export interface IBaseFormItemControlAttrs extends IBaseFormAttrs {
  target?: 'props' | 'options'; // Gắn vào một khóa đích nào đó trong đối tượng
}

export const baseItemColumnProps: IBaseFormAttrs[] = [
  {
    name: 'span',
    label: 'Số cột lưới',
    component: 'Slider',
    on: {
      change(value: number) {
        globalConfigState.span = value;
      },
    },
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },

  {
    name: 'offset',
    label: 'Số cột khoảng cách bên trái lưới',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
  {
    name: 'order',
    label: 'Thứ tự lưới, có hiệu lực ở chế độ bố cục flex',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
  {
    name: 'pull',
    label: 'Số cột lưới dịch sang trái',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
  {
    name: 'push',
    label: 'Số cột lưới dịch sang phải',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
  {
    name: 'xs',
    label: '<576px Lưới đáp ứng',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
  {
    name: 'sm',
    label: '≥576px Lưới đáp ứng',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
  {
    name: 'md',
    label: '≥768p Lưới đáp ứng',
    component: 'Slider',

    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
  {
    name: 'lg',
    label: '≥992px Lưới đáp ứng',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
  {
    name: 'xl',
    label: '≥1200px Lưới đáp ứng',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
  {
    name: 'xxl',
    label: '≥1600px Lưới đáp ứng',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
  {
    name: '≥2000px',
    label: '≥1600px Lưới đáp ứng',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
];

// Các mục cấu hình của bảng thuộc tính điều khiển
export const advanceFormItemColProps: IBaseFormAttrs[] = [
  {
    name: 'labelCol',
    label: 'Nhãn col',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
    exclude: ['Grid'],
  },
  {
    name: 'wrapperCol',
    label: 'Điều khiển-span',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
    exclude: ['Grid'],
  },
];
// Các mục cấu hình của bảng thuộc tính điều khiển
export const baseFormItemProps: IBaseFormAttrs[] = [
  {
    // Tự động chuyển đổi loại điều khiển
    name: 'component',
    label: 'Điều khiển-FormItem',
    component: 'Select',
    componentProps: {
      options: baseComponents
        .concat(customComponents)
        .map((item) => ({ value: item.component, label: item.label })),
    },
  },
  {
    name: 'label',
    label: 'Nhãn',
    component: 'Input',
    componentProps: {
      type: 'Input',
      placeholder: 'Vui lòng nhập nhãn',
    },
    exclude: ['Grid'],
  },
  {
    name: 'field',
    label: 'Định danh trường',
    component: 'Input',
    componentProps: {
      type: 'InputTextArea',
      placeholder: 'Vui lòng nhập định danh trường',
    },
    exclude: ['Grid'],
  },
  {
    name: 'helpMessage',
    label: 'helpMessage',
    component: 'Input',
    componentProps: {
      placeholder: 'Vui lòng nhập thông tin gợi ý',
    },
    exclude: ['Grid'],
  },
];

// Các mục cấu hình của bảng thuộc tính điều khiển
export const advanceFormItemProps: IBaseFormAttrs[] = [
  {
    name: 'labelAlign',
    label: 'Căn lề nhãn',
    component: 'RadioGroup',
    componentProps: {
      options: [
        {
          label: 'Căn trái',
          value: 'left',
        },
        {
          label: 'Căn phải',
          value: 'right',
        },
      ],
    },
    exclude: ['Grid'],
  },

  {
    name: 'help',
    label: 'help',
    component: 'Input',
    componentProps: {
      placeholder: 'Vui lòng nhập thông tin gợi ý',
    },
    exclude: ['Grid'],
  },
  {
    name: 'extra',
    label: 'Thông báo bổ sung',
    component: 'Input',
    componentProps: {
      type: 'InputTextArea',
      placeholder: 'Vui lòng nhập thông báo bổ sung',
    },
    exclude: ['Grid'],
  },
  {
    name: 'validateTrigger',
    label: 'validateTrigger',
    component: 'Input',
    componentProps: {
      type: 'InputTextArea',
      placeholder: 'Vui lòng nhập validateTrigger',
    },
    exclude: ['Grid'],
  },
  {
    name: 'validateStatus',
    label: 'Trạng thái kiểm tra',
    component: 'RadioGroup',
    componentProps: {
      options: [
        {
          label: 'Mặc định',
          value: '',
        },
        {
          label: 'Thành công',
          value: 'success',
        },
        {
          label: 'Cảnh báo',
          value: 'warning',
        },
        {
          label: 'Lỗi',
          value: 'error',
        },
        {
          label: 'Đang kiểm tra',
          value: 'validating',
        },
      ],
    },
    exclude: ['Grid'],
  },
];

export const baseFormItemControlAttrs: IBaseFormItemControlAttrs[] = [
  {
    name: 'required',
    label: 'Mục bắt buộc',
    component: 'Checkbox',
    exclude: ['alert'],
  },
  {
    name: 'hidden',
    label: 'Ẩn',
    component: 'Checkbox',
    exclude: ['alert'],
  },
  {
    name: 'hiddenLabel',
    component: 'Checkbox',
    exclude: ['Grid'],
    label: 'Ẩn nhãn',
  },
  {
    name: 'colon',
    label: 'Hiển thị dấu hai chấm sau label',
    component: 'Checkbox',
    componentProps: {},
    exclude: ['Grid'],
  },
  {
    name: 'hasFeedback',
    label: 'Phản hồi nhập liệu',
    component: 'Checkbox',
    componentProps: {},
    includes: ['Input'],
  },
  {
    name: 'autoLink',
    label: 'Tự động liên kết',
    component: 'Checkbox',
    componentProps: {},
    includes: ['Input'],
  },
  {
    name: 'validateFirst',
    label: 'Dừng khi kiểm tra gặp lỗi',
    component: 'Checkbox',
    componentProps: {},
    includes: ['Input'],
  },
];
