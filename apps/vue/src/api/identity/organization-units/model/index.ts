/** Tổ chức */
export interface OrganizationUnit extends AuditedEntityDto<string> {
    /** Định danh nút cha */
    parentId?: string;
    /** Số hiệu */
    code: string;
    /** Tên hiển thị */
    displayName: string;
  }
  
  /** Đối tượng truy vấn phân trang tổ chức */
  export interface GetOrganizationUnitPagedRequest extends PagedAndSortedResultRequestDto {
    /** Ký tự lọc */
    filter?: string;
  }
  
  /** Đối tượng tạo tổ chức */
  export interface CreateOrganizationUnit {
    /** Tên hiển thị */
    displayName: string;
    /** Định danh nút cha */
    parentId?: string;
  }
  
  /** Đối tượng thay đổi tổ chức */
  export interface UpdateOrganizationUnit {
    /** Tên hiển thị */
    displayName: string;
  }
  
  /** Đối tượng thêm phòng ban của tổ chức */
  export interface OrganizationUnitAddRole {
    /** Danh sách định danh vai trò */
    roleIds: string[];
  }
  
  /** Đối tượng thêm người dùng của tổ chức */
  export interface OrganizationUnitAddUser {
    /** Danh sách định danh người dùng */
    userIds: string[];
  }
  