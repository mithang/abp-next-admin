import { describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, act } from '@testing-library/react-native';
import React from 'react';
import { useInvalidateAndBack, useInvalidateQueries } from '../mutation-success';

const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack }),
}));

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client }, children);
  return { client, wrapper };
}

describe('useInvalidateQueries', () => {
  it('đánh dấu invalidate cho mọi key đã truyền', async () => {
    const { client, wrapper } = createWrapper();
    client.setQueryData(['roles'], [{ id: '1' }]);
    client.setQueryData(['users'], [{ id: '2' }]);
    const { result } = await renderHook(() => useInvalidateQueries(['roles'], ['users']), {
      wrapper,
    });
    await act(async () => {
      await result.current();
    });
    expect(client.getQueryState(['roles'])?.isInvalidated).toBe(true);
    expect(client.getQueryState(['users'])?.isInvalidated).toBe(true);
  });

  it('không invalidate key không truyền', async () => {
    const { client, wrapper } = createWrapper();
    client.setQueryData(['roles'], [{ id: '1' }]);
    client.setQueryData(['users'], [{ id: '2' }]);
    const { result } = await renderHook(() => useInvalidateQueries(['roles']), { wrapper });
    await act(async () => {
      await result.current();
    });
    expect(client.getQueryState(['roles'])?.isInvalidated).toBe(true);
    expect(client.getQueryState(['users'])?.isInvalidated).toBe(false);
  });

  it('key có tham số chỉ invalidate đúng tham số đó', async () => {
    const { client, wrapper } = createWrapper();
    client.setQueryData(['tenant-features', 't1'], []);
    client.setQueryData(['tenant-features', 't2'], []);
    const { result } = await renderHook(() => useInvalidateQueries(['tenant-features', 't1']), {
      wrapper,
    });
    await act(async () => {
      await result.current();
    });
    expect(client.getQueryState(['tenant-features', 't1'])?.isInvalidated).toBe(true);
    expect(client.getQueryState(['tenant-features', 't2'])?.isInvalidated).toBe(false);
  });
});

describe('useInvalidateAndBack', () => {
  it('invalidate rồi gọi router.back đúng một lần', async () => {
    mockBack.mockClear();
    const { client, wrapper } = createWrapper();
    client.setQueryData(['roles'], [{ id: '1' }]);
    const { result } = await renderHook(() => useInvalidateAndBack(['roles']), { wrapper });
    await act(async () => {
      await result.current();
    });
    expect(client.getQueryState(['roles'])?.isInvalidated).toBe(true);
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('invalidate nhiều key trước khi back', async () => {
    mockBack.mockClear();
    const { client, wrapper } = createWrapper();
    client.setQueryData(['roles'], [{ id: '1' }]);
    client.setQueryData(['users'], [{ id: '2' }]);
    const { result } = await renderHook(() => useInvalidateAndBack(['roles'], ['users']), {
      wrapper,
    });
    await act(async () => {
      await result.current();
    });
    expect(client.getQueryState(['roles'])?.isInvalidated).toBe(true);
    expect(client.getQueryState(['users'])?.isInvalidated).toBe(true);
    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
