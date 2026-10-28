<script setup lang="ts">
import type { CSSProperties } from 'vue';

import {
  computed,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  watchEffect,
} from 'vue';

import { VbenTooltip } from '@vben-core/shadcn-ui';

import { useElementSize } from '@vueuse/core';

interface Props {
  /**
   * Có bật mở rộng toàn bộ văn bản khi nhấp vào văn bản hay không
   * @default false
   */
  expand?: boolean;
  /**
   * Số dòng tối đa của văn bản
   * @default 1
   */
  line?: number;
  /**
   * Chiều rộng tối đa của văn bản
   * @default '100%'
   */
  maxWidth?: number | string;
  /**
   * Vị trí của hộp gợi ý
   * @default 'top'
   */
  placement?: 'bottom' | 'left' | 'right' | 'top';
  /**
   * Có bật hộp gợi ý văn bản hay không
   * @default true
   */
  tooltip?: boolean;
  /**
   * Có chỉ hiển thị hộp gợi ý khi văn bản bị cắt ngắn hay không
   * @default false
   */
  tooltipWhenEllipsis?: boolean;
  /**
   * Ngưỡng chênh lệch pixel để phát hiện văn bản bị cắt ngắn; giá trị càng lớn thì phán đoán càng nghiêm ngặt
   * @default 3
   */
  ellipsisThreshold?: number;
  /**
   * Màu nền của hộp gợi ý, có độ ưu tiên cao hơn overlayStyle
   */
  tooltipBackgroundColor?: string;
  /**
   * Màu chữ của văn bản gợi ý, có độ ưu tiên cao hơn overlayStyle
   */
  tooltipColor?: string;
  /**
   * Cỡ chữ của văn bản gợi ý, đơn vị px, có độ ưu tiên cao hơn overlayStyle
   */
  tooltipFontSize?: number;
  /**
   * Chiều rộng tối đa của nội dung hộp gợi ý, đơn vị px; mặc định khi không đặt, nội dung văn bản gợi ý sẽ tự động giữ cùng chiều rộng với văn bản hiển thị
   */
  tooltipMaxWidth?: number;
  /**
   * Kiểu của vùng nội dung hộp gợi ý
   * @default { textAlign: 'justify' }
   */
  tooltipOverlayStyle?: CSSProperties;
}

const props = withDefaults(defineProps<Props>(), {
  expand: false,
  line: 1,
  maxWidth: '100%',
  placement: 'top',
  tooltip: true,
  tooltipWhenEllipsis: false,
  ellipsisThreshold: 3,
  tooltipBackgroundColor: '',
  tooltipColor: '',
  tooltipFontSize: 14,
  tooltipMaxWidth: undefined,
  tooltipOverlayStyle: () => ({ textAlign: 'justify' }),
});

const emit = defineEmits<{ expandChange: [boolean] }>();

const textMaxWidth = computed(() => {
  if (typeof props.maxWidth === 'number') {
    return `${props.maxWidth}px`;
  }
  return props.maxWidth;
});
const ellipsis = ref();
const isExpand = ref(false);
const defaultTooltipMaxWidth = ref();
const isEllipsis = ref(false);

const { width: eleWidth } = useElementSize(ellipsis);

// Kiểm tra xem văn bản có bị cắt ngắn hay không
const checkEllipsis = () => {
  if (!ellipsis.value || !props.tooltipWhenEllipsis) return;

  const element = ellipsis.value;

  const originalText = element.textContent || '';
  const originalTrimmed = originalText.trim();

  // Với văn bản rỗng thì trả về false trực tiếp
  if (!originalTrimmed) {
    isEllipsis.value = false;
    return;
  }

  const widthDiff = element.scrollWidth - element.clientWidth;
  const heightDiff = element.scrollHeight - element.clientHeight;

  // Dùng ngưỡng chênh lệch đủ lớn để đảm bảo chỉ văn bản thực sự bị cắt ngắn mới hiển thị tooltip
  isEllipsis.value =
    props.line === 1
      ? widthDiff > props.ellipsisThreshold
      : heightDiff > props.ellipsisThreshold;
};

// Dùng ResizeObserver để theo dõi thay đổi kích thước
let resizeObserver: null | ResizeObserver = null;

onMounted(() => {
  if (typeof ResizeObserver !== 'undefined' && props.tooltipWhenEllipsis) {
    resizeObserver = new ResizeObserver(() => {
      checkEllipsis();
    });

    if (ellipsis.value) {
      resizeObserver.observe(ellipsis.value);
    }
  }

  // Kiểm tra ban đầu
  checkEllipsis();
});

// Dùng hook onUpdated để phát hiện thay đổi nội dung
onUpdated(() => {
  if (props.tooltipWhenEllipsis) {
    checkEllipsis();
  }
});

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
});

watchEffect(
  () => {
    if (props.tooltip && eleWidth.value) {
      defaultTooltipMaxWidth.value =
        props.tooltipMaxWidth ?? eleWidth.value + 24;
    }
  },
  { flush: 'post' },
);

function onExpand() {
  isExpand.value = !isExpand.value;
  emit('expandChange', isExpand.value);
  if (props.tooltipWhenEllipsis) {
    checkEllipsis();
  }
}

function handleExpand() {
  props.expand && onExpand();
}
</script>
<template>
  <div>
    <VbenTooltip
      :content-style="{
        ...tooltipOverlayStyle,
        maxWidth: `${defaultTooltipMaxWidth}px`,
        fontSize: `${tooltipFontSize}px`,
        color: tooltipColor,
        backgroundColor: tooltipBackgroundColor,
      }"
      :disabled="
        !props.tooltip || isExpand || (props.tooltipWhenEllipsis && !isEllipsis)
      "
      :side="placement"
    >
      <slot name="tooltip">
        <slot></slot>
      </slot>

      <template #trigger>
        <div
          ref="ellipsis"
          :class="{
            '!cursor-pointer': expand,
            ['block truncate']: line === 1,
            [$style.ellipsisMultiLine]: line > 1,
          }"
          :style="{
            '-webkit-line-clamp': isExpand ? '' : line,
            'max-width': textMaxWidth,
          }"
          class="cursor-text overflow-hidden"
          @click="handleExpand"
          v-bind="$attrs"
        >
          <slot></slot>
        </div>
      </template>
    </VbenTooltip>
  </div>
</template>

<style module>
.ellipsisMultiLine {
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
</style>
