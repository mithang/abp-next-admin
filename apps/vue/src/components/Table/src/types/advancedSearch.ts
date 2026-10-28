/** Thuộc tính điều kiện truy vấn nâng cao */
export interface AdvanceSearchProps {
  /** Sử dụng truy vấn nâng cao */
  useAdvancedSearch?: boolean;
  /** Cho phép tìm kiếm trùng lặp trường */
  allowDuplicateFieldSearch?: boolean;
  /** api danh sách trường */
  defineFieldApi?: () => Promise<any>;
  /**
   * Danh sách trường tùy chỉnh
   * @remarks Sau khi trả về danh sách trường từ máy chủ, hàm lọc tùy chỉnh, trả về danh sách trường
   */
  defineFieldReplace?: (response: any) => DefineParamter[];
  /**
   * Trường kết quả trả về của api danh sách trường
   * @remarks Tên trường của danh sách trường trả về từ máy chủ trong cấu trúc dữ liệu, mặc định: items
  */
  listField?: string;
  /** api truy vấn nâng cao */
  fetchApi?: (...arg: any) => Promise<any>,
}

/** Tùy chọn */
export interface ParamterOption {
  /** Tên khóa */
  key: string;
  /** Giá trị khóa */
  value: any;
}

/** Trường tùy chỉnh */
export interface DefineParamter {
  /** Tên trường */
  name: string;
  /** Mô tả trường */
  description?: string;
  /** Kiểu dữ liệu (backend) */
  type: string;
  /** Kiểu dữ liệu (js) */
  javaScriptType: string;
  /** Danh sách điều kiện toán tử khả dụng, dùng để ràng buộc thêm toán tử so sánh khả dụng của trường */
  availableComparator?: DynamicComparison[];
  /** Tùy chọn */
  options: ParamterOption[];
}

/** Điều kiện kết nối */
export enum DynamicLogic {
  /** Và */
  And = 0,
  /** Hoặc */
  Or = 1
}

/** Điều kiện toán tử */
export enum DynamicComparison {
  /** Bằng */
  Equal = 0,
  /** Không bằng */
  NotEqual = 1,
  /** Nhỏ hơn */
  LessThan = 2,
  /** Nhỏ hơn hoặc bằng */
  LessThanOrEqual = 3,
  /** Lớn hơn */
  GreaterThan = 4,
  /** Lớn hơn hoặc bằng */
  GreaterThanOrEqual = 5,
  /** Chứa bên trái */
  StartsWith = 6,
  /** Không chứa bên trái */
  NotStartsWith = 7,
  /** Chứa bên phải */
  EndsWith = 8,
  /** Không chứa bên phải */
  NotEndsWith = 9,
  /** Chứa */
  Contains = 10,
  /** Không chứa */
  NotContains = 11,
  /** Rỗng */
  Null = 12,
  /** Không rỗng */
  NotNull = 13,
}

/** Trường truy vấn động */
export interface DynamicParamter {
  /** Tên trường */
  field: string;
  /** Điều kiện kết nối */
  logic: DynamicLogic;
  /** Điều kiện toán tử */
  comparison: DynamicComparison;
  /** Giá trị so sánh */
  value: any;
  /** Kiểu dữ liệu (js), chỉ dùng để chuyển đổi điều khiển nhập liệu phía frontend */
  javaScriptType?: string;
}

/** Điều kiện truy vấn động */
export interface DynamicQueryable {
  /** Danh sách tham số */
  paramters: DynamicParamter[];
}
