import type { ExtensibleObject, IHasConcurrencyStamp } from '@abp/core';

interface ProfileDto extends ExtensibleObject, IHasConcurrencyStamp {
  /** Email */
  email: string;
  hasPassword: boolean;
  /** Có phải người dùng bên ngoài không */
  isExternal: boolean;
  /** Tên */
  name?: string;
  /** Số điện thoại di động */
  phoneNumber?: string;
  /** Họ */
  surname?: string;
  /** Tên người dùng */
  userName: string;
}

interface UpdateProfileDto extends ExtensibleObject, IHasConcurrencyStamp {
  /** Email */
  email: string;
  /** Tên */
  name?: string;
  /** Số điện thoại di động */
  phoneNumber?: string;
  /** Họ */
  surname?: string;
  /** Tên người dùng */
  userName: string;
}

interface ChangePasswordInput {
  /** Mật khẩu hiện tại */
  currentPassword: string;
  /** Mật khẩu mới */
  newPassword: string;
}

interface ChangePhoneNumberInput {
  code: string;
  newPhoneNumber: string;
}

interface SendChangePhoneNumberCodeInput {
  newPhoneNumber: string;
}

interface ChangePictureInput {
  file: File;
}

interface TwoFactorEnabledDto {
  /** Có bật xác thực hai bước không */
  enabled: boolean;
}

interface AuthenticatorDto {
  authenticatorUri: string;
  isAuthenticated: boolean;
  sharedKey: string;
}

interface VerifyAuthenticatorCodeInput {
  authenticatorCode: string;
}

interface AuthenticatorRecoveryCodeDto {
  recoveryCodes: string[];
}

interface SendEmailConfirmCodeDto {
  appName: string;
  email: string;
  returnUrl?: string;
}

interface ConfirmEmailInput {
  confirmToken: string;
}

export type {
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
};
