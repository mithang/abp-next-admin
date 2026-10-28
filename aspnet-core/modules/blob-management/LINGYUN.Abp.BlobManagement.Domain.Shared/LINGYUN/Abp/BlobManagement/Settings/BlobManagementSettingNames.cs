namespace LINGYUN.Abp.BlobManagement.Settings;

public static class BlobManagementSettingNames
{
    public const string GroupName = "Abp.BlobManagement";
    /// <summary>
    /// Giới hạn độ dài tệp
    /// </summary>
    public const string FileLimitLength = GroupName + ".FileLimitLength";
    /// <summary>
    /// Các loại phần mở rộng tệp được phép
    /// </summary>
    public const string AllowFileExtensions = GroupName + ".AllowFileExtensions";
    /// <summary>
    /// Thời hạn hiệu lực của liên kết tải xuống tạm thời (s)
    /// </summary>
    public const string GenerateDownloadUrlExpirySeconds = GroupName + ".GenerateDownloadUrlExpirySeconds";

    public const long DefaultFileLimitLength = 5L;
    public const double DefaultGenerateDownloadUrlExpirySeconds = 600d;
    public const string DefaultAllowFileExtensions = "dll,zip,rar,txt,log,xml,config,json,jpeg,jpg,png,bmp,ico,xlsx,xltx,xls,xlt,docs,dots,doc,dot,pdf,pptx,potx,ppt,pot,chm";
}
