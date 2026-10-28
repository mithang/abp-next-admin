import { IdentityClaim } from "../../claims/model";

/** Giao diện đối tượng người dùng */
export interface IUser {
  /** Tên người dùng */
  name: string;
  /** Tài khoản người dùng */
  userName: string;
  /** Tên rút gọn của người dùng */
  surname?: string;
  /** Địa chỉ email */
  email: string;
  /** Thông tin liên hệ */
  phoneNumber?: string;
  /** Xác thực hai yếu tố */
  twoFactorEnabled: boolean;
  /** Khóa đăng nhập */
  lockoutEnabled: boolean;
}

export interface ChangePassword {
  currentPassword?: string;
  newPassword: string;
}

export interface SetPassword {
  password: string;
}

export interface IdentityUserOrganizationUnitUpdateDto {
  organizationUnitIds: string[]
}

/** Đối tượng người dùng */
export interface User extends FullAuditedEntityDto<string>, IUser, IHasConcurrencyStamp {
  /** Mã định danh tenant */
  tenentId?: string;
  /** Email đã được xác minh */
  emailConfirmed: boolean;
  /** Thông tin liên hệ đã được xác minh */
  phoneNumberConfirmed: boolean;
  /** Thời gian kết thúc khóa */
  lockoutEnd?: Date;
  /** Người dùng đã kích hoạt */
  isActive: boolean;
  /** Danh sách vai trò */
  roleNames: string[];
}

export interface CreateOrUpdateUser extends ExtensibleObject {
   /** Tên người dùng */
   name: string;
   /** Tài khoản người dùng */
   userName: string;
   /** Tên rút gọn của người dùng */
   surname?: string;
   /** Địa chỉ email */
   email: string;
   /** Thông tin liên hệ */
   phoneNumber?: string;
   /** Khóa đăng nhập */
   lockoutEnabled: boolean;
  /** Danh sách vai trò */
  roleNames?: string[];
  /** Mật khẩu */
  password?: string;
}

/** Đối tượng người dùng cần thay đổi */
export interface UpdateUser extends CreateOrUpdateUser {}

export interface CreateUser extends CreateOrUpdateUser {}

export interface GetUserPagedRequest extends PagedAndSortedResultRequestDto {
  filter?: string;
}

export interface UserClaim extends IdentityClaim {
  id: string;
}
