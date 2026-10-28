<script lang="ts" setup>
import type { BreadcrumbProps } from './types';

import { useForwardPropsEmits } from 'reka-ui';

import BreadcrumbBackground from './breadcrumb-background.vue';
import Breadcrumb from './breadcrumb.vue';

interface Props extends BreadcrumbProps {
  class?: any;
}

const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits<{ select: [string] }>();

const forward = useForwardPropsEmits(props, emit);
</script>
<template>
  <Breadcrumb
    v-if="styleType === 'normal'"
    v-bind="forward"
    class="vben-breadcrumb"
  />
  <BreadcrumbBackground
    v-if="styleType === 'background'"
    v-bind="forward"
    class="vben-breadcrumb"
  />
</template>
<style lang="scss" scoped>
/** Sửa lỗi khi import Antd toàn cục, kiểu mặc định của ol và ul bị thay đổi */
.vben-breadcrumb {
  :deep(ol),
  :deep(ul) {
    margin-bottom: 0;
  }
}
</style>
