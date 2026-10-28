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
</script>

<template>
  <div>
    <Modal />
    <VbenButton @click="openModal">Open</VbenButton>
  </div>
</template>
