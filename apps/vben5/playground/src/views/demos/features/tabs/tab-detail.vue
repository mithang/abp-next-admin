<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { Page } from '@vben/common-ui';
import { useTabs } from '@vben/hooks';

const route = useRoute();

const { setTabTitle } = useTabs();

const index = computed(() => {
  return route.params?.id ?? -1;
});

setTabTitle(`No.${index.value} - Thông tin chi tiết`);
</script>

<template>
  <Page :title="`Tab ${index} trang chi tiết`">
    <template #description>
      {{ index }} - Nội dung trang chi tiết tại đây
    </template>
  </Page>
</template>
