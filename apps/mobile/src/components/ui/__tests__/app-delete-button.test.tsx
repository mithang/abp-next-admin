import React from 'react';
import { describe, it, expect, jest } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../../../i18n';
import type { ConfirmDialogOptions } from '../../../lib/confirm';

// Hop thoai that (Alert.alert) khong mo duoc duoi jest ma khong mock
// ca react-native — mock rieng confirm de bat options roi goi onConfirm
// bang tay, giong cach confirm.test.ts bat buttons cua Alert.
const confirmCalls: ConfirmDialogOptions[] = [];
jest.mock('../../../lib/confirm', () => ({
  showConfirmDialog: (options: ConfirmDialogOptions) => {
    confirmCalls.push(options);
  },
}));

const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack }),
}));

// eslint-disable-next-line import/first
import { AppDeleteButton } from '../AppDeleteButton';

async function renderButton(onDelete: () => Promise<unknown>) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  client.setQueryData(['roles'], [{ id: '1' }]);
  const rendered = await render(
    <QueryClientProvider client={client}>
      <AppDeleteButton
        confirmTitle="Xoa vai tro?"
        confirmMessage="Khong khoi phuc duoc"
        onDelete={onDelete}
        invalidateKey={['roles']}
        testID="probe-delete"
      />
    </QueryClientProvider>,
  );
  return { client, ...rendered };
}

describe('AppDeleteButton', () => {
  // 1 test gop (thanh cong + that bai) de tranh act scope treo giua
  // cac suite RHF nhu vong 49-50: chi 1 render/lan, unmount ro rang.
  it('xac nhan roi xoa: invalidate + quay lai; xoa loi hien dong loi', async () => {
    confirmCalls.length = 0;
    mockBack.mockClear();
    const onDelete = jest.fn(() => Promise.resolve(undefined));
    const first = await renderButton(onDelete as () => Promise<unknown>);
    expect(screen.getByTestId('probe-delete')).toBeTruthy();
    fireEvent.press(screen.getByTestId('probe-delete'));
    expect(confirmCalls).toHaveLength(1);
    expect(confirmCalls[0].title).toBe('Xoa vai tro?');
    expect(confirmCalls[0].message).toBe('Khong khoi phuc duoc');
    confirmCalls[0].onConfirm();
    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(first.client.getQueryState(['roles'])?.isInvalidated).toBe(true);
      expect(mockBack).toHaveBeenCalledTimes(1);
    });
    await first.unmount();

    confirmCalls.length = 0;
    mockBack.mockClear();
    const failing = jest.fn(() => Promise.reject(new Error('Khong xoa duoc')));
    await renderButton(failing as () => Promise<unknown>);
    fireEvent.press(screen.getByTestId('probe-delete'));
    expect(confirmCalls).toHaveLength(1);
    confirmCalls[0].onConfirm();
    await waitFor(() => {
      // Loi Error thuong khong phai ApiError: toApiError map ve
      // fallback errors.unexpected da dich, khong hien message goc.
      expect(screen.getByText('Đã xảy ra lỗi không xác định. Vui lòng thử lại.')).toBeTruthy();
    });
    expect(mockBack).not.toHaveBeenCalled();
  });
});
