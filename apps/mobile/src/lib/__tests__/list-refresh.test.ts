import { describe, expect, it, jest } from '@jest/globals';
import { listRefreshProps } from '../list-refresh';

describe('listRefreshProps', () => {
  it('passes isFetching through as refreshing', () => {
    expect(listRefreshProps({ isFetching: false, refetch: jest.fn() }).refreshing).toBe(false);
    expect(listRefreshProps({ isFetching: true, refetch: jest.fn() }).refreshing).toBe(true);
  });

  it('calls refetch exactly once per onRefresh, with the voided promise', () => {
    const refetch = jest.fn(() => Promise.resolve('ok'));
    const props = listRefreshProps({ isFetching: false, refetch });
    props.onRefresh();
    expect(refetch).toHaveBeenCalledTimes(1);
    props.onRefresh();
    expect(refetch).toHaveBeenCalledTimes(2);
  });

  it('accepts any query-like object with isFetching and refetch', () => {
    const props = listRefreshProps({ isFetching: true, refetch: () => undefined });
    expect(props.refreshing).toBe(true);
    expect(() => props.onRefresh()).not.toThrow();
  });
});
