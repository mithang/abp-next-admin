<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { Card, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';

const [QueryForm] = useVbenForm({
  // Mặc định mở rộng
  collapsed: false,
  // Tất cả các mục form dùng chung, có thể ghi đè riêng trong form
  commonConfig: {
    // Tất cả các mục form
    componentProps: {
      class: 'w-full',
    },
  },
  // Hàm submit
  handleSubmit: onSubmit,
  // Bố cục dọc, label và input ở các dòng khác nhau, giá trị là vertical
  // Bố cục ngang, label và input trên cùng một dòng
  layout: 'horizontal',
  schema: [
    {
      // Component cần được đăng ký trong #/adapter.ts và thêm kiểu
      component: 'Input',
      // Tham số tương ứng của component
      componentProps: {
        placeholder: 'Vui lòng nhập tên đăng nhập',
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
      label: 'Số (kèm hậu tố)',
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
    content: 'Truy vấn',
  },
  // Màn hình lớn hiển thị 3 mục mỗi hàng, màn hình vừa 2 mục mỗi hàng, màn hình nhỏ 1 mục mỗi hàng
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
});

const [InlineForm] = useVbenForm({
  layout: 'inline',
  schema: [
    {
      // Component cần được đăng ký trong #/adapter.ts và thêm kiểu
      component: 'Input',
      // Tham số tương ứng của component
      componentProps: {
        placeholder: 'Vui lòng nhập tên đăng nhập',
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
      label: 'Số (kèm hậu tố)',
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
  ],
});

const [QueryForm1] = useVbenForm({
  // Mặc định mở rộng
  collapsed: true,
  collapsedRows: 2,
  // Tất cả các mục form dùng chung, có thể ghi đè riêng trong form
  commonConfig: {
    // Tất cả các mục form
    componentProps: {
      class: 'w-full',
    },
  },
  // Hàm submit
  handleSubmit: onSubmit,
  // Bố cục dọc, label và input ở các dòng khác nhau, giá trị là vertical
  // Bố cục ngang, label và input trên cùng một dòng
  layout: 'horizontal',
  schema: (() => {
    const schema = [];
    for (let index = 0; index < 14; index++) {
      schema.push({
        // Component cần được đăng ký trong #/adapter.ts và thêm kiểu
        component: 'Input',
        // Tên trường
        fieldName: `field${index}`,
        // Label hiển thị trên giao diện
        label: `Trường${index}`,
      });
    }
    return schema;
  })(),
  // Có thể mở rộng hay không
  showCollapseButton: true,
  submitButtonOptions: {
    content: 'Truy vấn',
  },
  // Màn hình lớn hiển thị 3 mục mỗi hàng, màn hình vừa 2 mục mỗi hàng, màn hình nhỏ 1 mục mỗi hàng
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
});

const [QueryForm2] = useVbenForm({
  // Nhóm nút thao tác newLine: hiển thị trên dòng mới. rowEnd: hiển thị trong dòng, căn phải (mặc định). inline: dùng kiểu grid mặc định
  actionLayout: 'newLine',
  actionPosition: 'left', // Nhóm nút thao tác hiển thị ở phía bên trái
  // Mặc định thu gọn
  collapsed: true,
  collapsedRows: 3,
  // Tất cả các mục form dùng chung, có thể ghi đè riêng trong form
  commonConfig: {
    // Tất cả các mục form
    componentProps: {
      class: 'w-full',
    },
  },
  // Hàm submit
  handleSubmit: onSubmit,
  // Bố cục dọc, label và input ở các dòng khác nhau, giá trị là vertical
  // Bố cục ngang, label và input trên cùng một dòng
  layout: 'vertical',
  schema: [
    {
      // Component cần được đăng ký trong #/adapter.ts và thêm kiểu
      component: 'Input',
      // Tham số tương ứng của component
      componentProps: {
        placeholder: 'Vui lòng nhập tên đăng nhập',
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
      label: 'Số (kèm hậu tố)',
      suffix: () => '¥',
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
    content: 'Truy vấn',
  },
  // Màn hình lớn hiển thị 3 mục mỗi hàng, màn hình vừa 2 mục mỗi hàng, màn hình nhỏ 1 mục mỗi hàng
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
});

function onSubmit(values: Record<string, any>) {
  message.success({
    content: `form values: ${JSON.stringify(values)}`,
  });
}
</script>

<template>
  <Page
    description="Form truy vấn, thường dùng kết hợp với bảng, có thể thu gọn/mở rộng."
    title="Component form"
  >
    <Card class="mb-5" title="Form truy vấn, mặc định mở rộng">
      <QueryForm />
    </Card>

    <Card class="mb-5" title="Form truy vấn, form một dòng">
      <InlineForm />
    </Card>

    <Card class="mb-5" title="Form truy vấn, mặc định mở rộng, bố cục dọc">
      <QueryForm2 />
    </Card>

    <Card title="Form truy vấn, mặc định thu gọn, giữ lại 2 hàng khi thu gọn">
      <QueryForm1 />
    </Card>
  </Page>
</template>
