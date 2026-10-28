export enum QrCodeStatus {
	/** Đã xác nhận */
	Confirmed = 10,
	/** Đã tạo */
	Created = 0,
	/** Không hợp lệ */
	Invalid = -1,
	/** Đã quét */
	Scaned = 5,
}

interface GenerateQrCodeResult {
	key: string;
}

interface QrCodeInfoResult {
	key: string;
	status: QrCodeStatus;
}

interface QrCodeUserInfoResult extends QrCodeInfoResult {
	picture?: string;
	tenantId?: string;
	userId?: string;
	userName?: string;
}

export type { GenerateQrCodeResult, QrCodeUserInfoResult };
