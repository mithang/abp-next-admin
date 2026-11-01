/** Ánh xạ lỗi ABP Framework sang thông điệp thân thiện, không lộ nội dung nội bộ. */
export type ApiErrorKind =
  | 'network'
  | 'timeout'
  | 'unauthorized'
  | 'forbidden'
  | 'notFound'
  | 'validation'
  | 'conflict'
  | 'rateLimit'
  | 'server'
  | 'unexpected';

export interface ApiError {
  kind: ApiErrorKind;
  status?: number;
  /** Thông điệp đã làm sạch, an toàn để hiển thị. */
  message: string;
  /** Chi tiết validation theo field (ABP validationErrors), không chứa token/secret. */
  fieldErrors?: Record<string, string[]>;
}

interface AbpErrorBody {
  error?: {
    code?: string;
    message?: string;
    details?: string;
    validationErrors?: { message: string; members?: string[] }[];
  };
}

export function mapHttpStatusToKind(status: number): ApiErrorKind {
  if (status === 401) return 'unauthorized';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'notFound';
  if (status === 409) return 'conflict';
  if (status === 429) return 'rateLimit';
  if (status >= 400 && status < 500) return 'validation';
  if (status >= 500) return 'server';
  return 'unexpected';
}

const FALLBACK: Record<ApiErrorKind, string> = {
  network: 'Không có kết nối mạng. Vui lòng kiểm tra và thử lại.',
  timeout: 'Yêu cầu quá thời gian chờ. Vui lòng thử lại.',
  unauthorized: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  forbidden: 'Bạn không có quyền thực hiện thao tác này.',
  notFound: 'Không tìm thấy dữ liệu yêu cầu.',
  validation: 'Dữ liệu nhập chưa hợp lệ. Vui lòng kiểm tra lại.',
  conflict: 'Dữ liệu đã thay đổi hoặc bị trùng. Vui lòng tải lại và thử lại.',
  rateLimit: 'Bạn thao tác quá nhanh. Vui lòng chờ giây lát rồi thử lại.',
  server: 'Máy chủ đang gặp sự cố. Vui lòng thử lại sau.',
  unexpected: 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.',
};

export function parseApiError(status: number, body: unknown): ApiError {
  const kind = mapHttpStatusToKind(status);
  const parsed = (body ?? {}) as AbpErrorBody;
  const abp = parsed.error;
  const fieldErrors: Record<string, string[]> = {};
  if (abp?.validationErrors) {
    for (const ve of abp.validationErrors) {
      for (const member of ve.members ?? ['_']) {
        (fieldErrors[member] ??= []).push(ve.message);
      }
    }
  }
  // Chỉ dùng message của ABP khi nó là thông điệp nghiệp vụ ngắn, không chứa
  // stack trace; ngược lại dùng fallback thân thiện.
  const raw = abp?.message ?? '';
  const safeMessage =
    raw && raw.length <= 300 && !/stack trace|at\s+\S+\(/i.test(raw) ? raw : FALLBACK[kind];
  return {
    kind,
    status,
    message: safeMessage,
    fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
  };
}

export function toApiError(error: unknown): ApiError {
  if (error && typeof error === 'object' && 'kind' in error) return error as ApiError;
  if (error instanceof Error && /network|fetch failed|Network request failed/i.test(error.message)) {
    return { kind: 'network', message: FALLBACK.network };
  }
  if (error instanceof Error && /timed out|timeout|aborted/i.test(error.message)) {
    return { kind: 'timeout', message: FALLBACK.timeout };
  }
  return { kind: 'unexpected', message: FALLBACK.unexpected };
}
