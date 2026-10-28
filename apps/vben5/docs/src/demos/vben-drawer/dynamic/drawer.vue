<script lang="ts" setup>
import { useVbenDrawer, VbenButton } from '@vben/common-ui';

const [Drawer, drawerApi] = useVbenDrawer({
  onCancel() {
    drawerApi.close();
  },
  onConfirm() {
    console.info('onConfirm');
  },
  title: 'Ví dụ sửa đổi cấu hình động',
});

function handleUpdateTitle() {
  drawerApi.setState({ title: 'Tiêu đề động nội bộ' });
}
</script>
<template>
  <Drawer>
    <div class="flex-col-center">
      <VbenButton class="mb-3" type="primary" @click="handleUpdateTitle()">
        Sửa đổi tiêu đề động nội bộ
      </VbenButton>
    </div>
  </Drawer>
</template>
