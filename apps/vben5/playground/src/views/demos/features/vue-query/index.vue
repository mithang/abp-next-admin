<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { refAutoReset } from '@vueuse/core';
import { Button, Card, Empty } from 'ant-design-vue';

import ConcurrencyCaching from './concurrency-caching.vue';
import InfiniteQueries from './infinite-queries.vue';
import PaginatedQueries from './paginated-queries.vue';
import QueryRetries from './query-retries.vue';

const showCaching = refAutoReset(true, 1000);
</script>

<template>
  <Page title="Ví dụ Vue Query">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card title="Truy vấn phân trang">
        <PaginatedQueries />
      </Card>
      <Card title="Cuộn vô hạn">
        <InfiniteQueries class="h-[300px] overflow-auto" />
      </Card>
      <Card title="Thử lại khi lỗi">
        <QueryRetries />
      </Card>
      <Card
        title="Đồng thời và bộ nhớ đệm"
        v-spinning="!showCaching"
        :body-style="{ minHeight: '330px' }"
      >
        <template #extra>
          <Button @click="showCaching = false">Tải lại</Button>
        </template>
        <ConcurrencyCaching v-if="showCaching" />
        <Empty v-else description="Đang tải..." />
      </Card>
    </div>
  </Page>
</template>
