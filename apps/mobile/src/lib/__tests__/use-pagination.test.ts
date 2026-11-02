import { describe, expect, it } from '@jest/globals';
import { renderHook, act } from '@testing-library/react-native';
import { DEFAULT_PAGE_SIZE, usePagination } from '../use-pagination';

describe('usePagination', () => {
  it('starts on page 0 with skipCount 0 and the default page size', async () => {
    const { result } = await renderHook(() => usePagination());
    expect(DEFAULT_PAGE_SIZE).toBe(20);
    expect(result.current.page).toBe(0);
    expect(result.current.skipCount).toBe(0);
    expect(result.current.maxResultCount).toBe(20);
    expect(result.current.pageSize).toBe(20);
  });

  it('derives skipCount from the page and hasMore from the old formula', async () => {
    const { result } = await renderHook(() => usePagination());
    // Page 0, size 20: exactly one full page has no more pages.
    expect(result.current.hasMore(20)).toBe(false);
    expect(result.current.hasMore(21)).toBe(true);
    await act(async () => {
      result.current.loadMore();
    });
    expect(result.current.page).toBe(1);
    expect(result.current.skipCount).toBe(20);
    expect(result.current.hasMore(40)).toBe(false);
    expect(result.current.hasMore(41)).toBe(true);
  });

  it('resetPage returns to page 0', async () => {
    const { result } = await renderHook(() => usePagination());
    await act(async () => {
      result.current.loadMore();
      result.current.loadMore();
    });
    expect(result.current.page).toBe(2);
    expect(result.current.skipCount).toBe(40);
    await act(async () => {
      result.current.resetPage();
    });
    expect(result.current.page).toBe(0);
    expect(result.current.skipCount).toBe(0);
  });

  it('setPage still works for callers that reset directly (debounce onSettled)', async () => {
    const { result } = await renderHook(() => usePagination());
    await act(async () => {
      result.current.setPage(3);
    });
    expect(result.current.skipCount).toBe(60);
    await act(async () => {
      result.current.setPage(0);
    });
    expect(result.current.skipCount).toBe(0);
  });

  it('respects a custom page size', async () => {
    const { result } = await renderHook(() => usePagination(50));
    expect(result.current.maxResultCount).toBe(50);
    expect(result.current.hasMore(50)).toBe(false);
    expect(result.current.hasMore(51)).toBe(true);
    await act(async () => {
      result.current.loadMore();
    });
    expect(result.current.skipCount).toBe(50);
  });
});
