<script lang="ts" setup>
import { useRouter } from 'vue-router';

import { Fallback } from '@vben/common-ui';

import { Button } from 'ant-design-vue';

const router = useRouter();

function details() {
  router.push({ name: 'BreadcrumbLateralDetailDemo' });
}
</script>

<template>
  <Fallback
    description="Nhấn để xem chi tiết và quan sát sự thay đổi của điều hướng breadcrumb"
    status="coming-soon"
    title="Điều hướng breadcrumb - chế độ ngang hàng"
  >
    <template #action>
      <Button type="primary" @click="details">Nhấn để xem chi tiết</Button>
    </template>
  </Fallback>
</template>
