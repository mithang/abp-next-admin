namespace LINGYUN.Abp.SystemInfo.Models;

public class SystemInfoModel
{
    /// <summary>
    /// Tập hợp trạng thái thành phần
    /// </summary>
    public ComponentInfoModel[] Components { get; set; } = default!;
}
