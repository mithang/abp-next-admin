<script setup lang="ts">
import type { CSSProperties } from 'vue';

import { computed } from 'vue';

interface Props {
  /**
   * Có cố định ở cuối trang hay không
   */
  fixed?: boolean;
  height: number;
  /**
   * Có hiển thị hay không
   * @default true
   */
  show?: boolean;
  width: string;
  zIndex: number;
}

const props = withDefaults(defineProps<Props>(), {
  show: true,
});

const style = computed((): CSSProperties => {
  const { fixed, height, show, width, zIndex } = props;
  return {
    height: `${height}px`,
    marginBottom: show ? '0' : `-${height}px`,
    position: fixed ? 'fixed' : 'static',
    width,
    zIndex,
  };
});
</script>

<template>
  <footer
    :style="style"
    class="bottom-0 w-full bg-background-deep transition-all duration-200"
  >
    <slot></slot>
  </footer>
</template>
