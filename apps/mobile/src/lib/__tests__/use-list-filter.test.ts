import { describe, expect, it, jest, afterEach } from '@jest/globals';
import { renderHook, act } from '@testing-library/react-native';
import { useListFilter } from '../use-list-filter';

afterEach(() => {
  jest.useRealTimers();
});

describe('useListFilter', () => {
  it('starts with an empty filter, page 0 and the default page size', async () => {
    const { result } = await renderHook(() => useListFilter());
    expect(result.current.filter).toBe('');
    expect(result.current.debouncedFilter).toBe('');
    expect(result.current.page).toBe(0);
    expect(result.current.skipCount).toBe(0);
    expect(result.current.maxResultCount).toBe(20);
  });

  it('debounces the filter and resets to page 0 in the same settled tick', async () => {
    jest.useFakeTimers();
    const { result } = await renderHook(() => useListFilter());
    await act(async () => {
      result.current.loadMore();
      result.current.loadMore();
    });
    expect(result.current.page).toBe(2);
    await act(async () => {
      result.current.setFilter('ab');
    });
    expect(result.current.filter).toBe('ab');
    expect(result.current.debouncedFilter).toBe('');
    expect(result.current.page).toBe(2);
    await act(async () => {
      jest.advanceTimersByTime(400);
    });
    expect(result.current.debouncedFilter).toBe('ab');
    expect(result.current.page).toBe(0);
    expect(result.current.skipCount).toBe(0);
  });

  it('runs onSettledExtra in the same settled tick as the page reset', async () => {
    jest.useFakeTimers();
    const onSettledExtra = jest.fn();
    const { result } = await renderHook(() => useListFilter(onSettledExtra));
    await act(async () => {
      result.current.setFilter('x');
    });
    await act(async () => {
      jest.advanceTimersByTime(400);
    });
    expect(result.current.debouncedFilter).toBe('x');
    expect(result.current.page).toBe(0);
    expect(onSettledExtra).toHaveBeenCalledTimes(1);
  });

  it('keeps hasMore/loadMore semantics from usePagination', async () => {
    const { result } = await renderHook(() => useListFilter());
    expect(result.current.hasMore(20)).toBe(false);
    expect(result.current.hasMore(21)).toBe(true);
    await act(async () => {
      result.current.loadMore();
    });
    expect(result.current.page).toBe(1);
    expect(result.current.skipCount).toBe(20);
  });
});
