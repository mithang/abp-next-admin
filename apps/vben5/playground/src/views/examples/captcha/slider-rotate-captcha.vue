<script setup lang="ts">
import { computed } from 'vue';

import { Page, SliderRotateCaptcha } from '@vben/common-ui';
import { preferences } from '@vben/preferences';
import { useUserStore } from '@vben/stores';

import { Card, message } from 'ant-design-vue';

const userStore = useUserStore();
function handleSuccess() {
  message.success('success!');
}

const avatar = computed(() => {
  return userStore.userInfo?.avatar || preferences.app.defaultAvatar;
});
</script>

<template>
  <Page
    description="Dùng cho kịch bản xác thực kéo đơn giản ở frontend"
    title="Xác thực xoay thanh trượt"
  >
    <Card class="mb-5" title="Ví dụ cơ bản">
      <div class="flex items-center justify-center p-4">
        <SliderRotateCaptcha :src="avatar" @success="handleSuccess" />
      </div>
    </Card>
  </Page>
</template>
