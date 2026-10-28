namespace LINGYUN.Abp.TextTemplating;

public static class AbpTextTemplatingErrorCodes
{
    public const string Namespace = "TextTemplating";
    public static class TextTemplateDefinition
    {
        private const string Prefix = Namespace + ":001";

        public const string StaticTemplateNotAllowedChanged = Prefix + "010";
        /// <summary>
        /// Mẫu {Name} đã tồn tại
        /// </summary>
        public const string NameAlreadyExists = Prefix + "100";
        /// <summary>
        /// Mẫu {Name} không tồn tại!
        /// </summary>
        public const string TemplateNotFound = Prefix + "404";
    }
}
