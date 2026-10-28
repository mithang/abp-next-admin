import type {
	ExtensibleObject,
	FullAuditedEntityDto,
	IHasConcurrencyStamp,
	IHasExtraProperties,
	PagedAndSortedResultRequestDto,
} from "#/abp-core";

/** Giao diện đối tượng người dùng */
interface IUser {
	/** Địa chỉ email */
	email: string;
	/** Khóa đăng nhập */
	lockoutEnabled: boolean;
	/** Tên người dùng */
	name: string;
	/** Thông tin liên hệ */
	phoneNumber?: string;
	/** Họ người dùng */
	surname?: string;
	/** Xác thực hai yếu tố */
	twoFactorEnabled: boolean;
	/** Tài khoản người dùng */
	userName: string;
}

/** Đối tượng truyền dữ liệu đổi mật khẩu */
interface ChangeMyPasswordInput {
	/** Mật khẩu hiện tại */
	currentPassword?: string;
	/** Mật khẩu mới */
	newPassword: string;
}

interface ChangeUserPasswordInput {
	/** Mật khẩu mới */
	password: string;
}

/** Đối tượng truyền dữ liệu đơn vị tổ chức của người dùng */
interface IdentityUserOrganizationUnitUpdateDto {
	/** Danh sách mã định danh đơn vị tổ chức */
	organizationUnitIds: string[];
}
/** Đối tượng truyền dữ liệu thực thể người dùng */
interface IdentityUserDto extends FullAuditedEntityDto<string>, IUser, IHasConcurrencyStamp, IHasExtraProperties {
	[key: string]: any;
	/** Email đã được xác minh */
	emailConfirmed: boolean;
	/** Người dùng đã kích hoạt */
	isActive: boolean;
	/** Thời gian kết thúc khóa */
	lockoutEnd?: Date;
	/** Thông tin liên hệ đã được xác minh */
	phoneNumberConfirmed: boolean;
	/** Danh sách vai trò */
	roleNames: string[];
	/** Mã định danh tenant */
	tenentId?: string;
}
/** Đối tượng truyền dữ liệu tạo hoặc cập nhật thực thể người dùng */
interface IdentityUserCreateOrUpdateDto extends ExtensibleObject {
	/** Địa chỉ email */
	email: string;
	/** Khóa đăng nhập */
	lockoutEnabled: boolean;
	/** Tên người dùng */
	name: string;
	/** Mật khẩu */
	password?: string;
	/** Thông tin liên hệ */
	phoneNumber?: string;
	/** Danh sách vai trò */
	roleNames?: string[];
	/** Họ người dùng */
	surname?: string;
	/** Tài khoản người dùng */
	userName: string;
}
/** Đối tượng truyền dữ liệu lấy danh sách người dùng phân trang */
interface GetUserPagedListInput extends PagedAndSortedResultRequestDto {
	/** Điều kiện lọc */
	filter?: string;
}

type IdentityUserCreateDto = IdentityUserCreateOrUpdateDto;
type IdentityUserUpdateDto = IdentityUserCreateOrUpdateDto;

interface UserLookupCountInput {
	filter?: string;
}

interface UserLookupSearchInput extends UserLookupCountInput, PagedAndSortedResultRequestDto {}

export type {
	ChangeMyPasswordInput,
	ChangeUserPasswordInput,
	GetUserPagedListInput,
	IdentityUserCreateDto,
	IdentityUserDto,
	IdentityUserOrganizationUnitUpdateDto,
	IdentityUserUpdateDto,
	UserLookupCountInput,
	UserLookupSearchInput,
};
