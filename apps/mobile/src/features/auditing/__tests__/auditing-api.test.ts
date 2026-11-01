import { describe, it, expect, afterEach } from '@jest/globals';
import {
  deleteAuditLog,
  deleteAuditLogsBulk,
  getAuditLog,
  getAuditLogsPaged,
  getSysLog,
  getSysLogsPaged,
} from '../auditing-api';
import { getEntityTypeInfo, getEntityTypeInfosPaged } from '../data-protection-api';
import { entityChangeTypeName, logLevelName, LogLevel } from '../types';

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

describe('auditing api', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('getEntityTypeInfosPaged gắn filter/skipCount/maxResultCount/isAuditEnabled', async () => {
    const { calls } = stubFetch(JSON.stringify({ totalCount: 0, items: [] }));
    await getEntityTypeInfosPaged({ filter: 'user', isAuditEnabled: true, skipCount: 20, maxResultCount: 20 });
    const url = calls[0][0] as string;
    expect(url).toContain('/api/data-protection-management/entity-type-infos?');
    expect(url).toContain('filter=user');
    expect(url).toContain('isAuditEnabled=true');
    expect(url).toContain('skipCount=20');
    expect(url).toContain('maxResultCount=20');
  });

  it('getEntityTypeInfo encode id trong path', async () => {
    const { calls } = stubFetch(JSON.stringify({ id: 'x' }));
    await getEntityTypeInfo('a/b');
    expect(calls[0][0]).toContain('/api/data-protection-management/entity-type-infos/a%2Fb');
  });

  it('getAuditLogsPaged gắn userName/url/httpMethod/httpStatusCode/hasException', async () => {
    const { calls } = stubFetch(JSON.stringify({ totalCount: 0, items: [] }));
    await getAuditLogsPaged({ userName: 'admin', url: '/api/x', httpMethod: 'POST', httpStatusCode: 200, hasException: true });
    const url = calls[0][0] as string;
    expect(url).toContain('/api/auditing/audit-log?');
    expect(url).toContain('userName=admin');
    expect(url).toContain('url=%2Fapi%2Fx');
    expect(url).toContain('httpMethod=POST');
    expect(url).toContain('httpStatusCode=200');
    expect(url).toContain('hasException=true');
  });

  it('getAuditLog encode id; deleteAuditLog dùng DELETE', async () => {
    const { calls } = stubFetch(JSON.stringify({ id: 'x' }));
    await getAuditLog('a b');
    expect(calls[0][0]).toContain('/api/auditing/audit-log/a%20b');
    const del = stubFetch('', 204);
    await deleteAuditLog('id-1');
    expect(del.calls[0][0]).toContain('/api/auditing/audit-log/id-1');
    expect(methodOf(del.calls, 0)).toBe('DELETE');
  });

  it('deleteAuditLogsBulk gửi body { ids } tới /bulk', async () => {
    const { calls } = stubFetch('', 204);
    await deleteAuditLogsBulk(['a', 'b']);
    expect(calls[0][0]).toContain('/api/auditing/audit-log/bulk');
    expect(methodOf(calls)).toBe('DELETE');
    expect(bodyOf(calls)).toEqual({ ids: ['a', 'b'] });
  });

  it('getSysLogsPaged gắn level/application/requestPath/correlationId', async () => {
    const { calls } = stubFetch(JSON.stringify({ totalCount: 0, items: [] }));
    await getSysLogsPaged({ level: LogLevel.Error, application: 'AllInOne', requestPath: '/api/x', correlationId: 'c1' });
    const url = calls[0][0] as string;
    expect(url).toContain('/api/auditing/logging?');
    expect(url).toContain('level=4');
    expect(url).toContain('application=AllInOne');
    expect(url).toContain('requestPath=%2Fapi%2Fx');
    expect(url).toContain('correlationId=c1');
  });

  it('getSysLog encode fields.id trong path', async () => {
    const { calls } = stubFetch(JSON.stringify({ timeStamp: '2026-01-01', level: 2, fields: {} }));
    await getSysLog('log id/1');
    expect(calls[0][0]).toContain('/api/auditing/logging/log%20id%2F1');
  });

  it('logLevelName map đúng enum Microsoft.Extensions.Logging', () => {
    expect(logLevelName(0)).toBe('Trace');
    expect(logLevelName(2)).toBe('Information');
    expect(logLevelName(4)).toBe('Error');
    expect(logLevelName(5)).toBe('Critical');
    expect(logLevelName(6)).toBe('None');
    expect(logLevelName(undefined)).toBe('');
  });

  it('entityChangeTypeName map đúng ChangeType web', () => {
    expect(entityChangeTypeName(0)).toBe('Created');
    expect(entityChangeTypeName(1)).toBe('Updated');
    expect(entityChangeTypeName(2)).toBe('Deleted');
  });
});
