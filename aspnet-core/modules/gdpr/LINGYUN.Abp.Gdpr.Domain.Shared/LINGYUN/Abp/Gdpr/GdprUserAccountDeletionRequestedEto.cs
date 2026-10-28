using System;

namespace LINGYUN.Abp.Gdpr;

/// <summary>
/// Đối tượng truyền tải sự kiện yêu cầu xóa tài khoản người dùng
/// </summary>
[Serializable]
public class GdprUserAccountDeletionRequestedEto
{
    public Guid UserId { get; set; }
}
