<script lang="ts" setup>
import { useVbenDrawer } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';

const [Drawer, drawerApi] = useVbenDrawer({
  onCancel() {
    drawerApi.close();
  },
  onClosed() {
    drawerApi.setState({ overlayBlur: 0, placement: 'right' });
  },
  onConfirm() {
    message.info('onConfirm');
    // drawerApi.close();
  },
});

function lockDrawer() {
  drawerApi.lock();
  setTimeout(() => {
    drawerApi.unlock();
  }, 3000);
}
</script>
<template>
  <Drawer title="Ví dụ ngăn kéo cơ bản" title-tooltip="Nội dung gợi ý tiêu đề">
    <template #extra> extra </template>
    base demo
    <Button type="primary" @click="lockDrawer">Khóa trạng thái ngăn kéo</Button>
    <!-- <template #prepend-footer> slot </template> -->
    <!-- <template #append-footer> prepend slot </template> -->
    <!-- <template #center-footer> center slot </template> -->
  </Drawer>
</template>
