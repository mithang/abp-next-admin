using System;

namespace LINGYUN.Abp.IM.Contract;

public class UserFriend : UserCard
{
    /// <summary>
    /// Định danh bạn bè
    /// </summary>
    public Guid FriendId { get; set; }
    /// <summary>
    /// Đã thêm vào danh sách chặn
    /// </summary>
    public bool Black { get; set; }
    /// <summary>
    /// Quan tâm đặc biệt
    /// </summary>
    public bool SpecialFocus { get; set; }
    /// <summary>
    /// Tin nhắn không làm phiền
    /// </summary>
    public bool DontDisturb { get; set; }
    /// <summary>
    /// Tên ghi chú
    /// </summary>
    public string? RemarkName { get; set; }

    public override int GetHashCode()
    {
        return FriendId.GetHashCode();
    }

    public override bool Equals(object? obj)
    {
        if (obj == null)
        {
            return false;
        }
        if (obj is UserFriend friend)
        {
            return friend.FriendId.Equals(FriendId);
        }
        return false;
    }
}
