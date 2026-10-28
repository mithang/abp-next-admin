<script lang="ts" setup>
import { ChevronDown } from '@vben-core/icons';
import { cn } from '@vben-core/shared/utils';

const props = defineProps<{
  class?: string;
}>();

// Kiểm soát trạng thái mở rộng/thu gọn của mũi tên
// Khai boolean tường minh: default literal `false` sẽ bị suy ra kiểu `false`
// khiến `collapsed = !collapsed` lỗi TS2322.
const collapsed = defineModel<boolean>({ default: false });
</script>

<template>
  <div
    :class="cn('vben-link inline-flex items-center', props.class)"
    @click="collapsed = !collapsed"
  >
    <slot :is-expanded="collapsed">
      {{ collapsed }}
      <!-- <span>{{ isExpanded ? 'Thu gọn' : 'Mở rộng' }}</span> -->
    </slot>
    <div
      :class="{ 'rotate-180': !collapsed }"
      class="transition-transform duration-300"
    >
      <slot name="icon">
        <ChevronDown class="size-4" />
      </slot>
    </div>
  </div>
</template>
