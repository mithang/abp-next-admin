using System;
using System.Collections.Generic;

namespace LINGYUN.Abp.Gdpr;
/// <summary>
/// Tùy chọn AbpGdpr
/// See: https://abp.io/docs/latest/modules/gdpr#abpgdproptions
/// </summary>
public class AbpGdprOptions
{
    /// <summary>
    /// Dùng để chỉ định khoảng thời gian cho phép giữa các yêu cầu.<br />
    /// Nếu muốn tăng hoặc giảm khoảng thời gian giữa các yêu cầu dữ liệu cá nhân, có thể cấu hình thuộc tính này.<br />
    /// Theo mặc định, người dùng có thể yêu cầu dữ liệu cá nhân của mình một lần mỗi ngày<br />
    /// Giá trị mặc định: 1 ngày
    /// </summary>
    public TimeSpan RequestTimeInterval { get; set; }
    /// <summary>
    /// Vì mô-đun GDPR được thiết kế để hỗ trợ giải pháp phân tán, nên việc thu thập và chuẩn bị dữ liệu cá nhân sẽ cần một khoảng thời gian nhất định.
    /// Nếu muốn tăng hoặc giảm thời gian chuẩn bị dữ liệu tùy theo quy mô của ứng dụng, có thể cấu hình thuộc tính này.<br />
    /// Giá trị mặc định: 60 phút
    /// </summary>
    public TimeSpan MinutesForDataPreparation { get; set; }
    /// <summary>
    /// Danh sách nhà cung cấp dữ liệu người dùng
    /// </summary>
    public IList<IGdprUserDataProvider> GdprUserDataProviders { get; }
    /// <summary>
    /// Danh sách nhà cung cấp tài khoản người dùng
    /// </summary>
    public IList<IGdprUserAccountProvider> GdprUserAccountProviders { get; }
    public AbpGdprOptions()
    {
        RequestTimeInterval = TimeSpan.FromDays(1);
        MinutesForDataPreparation = TimeSpan.FromMinutes(60);

        GdprUserDataProviders = new List<IGdprUserDataProvider>();
        GdprUserAccountProviders = new List<IGdprUserAccountProvider>();
    }
}
