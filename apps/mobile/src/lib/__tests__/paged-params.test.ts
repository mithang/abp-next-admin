import { describe, expect, it } from '@jest/globals';
import { pagedDefaults } from '../paged-params';
import { DEFAULT_PAGE_SIZE } from '../use-pagination';

describe('pagedDefaults', () => {
  it('defaults to skip 0 and the shared page size for an empty input', () => {
    expect(pagedDefaults({})).toEqual({ skipCount: 0, maxResultCount: DEFAULT_PAGE_SIZE });
    expect(DEFAULT_PAGE_SIZE).toBe(20);
  });

  it('keeps explicit values, including an explicit 0', () => {
    expect(pagedDefaults({ skipCount: 40, maxResultCount: 10 })).toEqual({
      skipCount: 40,
      maxResultCount: 10,
    });
    expect(pagedDefaults({ skipCount: 0, maxResultCount: 50 })).toEqual({
      skipCount: 0,
      maxResultCount: 50,
    });
  });

  it('applies each default independently when only one side is given', () => {
    expect(pagedDefaults({ skipCount: 20 })).toEqual({
      skipCount: 20,
      maxResultCount: DEFAULT_PAGE_SIZE,
    });
    expect(pagedDefaults({ maxResultCount: 5 })).toEqual({ skipCount: 0, maxResultCount: 5 });
  });

  it('returns only the two pagination fields, never leaking other input fields', () => {
    const params = pagedDefaults({ filter: 'adm', sorting: 'name', skipCount: 0 });
    expect(params).toEqual({ skipCount: 0, maxResultCount: DEFAULT_PAGE_SIZE });
    expect(Object.keys(params).sort()).toEqual(['maxResultCount', 'skipCount']);
  });
});
