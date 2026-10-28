import type { OAuthError } from '../types/token';

import { $t } from '@vben/locales';

export function useOAuthError() {
  function formatError(error: OAuthError) {
    switch (error.error_description) {
      // Tên người dùng hoặc mật khẩu không hợp lệ
      case 'Invalid username or password!': {
        return $t('abp.oauth.errors.invalidUserNameOrPassword');
      }
      // Cần đổi mật khẩu
      case 'PeriodicallyChangePassword':
      case 'ShouldChangePasswordOnNextLogin': {
        return $t('abp.oauth.errors.shouldChangePassword');
      }
      // Cần xác thực hai lớp
      case 'RequiresTwoFactor': {
        return $t('abp.oauth.errors.requiresTwoFactor');
      }
      // Người dùng từ chối cấp quyền
      case 'The authorization was denied by the end user.': {
        return $t('abp.oauth.errors.accessDenied');
      }
      // Token đã hết hiệu lực
      case 'The token is no longer valid.':
      case 'The user is no longer allowed to sign in.': {
        return $t('abp.oauth.errors.tokenHasExpired');
      }
      // Người dùng thử đăng nhập quá nhiều lần, tài khoản bị khóa
      case 'The user account has been locked out due to invalid login attempts. Please wait a while and try again.': {
        return $t('abp.oauth.errors.accountLockedByInvalidLoginAttempts');
      }
      // Người dùng chưa được kích hoạt
      case 'You are not allowed to login! Your account is inactive.': {
        return $t('abp.oauth.errors.accountInactive');
      }
      // Các thông báo lỗi ít dùng khác trả về chuỗi gốc
      default: {
        return error.error_description;
      }
    }
  }

  return {
    formatError,
  };
}
