<script lang="ts" setup>
import { useVbenModal, VbenButton } from '@vben/common-ui';

const [Modal, modalApi] = useVbenModal({
  draggable: true,
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    console.info('onConfirm');
  },
  title: 'Ví dụ sửa đổi cấu hình động',
});

const state = modalApi.useStore();

function handleUpdateTitle() {
  modalApi.setState({ title: 'Tiêu đề động nội bộ' });
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
      <VbenButton class="mb-3" type="primary" @click="handleUpdateTitle()">
        Sửa đổi tiêu đề động nội bộ
      </VbenButton>
      <VbenButton class="mb-3" @click="handleToggleFullscreen()">
        {{ state.fullscreen ? 'Thoát toàn màn hình' : 'Mở toàn màn hình' }}
      </VbenButton>
    </div>
  </Modal>
</template>
