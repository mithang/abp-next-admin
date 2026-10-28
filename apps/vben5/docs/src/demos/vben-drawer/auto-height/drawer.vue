<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenDrawer, VbenButton } from '@vben/common-ui';

const list = ref<number[]>([]);

const [Drawer, drawerApi] = useVbenDrawer({
  onCancel() {
    drawerApi.close();
  },
  onConfirm() {
    console.log('onConfirm');
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      handleUpdate(10);
    }
  },
});

function handleUpdate(len: number) {
  drawerApi.setState({ loading: true });
  setTimeout(() => {
    list.value = Array.from({ length: len }, (_v, k) => k + 1);
    drawerApi.setState({ loading: false });
  }, 2000);
}
</script>
<template>
  <Drawer title="Tự động tính chiều cao">
    <div
      v-for="item in list"
      :key="item"
      class="flex-center h-[220px] w-full bg-muted even:bg-heavy"
    >
      {{ item }}
    </div>
    <template #prepend-footer>
      <VbenButton type="link" @click="handleUpdate(6)">
        Nhấn để cập nhật dữ liệu
      </VbenButton>
    </template>
  </Drawer>
</template>
