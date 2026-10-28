import type { RequestResponse } from '@vben/request';

import { requestClient } from '../request';

/**
 * Tải xuống tệp, lấy Blob
 * @returns Blob
 */
async function downloadFile1() {
  return requestClient.download<Blob>(
    'https://unpkg.com/@vbenjs/static-source@0.1.7/source/logo-v1.webp',
  );
}

/**
 * Tải xuống tệp, lấy Response đầy đủ
 * @returns RequestResponse<Blob>
 */
async function downloadFile2() {
  return requestClient.download<RequestResponse<Blob>>(
    'https://unpkg.com/@vbenjs/static-source@0.1.7/source/logo-v1.webp',
    {
      responseReturn: 'raw',
    },
  );
}

export { downloadFile1, downloadFile2 };
