<script lang="ts" setup>
import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';

const [QueryForm] = useVbenForm({
  // Mở rộng mặc định
  collapsed: false,
  // Dùng chung cho mọi mục form, có thể ghi đè riêng trong form
  commonConfig: {
    // Mọi mục form
    componentProps: {
      class: 'w-full',
    },
  },
  // Hàm submit
  handleSubmit: onSubmit,
  // Bố cục dọc, label và input ở các dòng khác nhau, giá trị là vertical
  // Bố cục ngang, label và input ở cùng một dòng
  layout: 'horizontal',
  schema: [
    {
      // Component cần đăng ký trong #/adapter.ts và thêm kiểu
      component: 'Input',
      // Tham số của component tương ứng
      componentProps: {
        placeholder: 'Vui lòng nhập tên người dùng',
      },
      // Tên trường
      fieldName: 'username',
      // Label hiển thị trên giao diện
      label: 'Chuỗi',
    },
    {
      component: 'InputPassword',
      componentProps: {
        placeholder: 'Vui lòng nhập mật khẩu',
      },
      fieldName: 'password',
      label: 'Mật khẩu',
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: 'Vui lòng nhập',
      },
      fieldName: 'number',
      label: 'Số (có hậu tố)',
      suffix: () => '¥',
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
      fieldName: 'options',
      label: 'Chọn thả xuống',
    },
    {
      component: 'DatePicker',
      fieldName: 'datePicker',
      label: 'Hộp chọn ngày',
    },
  ],
  // Có thể mở rộng hay không
  showCollapseButton: true,
  submitButtonOptions: {
    content: 'Tìm kiếm',
  },
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
});
function onSubmit(values: Record<string, any>) {
  message.success({
    content: `form values: ${JSON.stringify(values)}`,
  });
}
</script>

<template>
  <QueryForm />
</template>
