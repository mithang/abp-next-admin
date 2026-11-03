import { describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import { useDetailQuery } from '../use-detail-query';

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client }, children);
  return { client, wrapper };
}

describe('useDetailQuery', () => {
  it('không gọi fetcher khi param undefined (query bị disable)', async () => {
    const fetcher = jest.fn(async (_id: string) => ({ id: _id }));
    const { wrapper } = createWrapper();
    const { result } = await renderHook(() => useDetailQuery('users', undefined, fetcher), {
      wrapper,
    });
    expect(fetcher).not.toHaveBeenCalled();
    expect(result.current.isPending).toBe(true);
  });

  it('gọi fetcher đúng một lần với param và trả về data, cache đúng key [entity, param]', async () => {
    const fetcher = jest.fn(async (id: string) => ({ id, name: 'Admin' }));
    const { client, wrapper } = createWrapper();
    const { result } = await renderHook(() => useDetailQuery('users', 'u1', fetcher), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith('u1');
    expect(result.current.data).toEqual({ id: 'u1', name: 'Admin' });
    expect(client.getQueryData(['users', 'u1'])).toEqual({
      id: 'u1',
      name: 'Admin',
    });
  });

  it('param đổi từ undefined sang có giá trị thì bắt đầu fetch', async () => {
    const fetcher = jest.fn(async (id: string) => ({ id }));
    const { wrapper } = createWrapper();
    const { result, rerender } = await renderHook(
      ({ param }: { param: string | undefined }) => useDetailQuery('roles', param, fetcher),
      { wrapper, initialProps: { param: undefined as string | undefined } },
    );
    expect(fetcher).not.toHaveBeenCalled();
    await rerender({ param: 'r9' });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetcher).toHaveBeenCalledWith('r9');
    expect(result.current.data).toEqual({ id: 'r9' });
  });

  it('param rỗng cũng bị disable như param undefined', async () => {
    const fetcher = jest.fn(async (id: string) => ({ id }));
    const { wrapper } = createWrapper();
    await renderHook(() => useDetailQuery('users', '', fetcher), { wrapper });
    expect(fetcher).not.toHaveBeenCalled();
  });
});
