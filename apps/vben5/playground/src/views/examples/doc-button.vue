<script lang="ts" setup>
import { VBEN_DOC_URL } from '@vben/constants';
import { openWindow } from '@vben/utils';

import { Button } from 'ant-design-vue';

const props = defineProps<{ path: string }>();

function handleClick() {
  // Nếu không có .html, khi mở trang có thể xuất hiện 404
  const path =
    VBEN_DOC_URL +
    (props.path.toLowerCase().endsWith('.html')
      ? props.path
      : `${props.path}.html`);
  openWindow(path);
}
</script>

<template>
  <Button @click="handleClick">Xem tài liệu component</Button>
</template>
