/** Quyền người dùng */
export const IdentityUserPermissions = {
	/** Thêm mới */
	Create: "AbpIdentity.Users.Create",
	/** Xóa */
	Delete: "AbpIdentity.Users.Delete",
	/** Quản lý claim */
	ManageClaims: "AbpIdentity.Users.ManageClaims",
	/** Quản lý quyền */
	ManagePermissions: "AbpIdentity.Users.ManagePermissions",
	/** Cập nhật */
	Update: "AbpIdentity.Users.Update",
};
/** Quyền vai trò */
export const IdentityRolePermissions = {
	/** Thêm mới */
	Create: "AbpIdentity.Roles.Create",
	/** Xóa */
	Delete: "AbpIdentity.Roles.Delete",
	/** Quản lý claim */
	ManageClaims: "AbpIdentity.Roles.ManageClaims",
	/** Quản lý quyền */
	ManagePermissions: "AbpIdentity.Roles.ManagePermissions",
	/** Cập nhật */
	Update: "AbpIdentity.Roles.Update",
};
/** Quyền loại claim */
export const IdentityClaimTypePermissions = {
	/** Thêm mới */
	Create: "AbpIdentity.IdentityClaimTypes.Create",
	/** Xóa */
	Delete: "AbpIdentity.IdentityClaimTypes.Delete",
	/** Cập nhật */
	Update: "AbpIdentity.IdentityClaimTypes.Update",
};
/** Quyền tổ chức */
export const OrganizationUnitPermissions = {
	/** Quản lý vai trò */
	ManageRoles: "AbpIdentity.OrganizationUnits.ManageRoles",
	/** Quản lý người dùng */
	ManageUsers: "AbpIdentity.OrganizationUnits.ManageUsers",
};
/** Quyền nhật ký bảo mật */
export const SecurityLogPermissions = {
	Default: "AbpAuditing.SecurityLog",
	/** Xóa */
	Delete: "AbpAuditing.SecurityLog.Delete",
};
/** Quyền phiên người dùng */
export const IdentitySessionPermissions = {
	Default: "AbpIdentity.IdentitySessions",
	/** Thu hồi */
	Revoke: "AbpIdentity.IdentitySessions.Revoke",
};
/**
/**
 * Quyền tra cứu người dùng
 * @deprecated Sau khi dịch vụ backend xóa quyền thì sẽ không thể sử dụng.
 * @todo Cần kiểm tra định nghĩa quyền của framework ABP
 */
export const UserLookupPermissions = {
	Default: "AbpIdentity.UserLookup",
};
