import { describe, it, expect } from '@jest/globals';
import i18n from '../../i18n';
import {
  fallbackMessage,
  isWrappedEnvelope,
  mapHttpStatusToKind,
  parseApiError,
  parseWrappedError,
  toApiError,
  type ApiErrorKind,
} from '../errors';

const ALL_KINDS: ApiErrorKind[] = [
  'network',
  'timeout',
  'unauthorized',
  'forbidden',
  'notFound',
  'validation',
  'conflict',
  'rateLimit',
  'server',
  'unexpected',
];

describe('fallbackMessage', () => {
  it('mọi kind đều có message i18n thật, không rơi về tên key', () => {
    for (const kind of ALL_KINDS) {
      const message = fallbackMessage(kind);
      expect(message.length).toBeGreaterThan(0);
      expect(message).not.toBe(`errors.${kind}`);
    }
  });

  it('phân giải theo ngôn ngữ hiện tại, không đóng cứng lúc import', async () => {
    await i18n.changeLanguage('vi');
    expect(fallbackMessage('network')).toBe('Không có kết nối mạng. Vui lòng kiểm tra và thử lại.');
    await i18n.changeLanguage('en');
    expect(fallbackMessage('network')).toBe('No network connection. Please check and try again.');
    await i18n.changeLanguage('vi');
    expect(fallbackMessage('network')).toBe('Không có kết nối mạng. Vui lòng kiểm tra và thử lại.');
  });
});

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

describe('isWrappedEnvelope', () => {
  it('nhận envelope đủ và envelope lỗi lược result null', () => {
    expect(isWrappedEnvelope({ code: '0', message: 'OK', result: { totalCount: 1 } })).toBe(true);
    expect(isWrappedEnvelope({ code: '400', message: 'Lỗi', details: null })).toBe(true);
  });

  it('từ chối DTO thật có code, body lỗi ABP, mảng và null', () => {
    expect(
      isWrappedEnvelope({ id: '1', name: 'root', code: 'root', displayName: 'Root', items: [] }),
    ).toBe(false);
    expect(isWrappedEnvelope({ error: { code: '400', message: 'Lỗi' } })).toBe(false);
    expect(isWrappedEnvelope([{ code: '0', result: 1 }])).toBe(false);
    expect(isWrappedEnvelope(null)).toBe(false);
  });
});

describe('parseWrappedError', () => {
  it('map mã số như HTTP status', () => {
    expect(parseWrappedError({ code: '400', message: 'Dữ liệu không hợp lệ.' })).toMatchObject({
      kind: 'validation',
      status: 400,
      message: 'Dữ liệu không hợp lệ.',
    });
    expect(parseWrappedError({ code: '500', message: 'Lỗi máy chủ.' })).toMatchObject({
      kind: 'server',
      status: 500,
    });
  });

  it('mã nghiệp vụ không phải số vẫn giữ message an toàn', () => {
    expect(
      parseWrappedError({ code: 'UserAlreadyExists', message: 'Người dùng đã tồn tại.' }),
    ).toMatchObject({
      kind: 'server',
      status: undefined,
      message: 'Người dùng đã tồn tại.',
    });
  });
});

describe('toApiError', () => {
  it('nhận diện lỗi mạng từ fetch', () => {
    expect(toApiError(new Error('Network request failed')).kind).toBe('network');
  });
});
