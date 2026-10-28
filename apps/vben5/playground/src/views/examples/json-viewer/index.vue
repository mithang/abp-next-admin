<script lang="ts" setup>
import type { JsonViewerAction, JsonViewerValue } from '@vben/common-ui';

import { JsonViewer, Page } from '@vben/common-ui';

import { Card, message } from 'ant-design-vue';

import { json1, json2 } from './data';

function handleKeyClick(key: string) {
  message.info(`Đã nhấn Key ${key}`);
}

function handleValueClick(value: JsonViewerValue) {
  message.info(`Đã nhấn Value ${JSON.stringify(value)}`);
}

function handleCopied(_event: JsonViewerAction) {
  message.success('Đã sao chép JSON');
}
</script>
<template>
  <Page
    title="Json Viewer"
    description="Một component render dữ liệu cấu trúc JSON, hỗ trợ sao chép, mở rộng, đơn giản và dễ dùng"
  >
    <Card title="Cấu hình mặc định">
      <JsonViewer :value="json1" />
    </Card>
    <Card
      title="Có thể sao chép, mặc định mở rộng 3 tầng, hiển thị viền, xử lý sự kiện"
      class="mt-4"
    >
      <JsonViewer
        :value="json2"
        :expand-depth="3"
        copyable
        :sort="false"
        @key-click="handleKeyClick"
        @value-click="handleValueClick"
        @copied="handleCopied"
        boxed
      />
    </Card>
    <Card title="Chế độ xem trước" class="mt-4">
      <JsonViewer
        :value="json2"
        copyable
        preview-mode
        :show-array-index="false"
      />
    </Card>
  </Page>
</template>
