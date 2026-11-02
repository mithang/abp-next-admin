import { create } from 'zustand';
import { setTokenProvider, setUnauthorizedHandler } from '../lib/api-client';
import { config } from '../lib/config';
import {
  clearOriginalTokens,
  clearTokens,
  getAccessToken,
  getOriginalTokens,
} from '../features/auth/token-storage';
import { discover } from '../features/auth/oidc';
import {
  impersonate as impersonateVault,
  revertImpersonation as revertVault,
  secureStoreVault,
  type ImpersonationTarget,
} from '../features/auth/impersonation';
import { getMyProfile } from '../features/auth/api';
import type { AuthState } from '../features/auth/types';

/**
 * Chỉ giữ trạng thái phiên (không giữ token trong store).
 * api-client lấy token trực tiếp từ SecureStore qua tokenProvider.
 *
 * Mạo danh (vòng 25): store giữ thêm cờ isImpersonating + tên tài khoản
 * gốc (chỉ trong bộ nhớ — sau restart app, tên gốc về null nhưng cờ vẫn
 * đúng nhờ phiên gốc trong SecureStore, banner hiển thị text chung).
 * CẨN THẬN: luồng mạo danh/revert KHÔNG được gọi setAuthenticated, vì
 * setAuthenticated của luồng login mới sẽ xóa phiên gốc đã lưu.
 */
interface AuthStore extends AuthState {
  /** true khi còn phiên gốc trong SecureStore (đang mạo danh). */
  isImpersonating: boolean;
  /** Tên tài khoản gốc trong phiên hiện tại (null nếu không rõ, vd sau restart). */
  originalUserName: string | null;
  bootstrap: () => Promise<void>;
  setAuthenticated: (userName: string | null) => void;
  signOut: () => Promise<void>;
  impersonate: (target: ImpersonationTarget) => Promise<void>;
  revertImpersonation: () => Promise<void>;
}

setTokenProvider(() => getAccessToken());

async function refreshProfileName(): Promise<string | null> {
  try {
    const profile = await getMyProfile();
    return profile.userName ?? profile.name ?? null;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  status: 'loading',
  userName: null,
  isImpersonating: false,
  originalUserName: null,
  bootstrap: async () => {
    const token = await getAccessToken();
    const original = await getOriginalTokens();
    set({
      status: token ? 'authenticated' : 'unauthenticated',
      isImpersonating: Boolean(original),
    });
  },
  setAuthenticated: (userName) => {
    // Đăng nhập mới = phiên mới: xóa phiên gốc cũ nếu còn sót (vd đăng
    // nhập lại trong lúc đang mạo danh rồi token cũ chết).
    void clearOriginalTokens();
    set({ status: 'authenticated', userName, isImpersonating: false, originalUserName: null });
  },
  signOut: async () => {
    // clearTokens đã xóa cả phiên gốc (xem token-storage).
    await clearTokens();
    set({
      status: 'unauthenticated',
      userName: null,
      isImpersonating: false,
      originalUserName: null,
    });
  },
  impersonate: async (target) => {
    const discovery = await discover();
    if (!discovery.tokenEndpoint) throw new Error('OIDC discovery has no token endpoint');
    const originalUserName = get().userName;
    await impersonateVault(
      secureStoreVault,
      { tokenEndpoint: discovery.tokenEndpoint, clientId: config.clientId },
      target,
    );
    // userName mới lấy từ profile (token đã đổi nên api-client dùng token mới).
    const userName = await refreshProfileName();
    set({ status: 'authenticated', userName, isImpersonating: true, originalUserName });
  },
  revertImpersonation: async () => {
    const discovery = await discover();
    if (!discovery.tokenEndpoint) throw new Error('OIDC discovery has no token endpoint');
    await revertVault(secureStoreVault, {
      tokenEndpoint: discovery.tokenEndpoint,
      clientId: config.clientId,
    });
    const userName = await refreshProfileName();
    set({ status: 'authenticated', userName, isImpersonating: false, originalUserName: null });
  },
}));

// 401 từ api-client -> về trạng thái unauthenticated (route guard chuyển về login).
setUnauthorizedHandler(() => {
  useAuthStore.setState({
    status: 'unauthenticated',
    userName: null,
    isImpersonating: false,
    originalUserName: null,
  });
});
