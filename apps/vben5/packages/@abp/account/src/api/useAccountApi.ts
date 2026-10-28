import type { ListResultDto } from '@abp/core';

import type {
  GetTwoFactorProvidersInput,
  PhoneResetPasswordDto,
  SendEmailSigninCodeDto,
  SendPhoneResetPasswordCodeDto,
  SendPhoneSigninCodeDto,
  TwoFactorProvider,
} from '../types/account';

import { useRequest } from '@abp/request';

export function useAccountApi() {
  const { cancel, request } = useRequest();

  /**
   * Lấy các trình xác thực xác minh hai bước khả dụng
   * @param input Tham số
   */
  function getTwoFactorProvidersApi(
    input: GetTwoFactorProvidersInput,
  ): Promise<ListResultDto<TwoFactorProvider>> {
    return request<ListResultDto<TwoFactorProvider>>(
      '/api/account/two-factor-providers',
      {
        method: 'GET',
        params: input,
      },
    );
  }

  /**
   * Gửi email xác minh đăng nhập
   * @param input Tham số
   */
  function sendEmailSigninCodeApi(
    input: SendEmailSigninCodeDto,
  ): Promise<void> {
    return request('/api/account/email/send-signin-code', {
      data: input,
      method: 'POST',
    });
  }

  /**
   * Gửi SMS xác minh đăng nhập
   * @param input Tham số
   */
  function sendPhoneSigninCodeApi(
    input: SendPhoneSigninCodeDto,
  ): Promise<void> {
    return request('/api/account/phone/send-signin-code', {
      data: input,
      method: 'POST',
    });
  }

  /**
   * Gửi SMS xác minh đặt lại mật khẩu
   * @param input Tham số
   */
  function sendPhoneResetPasswordCodeApi(
    input: SendPhoneResetPasswordCodeDto,
  ): Promise<void> {
    return request('/api/account/phone/send-password-reset-code', {
      data: input,
      method: 'POST',
    });
  }

  /**
   * Đặt lại mật khẩu
   * @param input Tham số
   */
  function resetPasswordApi(input: PhoneResetPasswordDto): Promise<void> {
    return request('/api/account/phone/reset-password', {
      data: input,
      method: 'PUT',
    });
  }

  return {
    cancel,
    getTwoFactorProvidersApi,
    resetPasswordApi,
    sendEmailSigninCodeApi,
    sendPhoneResetPasswordCodeApi,
    sendPhoneSigninCodeApi,
  };
}
