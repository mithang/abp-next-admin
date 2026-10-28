import type {
  AuthenticatorDto,
  AuthenticatorRecoveryCodeDto,
  ChangePasswordInput,
  ChangePhoneNumberInput,
  ChangePictureInput,
  ConfirmEmailInput,
  ProfileDto,
  SendChangePhoneNumberCodeInput,
  SendEmailConfirmCodeDto,
  TwoFactorEnabledDto,
  UpdateProfileDto,
  VerifyAuthenticatorCodeInput,
} from '../types/profile';

import { useRequest } from '@abp/request';

export function useProfileApi() {
  const { cancel, request } = useRequest();

  /**
   * Truy vấn thông tin cá nhân
   * @returns Thông tin cá nhân
   */
  function getApi(): Promise<ProfileDto> {
    return request<ProfileDto>('/api/account/my-profile', {
      method: 'GET',
    });
  }

  /**
   * Cập nhật thông tin cá nhân
   * @param input Tham số
   * @returns Thông tin cá nhân
   */
  function updateApi(input: UpdateProfileDto): Promise<ProfileDto> {
    return request<ProfileDto>('/api/account/my-profile', {
      data: input,
      method: 'PUT',
    });
  }

  /**
   * Đổi mật khẩu
   * @param input Tham số
   */
  function changePasswordApi(input: ChangePasswordInput): Promise<void> {
    return request('/api/account/my-profile/change-password', {
      data: input,
      method: 'POST',
    });
  }

  /**
   * Gửi mã xác minh đổi số điện thoại
   * @param input Tham số
   */
  function sendChangePhoneNumberCodeApi(
    input: SendChangePhoneNumberCodeInput,
  ): Promise<void> {
    return request('/api/account/my-profile/send-phone-number-change-code', {
      data: input,
      method: 'POST',
    });
  }

  /**
   * Đổi số điện thoại
   * @param input Tham số
   */
  function changePhoneNumberApi(input: ChangePhoneNumberInput): Promise<void> {
    return request('/api/account/my-profile/change-phone-number', {
      data: input,
      method: 'PUT',
    });
  }

  /**
   * Đổi ảnh đại diện
   * @param input Tham số
   */
  function changePictureApi(input: ChangePictureInput): Promise<void> {
    return request('/api/account/my-profile/picture', {
      data: input,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      method: 'POST',
    });
  }

  /**
   * Lấy ảnh đại diện
   * @returns Luồng tệp ảnh đại diện
   */
  function getPictureApi(): Promise<Blob> {
    return request('/api/account/my-profile/picture', {
      method: 'GET',
      responseType: 'blob',
    });
  }

  /**
   * Lấy trạng thái bật xác thực hai yếu tố
   */
  function getTwoFactorEnabledApi(): Promise<TwoFactorEnabledDto> {
    return request<TwoFactorEnabledDto>('/api/account/my-profile/two-factor', {
      method: 'GET',
    });
  }

  /**
   * Đặt trạng thái bật xác thực hai yếu tố
   */
  function changeTwoFactorEnabledApi(
    input: TwoFactorEnabledDto,
  ): Promise<void> {
    return request('/api/account/my-profile/change-two-factor', {
      data: input,
      method: 'PUT',
    });
  }

  /**
   * Lấy cấu hình trình xác thực
   * @returns Trình xác thực
   */
  function getAuthenticatorApi(): Promise<AuthenticatorDto> {
    return request<AuthenticatorDto>('/api/account/my-profile/authenticator', {
      method: 'GET',
    });
  }

  /**
   * Xác minh mã xác thực
   * @param input Tham số
   * @returns Mã đặt lại
   */
  function verifyAuthenticatorCodeApi(
    input: VerifyAuthenticatorCodeInput,
  ): Promise<AuthenticatorRecoveryCodeDto> {
    return request<AuthenticatorRecoveryCodeDto>(
      '/api/account/my-profile/verify-authenticator-code',
      {
        data: input,
        method: 'POST',
      },
    );
  }

  /**
   * Đặt lại trình xác thực
   */
  function resetAuthenticatorApi(): Promise<void> {
    return request('/api/account/my-profile/reset-authenticator', {
      method: 'POST',
    });
  }

  /**
   * Gửi liên kết xác nhận email
   * @param input Tham số
   */
  function sendEmailConfirmLinkApi(
    input: SendEmailConfirmCodeDto,
  ): Promise<void> {
    return request('/api/account/my-profile/send-email-confirm-link', {
      data: input,
      method: 'POST',
    });
  }

  /**
   * Xác nhận email
   * @param input Tham số
   */
  function confirmEmailApi(input: ConfirmEmailInput) {
    return request('/api/account/my-profile/confirm-email', {
      data: input,
      method: 'PUT',
    });
  }

  return {
    cancel,
    changePasswordApi,
    changePhoneNumberApi,
    changePictureApi,
    changeTwoFactorEnabledApi,
    confirmEmailApi,
    getApi,
    getAuthenticatorApi,
    getPictureApi,
    getTwoFactorEnabledApi,
    resetAuthenticatorApi,
    sendChangePhoneNumberCodeApi,
    sendEmailConfirmLinkApi,
    updateApi,
    verifyAuthenticatorCodeApi,
  };
}
