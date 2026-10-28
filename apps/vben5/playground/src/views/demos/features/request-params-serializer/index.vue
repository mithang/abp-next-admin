<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue';

import { Page } from '@vben/common-ui';

import { Card, Radio, RadioGroup } from 'ant-design-vue';

import { getParamsData } from '#/api/examples/params';

const params = { ids: [2512, 3241, 4255] };
const paramsSerializer = ref<'brackets' | 'comma' | 'indices' | 'repeat'>(
  'brackets',
);
const response = ref('');
const paramsStr = computed(() => {
  // Viết một đoạn code trích xuất phần tham số từ URL đầy đủ
  const url = response.value;
  return new URL(url).searchParams.toString();
});

watchEffect(() => {
  getParamsData(params, paramsSerializer.value).then((res) => {
    response.value = res.request.responseURL;
  });
});
</script>
<template>
  <Page
    title="Tuần tự hóa tham số request"
    description="Các API backend khác nhau có thể phân tích tham số GET dạng mảng theo cách khác nhau, chúng tôi đã đặt sẵn vài cách tuần tự hóa mảng, cấu hình paramsSerializer để thực hiện các cách tuần tự hóa khác nhau"
  >
    <Card>
      <RadioGroup v-model:value="paramsSerializer" name="paramsSerializer">
        <Radio value="brackets">brackets</Radio>
        <Radio value="comma">comma</Radio>
        <Radio value="indices">indices</Radio>
        <Radio value="repeat">repeat</Radio>
      </RadioGroup>
      <div class="mt-4 flex flex-col gap-4">
        <div>
          <h3>Tham số cần gửi</h3>
          <div>{{ JSON.stringify(params, null, 2) }}</div>
        </div>
        <template v-if="response">
          <div>
            <h3>Địa chỉ truy cập</h3>
            <pre>{{ response }}</pre>
          </div>
          <div>
            <h3>Chuỗi tham số</h3>
            <pre>{{ paramsStr }}</pre>
          </div>
          <div>
            <h3>Giải mã tham số</h3>
            <pre>{{ decodeURIComponent(paramsStr) }}</pre>
          </div>
        </template>
      </div>
    </Card>
  </Page>
</template>
