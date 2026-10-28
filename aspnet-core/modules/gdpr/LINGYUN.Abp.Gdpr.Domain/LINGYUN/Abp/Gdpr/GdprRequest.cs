using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using Volo.Abp.Auditing;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Guids;

namespace LINGYUN.Abp.Gdpr;

/// <summary>
/// Biểu thị yêu cầu GDPR do người dùng gửi
/// See: https://abp.io/docs/latest/modules/gdpr#gdprrequest
/// </summary>
public class GdprRequest : AggregateRoot<Guid>, IHasCreationTime
{
    ///// TODO: Mô-đun GDPR của Abp Framework không hỗ trợ đa tenant
    ///// <summary>
    ///// Id tenant
    ///// </summary>
    ///// public virtual Guid? TenantId { get; protected set; }

    /// <summary>
    /// ID của người dùng đã gửi yêu cầu
    /// </summary>
    public virtual Guid UserId { get; protected set; }
    /// <summary>
    /// Thời gian tạo
    /// </summary>
    public virtual DateTime CreationTime { get; protected set; }
    /// <summary>
    /// Thời gian kết thúc quá trình chuẩn bị dữ liệu
    /// </summary>
    public virtual DateTime ReadyTime { get; protected set; }
    /// <summary>
    /// Dữ liệu cá nhân của người dùng đã thu thập
    /// </summary>
    public virtual ICollection<GdprInfo> Infos { get; protected set; }
    protected GdprRequest()
    {
        Infos = new Collection<GdprInfo>();
    }

    public GdprRequest(
        Guid id, 
        Guid userId,
        DateTime readyTime)
      : base(id)
    {
        UserId = userId;
        ReadyTime = readyTime;
        Infos = new Collection<GdprInfo>();
    }

    public void AddData(
        IGuidGenerator guidGenerator, 
        string data, 
        string provider)
    {
        Infos.Add(
            new GdprInfo(
                guidGenerator.Create(), 
                Id, 
                data,
                provider));
    }
}
