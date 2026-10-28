<script setup lang="ts">
import { ref } from 'vue';

import { Page } from '@vben/common-ui';
import {
  downloadFileFromBase64,
  downloadFileFromBlobPart,
  downloadFileFromImageUrl,
  downloadFileFromUrl,
} from '@vben/utils';

import { Button, Card } from 'ant-design-vue';

import { downloadFile1, downloadFile2 } from '#/api/examples/download';

import imageBase64 from './base64';

const downloadResult = ref('');

function getBlob() {
  downloadFile1().then((res) => {
    downloadResult.value = `Lấy Blob thành công, độ dài: ${res.size}`;
  });
}

function getResponse() {
  downloadFile2().then((res) => {
    downloadResult.value = `Lấy Response thành công, headers: ${JSON.stringify(res.headers)}, độ dài: ${res.data.size}`;
  });
}
</script>

<template>
  <Page title="Ví dụ tải file">
    <Card title="Tải file theo địa chỉ file">
      <Button
        type="primary"
        @click="
          downloadFileFromUrl({
            source:
              'https://codeload.github.com/vbenjs/vue-vben-admin-doc/zip/main',
            target: '_self',
          })
        "
      >
        Download File
      </Button>
    </Card>

    <Card class="my-5" title="Tải ảnh theo địa chỉ">
      <Button
        type="primary"
        @click="
          downloadFileFromImageUrl({
            source:
              'https://unpkg.com/@vbenjs/static-source@0.1.7/source/logo-v1.webp',
            fileName: 'vben-logo.png',
          })
        "
      >
        Download File
      </Button>
    </Card>

    <Card class="my-5" title="Tải luồng base64">
      <Button
        type="primary"
        @click="
          downloadFileFromBase64({
            source: imageBase64,
            fileName: 'image.png',
          })
        "
      >
        Download Image
      </Button>
    </Card>
    <Card class="my-5" title="Tải văn bản">
      <Button
        type="primary"
        @click="
          downloadFileFromBlobPart({
            source: 'text content',
            fileName: 'test.txt',
          })
        "
      >
        Download TxT
      </Button>
    </Card>

    <Card class="my-5" title="Request download">
      <Button type="primary" @click="getBlob"> Lấy Blob </Button>
      <Button type="primary" class="ml-4" @click="getResponse">
        Lấy Response
      </Button>
      <div class="mt-4">{{ downloadResult }}</div>
    </Card>
  </Page>
</template>
