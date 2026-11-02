import { describe, expect, it, jest } from '@jest/globals';
import { AppErrorState, AppLoading } from '../../components/ui/AppStates';
import { queryStateElement, type QueryStateLike } from '../query-state';

function makeQuery(overrides: Partial<QueryStateLike> = {}): QueryStateLike {
  return {
    isPending: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
    ...overrides,
  };
}

describe('queryStateElement', () => {
  it('returns AppLoading while pending', () => {
    const element = queryStateElement(makeQuery({ isPending: true })) as {
      type: unknown;
    };
    expect(element.type).toBe(AppLoading);
  });

  it('returns null when the query is settled without error', () => {
    expect(queryStateElement(makeQuery())).toBeNull();
  });

  it('returns AppErrorState with a message and a working retry on error', () => {
    const refetch = jest.fn();
    const element = queryStateElement(
      makeQuery({ isError: true, error: new Error('boom'), refetch }),
    ) as { type: unknown; props: { message: string; onRetry: () => void } };
    expect(element.type).toBe(AppErrorState);
    expect(typeof element.props.message).toBe('string');
    expect(element.props.message.length).toBeGreaterThan(0);
    element.props.onRetry();
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('pending wins over error in a single query', () => {
    const element = queryStateElement(
      makeQuery({ isPending: true, isError: true, error: new Error('boom') }),
    ) as { type: unknown };
    expect(element.type).toBe(AppLoading);
  });

  it('for an array, any pending query wins and the first error wins', () => {
    const firstError = makeQuery({ isError: true, error: new Error('first') });
    const secondError = makeQuery({ isError: true, error: new Error('second') });
    const pending = makeQuery({ isPending: true });
    expect(
      (
        queryStateElement([makeQuery(), firstError, secondError]) as {
          type: unknown;
          props: { onRetry: () => void };
        }
      ).type,
    ).toBe(AppErrorState);
    const withPending = queryStateElement([makeQuery(), pending, firstError]) as {
      type: unknown;
    };
    expect(withPending.type).toBe(AppLoading);
    const errorElement = queryStateElement([makeQuery(), firstError, secondError]) as {
      props: { onRetry: () => void };
    };
    errorElement.props.onRetry();
    expect(firstError.refetch).toHaveBeenCalledTimes(1);
    expect(secondError.refetch).not.toHaveBeenCalled();
  });

  it('returns null for an all-settled array', () => {
    expect(queryStateElement([makeQuery(), makeQuery()])).toBeNull();
  });
});
