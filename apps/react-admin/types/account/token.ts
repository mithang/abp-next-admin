/** Mô hình dữ liệu yêu cầu ủy quyền */
interface TokenRequest {
	/** Id client */
	clientId: string;
	/** Khóa bí mật client */
	clientSecret: string;
}
/** Mô hình dữ liệu yêu cầu ủy quyền bằng mật khẩu người dùng */
interface PasswordTokenRequest extends TokenRequest {
	/** Mật khẩu người dùng */
	password: string;
	/** Phạm vi ủy quyền */
	scope?: string;
	/** Tên người dùng */
	userName: string;
}
/** Mô hình dữ liệu yêu cầu ủy quyền bằng số điện thoại */
interface PhoneNumberTokenRequest {
	[key: string]: any;
	/** Mã xác minh */
	code: string;
	/** Số điện thoại */
	phoneNumber: string;
}
/** Mô hình dữ liệu yêu cầu ủy quyền đăng nhập bằng quét mã */
interface QrCodeTokenRequest {
	[key: string]: any;
	/** Key mã QR */
	key: string;
	/** Id tenant */
	tenantId?: string;
}
/** Mô hình dữ liệu yêu cầu ủy quyền bằng mật khẩu người dùng */
interface PasswordTokenRequestModel {
	[key: string]: any;
	/** Mật khẩu người dùng */
	password: string;
	/** Tên người dùng */
	username: string;
}
/** Kiểu dữ liệu yêu cầu thu hồi token */
interface RevokeTokenRequest {
	/** Token */
	token: string;
	/** Loại token */
	tokenType?: "access_token" | "refresh_token";
}
/** Mô hình dữ liệu trả về token */
interface TokenResult {
	/** Token truy cập */
	accessToken: string;
	/** Thời gian hết hạn */
	expiresIn: number;
	/** Token làm mới */
	refreshToken: string;
	/** Loại token */
	tokenType: string;
}
interface OAuthTokenRefreshModel {
	/** Token làm mới */
	refreshToken: string;
}
/** Cấu trúc trả về token chuẩn oauth */
interface OAuthTokenResult {
	/** Token truy cập */
	access_token: string;
	/** Thời gian hết hạn */
	expires_in: number;
	/** Token làm mới */
	refresh_token: string;
	/** Loại token */
	token_type: string;
}

interface OAuthError {
	/** Loại lỗi */
	error: string;
	/** Mô tả lỗi */
	error_description: string;
	/** Liên kết mô tả lỗi */
	error_uri?: string;
}

interface TwoFactorError extends OAuthError {
	twoFactorToken: string;
	userId: string;
}

interface ShouldChangePasswordError extends OAuthError {
	changePasswordToken: string;
	userId: string;
}

/** Mô hình dữ liệu yêu cầu làm mới token người dùng */
interface RefreshTokenRequestModel {
	/** Mật khẩu người dùng */
	refreshToken: string;
}

interface SignInRedirectResult {
	isExternalLogin: boolean;
	needRegister: boolean;
	redirectUrl?: string;
}

export type {
	OAuthError,
	OAuthTokenRefreshModel,
	OAuthTokenResult,
	PasswordTokenRequest,
	PasswordTokenRequestModel,
	PhoneNumberTokenRequest,
	QrCodeTokenRequest,
	RevokeTokenRequest,
	ShouldChangePasswordError,
	TokenRequest,
	TokenResult,
	TwoFactorError,
	RefreshTokenRequestModel,
	SignInRedirectResult,
};
