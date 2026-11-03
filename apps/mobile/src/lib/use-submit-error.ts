import { useCallback, useState } from 'react';
import { toApiError } from './errors';

/**
 * State lỗi cho mutation submit/action: thay cho bộ ba lặp lại ở hàng
 * chục form/detail screen — `useState<string | null>(null)` +
 * `onError: (error) => setX(toApiError(error).message)` +
 * `setX(null)` trước khi submit lại.
 *
 * Destructure với tên riêng của màn hình, vd:
 * `const { error: submitError, onError: handleSubmitError, clearError: clearSubmitError } = useSubmitError();`
 * rồi dùng `onError: handleSubmitError` trong mutation và
 * `clearSubmitError()` ở submit handler / onSuccess. Chỉ destructure
 * `clearError` khi màn hình thực sự clear lỗi, tránh biến unused.
 */
export function useSubmitError() {
  const [error, setError] = useState<string | null>(null);
  const onError = useCallback((error: unknown) => {
    setError(toApiError(error).message);
  }, []);
  const clearError = useCallback(() => setError(null), []);
  return { error, onError, clearError };
}
