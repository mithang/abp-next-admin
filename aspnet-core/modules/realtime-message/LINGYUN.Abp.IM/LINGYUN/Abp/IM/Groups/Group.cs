namespace LINGYUN.Abp.IM.Groups;

public class Group
{
    /// <summary>
    /// Mã định danh nhóm
    /// </summary>
    public string Id { get; set; } = default!;
    /// <summary>
    /// Tên nhóm
    /// </summary>
    public string Name { get; set; } = default!;
    /// <summary>
    /// Ảnh đại diện nhóm
    /// </summary>
    public string? AvatarUrl { get; set; }
    /// <summary>
    /// Cho phép trò chuyện ẩn danh
    /// </summary>
    public bool AllowAnonymous { get; set; }
    /// <summary>
    /// Cho phép gửi tin nhắn
    /// </summary>
    public bool AllowSendMessage { get; set; }
    /// <summary>
    /// Số người dùng tối đa
    /// </summary>
    public int MaxUserLength { get; set; }
    /// <summary>
    /// Số người dùng trong nhóm
    /// </summary>
    public int GroupUserCount { get; set; }
}
