<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
  onClosed() {
    message.info('onClosed：Hoạt ảnh đóng đã kết thúc');
  },
  onConfirm() {
    message.info('onConfirm');
    // modalApi.close();
  },
  onOpened() {
    message.info('onOpened：Hoạt ảnh mở đã kết thúc');
  },
});

function lockModal() {
  modalApi.lock();
  setTimeout(() => {
    modalApi.unlock();
  }, 3000);
}
</script>
<template>
  <Modal
    class="w-[600px]"
    title="Ví dụ popup cơ bản"
    title-tooltip="Nội dung gợi ý tiêu đề"
  >
    base demo
    <Button type="primary" @click="lockModal">Khóa popup</Button>
  </Modal>
</template>
