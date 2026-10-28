<script lang="ts" setup>
import { message } from 'ant-design-vue';

import { useVbenForm, z } from '#/adapter/form';

const [Form] = useVbenForm({
  // Dùng chung cho tất cả các trường biểu mẫu, có thể ghi đè riêng trong biểu mẫu
  commonConfig: {
    // Tất cả các trường biểu mẫu
    componentProps: {
      class: 'w-full',
    },
  },
  // Hàm gửi
  handleSubmit: onSubmit,
  // Bố cục dọc, label và input ở các dòng khác nhau, giá trị là vertical
  // Bố cục ngang, label và input trên cùng một dòng
  scrollToFirstError: true,
  layout: 'horizontal',
  schema: [
    {
      // Component cần đăng ký trong #/adapter.ts và thêm kiểu
      component: 'Input',
      // Tham số của component tương ứng
      componentProps: {
        placeholder: 'Vui lòng nhập',
      },
      // Tên trường
      fieldName: 'field1',
      // label hiển thị trên giao diện
      label: 'Trường 1',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: 'Vui lòng nhập',
      },
      defaultValue: 'Giá trị mặc định',
      fieldName: 'field2',
      label: 'Giá trị mặc định (bắt buộc)',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: 'Vui lòng nhập',
      },
      fieldName: 'field3',
      label: 'Giá trị mặc định (không bắt buộc)',
      rules: z.string().default('Giá trị mặc định').optional(),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: 'Vui lòng nhập',
      },
      fieldName: 'field31',
      label: 'Thông tin tùy chỉnh',
      rules: z.string().min(1, { message: 'Nhập tối thiểu 1 ký tự' }),
    },
    {
      component: 'Input',
      // Tham số của component tương ứng
      componentProps: {
        placeholder: 'Vui lòng nhập',
      },
      // Tên trường
      fieldName: 'field4',
      // label hiển thị trên giao diện
      label: 'Email',
      rules: z.string().email('Vui lòng nhập email chính xác'),
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: 'Vui lòng nhập',
      },
      fieldName: 'number',
      label: 'Số',
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
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
        placeholder: 'Vui lòng chọn',
        showSearch: true,
      },
      defaultValue: undefined,
      fieldName: 'options',
      label: 'Danh sách thả xuống',
      rules: 'selectRequired',
    },
    {
      component: 'RadioGroup',
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
      fieldName: 'radioGroup',
      label: 'Nhóm chọn đơn',
      rules: 'selectRequired',
    },
    {
      component: 'CheckboxGroup',
      componentProps: {
        name: 'cname',
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
      fieldName: 'checkboxGroup',
      label: 'Nhóm chọn nhiều',
      rules: 'selectRequired',
    },
    {
      component: 'Checkbox',
      fieldName: 'checkbox',
      label: '',
      renderComponentContent: () => {
        return {
          default: () => ['Tôi đã đọc và đồng ý'],
        };
      },
      rules: 'selectRequired',
    },
    {
      component: 'DatePicker',
      defaultValue: undefined,
      fieldName: 'datePicker',
      label: 'Hộp chọn ngày',
      rules: 'selectRequired',
    },
    {
      component: 'RangePicker',
      defaultValue: undefined,
      fieldName: 'rangePicker',
      label: 'Hộp chọn khoảng',
      rules: 'selectRequired',
    },
    {
      component: 'InputPassword',
      componentProps: {
        placeholder: 'Vui lòng nhập',
      },
      fieldName: 'password',
      label: 'Mật khẩu',
      rules: 'required',
    },
  ],
  wrapperClass: 'grid-cols-1',
});

function onSubmit(values: Record<string, any>) {
  message.success({
    content: `form values: ${JSON.stringify(values)}`,
  });
}
</script>

<template>
  <Form />
</template>
