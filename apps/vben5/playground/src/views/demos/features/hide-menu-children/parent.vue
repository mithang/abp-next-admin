<script lang="ts" setup>
import { Fallback } from '@vben/common-ui';
</script>

<template>
  <Fallback
    :description="`Route hiện tại: ${String($route.name)}, menu con không hiển thị`"
    status="coming-soon"
    title="Ẩn menu con"
  >
    <template #action>
      <RouterLink to="/demos/features/hide-menu-children/children">
        Mở route con
      </RouterLink>
    </template>
  </Fallback>
</template>
