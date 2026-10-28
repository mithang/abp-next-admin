import type {
  Clock,
  CurrentCulture,
  CurrentTenant,
  CurrentUser,
  Dictionary,
  ExtraPropertyDictionary,
  IHasExtraProperties,
  LanguageInfo,
  MultiTenancyInfo,
  NameValue,
  TimeZone,
} from './global';
/** Đối tượng truyền dữ liệu bao bọc */
interface WrapResult<T> {
  /**
   * Mã lỗi
   * @summary '0' nghĩa là bình thường
   */
  code: string;
  /** Chi tiết lỗi */
  details?: string;
  /** Thông báo lỗi */
  message: string;
  /** Dữ liệu trả về */
  result: T;
}
/** Mô tả lỗi xác thực của dịch vụ từ xa */
interface RemoteServiceValidationErrorInfo {
  /** Danh sách tên trường */
  members: string[];
  /** Thông báo lỗi */
  message: string;
}
/** Mô tả lỗi của dịch vụ từ xa (chỉ áp dụng cho proxy giao diện) */
interface RemoteServiceErrorInfo {
  /** Mã lỗi */
  code?: string;
  /** Dữ liệu ngoại lệ */
  data?: { [key: string]: any };
  /** Chi tiết lỗi */
  details?: string;
  /** Thông báo lỗi */
  message?: string;
  /** Danh sách lỗi xác thực */
  validationErrors: RemoteServiceValidationErrorInfo[];
}
/** Đối tượng truyền dữ liệu thuộc tính mở rộng */
interface ExtensibleObject {
  /** Thuộc tính mở rộng */
  extraProperties: ExtraPropertyDictionary;
}
/** Đối tượng truyền dữ liệu thực thể */
interface EntityDto<TPrimaryKey> {
  /** Định danh thực thể */
  id: TPrimaryKey;
}
/** Đối tượng truyền dữ liệu thuộc tính tạo mới thực thể */
interface CreationAuditedEntityDto<TPrimaryKey> extends EntityDto<TPrimaryKey> {
  /** Thời gian tạo */
  creationTime: Date;
  /** Định danh người tạo */
  creatorId?: string;
}
/** Đối tượng truyền dữ liệu thuộc tính tạo mới người dùng thực thể */
interface CreationAuditedEntityWithUserDto<
  TPrimaryKey,
  TUserDto,
> extends CreationAuditedEntityDto<TPrimaryKey> {
  /** Đối tượng truyền dữ liệu thực thể người tạo */
  creator: TUserDto;
}
/** Đối tượng truyền dữ liệu thuộc tính kiểm tra thực thể */
interface AuditedEntityDto<
  TPrimaryKey,
> extends CreationAuditedEntityDto<TPrimaryKey> {
  /** Thời gian thay đổi lần cuối */
  lastModificationTime?: Date;
  /** Người thay đổi lần cuối */
  lastModifierId?: string;
}
/** Đối tượng truyền dữ liệu thuộc tính kiểm tra người dùng thực thể */
interface AuditedEntityWithUserDto<
  TPrimaryKey,
  TUserDto,
> extends AuditedEntityDto<TPrimaryKey> {
  /** Đối tượng truyền dữ liệu thực thể người tạo */
  creator: TUserDto;
  /** Đối tượng truyền dữ liệu thực thể người thay đổi */
  lastModifier: TUserDto;
}
/** Đối tượng truyền dữ liệu toàn bộ thuộc tính kiểm tra thực thể */
interface FullAuditedEntityDto<
  TPrimaryKey,
> extends AuditedEntityDto<TPrimaryKey> {
  /** Định danh người xóa */
  deleterId?: string;
  /** Thời gian xóa */
  deletionTime?: Date;
  /** Đã xóa hay chưa */
  isDeleted: boolean;
}
/** Đối tượng truyền dữ liệu toàn bộ thuộc tính kiểm tra người dùng thực thể */
interface FullAuditedEntityWithUserDto<TPrimaryKey, TUserDto>
  extends
    AuditedEntityWithUserDto<TPrimaryKey, TUserDto>,
    FullAuditedEntityDto<TPrimaryKey> {
  /** Đối tượng truyền dữ liệu thực thể người xóa */
  deleter: TUserDto;
}
/** Đối tượng truyền dữ liệu thuộc tính mở rộng thực thể */
interface ExtensibleEntityDto<TKey> extends EntityDto<TKey>, ExtensibleObject {}
/** Đối tượng truyền dữ liệu thuộc tính mở rộng tạo mới thực thể */
interface ExtensibleCreationAuditedEntityDto<TPrimaryKey>
  extends
    CreationAuditedEntityDto<TPrimaryKey>,
    ExtensibleEntityDto<TPrimaryKey> {}
/** Đối tượng truyền dữ liệu thuộc tính mở rộng tạo mới người dùng thực thể */
interface ExtensibleCreationAuditedEntityWithUserDto<TPrimaryKey, TUserDto>
  extends
    CreationAuditedEntityWithUserDto<TPrimaryKey, TUserDto>,
    ExtensibleEntityDto<TPrimaryKey> {}
/** Đối tượng truyền dữ liệu thuộc tính mở rộng kiểm tra thực thể */
interface ExtensibleAuditedEntityDto<TPrimaryKey>
  extends AuditedEntityDto<TPrimaryKey>, ExtensibleEntityDto<TPrimaryKey> {}
/** Đối tượng truyền dữ liệu thuộc tính mở rộng kiểm tra người dùng thực thể */
interface ExtensibleAuditedEntityWithUserDto<TPrimaryKey, TUserDto>
  extends
    AuditedEntityWithUserDto<TPrimaryKey, TUserDto>,
    ExtensibleEntityDto<TPrimaryKey> {}
/** Đối tượng truyền dữ liệu thuộc tính mở rộng kiểm tra toàn bộ thực thể */
interface ExtensibleFullAuditedEntityDto<TPrimaryKey>
  extends ExtensibleEntityDto<TPrimaryKey>, FullAuditedEntityDto<TPrimaryKey> {}
/** Đối tượng truyền dữ liệu thuộc tính mở rộng kiểm tra toàn bộ người dùng thực thể */
interface ExtensibleFullAuditedEntityWithUserDto<TPrimaryKey, TUserDto>
  extends
    ExtensibleEntityDto<TPrimaryKey>,
    FullAuditedEntityWithUserDto<TPrimaryKey, TUserDto> {}
/** Đối tượng truyền dữ liệu yêu cầu tối đa */
interface LimitedResultRequestDto {
  /** Kích thước dữ liệu trả về tối đa */
  maxResultCount?: number;
}
/** Đối tượng truyền dữ liệu mở rộng yêu cầu tối đa */
interface ExtensibleLimitedResultRequestDto
  extends ExtensibleObject, LimitedResultRequestDto {}
/** Đối tượng truyền dữ liệu yêu cầu sắp xếp */
interface SortedResultRequest {
  /** Trường sắp xếp
   * @summary Tăng dần: tên trường + asc; giảm dần: tên trường + desc
   * @example fieldA asc
   * @example fieldB desc
   */
  sorting?: string;
}
/** Đối tượng truyền dữ liệu yêu cầu phân trang */
interface PagedResultRequestDto extends LimitedResultRequestDto {
  /**
   * Kích thước dữ liệu bỏ qua
   * @summary Kích thước dữ liệu bỏ qua khi phân trang, cách tính: (trang hiện tại - 1) * kết quả trả về tối đa, không được nhỏ hơn 0
   * @example (pageNum - 1) * pageSize
   */
  skipCount?: number;
}
/** Đối tượng truyền dữ liệu yêu cầu sắp xếp phân trang */
interface PagedAndSortedResultRequestDto
  extends PagedResultRequestDto, SortedResultRequest {}
/** Đối tượng truyền dữ liệu mở rộng yêu cầu sắp xếp phân trang */
interface ExtensiblePagedAndSortedResultRequestDto
  extends ExtensibleObject, PagedAndSortedResultRequestDto {}
/** Đối tượng truyền dữ liệu danh sách */
interface ListResultDto<T> {
  /** Danh sách mục trả về */
  items: T[];
}
/** Đối tượng truyền dữ liệu mở rộng danh sách */
interface ExtensibleListResultDto<T>
  extends ExtensibleObject, ListResultDto<T> {}
/** Đối tượng truyền dữ liệu danh sách phân trang */
interface PagedResultDto<T> extends ListResultDto<T> {
  /** Số lượng tối đa thỏa điều kiện */
  totalCount: number;
}
/** Đối tượng truyền dữ liệu mở rộng danh sách phân trang */
interface ExtensiblePagedResultDto<T>
  extends ExtensibleObject, PagedResultDto<T> {}
/** Đối tượng truyền dữ liệu mở rộng danh sách phân trang */
interface ExtensiblePagedResultRequestDto
  extends ExtensibleObject, PagedResultRequestDto {}
/** Đối tượng truyền dữ liệu tài nguyên bản địa hóa ứng dụng */
interface ApplicationLocalizationResourceDto {
  /** Danh sách tên tài nguyên kế thừa */
  baseResources: string[];
  /** Danh sách từ điển văn bản bản địa hóa */
  texts: Dictionary<string, string>;
}
/** Đối tượng truyền dữ liệu bản địa hóa ứng dụng */
interface ApplicationLocalizationDto {
  /** Ngôn ngữ hiện tại */
  currentCulture: CurrentCulture;
  /** Danh sách từ điển tài nguyên */
  resources: Dictionary<string, ApplicationLocalizationResourceDto>;
}
/** Đối tượng truyền dữ liệu cấu hình bản địa hóa ứng dụng */
interface ApplicationLocalizationConfigurationDto {
  /** Ngôn ngữ hiện tại */
  currentCulture: CurrentCulture;
  /** Tên tài nguyên bản địa hóa mặc định */
  defaultResourceName: string;
  /** Ánh xạ cấu hình tệp đa ngôn ngữ (chỉ phía backend) */
  languageFilesMap: Dictionary<string, NameValue<any>[]>;
  /** Danh sách đa ngôn ngữ được hỗ trợ */
  languages: LanguageInfo[];
  /** Ánh xạ tài nguyên đa ngôn ngữ (chỉ phía backend) */
  languagesMap: Dictionary<string, NameValue<any>[]>;
  /** Danh sách từ điển tài nguyên bản địa hóa */
  resources: Dictionary<string, ApplicationLocalizationResourceDto>;
  /** Danh sách từ điển văn bản tài nguyên bản địa hóa */
  values: Dictionary<string, Dictionary<string, string>>;
}
/** Đối tượng truyền dữ liệu ủy quyền ứng dụng */
interface ApplicationAuthConfigurationDto {
  /** Danh sách từ điển đã ủy quyền */
  grantedPolicies: Dictionary<string, boolean>;
}
/** Đối tượng truyền dữ liệu cài đặt ứng dụng */
interface ApplicationSettingConfigurationDto {
  /** Danh sách từ điển giá trị cài đặt */
  values: Dictionary<string, string>;
}
/** Đối tượng truyền dữ liệu tính năng ứng dụng */
interface ApplicationFeatureConfigurationDto {
  /** Danh sách từ điển giá trị tính năng */
  values: Dictionary<string, string>;
}
/** Đối tượng truyền dữ liệu tính năng toàn cục ứng dụng */
interface ApplicationGlobalFeatureConfigurationDto {
  /** Danh sách tên tính năng đã bật */
  enabledFeatures: string[];
}
/** Đối tượng truyền dữ liệu múi giờ ứng dụng */
interface TimingDto {
  /** Định nghĩa cấu hình múi giờ */
  timeZone: TimeZone;
}
/** Đối tượng dữ liệu văn bản bản địa hóa */
interface LocalizableStringDto {
  /** Tên văn bản */
  name: string;
  /** Tên tài nguyên */
  resource?: string;
}
/** Thuộc tính mở rộng (dùng cho proxy yêu cầu, bỏ qua) */
interface ExtensionPropertyApiGetDto {
  isAvailable: boolean;
}
/** Thuộc tính mở rộng (dùng cho proxy yêu cầu, bỏ qua) */
interface ExtensionPropertyApiCreateDto {
  isAvailable: boolean;
}
/** Thuộc tính mở rộng (dùng cho proxy yêu cầu, bỏ qua) */
interface ExtensionPropertyApiUpdateDto {
  isAvailable: boolean;
}
/** Thuộc tính mở rộng (dùng cho proxy yêu cầu, bỏ qua) */
interface ExtensionPropertyUiTableDto {
  isAvailable: boolean;
}
/** Thuộc tính mở rộng (dùng cho proxy yêu cầu, bỏ qua) */
interface ExtensionPropertyUiFormDto {
  isAvailable: boolean;
}
/** Thuộc tính mở rộng (dùng cho proxy yêu cầu, bỏ qua) */
interface ExtensionPropertyUiLookupDto {
  displayPropertyName: string;
  filterParamName: string;
  resultListPropertyName: string;
  url: string;
  valuePropertyName: string;
}
/** Thuộc tính mở rộng (dùng cho proxy yêu cầu, bỏ qua) */
interface ExtensionPropertyApiDto {
  onCreate: ExtensionPropertyApiCreateDto;
  onGet: ExtensionPropertyApiGetDto;
  onUpdate: ExtensionPropertyApiUpdateDto;
}
/** Thuộc tính mở rộng (dùng cho proxy yêu cầu, bỏ qua) */
interface ExtensionPropertyUiDto {
  lookup: ExtensionPropertyUiLookupDto;
  onCreateForm: ExtensionPropertyUiFormDto;
  onEditForm: ExtensionPropertyUiFormDto;
  onTable: ExtensionPropertyUiTableDto;
}
/** Thuộc tính mở rộng (dùng cho proxy yêu cầu, bỏ qua) */
interface ExtensionPropertyAttributeDto {
  config: Dictionary<string, any>;
  typeSimple: string;
}
/** Thuộc tính mở rộng (dùng cho proxy yêu cầu, bỏ qua) */
interface ExtensionPropertyDto {
  api: ExtensionPropertyApiDto;
  attributes: ExtensionPropertyAttributeDto[];
  configuration: Dictionary<string, any>;
  defaultValue: any;
  displayName?: LocalizableStringDto;
  type: string;
  typeSimple: string;
  ui: ExtensionPropertyUiDto;
}
/** Thuộc tính mở rộng (dùng cho proxy yêu cầu, bỏ qua) */
interface EntityExtensionDto {
  configuration: Dictionary<string, any>;
  properties: Dictionary<string, ExtensionPropertyDto>;
}
/** Thuộc tính mở rộng (dùng cho proxy yêu cầu, bỏ qua) */
interface ModuleExtensionDto {
  configuration: Dictionary<string, any>;
  entities: Dictionary<string, EntityExtensionDto>;
}
/** Thuộc tính mở rộng (dùng cho proxy yêu cầu, bỏ qua) */
interface ExtensionEnumFieldDto {
  name: string;
  value: any;
}
/** Thuộc tính mở rộng (dùng cho proxy yêu cầu, bỏ qua) */
interface ExtensionEnumDto {
  fields: ExtensionEnumFieldDto[];
  localizationResource: string;
}
/** Thuộc tính mở rộng (dùng cho proxy yêu cầu, bỏ qua) */
interface ObjectExtensionsDto {
  enums: Dictionary<string, ExtensionEnumDto>;
  modules: Dictionary<string, ModuleExtensionDto>;
}
/** Đối tượng truyền dữ liệu cấu hình ứng dụng */
interface ApplicationConfigurationDto extends IHasExtraProperties {
  /** Cấu hình ủy quyền */
  auth: ApplicationAuthConfigurationDto;
  /** Cấu hình đồng hồ */
  clock: Clock;
  /** Tenant hiện tại */
  currentTenant: CurrentTenant;
  /** Người dùng hiện tại */
  currentUser: CurrentUser;
  /** Cấu hình tính năng */
  features: ApplicationFeatureConfigurationDto;
  /** Cấu hình tính năng toàn cục */
  globalFeatures: ApplicationGlobalFeatureConfigurationDto;
  /** Cấu hình bản địa hóa */
  localization: ApplicationLocalizationConfigurationDto;
  /** Cấu hình đa tenant */
  multiTenancy: MultiTenancyInfo;
  /** Cấu hình mở rộng đối tượng thực thể */
  objectExtensions: ObjectExtensionsDto;
  /** Cài đặt hệ thống */
  setting: ApplicationSettingConfigurationDto;
  // timing: Timing;
}

export type {
  ApplicationAuthConfigurationDto,
  ApplicationConfigurationDto,
  ApplicationFeatureConfigurationDto,
  ApplicationGlobalFeatureConfigurationDto,
  ApplicationLocalizationConfigurationDto,
  ApplicationLocalizationDto,
  ApplicationLocalizationResourceDto,
  ApplicationSettingConfigurationDto,
  AuditedEntityDto,
  AuditedEntityWithUserDto,
  CreationAuditedEntityDto,
  CreationAuditedEntityWithUserDto,
  EntityDto,
  EntityExtensionDto,
  ExtensibleAuditedEntityDto,
  ExtensibleAuditedEntityWithUserDto,
  ExtensibleCreationAuditedEntityDto,
  ExtensibleCreationAuditedEntityWithUserDto,
  ExtensibleEntityDto,
  ExtensibleFullAuditedEntityDto,
  ExtensibleFullAuditedEntityWithUserDto,
  ExtensibleLimitedResultRequestDto,
  ExtensibleListResultDto,
  ExtensibleObject,
  ExtensiblePagedAndSortedResultRequestDto,
  ExtensiblePagedResultDto,
  ExtensiblePagedResultRequestDto,
  ExtensionEnumDto,
  ExtensionEnumFieldDto,
  ExtensionPropertyApiCreateDto,
  ExtensionPropertyApiDto,
  ExtensionPropertyApiGetDto,
  ExtensionPropertyApiUpdateDto,
  ExtensionPropertyAttributeDto,
  ExtensionPropertyDto,
  ExtensionPropertyUiDto,
  ExtensionPropertyUiFormDto,
  ExtensionPropertyUiLookupDto,
  ExtensionPropertyUiTableDto,
  FullAuditedEntityDto,
  FullAuditedEntityWithUserDto,
  LimitedResultRequestDto,
  ListResultDto,
  LocalizableStringDto,
  ModuleExtensionDto,
  NameValue,
  ObjectExtensionsDto,
  PagedAndSortedResultRequestDto,
  PagedResultDto,
  PagedResultRequestDto,
  RemoteServiceErrorInfo,
  SortedResultRequest,
  TimingDto,
  WrapResult,
};
