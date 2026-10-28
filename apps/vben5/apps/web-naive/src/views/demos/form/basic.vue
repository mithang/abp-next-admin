<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { NButton, NCard, useMessage } from 'naive-ui';

import { useVbenForm } from '#/adapter/form';
import { getAllMenusApi } from '#/api';

const message = useMessage();
const [Form, formApi] = useVbenForm({
  commonConfig: {
    // Tất cả các mục form
    componentProps: {
      class: 'w-full',
    },
  },
  layout: 'horizontal',
  // Màn hình lớn hiển thị 3 mục mỗi hàng, màn hình vừa 2 mục mỗi hàng, màn hình nhỏ 1 mục mỗi hàng
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  handleSubmit: (values) => {
    message.success(`Dữ liệu form: ${JSON.stringify(values)}`);
  },
  schema: [
    {
      // Component cần đăng ký trong #/adapter.ts và thêm kiểu
      component: 'ApiSelect',
      // Tham số của component tương ứng
      componentProps: {
        // Chuyển API menu sang định dạng options
        afterFetch: (data: { name: string; path: string }[]) => {
          return data.map((item: any) => ({
            label: item.name,
            value: item.path,
          }));
        },
        // API menu
        api: getAllMenusApi,
      },
      // Tên trường
      fieldName: 'api',
      // Label hiển thị trên giao diện
      label: 'ApiSelect',
      rules: 'required',
    },
    {
      component: 'ApiTreeSelect',
      // Tham số của component tương ứng
      componentProps: {
        // API menu
        api: getAllMenusApi,
        childrenField: 'children',
        // Chuyển API menu sang định dạng options
        labelField: 'name',
        valueField: 'path',
      },
      // Tên trường
      fieldName: 'apiTree',
      // Label hiển thị trên giao diện
      label: 'ApiTreeSelect',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'string',
      label: 'String',
      rules: 'required',
    },
    {
      component: 'InputNumber',
      fieldName: 'number',
      label: 'Number',
      rules: 'required',
    },
    {
      component: 'RadioGroup',
      fieldName: 'radio',
      label: 'Radio',
      componentProps: {
        options: [
          { value: 'A', label: 'A' },
          { value: 'B', label: 'B' },
          { value: 'C', label: 'C' },
          { value: 'D', label: 'D' },
          { value: 'E', label: 'E' },
        ],
      },
      rules: 'selectRequired',
    },
    {
      component: 'RadioGroup',
      fieldName: 'radioButton',
      label: 'RadioButton',
      componentProps: {
        isButton: true,
        class: 'flex flex-wrap', // Nếu có quá nhiều tùy chọn, có thể thêm class để tự động thu gọn
        options: [
          { value: 'A', label: 'Tùy chọn A' },
          { value: 'B', label: 'Tùy chọn B' },
          { value: 'C', label: 'Tùy chọn C' },
          { value: 'D', label: 'Tùy chọn D' },
          { value: 'E', label: 'Tùy chọn E' },
        ],
      },
      rules: 'selectRequired',
    },
    {
      component: 'CheckboxGroup',
      fieldName: 'checkbox',
      label: 'Checkbox',
      componentProps: {
        options: [
          { value: 'A', label: 'Tùy chọn A' },
          { value: 'B', label: 'Tùy chọn B' },
          { value: 'C', label: 'Tùy chọn C' },
        ],
      },
      rules: 'selectRequired',
    },
    {
      component: 'DatePicker',
      fieldName: 'date',
      label: 'Date',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'textArea',
      label: 'TextArea',
      componentProps: {
        type: 'textarea',
      },
      rules: 'required',
    },
  ],
});
function setFormValues() {
  formApi.setValues({
    string: 'string',
    number: 123,
    radio: 'B',
    radioButton: 'C',
    checkbox: ['A', 'C'],
    date: Date.now(),
  });
}
</script>
<template>
  <Page
    description="Adapter form đã đóng gói lại CheckboxGroup và RadioGroup, có thể truyền dữ liệu tùy chọn qua thuộc tính options（dữ liệu tùy chọn sẽ trở thành thuộc tính của component con）"
    title="Demo form"
  >
    <NCard title="Form cơ bản">
      <template #header-extra>
        <NButton type="primary" @click="setFormValues">
          Đặt giá trị form
        </NButton>
      </template>
      <Form />
    </NCard>
  </Page>
</template>
