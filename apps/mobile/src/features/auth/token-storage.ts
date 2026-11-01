import * as SecureStore from 'expo-secure-store';

/**
 * Token CHỈ lưu trong SecureStore (Keychain/Keystore), không bao giờ lưu trong
 * AsyncStorage, không log giá trị token. Key riêng cho từng loại token để có thể
 * xóa chọn lọc khi logout/đổi tài khoản.
 */
const ACCESS_TOKEN_KEY = 'abp.accessToken';
const REFRESH_TOKEN_KEY = 'abp.refreshToken';
const ID_TOKEN_KEY = 'abp.idToken';

export async function saveTokens(tokens: {
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
}): Promise<void> {
  if (tokens.accessToken !== undefined) await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken);
  if (tokens.refreshToken !== undefined) await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken);
  if (tokens.idToken !== undefined) await SecureStore.setItemAsync(ID_TOKEN_KEY, tokens.idToken);
}

export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function clearTokens(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    SecureStore.deleteItemAsync(ID_TOKEN_KEY),
  ]);
}
