/**
 * Kiểu cho nhóm Blob (Blob Management), đối chiếu trực tiếp backend
 * LINGYUN.Abp.BlobManagement.Application.Contracts, không chỉ copy web:
 * - Container: IBlobContainerAppService — GET/POST
 *   /api/blob-management/containers, GET/DELETE /containers/{id}.
 *   Backend KHÔNG có Update cho container (không có UpdateDto), nên
 *   mobile cũng không có form sửa container — đúng backend, không phải
 *   thiếu sót.
 * - Tệp/thư mục: IBlobAppService — GET/POST /api/blob-management/blobs
 *   (phân trang ABP, lọc bắt buộc containerId + parentId/type/
 *   contentType), GET/DELETE /blobs/{id}, POST /blobs/folder,
 *   GET /blobs/generate/download-url/{id} và
 *   /blobs/generate/preview-url/{id}.
 * - Upload tệp: POST /blobs/file (multipart đơn) và POST
 *   /blobs/file/chunk (multipart chunked, web dùng vue-simple-uploader)
 *   cần file picker native — chưa xây ở vòng này (xem P2 trong báo cáo
 *   vòng 16), nên API layer không giả vờ có hàm upload.
 * DTO C# dùng PascalCase; JSON trả về camelCase như mọi API ABP khác.
 *
 * Điểm backend làm rõ mà chỉ đọc web sẽ làm sai:
 * - BlobDto backend KHÔNG có path (type web có path nhưng DTO C# chỉ
 *   có name/fullName/type/contentType/size/expirationTime/
 *   downloadCount); mobile hiển thị fullName, không dùng path.
 * - BlobType backend: Folder = 0, File = 1 (khớp type web).
 * - BlobContainerDto có concurrencyStamp nhưng vì không có Update nên
 *   stamp chỉ hiển thị ở detail, không gửi đi đâu.
 */

export interface PagedInput {
  filter?: string;
  skipCount?: number;
  maxResultCount?: number;
  sorting?: string;
}

/** Loại blob, đúng enum BlobType C# (số). */
export const BLOB_TYPE_FOLDER = 0;
export const BLOB_TYPE_FILE = 1;

export const BLOB_TYPE_LABELS: Record<number, string> = {
  0: 'Folder',
  1: 'File',
};

export interface BlobContainerDto {
  id: string;
  name: string;
  concurrencyStamp: string;
  creationTime?: string;
  creatorId?: string | null;
  lastModificationTime?: string | null;
  lastModifierId?: string | null;
}

export interface BlobContainerCreateDto {
  name: string;
}

export type BlobContainerGetListInput = PagedInput;

export interface BlobDto {
  id: string;
  name: string;
  fullName: string;
  type: number;
  contentType?: string | null;
  size: number;
  expirationTime?: string | null;
  downloadCount: number;
  creationTime?: string;
  creatorId?: string | null;
  lastModificationTime?: string | null;
  lastModifierId?: string | null;
}

export interface BlobFolderCreateDto {
  containerId: string;
  name: string;
  parentId?: string;
}

export interface BlobGetListInput extends PagedInput {
  containerId: string;
  parentId?: string;
  type?: number;
  contentType?: string;
}
