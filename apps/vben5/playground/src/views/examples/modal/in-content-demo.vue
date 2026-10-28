<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Input, message } from 'ant-design-vue';

const [Modal, modalApi] = useVbenModal({
  destroyOnClose: false,
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    message.info('onConfirm');
    // modalApi.close();
  },
});
const value = ref();
</script>
<template>
  <Modal
    append-to-main
    class="w-[600px]"
    title="Ví dụ popup cơ bản"
    title-tooltip="Nội dung gợi ý tiêu đề"
  >
    Popup này được chỉ định mở trong vùng nội dung, và sau khi đóng thì nội dung
    popup sẽ không bị hủy
    <Input v-model:value="value" placeholder="Kiểm tra KeepAlive" />
  </Modal>
</template>
