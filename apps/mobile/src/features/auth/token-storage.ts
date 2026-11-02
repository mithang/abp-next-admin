import * as SecureStore from 'expo-secure-store';

/**
 * Token CHỈ lưu trong SecureStore (Keychain/Keystore), không bao giờ lưu trong
 * AsyncStorage, không log giá trị token. Key riêng cho từng loại token để có thể
 * xóa chọn lọc khi logout/đổi tài khoản.
 */
const ACCESS_TOKEN_KEY = 'abp.accessToken';
const REFRESH_TOKEN_KEY = 'abp.refreshToken';
const ID_TOKEN_KEY = 'abp.idToken';

/**
 * Phiên GỐC khi đang mạo danh (vòng 25): access/refresh/id token của tài
 * khoản thật, lưu riêng trong SecureStore để luồng revert khôi phục được
 * ngay cả khi grant revert phía server thất bại. Chỉ tồn tại trong lúc
 * đang mạo danh; đăng nhập mới hoặc đăng xuất đều xóa (xem auth-store).
 * Marker "đang mạo danh" = original access token còn tồn tại.
 */
const ORIGINAL_ACCESS_TOKEN_KEY = 'abp.originalAccessToken';
const ORIGINAL_REFRESH_TOKEN_KEY = 'abp.originalRefreshToken';
const ORIGINAL_ID_TOKEN_KEY = 'abp.originalIdToken';

export async function saveTokens(tokens: {
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
}): Promise<void> {
  if (tokens.accessToken !== undefined)
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken);
  if (tokens.refreshToken !== undefined)
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken);
  if (tokens.idToken !== undefined) await SecureStore.setItemAsync(ID_TOKEN_KEY, tokens.idToken);
}

export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function getIdToken(): Promise<string | null> {
  return SecureStore.getItemAsync(ID_TOKEN_KEY);
}

export interface SavedTokenSet {
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
}

export async function getCurrentTokens(): Promise<SavedTokenSet> {
  const [accessToken, refreshToken, idToken] = await Promise.all([
    SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
    SecureStore.getItemAsync(ID_TOKEN_KEY),
  ]);
  return { accessToken, refreshToken, idToken };
}

/** Phiên gốc đã lưu, hoặc null khi không mạo danh. */
export async function getOriginalTokens(): Promise<SavedTokenSet | null> {
  const accessToken = await SecureStore.getItemAsync(ORIGINAL_ACCESS_TOKEN_KEY);
  if (!accessToken) return null;
  const [refreshToken, idToken] = await Promise.all([
    SecureStore.getItemAsync(ORIGINAL_REFRESH_TOKEN_KEY),
    SecureStore.getItemAsync(ORIGINAL_ID_TOKEN_KEY),
  ]);
  return { accessToken, refreshToken, idToken };
}

export async function saveOriginalTokens(tokens: {
  accessToken?: string | null;
  refreshToken?: string | null;
  idToken?: string | null;
}): Promise<void> {
  if (tokens.accessToken)
    await SecureStore.setItemAsync(ORIGINAL_ACCESS_TOKEN_KEY, tokens.accessToken);
  if (tokens.refreshToken)
    await SecureStore.setItemAsync(ORIGINAL_REFRESH_TOKEN_KEY, tokens.refreshToken);
  if (tokens.idToken) await SecureStore.setItemAsync(ORIGINAL_ID_TOKEN_KEY, tokens.idToken);
}

export async function clearOriginalTokens(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(ORIGINAL_ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(ORIGINAL_REFRESH_TOKEN_KEY),
    SecureStore.deleteItemAsync(ORIGINAL_ID_TOKEN_KEY),
  ]);
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
  // Đăng xuất trong lúc mạo danh cũng phải xóa phiên gốc, nếu không lần
  // đăng nhập sau có thể bị nhận diện nhầm là "đang mạo danh".
  await clearOriginalTokens();
}
