import { describe, expect, it, jest, afterEach } from '@jest/globals';
import { renderHook, act } from '@testing-library/react-native';
import { useDebouncedPagedFilter } from '../use-debounced-paged-filter';

afterEach(() => {
  jest.useRealTimers();
});

describe('useDebouncedPagedFilter', () => {
  it('starts with the given filters, page 0 and the default page size', async () => {
    const { result } = await renderHook(
      ({ filters }: { filters: { filter: string; provider: string } }) =>
        useDebouncedPagedFilter(filters),
      { initialProps: { filters: { filter: '', provider: '' } } },
    );
    expect(result.current.debounced).toEqual({ filter: '', provider: '' });
    expect(result.current.page).toBe(0);
    expect(result.current.skipCount).toBe(0);
    expect(result.current.maxResultCount).toBe(20);
  });

  it('debounces an object change and resets to page 0 in the same settled tick', async () => {
    jest.useFakeTimers();
    const { result, rerender } = await renderHook(
      ({ filters }: { filters: { filter: string; provider: string } }) =>
        useDebouncedPagedFilter(filters),
      { initialProps: { filters: { filter: '', provider: '' } } },
    );
    await act(async () => {
      result.current.loadMore();
      result.current.loadMore();
    });
    expect(result.current.page).toBe(2);
    await act(async () => {
      rerender({ filters: { filter: 'ab', provider: '' } });
    });
    expect(result.current.debounced).toEqual({ filter: '', provider: '' });
    expect(result.current.page).toBe(2);
    await act(async () => {
      jest.advanceTimersByTime(400);
    });
    expect(result.current.debounced).toEqual({ filter: 'ab', provider: '' });
    expect(result.current.page).toBe(0);
    expect(result.current.skipCount).toBe(0);
  });

  it('runs onSettledExtra in the same settled tick as the page reset', async () => {
    jest.useFakeTimers();
    const onSettledExtra = jest.fn();
    const { result, rerender } = await renderHook(
      ({ filters }: { filters: { filter: string; provider: string } }) =>
        useDebouncedPagedFilter(filters, 400, onSettledExtra),
      { initialProps: { filters: { filter: '', provider: '' } } },
    );
    await act(async () => {
      rerender({ filters: { filter: 'x', provider: 'p' } });
    });
    await act(async () => {
      jest.advanceTimersByTime(400);
    });
    expect(result.current.debounced).toEqual({ filter: 'x', provider: 'p' });
    expect(result.current.page).toBe(0);
    expect(onSettledExtra).toHaveBeenCalledTimes(1);
  });

  it('does not reset the page when rerendered with unchanged filter values', async () => {
    jest.useFakeTimers();
    const { result, rerender } = await renderHook(
      ({ filters }: { filters: { filter: string; provider: string } }) =>
        useDebouncedPagedFilter(filters),
      { initialProps: { filters: { filter: '', provider: '' } } },
    );
    await act(async () => {
      // Flush the mount timer first: it is still pending and its
      // onSettled would reset the page on the next advance, which
      // is the pre-existing mount behaviour, not a rerender reset.
      jest.advanceTimersByTime(400);
    });
    await act(async () => {
      result.current.loadMore();
    });
    await act(async () => {
      // New object literal, same JSON — the JSON.stringify key in
      // useDebouncedValue must not restart the timer or reset.
      rerender({ filters: { filter: '', provider: '' } });
    });
    await act(async () => {
      jest.advanceTimersByTime(400);
    });
    expect(result.current.page).toBe(1);
  });

  it('keeps hasMore/loadMore semantics from usePagination', async () => {
    const { result } = await renderHook(
      ({ filters }: { filters: { filter: string; provider: string } }) =>
        useDebouncedPagedFilter(filters),
      { initialProps: { filters: { filter: '', provider: '' } } },
    );
    expect(result.current.hasMore(20)).toBe(false);
    expect(result.current.hasMore(21)).toBe(true);
    await act(async () => {
      result.current.loadMore();
    });
    expect(result.current.page).toBe(1);
    expect(result.current.skipCount).toBe(20);
  });
});
