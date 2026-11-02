import { describe, expect, it, jest, afterEach } from '@jest/globals';
import { renderHook, act } from '@testing-library/react-native';
import { useDebouncedValue } from '../use-debounced-value';

afterEach(() => {
  jest.useRealTimers();
});

describe('useDebouncedValue', () => {
  it('returns the initial value immediately, then the new value after 400ms', async () => {
    jest.useFakeTimers();
    const { result, rerender } = await renderHook(
      ({ value }: { value: string }) => useDebouncedValue(value),
      { initialProps: { value: 'a' } },
    );
    expect(result.current).toBe('a');
    await rerender({ value: 'ab' });
    expect(result.current).toBe('a');
    await act(async () => {
      jest.advanceTimersByTime(399);
    });
    expect(result.current).toBe('a');
    await act(async () => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe('ab');
  });

  it('restarts the timer on rapid changes and only settles the last value', async () => {
    jest.useFakeTimers();
    const { result, rerender } = await renderHook(
      ({ value }: { value: string }) => useDebouncedValue(value),
      { initialProps: { value: '' } },
    );
    await rerender({ value: 'x' });
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    await rerender({ value: 'xy' });
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe('');
    await act(async () => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe('xy');
  });

  it('calls onSettled in the same timer tick as the value update', async () => {
    jest.useFakeTimers();
    const onSettled = jest.fn();
    const { result, rerender } = await renderHook(
      ({ value }: { value: string }) => useDebouncedValue(value, 400, onSettled),
      { initialProps: { value: 'a' } },
    );
    await rerender({ value: 'b' });
    await act(async () => {
      jest.advanceTimersByTime(400);
    });
    expect(result.current).toBe('b');
    expect(onSettled).toHaveBeenCalledTimes(1);
  });

  it('does not restart the timer when an object literal is recreated with equal fields', async () => {
    jest.useFakeTimers();
    const { result, rerender } = await renderHook(
      ({ value }: { value: { filter: string; provider: string } }) => useDebouncedValue(value),
      { initialProps: { value: { filter: 'a', provider: 'p' } } },
    );
    await rerender({ value: { filter: 'b', provider: 'p' } });
    // Unrelated re-render with a fresh literal but identical fields:
    // the serialized key is unchanged, so the original timer survives.
    await rerender({ value: { filter: 'b', provider: 'p' } });
    await act(async () => {
      jest.advanceTimersByTime(400);
    });
    expect(result.current).toEqual({ filter: 'b', provider: 'p' });
  });

  it('respects a custom delay', async () => {
    jest.useFakeTimers();
    const { result, rerender } = await renderHook(
      ({ value }: { value: string }) => useDebouncedValue(value, 100),
      { initialProps: { value: 'a' } },
    );
    await rerender({ value: 'b' });
    await act(async () => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe('b');
  });
});
