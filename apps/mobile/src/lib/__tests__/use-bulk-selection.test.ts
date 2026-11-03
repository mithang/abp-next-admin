import { describe, expect, it } from '@jest/globals';
import { renderHook, act } from '@testing-library/react-native';
import { useBulkSelection } from '../use-bulk-selection';

describe('useBulkSelection', () => {
  it('starts with empty selection and select mode off', async () => {
    const { result } = await renderHook(() => useBulkSelection());
    expect(result.current.selected.size).toBe(0);
    expect(result.current.selectMode).toBe(false);
  });

  it('toggles a single id on and off', async () => {
    const { result } = await renderHook(() => useBulkSelection());
    await act(async () => {
      result.current.toggleSelect('a');
    });
    expect(result.current.selected.has('a')).toBe(true);
    await act(async () => {
      result.current.toggleSelect('a');
    });
    expect(result.current.selected.has('a')).toBe(false);
  });

  it('toggleSelectMode flips mode and clears selection', async () => {
    const { result } = await renderHook(() => useBulkSelection());
    await act(async () => {
      result.current.toggleSelect('a');
    });
    await act(async () => {
      result.current.toggleSelectMode();
    });
    expect(result.current.selectMode).toBe(true);
    expect(result.current.selected.size).toBe(0);
    await act(async () => {
      result.current.toggleSelect('b');
      result.current.toggleSelectMode();
    });
    expect(result.current.selectMode).toBe(false);
    expect(result.current.selected.size).toBe(0);
  });

  it('clearSelection keeps select mode on', async () => {
    const { result } = await renderHook(() => useBulkSelection());
    await act(async () => {
      result.current.toggleSelect('a');
      result.current.toggleSelectMode();
      result.current.toggleSelect('b');
      result.current.clearSelection();
    });
    expect(result.current.selectMode).toBe(true);
    expect(result.current.selected.size).toBe(0);
  });

  it('exitSelectMode clears selection and turns mode off', async () => {
    const { result } = await renderHook(() => useBulkSelection());
    await act(async () => {
      result.current.toggleSelectMode();
      result.current.toggleSelect('a');
      result.current.exitSelectMode();
    });
    expect(result.current.selectMode).toBe(false);
    expect(result.current.selected.size).toBe(0);
  });
});
