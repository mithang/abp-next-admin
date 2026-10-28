<script setup lang="ts">
import type { BlobDto } from '../../types/blobs';

import { defineAsyncComponent, ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { downloadFileFromUrl } from '@vben/utils';

import { Button, Empty, message, Spin } from 'ant-design-vue';

import { useBlobsApi } from '../../api/useBlobsApi';

type FileType = 'excel' | 'image' | 'pdf' | 'ppt' | 'text' | 'word';

const VueOfficeDocx = defineAsyncComponent({
  loader: async () => {
    const res = await import('@vue-office/docx/lib/v3/index.js');
    import('@vue-office/docx/lib/v3/index.css');
    return res.default;
  },
  loadingComponent: Spin,
  delay: 200,
});

const VueOfficeExcel = defineAsyncComponent({
  loader: async () => {
    const res = await import('@vue-office/excel/lib/v3/index.js');
    import('@vue-office/excel/lib/v3/index.css');
    return res.default;
  },
  loadingComponent: Spin,
  delay: 200,
});

const VueOfficePdf = defineAsyncComponent({
  loader: () => import('@vue-office/pdf/lib/v3/index.js'),
  loadingComponent: Spin,
  delay: 200,
});

const VueOfficePptx = defineAsyncComponent({
  loader: () => import('@vue-office/pptx/lib/v3/index.js'),
  loadingComponent: Spin,
  delay: 200,
});

const Image = defineAsyncComponent({
  loader: async () => {
    const res = await import('ant-design-vue');
    return res.Image;
  },
  loadingComponent: Spin,
  delay: 200,
});

const modalTitle = ref('');
const isPreview = ref(false);
const isLoading = ref(false);
const blob = ref<BlobDto>();
const blobData = ref<string>();
const blobText = ref<string>();
const blobType = ref<FileType>();
const errorMessage = ref<string>('');
const excelComponentKey = ref(0); // Chỉ dùng key cho component Excel

const { downloadApi } = useBlobsApi();

// Cấu hình loại file
const allowFiles: Record<FileType, string[]> = {
  pdf: ['.pdf'],
  word: ['.doc', '.docx'],
  excel: ['.xls', '.xlsx'],
  ppt: ['.ppt', '.pptx'],
  text: ['.txt', '.text', '.log', '.md', '.json', '.xml', '.yaml', '.yml'],
  image: [
    '.bmp',
    '.png',
    '.jpg',
    '.jpeg',
    '.webp',
    '.tif',
    '.tiff',
    '.gif',
    '.svg',
  ],
};

// Giới hạn kích thước file (mặc định 50MB)
const MAX_FILE_SIZE = 50 * 1024 * 1024;

// Xác định loại file
function getFileType(): FileType | undefined {
  const fileName = blob.value!.name.toLocaleLowerCase();
  for (const [type, extensions] of Object.entries(allowFiles)) {
    if (extensions.some((ext) => fileName.endsWith(ext))) {
      return type as FileType;
    }
  }
  return undefined;
}

// Kiểm tra file có được phép xem trước hay không
function isAllowPreview(): boolean {
  return !!getFileType();
}

// Kiểm tra kích thước file
function isFileSizeValid(content: Blob): boolean {
  if (content.size > MAX_FILE_SIZE) {
    errorMessage.value = $t('BlobManagement.Blobs:FileTooLarge', {
      size: MAX_FILE_SIZE / 1024 / 1024,
    });
    return false;
  }
  return true;
}

function onError(error?: string) {
  message.error(`${$t('BlobManagement.Blobs:PreviewError')}: ${error}`);
}

// Dọn dẹp tài nguyên
function cleanup() {
  if (blobData.value) {
    URL.revokeObjectURL(blobData.value);
    blobData.value = undefined;
  }
  blobText.value = '';
  blobType.value = undefined;
  isPreview.value = false;
  errorMessage.value = '';
}

const [Modal, modalApi] = useVbenModal({
  showCancelButton: false,
  showConfirmButton: false,
  fullscreen: true,
  fullscreenButton: false,
  onCancel: () => {
    cleanup();
  },
  onOpenChange: async (isOpen) => {
    if (isOpen) {
      await onInit();
    } else {
      cleanup();
    }
  },
});

async function onInit() {
  try {
    isLoading.value = true;
    isPreview.value = false;
    errorMessage.value = '';
    modalApi.lock();

    // Đặt lại trạng thái
    cleanup();

    // Lấy dữ liệu
    blob.value = modalApi.getData<BlobDto>();
    if (!blob.value) {
      errorMessage.value = $t('BlobManagement.Blobs:NoData');
      return;
    }

    modalTitle.value = `${$t('BlobManagement.Blobs:Preview')} - ${blob.value.name}`;

    // Kiểm tra có hỗ trợ xem trước hay không
    if (!isAllowPreview()) {
      errorMessage.value = $t('BlobManagement.BlobCanNotPreviewMessage');
      return;
    }

    // Lấy nội dung file
    const content = await downloadApi(blob.value.id);

    // Kiểm tra kích thước file
    if (!isFileSizeValid(content)) {
      return;
    }

    // Tạo object URL
    blobData.value = URL.createObjectURL(content);

    // Đặt loại file và xử lý nội dung
    blobType.value = getFileType();

    await processFileContent(content);
    isPreview.value = true;
  } catch (error) {
    console.error('Preview error:', error);
    errorMessage.value = $t('BlobManagement.Blobs:PreviewError');
    message.error(errorMessage.value);
  } finally {
    isLoading.value = false;
    modalApi.unlock();
  }
}

async function processFileContent(content: Blob) {
  // Xử lý file văn bản
  if (blobType.value === 'text') {
    try {
      blobText.value = await content.text();
      // Giới hạn độ dài văn bản hiển thị (tránh file lớn làm trang bị giật)
      const maxLength = 100_000; // 100 nghìn ký tự
      if (blobText.value.length > maxLength) {
        blobText.value = `${blobText.value.slice(0, Math.max(0, maxLength))}\n\n... ${$t(
          'BlobManagement.Blobs:TextTruncated',
        )}`;
        message.warning($t('BlobManagement.Blobs:TextTooLarge'));
      }
    } catch (error) {
      console.error('Read text error:', error);
      throw new Error('Failed to read text file');
    }
  }
}

// Tải file gốc
function handleDownload() {
  if (!blob.value) return;
  downloadFileFromUrl({
    fileName: blob.value.name,
    source: `/api/blob-management/blobs/uid/${blob.value.id}/content`,
  });
}

// Lắng nghe thay đổi của blobData để đảm bảo dọn dẹp tài nguyên
watch(blobData, (newVal, oldVal) => {
  if (oldVal && oldVal !== newVal) {
    URL.revokeObjectURL(oldVal);
  }
});
</script>

<template>
  <Modal :title="modalTitle">
    <div class="preview-container">
      <!-- Trạng thái đang tải -->
      <div v-if="isLoading" class="flex h-96 items-center justify-center">
        <Spin :tip="$t('AbpUi.LoadingWithThreeDot')" />
      </div>

      <!-- Thông báo lỗi -->
      <div v-else-if="errorMessage" class="error-message">
        <Empty :description="errorMessage">
          <template #image>
            <span class="text-6xl">📄</span>
          </template>
        </Empty>
      </div>

      <!-- Nội dung xem trước -->
      <template v-else>
        <!-- Không hỗ trợ xem trước -->
        <Empty
          v-if="!isPreview"
          :description="$t('BlobManagement.BlobCanNotPreviewMessage')"
        >
          <template #image>
            <span class="text-6xl">🔍</span>
          </template>
        </Empty>

        <!-- Xem trước Word -->
        <div v-else-if="blobType === 'word'" class="office-preview-wrapper">
          <VueOfficeDocx :src="blobData" @error="onError" />
        </div>

        <!-- Xem trước Excel - xử lý riêng, thêm key để buộc render lại -->
        <div v-else-if="blobType === 'excel'" class="excel-preview-wrapper">
          <VueOfficeExcel
            :key="excelComponentKey"
            :src="blobData"
            @error="onError"
          />
        </div>

        <!-- Xem trước PDF - không xử lý gì, giữ nguyên -->
        <VueOfficePdf
          v-else-if="blobType === 'pdf'"
          :src="blobData"
          @error="onError"
        />

        <!-- Xem trước PPT -->
        <div v-else-if="blobType === 'ppt'" class="office-preview-wrapper">
          <VueOfficePptx :src="blobData" @error="onError" />
        </div>

        <!-- Xem trước ảnh -->
        <div v-else-if="blobType === 'image'" class="image-preview">
          <Image
            :src="blobData"
            :alt="blob?.name"
            class="max-h-[80vh] max-w-full object-contain"
          />
        </div>

        <!-- Xem trước văn bản -->
        <div v-else-if="blobType === 'text'" class="text-preview">
          <div
            class="whitespace-pre-wrap rounded bg-gray-50 p-4 font-mono text-sm dark:bg-gray-800"
          >
            {{ blobText }}
          </div>
        </div>
      </template>

      <!-- Nút tải xuống -->
      <div v-if="blob" class="download-button">
        <Button type="primary" @click="handleDownload">
          {{ $t('BlobManagement.Blobs:Download') }}
        </Button>
      </div>
    </div>
  </Modal>
</template>

<style scoped lang="scss">
.preview-container {
  position: relative;
  min-height: 400px;

  .error-message {
    padding: 40px 20px;
    text-align: center;
  }

  .office-preview-wrapper {
    width: 100%;

    :deep(> div) {
      width: 100%;
    }
  }

  // Kiểu wrapper riêng cho Excel
  .excel-preview-wrapper {
    width: 100%;
    min-height: 500px;

    :deep(> div) {
      width: 100%;
      height: 100%;
      min-height: 500px;
    }
  }

  .image-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    overflow: auto;
    background-color: #f5f5f5;
    border-radius: 8px;
  }

  .text-preview {
    max-height: 70vh;
    overflow: auto;

    :deep(.whitespace-pre-wrap) {
      word-break: normal;
      overflow-wrap: break-word;
      white-space: pre-wrap;
    }
  }

  .download-button {
    position: sticky;
    right: 20px;
    bottom: 20px;
    z-index: 10;
    float: right;
    margin-top: 20px;
  }
}
</style>

<style lang="scss">
.vben-modal {
  .vben-modal__body {
    height: auto !important;
    max-height: calc(90vh - 110px);
    padding: 20px;
    overflow-y: auto;
  }
}

.excel-preview-wrapper {
  .vue-office-excel {
    width: 100% !important;
    height: 100% !important;
    min-height: 500px !important;

    iframe,
    canvas,
    .office-viewer {
      width: 100% !important;
      height: 100% !important;
      min-height: 500px !important;
    }
  }
}
</style>
