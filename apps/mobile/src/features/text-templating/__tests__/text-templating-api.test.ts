import { describe, it, expect } from '@jest/globals';
import {
  createTextTemplateDefinition,
  deleteTextTemplateDefinition,
  getTextTemplateContent,
  getTextTemplateDefinition,
  getTextTemplateDefinitions,
  restoreTextTemplateContentToDefault,
  updateTextTemplateContent,
  updateTextTemplateDefinition,
} from '../text-templating-api';

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

describe('text template definitions api', () => {
  it('list dùng đúng route list của backend (không nội suy name như web); create/update/delete đúng', async () => {
    const { calls } = stubFetch(JSON.stringify({ items: [] }));
    await getTextTemplateDefinitions({ filter: 'mail' });
    expect(urlOf(calls)).toContain('/api/text-templating/template/definitions?');
    expect(urlOf(calls)).toContain('filter=mail');
    expect(urlOf(calls)).not.toContain('undefined');

    const get = stubFetch(JSON.stringify({ name: 't1' }));
    await getTextTemplateDefinition('t1');
    expect(urlOf(get.calls)).toContain('/api/text-templating/template/definitions/t1');

    const created = stubFetch(JSON.stringify({ name: 't1' }));
    await createTextTemplateDefinition({ name: 't1', displayName: 'T1', isInlineLocalized: false, isLayout: false });
    expect(methodOf(created.calls)).toBe('POST');
    expect(bodyOf(created.calls).name).toBe('t1');

    const upd = stubFetch(JSON.stringify({ name: 't1' }));
    await updateTextTemplateDefinition('t1', {
      displayName: 'Mới',
      isInlineLocalized: false,
      isLayout: false,
      concurrencyStamp: 's1',
    });
    expect(methodOf(upd.calls)).toBe('PUT');
    expect(bodyOf(upd.calls)).not.toHaveProperty('name');
    expect(bodyOf(upd.calls).concurrencyStamp).toBe('s1');

    const del = stubFetch('');
    await deleteTextTemplateDefinition('t1');
    expect(methodOf(del.calls)).toBe('DELETE');
  });
});

describe('text template content api', () => {
  it('get có/không culture; update; restore-to-default đúng route/method/body', async () => {
    const noCulture = stubFetch(JSON.stringify({ name: 't1' }));
    await getTextTemplateContent({ name: 't1' });
    expect(urlOf(noCulture.calls)).toContain('/api/text-templating/templates/content/t1');
    expect(urlOf(noCulture.calls)).not.toContain('undefined');

    const withCulture = stubFetch(JSON.stringify({ name: 't1', culture: 'vi' }));
    await getTextTemplateContent({ name: 't1', culture: 'vi' });
    expect(urlOf(withCulture.calls)).toContain('/api/text-templating/templates/content/vi/t1');

    const upd = stubFetch(JSON.stringify({ name: 't1' }));
    await updateTextTemplateContent('t1', { content: 'Xin chào', culture: 'vi' });
    expect(methodOf(upd.calls)).toBe('PUT');
    expect(bodyOf(upd.calls).content).toBe('Xin chào');

    const restore = stubFetch('');
    await restoreTextTemplateContentToDefault('t1', { culture: 'vi' });
    expect(urlOf(restore.calls)).toContain('/api/text-templating/templates/content/t1/restore-to-default');
    expect(methodOf(restore.calls)).toBe('PUT');
    expect(bodyOf(restore.calls).culture).toBe('vi');
  });
});
