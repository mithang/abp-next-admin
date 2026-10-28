using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities;

namespace LINGYUN.Abp.Gdpr;

/// <summary>
/// Biểu thị dữ liệu cá nhân của người dùng
/// See: https://abp.io/docs/latest/modules/gdpr#gdprinfo
/// </summary>
public class GdprInfo : Entity<Guid>
{
    /// <summary>
    /// ID của yêu cầu GDPR
    /// </summary>
    public virtual Guid RequestId { get; protected set; }

    /// <summary>
    /// Dùng để lưu trữ dữ liệu cá nhân
    /// </summary>
    public virtual string Data { get; protected set; } = default!;

    /// <summary>
    /// Biểu thị module thu thập dữ liệu cá nhân
    /// </summary>
    public virtual string Provider { get; protected set; } = default!;

    protected GdprInfo()
    {
    }

    public GdprInfo(
        Guid id,
        Guid requestId,
        string data, 
        string provider)
      : base(id)
    {
        RequestId = requestId;
        Data = Check.NotNullOrWhiteSpace(data, nameof(data));
        Provider = Check.NotNullOrWhiteSpace(provider, nameof(provider), GdprInfoConsts.MaxProviderLength);
    }
}
