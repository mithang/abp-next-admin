using Newtonsoft.Json;
using System.Collections.Generic;

namespace LINGYUN.Abp.WeChat.Work.Security.Models;
public class WeChatServerDomainResponse : WeChatWorkResponse
{
    /// <summary>
    /// Danh sách tên miền
    /// </summary>
    [JsonProperty("domain_list")]
    public List<WeChatDomainModel> Domains { get; set; } = new List<WeChatDomainModel>();
    /// <summary>
    /// Danh sách IP
    /// </summary>
    [JsonProperty("ip_list")]
    public List<WeChatIpModel> Ips { get; set; } = new List<WeChatIpModel>();
    public WeChatServerDomainModel ToServerDomain()
    {
        ThrowIfNotSuccess();
        return new WeChatServerDomainModel(Domains, Ips);
    }
}
