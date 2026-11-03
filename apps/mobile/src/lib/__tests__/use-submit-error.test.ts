import { describe, expect, it } from '@jest/globals';
import { renderHook, act } from '@testing-library/react-native';
import { useSubmitError } from '../use-submit-error';
import { fallbackMessage } from '../errors';

describe('useSubmitError', () => {
  it('starts with no error', async () => {
    const { result } = await renderHook(() => useSubmitError());
    expect(result.current.error).toBeNull();
  });

  it('maps an ApiError object to its message', async () => {
    const { result } = await renderHook(() => useSubmitError());
    await act(async () => {
      result.current.onError({ kind: 'validation', message: 'Tên đã tồn tại' });
    });
    expect(result.current.error).toBe('Tên đã tồn tại');
  });

  it('maps a plain Error to the unexpected fallback, not its raw message', async () => {
    const { result } = await renderHook(() => useSubmitError());
    await act(async () => {
      result.current.onError(new Error('boom'));
    });
    expect(result.current.error).toBe(fallbackMessage('unexpected'));
  });

  it('clears the error back to null', async () => {
    const { result } = await renderHook(() => useSubmitError());
    await act(async () => {
      result.current.onError({ kind: 'server', message: 'Lỗi máy chủ' });
    });
    expect(result.current.error).toBe('Lỗi máy chủ');
    await act(async () => {
      result.current.clearError();
    });
    expect(result.current.error).toBeNull();
  });
});
