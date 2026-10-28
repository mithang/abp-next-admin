import type {
  ExtensibleObject,
  FullAuditedEntityDto,
  IHasConcurrencyStamp,
  IHasExtraProperties,
  PagedAndSortedResultRequestDto,
} from '@abp/core';

/** Interface đối tượng người dùng */
interface IUser {
  /** Địa chỉ email */
  email: string;
  /** Khóa đăng nhập */
  lockoutEnabled: boolean;
  /** Tên người dùng */
  name: string;
  /** Thông tin liên hệ */
  phoneNumber?: string;
  /** Tên gọi tắt người dùng */
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

/** Đối tượng truyền dữ liệu tổ chức của người dùng */
interface IdentityUserOrganizationUnitUpdateDto {
  /** Danh sách mã tổ chức */
  organizationUnitIds: string[];
}
/** Đối tượng truyền dữ liệu thực thể người dùng */
interface IdentityUserDto
  extends
    FullAuditedEntityDto<string>,
    IHasConcurrencyStamp,
    IHasExtraProperties,
    IUser {
  /** Số lần truy cập thất bại */
  accessFailedCount?: number;
  /** Email đã xác minh */
  emailConfirmed: boolean;
  /** Người dùng đã kích hoạt */
  isActive: boolean;
  /** Thời gian đổi mật khẩu lần cuối */
  lastPasswordChangeTime?: Date;
  /** Thời gian kết thúc khóa */
  lockoutEnd?: Date;
  /** Thông tin liên hệ đã xác minh */
  phoneNumberConfirmed: boolean;
  /** Danh sách vai trò */
  roleNames: string[];
  /** Mã tenant */
  tenantId?: string;
}
/** Đối tượng xem dữ liệu thực thể người dùng */
type IdentityUserVto = Omit<
  IdentityUserDto,
  'creationTime' | 'id' | 'isDeleted'
> & { creationTime?: Date; id?: string; password?: string };
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
  /** Tên gọi tắt người dùng */
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

interface UserLookupSearchInput
  extends PagedAndSortedResultRequestDto, UserLookupCountInput {}

export type {
  ChangeMyPasswordInput,
  ChangeUserPasswordInput,
  GetUserPagedListInput,
  IdentityUserCreateDto,
  IdentityUserDto,
  IdentityUserOrganizationUnitUpdateDto,
  IdentityUserUpdateDto,
  IdentityUserVto,
  UserLookupCountInput,
  UserLookupSearchInput,
};
