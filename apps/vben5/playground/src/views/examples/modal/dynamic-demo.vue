<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';

const [Modal, modalApi] = useVbenModal({
  draggable: true,
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    message.info('onConfirm');
    // modalApi.close();
  },
  title: 'Ví dụ sửa đổi cấu hình động',
});

const state = modalApi.useStore();

function handleUpdateTitle() {
  modalApi.setState({ title: 'Tiêu đề động bên trong' });
}

function handleToggleFullscreen() {
  modalApi.setState((prev) => {
    return { ...prev, fullscreen: !prev.fullscreen };
  });
}
</script>
<template>
  <Modal>
    <div class="flex-col-center">
      <Button class="mb-3" type="primary" @click="handleUpdateTitle()">
        Sửa đổi tiêu đề động bên trong
      </Button>
      <Button class="mb-3" type="primary" @click="handleToggleFullscreen()">
        {{ state.fullscreen ? 'Thoát toàn màn hình' : 'Mở toàn màn hình' }}
      </Button>
    </div>
  </Modal>
</template>
