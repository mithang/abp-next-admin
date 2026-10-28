<script lang="ts" setup>
import { useRouter } from 'vue-router';

import { Fallback } from '@vben/common-ui';

import { Button } from 'ant-design-vue';

const router = useRouter();
</script>

<template>
  <Fallback
    description="Điều hướng breadcrumb - chế độ ngang hàng - trang chi tiết"
    status="coming-soon"
    title="Chú ý quan sát sự thay đổi của điều hướng breadcrumb"
  >
    <template #action>
      <Button @click="router.go(-1)">Quay lại</Button>
    </template>
  </Fallback>
</template>
