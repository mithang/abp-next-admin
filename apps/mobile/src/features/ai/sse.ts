import { getApiToken } from '../../lib/api-client';
import { apiUrl } from '../../lib/config';
import { parseApiError, toApiError, type ApiError } from '../../lib/errors';
import type { SendTextChatMessageDto } from './types';

/**
 * Client SSE cho POST /api/ai-management/chats — KHÔNG dùng apiRequest
 * (apiRequest parse JSON, còn endpoint này trả stream).
 *
 * Định dạng dây đã đối chiếu web (packages/@abp/ai-management useChatsApi)
 * + backend: ChatAppService.SendMessageAsync trả IAsyncEnumerable<string>,
 * ABP stream thành các event SSE; mỗi event có một dòng `data:` chứa JSON
 * `{"m": "<mảnh văn bản>"}` và event cuối `{"m": "FINISHED"}`.
 * Parser dưới đây khoan dung thêm 2 dạng để không vỡ khi backend đổi cách
 * bọc: `data: "chuỗi"` (JSON string trần) và `data: văn bản thuần`.
 * Mảnh có thể bị cắt đôi giữa 2 lần đọc — parser giữ phần dở dang trong
 * buffer cho tới khi gặp `\n\n` kết thúc event.
 */

export interface SseParseResult {
  chunks: string[];
  finished: boolean;
}

/** Parse một event SSE hoàn chỉnh (không chứa `\n\n`) thành các mảnh. */
export function parseSseEvent(eventText: string): SseParseResult {
  const chunks: string[] = [];
  let finished = false;
  for (const line of eventText.split('\n')) {
    if (!line.startsWith('data:')) continue;
    const data = line.slice(5).trim();
    if (!data) continue;
    let value: unknown = data;
    try {
      value = JSON.parse(data);
    } catch {
      // Không phải JSON: giữ nguyên văn bản thuần.
    }
    if (typeof value === 'object' && value !== null && 'm' in value) {
      const m = (value as { m?: unknown }).m;
      if (m === 'FINISHED') {
        finished = true;
      } else if (typeof m === 'string' && m !== '') {
        chunks.push(m);
      }
    } else if (typeof value === 'string') {
      if (value === 'FINISHED') finished = true;
      else if (value !== '') chunks.push(value);
    }
  }
  return { chunks, finished };
}

/** Parser tăng dần: push() nhận text thô từng lần đọc, trả các mảnh hoàn chỉnh. */
export function createSseParser() {
  let buffer = '';
  let finished = false;
  return {
    get finished() {
      return finished;
    },
    push(text: string): string[] {
      if (finished) return [];
      buffer += text;
      const out: string[] = [];
      let idx = buffer.indexOf('\n\n');
      while (idx >= 0) {
        const eventText = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);
        const parsed = parseSseEvent(eventText);
        out.push(...parsed.chunks);
        if (parsed.finished) {
          finished = true;
          buffer = '';
          break;
        }
        idx = buffer.indexOf('\n\n');
      }
      return out;
    },
    /** Xả event cuối chưa có `\n\n` (khi stream đóng mà không gửi FINISHED). */
    flush(): string[] {
      if (finished || buffer.trim() === '') return [];
      const parsed = parseSseEvent(buffer);
      buffer = '';
      return parsed.chunks;
    },
  };
}

export interface SendChatMessageStreamOptions {
  onChunk: (chunk: string) => void;
  onEnd?: () => void;
  signal?: AbortSignal;
}

/**
 * POST /api/ai-management/chats bằng fetch trực tiếp với
 * `Accept: text/event-stream`, token Bearer lấy từ SecureStore qua cùng
 * token provider của apiRequest (không lưu/log token ở đây).
 *
 * Streaming thật khi runtime có ReadableStream reader (web/dev). React
 * Native fetch không expose reader — khi đó đọc toàn bộ body bằng text()
 * rồi parse rồi phát lại từng mảnh theo đúng thứ tự: nội dung cuối cùng
 * giống hệt, chỉ không hiển thị dần từng ký tự (ghi rõ trong báo cáo vòng).
 */
export async function sendChatMessageStream(
  input: SendTextChatMessageDto,
  options: SendChatMessageStreamOptions,
): Promise<void> {
  const token = await getApiToken();
  let response: Response;
  try {
    response = await fetch(apiUrl('/api/ai-management/chats'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(input),
      signal: options.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw toApiError(error);
  }
  if (!response.ok) {
    let parsed: unknown = null;
    try {
      const text = await response.text();
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = null;
    }
    const err: ApiError = parseApiError(response.status, parsed);
    throw err;
  }
  const parser = createSseParser();
  const emit = (chunks: string[]) => {
    for (const chunk of chunks) options.onChunk(chunk);
  };
  const reader = (
    response as unknown as {
      body?: {
        getReader?: () => {
          read: () => Promise<{ done: boolean; value?: Uint8Array }>;
          cancel?: () => Promise<void>;
        };
      };
    }
  ).body?.getReader?.();
  if (reader) {
    const Decoder = (globalThis as unknown as { TextDecoder?: typeof TextDecoder }).TextDecoder;
    if (!Decoder) {
      // Không có TextDecoder: fallback đọc toàn bộ body.
      const text = await response.text();
      emit(parser.push(text));
      emit(parser.flush());
      options.onEnd?.();
      return;
    }
    const decoder = new Decoder();
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) emit(parser.push(decoder.decode(value, { stream: true })));
        if (parser.finished) break;
      }
      emit(parser.push(decoder.decode(new Uint8Array(0), { stream: false })));
      emit(parser.flush());
    } finally {
      try {
        reader.cancel?.();
      } catch {
        // Bỏ qua lỗi hủy reader khi stream đã đóng.
      }
    }
  } else {
    const text = await response.text();
    emit(parser.push(text));
    emit(parser.flush());
  }
  options.onEnd?.();
}
