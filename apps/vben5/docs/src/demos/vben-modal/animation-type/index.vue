<script lang="ts" setup>
import { useVbenModal, VbenButton } from '@vben/common-ui';

const [SlideModal, slideModalApi] = useVbenModal({
  animationType: 'slide',
});

const [ScaleModal, scaleModalApi] = useVbenModal({
  animationType: 'scale',
});

function openSlideModal() {
  slideModalApi.open();
}

function openScaleModal() {
  scaleModalApi.open();
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex gap-4">
      <VbenButton @click="openSlideModal">Hiệu ứng trượt</VbenButton>
      <VbenButton @click="openScaleModal">Hiệu ứng thu phóng</VbenButton>
    </div>

    <SlideModal title="Ví dụ hiệu ứng trượt" class="w-[500px]">
      <p>Đây là popup dùng hiệu ứng trượt, trượt từ trên xuống để xuất hiện.</p>
    </SlideModal>

    <ScaleModal title="Ví dụ hiệu ứng thu phóng" class="w-[500px]">
      <p>Đây là popup dùng hiệu ứng thu phóng, hiển thị theo kiểu thu phóng mờ dần vào/ra.</p>
    </ScaleModal>
  </div>
</template>
