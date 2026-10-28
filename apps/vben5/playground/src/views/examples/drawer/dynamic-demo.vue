<script lang="ts" setup>
import { useVbenDrawer } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';

const [Drawer, drawerApi] = useVbenDrawer({
  onCancel() {
    drawerApi.close();
  },
  onConfirm() {
    message.info('onConfirm');
    // drawerApi.close();
  },
  title: 'Ví dụ thay đổi cấu hình động',
});

// const state = drawerApi.useStore();

function handleUpdateTitle() {
  drawerApi.setState({ title: 'Tiêu đề động bên trong' });
}
</script>
<template>
  <Drawer>
    <div class="flex-col-center">
      <Button class="mb-3" type="primary" @click="handleUpdateTitle()">
        Thay đổi tiêu đề động bên trong
      </Button>
    </div>
  </Drawer>
</template>
