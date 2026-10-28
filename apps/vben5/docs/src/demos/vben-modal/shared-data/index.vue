<script lang="ts" setup>
import { useVbenModal, VbenButton } from '@vben/common-ui';

import ExtraModal from './modal.vue';

const [Modal, modalApi] = useVbenModal({
  // Kết nối component đã tách ra
  connectedComponent: ExtraModal,
});

function openModal() {
  modalApi
    .setData({
      content: 'Dữ liệu truyền từ bên ngoài content',
      payload: 'Dữ liệu truyền từ bên ngoài payload',
    })
    .open();
}
</script>

<template>
  <div>
    <Modal />

    <VbenButton @click="openModal">Open</VbenButton>
  </div>
</template>
