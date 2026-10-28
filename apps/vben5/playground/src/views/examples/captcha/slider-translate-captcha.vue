<script setup lang="ts">
import { Page, SliderTranslateCaptcha } from '@vben/common-ui';

import { Card, message } from 'ant-design-vue';

function handleSuccess() {
  message.success('success!');
}
</script>

<template>
  <Page
    description="Dùng cho kịch bản xác minh kéo trượt ghép hình đơn giản ở frontend"
    title="Xác minh trượt ghép hình"
  >
    <Card class="mb-5" title="Ví dụ cơ bản">
      <div class="flex items-center justify-center p-4">
        <SliderTranslateCaptcha
          src="https://unpkg.com/@vbenjs/static-source@0.1.7/source/pro-avatar.webp"
          :canvas-width="420"
          :canvas-height="420"
          @success="handleSuccess"
        />
      </div>
    </Card>
  </Page>
</template>
