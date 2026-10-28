<script lang="ts" setup>
import { h } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';

import { ElButton, ElCard, ElCheckbox, ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { getAllMenusApi } from '#/api';

const [Form, formApi] = useVbenForm({
  commonConfig: {
    // Tất cả các mục form
    componentProps: {
      class: 'w-full',
    },
  },
  layout: 'horizontal',
  // Màn hình lớn hiển thị 3 mục mỗi hàng, màn hình vừa 2 mục mỗi hàng, màn hình nhỏ 1 mục mỗi hàng
  // wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  handleSubmit: (values) => {
    ElMessage.success(`Dữ liệu form: ${JSON.stringify(values)}`);
  },
  schema: [
    {
      component: 'IconPicker',
      fieldName: 'icon',
      label: 'IconPicker',
    },
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
    },
    {
      component: 'Input',
      fieldName: 'string',
      label: 'String',
    },
    {
      component: 'InputNumber',
      fieldName: 'number',
      label: 'Number',
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
    },
    {
      component: 'RadioGroup',
      fieldName: 'radioButton',
      label: 'RadioButton',
      componentProps: {
        isButton: true,
        options: ['A', 'B', 'C', 'D', 'E', 'F'].map((v) => ({
          value: v,
          label: `Tùy chọn ${v}`,
        })),
      },
    },
    {
      component: 'CheckboxGroup',
      fieldName: 'checkbox',
      label: 'Checkbox',
      componentProps: {
        options: ['A', 'B', 'C'].map((v) => ({
          value: v,
          label: `Tùy chọn ${v}`,
        })),
      },
    },
    {
      component: 'CheckboxGroup',
      fieldName: 'checkbox1',
      label: 'Checkbox1',
      renderComponentContent: () => {
        return {
          default: () => {
            return ['A', 'B', 'C', 'D'].map((v) =>
              h(ElCheckbox, { label: v, value: v }),
            );
          },
        };
      },
    },
    {
      component: 'CheckboxGroup',
      fieldName: 'checkbotton',
      label: 'CheckBotton',
      componentProps: {
        isButton: true,
        options: [
          { value: 'A', label: 'Tùy chọn A' },
          { value: 'B', label: 'Tùy chọn B' },
          { value: 'C', label: 'Tùy chọn C' },
        ],
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'date',
      label: 'Date',
    },
    {
      component: 'Select',
      fieldName: 'select',
      label: 'Select',
      componentProps: {
        filterable: true,
        options: [
          { value: 'A', label: 'Tùy chọn A' },
          { value: 'B', label: 'Tùy chọn B' },
          { value: 'C', label: 'Tùy chọn C' },
        ],
      },
    },
  ],
});

const [Drawer, drawerApi] = useVbenDrawer();
function setFormValues() {
  formApi.setValues({
    string: 'string',
    number: 123,
    radio: 'B',
    radioButton: 'C',
    checkbox: ['A', 'C'],
    checkbotton: ['B', 'C'],
    checkbox1: ['A', 'B'],
    date: new Date(),
    select: 'B',
  });
}
</script>
<template>
  <Page
    description="Chúng tôi đã đóng gói lại CheckboxGroup, RadioGroup, Select, có thể truyền mảng thuộc tính tùy chọn qua thuộc tính options để tự động tạo tùy chọn"
    title="Demo form"
  >
    <Drawer class="w-[600px]" title="Ví dụ form cơ bản">
      <Form />
    </Drawer>
    <ElCard>
      <template #header>
        <div class="flex items-center">
          <span class="flex-auto">Demo form cơ bản</span>
          <ElButton type="primary" @click="setFormValues">
            Đặt giá trị form
          </ElButton>
        </div>
      </template>
      <ElButton type="primary" @click="drawerApi.open"> Mở ngăn kéo </ElButton>
    </ElCard>
  </Page>
</template>
