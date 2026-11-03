import { describe, expect, it } from '@jest/globals';
import { AppErrorState } from '../../components/ui/AppStates';
import { notFoundElement } from '../not-found';

describe('notFoundElement', () => {
  it('returns an AppErrorState element with the exact message and no retry by default', () => {
    const element = notFoundElement('Không có dữ liệu') as {
      type: unknown;
      props: { message: string; onRetry?: () => void };
    };
    expect(element.type).toBe(AppErrorState);
    expect(element.props.message).toBe('Không có dữ liệu');
    expect(element.props.onRetry).toBeUndefined();
  });

  it('passes the retry callback through unchanged (data-dictionaries items form site)', () => {
    const retry = () => undefined;
    const element = notFoundElement('Không có dữ liệu', retry) as {
      props: { onRetry?: () => void };
    };
    expect(element.props.onRetry).toBe(retry);
  });

  it('keeps two calls independent for different detail screens', () => {
    const first = notFoundElement('first') as { props: { message: string } };
    const second = notFoundElement('second') as { props: { message: string } };
    expect(first.props.message).toBe('first');
    expect(second.props.message).toBe('second');
  });
});
