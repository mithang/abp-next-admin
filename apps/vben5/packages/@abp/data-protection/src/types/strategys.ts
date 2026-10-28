/** Chiến lược truy cập dữ liệu */
enum DataAccessStrategy {
  /** Có thể truy cập tất cả dữ liệu */
  All = 0,
  /** Chỉ tổ chức của người dùng hiện tại và các tổ chức cấp dưới */
  CurrentAndSubOrganizationUnits = 5,
  /** Chỉ tổ chức của người dùng hiện tại */
  CurrentOrganizationUnits = 4,
  /** Chỉ vai trò của người dùng hiện tại */
  CurrentRoles = 3,
  /** Chỉ người dùng hiện tại */
  CurrentUser = 2,
  /** Quy tắc tùy chỉnh */
  Custom = 1,
}

interface SubjectStrategyGetInput {
  subjectId: string;
  subjectName: string;
}

interface SubjectStrategySetInput {
  isEnabled: boolean;
  strategy: DataAccessStrategy;
  subjectId: string;
  subjectName: string;
}

interface SubjectStrategyDto {
  isEnabled: boolean;
  strategy: DataAccessStrategy;
  subjectId: string;
  subjectName: string;
}

export { DataAccessStrategy };

export type {
  SubjectStrategyDto,
  SubjectStrategyGetInput,
  SubjectStrategySetInput,
};
