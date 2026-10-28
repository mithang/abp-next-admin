using Newtonsoft.Json;
using System;

namespace LINGYUN.Abp.WxPusher;

[Serializable]
public class WxPusherResult<T>
{
    /// <summary>
    /// Mã trạng thái
    /// </summary>
    [JsonProperty("code")]
    public int Code { get; set; }
    /// <summary>
    /// Thông báo lỗi
    /// </summary>
    [JsonProperty("msg")]
    public string? Message { get; set; }
    /// <summary>
    /// Dữ liệu trả về
    /// </summary>
    [JsonProperty("data")]
    public T? Data { get; set; }
    /// <summary>
    /// Có gọi thành công hay không
    /// </summary>
    [JsonProperty("success")] 
    public bool Success { get; set; }

    public WxPusherResult()
    {
    }

    public WxPusherResult(int code, string message)
    {
        Code = code;
        Message = message;
    }

    public WxPusherResult(int code, string message, T data)
    {
        Code = code;
        Message = message;
        Data = data;
    }

    public T GetData()
    {
        ThrowOfFailed();

        return Data!;
    }

    public void ThrowOfFailed()
    {
        if (!Success)
        {
            throw new WxPusherRemoteCallException(Code.ToString(), Message!);
        }
    }
}
