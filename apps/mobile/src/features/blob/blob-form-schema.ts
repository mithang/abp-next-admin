import { z } from 'zod';

/**
 * Schema form Blob, đúng DTO C#:
 * - Container: chỉ có name bắt buộc (BlobContainerCreateDto); backend
 *   không có Update nên không có schema sửa container.
 * - Thư mục: containerId + name bắt buộc, parentId tùy chọn (để trống
 *   = thư mục gốc của container; form preset containerId/parentId từ
 *   màn danh sách tệp, đúng nút tạo thư mục của bảng web).
 */
export const blobContainerFormSchema = z.object({
  name: z.string().trim().min(1, 'blobContainers.nameRequired'),
});

export type BlobContainerFormValues = z.infer<typeof blobContainerFormSchema>;

export const blobContainerFormDefaults: BlobContainerFormValues = { name: '' };

export const blobFolderFormSchema = z.object({
  name: z.string().trim().min(1, 'blobBlobs.folderNameRequired'),
});

export type BlobFolderFormValues = z.infer<typeof blobFolderFormSchema>;

export const blobFolderFormDefaults: BlobFolderFormValues = { name: '' };
