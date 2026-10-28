<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { Input, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';

const value = ref('');

const [Form] = useVbenForm({
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: 'Kiểm tra KeepAlive: thành phần nội bộ',
      },
      fieldName: 'field1',
      hideLabel: true,
      label: 'Trường 1',
    },
  ],
  showDefaultActions: false,
});

const [Drawer, drawerApi] = useVbenDrawer({
  destroyOnClose: false,
  onCancel() {
    drawerApi.close();
  },
  onConfirm() {
    message.info('onConfirm');
    // drawerApi.close();
  },
});
</script>
<template>
  <Drawer
    append-to-main
    title="Ví dụ ngăn kéo cơ bản"
    title-tooltip="Nội dung gợi ý tiêu đề"
  >
    <template #extra> extra </template>
    Cửa sổ bật lên này được chỉ định mở trong vùng nội dung, và nội dung cửa sổ
    bật lên sẽ không bị hủy sau khi đóng
    <Input
      v-model:value="value"
      placeholder="Kiểm tra KeepAlive:connectedComponent"
    />
    <Form />
  </Drawer>
</template>
