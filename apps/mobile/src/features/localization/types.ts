/**
 * DTO quản lý bản địa hoá, đối chiếu
 * apps/vben5/packages/@abp/localization/src/types/{languages,resources,texts}.ts
 * và backend modules/localization-management/...Application.Contracts.
 *
 * Lưu ý khác biệt 3 trang lá (đã đối chiếu cả backend, không chỉ web):
 * - Ngôn ngữ: khóa là cultureName (đường dẫn /languages/{cultureName}).
 *   Backend LanguageUpdateDto CHỈ có displayName (LanguageCreateOrUpdateDto);
 *   uiCultureName chỉ có ở LanguageCreateDto — form sửa hiển thị
 *   uiCultureName dạng chỉ đọc, không gửi lên (web modal gửi cả formModel
 *   nhưng trường này bị backend bỏ qua khi update).
 * - Tài nguyên: khóa là name; update nhận enable/displayName/description/
 *   defaultCultureName. Modal web không có ô defaultCultureName nên mobile
 *   giữ nguyên giá trị đã tải khi sửa (giống cách giữ concurrencyStamp ở
 *   các nhóm khác), không tự đặt lại.
 * - Văn bản: KHÔNG phải CRUD chuẩn. GET /texts trả ListResult<TextDifferenceDto>
 *   là left-join từ culture nguồn sang culture đích (TextAppService.
 *   GetDifferencesAsync): mỗi dòng chỉ tồn tại khi key đã có ở culture
 *   nguồn; targetValue null khi đích chưa có bản dịch; onlyNull chỉ lọc
 *   các dòng đích thiếu/rỗng. "Sửa" thực chất là PUT set-text cho culture
 *   đích (SetTextAsync tự tạo mới nếu chưa có, cập nhật nếu đã có).
 *   Xóa dùng đúng input như bảng web: { resourceName, cultureName (nguồn
 *   của dòng), key } gửi trong body DELETE.
 */

export interface LanguageDto {
  id?: string;
  cultureName: string;
  uiCultureName?: string;
  displayName: string;
  twoLetterISOLanguageName?: string;
  creationTime?: string;
  lastModificationTime?: string;
}

export interface LanguageCreateDto {
  cultureName: string;
  uiCultureName?: string;
  displayName: string;
}

/** Backend update ngôn ngữ chỉ nhận displayName. */
export interface LanguageUpdateDto {
  displayName: string;
}

export interface LanguageGetPagedListInput {
  filter?: string;
  skipCount?: number;
  maxResultCount?: number;
  sorting?: string;
}

export interface ResourceDto {
  id?: string;
  name: string;
  displayName: string;
  description?: string;
  defaultCultureName?: string;
  enable: boolean;
  creationTime?: string;
  lastModificationTime?: string;
}

export interface ResourceCreateDto {
  name: string;
  displayName: string;
  description?: string;
  enable: boolean;
}

export interface ResourceUpdateDto {
  displayName: string;
  description?: string;
  defaultCultureName?: string;
  enable: boolean;
}

export interface ResourceGetPagedListInput {
  filter?: string;
  skipCount?: number;
  maxResultCount?: number;
  sorting?: string;
}

/** Một dòng so sánh văn bản: value = culture nguồn, targetValue = culture đích (null khi chưa dịch). */
export interface TextDifferenceDto {
  resourceName: string;
  cultureName: string;
  key: string;
  value: string;
  targetCultureName: string;
  targetValue?: string | null;
}

export interface TextDto {
  resourceName: string;
  cultureName: string;
  key: string;
  value?: string | null;
}

export interface GetTextsInput {
  cultureName: string;
  targetCultureName: string;
  resourceName?: string;
  filter?: string;
  onlyNull?: boolean;
}

export interface GetTextByKeyInput {
  cultureName: string;
  key: string;
  resourceName: string;
}

export interface SetTextInput {
  cultureName: string;
  key: string;
  resourceName: string;
  value: string;
}

export interface DeleteTextInput {
  cultureName: string;
  key: string;
  resourceName: string;
}
