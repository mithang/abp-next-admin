<script lang="ts" setup>
import { EllipsisText } from '@vben/common-ui';
</script>
<template>
  <EllipsisText :max-width="240">
    Sống trong tim tôi, quái vật biển cô độc, vua của nỗi đau, bắt đầu chán ngán, ánh sáng nơi biển sâu, con sóng ngừng trôi
    <template #tooltip>
      <div style="text-align: center">
        《Tần Hoàng Đảo》<br />Sống trong tim tôi, cô độc<br />quái vật biển cô độc, vua của nỗi đau<br />bắt đầu chán ngán
        ánh sáng nơi biển sâu, con sóng ngừng trôi
      </div>
    </template>
  </EllipsisText>
</template>
