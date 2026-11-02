import { describe, it, expect, afterEach } from '@jest/globals';
import {
  createNotificationDefinition,
  createNotificationGroup,
  deleteMyNotification,
  deleteNotificationDefinition,
  deleteNotificationGroup,
  deleteNotificationSendRecord,
  getMyNotification,
  getMyNotificationsPaged,
  getNotificationDefinition,
  getNotificationDefinitions,
  getNotificationGroup,
  getNotificationGroups,
  getNotificationSendRecordsPaged,
  markMyNotificationsRead,
  reSendNotificationRecord,
  sendNotification,
  updateNotificationDefinition,
  updateNotificationGroup,
} from '../notifications-api';
import {
  contentTypeName,
  deserializeNotification,
  lifetimeName,
  NotificationContentType,
  NotificationLifetime,
  NotificationReadState,
  NotificationSeverity,
  NotificationType,
  notificationTypeName,
  readStateName,
  sendStateName,
  severityName,
} from '../types';

function stubFetch(body: string, status = 200) {
  const calls: unknown[][] = [];
  const fn = async (...args: unknown[]) => {
    calls.push(args);
    return { ok: status >= 200 && status < 300, status, text: async () => body };
  };
  globalThis.fetch = fn as unknown as typeof fetch;
  return { calls };
}

function bodyOf(calls: unknown[][], index = 0) {
  return JSON.parse((calls[index][1] as { body: string }).body) as Record<string, unknown>;
}

function methodOf(calls: unknown[][], index = 0) {
  return (calls[index][1] as { method: string }).method;
}

describe('notifications api', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('getMyNotificationsPaged gắn filter/readState/skipCount/maxResultCount', async () => {
    const { calls } = stubFetch(JSON.stringify({ totalCount: 0, items: [] }));
    await getMyNotificationsPaged({
      filter: 'order',
      readState: NotificationReadState.UnRead,
      skipCount: 20,
      maxResultCount: 20,
    });
    const url = calls[0][0] as string;
    expect(url).toContain('/api/notifications/my-notifilers?');
    expect(url).toContain('filter=order');
    expect(url).toContain('readState=1');
    expect(url).toContain('skipCount=20');
    expect(url).toContain('maxResultCount=20');
  });

  it('getMyNotification encode id; delete dùng DELETE; mark-read-state PUT body { idList, state }', async () => {
    const { calls } = stubFetch(JSON.stringify({ id: '1' }));
    await getMyNotification('a b');
    expect(calls[0][0]).toContain('/api/notifications/my-notifilers/a%20b');
    const del = stubFetch('', 204);
    await deleteMyNotification('7');
    expect(del.calls[0][0]).toContain('/api/notifications/my-notifilers/7');
    expect(methodOf(del.calls, 0)).toBe('DELETE');
    const mark = stubFetch('', 204);
    await markMyNotificationsRead({ idList: ['1', '2'], state: NotificationReadState.Read });
    expect(mark.calls[0][0]).toContain('/api/notifications/my-notifilers/mark-read-state');
    expect(methodOf(mark.calls, 0)).toBe('PUT');
    expect(bodyOf(mark.calls)).toEqual({ idList: ['1', '2'], state: 0 });
  });

  it('groups: list/filter, get/create/update/delete đúng route và method', async () => {
    const list = stubFetch(JSON.stringify({ items: [] }));
    await getNotificationGroups({ filter: 'sys' });
    expect(list.calls[0][0]).toContain('/api/notifications/definitions/groups?');
    expect(list.calls[0][0]).toContain('filter=sys');
    const get = stubFetch(JSON.stringify({ name: 'g' }));
    await getNotificationGroup('a/b');
    expect(get.calls[0][0]).toContain('/api/notifications/definitions/groups/a%2Fb');
    const create = stubFetch(JSON.stringify({ name: 'g' }));
    await createNotificationGroup({
      name: 'g',
      displayName: 'G',
      allowSubscriptionToClients: true,
    });
    expect(methodOf(create.calls, 0)).toBe('POST');
    expect(bodyOf(create.calls)).toMatchObject({ name: 'g', allowSubscriptionToClients: true });
    const update = stubFetch(JSON.stringify({ name: 'g' }));
    await updateNotificationGroup('g', { displayName: 'G2', allowSubscriptionToClients: false });
    expect(update.calls[0][0]).toContain('/api/notifications/definitions/groups/g');
    expect(methodOf(update.calls, 0)).toBe('PUT');
    expect(bodyOf(update.calls)).not.toHaveProperty('name');
    const del = stubFetch('', 204);
    await deleteNotificationGroup('g');
    expect(methodOf(del.calls, 0)).toBe('DELETE');
  });

  it('definitions: list gắn filter/groupName, update không gửi name/groupName', async () => {
    const list = stubFetch(JSON.stringify({ items: [] }));
    await getNotificationDefinitions({
      filter: 'order',
      groupName: 'sys',
      notificationType: NotificationType.System,
    });
    const url = list.calls[0][0] as string;
    expect(url).toContain('/api/notifications/definitions/notifications?');
    expect(url).toContain('filter=order');
    expect(url).toContain('groupName=sys');
    expect(url).toContain('notificationType=10');
    const get = stubFetch(JSON.stringify({ name: 'n' }));
    await getNotificationDefinition('n');
    expect(get.calls[0][0]).toContain('/api/notifications/definitions/notifications/n');
    const create = stubFetch(JSON.stringify({ name: 'n' }));
    await createNotificationDefinition({ name: 'n', groupName: 'sys', displayName: 'N' });
    expect(methodOf(create.calls, 0)).toBe('POST');
    const update = stubFetch(JSON.stringify({ name: 'n' }));
    await updateNotificationDefinition('n', { displayName: 'N2', providers: ['Email'] });
    expect(methodOf(update.calls, 0)).toBe('PUT');
    expect(bodyOf(update.calls)).toEqual({ displayName: 'N2', providers: ['Email'] });
    const del = stubFetch('', 204);
    await deleteNotificationDefinition('n');
    expect(methodOf(del.calls, 0)).toBe('DELETE');
  });

  it('sendNotification POST /api/notifications/send với data { title, message, description } như web', async () => {
    const { calls } = stubFetch('', 204);
    await sendNotification({
      name: 'n',
      data: { title: 'T', message: 'M', description: 'D' },
      severity: NotificationSeverity.Info,
    });
    expect(calls[0][0]).toContain('/api/notifications/send');
    expect(methodOf(calls, 0)).toBe('POST');
    expect(bodyOf(calls)).toEqual({
      name: 'n',
      data: { title: 'T', message: 'M', description: 'D' },
      severity: 10,
    });
  });

  it('send-records: list gắn notificationName/provider, delete DELETE, re-send POST {id}/re-send', async () => {
    const list = stubFetch(JSON.stringify({ totalCount: 0, items: [] }));
    await getNotificationSendRecordsPaged({ notificationName: 'n', provider: 'Email' });
    const url = list.calls[0][0] as string;
    expect(url).toContain('/api/notifications/send-records?');
    expect(url).toContain('notificationName=n');
    expect(url).toContain('provider=Email');
    const del = stubFetch('', 204);
    await deleteNotificationSendRecord('5');
    expect(del.calls[0][0]).toContain('/api/notifications/send-records/5');
    expect(methodOf(del.calls, 0)).toBe('DELETE');
    const resend = stubFetch('', 204);
    await reSendNotificationRecord('5');
    expect(resend.calls[0][0]).toContain('/api/notifications/send-records/5/re-send');
    expect(methodOf(resend.calls, 0)).toBe('POST');
  });

  it('enum names map đúng giá trị web', () => {
    expect(severityName(10)).toBe('Info');
    expect(severityName(40)).toBe('Fatal');
    expect(notificationTypeName(30)).toBe('ServiceCallback');
    expect(lifetimeName(1)).toBe('OnlyOne');
    expect(contentTypeName(2)).toBe('Markdown');
    expect(readStateName(1)).toBe('UnRead');
    expect(readStateName(0)).toBe('Read');
    expect(sendStateName(2)).toBe('Sent');
    expect(sendStateName(3)).toBe('Failed');
    expect(severityName(999)).toBe('');
    expect(NotificationContentType.Json).toBe(3);
    expect(NotificationLifetime.OnlyOne).toBe(1);
  });

  it('deserializeNotification rút title/message string từ extraProperties', () => {
    const item = {
      data: { type: 'x', extraProperties: { title: 'Hello', message: 'World', description: 'D' } },
    } as unknown as Parameters<typeof deserializeNotification>[0];
    expect(deserializeNotification(item)).toEqual({
      title: 'Hello',
      message: 'World',
      description: 'D',
    });
    const localized = {
      data: {
        type: 'x',
        extraProperties: { L: true, title: { name: 'K' }, message: { name: 'M' } },
      },
    } as unknown as Parameters<typeof deserializeNotification>[0];
    const out = deserializeNotification(localized);
    expect(out.title).toContain('K');
    expect(out.message).toContain('M');
  });
});
