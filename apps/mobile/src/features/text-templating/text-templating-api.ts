import { apiRequest, type ListResult } from '../../lib/api-client';
import type {
  TextTemplateContentDto,
  TextTemplateContentGetInput,
  TextTemplateContentUpdateDto,
  TextTemplateDefinitionCreateDto,
  TextTemplateDefinitionDto,
  TextTemplateDefinitionGetListInput,
  TextTemplateDefinitionUpdateDto,
  TextTemplateRestoreInput,
} from './types';

const DEFINITIONS_BASE = '/api/text-templating/template/definitions';
const CONTENT_BASE = '/api/text-templating/templates/content';

/* ---------------- Định nghĩa mẫu: ListResult, key = name ---------------- */

/** GET /api/text-templating/template/definitions — ListResult, lọc filter/isStatic/isLayout. */
export function getTextTemplateDefinitions(input: TextTemplateDefinitionGetListInput = {}) {
  return apiRequest<ListResult<TextTemplateDefinitionDto>>(DEFINITIONS_BASE, {
    method: 'GET',
    params: { filter: input.filter, isStatic: input.isStatic, isLayout: input.isLayout },
  });
}

/** GET /api/text-templating/template/definitions/{name} */
export function getTextTemplateDefinition(name: string) {
  return apiRequest<TextTemplateDefinitionDto>(`${DEFINITIONS_BASE}/${encodeURIComponent(name)}`, {
    method: 'GET',
  });
}

/** POST /api/text-templating/template/definitions — tạo nhập name. */
export function createTextTemplateDefinition(input: TextTemplateDefinitionCreateDto) {
  return apiRequest<TextTemplateDefinitionDto>(DEFINITIONS_BASE, { method: 'POST', body: input });
}

/** PUT /api/text-templating/template/definitions/{name} — sửa không gửi name. */
export function updateTextTemplateDefinition(name: string, input: TextTemplateDefinitionUpdateDto) {
  return apiRequest<TextTemplateDefinitionDto>(`${DEFINITIONS_BASE}/${encodeURIComponent(name)}`, {
    method: 'PUT',
    body: input,
  });
}

/** DELETE /api/text-templating/template/definitions/{name} — bảng web vô hiệu với mẫu tĩnh. */
export function deleteTextTemplateDefinition(name: string) {
  return apiRequest<void>(`${DEFINITIONS_BASE}/${encodeURIComponent(name)}`, { method: 'DELETE' });
}

/* ---------------- Nội dung mẫu: theo culture (modal Edit contents của web) ---------------- */

/** GET /api/text-templating/templates/content[/{culture}]/{name} */
export function getTextTemplateContent(input: TextTemplateContentGetInput) {
  const path = input.culture
    ? `${CONTENT_BASE}/${encodeURIComponent(input.culture)}/${encodeURIComponent(input.name)}`
    : `${CONTENT_BASE}/${encodeURIComponent(input.name)}`;
  return apiRequest<TextTemplateContentDto>(path, { method: 'GET' });
}

/** PUT /api/text-templating/templates/content/{name} */
export function updateTextTemplateContent(name: string, input: TextTemplateContentUpdateDto) {
  return apiRequest<TextTemplateContentDto>(`${CONTENT_BASE}/${encodeURIComponent(name)}`, {
    method: 'PUT',
    body: input,
  });
}

/** PUT /api/text-templating/templates/content/{name}/restore-to-default */
export function restoreTextTemplateContentToDefault(name: string, input: TextTemplateRestoreInput) {
  return apiRequest<void>(`${CONTENT_BASE}/${encodeURIComponent(name)}/restore-to-default`, {
    method: 'PUT',
    body: input,
  });
}
