import { describe, expect, it } from '@jest/globals';
import { keyById, keyByName, keyByNestedId } from '../list-keys';

describe('keyById', () => {
  it('returns a string id unchanged', () => {
    expect(keyById({ id: 'abc-123' })).toBe('abc-123');
  });

  it('stringifies a numeric id like the old String(item.id) sites', () => {
    expect(keyById({ id: 42 })).toBe('42');
  });
});

describe('keyByName', () => {
  it('returns the name field', () => {
    expect(keyByName({ name: 'Admin' })).toBe('Admin');
  });
});

describe('keyByNestedId', () => {
  it('returns the nested item id for tree-list wrappers', () => {
    expect(keyByNestedId({ item: { id: 'menu-1' }, depth: 2 })).toBe('menu-1');
  });

  it('stringifies a numeric nested id', () => {
    expect(keyByNestedId({ item: { id: 7 }, depth: 0 })).toBe('7');
  });
});
