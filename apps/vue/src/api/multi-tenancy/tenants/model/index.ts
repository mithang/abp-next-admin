/** Đối tượng lọc truy vấn tenant */
export interface TenantGetByPaged extends PagedAndSortedResultRequestDto {
    /** Trường lọc truy vấn */
    filter?: string;
  }
  
  /** Đối tượng tạo tenant */
  export interface TenantCreateOrEdit {
    /** Địa chỉ email của quản trị viên */
    adminEmailAddress: string;
    /** Mật khẩu quản trị viên */
    adminPassword: string;
    /** Tên tenant */
    name: string;
    /** Sử dụng cơ sở dữ liệu dùng chung */
    useSharedDatabase: boolean;
    /** Chuỗi kết nối mặc định */
    defaultConnectionString?: string;
  }
  
  /** Đối tượng tenant */
  export interface TenantDto extends FullAuditedEntityDto<string> {
    /** Tên tenant */
    name: string;
  }
  
  /** Chuỗi kết nối tenant */
  export interface TenantConnectionString {
    /** Tên */
    name: string;
    /** Giá trị */
    value: string;
  }
  
  export interface FindTenantResult {
    name: string;
    tenantId: string;
    success: string;
    isActive: boolean;
  }
  