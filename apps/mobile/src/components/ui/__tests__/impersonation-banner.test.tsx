import { describe, it, expect, jest, afterEach } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../../../i18n';

// auth-store kéo oidc.ts, mà oidc.ts gọi AuthSession.makeRedirectUri()
// ngay ở top-level và cần expo-constants manifest (không có dưới jest).
// Banner không dùng discover nên mock module này; SecureStore/token
// storage vẫn là thật (mock native của jest-expo).
jest.mock('../../../features/auth/oidc', () => ({
  // discover thật trả về DiscoveryDocument đầy đủ; banner không dùng nó
  // nên mock tối giản này chỉ cần cast qua never cho typecheck.
  discover: (() => Promise.resolve({ tokenEndpoint: 'https://example.test/token' })) as never,
}));

// jest.mock được hoist nên phải đứng trước import này; disable rule import/first.
// eslint-disable-next-line import/first
import { useAuthStore } from '../../../stores/auth-store';
// eslint-disable-next-line import/first
import { ImpersonationBanner } from '../ImpersonationBanner';

// expo-router thật cần navigation context; banner chỉ dùng router.replace
// sau khi revert thành công nên mock tối giản tại đây.
jest.mock('expo-router', () => {
  const replace = jest.fn();
  (globalThis as unknown as { __mockRouterReplace: unknown }).__mockRouterReplace = replace;
  return { useRouter: () => ({ replace }) };
});

async function renderBanner() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  await render(
    <QueryClientProvider client={client}>
      <ImpersonationBanner />
    </QueryClientProvider>,
  );
}

afterEach(() => {
  useAuthStore.setState({
    isImpersonating: false,
    originalUserName: null,
  });
});

describe('ImpersonationBanner', () => {
  it('không render gì khi không mạo danh', async () => {
    useAuthStore.setState({ isImpersonating: false, originalUserName: null });
    await renderBanner();
    expect(screen.queryByText('Bạn đang mạo danh tài khoản khác.')).toBeNull();
  });

  it('hiển thị banner + tên tài khoản gốc khi đang mạo danh', async () => {
    useAuthStore.setState({ isImpersonating: true, originalUserName: 'admin_goc' });
    await renderBanner();
    expect(screen.getByText('Bạn đang mạo danh tài khoản khác.')).toBeTruthy();
    expect(screen.getByText(/admin_goc/)).toBeTruthy();
    expect(screen.getByTestId('impersonation-revert')).toBeTruthy();
  });

  it('bấm Quay về tài khoản gốc gọi revert và ẩn banner', async () => {
    useAuthStore.setState({
      isImpersonating: true,
      originalUserName: 'admin_goc',
      revertImpersonation: async () => {
        useAuthStore.setState({ isImpersonating: false, originalUserName: null });
      },
    });
    await renderBanner();
    fireEvent.press(screen.getByTestId('impersonation-revert'));
    await waitFor(() => {
      expect(screen.queryByText('Bạn đang mạo danh tài khoản khác.')).toBeNull();
    });
  });
});
