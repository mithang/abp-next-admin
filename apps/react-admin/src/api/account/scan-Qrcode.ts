import type { GenerateQrCodeResult, QrCodeUserInfoResult } from "#/account/qrcode";

import requestClient from "@/api/request";

/**
 * Tạo mã QR đăng nhập
 * @returns Thông tin mã QR
 */
export function generateApi(): Promise<GenerateQrCodeResult> {
	return requestClient.post<GenerateQrCodeResult>("/api/account/qrcode/generate");
}

/**
 * Kiểm tra trạng thái mã QR
 * @param key Key mã QR
 * @returns Thông tin mã QR
 */
export function checkCodeApi(key: string): Promise<QrCodeUserInfoResult> {
	return requestClient.get<QrCodeUserInfoResult>(`/api/account/qrcode/${key}/check`);
}
