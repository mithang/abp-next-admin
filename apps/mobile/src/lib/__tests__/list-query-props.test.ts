import { describe, expect, it, jest } from '@jest/globals';
import { listQueryProps } from '../list-query-props';

describe('listQueryProps', () => {
  it('passes isPending and isError through', () => {
    const props = listQueryProps({
      isPending: true,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });
    expect(props.isPending).toBe(true);
    expect(props.isError).toBe(false);
  });

  it('maps the query error through toApiError for the message', () => {
    const props = listQueryProps({
      isPending: false,
      isError: true,
      error: { kind: 'server', message: 'Lỗi máy chủ thử' },
      refetch: jest.fn(),
    });
    expect(props.errorMessage).toBe('Lỗi máy chủ thử');
  });

  it('falls back to a non-empty message for a plain error', () => {
    const props = listQueryProps({
      isPending: false,
      isError: true,
      error: new Error('boom'),
      refetch: jest.fn(),
    });
    expect(typeof props.errorMessage).toBe('string');
    expect(props.errorMessage.length).toBeGreaterThan(0);
  });

  it('calls refetch exactly once per onRetry call', () => {
    const refetch = jest.fn(() => Promise.resolve('ok'));
    const props = listQueryProps({
      isPending: false,
      isError: false,
      error: null,
      refetch,
    });
    props.onRetry();
    expect(refetch).toHaveBeenCalledTimes(1);
    props.onRetry();
    expect(refetch).toHaveBeenCalledTimes(2);
  });

  it('accepts any query-like object regardless of the caller variable name', () => {
    const refetch = jest.fn(() => undefined);
    const props = listQueryProps({
      isPending: false,
      isError: true,
      error: { kind: 'forbidden', message: 'Không có quyền' },
      refetch,
    });
    expect(props.errorMessage).toBe('Không có quyền');
    expect(() => props.onRetry()).not.toThrow();
    expect(refetch).toHaveBeenCalledTimes(1);
  });
});
