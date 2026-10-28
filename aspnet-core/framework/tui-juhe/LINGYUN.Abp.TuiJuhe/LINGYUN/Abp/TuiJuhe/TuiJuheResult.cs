using System;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.TuiJuhe;

[Serializable]
public class TuiJuheResult<TParam, TResult>
{
    /// <summary>
    /// Mã trạng thái
    /// </summary>
    [JsonPropertyName("code")]
    public int Code { get; set; }
    /// <summary>
    /// Thông báo lỗi
    /// </summary>
    [JsonPropertyName("reason")]
    public string Reason { get; set; }
    /// <summary>
    /// Dữ liệu phản hồi
    /// </summary>
    [JsonPropertyName("result")]
    public TResult Result { get; set; }
    /// <summary>
    /// Tham số phản hồi
    /// </summary>
    [JsonPropertyName("params")]
    public TParam Params { get; set; }

    [JsonIgnore]
    public bool Success => 200 == Code;

    public TuiJuheResult()
    {
    }

    public TuiJuheResult(int code, string reason)
    {
        Code = code;
        Reason = reason;
    }

    public TuiJuheResult(int code, string reason, TResult result)
    {
        Code = code;
        Reason = reason;
        Result = result;
    }

    public TResult GetData()
    {
        ThrowOfFailed();

        return Result;
    }

    public void ThrowOfFailed()
    {
        if (!Success)
        {
            throw new TuiJuheRemoteCallException(Code.ToString(), Reason);
        }
    }
}
