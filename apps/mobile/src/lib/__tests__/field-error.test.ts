import { describe, expect, it } from '@jest/globals';
import { createFieldError, resolveFieldError } from '../field-error';

const t = (key: string) => `TRANSLATED:${key}`;

describe('resolveFieldError', () => {
  it('translates a message starting with the prefix dot', () => {
    expect(resolveFieldError(t, 'roles', 'roles.nameRequired')).toBe(
      'TRANSLATED:roles.nameRequired',
    );
  });

  it('passes through a message from another namespace unchanged', () => {
    expect(resolveFieldError(t, 'roles', 'common.required')).toBe('common.required');
  });

  it('does NOT translate a bare prefix without the dot (old startsWith(prefix + ".") rule)', () => {
    expect(resolveFieldError(t, 'roles', 'rolesX')).toBe('rolesX');
  });

  it('passes through falsy messages exactly like the old inline helper', () => {
    expect(resolveFieldError(t, 'roles', undefined)).toBeUndefined();
    expect(resolveFieldError(t, 'roles', '')).toBe('');
  });
});

describe('createFieldError', () => {
  it('returns a resolver bound to the given prefix', () => {
    const fieldError = createFieldError(t, 'texts');
    expect(fieldError('texts.keyRequired')).toBe('TRANSLATED:texts.keyRequired');
    expect(fieldError('other.key')).toBe('other.key');
    expect(fieldError(undefined)).toBeUndefined();
  });
});
