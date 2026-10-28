import { baseRequestClient, requestClient } from '#/api/request';

export namespace AuthApi {
  /** Tham số API đăng nhập */
  export interface LoginParams {
    password?: string;
    username?: string;
  }

  /** Giá trị trả về của API đăng nhập */
  export interface LoginResult {
    accessToken: string;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

/**
 * Đăng nhập
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<AuthApi.LoginResult>('/auth/login', data, {
    withCredentials: true,
  });
}

/**
 * Làm mới accessToken
 */
export async function refreshTokenApi() {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>(
    '/auth/refresh',
    null,
    {
      withCredentials: true,
    },
  );
}

/**
 * Đăng xuất
 */
export async function logoutApi() {
  return baseRequestClient.post('/auth/logout', null, {
    withCredentials: true,
  });
}

/**
 * Lấy mã quyền của người dùng
 */
export async function getAccessCodesApi() {
  return requestClient.get<string[]>('/auth/codes');
}
