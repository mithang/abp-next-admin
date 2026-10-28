using JetBrains.Annotations;
using Newtonsoft.Json;
using System;
using System.Text.Json.Serialization;
using Volo.Abp;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.GroupChats.Models;
/// <summary>
/// Lọc theo chủ nhóm
/// </summary>
public class OwnerFilter
{
    /// <summary>
    /// Danh sách ID người dùng. Tối đa 100
    /// </summary>
    [NotNull]
    [JsonProperty("userid_list")]
    [JsonPropertyName("userid_list")]
    public string[] UserIdList { get; }
    public OwnerFilter(string[] userIdList)
    {
        Check.NotNullOrEmpty(userIdList, nameof(userIdList));

        if (userIdList.Length > 100)
        {
            throw new ArgumentException("The maximum number of parameters allowed for group owner filtering is only 100!");
        }

        UserIdList = userIdList;
    }
}
