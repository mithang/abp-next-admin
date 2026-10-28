import type {
  GenerateQrCodeResult,
  QrCodeUserInfoResult,
} from '../types/qrcode';

import { useRequest } from '@abp/request';

export function useScanQrCodeApi() {
  const { cancel, request } = useRequest();

  /**
   * Tạo mã QR đăng nhập
   * @returns Thông tin mã QR
   */
  function generateApi(): Promise<GenerateQrCodeResult> {
    return request<GenerateQrCodeResult>('/api/account/qrcode/generate', {
      method: 'POST',
    });
  }

  /**
   * Kiểm tra trạng thái mã QR
   * @param key Key mã QR
   * @returns Thông tin mã QR
   */
  function checkCodeApi(key: string): Promise<QrCodeUserInfoResult> {
    return request<QrCodeUserInfoResult>(`/api/account/qrcode/${key}/check`, {
      method: 'GET',
    });
  }

  return {
    cancel,
    checkCodeApi,
    generateApi,
  };
}
