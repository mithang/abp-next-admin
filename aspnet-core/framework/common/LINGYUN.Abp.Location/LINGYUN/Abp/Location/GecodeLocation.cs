using System.Collections.Generic;

namespace LINGYUN.Abp.Location;

/// <summary>
/// Địa chỉ chuẩn
/// </summary>
public class GecodeLocation : Location
{
    /// <summary>
    /// Độ chính xác tuyệt đối
    /// </summary>
    public int Confidence { get; set; }
    /// <summary>
    /// Mức độ hiểu
    /// Phạm vi điểm 0-100
    /// Điểm càng cao, mức độ dịch vụ hiểu địa chỉ càng cao
    /// </summary>
    public int Pomprehension { get; set; }
    /// <summary>
    /// Loại địa chỉ có thể hiểu chính xác
    /// </summary>
    public string? Level { get; set; }
    /// <summary>
    /// Thông tin bổ sung
    /// </summary>
    public IDictionary<string, object> Additionals { get; }

    public GecodeLocation()
    {
        Additionals = new Dictionary<string, object>();
    }

    public void AddAdditional(string key, object value)
    {
        Additionals.Add(key, value);
    }
}
