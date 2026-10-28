<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import { useQuery } from '@tanstack/vue-query';

import { useVbenForm } from '#/adapter/form';
import { getMenuList } from '#/api';

const queryKey = ['demo', 'api', 'options'];
const count = 4;

const { dataUpdatedAt, promise: fetchDataFn } = useQuery({
  // Tìm nạp trước dữ liệu trong lúc component đang render
  experimental_prefetchInRender: true,
  // Hàm lấy dữ liệu từ API
  queryFn: getMenuList,
  queryKey,
  // Mỗi lần component mount đều lấy lại dữ liệu. Nếu không cần lấy lại mỗi lần thì đừng đặt thành always
  refetchOnMount: 'always',
  // Thời gian lưu bộ nhớ đệm
  staleTime: 1000 * 60 * 5,
});

async function fetchOptions() {
  return await fetchDataFn.value;
}

const schema = [];

for (let i = 0; i < count; i++) {
  schema.push({
    component: 'ApiSelect',
    componentProps: {
      api: fetchOptions,
      class: 'w-full',
      filterOption: (input: string, option: Recordable<any>) => {
        return option.label.toLowerCase().includes(input.toLowerCase());
      },
      labelField: 'name',
      showSearch: true,
      valueField: 'id',
    },
    fieldName: `field${i}`,
    label: `Select ${i}`,
  });
}

const [Form] = useVbenForm({
  schema,
  showDefaultActions: false,
});
</script>
<template>
  <div>
    <div class="mb-2 flex gap-2">
      <div>{{ count }} component dưới đây dùng chung một nguồn dữ liệu.</div>
      <div>
        Thời gian cập nhật bộ nhớ đệm:{{
          new Date(dataUpdatedAt).toLocaleString()
        }}
      </div>
    </div>
    <Form />
  </div>
</template>
