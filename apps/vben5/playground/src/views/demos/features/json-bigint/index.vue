<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Alert, Button, Card } from 'ant-design-vue';

import { getBigIntData } from '#/api/examples/json-bigint';

const response = ref('');
function fetchData() {
  getBigIntData().then((res) => {
    response.value = res;
  });
}
</script>
<template>
  <Page
    title="JSON BigInt Support"
    description="Phân tích số nguyên dài (long/bigInt) do backend trả về. Vị trí mã: transformResponse trong playground/src/api/request.ts"
  >
    <Card>
      <Alert>
        <template #message>
          Một số API backend trả về ID là số nguyên dài, nhưng trình phân tích
          JSON gốc của javascript không hỗ trợ số nguyên dài vượt quá 2^53-1.
          Trong trường hợp này có thể đề xuất backend chuyển số nguyên dài thành
          kiểu chuỗi trước khi trả dữ liệu. Nếu backend không chấp nhận đề xuất
          của chúng ta 😡……
          <br />
          Sau khi nhấn nút bên dưới sẽ gửi yêu cầu, trường id trong dữ liệu JSON
          do API trả về là số vượt quá phạm vi số nguyên, đã tự động được phân
          tích thành chuỗi
        </template>
      </Alert>
      <Button class="mt-4" type="primary" @click="fetchData">
        Gửi yêu cầu
      </Button>
      <div>
        <pre>
        {{ response }}
        </pre>
      </div>
    </Card>
  </Page>
</template>
