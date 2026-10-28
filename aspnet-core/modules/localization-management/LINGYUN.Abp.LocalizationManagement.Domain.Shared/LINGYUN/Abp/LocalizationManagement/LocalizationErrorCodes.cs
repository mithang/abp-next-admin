namespace LINGYUN.Abp.LocalizationManagement;
public static class LocalizationErrorCodes
{
    public const string Namespace = "Localization";

    /// <summary>
    /// Mã ngôn ngữ 002
    /// </summary>
    public static class Language
    {
        public const string Prefix = Namespace + ":001";
        /// <summary>
        /// Ngôn ngữ {CultureName} đã tồn tại
        /// </summary>
        public const string NameAlreadyExists = Prefix + "100";
        /// <summary>
        /// Không tìm thấy ngôn ngữ có tên {CultureName} hoặc ngôn ngữ tích hợp sẵn không cho phép thao tác!
        /// </summary>
        public const string NameNotFoundOrStaticNotAllowed = Prefix + "400";
    }

    /// <summary>
    /// Mã tài nguyên 002
    /// </summary>
    public static class Resource
    {
        public const string Prefix = Namespace + ":002";
        /// <summary>
        /// Tài nguyên {Name} đã tồn tại
        /// </summary>
        public const string NameAlreadyExists = Prefix + "100";
        /// <summary>
        /// Không tìm thấy tài nguyên có tên {Name} hoặc tài nguyên tích hợp sẵn không cho phép thao tác!
        /// </summary>
        public const string NameNotFoundOrStaticNotAllowed = Prefix + "400";
    }
}
