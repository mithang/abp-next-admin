<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

const [Modal, modalApi] = useVbenModal({
  draggable: true,
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    message.info('onConfirm');
    // modalApi.close();
  },
});
</script>
<template>
  <Modal title="Ví dụ có thể kéo thả">
    Di chuyển chuột lên header để kéo thả hộp thoại
  </Modal>
</template>
