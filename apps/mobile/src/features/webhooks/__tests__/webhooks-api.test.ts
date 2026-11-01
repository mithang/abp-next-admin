import { describe, it, expect } from '@jest/globals';
import {
  bulkDeleteWebhookSendAttempts,
  bulkDeleteWebhookSubscriptions,
  bulkResendWebhookSendAttempts,
  createWebhookDefinition,
  createWebhookGroupDefinition,
  createWebhookSubscription,
  deleteWebhookDefinition,
  deleteWebhookGroupDefinition,
  deleteWebhookSendAttempt,
  deleteWebhookSubscription,
  getAvailableWebhooks,
  getWebhookDefinition,
  getWebhookDefinitions,
  getWebhookGroupDefinition,
  getWebhookGroupDefinitions,
  getWebhookSendAttempt,
  getWebhookSendAttemptsPaged,
  getWebhookSubscription,
  getWebhookSubscriptionsPaged,
  resendWebhookSendAttempt,
  updateWebhookDefinition,
  updateWebhookGroupDefinition,
  updateWebhookSubscription,
} from '../webhooks-api';

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

describe('webhook groups api', () => {
  it('list ListResult lọc filter; get/create/update/delete đúng route, update KHÔNG gửi name', async () => {
    const { calls } = stubFetch(JSON.stringify({ items: [{ name: 'g1' }] }));
    const result = await getWebhookGroupDefinitions({ filter: 'pay' });
    expect(urlOf(calls)).toContain('/api/webhooks/definitions/groups?');
    expect(urlOf(calls)).toContain('filter=pay');
    expect(result.items[0].name).toBe('g1');

    const get = stubFetch(JSON.stringify({ name: 'g1' }));
    await getWebhookGroupDefinition('g1');
    expect(urlOf(get.calls)).toContain('/api/webhooks/definitions/groups/g1');

    const created = stubFetch(JSON.stringify({ name: 'g1' }));
    await createWebhookGroupDefinition({ name: 'g1', displayName: 'Nhóm 1' });
    expect(methodOf(created.calls)).toBe('POST');
    expect(bodyOf(created.calls).name).toBe('g1');

    const upd = stubFetch(JSON.stringify({ name: 'g1' }));
    await updateWebhookGroupDefinition('g1', { displayName: 'Mới' });
    expect(methodOf(upd.calls)).toBe('PUT');
    expect(bodyOf(upd.calls)).not.toHaveProperty('name');

    const del = stubFetch('');
    await deleteWebhookGroupDefinition('g1');
    expect(methodOf(del.calls)).toBe('DELETE');
  });
});

describe('webhook definitions api', () => {
  it('list lọc filter/groupName; create nhập groupName+name; update KHÔNG gửi groupName/name', async () => {
    const { calls } = stubFetch(JSON.stringify({ items: [] }));
    await getWebhookDefinitions({ filter: 'pay', groupName: 'g1' });
    expect(urlOf(calls)).toContain('/api/webhooks/definitions?');
    expect(urlOf(calls)).toContain('groupName=g1');

    const get = stubFetch(JSON.stringify({ name: 'w1' }));
    await getWebhookDefinition('w1');
    expect(urlOf(get.calls)).toContain('/api/webhooks/definitions/w1');

    const created = stubFetch(JSON.stringify({ name: 'w1' }));
    await createWebhookDefinition({
      groupName: 'g1',
      name: 'w1',
      displayName: 'W1',
      isEnabled: true,
    });
    expect(methodOf(created.calls)).toBe('POST');
    expect(bodyOf(created.calls).groupName).toBe('g1');

    const upd = stubFetch(JSON.stringify({ name: 'w1' }));
    await updateWebhookDefinition('w1', { displayName: 'Mới', isEnabled: false });
    expect(methodOf(upd.calls)).toBe('PUT');
    expect(bodyOf(upd.calls)).not.toHaveProperty('name');
    expect(bodyOf(upd.calls)).not.toHaveProperty('groupName');

    const del = stubFetch('');
    await deleteWebhookDefinition('w1');
    expect(methodOf(del.calls)).toBe('DELETE');
  });
});

describe('webhook subscriptions api', () => {
  it('paged list + create/update/delete + bulk + availables đúng route/method/body', async () => {
    const { calls } = stubFetch(JSON.stringify({ totalCount: 1, items: [] }));
    await getWebhookSubscriptionsPaged({ filter: 'hook', skipCount: 0, maxResultCount: 20 });
    expect(urlOf(calls)).toContain('/api/webhooks/subscriptions?');
    expect(urlOf(calls)).toContain('filter=hook');

    const get = stubFetch(JSON.stringify({ id: 's1' }));
    await getWebhookSubscription('s1');
    expect(urlOf(get.calls)).toContain('/api/webhooks/subscriptions/s1');

    const created = stubFetch(JSON.stringify({ id: 's1' }));
    await createWebhookSubscription({
      webhookUri: 'https://example.com/hook',
      isActive: true,
      webhooks: ['w1'],
      headers: { 'X-A': '1' },
    });
    expect(methodOf(created.calls)).toBe('POST');
    expect(bodyOf(created.calls).webhookUri).toBe('https://example.com/hook');

    const upd = stubFetch(JSON.stringify({ id: 's1' }));
    await updateWebhookSubscription('s1', {
      webhookUri: 'https://example.com/hook',
      isActive: false,
      webhooks: [],
      concurrencyStamp: 's1',
    });
    expect(methodOf(upd.calls)).toBe('PUT');
    expect(bodyOf(upd.calls).concurrencyStamp).toBe('s1');

    const del = stubFetch('');
    await deleteWebhookSubscription('s1');
    expect(methodOf(del.calls)).toBe('DELETE');

    const bulk = stubFetch('');
    await bulkDeleteWebhookSubscriptions({ recordIds: ['s1', 's2'] });
    expect(urlOf(bulk.calls)).toContain('/api/webhooks/subscriptions/delete-many');
    expect(methodOf(bulk.calls)).toBe('DELETE');
    expect(bodyOf(bulk.calls).recordIds).toEqual(['s1', 's2']);

    const av = stubFetch(JSON.stringify({ items: [] }));
    await getAvailableWebhooks();
    expect(urlOf(av.calls)).toContain('/api/webhooks/subscriptions/availables');
  });
});

describe('webhook send attempts api', () => {
  it('paged list + get/delete/resend + bulk delete/resend đúng route/method/body', async () => {
    const { calls } = stubFetch(JSON.stringify({ totalCount: 0, items: [] }));
    await getWebhookSendAttemptsPaged({ subscriptionId: 's1', skipCount: 0, maxResultCount: 20 });
    expect(urlOf(calls)).toContain('/api/webhooks/send-attempts?');
    expect(urlOf(calls)).toContain('subscriptionId=s1');

    const get = stubFetch(JSON.stringify({ id: 'a1' }));
    await getWebhookSendAttempt('a1');
    expect(urlOf(get.calls)).toContain('/api/webhooks/send-attempts/a1');

    const del = stubFetch('');
    await deleteWebhookSendAttempt('a1');
    expect(methodOf(del.calls)).toBe('DELETE');

    const resend = stubFetch('');
    await resendWebhookSendAttempt('a1');
    expect(urlOf(resend.calls)).toContain('/api/webhooks/send-attempts/a1/resend');
    expect(methodOf(resend.calls)).toBe('POST');

    const bulkDel = stubFetch('');
    await bulkDeleteWebhookSendAttempts({ recordIds: ['a1'] });
    expect(urlOf(bulkDel.calls)).toContain('/api/webhooks/send-attempts/delete-many');
    expect(bodyOf(bulkDel.calls).recordIds).toEqual(['a1']);

    const bulkResend = stubFetch('');
    await bulkResendWebhookSendAttempts({ recordIds: ['a1', 'a2'] });
    expect(urlOf(bulkResend.calls)).toContain('/api/webhooks/send-attempts/resend-many');
    expect(methodOf(bulkResend.calls)).toBe('POST');
    expect(bodyOf(bulkResend.calls).recordIds).toEqual(['a1', 'a2']);
  });
});
