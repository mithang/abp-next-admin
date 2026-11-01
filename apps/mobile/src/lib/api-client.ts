import { apiUrl } from './config';
import { parseApiError, toApiError, type ApiError } from './errors';

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
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
    if (response.status === 204) return undefined as T;
    const text = await response.text();
    const parsed: unknown = text ? JSON.parse(text) : null;
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
