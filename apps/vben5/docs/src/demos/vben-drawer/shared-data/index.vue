<script lang="ts" setup>
import { useVbenDrawer, VbenButton } from '@vben/common-ui';

import ExtraDrawer from './drawer.vue';

const [Drawer, drawerApi] = useVbenDrawer({
  // Kết nối component đã tách ra
  connectedComponent: ExtraDrawer,
});

function open() {
  drawerApi
    .setData({
      content: 'Dữ liệu truyền từ bên ngoài content',
      payload: 'Dữ liệu truyền từ bên ngoài payload',
    })
    .open();
}
</script>

<template>
  <div>
    <Drawer />

    <VbenButton @click="open">Open</VbenButton>
  </div>
</template>
