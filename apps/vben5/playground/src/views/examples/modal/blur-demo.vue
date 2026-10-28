<script lang="ts" setup>
import { ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Slider } from 'ant-design-vue';

const blur = ref(5);
const [Modal, modalApi] = useVbenModal({
  overlayBlur: blur.value,
});
watch(blur, (val) => {
  modalApi.setState({
    overlayBlur: val,
  });
});
</script>
<template>
  <Modal title="Làm mờ lớp phủ">
    <p>Điều chỉnh thanh trượt để thay đổi độ mờ của lớp phủ:{{ blur }}</p>
    <Slider v-model:value="blur" :max="30" :min="0" />
  </Modal>
</template>
