<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

const data = ref();

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    console.info('onConfirm');
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      data.value = modalApi.getData<Record<string, any>>();
    }
  },
});
</script>
<template>
  <Modal title="Ví dụ chia sẻ dữ liệu">
    <div class="flex-col-center">Dữ liệu truyền từ bên ngoài: {{ data }}</div>
  </Modal>
</template>
