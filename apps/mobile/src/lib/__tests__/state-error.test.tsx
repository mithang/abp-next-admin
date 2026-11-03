import { describe, expect, it } from '@jest/globals';
import { Text } from '@/components/ui/text';
import { stateErrorElement } from '../state-error';

describe('stateErrorElement', () => {
  it('returns null for null, undefined and empty string (falsy like the old ternary)', () => {
    expect(stateErrorElement(null)).toBeNull();
    expect(stateErrorElement(undefined)).toBeNull();
    expect(stateErrorElement('')).toBeNull();
  });

  it('returns a Text element with the exact message for a non-empty string', () => {
    const element = stateErrorElement('Lưu thất bại') as {
      type: unknown;
      props: { children: string };
    };
    expect(element.type).toBe(Text);
    expect(element.props.children).toBe('Lưu thất bại');
  });

  it('keeps the message verbatim without any error mapping', () => {
    // Khác mutationErrorElement: chuỗi state đã là thông điệp cuối cùng,
    // helper không qua toApiError và không biến đổi gì.
    const element = stateErrorElement('boom') as { props: { children: string } };
    expect(element.props.children).toBe('boom');
  });

  it('keeps two calls independent for two-error screens', () => {
    const first = stateErrorElement('set failed') as { props: { children: string } };
    const second = stateErrorElement(null);
    expect(first.props.children).toBe('set failed');
    expect(second).toBeNull();
  });
});
