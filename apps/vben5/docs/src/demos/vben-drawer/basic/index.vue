<script lang="ts" setup>
import { useVbenDrawer, VbenButton } from '@vben/common-ui';

const [Drawer, drawerApi] = useVbenDrawer();
</script>
<template>
  <div>
    <VbenButton @click="() => drawerApi.open()">Open</VbenButton>
    <Drawer class="w-[600px]" title="Ví dụ cơ bản"> drawer content </Drawer>
  </div>
</template>
