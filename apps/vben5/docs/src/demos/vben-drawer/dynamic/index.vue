<script lang="ts" setup>
import { useVbenDrawer, VbenButton } from '@vben/common-ui';

import ExtraDrawer from './drawer.vue';

const [Drawer, drawerApi] = useVbenDrawer({
  // Kết nối component đã tách ra
  connectedComponent: ExtraDrawer,
});

function open() {
  drawerApi.open();
}

function handleUpdateTitle() {
  drawerApi.setState({ title: 'Tiêu đề động bên ngoài' }).open();
}
</script>

<template>
  <div>
    <Drawer />

    <VbenButton @click="open">Open</VbenButton>
    <VbenButton class="ml-2" type="primary" @click="handleUpdateTitle">
      Sửa tiêu đề từ bên ngoài và mở
    </VbenButton>
  </div>
</template>
