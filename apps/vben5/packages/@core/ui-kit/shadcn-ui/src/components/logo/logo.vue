<script setup lang="ts">
import { computed } from 'vue';

import { VbenAvatar } from '../avatar';

interface Props {
  /**
   * @zh_CN Có thu gọn văn bản không
   */
  collapsed?: boolean;
  /**
   * @zh_CN Cách hình ảnh Logo vừa khung
   */
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  /**
   * @zh_CN Địa chỉ chuyển hướng của Logo
   */
  href?: string;
  /**
   * @zh_CN Kích thước hình ảnh Logo
   */
  logoSize?: number;
  /**
   * @zh_CN Biểu tượng Logo
   */
  src?: string;
  /**
   * @zh_CN Biểu tượng Logo của chủ đề tối (tùy chọn, nếu không đặt thì dùng src)
   */
  srcDark?: string;
  /**
   * @zh_CN Văn bản Logo
   */
  text: string;
  /**
   * @zh_CN Chủ đề Logo
   */
  theme?: string;
}

defineOptions({
  name: 'VbenLogo',
});

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
  href: 'javascript:void 0',
  logoSize: 32,
  src: '',
  srcDark: '',
  theme: 'light',
  fit: 'cover',
});

/**
 * @zh_CN Chọn biểu tượng logo phù hợp theo chủ đề
 */
const logoSrc = computed(() => {
  // Nếu là chủ đề tối và đã cung cấp srcDark thì dùng logo của chủ đề tối
  if (props.theme === 'dark' && props.srcDark) {
    return props.srcDark;
  }
  // Ngược lại dùng src mặc định
  return props.src;
});
</script>

<template>
  <div :class="theme" class="flex h-full items-center text-lg">
    <a
      :class="$attrs.class"
      :href="href"
      class="flex h-full items-center gap-2 overflow-hidden px-3 text-lg leading-normal transition-all duration-500"
    >
      <VbenAvatar
        v-if="logoSrc"
        :alt="text"
        :src="logoSrc"
        :size="logoSize"
        :fit="fit"
        class="relative rounded-none bg-transparent"
      />
      <template v-if="!collapsed">
        <slot name="text">
          <span class="truncate text-nowrap font-semibold text-foreground">
            {{ text }}
          </span>
        </slot>
      </template>
    </a>
  </div>
</template>
