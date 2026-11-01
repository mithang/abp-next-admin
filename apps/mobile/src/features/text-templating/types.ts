/**
 * DTO mẫu văn bản, đối chiếu backend C#:
 * - modules/text-templating/.../TextTemplateDefinitionDto.cs (key = name,
 *   ListResult, static → chỉ đọc như bảng web) + Create/UpdateDto
 *   (update nhận concurrencyStamp, không nhận name).
 * - modules/text-templating/.../TextTemplateContentDto.cs (nội dung theo
 *   culture: GET /templates/content[/{culture}]/{name}, PUT update,
 *   PUT .../restore-to-default).
 * Web types: packages/@abp/text-templating/src/types/{definitions,contents}.ts.
 * Lưu ý: getListApi của web nội suy biến `name` không tồn tại trong URL
 * list (ở trình duyệt nó là window.name, thực chất rỗng) — mobile dùng
 * đúng route list của backend, không copy cách đó.
 */

export interface TextTemplateDefinitionDto {
  name: string;
  displayName: string;
  defaultCultureName?: string;
  localizationResourceName?: string;
  renderEngine?: string;
  isInlineLocalized: boolean;
  isLayout: boolean;
  layout?: string;
  isStatic: boolean;
  concurrencyStamp: string;
  extraProperties?: Record<string, unknown>;
}

export interface TextTemplateDefinitionCreateDto {
  name: string;
  displayName: string;
  defaultCultureName?: string;
  localizationResourceName?: string;
  isInlineLocalized: boolean;
  isLayout: boolean;
  layout?: string;
  renderEngine?: string;
}

export interface TextTemplateDefinitionUpdateDto {
  displayName: string;
  defaultCultureName?: string;
  localizationResourceName?: string;
  isInlineLocalized: boolean;
  isLayout: boolean;
  layout?: string;
  renderEngine?: string;
  concurrencyStamp: string;
}

export interface TextTemplateDefinitionGetListInput {
  filter?: string;
  isStatic?: boolean;
  isLayout?: boolean;
}

export interface TextTemplateContentDto {
  name: string;
  culture?: string;
  content?: string;
}

export interface TextTemplateContentGetInput {
  name: string;
  culture?: string;
}

export interface TextTemplateContentUpdateDto {
  content: string;
  culture?: string;
}

export interface TextTemplateRestoreInput {
  culture?: string;
}
