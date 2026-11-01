/** Profile hiện tại: GET /api/account/my-profile (web useProfileApi.ts). */
export interface ProfileDto {
  userName?: string;
  email?: string;
  name?: string;
  surname?: string;
  phoneNumber?: string;
  isExternal?: boolean;
  hasPassword?: boolean;
  concurrencyStamp?: string;
}

export interface AuthState {
  status: 'loading' | 'authenticated' | 'unauthenticated';
  /** Chỉ giữ thông tin định danh không nhạy cảm (sub, tên hiển thị). Không giữ token ở đây. */
  userName: string | null;
}
