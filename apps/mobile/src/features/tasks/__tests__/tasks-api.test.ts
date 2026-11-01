import { describe, it, expect } from '@jest/globals';
import {
  bulkDeleteBackgroundJobs,
  bulkPauseBackgroundJobs,
  createBackgroundJob,
  deleteBackgroundJob,
  deleteBackgroundJobLog,
  getBackgroundJob,
  getBackgroundJobDefinitions,
  getBackgroundJobLogsPaged,
  getBackgroundJobsPaged,
  pauseBackgroundJob,
  resumeBackgroundJob,
  startBackgroundJob,
  stopBackgroundJob,
  triggerBackgroundJob,
  updateBackgroundJob,
} from '../tasks-api';

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


const base = {
  isEnabled: true,
  args: {},
  jobType: 1,
  maxTryCount: 50,
  maxCount: 0,
  interval: 300,
  priority: 15,
  lockTimeOut: 0,
};

describe('background jobs api', () => {
  it('paged list gắn filter + phân trang ABP', async () => {
    const { calls } = stubFetch(JSON.stringify({ totalCount: 1, items: [{ id: 'j1', name: 'cleanup' }] }));
    const result = await getBackgroundJobsPaged({ filter: 'clean', skipCount: 0, maxResultCount: 20 });
    expect(urlOf(calls)).toContain('/api/task-management/background-jobs?');
    expect(urlOf(calls)).toContain('filter=clean');
    expect(result.totalCount).toBe(1);
  });

  it('create gửi đủ field CreateDto; update KHÔNG gửi name/group/type', async () => {
    const { calls } = stubFetch(JSON.stringify({ id: 'j1' }));
    await createBackgroundJob({
      ...base,
      name: 'cleanup',
      group: 'system',
      type: 'CleanupJob',
      beginTime: '2026-11-01T00:00:00',
      source: 0,
    });
    expect(methodOf(calls)).toBe('POST');
    const created = bodyOf(calls);
    expect(created.name).toBe('cleanup');
    expect(created.source).toBe(0);
    expect(created.beginTime).toBe('2026-11-01T00:00:00');

    const upd = stubFetch(JSON.stringify({ id: 'j1' }));
    await updateBackgroundJob('j1', { ...base, concurrencyStamp: 'stamp-1' });
    expect(methodOf(upd.calls)).toBe('PUT');
    const updated = bodyOf(upd.calls);
    expect(updated.concurrencyStamp).toBe('stamp-1');
    expect(updated).not.toHaveProperty('name');
    expect(updated).not.toHaveProperty('group');
    expect(updated).not.toHaveProperty('type');
  });

  it('get/delete/definitions đúng route', async () => {
    const get = stubFetch(JSON.stringify({ id: 'j1', name: 'cleanup' }));
    await getBackgroundJob('j1');
    expect(urlOf(get.calls)).toContain('/api/task-management/background-jobs/j1');

    const defs = stubFetch(JSON.stringify({ items: [{ name: 'CleanupJob' }] }));
    const result = await getBackgroundJobDefinitions();
    expect(urlOf(defs.calls)).toContain('/api/task-management/background-jobs/definitions');
    expect(result.items).toHaveLength(1);

    const del = stubFetch('', 204);
    await deleteBackgroundJob('j1');
    expect(methodOf(del.calls)).toBe('DELETE');
  });

  it('logs: list lọc jobId + delete đúng route', async () => {
    const { calls } = stubFetch(JSON.stringify({ totalCount: 1, items: [{ id: 'l1', message: 'ok' }] }));
    const result = await getBackgroundJobLogsPaged({ jobId: 'j1' });
    expect(urlOf(calls)).toContain('/api/task-management/background-jobs/logs?');
    expect(urlOf(calls)).toContain('jobId=j1');
    expect(result.totalCount).toBe(1);
    const del = stubFetch('', 204);
    await deleteBackgroundJobLog('l1');
    expect(urlOf(del.calls)).toContain('/api/task-management/background-jobs/logs/l1');
    expect(methodOf(del.calls)).toBe('DELETE');
  });

  it('5 action đơn + bulk đúng route/method', async () => {
    const cases: [() => Promise<void>, string][] = [
      [() => pauseBackgroundJob('j1'), 'pause'],
      [() => resumeBackgroundJob('j1'), 'resume'],
      [() => triggerBackgroundJob('j1'), 'trigger'],
      [() => stopBackgroundJob('j1'), 'stop'],
      [() => startBackgroundJob('j1'), 'start'],
    ];
    for (const [fn, action] of cases) {
      const s = stubFetch('', 204);
      await fn();
      expect(urlOf(s.calls)).toContain(`/api/task-management/background-jobs/j1/${action}`);
      expect(methodOf(s.calls)).toBe('PUT');
    }
    const bulk = stubFetch('', 204);
    await bulkPauseBackgroundJobs({ jobIds: ['j1', 'j2'] });
    expect(urlOf(bulk.calls)).toContain('/api/task-management/background-jobs/bulk-pause');
    expect(bodyOf(bulk.calls)).toEqual({ jobIds: ['j1', 'j2'] });

    const bulkDel = stubFetch('', 204);
    await bulkDeleteBackgroundJobs({ jobIds: ['j1'] });
    expect(urlOf(bulkDel.calls)).toContain('/api/task-management/background-jobs/bulk-delete');
    expect(methodOf(bulkDel.calls)).toBe('DELETE');
  });
});
