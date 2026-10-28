namespace LINGYUN.Abp.Idempotent;
public class AbpIdempotentOptions
{
    public bool IsEnabled { get; set; }
    public int DefaultTimeout { get; set; }
    public string IdempotentTokenName { get; set; }
    public int HttpStatusCode { get; set; }
    public AbpIdempotentOptions()
    {
        DefaultTimeout = 5000;
        IdempotentTokenName = "X-With-Idempotent-Token";
        // Mặc định dùng mã TooManyRequests (429)
        HttpStatusCode = 429;
    }
}
