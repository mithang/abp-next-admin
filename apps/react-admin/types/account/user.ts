interface UserInfo {
	[property: string]: any;
	/**
	 * Địa chỉ email
	 */
	email: string;
	/**
	 * Địa chỉ email đã được xác minh chưa
	 */
	emailVerified: string;
	/**
	 * Tên
	 */
	givenName: string;
	/**
	 * Tên người dùng
	 */
	name: string;
	/**
	 * Số điện thoại đã được xác minh chưa
	 */
	phoneNumberVerified: string;
	/**
	 * Tên người dùng
	 */
	preferredUsername: string;
	/**
	 * Danh sách vai trò
	 */
	role: string[];
	/**
	 * Id người dùng
	 */
	sub: string;
	/**
	 * Tên người dùng
	 */
	uniqueName: string;
}
/** Cấu trúc thông tin người dùng chuẩn oauth */
interface OAuthUserInfo {
	[property: string]: any;
	/**
	 * Địa chỉ email
	 */
	email: string;
	/**
	 * Địa chỉ email đã được xác minh chưa
	 */
	email_verified: string;
	/**
	 * Tên
	 */
	given_name: string;
	/**
	 * Tên người dùng
	 */
	name: string;
	/**
	 * Số điện thoại đã được xác minh chưa
	 */
	phone_number_verified: string;
	/**
	 * Tên người dùng
	 */
	preferred_username: string;
	/**
	 * Danh sách vai trò
	 */
	role: string[];
	/**
	 * Id người dùng
	 */
	sub: string;
	/**
	 * Tên người dùng
	 */
	unique_name: string;
}

export type { OAuthUserInfo, UserInfo };
