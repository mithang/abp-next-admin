<script lang="ts" setup>
import { VbenSpinner } from '@vben-core/shadcn-ui';
import { cn } from '@vben-core/shared/utils';

interface SpinnerProps {
  class?: string;
  /**
   * @zh_CN Thời gian tải tối thiểu
   * @en_US Minimum loading time
   */
  minLoadingTime?: number;
  /**
   * @zh_CN Trạng thái loading đang bật
   */
  spinning?: boolean;
}
defineOptions({ name: 'Spinner' });
const props = defineProps<SpinnerProps>();
</script>
<template>
  <div :class="cn('relative min-h-20', props.class)">
    <slot></slot>
    <VbenSpinner
      :min-loading-time="props.minLoadingTime"
      :spinning="props.spinning"
    />
  </div>
</template>
