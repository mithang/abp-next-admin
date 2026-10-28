import { IBaseFormAttrs } from './formItemPropsConfig';

interface IBaseComponentProps {
  [key: string]: IBaseFormAttrs[];
}

type BaseFormAttrs = Omit<IBaseFormAttrs, 'tag'>;

export const baseComponentControlAttrs: Omit<IBaseFormAttrs, 'tag'>[] = [
  {
    // Các control không có thuộc tính disabled không thể dùng làm control form
    name: 'disabled',
    label: 'Vô hiệu hoá',
  },
  {
    // Các control không có thuộc tính disabled không thể dùng làm control form
    name: 'autofocus',
    label: 'Tự động lấy tiêu điểm',
    includes: [
      'Input',
      'Select',
      'ApiSelect',
      'InputTextArea',
      'InputNumber',
      'DatePicker',
      'RangePicker',
      'MonthPicker',
      'TimePicker',
      'Cascader',
      'TreeSelect',
      'ApiTreeSelect',
      'Switch',
      'AutoComplete',
      'Slider',
    ],
  },
  {
    name: 'allowClear',
    label: 'Có thể xóa',
    includes: [
      'Input',
      'Select',
      'ApiSelect',
      'InputTextArea',
      'InputNumber',
      'DatePicker',
      'RangePicker',
      'MonthPicker',
      'TimePicker',
      'Cascader',
      'TreeSelect',
      'ApiTreeSelect',
      'AutoComplete',
    ],
  },
  { name: 'fullscreen', label: 'Toàn màn hình', includes: ['Calendar'] },
  {
    name: 'showSearch',
    label: 'Có thể tìm kiếm',
    includes: ['Select', 'ApiSelect', 'TreeSelect', 'ApiTreeSelect', 'Cascader', 'Transfer'],
  },
  {
    name: 'showTime',
    label: 'Hiển thị thời gian',
    includes: ['DatePicker', 'RangePicker', 'MonthPicker'],
  },
  {
    name: 'range',
    label: 'Trượt hai chiều',
    includes: [],
  },
  {
    name: 'allowHalf',
    label: 'Cho phép chọn một nửa',
    includes: ['Rate'],
  },
  {
    name: 'multiple',
    label: 'Chọn nhiều',
    includes: ['Select', 'ApiSelect', 'TreeSelect', 'ApiTreeSelect', 'Upload'],
  },
  {
    name: 'directory',
    label: 'Thư mục',
    includes: ['Upload'],
  },
  {
    name: 'withCredentials',
    label: 'Mang theo cookie',
    includes: ['Upload'],
  },
  {
    name: 'bordered',
    label: 'Có viền hay không',
    includes: ['Select', 'ApiSelect', 'Input'],
  },
  {
    name: 'defaultActiveFirstOption',
    label: 'Tô sáng lựa chọn đầu tiên',
    component: 'Checkbox',
    includes: ['Select', 'ApiSelect', 'AutoComplete'],
  },
  {
    name: 'dropdownMatchSelectWidth',
    label: 'Menu thả xuống cùng chiều rộng với bộ chọn',
    component: 'Checkbox',
    includes: ['Select', 'ApiSelect', 'TreeSelect', 'ApiTreeSelect', 'AutoComplete'],
  },
];

//Thuộc tính dùng chung
export const baseComponentCommonAttrs: Omit<IBaseFormAttrs, 'tag'>[] = [
  {
    name: 'size',
    label: 'Kích thước',
    component: 'RadioGroup',
    componentProps: {
      options: [
        {
          label: 'Mặc định',
          value: 'default',
        },
        {
          label: 'Lớn',
          value: 'large',
        },
        {
          label: 'Nhỏ',
          value: 'small',
        },
      ],
    },
    includes: ['InputNumber', 'Input', 'Cascader', 'Button'],
  },
  {
    name: 'placeholder',
    label: 'Placeholder',
    component: 'Input',
    componentProps: {
      placeholder: 'Vui lòng nhập placeholder',
    },
    includes: [
      'AutoComplete',
      'InputTextArea',
      'InputNumber',
      'Input',
      'InputTextArea',
      'Select',
      'ApiSelect', 
      'DatePicker',
      'MonthPicker',
      'TimePicker',
      'TreeSelect',
      'ApiTreeSelect', 
      'Cascader',
    ],
  },
  {
    name: 'style',
    label: 'Kiểu',
    component: 'Input',
    componentProps: {
      placeholder: 'Vui lòng nhập kiểu',
    },
  },
  {
    name: 'open',
    label: 'Luôn mở menu thả xuống',
    component: 'RadioGroup',
    componentProps: {
      options: [
        {
          label: 'Mặc định',
          value: undefined,
        },
        {
          label: 'Có',
          value: true,
        },
        {
          label: 'Không',
          value: false,
        },
      ],
    },
    includes: ['Select', 'ApiSelect', 'AutoComplete'],
  },
];

const componentAttrs: IBaseComponentProps = {
  AutoComplete: [
    {
      name: 'backfill',
      label: 'Tự động điền lại',
      component: 'Switch',
      componentProps: {
        span: 8,
      },
    },
    {
      name: 'defaultOpen',
      label: 'Có mở menu thả xuống theo mặc định hay không',
      component: 'Checkbox',
    },
  ],
  IconPicker: [
    {
      name: 'mode',
      label: 'Chế độ',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: 'ICONIFY', value: null },
          { label: 'SVG', value: 'svg' },
          // { label: 'Kết hợp', value: 'combobox' },
        ],
      },
    },
  ],

  // https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input#%3Cinput%3E_types
  Input: [
    {
      name: 'type',
      label: 'Loại',
      component: 'Select',
      componentProps: {
        options: [
          { value: 'text', label: 'Văn bản' },
          { value: 'search', label: 'Tìm kiếm' },
          { value: 'number', label: 'Số' },
          { value: 'range', label: 'Phạm vi số' },
          { value: 'password', label: 'Mật khẩu' },
          { value: 'date', label: 'Ngày' },
          { value: 'datetime-local', label: 'Ngày - không múi giờ' },
          { value: 'time', label: 'Thời gian' },
          { value: 'month', label: 'Năm-tháng' },
          { value: 'week', label: 'Tuần' },
          { value: 'email', label: 'Hộp thư' },
          { value: 'url', label: 'URL' },
          { value: 'tel', label: 'Số điện thoại' },
          { value: 'file', label: 'Tệp' },
          { value: 'button', label: 'Nút' },
          { value: 'submit', label: 'Nút gửi' },
          { value: 'reset', label: 'Nút đặt lại' },
          { value: 'radio', label: 'Nút radio' },
          { value: 'checkbox', label: 'Hộp kiểm' },
          { value: 'color', label: 'Màu sắc' },
          { value: 'image', label: 'Hình ảnh' },
          { value: 'hidden', label: 'Ẩn' },
        ],
      },
    },
    {
      name: 'defaultValue',
      label: 'Giá trị mặc định',
      component: 'Input',
      componentProps: {
        type: 'text',
        placeholder: 'Vui lòng nhập giá trị mặc định',
      },
    },
    {
      name: 'prefix',
      label: 'Tiền tố',
      component: 'Input',
      componentProps: {
        type: 'text',
        placeholder: 'Vui lòng nhập tiền tố',
      },
    },
    {
      name: 'suffix',
      label: 'Hậu tố',
      component: 'Input',
      componentProps: {
        type: 'text',
        placeholder: 'Vui lòng nhập hậu tố',
      },
    },
    {
      name: 'addonBefore',
      label: 'Nhãn phía trước',
      component: 'Input',
      componentProps: {
        type: 'text',
        placeholder: 'Vui lòng nhập nhãn phía trước',
      },
    },
    {
      name: 'addonAfter',
      label: 'Nhãn phía sau',
      component: 'Input',
      componentProps: {
        type: 'text',
        placeholder: 'Vui lòng nhập nhãn phía sau',
      },
    },
    {
      name: 'maxLength',
      label: 'Độ dài tối đa',
      component: 'InputNumber',
      componentProps: {
        type: 'text',
        placeholder: 'Vui lòng nhập độ dài tối đa',
      },
    },
  ],

  InputNumber: [
    {
      name: 'defaultValue',
      label: 'Giá trị mặc định',
      component: 'InputNumber',
      componentProps: {
        placeholder: 'Vui lòng nhập giá trị mặc định',
      },
    },
    {
      name: 'min',
      label: 'Giá trị tối thiểu',
      component: 'InputNumber',
      componentProps: {
        type: 'text',
        placeholder: 'Vui lòng nhập giá trị tối thiểu',
      },
    },
    {
      name: 'max',
      label: 'Giá trị tối đa',
      component: 'InputNumber',
      componentProps: {
        type: 'text',
        placeholder: 'Vui lòng nhập giá trị tối đa',
      },
    },
    {
      name: 'precision',
      label: 'Độ chính xác số',
      component: 'InputNumber',
      componentProps: {
        type: 'text',
        placeholder: 'Vui lòng nhập giá trị tối đa',
      },
    },
    {
      name: 'step',
      label: 'Bước nhảy',
      component: 'InputNumber',
      componentProps: {
        type: 'text',
        placeholder: 'Vui lòng nhập bước nhảy',
      },
    },
    {
      name: 'decimalSeparator',
      label: 'Dấu thập phân',
      component: 'Input',
      componentProps: { type: 'text', placeholder: 'Vui lòng nhập dấu thập phân' },
    },
    {
      name: 'addonBefore',
      label: 'Nhãn phía trước',
      component: 'Input',
      componentProps: {
        type: 'text',
        placeholder: 'Vui lòng nhập nhãn phía trước',
      },
    },
    {
      name: 'addonAfter',
      label: 'Nhãn phía sau',
      component: 'Input',
      componentProps: {
        type: 'text',
        placeholder: 'Vui lòng nhập nhãn phía sau',
      },
    },
    {
      name: 'controls',
      label: 'Có hiển thị nút tăng/giảm hay không',
      component: 'Checkbox',
    },
    {
      name: 'keyboard',
      label: 'Có bật hành vi phím tắt hay không',
      component: 'Checkbox',
    },
    {
      name: 'stringMode',
      label: 'Chế độ giá trị ký tự',
      component: 'Checkbox',
    },
    {
      name: 'bordered',
      label: 'Có viền hay không',
      component: 'Checkbox',
    },
  ],
  InputTextArea: [
    {
      name: 'defaultValue',
      label: 'Giá trị mặc định',
      component: 'Input',
      componentProps: {
        type: 'text',
        placeholder: 'Vui lòng nhập giá trị mặc định',
      },
    },
    {
      name: 'maxlength',
      label: 'Độ dài tối đa',
      component: 'InputNumber',
      componentProps: {
        placeholder: 'Vui lòng nhập độ dài tối đa',
      },
    },
    {
      name: 'minlength',
      label: 'Độ dài tối thiểu',
      component: 'InputNumber',
      componentProps: {
        placeholder: 'Vui lòng nhập độ dài tối thiểu',
      },
    },
    {
      name: 'cols',
      label: 'Số cột hiển thị',
      component: 'InputNumber',
      componentProps: {
        placeholder: 'Vui lòng nhập số cột hiển thị',
        min: 0,
      },
    },
    {
      name: 'rows',
      label: 'Số hàng hiển thị',
      component: 'InputNumber',
      componentProps: {
        placeholder: 'Vui lòng nhập số hàng hiển thị',
        min: 0,
      },
    },
    {
      name: 'minlength',
      label: 'Độ dài tối thiểu',
      component: 'InputNumber',
      componentProps: {
        placeholder: 'Vui lòng nhập độ dài tối thiểu',
      },
    },
    {
      name: 'autosize',
      label: 'Tự điều chỉnh chiều cao theo nội dung',
      component: 'Checkbox',
    },
    {
      name: 'showCount',
      label: 'Có hiển thị số ký tự hay không',
      component: 'Checkbox',
    },
    {
      name: 'readonly',
      label: 'Có chỉ đọc hay không',
      component: 'Checkbox',
    },
    {
      name: 'spellcheck',
      label: 'Kiểm tra đọc/ghi',
      component: 'Checkbox',
    },
    {
      name: 'autocomplete',
      label: 'Có tự động hoàn thành hay không',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: 'Bình thường', value: null },
          { label: 'Bật', value: 'on' },
          { label: 'Tắt', value: 'off' },
        ],
      },
    },
    {
      name: 'autocorrect',
      label: 'Có tự động sửa lỗi hay không',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: 'Bình thường', value: null },
          { label: 'Bật', value: 'on' },
          { label: 'Tắt', value: 'off' },
        ],
      },
    },
  ],
  Select: [
    {
      name: 'mode',
      label: 'Chế độ chọn (mặc định chọn đơn)',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: 'Chọn đơn', value: null },
          { label: 'Chọn nhiều', value: 'multiple' },
          { label: 'Thẻ', value: 'tags' },
          // { label: 'Kết hợp', value: 'combobox' },
        ],
      },
    },
    {
      name: 'autoClearSearchValue',
      label: 'Có xóa hộp tìm kiếm sau khi chọn mục hay không',
      component: 'Checkbox',
    },
    {
      name: 'labelInValue',
      label: 'Gói label của lựa chọn vào value',
      component: 'Checkbox',
    },
    {
      name: 'showArrow',
      label: 'Hiển thị mũi tên nhỏ thả xuống',
      component: 'Checkbox',
    },
    {
      name: 'defaultOpen',
      label: 'Mở menu thả xuống theo mặc định',
      component: 'Checkbox',
    },
  ],
  Checkbox: [
    {
      name: 'indeterminate',
      label: 'Đặt trạng thái indeterminate',
      component: 'Checkbox',
    },
  ],
  CheckboxGroup: [],
  RadioGroup: [
    {
      name: 'defaultValue',
      label: 'Giá trị mặc định',
      component: 'Input',
      componentProps: {
        placeholder: 'Vui lòng nhập giá trị mặc định',
      },
    },
    {
      name: 'buttonStyle',
      label: 'Kiểu phong cách của RadioButton',
      component: 'RadioGroup',
      componentProps: {
        options: [
          {
            label: 'outline',
            value: 'outline',
          },
          {
            label: 'solid',
            value: 'solid',
          },
        ],
      },
    },
    {
      name: 'optionType',
      label: 'optionsLoại',
      component: 'RadioGroup',
      componentProps: {
        options: [
          {
            label: 'Mặc định',
            value: 'default',
          },
          {
            label: 'Nút',
            value: 'button',
          },
        ],
        //Cập nhật giá trị cấu hình control của chính nó theo giá trị của các lựa chọn khác
        //compProp là thuộc tính của component hiện tại,
        //configProps, tất cả các tùy chọn cấu hình của component hiện tại
        //self, thuộc tính componentProps của cấu hình hiện tại
        //Trả về giá trị truthy để cập nhật
        // _propsFunc: (compProp, configProps, self) => {
        //   console.log("i'm called");
        //   console.log(compProp, configProps, self);
        //   if (compProp['buttonStyle'] && compProp['buttonStyle'] == 'outline') {
        //     if (!self['disabled']) {
        //       self['disabled'] = true;
        //       return 1;
        //     }
        //   } else {
        //     if (self['disabled']) {
        //       self['disabled'] = false;
        //       return 1;
        //     }
        //   }

        //   // return prop.optionType == 'button';
        // },
      },
    },
    {
      name: 'size',
      label: 'Kích thước',
      component: 'RadioGroup',
      componentProps: {
        options: [
          {
            label: 'Mặc định',
            value: 'default',
          },
          {
            label: 'Lớn',
            value: 'large',
          },
          {
            label: 'Nhỏ',
            value: 'small',
          },
        ],
      },
    },
  ],
  DatePicker: [
    {
      name: 'format',
      label: 'Định dạng hiển thị (format)',
      component: 'Input',
      componentProps: {
        placeholder: 'YYYY-MM-DD',
      },
    },
    {
      name: 'valueFormat',
      label: 'Định dạng giá trị ràng buộc (valueFormat)',
      component: 'Input',
      componentProps: {
        placeholder: 'YYYY-MM-DD',
      },
    },
  ],
  RangePicker: [
    {
      name: 'placeholder',
      label: 'Placeholder',
      children: [
        {
          name: '',
          label: '',
          component: 'Input',
        },
        {
          name: '',
          label: '',
          component: 'Input',
        },
      ],
    },
    {
      name: 'format',
      label: 'Định dạng hiển thị (format)',
      component: 'Input',
      componentProps: {
        placeholder: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      name: 'valueFormat',
      label: 'Định dạng giá trị ràng buộc (valueFormat)',
      component: 'Input',
      componentProps: {
        placeholder: 'YYYY-MM-DD',
      },
    },
  ],
  MonthPicker: [
    {
      name: 'format',
      label: 'Định dạng hiển thị (format)',
      component: 'Input',
      componentProps: {
        placeholder: 'YYYY-MM',
      },
    },
    {
      name: 'valueFormat',
      label: 'Định dạng giá trị ràng buộc (valueFormat)',
      component: 'Input',
      componentProps: {
        placeholder: 'YYYY-MM',
      },
    },
  ],
  TimePicker: [
    {
      name: 'format',
      label: 'Định dạng hiển thị (format)',
      component: 'Input',
      componentProps: {
        placeholder: 'YYYY-MM',
      },
    },
    {
      name: 'valueFormat',
      label: 'Định dạng giá trị ràng buộc (valueFormat)',
      component: 'Input',
      componentProps: {
        placeholder: 'YYYY-MM',
      },
    },
  ],
  Slider: [
    {
      name: 'defaultValue',
      label: 'Giá trị mặc định',
      component: 'InputNumber',
      componentProps: {
        placeholder: 'Vui lòng nhập giá trị mặc định',
      },
    },
    {
      name: 'min',
      label: 'Giá trị tối thiểu',
      component: 'InputNumber',
      componentProps: {
        placeholder: 'Vui lòng nhập giá trị tối thiểu',
      },
    },
    {
      name: 'max',
      label: 'Giá trị tối đa',
      component: 'InputNumber',
      componentProps: {
        placeholder: 'Vui lòng nhập giá trị tối đa',
      },
    },
    {
      name: 'step',
      label: 'Bước nhảy',
      component: 'InputNumber',
      componentProps: {
        placeholder: 'Vui lòng nhập bước nhảy',
      },
    },
    {
      name: 'tooltipPlacement',
      label: 'Vị trí hiển thị Tooltip',
      component: 'Select',
      componentProps: {
        options: [
          { value: 'top', label: 'Trên' },
          { value: 'left', label: 'Trái' },
          { value: 'right', label: 'Phải' },
          { value: 'bottom', label: 'Dưới' },
          { value: 'topLeft', label: 'Trên phải' },
          { value: 'topRight', label: 'Trên trái' },
          { value: 'bottomLeft', label: 'Phải dưới' },
          { value: 'bottomRight', label: 'Trái dưới' },
          { value: 'leftTop', label: 'Trái dưới' },
          { value: 'leftBottom', label: 'Trái trên' },
          { value: 'rightTop', label: 'Phải dưới' },
          { value: 'rightBottom', label: 'Phải trên' },
        ],
      },
    },
    {
      name: 'tooltipVisible',
      label: 'Luôn hiển thị Tooltip',
      component: 'Checkbox',
    },
    {
      name: 'dots',
      label: 'Chỉ có thể kéo đến vạch chia',
      component: 'Checkbox',
    },
    {
      name: 'range',
      label: 'Chế độ hai thanh trượt',
      component: 'Checkbox',
    },
    {
      name: 'reverse',
      label: 'Trục tọa độ ngược',
      component: 'Checkbox',
    },
    {
      name: 'vertical',
      label: 'Hướng dọc',
      component: 'Checkbox',
    },
    {
      name: 'included',
      label: 'Giá trị là quan hệ bao hàm',
      component: 'Checkbox',
    },
  ],
  Rate: [
    {
      name: 'defaultValue',
      label: 'Giá trị mặc định',
      component: 'InputNumber',
      componentProps: {
        placeholder: 'Vui lòng nhập giá trị mặc định',
      },
    },
    {
      name: 'character',
      label: 'Ký tự tùy chỉnh',
      component: 'Input',
      componentProps: {
        placeholder: 'Vui lòng nhập ký tự tùy chỉnh',
      },
    },
    {
      name: 'count',
      label: 'Tổng số start',
      component: 'InputNumber',
      componentProps: {
        placeholder: 'Vui lòng nhập ký tự tùy chỉnh',
      },
    },
  ],
  Switch: [
    {
      name: 'checkedChildren',
      label: 'Nội dung khi được chọn',
      component: 'Input',
      componentProps: {
        placeholder: 'Vui lòng nhập nội dung khi được chọn',
      },
    },
    {
      name: 'checkedValue',
      label: 'Giá trị khi được chọn',
      component: 'Input',
      componentProps: {
        placeholder: 'Vui lòng nhập giá trị khi được chọn',
      },
    },
    {
      name: 'unCheckedChildren',
      label: 'Nội dung khi không được chọn',
      component: 'Input',
      componentProps: {
        placeholder: 'Vui lòng nhập nội dung khi không được chọn',
      },
    },
    {
      name: 'unCheckedValue',
      label: 'Giá trị khi không được chọn',
      component: 'Input',
      componentProps: {
        placeholder: 'Vui lòng nhập giá trị khi không được chọn',
      },
    },
    {
      name: 'loading',
      label: 'Công tắc đang tải',
      component: 'Checkbox',
    },
    {
      name: 'size',
      label: 'Kích thước',
      component: 'RadioGroup',
      componentProps: {
        options: [
          {
            label: 'Mặc định',
            value: 'default',
          },
          {
            label: 'Nhỏ',
            value: 'small',
          },
        ],
      },
    },
  ],
  TreeSelect: [
    {
      name: 'defaultValue',
      label: 'Giá trị mặc định',
      component: 'Input',
      componentProps: {
        placeholder: 'Vui lòng nhập giá trị mặc định',
      },
    },
    {
      name: 'searchPlaceholder',
      label: 'Văn bản mặc định của hộp tìm kiếm',
      component: 'Input',
      componentProps: {
        placeholder: 'Vui lòng nhập văn bản mặc định của hộp tìm kiếm',
      },
    },
    {
      name: 'treeNodeFilterProp',
      label: 'Thuộc tính treeNode tương ứng để lọc mục nhập',
      component: 'Input',
      componentProps: {
        defaultValue: 'value',
      },
    },
    {
      name: 'treeNodeLabelProp',
      label: 'Đặt làm prop hiển thị',
      component: 'Input',
      componentProps: {
        defaultValue: 'title',
      },
    },
    {
      name: 'dropdownClassName',
      label: 'Thuộc tính className của menu thả xuống',
      component: 'Input',
      componentProps: {
        placeholder: 'Vui lòng nhập thuộc tính className của menu thả xuống',
      },
    },

    {
      name: 'labelInValue',
      label: 'Gói label của lựa chọn vào value',
      component: 'Checkbox',
    },
    {
      name: 'treeIcon',
      label: 'Hiển thị biểu tượng trước title của TreeNode',
      component: 'Checkbox',
    },
    {
      name: 'treeCheckable',
      label: 'Lựa chọn có thể đánh dấu',
      component: 'Checkbox',
    },
    {
      name: 'treeCheckStrictly',
      label: 'Lựa chọn nút được kiểm soát hoàn toàn',
      component: 'Checkbox',
    },
    {
      name: 'treeDefaultExpandAll',
      label: 'Mở tất cả theo mặc định',
      component: 'Checkbox',
    },
    {
      name: 'treeLine',
      label: 'Có hiển thị kiểu đường kẻ hay không',
      component: 'Checkbox',
    },
    {
      name: 'maxTagCount',
      label: 'Hiển thị tối đa bao nhiêu tag',
      component: 'InputNumber',
      componentProps: {
        placeholder: 'Hiển thị tối đa bao nhiêu tag',
      },
    },
    {
      name: 'size',
      label: 'Kích thước',
      component: 'RadioGroup',
      componentProps: {
        options: [
          {
            label: 'Mặc định',
            value: 'default',
          },
          {
            label: 'Nhỏ',
            value: 'small',
          },
        ],
      },
    },
  ],
  Cascader: [
    {
      name: 'expandTrigger',
      label: 'Cách mở cấp con (mặc định click)',
      component: 'RadioGroup',
      componentProps: {
        options: [
          {
            label: 'click',
            value: 'click',
          },
          {
            label: 'hover',
            value: 'hover',
          },
        ],
      },
    },
  ],
  Button: [
    {
      name: 'type',
      label: 'Loại',
      component: 'RadioGroup',
      componentProps: {
        options: [
          {
            label: 'default',
            value: 'default',
          },
          {
            label: 'primary',
            value: 'primary',
          },
          {
            label: 'danger',
            value: 'danger',
          },
          {
            label: 'dashed',
            value: 'dashed',
          },
        ],
      },
    },
    {
      name: 'handle',
      label: 'Thao tác',
      component: 'RadioGroup',
      componentProps: {
        options: [
          {
            label: 'Gửi',
            value: 'submit',
          },
          {
            label: 'Đặt lại',
            value: 'reset',
          },
        ],
      },
    },
  ],
  Upload: [
    {
      name: 'action',
      label: 'Địa chỉ tải lên',
      component: 'Input',
    },
    {
      name: 'name',
      label: 'Tên tham số tệp đính kèm (name)',
      component: 'Input',
    },
  ],
  // ColorPicker: [
  //   {
  //     name: 'defaultValue',
  //     label: 'Giá trị mặc định',
  //     component: 'AColorPicker',
  //   },
  // ],
  Avatar: [
    {
      name: 'alt',
      label: 'Văn bản thay thế khi hình ảnh không hiển thị được',
      component: 'Input',
    },
    {
      name: 'crossOrigin',
      label: 'Cài đặt thuộc tính cors',
      component: 'Select',
      componentProps: {
        options: [
          { value: 'anonymous', label: 'Ẩn danh' },
          { value: 'use-credentials', label: 'Sử dụng thông tin xác thực' },
          { value: '', label: 'Không có' },
        ],
      },
    },
    {
      name: 'draggable',
      label: 'Hình ảnh có cho phép kéo hay không',
      component: 'Switch',
    },
    {
      name: 'gap',
      label: 'Số pixel khoảng cách từ loại ký tự đến biên trái và phải',
      component: 'InputNumber',
    },
    {
      name: 'icon',
      label: 'Đặt loại biểu tượng của ảnh đại diện',
      component: 'Input',
    },
    {
      name: 'shape',
      label: 'Chỉ định hình dạng của ảnh đại diện',
      component: 'Select',
      componentProps: {
        options: [
          { value: 'circle', label: 'Hình tròn' },
          { value: 'square', label: 'Hình vuông' },
        ],
        value: 'circle'
      },
    },
  ],
  Descriptions: [
    {
      name: 'title',
      label: 'Tiêu đề của danh sách mô tả, hiển thị ở trên cùng',
      component: 'Input',
    },
    {
      name: 'bordered',
      label: 'Có hiển thị viền hay không',
      component: 'Switch',
    },
    {
      name: 'colon',
      label: 'Cấu hình giá trị mặc định của colon trong Descriptions.Item',
      component: 'Switch',
      componentProps: {
        defaultChecked: true,
      }
    },
    {
      name: 'column',
      label: 'Số lượng DescriptionItems trên một hàng',
      component: 'InputNumber',
    },
    {
      name: 'layout',
      label: 'Bố cục mô tả',
      component: 'Select',
      componentProps: {
        options: [
          { value: 'horizontal', label: 'Ngang' },
          { value: 'vertical', label: 'Dọc' },
        ],
        value: 'horizontal'
      },
    },
  ],
  Table: [
    {
      name: 'Mô tả cấu hình cột bảng',
      label: 'Mảng dữ liệu',
    },
    {
      name: 'dataSource',
      label: 'Mảng dữ liệu',
    },
  ],
  slot: [
    {
      name: 'slotName',
      label: 'Tên slot',
      component: 'Input',
    },
  ],
  Transfer: [
    // {
    //   name: 'operations',
    //   label: 'Tập hợp văn bản thao tác, thứ tự từ trên xuống dưới',
    //   component: 'Input',
    //   componentProps: {
    //     type: 'text',
    //     // defaultValue: ['>', '<'],
    //   },
    // },
    // {
    //   name: 'titles',
    //   label: 'Tập hợp tiêu đề, thứ tự từ trái sang phải',
    //   component: 'Input',
    //   componentProps: {
    //     type: 'text',
    //     // defaultValue: ['', ''],
    //   },
    // },
    {
      name: 'oneWay',
      label: 'Hiển thị theo kiểu một chiều',
      component: 'Checkbox',
    },
    {
      name: 'pagination',
      label: 'Sử dụng kiểu phân trang',
      component: 'Checkbox',
    },
    {
      name: 'showSelectAll',
      label: 'Hiển thị hộp kiểm chọn tất cả',
      component: 'Checkbox',
    },
  ],
};

function deleteProps(list: Omit<IBaseFormAttrs, 'tag'>[], key: string) {
  list.forEach((element, index) => {
    if (element.name == key) {
      list.splice(index, 1);
    }
  });
}

componentAttrs['StrengthMeter'] = componentAttrs['Input'];
componentAttrs['StrengthMeter'].push({
  name: 'visibilityToggle',
  label: 'Có hiển thị nút chuyển đổi hay không',
  component: 'Checkbox',
});

deleteProps(componentAttrs['StrengthMeter'], 'type');
deleteProps(componentAttrs['StrengthMeter'], 'prefix');
deleteProps(componentAttrs['StrengthMeter'], 'defaultValue');
deleteProps(componentAttrs['StrengthMeter'], 'suffix');
//Thuộc tính component
// Thuộc tính name của control
export const baseComponentAttrs: IBaseComponentProps = componentAttrs;

//Tìm mục cần cấu hình trong tất cả các lựa chọn
const findCompoentProps = (props, name) => {
  const idx = props.findIndex((value: BaseFormAttrs, _index) => {
    return value.name == name;
  });
  if (idx) {
    if (props[idx].componentProps) {
      return props[idx].componentProps;
    }
  }
};

// Cập nhật giá trị cấu hình control của chính nó theo giá trị của các lựa chọn khác
export const componentPropsFuncs = {
  RadioGroup: (compProp, options: BaseFormAttrs[]) => {
    const props = findCompoentProps(options, 'size');
    if (props) {
      if (compProp['optionType'] && compProp['optionType'] != 'button') {
        props['disabled'] = true;
        compProp['size'] = null;
      } else {
        props['disabled'] = false;
      }
    }
  },
};
