using Volo.Abp.Data;

namespace LINGYUN.Abp.TaskManagement;

public abstract class BackgroundJobActionCreateOrUpdateDto
{
    /// <summary>
    /// Có bật hay không
    /// </summary>
    public bool IsEnabled { get; set; }
    /// <summary>
    /// Tham số
    /// </summary>
    public ExtraPropertyDictionary Paramters { get; set; }

    public BackgroundJobActionCreateOrUpdateDto()
    {
        Paramters = new ExtraPropertyDictionary();
    }
}
