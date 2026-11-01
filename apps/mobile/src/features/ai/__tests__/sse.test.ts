import { describe, it, expect, afterEach } from '@jest/globals';
import { createSseParser, parseSseEvent, sendChatMessageStream } from '../sse';

describe('sse parser', () => {
  it('parse event {m} và FINISHED đúng định dạng web/backend', () => {
    const parsed = parseSseEvent('data: {"m": "Xin ch\\u00e0o"}');
    expect(parsed.chunks).toEqual(['Xin chào']);
    expect(parsed.finished).toBe(false);
    const done = parseSseEvent('data: {"m": "FINISHED"}');
    expect(done.finished).toBe(true);
    expect(done.chunks).toEqual([]);
  });

  it('khoan dung: JSON string trần và văn bản thuần cũng thành mảnh', () => {
    expect(parseSseEvent('data: "abc"').chunks).toEqual(['abc']);
    expect(parseSseEvent('data: hello').chunks).toEqual(['hello']);
  });

  it('parser tăng dần giữ mảnh bị cắt đôi giữa 2 lần đọc', () => {
    const parser = createSseParser();
    expect(parser.push('data: {"m": "Xin ')).toEqual([]);
    expect(parser.push('chào"}\n\n')).toEqual(['Xin chào']);
    expect(parser.push('data: {"m": "FINISHED"}\n\n')).toEqual([]);
    expect(parser.finished).toBe(true);
  });

  it('flush xả event cuối không có \\n\\n khi stream đóng', () => {
    const parser = createSseParser();
    expect(parser.push('data: {"m": "cuối"}')).toEqual([]);
    expect(parser.flush()).toEqual(['cuối']);
  });
});

describe('sendChatMessageStream', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('POST /chats với Accept text/event-stream và body đúng DTO, phát mảnh theo thứ tự (fallback text)', async () => {
    const calls: unknown[][] = [];
    const sseText = 'data: {"m": "A"}\n\ndata: {"m": "B"}\n\ndata: {"m": "FINISHED"}\n\n';
    globalThis.fetch = (async (...args: unknown[]) => {
      calls.push(args);
      return { ok: true, status: 200, body: undefined, text: async () => sseText };
    }) as unknown as typeof fetch;
    const seen: string[] = [];
    let ended = false;
    await sendChatMessageStream(
      { conversationId: 'c1', workspace: 'ws', content: 'hi' },
      { onChunk: (c) => seen.push(c), onEnd: () => (ended = true) },
    );
    expect(calls[0][0]).toContain('/api/ai-management/chats');
    const init = calls[0][1] as { method: string; headers: Record<string, string>; body: string };
    expect(init.method).toBe('POST');
    expect(init.headers.Accept).toBe('text/event-stream');
    expect(JSON.parse(init.body)).toEqual({ conversationId: 'c1', workspace: 'ws', content: 'hi' });
    expect(seen).toEqual(['A', 'B']);
    expect(ended).toBe(true);
  });

  it('đọc stream bằng reader khi có, kể cả event cắt đôi giữa 2 chunk byte', async () => {
    const encoder = new TextEncoder();
    const parts = [encoder.encode('data: {"m": "X'), encoder.encode('Y"}\n\n'), encoder.encode('data: {"m": "FINISHED"}\n\n')];
    let i = 0;
    const reader = {
      read: async () => (i < parts.length ? { done: false, value: parts[i++] } : { done: true }),
      cancel: async () => {},
    };
    globalThis.fetch = (async () => ({
      ok: true,
      status: 200,
      body: { getReader: () => reader },
      text: async () => '',
    })) as unknown as typeof fetch;
    const seen: string[] = [];
    await sendChatMessageStream(
      { conversationId: 'c1', workspace: 'ws', content: 'hi' },
      { onChunk: (c) => seen.push(c) },
    );
    expect(seen).toEqual(['XY']);
  });

  it('lỗi HTTP ném ApiError đã parse, không trả JSON stream giả', async () => {
    globalThis.fetch = (async () => ({
      ok: false,
      status: 401,
      body: undefined,
      text: async () => JSON.stringify({ error: { message: 'Unauthorized' } }),
    })) as unknown as typeof fetch;
    await expect(
      sendChatMessageStream({ conversationId: 'c1', workspace: 'ws', content: 'hi' }, { onChunk: () => {} }),
    ).rejects.toMatchObject({ kind: 'unauthorized' });
  });
});
