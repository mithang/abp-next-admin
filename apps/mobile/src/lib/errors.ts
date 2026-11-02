import i18n from '../i18n';

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

/**
 * Thông điệp fallback theo ngôn ngữ hiện tại (i18n `errors.*`), phân giải
 * tại thời điểm gọi — không phải lúc import — nên đổi ngôn ngữ trong app
 * cũng đổi luôn message lỗi fallback. Không còn chuỗi hardcode ở đây.
 */
export function fallbackMessage(kind: ApiErrorKind): string {
  return i18n.t(`errors.${kind}`);
}

/** Chỉ dùng message nghiệp vụ ngắn, không chứa stack trace; ngược lại fallback. */
function toSafeMessage(raw: string, kind: ApiErrorKind): string {
  return raw && raw.length <= 300 && !/stack trace|at\s+\S+\(/i.test(raw)
    ? raw
    : fallbackMessage(kind);
}

/**
 * Envelope đóng gói của backend (LINGYUN.Abp.Wrapper, bật ở AllInOne với
 * CodeWithSuccess "0" và HttpStatusCode OK mặc định): thành công là
 * {code:"0", message:"OK", result:<DTO>}, lỗi là {code:"400"|"500"|...,
 * message, details} kèm HTTP 200. Web xử lý envelope này ở
 * useWrapperResult; mobile xử lý ở api-client.
 *
 * Lưu ý: envelope lỗi KHÔNG mang validationErrors có cấu trúc (WrapResult
 * chỉ có code/message/details) nên lỗi validation qua envelope chỉ hiện
 * message chung, không có lỗi theo field — đó là lý do api-client gửi kèm
 * header _AbpDontWrapResult để nhận lỗi ABP chuẩn có validationErrors.
 */
export interface WrappedEnvelope {
  code: string;
  message?: string;
  details?: string;
  result?: unknown;
}

const WRAP_ENVELOPE_KEYS = new Set(['code', 'message', 'details', 'result']);

export function isWrappedEnvelope(body: unknown): body is WrappedEnvelope {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return false;
  const record = body as Record<string, unknown>;
  if (typeof record.code !== 'string') return false;
  // Chỉ nhận đúng shape envelope: tránh nhầm DTO thật có field `code`
  // (vd DataDto/MenuDto) — các DTO đó luôn có thêm key ngoài 4 key này.
  // Header _AbpWrapResult (xem api-client) là tín hiệu chính; shape này là
  // fallback khi header bị lược (proxy) — và vẫn an toàn nhờ kiểm tra key.
  return Object.keys(record).every((key) => WRAP_ENVELOPE_KEYS.has(key));
}

/**
 * Map mã lỗi trong envelope sang ApiError. Mã số 3 chữ số (phổ biến nhất:
 * DefaultExceptionWrapHandler dùng mã HTTP khi exception không có error
 * code riêng) map như HTTP status; mã nghiệp vụ không phải số (phần sau
 * dấu ":" của error code ABP) map về 'server' nhưng vẫn giữ message an
 * toàn của envelope thay vì fallback chung.
 */
export function parseWrappedError(envelope: WrappedEnvelope): ApiError {
  const numeric = /^\d{3}$/.test(envelope.code) ? Number(envelope.code) : null;
  const kind = numeric !== null ? mapHttpStatusToKind(numeric) : 'server';
  return {
    kind,
    status: numeric ?? undefined,
    message: toSafeMessage(envelope.message ?? '', kind),
  };
}

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
  return {
    kind,
    status,
    message: toSafeMessage(abp?.message ?? '', kind),
    fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
  };
}

export function toApiError(error: unknown): ApiError {
  if (error && typeof error === 'object' && 'kind' in error) return error as ApiError;
  if (
    error instanceof Error &&
    /network|fetch failed|Network request failed/i.test(error.message)
  ) {
    return { kind: 'network', message: fallbackMessage('network') };
  }
  if (error instanceof Error && /timed out|timeout|aborted/i.test(error.message)) {
    return { kind: 'timeout', message: fallbackMessage('timeout') };
  }
  return { kind: 'unexpected', message: fallbackMessage('unexpected') };
}
