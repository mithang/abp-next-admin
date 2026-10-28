import type { BasicStatus, PermissionType } from "./enum";

export interface UserToken {
	accessToken?: string;
	refreshToken?: string;
}

export interface UserInfo {
	[key: string]: any;
	id: string;
	email: string;
	password?: string;
	role?: Role;
	status?: BasicStatus;
	permissions?: Permission[];
	//TODO Dọn dẹp các thông tin không dùng đến
	/**
	 * Mô tả người dùng
	 */
	desc: string;
	/**
	 * Địa chỉ trang chủ
	 */
	homePath: string;

	/**
	 * accessToken
	 */
	token: string;
	/**
	 * Ảnh đại diện
	 */
	avatar: string;
	/**
	 * Biệt danh người dùng
	 */
	realName: string;
	/**
	 * Vai trò người dùng
	 */
	roles?: string[];
	/**
	 * Id người dùng
	 */
	userId: string;
	/**
	 * Tên đăng nhập
	 */
	username: string;
}

export interface Organization {
	id: string;
	name: string;
	status: "enable" | "disable";
	desc?: string;
	order?: number;
	children?: Organization[];
}

export interface Permission {
	id: string;
	parentId: string;
	name: string;
	label: string;
	type: PermissionType;
	route: string;
	status?: BasicStatus;
	order?: number;
	icon?: string;
	component?: string;
	hide?: boolean;
	hideTab?: boolean;
	frameSrc?: string;
	newFeature?: boolean;
	children?: Permission[];
}

export interface Role {
	id: string;
	name: string;
	label: string;
	status: BasicStatus;
	order?: number;
	desc?: string;
	permission?: Permission[];
}
