<script lang="ts" setup>
import type { UploadChangeParam } from 'ant-design-vue';

import { ref } from 'vue';

import { Page, VCropper } from '@vben/common-ui';

import { Button, Card, Select, Upload } from 'ant-design-vue';

const options = [
  { label: '1:1', value: '1:1' },
  { label: '16:9', value: '16:9' },
  { label: 'Không giới hạn', value: '' },
];

const cropperRef = ref<InstanceType<typeof VCropper>>();

const cropLoading = ref(false);
const validAspectRatio = ref<string | undefined>('1:1');
const imgUrl = ref('');
const cropperImg = ref();

const selectImgFile = (event: UploadChangeParam) => {
  const file = event.fileList[0]?.originFileObj;
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    console.error('Vui lòng tải lên tệp hình ảnh');
    return;
  }

  const reader = new FileReader();
  reader.addEventListener('load', (e) => {
    imgUrl.value = e.target?.result as string;
  });
  reader.addEventListener('error', () => {
    console.error('Failed to read file');
  });

  reader.readAsDataURL(file);
};

const cropImage = async () => {
  if (!cropperRef.value) return;
  cropLoading.value = true;
  try {
    cropperImg.value = await cropperRef.value.getCropImage(
      'image/jpeg',
      0.92,
      'base64',
    );
  } catch (error) {
    console.error('Cắt ảnh thất bại:', error);
  } finally {
    cropLoading.value = false;
  }
};

/**
 * Tải xuống hình ảnh
 */
const downloadImage = () => {
  if (!cropperImg.value) return;

  const link = document.createElement('a');
  link.download = `cropped-image-${Date.now()}.png`;
  link.href = cropperImg.value;
  link.click();
};
</script>
<template>
  <Page
    title="VCropper Cắt ảnh"
    description="VCropperlà một component cắt ảnh，cung cấp chức năng cắt ảnh cơ bản。"
  >
    <Card>
      <div class="image-cropper-container">
        <div class="cropper-ratio-display">
          <label class="ratio-label">Tỷ lệ cắt hiện tại：</label>
          <Select
            class="w-24"
            v-model:value="validAspectRatio"
            :options="options"
          />
          <Upload
            :max-count="1"
            :show-upload-list="false"
            :before-upload="() => false"
            @change="selectImgFile"
          >
            <Button>Tải lên hình ảnh</Button>
          </Upload>
        </div>

        <div v-if="imgUrl" class="cropper-main-wrapper">
          <VCropper
            ref="cropperRef"
            :img="imgUrl"
            :aspect-ratio="validAspectRatio"
            :width="600"
            :height="600"
          />

          <!-- Nhóm nút thao tác -->
          <div class="cropper-btn-group">
            <Button :loading="cropLoading" @click="cropImage" type="primary">
              Cắt
            </Button>
            <Button v-if="cropperImg" @click="downloadImage" danger>
              Tải xuống hình ảnh
            </Button>
          </div>

          <!-- Xem trước khi cắt -->
          <img
            v-if="cropperImg"
            class="h-full w-80"
            :src="cropperImg"
            alt="Xem trước khi cắt"
          />
        </div>
      </div>
    </Card>
  </Page>
</template>
<style scoped>
/* Khu vực hiển thị tỷ lệ */
.cropper-ratio-display {
  @apply my-2.5 flex items-center justify-start gap-4;
}

.ratio-label {
  @apply text-sm font-medium;
}

/* Khu vực cắt chính */
.cropper-main-wrapper {
  @apply flex items-center gap-4;
}

.cropper-btn-group {
  @apply flex flex-col gap-2;
}
</style>
