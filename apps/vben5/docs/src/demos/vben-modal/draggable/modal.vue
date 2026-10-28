<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';

const [Modal] = useVbenModal({
  draggable: true,
});
</script>
<template>
  <Modal title="Ví dụ kéo thả"> modal content </Modal>
</template>
