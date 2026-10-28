<script lang="ts" setup>
import { useVbenModal, VbenButton } from '@vben/common-ui';

import ExtraModal from './modal.vue';

const [Modal, modalApi] = useVbenModal({
  // Kết nối component đã tách ra
  connectedComponent: ExtraModal,
});

function openModal() {
  modalApi.open();
}

function handleUpdateTitle() {
  modalApi.setState({ title: 'Tiêu đề động bên ngoài' }).open();
}
</script>

<template>
  <div>
    <Modal />

    <VbenButton @click="openModal">Open</VbenButton>
    <VbenButton class="ml-2" type="primary" @click="handleUpdateTitle">
      Sửa tiêu đề từ bên ngoài và mở
    </VbenButton>
  </div>
</template>
