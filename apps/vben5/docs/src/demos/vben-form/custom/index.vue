<script lang="ts" setup>
import { h } from 'vue';

import { Input, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';

const [Form] = useVbenForm({
  // Dùng chung cho mọi trường biểu mẫu, có thể ghi đè riêng trong biểu mẫu
  commonConfig: {
    // Mọi trường biểu mẫu
    componentProps: {
      class: 'w-full',
    },
    labelClass: 'w-2/6',
  },
  // Hàm submit
  handleSubmit: onSubmit,
  // Bố cục dọc, label và input ở các dòng khác nhau, giá trị là vertical
  // Bố cục ngang, label và input ở cùng một dòng
  layout: 'horizontal',
  schema: [
    {
      // Component cần được đăng ký trong #/adapter.ts và kèm theo kiểu
      component: 'Input',
      fieldName: 'field',
      label: 'Hậu tố tùy chỉnh',
      suffix: () => h('span', { class: 'text-red-600' }, 'đ'),
    },
    {
      component: 'Input',
      fieldName: 'field1',
      label: 'Component tùy chỉnh (slot)',
      renderComponentContent: () => ({
        prefix: () => 'prefix',
        suffix: () => 'suffix',
      }),
    },
    {
      component: h(Input, { placeholder: 'Vui lòng nhập' }),
      fieldName: 'field2',
      label: 'Component tùy chỉnh',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'field3',
      label: 'Component tùy chỉnh (slot)',
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
  <Form>
    <template #field3="slotProps">
      <Input placeholder="Vui lòng nhập" v-bind="slotProps" />
    </template>
  </Form>
</template>
