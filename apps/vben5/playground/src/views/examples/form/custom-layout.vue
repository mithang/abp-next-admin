<script lang="ts" setup>
import { h } from 'vue';

import { Page } from '@vben/common-ui';

import { Card } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';

import DocButton from '../doc-button.vue';

const [CustomLayoutForm] = useVbenForm({
  // Tất cả các mục form dùng chung, có thể ghi đè riêng trong từng form
  commonConfig: {
    // Tất cả các mục form
    componentProps: {
      class: 'w-full',
    },
  },
  layout: 'horizontal',
  schema: [
    {
      component: 'Select',
      fieldName: 'field1',
      label: 'Chuỗi',
    },
    {
      component: 'TreeSelect',
      fieldName: 'field2',
      label: 'Chuỗi',
    },
    {
      component: 'Mentions',
      fieldName: 'field3',
      label: 'Chuỗi',
    },
    {
      component: 'Input',
      fieldName: 'field4',
      label: 'Chuỗi',
    },
    {
      component: 'InputNumber',
      fieldName: 'field5',
      // Bắt đầu từ cột thứ ba, tương đương với việc bỏ trống một cột ở giữa
      formItemClass: 'col-start-3',
      label: 'Phía trước bỏ trống một cột',
    },
    {
      component: 'Divider',
      fieldName: '_divider',
      formItemClass: 'col-span-3',
      hideLabel: true,
      renderComponentContent: () => {
        return {
          default: () => h('div', 'Đường phân cách'),
        };
      },
    },
    {
      component: 'Textarea',
      fieldName: 'field6',
      // Chiếm đủ không gian ba cột, căn theo baseline
      formItemClass: 'col-span-3 items-baseline',
      label: 'Chiếm đủ ba cột',
    },
    {
      component: 'Input',
      fieldName: 'field7',
      // Chiếm không gian 2 cột, bắt đầu từ cột thứ hai, tương đương với việc phía trước bỏ trống một cột
      formItemClass: 'col-span-2 col-start-2',
      label: 'Chiếm 2 cột',
    },
    {
      component: 'Input',
      fieldName: 'field8',
      // Bỏ trống hai bên trái phải
      formItemClass: 'col-start-2',
      label: 'Bỏ trống trái phải',
    },
    {
      component: 'InputPassword',
      fieldName: 'field9',
      formItemClass: 'col-start-1',
      label: 'Chuỗi',
    },
  ],
  // Tổng cộng ba cột
  wrapperClass: 'grid-cols-3',
});
</script>

<template>
  <Page
    content-class="flex flex-col gap-4"
    description="Dùng tailwind để tùy chỉnh bố cục các mục form"
    title="Bố cục tùy chỉnh của form"
  >
    <template #description>
      <div class="text-muted-foreground">
        <p>
          Dùng tailwind để tùy chỉnh bố cục các mục form, dùng Divider để phân
          cách form.
        </p>
      </div>
    </template>
    <template #extra>
      <DocButton class="mb-2" path="/components/common-ui/vben-form" />
    </template>
    <Card title="Dùng tailwind để tùy chỉnh bố cục">
      <CustomLayoutForm />
    </Card>
  </Page>
</template>
