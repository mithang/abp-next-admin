<script lang="ts" setup>
import { Fallback, VbenButton } from '@vben/common-ui';
import { useTabs } from '@vben/hooks';
import { X } from '@vben/icons';

const { closeCurrentTab } = useTabs();
</script>

<template>
  <Fallback
    description="Route hiện tại không hiển thị trong menu"
    status="coming-soon"
    title="Menu con bị ẩn"
    show-back
  >
    <template #action>
      <VbenButton size="lg" @click="closeCurrentTab()">
        <X class="mr-2 size-4" />
        Đóng tab hiện tại
      </VbenButton>
    </template>
  </Fallback>
</template>
