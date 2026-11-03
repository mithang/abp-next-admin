import { describe, expect, it } from '@jest/globals';
import { navHref, navPath } from '../nav-href';

describe('navPath', () => {
  it('encodes spaces and slashes in a segment like the old templates', () => {
    expect(navPath('/webhooks/groups', 'a b/c')).toBe('/webhooks/groups/a%20b%2Fc');
  });

  it('leaves a GUID segment unchanged like the old unencoded sites', () => {
    expect(navPath('/users', '3fa85f64-5717-4562-b3fc-2c963f66afa6')).toBe(
      '/users/3fa85f64-5717-4562-b3fc-2c963f66afa6',
    );
  });

  it('stringifies numeric segments', () => {
    expect(navPath('/items', 42)).toBe('/items/42');
  });

  it('strips a trailing slash from the base', () => {
    expect(navPath('/users/', 'abc')).toBe('/users/abc');
  });

  it('returns the base unchanged with no segments', () => {
    expect(navPath('/platform/menu-allot')).toBe('/platform/menu-allot');
  });
});

describe('navHref', () => {
  it('encodes query values and preserves parameter order', () => {
    expect(navHref('/platform/menu-allot', { subject: 'user', id: 'u 1', label: 'A&B' })).toBe(
      '/platform/menu-allot?subject=user&id=u%201&label=A%26B',
    );
  });

  it('returns the path unchanged with no query', () => {
    expect(navHref('/roles/form')).toBe('/roles/form');
  });

  it('skips undefined and null values like the old templates never emitted', () => {
    expect(navHref('/x/form', { id: 'a', label: undefined, extra: null })).toBe('/x/form?id=a');
  });

  it('returns the path unchanged when every value is skipped', () => {
    expect(navHref('/x/form', { label: undefined })).toBe('/x/form');
  });

  it('stringifies numeric query values', () => {
    expect(navHref('/x/form', { edit: 1 })).toBe('/x/form?edit=1');
  });
});
