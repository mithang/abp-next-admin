using System;

namespace LINGYUN.Abp.IM;

public class UserCard
{
    public Guid? TenantId { get; set; }

    public Guid UserId { get; set; }

    #region Hồ sơ người dùng chi tiết

    public string UserName { get; set; } = default!;
    /// <summary>
    /// Ảnh đại diện
    /// </summary>
    public string? AvatarUrl { get; set; }
    /// <summary>
    /// Biệt danh
    /// </summary>
    public string? NickName { get; set; }
    /// <summary>
    /// Tuổi
    /// </summary>
    public int Age { get; set; }
    /// <summary>
    /// Giới tính
    /// </summary>
    public Sex Sex { get; set; }
    /// <summary>
    /// Chữ ký
    /// </summary>
    public string? Sign { get; set; }
    /// <summary>
    /// Mô tả
    /// </summary>
    public string? Description { get; set; }
    /// <summary>
    /// Ngày sinh
    /// </summary>
    public DateTime? Birthday { get; set; }

    public bool Online { get; set; }

    #endregion
}
