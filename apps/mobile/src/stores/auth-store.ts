import { create } from 'zustand';
import { setTokenProvider, setUnauthorizedHandler } from '../lib/api-client';
import { getAccessToken, clearTokens } from '../features/auth/token-storage';
import type { AuthState } from '../features/auth/types';

/**
 * Chỉ giữ trạng thái phiên (không giữ token trong store).
 * api-client lấy token trực tiếp từ SecureStore qua tokenProvider.
 */
interface AuthStore extends AuthState {
  bootstrap: () => Promise<void>;
  setAuthenticated: (userName: string | null) => void;
  signOut: () => Promise<void>;
}

setTokenProvider(() => getAccessToken());

export const useAuthStore = create<AuthStore>((set) => ({
  status: 'loading',
  userName: null,
  bootstrap: async () => {
    const token = await getAccessToken();
    set({ status: token ? 'authenticated' : 'unauthenticated' });
  },
  setAuthenticated: (userName) => set({ status: 'authenticated', userName }),
  signOut: async () => {
    await clearTokens();
    set({ status: 'unauthenticated', userName: null });
  },
}));

// 401 từ api-client -> về trạng thái unauthenticated (route guard chuyển về login).
setUnauthorizedHandler(() => {
  useAuthStore.setState({ status: 'unauthenticated', userName: null });
});
