namespace LINGYUN.Abp.LocalizationManagement;

public class AbpLocalizationManagementOptions
{
    /// <summary>
    /// Lưu văn bản bản địa hóa tĩnh vào cơ sở dữ liệu
    /// </summary>
    public bool SaveStaticLocalizationsToDatabase { get; set; } = true;
    /// <summary>
    /// Có phải nút khởi tạo bản địa hóa động hay không
    /// </summary>
    public bool IsDynamicLocalizationInitializerHost { get; set; } = false;

    public AbpLocalizationManagementOptions()
    {
    }
}
