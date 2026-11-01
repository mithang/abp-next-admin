import { describe, it, expect } from '@jest/globals';
import { mapHttpStatusToKind, parseApiError, toApiError } from '../errors';

describe('mapHttpStatusToKind', () => {
  it.each([
    [401, 'unauthorized'],
    [403, 'forbidden'],
    [404, 'notFound'],
    [409, 'conflict'],
    [429, 'rateLimit'],
    [400, 'validation'],
    [500, 'server'],
  ])('maps %i to %s', (status, kind) => {
    expect(mapHttpStatusToKind(status)).toBe(kind);
  });
});

describe('parseApiError', () => {
  it('giữ message nghiệp vụ ngắn của ABP và gom validationErrors theo field', () => {
    const err = parseApiError(400, {
      error: {
        message: 'Email đã tồn tại.',
        validationErrors: [{ message: 'Email không hợp lệ', members: ['email'] }],
      },
    });
    expect(err.kind).toBe('validation');
    expect(err.message).toBe('Email đã tồn tại.');
    expect(err.fieldErrors?.email).toEqual(['Email không hợp lệ']);
  });

  it('không lộ stack trace ra UI, dùng fallback thân thiện', () => {
    const err = parseApiError(500, { error: { message: 'boom\nstack trace at Foo.Bar()' } });
    expect(err.message).not.toContain('stack trace');
    expect(err.message.length).toBeGreaterThan(0);
  });
});

describe('toApiError', () => {
  it('nhận diện lỗi mạng từ fetch', () => {
    expect(toApiError(new Error('Network request failed')).kind).toBe('network');
  });
});
