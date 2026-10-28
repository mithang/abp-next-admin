<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';

import { Button } from 'ant-design-vue';

import DragDemo from './drag-demo.vue';

const [Modal] = useVbenModal({
  destroyOnClose: true,
});
const [BaseModal, baseModalApi] = useVbenModal({
  connectedComponent: DragDemo,
});

function openNestedModal() {
  baseModalApi.open();
}
</script>
<template>
  <Modal title="Ví dụ cửa sổ bật lồng nhau">
    <Button @click="openNestedModal" type="primary">Mở cửa sổ bật con</Button>
    <BaseModal />
  </Modal>
</template>
