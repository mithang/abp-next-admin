using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.MeetingRooms.Models;
/// <summary>
/// Phạm vi sử dụng phòng họp
/// </summary>
public class MeetingRoomRange
{
    /// <summary>
    /// Danh sách userid thuộc phạm vi sử dụng phòng họp
    /// </summary>
    [NotNull]
    [JsonProperty("user_list")]
    [JsonPropertyName("user_list")]
    public string[]? UserList { get; }
    /// <summary>
    /// Danh sách id phòng ban thuộc phạm vi sử dụng phòng họp
    /// </summary>
    [NotNull]
    [JsonProperty("department_list")]
    [JsonPropertyName("department_list")]
    public int[]? DepartmentList { get; }
    public MeetingRoomRange(string[]? userList = null, int[]? departmentList = null)
    {
        UserList = userList;
        DepartmentList = departmentList;
    }
}
