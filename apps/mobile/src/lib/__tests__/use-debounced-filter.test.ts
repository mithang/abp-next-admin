import { describe, expect, it, jest, afterEach } from '@jest/globals';
import { renderHook, act } from '@testing-library/react-native';
import { useDebouncedFilter } from '../use-debounced-filter';

afterEach(() => {
  jest.useRealTimers();
});

describe('useDebouncedFilter', () => {
  it('starts with an empty filter and debounced value', async () => {
    const { result } = await renderHook(() => useDebouncedFilter());
    const [filter, , debouncedFilter] = result.current;
    expect(filter).toBe('');
    expect(debouncedFilter).toBe('');
  });

  it('respects a non-empty initial value', async () => {
    const { result } = await renderHook(() => useDebouncedFilter('ab'));
    const [filter, , debouncedFilter] = result.current;
    expect(filter).toBe('ab');
    expect(debouncedFilter).toBe('ab');
  });

  it('debounces the filter with the default 400ms delay', async () => {
    jest.useFakeTimers();
    const { result } = await renderHook(() => useDebouncedFilter());
    await act(async () => {
      result.current[1]('ab');
    });
    expect(result.current[0]).toBe('ab');
    expect(result.current[2]).toBe('');
    await act(async () => {
      jest.advanceTimersByTime(400);
    });
    expect(result.current[2]).toBe('ab');
  });

  it('supports custom destructured names for a second filter in the same screen', async () => {
    jest.useFakeTimers();
    const { result } = await renderHook(() => useDebouncedFilter());
    await act(async () => {
      result.current[1]('vue');
    });
    await act(async () => {
      jest.advanceTimersByTime(400);
    });
    const [framework, , debouncedFramework] = result.current;
    expect(framework).toBe('vue');
    expect(debouncedFramework).toBe('vue');
  });
});
