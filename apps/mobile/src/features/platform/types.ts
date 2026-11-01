/**
 * Kiểu cho nhóm Nền tảng (Platform), đối chiếu trực tiếp backend
 * LINGYUN.Platform.Application.Contracts, không chỉ copy web:
 * - Từ điển dữ liệu: IDataAppService — GET/POST /api/platform/datas,
 *   GET/PUT/DELETE /api/platform/datas/{id}, GET /api/platform/datas/all
 *   (ListResult, bảng web dùng /all rồi dựng cây theo parentId, không
 *   dùng phân trang server), GET /api/platform/datas/by-name/{name},
 *   PUT /api/platform/datas/{id}/move { parentId }, và mục:
 *   POST /api/platform/datas/{id}/items, PUT/DELETE
 *   /api/platform/datas/{id}/items/{name} (xác định mục bằng name).
 * - Bố cục: ILayoutAppService — GET/POST /api/platform/layouts (phân
 *   trang ABP, lọc filter/framework), GET/PUT/DELETE
 *   /api/platform/layouts/{id}. Web không dùng /layouts/all nên mobile
 *   cũng không tự suy đoán route đó.
 * DTO C# dùng PascalCase; JSON trả về camelCase như mọi API ABP khác.
 *
 * Điểm backend làm rõ mà chỉ đọc web sẽ làm sai:
 * - DataDto có code (do backend sinh, không có trong Create/UpdateDto)
 *   nên form tạo/sửa KHÔNG nhập code; update cũng KHÔNG gửi parentId
 *   (DataUpdateDto = base name/displayName/description) — đổi cha phải
 *   qua MoveAsync riêng (PUT .../move).
 * - LayoutCreateDto thêm dataId + framework (chỉ lúc tạo, modal web ẩn
 *   2 field này khi sửa); LayoutUpdateDto = base name/displayName/path/
 *   redirect/description, KHÔNG có dataId/framework.
 * - DataItemUpdateDto không có name (mục xác định bằng name trên URL);
 *   form sửa khóa name, chỉ sửa displayName/valueType/defaultValue/
 *   allowBeNull/description.
 * - ValueType C# (số): String 0, Numeic 1 (đúng lỗi chính tả của backend),
 *   Boolean 2, Date 3, DateTime 4, Array 5, Object 6. Modal web chỉ chào
 *   0–5 (ghi TODO Object chưa hỗ trợ) nên form mobile cũng chỉ nhận
 *   0–5; màn detail vẫn hiển thị tên Object khi gặp giá trị 6 từ dữ liệu cũ.
 */

export interface PagedInput {
  filter?: string;
  skipCount?: number;
  maxResultCount?: number;
  sorting?: string;
}

/** Loại giá trị của mục từ điển, đúng enum ValueType C# (số). */
export const DATA_VALUE_TYPE_LABELS: Record<number, string> = {
  0: 'String',
  1: 'Number',
  2: 'Boolean',
  3: 'Date',
  4: 'DateTime',
  5: 'Array',
  6: 'Object',
};

export interface DataItemDto {
  id: string;
  name: string;
  displayName: string;
  defaultValue?: string | null;
  description?: string | null;
  allowBeNull: boolean;
  valueType: number;
}

export interface DataDto {
  id: string;
  name: string;
  code: string;
  displayName: string;
  description?: string | null;
  parentId?: string | null;
  items: DataItemDto[];
}

export type DataGetListInput = PagedInput;

/** CreateDto C#: base + parentId (chỉ lúc tạo, để trống = gốc). */
export interface DataCreateDto {
  name: string;
  displayName: string;
  description?: string | null;
  parentId?: string | null;
}

/** UpdateDto C#: base, KHÔNG có parentId/code — đổi cha qua move riêng. */
export interface DataUpdateDto {
  name: string;
  displayName: string;
  description?: string | null;
}

export interface DataMoveDto {
  parentId?: string | null;
}

export interface DataItemCreateDto {
  name: string;
  displayName: string;
  defaultValue?: string | null;
  description?: string | null;
  allowBeNull: boolean;
  valueType: number;
}

/** UpdateDto mục: KHÔNG có name (xác định bằng name trên URL). */
export interface DataItemUpdateDto {
  displayName: string;
  defaultValue?: string | null;
  description?: string | null;
  allowBeNull: boolean;
  valueType: number;
}

/** LayoutDto = RouteDto + framework + dataId. */
export interface LayoutDto {
  id: string;
  path: string;
  name: string;
  displayName: string;
  description?: string | null;
  redirect?: string | null;
  meta?: Record<string, unknown>;
  framework: string;
  dataId: string;
}

export interface LayoutGetListInput extends PagedInput {
  framework?: string;
}

/** CreateDto bố cục: base + dataId + framework (chỉ lúc tạo). */
export interface LayoutCreateDto {
  name: string;
  displayName: string;
  description?: string | null;
  path: string;
  redirect?: string | null;
  dataId: string;
  framework: string;
}

/** UpdateDto bố cục: base, KHÔNG có dataId/framework. */
export interface LayoutUpdateDto {
  name: string;
  displayName: string;
  description?: string | null;
  path: string;
  redirect?: string | null;
}
