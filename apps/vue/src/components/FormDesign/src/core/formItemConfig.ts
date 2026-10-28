/**
 * @description：Cấu hình form
 */
import { IVFormComponent } from '../typings/v-form-component';
import { isArray } from 'lodash-es';
import { customComponentMap as VbenCmp, add } from '/@/components/Form/src/componentMap';
import { ComponentType } from '/@/components/Form/src/types';

import { componentMap as Cmp } from '../components';
import { Component } from 'vue';

const componentMap = new Map<string, Component>();

//Nếu có các control khác, có thể khởi tạo tại đây

//Đăng ký thư viện control Ant
Cmp.forEach((value, key) => {
  componentMap.set(key, value);
  if (VbenCmp[key] == null) {
    add(key as ComponentType, value);
  }
});
//Đăng ký thư viện control vben
VbenCmp.forEach((value, key) => {
  componentMap.set(key, value);
});

export { componentMap };

/**
 * Thiết lập control form tùy chỉnh
 * @param {IVFormComponent | IVFormComponent[]} config
 */
export function setFormDesignComponents(config: IVFormComponent | IVFormComponent[]) {
  if (isArray(config)) {
    config.forEach((item) => {
      const { componentInstance: component, ...rest } = item;
      componentMap[item.component] = component;
      customComponents.push(Object.assign({ props: {} }, rest));
    });
  } else {
    const { componentInstance: component, ...rest } = config;
    componentMap[config.component] = component;
    customComponents.push(Object.assign({ props: {} }, rest));
  }
}

//Control tùy chỉnh được thiết lập từ bên ngoài
export const customComponents: IVFormComponent[] = [];

// Danh sách control bên trái và thuộc tính khởi tạo của control
// props.slotName sẽ tạo một slot ở cấp formitem và gắn giá trị record hiện tại
// Thuộc tính props có kiểu là đối tượng, không được là undefined hoặc null.
export const baseComponents: IVFormComponent[] = [
  {
    component: 'InputCountDown',
    label: 'Nhập đếm ngược',
    icon: 'line-md:iconify2',
    colProps: { span: 24 },
    field: '',
    componentProps: {},
  },
  {
    component: 'IconPicker',
    label: 'Bộ chọn biểu tượng',
    icon: 'line-md:iconify2',
    colProps: { span: 24 },
    field: '',
    componentProps: {},
  },
  {
    component: 'StrengthMeter',
    label: 'Độ mạnh mật khẩu',
    icon: 'wpf:password1',
    colProps: { span: 24 },
    field: '',
    componentProps: {},
  },
  {
    component: 'AutoComplete',
    label: 'Tự động hoàn thành',
    icon: 'wpf:password1',
    colProps: { span: 24 },
    field: '',
    componentProps: {
      placeholder: 'Vui lòng nhập biểu thức chính quy',
      options: [
        {
          value: '/^(?:(?:\\+|00)86)?1[3-9]\\d{9}$/',
          label: 'Số điện thoại di động',
        },
        {
          value: '/^((ht|f)tps?:\\/\\/)?[\\w-]+(\\.[\\w-]+)+:\\d{1,5}\\/?$/',
          label: 'Địa chỉ web kèm cổng',
        },
      ],
    },
  },
  {
    component: 'Divider',
    label: 'Đường phân cách',
    icon: 'radix-icons:divider-horizontal',
    colProps: { span: 24 },
    field: '',
    componentProps: {
      orientation: 'center',
      dashed: true,
    },
  },
  {
    component: 'Checkbox',
    label: 'Hộp kiểm',
    icon: 'ant-design:check-circle-outlined',
    colProps: { span: 24 },
    field: '',
  },
  {
    component: 'CheckboxGroup',
    label: 'Hộp kiểm - Nhóm',
    icon: 'ant-design:check-circle-filled',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      options: [
        {
          label: 'Tùy chọn 1',
          value: '1',
        },
        {
          label: 'Tùy chọn 2',
          value: '2',
        },
      ],
    },
  },
  {
    component: 'Input',
    label: 'Ô nhập liệu',
    icon: 'bi:input-cursor-text',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      type: 'text',
    },
  },
  {
    component: 'InputNumber',
    label: 'Ô nhập số',
    icon: 'ant-design:field-number-outlined',
    field: '',
    colProps: { span: 24 },
    componentProps: { style: 'width:200px' },
  },
  {
    component: 'InputTextArea',
    label: 'Vùng văn bản',
    icon: 'ant-design:file-text-filled',
    field: '',
    colProps: { span: 24 },
    componentProps: {},
  },
  {
    component: 'Select',
    label: 'Chọn thả xuống',
    icon: 'gg:select',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      options: [
        {
          label: 'Tùy chọn 1',
          value: '1',
        },
        {
          label: 'Tùy chọn 2',
          value: '2',
        },
      ],
    },
  },

  {
    component: 'Radio',
    label: 'Nút radio',
    icon: 'ant-design:check-circle-outlined',
    field: '',
    colProps: { span: 24 },
    componentProps: {},
  },
  {
    component: 'RadioGroup',
    label: 'Nút radio - Nhóm',
    icon: 'carbon:radio-button-checked',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      options: [
        {
          label: 'Tùy chọn 1',
          value: '1',
        },
        {
          label: 'Tùy chọn 2',
          value: '2',
        },
      ],
    },
  },
  {
    component: 'DatePicker',
    label: 'Chọn ngày',
    icon: 'healthicons:i-schedule-school-date-time-outline',
    field: '',
    colProps: { span: 24 },
    componentProps: {},
  },
  {
    component: 'RangePicker',
    label: 'Khoảng ngày',
    icon: 'healthicons:i-schedule-school-date-time-outline',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      placeholder: ['Ngày bắt đầu', 'Ngày kết thúc'],
    },
  },
  {
    component: 'MonthPicker',
    label: 'Chọn tháng',
    icon: 'healthicons:i-schedule-school-date-time-outline',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      placeholder: 'Vui lòng chọn tháng',
    },
  },
  {
    component: 'TimePicker',
    label: 'Chọn thời gian',
    icon: 'healthicons:i-schedule-school-date-time',
    field: '',
    colProps: { span: 24 },
    componentProps: {},
  },
  {
    component: 'Slider',
    label: 'Thanh trượt nhập liệu',
    icon: 'vaadin:slider',
    field: '',
    colProps: { span: 24 },
    componentProps: {},
  },
  {
    component: 'Rate',
    label: 'Đánh giá',
    icon: 'ic:outline-star-rate',
    field: '',
    colProps: { span: 24 },
    componentProps: {},
  },
  {
    component: 'Switch',
    label: 'Công tắc',
    icon: 'entypo:switch',
    field: '',
    colProps: { span: 24 },
    componentProps: {},
  },
  {
    component: 'TreeSelect',
    label: 'Chọn dạng cây',
    icon: 'clarity:tree-view-line',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      treeData: [
        {
          label: 'Tùy chọn 1',
          value: '1',
          children: [
            {
              label: 'Tùy chọn 3',
              value: '1-1',
            },
          ],
        },
        {
          label: 'Tùy chọn 2',
          value: '2',
        },
      ],
    },
  },
  {
    component: 'Upload',
    label: 'Tải lên',
    icon: 'ant-design:upload-outlined',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      api: () => 1,
    },
  },
  {
    component: 'Cascader',
    label: 'Chọn xếp tầng',
    icon: 'ant-design:check-outlined',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      options: [
        {
          label: 'Tùy chọn 1',
          value: '1',
          children: [
            {
              label: 'Tùy chọn 3',
              value: '1-1',
            },
          ],
        },
        {
          label: 'Tùy chọn 2',
          value: '2',
        },
      ],
    },
  },
  // {
  //   component: 'Button',
  //   label: 'Nút bấm',
  //   icon: 'dashicons:button',
  //   field: '',
  //   colProps: { span: 24 },
  //   hiddenLabel: true,
  //   componentProps: {},
  // },
  // {
  //   component: 'ColorPicker',
  //   label: 'Bộ chọn màu',
  //   icon: 'carbon:color-palette',
  //   field: '',
  //   colProps: { span: 24 },
  //   componentProps: {
  //     defaultValue: '',
  //     value: '',
  //   },
  // },
  {
    component: 'Avatar',
    label: 'Ảnh đại diện',
    icon: 'radix-icons:avatar',
    field: '',
    colProps: { span: 24 },
    componentProps: {},
  },
  {
    component: 'Descriptions',
    label: 'Danh sách mô tả',
    icon: 'cil:description',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      options: [
        {
          label: 'Tùy chọn 1',
          value: '1',
        },
        {
          label: 'Tùy chọn 2',
          value: '2',
        },
      ],
    },
  },
  {
    component: 'slot',
    label: 'Slot',
    icon: 'vs:timeslot-question',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      slotName: 'slotName',
    },
  },
];

// https://next.antdv.com/components/transfer-cn
const transferControl = {
  component: 'Transfer',
  label: 'Hộp chuyển đổi',
  icon: 'bx:bx-transfer-alt',
  field: '',
  colProps: { span: 24 },
  componentProps: {
    render: (item) => item.title,
    dataSource: [
      {
        key: 'key-1',
        title: 'Tiêu đề 1',
        description: 'Mô tả',
        disabled: false,
        chosen: true,
      },
      {
        key: 'key-2',
        title: 'title2',
        description: 'description2',
        disabled: true,
      },
      {
        key: 'key-3',
        title: 'Tiêu đề 3',
        description: 'Mô tả 3',
        disabled: false,
        chosen: true,
      },
    ],
  },
};

baseComponents.push(transferControl);

const tableControl = {
  component: 'Table',
  label: 'Bảng',
  icon: 'bx:bx-table',
  field: '',
  colProps: { span: 24 },
  componentProps: {
    render: (item) => item.title,
    columns: [
      {
        align: 'left',
        title: 'Cột 1',
        dataIndex: 'col1'
      },
      {
        align: 'left',
        title: 'Cột 2',
        dataIndex: 'col2'
      },
      {
        align: 'left',
        title: 'Cột 3',
        dataIndex: 'col3'
      },
    ],
    dataSource: [
      {
        col1: 'Dữ liệu 1-1',
        col2: 'Dữ liệu 1-2',
        col3: 'Dữ liệu 1-3',
      },
      {
        col1: 'Dữ liệu 2-1',
        col2: 'Dữ liệu 2-2',
        col3: 'Dữ liệu 2-3',
      },
      {
        col1: 'Dữ liệu 3-1',
        col2: 'Dữ liệu 3-2',
        col3: 'Dữ liệu 3-3',
      },
    ],
  },
}

baseComponents.push(tableControl);

export const layoutComponents: IVFormComponent[] = [
  {
    field: '',
    component: 'Grid',
    label: 'Bố cục lưới',
    icon: 'icon-grid',
    componentProps: {},
    columns: [
      {
        span: 12,
        children: [],
      },
      {
        span: 12,
        children: [],
      },
    ],
    colProps: { span: 24 },
    options: {
      gutter: 0,
    },
  },
];