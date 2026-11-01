/**
 * Kiểu cho nhóm SaaS, đối chiếu trực tiếp backend
 * LINGYUN.Abp.Saas (Application.Contracts), không chỉ copy web:
 * - Tenants: GET/POST /api/saas/tenants, GET/PUT/DELETE
 *   /api/saas/tenants/{id} (ICrudAppService, id Guid).
 * - Chuỗi kết nối tenant: GET /api/saas/tenants/{id}/connection-string
 *   (tất cả), GET .../connection-string/{name}, PUT .../connection-string
 *   (đặt), DELETE .../connection-string/{name}, POST
 *   /api/saas/tenants/connection-string/check (trả void — thành công nghĩa
 *   là kết nối được, lỗi nghĩa là không kết nối được; dù có DTO
 *   TenantConnectionStringCheckResultDto trong contracts, signature
 *   ITenantAppService.CheckConnectionStringAsync trả Task, web cũng
 *   khai Promise<void>, nên mobile không đọc body boolean).
 * - Editions: GET/POST /api/saas/editions, GET/PUT/DELETE
 *   /api/saas/editions/{id}.
 * DTO C# dùng PascalCase; JSON trả về camelCase như mọi API ABP khác.
 * BẢO MẬT: giá trị connection string là credential — mobile KHÔNG bao giờ
 * render giá trị đã lưu lên UI (chỉ hiển thị tên + thao tác đặt/xóa/kiểm
 * tra); form đặt dùng input mật khẩu, không log giá trị.
 */

export interface PagedInput {
  filter?: string;
  skipCount?: number;
  maxResultCount?: number;
  sorting?: string;
}

export interface TenantDto {
  id: string;
  name: string;
  normalizedName: string;
  editionId?: string | null;
  editionName?: string | null;
  isActive: boolean;
  enableTime?: string | null;
  disableTime?: string | null;
  concurrencyStamp: string;
  creationTime?: string;
  extraProperties?: Record<string, unknown>;
}

export type TenantGetListInput = PagedInput;

export interface TenantCreateOrUpdateBase {
  name: string;
  isActive: boolean;
  editionId?: string | null;
  enableTime?: string | null;
  disableTime?: string | null;
  extraProperties?: Record<string, unknown>;
}

/** CreateDto C#: thêm adminEmailAddress/adminPassword bắt buộc, cờ dùng DB chung. */
export interface TenantCreateDto extends TenantCreateOrUpdateBase {
  adminEmailAddress: string;
  adminPassword: string;
  useSharedDatabase: boolean;
  defaultConnectionString?: string | null;
  connectionStrings: TenantConnectionStringSetInput[];
}

/** UpdateDto C#: giống base + concurrencyStamp; KHÔNG có admin fields. */
export interface TenantUpdateDto extends TenantCreateOrUpdateBase {
  concurrencyStamp: string;
}

export interface TenantConnectionStringDto {
  name: string;
  value?: string | null;
}

export interface TenantConnectionStringSetInput {
  name: string;
  value: string;
}

export interface TenantConnectionStringCheckInput {
  provider: string;
  name?: string | null;
  connectionString: string;
}

export interface EditionDto {
  id: string;
  displayName: string;
  concurrencyStamp: string;
  creationTime?: string;
  extraProperties?: Record<string, unknown>;
}

export type EditionGetListInput = PagedInput;

export interface EditionCreateOrUpdateBase {
  displayName: string;
  extraProperties?: Record<string, unknown>;
}

export type EditionCreateDto = EditionCreateOrUpdateBase;

/** UpdateDto C#: giống base + concurrencyStamp. */
export interface EditionUpdateDto extends EditionCreateOrUpdateBase {
  concurrencyStamp: string;
}
