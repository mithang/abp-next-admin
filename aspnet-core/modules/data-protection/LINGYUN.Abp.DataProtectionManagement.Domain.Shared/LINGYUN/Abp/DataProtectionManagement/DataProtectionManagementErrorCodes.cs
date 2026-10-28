namespace LINGYUN.Abp.DataProtectionManagement;

public static class DataProtectionManagementErrorCodes
{
    public const string Namespace = "DataProtectionManagement";

    public static class EntityTypeInfo
    {
        public const string Prefix = Namespace + ":001";
        /// <summary>
        /// Đã tồn tại định nghĩa loại thực thể có tên {Name}
        /// </summary>
        public const string DuplicateTypeInfo = Prefix + "100";
        /// <summary>
        /// Loại thực thể đã tồn tại định nghĩa thuộc tính có tên {Name}
        /// </summary>
        public const string DuplicateProperty = Prefix + "200";
        /// <summary>
        /// Thuộc tính thực thể đã tồn tại định nghĩa enum có tên {Name}
        /// </summary>
        public const string DuplicateEnum = Prefix + "300";
    }

    public static class RoleEntityRule
    {
        public const string Prefix = Namespace + ":002";
        /// <summary>
        /// Đã gán quy tắc truy cập {Operation} của thực thể {Name} cho vai trò {RoleName}!
        /// </summary>
        public const string DuplicateEntityRule = Prefix + "100";
    }

    public static class OrganizationUnitEntityRule
    {
        public const string Prefix = Namespace + ":003";
        /// <summary>
        /// Đã gán quy tắc truy cập {Operation} của thực thể {Name} cho tổ chức {OrgCode}!
        /// </summary>
        public const string DuplicateEntityRule = Prefix + "100";
    }
}
