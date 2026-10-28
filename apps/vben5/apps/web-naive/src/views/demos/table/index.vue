<script setup lang="ts">
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { NDataTable } from 'naive-ui';

const columns = ref([
  {
    key: 'no',
    title: 'No',
  },
  {
    key: 'title',
    title: 'Title',
  },
  {
    key: 'length',
    title: 'Length',
  },
]);
const data = [
  { length: '4:18', no: 3, title: 'Wonderwall' },
  { length: '4:48', no: 4, title: "Don't Look Back in Anger" },
  { length: '7:27', no: 12, title: 'Champagne Supernova' },
];
</script>

<template>
  <Page
    description="Trang form dùng để thu thập hoặc xác thực thông tin từ người dùng, form cơ bản thường gặp trong các kịch bản form có ít mục dữ liệu."
    title="NDataTable"
  >
    <NDataTable :columns="columns" :data="data" />
  </Page>
</template>

<style scoped></style>
