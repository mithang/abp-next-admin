<!--
 Access control component for fine-grained access control.
 TODO: Có thể mở rộng thêm các tính năng hoàn thiện hơn:
 1. Hỗ trợ nhiều mã quyền, chỉ cần một mã quyền thỏa mãn là được hoặc tất cả các mã quyền đều thỏa mãn
 2. Hỗ trợ nhiều vai trò, chỉ cần một vai trò thỏa mãn là được hoặc tất cả các vai trò đều thỏa mãn
 3. Hỗ trợ logic phán đoán tùy chỉnh cho mã quyền và vai trò
-->
<script lang="ts" setup>
import { computed } from 'vue';

import { useAccess } from './use-access';

interface Props {
  /**
   * Specified codes is visible
   * @default []
   */
  codes?: string[];

  /**
   * Điều khiển component bằng cách nào, nếu là role thì truyền vai trò, nếu là code thì truyền mã quyền
   * @default 'role'
   */
  type?: 'code' | 'role';
}

defineOptions({
  name: 'AccessControl',
});

const props = withDefaults(defineProps<Props>(), {
  codes: () => [],
  type: 'role',
});

const { hasAccessByCodes, hasAccessByRoles } = useAccess();

const hasAuth = computed(() => {
  const { codes, type } = props;
  return type === 'role' ? hasAccessByRoles(codes) : hasAccessByCodes(codes);
});
</script>

<template>
  <slot v-if="!codes"></slot>
  <slot v-else-if="hasAuth"></slot>
</template>
