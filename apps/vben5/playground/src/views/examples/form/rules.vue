<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { Button, Card, message } from 'ant-design-vue';

import { useVbenForm, z } from '#/adapter/form';

const [Form, formApi] = useVbenForm({
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
  // Bố cục ngang, label và input ở cùng một dòng
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
      // Label hiển thị trên giao diện
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
      rules: z.string().min(1, { message: 'Nhập ít nhất 1 ký tự' }),
    },
    {
      component: 'Input',
      // Tham số của component tương ứng
      componentProps: {
        placeholder: 'Vui lòng nhập',
      },
      // Tên trường
      fieldName: 'field4',
      // Label hiển thị trên giao diện
      label: 'Email',
      rules: z.string().email('Vui lòng nhập email đúng'),
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
      label: 'Chọn thả xuống',
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
      label: 'Nhóm radio',
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
      label: 'Nhóm checkbox',
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
      rules: z.boolean().refine((value) => value, {
        message: 'Vui lòng tích chọn',
      }),
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
    {
      component: 'Input',
      componentProps: {
        placeholder: 'Vui lòng nhập',
      },
      fieldName: 'input-blur',
      formFieldProps: {
        validateOnChange: false,
        validateOnModelUpdate: false,
      },
      help: 'Chỉ kích hoạt kiểm tra khi blur',
      label: 'Kích hoạt khi blur',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: 'Vui lòng nhập',
      },
      fieldName: 'input-async',
      label: 'Kiểm tra không đồng bộ',
      rules: z
        .string()
        .min(3, 'Tên người dùng cần ít nhất 3 ký tự')
        .refine(
          async (username) => {
            // Giả sử đây là một hàm không đồng bộ, mô phỏng việc kiểm tra tên người dùng đã tồn tại hay chưa
            const checkUsernameExists = async (
              username: string,
            ): Promise<boolean> => {
              await new Promise((resolve) => setTimeout(resolve, 1000));
              return username === 'existingUser';
            };
            const exists = await checkUsernameExists(username);
            return !exists;
          },
          {
            message: 'Tên người dùng đã tồn tại',
          },
        ),
    },
  ],
  // Màn hình lớn hiển thị 3 mục một dòng, màn hình vừa hiển thị 2 mục một dòng, màn hình nhỏ hiển thị 1 mục một dòng
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
});

function onSubmit(values: Record<string, any>) {
  message.success({
    content: `form values: ${JSON.stringify(values)}`,
  });
}
</script>

<template>
  <Page description="Ví dụ kiểm tra form" title="Component form">
    <Card title="Ví dụ kiểm tra component cơ bản">
      <template #extra>
        <Button @click="() => formApi.validate()">Kiểm tra form</Button>
        <Button class="mx-2" @click="() => formApi.resetValidate()">
          Xóa thông tin kiểm tra
        </Button>
      </template>
      <Form />
    </Card>
  </Page>
</template>
