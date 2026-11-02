import { apiRequest, type PagedResult } from '../../lib/api-client';
import type {
  BlobContainerCreateDto,
  BlobContainerDto,
  BlobContainerGetListInput,
  BlobDto,
  BlobFolderCreateDto,
  BlobGetListInput,
} from './types';

/* ---------------- Container: /api/blob-management/containers ---------------- */

/** GET /api/blob-management/containers — phân trang ABP, lọc filter. */
export function getBlobContainersPaged(input: BlobContainerGetListInput = {}) {
  return apiRequest<PagedResult<BlobContainerDto>>('/api/blob-management/containers', {
    method: 'GET',
    params: {
      filter: input.filter,
      skipCount: input.skipCount ?? 0,
      maxResultCount: input.maxResultCount ?? 20,
      sorting: input.sorting,
    },
  });
}

/** GET /api/blob-management/containers/{id} */
export function getBlobContainer(id: string) {
  return apiRequest<BlobContainerDto>(`/api/blob-management/containers/${encodeURIComponent(id)}`, {
    method: 'GET',
  });
}

/** POST /api/blob-management/containers — chỉ có name. */
export function createBlobContainer(input: BlobContainerCreateDto) {
  return apiRequest<BlobContainerDto>('/api/blob-management/containers', {
    method: 'POST',
    body: input,
  });
}

/** DELETE /api/blob-management/containers/{id} — backend không có Update. */
export function deleteBlobContainer(id: string) {
  return apiRequest<void>(`/api/blob-management/containers/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

/* ---------------- Tệp/thư mục: /api/blob-management/blobs ---------------- */

/**
 * GET /api/blob-management/blobs — phân trang ABP; containerId là bắt
 * buộc (theo GetListInput của web và DTO backend); parentId để trống
 * = thư mục gốc của container; type 0 = thư mục, 1 = tệp.
 */
export function getBlobsPaged(input: BlobGetListInput) {
  return apiRequest<PagedResult<BlobDto>>('/api/blob-management/blobs', {
    method: 'GET',
    params: {
      containerId: input.containerId,
      parentId: input.parentId,
      type: input.type,
      contentType: input.contentType,
      skipCount: input.skipCount ?? 0,
      maxResultCount: input.maxResultCount ?? 20,
      sorting: input.sorting,
    },
  });
}

/** GET /api/blob-management/blobs/{id} */
export function getBlob(id: string) {
  return apiRequest<BlobDto>(`/api/blob-management/blobs/${encodeURIComponent(id)}`, {
    method: 'GET',
  });
}

/** POST /api/blob-management/blobs/folder — tạo thư mục trong container. */
export function createBlobFolder(input: BlobFolderCreateDto) {
  return apiRequest<BlobDto>('/api/blob-management/blobs/folder', {
    method: 'POST',
    body: input,
  });
}

/** DELETE /api/blob-management/blobs/{id} */
export function deleteBlob(id: string) {
  return apiRequest<void>(`/api/blob-management/blobs/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

/**
 * GET /api/blob-management/blobs/generate/download-url/{id} — trả về
 * chuỗi URL; màn detail mở URL này bằng trình duyệt hệ thống (mẫu
 * openapi), không tự tải binary về máy vì chưa có file-system flow.
 */
export function generateBlobDownloadUrl(id: string) {
  return apiRequest<string>(
    `/api/blob-management/blobs/generate/download-url/${encodeURIComponent(id)}`,
    {
      method: 'GET',
    },
  );
}

/** GET /api/blob-management/blobs/generate/preview-url/{id} — trả về chuỗi URL. */
export function generateBlobPreviewUrl(id: string) {
  return apiRequest<string>(
    `/api/blob-management/blobs/generate/preview-url/${encodeURIComponent(id)}`,
    {
      method: 'GET',
    },
  );
}
