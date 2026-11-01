import { apiUrl } from './config';
import {
  isWrappedEnvelope,
  parseApiError,
  parseWrappedError,
  toApiError,
  type ApiError,
  type WrappedEnvelope,
} from './errors';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  /** Query params; undefined/null bị bỏ qua. ABP dùng skipCount/maxResultCount/sorting. */
  params?: Record<string, string | number | boolean | undefined | null>;
  signal?: AbortSignal;
  timeoutMs?: number;
}

/** Token provider được auth store inject vào, tránh circular import. */
let tokenProvider: (() => Promise<string | null>) | null = null;
let unauthorizedHandler: (() => void) | null = null;

export function setTokenProvider(fn: (() => Promise<string | null>) | null) {
  tokenProvider = fn;
}
export function setUnauthorizedHandler(fn: (() => void) | null) {
  unauthorizedHandler = fn;
}

/**
 * Token hiện tại cho các client không dùng apiRequest (vd SSE chat, vốn
 * không parse JSON). Chỉ trả token, không log hay lưu thêm ở đâu khác.
 */
export function getApiToken(): Promise<string | null> {
  return tokenProvider ? tokenProvider() : Promise.resolve(null);
}

function buildQuery(params?: RequestOptions['params']): string {
  if (!params) return '';
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) search.append(key, String(value));
  }
  const q = search.toString();
  return q ? `?${q}` : '';
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, params, signal, timeoutMs = 30000 } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const onAbort = () => controller.abort();
  signal?.addEventListener('abort', onAbort);
  try {
    const token = tokenProvider ? await tokenProvider() : null;
    const response = await fetch(`${apiUrl(path)}${buildQuery(params)}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // Backend AllInOne bật AbpWrapper nên mặc định đóng gói mọi kết quả
        // vào envelope {code, message, result} kèm HTTP 200 (kể cả lỗi).
        // Header này (AbpHttpWrapConsts.AbpDontWrapResult — chính proxy
        // HttpClient nội bộ của backend cũng gửi) yêu cầu backend trả DTO
        // thô + lỗi ABP chuẩn (có HTTP status thật và validationErrors).
        // Nếu envelope vẫn về (header bị lược), khối dưới vẫn xử lý đúng.
        _AbpDontWrapResult: 'true',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
    if (response.status === 204) return undefined as T;
    const text = await response.text();
    const parsed: unknown = text ? JSON.parse(text) : null;
    // Envelope đóng gói (xem errors.ts): tín hiệu chính là header
    // _AbpWrapResult=true, fallback là đúng shape {code, message?, details?, result?}.
    // Xử lý TRƯỚC kiểm tra response.ok vì lỗi đóng gói về kèm HTTP 200.
    const wrapHeader = response.headers?.get?.('_AbpWrapResult');
    const headerWrapped = typeof wrapHeader === 'string' && wrapHeader.toLowerCase().includes('true');
    const envelope: WrappedEnvelope | null =
      headerWrapped || isWrappedEnvelope(parsed) ? (parsed as WrappedEnvelope) : null;
    if (envelope && typeof envelope.code === 'string') {
      if (envelope.code === '0') {
        // Thành công đóng gói: trả đúng DTO trong result (có thể undefined
        // khi backend lược result null — tương đương 204 cho mutation void).
        return envelope.result as T;
      }
      const err = parseWrappedError(envelope);
      if (err.status === 401) unauthorizedHandler?.();
      throw err;
    }
    if (!response.ok) {
      const err = parseApiError(response.status, parsed);
      if (response.status === 401) unauthorizedHandler?.();
      throw err;
    }
    return parsed as T;
  } catch (error) {
    if ((error as ApiError)?.kind) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw { kind: 'timeout', message: 'Yêu cầu quá thời gian chờ. Vui lòng thử lại.' } satisfies ApiError;
    }
    throw toApiError(error);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onAbort);
  }
}

/** Kiểu phân trang chuẩn ABP: { totalCount, items }. */
export interface PagedResult<T> {
  totalCount: number;
  items: T[];
}

export interface ListResult<T> {
  items: T[];
}

export interface PagedRequest {
  skipCount?: number;
  maxResultCount?: number;
  sorting?: string;
  filter?: string;
}
