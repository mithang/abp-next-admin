import { describe, expect, it } from '@jest/globals';
import { Text } from '@/components/ui/text';
import { mutationErrorElement, type MutationErrorLike } from '../mutation-error';

function makeMutation(overrides: Partial<MutationErrorLike> = {}): MutationErrorLike {
  return {
    isError: false,
    error: null,
    ...overrides,
  };
}

/** Lỗi đã qua map ApiError: toApiError giữ nguyên object có kind/message. */
const apiError = (message: string) => ({ kind: 'validation' as const, message });

describe('mutationErrorElement', () => {
  it('returns null when the mutation is not in error', () => {
    expect(mutationErrorElement(makeMutation())).toBeNull();
  });

  it('returns a Text element with the cleaned message on error', () => {
    const element = mutationErrorElement(
      makeMutation({ isError: true, error: apiError('Tên đã tồn tại') }),
    ) as { type: unknown; props: { children: string } };
    expect(element.type).toBe(Text);
    expect(element.props.children).toBe('Tên đã tồn tại');
  });

  it('returns null for a settled mutation even with a stale error value', () => {
    // Chỉ isError quyết định hiển thị, đúng ngữ nghĩa dòng cũ (ternary theo isError).
    expect(
      mutationErrorElement(makeMutation({ isError: false, error: apiError('stale') })),
    ).toBeNull();
  });

  it('keeps two calls independent for multi-mutation screens', () => {
    const first = mutationErrorElement(
      makeMutation({ isError: true, error: apiError('first failed') }),
    ) as { props: { children: string } };
    const second = mutationErrorElement(makeMutation());
    expect(first.props.children).toBe('first failed');
    expect(second).toBeNull();
  });

  it('falls back to a non-empty message for a plain Error, like toApiError', () => {
    // Helper không tự bịa message: nó chuyển tiếp đúng mapping của toApiError
    // (Error thuần không mang kind -> fallback 'unexpected' theo locale hiện tại).
    const element = mutationErrorElement(
      makeMutation({ isError: true, error: new Error('boom') }),
    ) as { type: unknown; props: { children: string } };
    expect(element.type).toBe(Text);
    expect(typeof element.props.children).toBe('string');
    expect(element.props.children.length).toBeGreaterThan(0);
  });
});
