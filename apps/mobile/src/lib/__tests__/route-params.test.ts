import { describe, expect, it, jest } from '@jest/globals';
import { renderHook } from '@testing-library/react-native';
import { useLocalSearchParams } from 'expo-router';
import { normalizeRouteParam, normalizeRouteParams, useRouteParams } from '../route-params';

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
}));

const mockUseLocalSearchParams = useLocalSearchParams as jest.Mock;

describe('normalizeRouteParam', () => {
  it('giữ nguyên chuỗi', () => {
    expect(normalizeRouteParam('abc')).toBe('abc');
  });

  it('giữ nguyên chuỗi rỗng (khác undefined)', () => {
    expect(normalizeRouteParam('')).toBe('');
  });

  it('mảng -> phần tử đầu', () => {
    expect(normalizeRouteParam(['a', 'b'])).toBe('a');
  });

  it('mảng rỗng -> undefined', () => {
    expect(normalizeRouteParam([])).toBeUndefined();
  });

  it('undefined giữ nguyên', () => {
    expect(normalizeRouteParam(undefined)).toBeUndefined();
  });
});

describe('normalizeRouteParams', () => {
  it('chuẩn hóa từng key, giữ nguyên key không phải mảng', () => {
    expect(normalizeRouteParams({ id: ['x', 'y'], name: 'n', missing: undefined })).toEqual({
      id: 'x',
      name: 'n',
      missing: undefined,
    });
  });
});

describe('useRouteParams', () => {
  it('trả về params đã chuẩn hóa mảng -> phần tử đầu', async () => {
    mockUseLocalSearchParams.mockReturnValue({
      id: ['guid-1', 'guid-2'],
      name: 'ten',
    });
    const { result } = await renderHook(() => useRouteParams<{ id: string; name: string }>());
    expect(result.current).toEqual({ id: 'guid-1', name: 'ten' });
  });
});
