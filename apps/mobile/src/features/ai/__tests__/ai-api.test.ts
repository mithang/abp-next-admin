import { describe, it, expect, afterEach } from '@jest/globals';
import {
  createAITool,
  createConversation,
  createWorkspace,
  deleteAITool,
  getAIToolProviders,
  getAIToolsPaged,
  getChatMessagesPaged,
  getConversationsPaged,
  getWorkspaceProviders,
  updateAITool,
  updateConversation,
  updateWorkspace,
} from '../ai-api';

function stubFetch(body: string, status = 200) {
  const calls: unknown[][] = [];
  const fn = async (...args: unknown[]) => {
    calls.push(args);
    return { ok: status >= 200 && status < 300, status, text: async () => body };
  };
  globalThis.fetch = fn as unknown as typeof fetch;
  return { calls };
}

function urlOf(calls: unknown[][], index = 0) {
  return calls[index][0] as string;
}

function methodOf(calls: unknown[][], index = 0) {
  return (calls[index][1] as { method: string }).method;
}

function bodyOf(calls: unknown[][], index = 0) {
  return JSON.parse((calls[index][1] as { body: string }).body) as Record<string, unknown>;
}

describe('ai api', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('tools: list gắn filter/isEnabled/provider + phân trang ABP; providers đúng route', async () => {
    const { calls } = stubFetch(JSON.stringify({ totalCount: 0, items: [] }));
    await getAIToolProviders();
    expect(urlOf(calls)).toContain('/api/ai-management/tools/available-providers');
    const list = stubFetch(JSON.stringify({ totalCount: 0, items: [] }));
    await getAIToolsPaged({ filter: 'x', isEnabled: true, provider: 'p', skipCount: 20, maxResultCount: 20 });
    expect(urlOf(list.calls)).toContain('/api/ai-management/tools?');
    expect(urlOf(list.calls)).toContain('filter=x');
    expect(urlOf(list.calls)).toContain('isEnabled=true');
    expect(urlOf(list.calls)).toContain('provider=p');
    expect(urlOf(list.calls)).toContain('skipCount=20');
  });

  it('tools: create POST /tools, update PUT /tools/{id} kèm concurrencyStamp, delete DELETE', async () => {
    const create = stubFetch(JSON.stringify({ id: '1' }));
    await createAITool({ name: 't', provider: 'p', isEnabled: true, isGlobal: false });
    expect(methodOf(create.calls)).toBe('POST');
    expect(urlOf(create.calls)).toContain('/api/ai-management/tools');
    const update = stubFetch(JSON.stringify({ id: '1' }));
    await updateAITool('abc', { provider: 'p', isEnabled: true, isGlobal: false, concurrencyStamp: 'stamp' });
    expect(methodOf(update.calls)).toBe('PUT');
    expect(urlOf(update.calls)).toContain('/api/ai-management/tools/abc');
    expect(bodyOf(update.calls).concurrencyStamp).toBe('stamp');
    const del = stubFetch('', 204);
    await deleteAITool('abc');
    expect(methodOf(del.calls)).toBe('DELETE');
  });

  it('workspaces: providers đúng route; update PUT /workspaces/{id} kèm concurrencyStamp', async () => {
    const prov = stubFetch(JSON.stringify({ items: [] }));
    await getWorkspaceProviders();
    expect(urlOf(prov.calls)).toContain('/api/ai-management/workspaces/available-providers');
    const update = stubFetch(JSON.stringify({ id: '1' }));
    await updateWorkspace('w1', {
      provider: 'p',
      modelName: 'm',
      displayName: 'W',
      isEnabled: true,
      concurrencyStamp: 'stamp',
    });
    expect(methodOf(update.calls)).toBe('PUT');
    expect(urlOf(update.calls)).toContain('/api/ai-management/workspaces/w1');
    expect(bodyOf(update.calls).concurrencyStamp).toBe('stamp');
    const create = stubFetch(JSON.stringify({ id: '1' }));
    await createWorkspace({ name: 'w', provider: 'p', modelName: 'm', displayName: 'W', isEnabled: true });
    expect(methodOf(create.calls)).toBe('POST');
  });

  it('conversations: list/create đúng /chats/conversations; update dùng route chats (không phải route web sai)', async () => {
    const list = stubFetch(JSON.stringify({ totalCount: 0, items: [] }));
    await getConversationsPaged({ filter: 'a' });
    expect(urlOf(list.calls)).toContain('/api/ai-management/chats/conversations?');
    const create = stubFetch(JSON.stringify({ id: 'c1' }));
    await createConversation({ workspace: 'ws' });
    expect(methodOf(create.calls)).toBe('POST');
    expect(urlOf(create.calls)).toContain('/api/ai-management/chats/conversations');
    const update = stubFetch(JSON.stringify({ id: 'c1' }));
    await updateConversation('c1', { name: 'Mới' });
    expect(methodOf(update.calls)).toBe('PUT');
    // Route đã xác minh qua Swagger; route /api/ai-management/conversations/{id} của web là 404.
    expect(urlOf(update.calls)).toContain('/api/ai-management/chats/conversations/c1');
    expect(urlOf(update.calls)).not.toBe('http://localhost:30000/api/ai-management/conversations/c1');
  });

  it('chat messages: GET /chats?conversationId=... (POST gửi tin là SSE, xem sse.test.ts)', async () => {
    const { calls } = stubFetch(JSON.stringify({ totalCount: 0, items: [] }));
    await getChatMessagesPaged({ conversationId: 'c1' });
    expect(urlOf(calls)).toContain('/api/ai-management/chats?');
    expect(urlOf(calls)).toContain('conversationId=c1');
  });
});
