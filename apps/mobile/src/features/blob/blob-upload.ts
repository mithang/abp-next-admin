/**
 * Upload tệp blob — bằng chứng protocol (không suy đoán):
 * - Web (@abp/blob-management BlobFileUploadModal.vue) dùng chunked:
 *   POST /api/blob-management/blobs/file/chunk, mỗi chunk kèm
 *   containerId/name/parentId + chunkNumber/chunkSize/currentChunkSize/
 *   totalChunks (vue-simple-uploader).
 * - Nhưng server gộp chunk trong BlobManager.CreateChunkBlobAsync bằng
 *   Directory.GetFiles(tempPath, "*.chunk").OrderBy(name) — sắp xếp
 *   CHUỖI tên file, nên từ 10 chunk trở lên thứ tự gộp sai
 *   ("10.chunk" xếp trước "2.chunk") và file >9 chunk sẽ hỏng.
 *   Vì vậy mobile KHÔNG dùng chunked cho tới khi backend sửa thứ tự
 *   gộp (sắp xếp theo số chunk), mà dùng endpoint single-file thật
 *   của cùng service: BlobAppService.CreateFileAsync →
 *   POST /api/blob-management/blobs/file (multipart, DTO
 *   BlobFileCreateDto: ContainerId + Name + ParentId? + File
 *   IRemoteStreamContent). Endpoint này tồn tại độc lập với web,
 *   không đổi contract nào của web.
 * - RN FormData: file part {uri, name, type} (uri từ DocumentPicker
 *   với copyToCacheDirectory=true để RN đọc được ngay, theo docs
 *   expo-document-picker SDK 58). Không đọc file vào bộ nhớ JS.
 */

export interface PickedBlobFile {
  uri: string;
  name: string;
  mimeType?: string | null;
  size?: number | null;
}

export interface BlobUploadInput {
  containerId: string;
  /** Tên lưu trên server; để trống = giữ tên file gốc đã chọn. */
  name?: string;
  parentId?: string;
  file: PickedBlobFile;
}

export interface BlobUploadForm {
  /** Các field scalar multipart (đúng tên property DTO, ABP bind không phân biệt hoa/thường). */
  fields: Record<string, string>;
  /** File part cho FormData.append('File', ...). */
  filePart: { uri: string; name: string; type: string };
}

/** Endpoint upload single-file (CreateFileAsync), không phải chunk. */
export const BLOB_FILE_UPLOAD_PATH = '/api/blob-management/blobs/file';

/**
 * Dựng field multipart cho upload: name trim, rỗng → tên file gốc;
 * parentId chỉ gửi khi có giá trị (thư mục gốc = không gửi, đúng
 * GetListInput của web: parentId để trống = root); mimeType thiếu →
 * application/octet-stream để ABP vẫn nhận stream.
 */
export function buildBlobUploadForm(input: BlobUploadInput): BlobUploadForm {
  const name = input.name?.trim() ? input.name.trim() : input.file.name;
  const fields: Record<string, string> = {
    containerId: input.containerId,
    name,
  };
  if (input.parentId) {
    fields.parentId = input.parentId;
  }
  return {
    fields,
    filePart: {
      uri: input.file.uri,
      name: input.file.name,
      type: input.file.mimeType || 'application/octet-stream',
    },
  };
}
