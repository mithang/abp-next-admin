namespace LINGYUN.Abp.BlobStoring.Tencent;

public static class TencentBlobProviderConfigurationNames
{
    /// <summary>
    /// AppId
    /// </summary>
    public const string AppId = "Tencent:OSS:AppId";
    /// <summary>
    /// Khu vực
    /// </summary>
    public const string Region = "Tencent:OSS:Region";
    /// <summary>
    /// Không gian tên
    /// </summary>
    public const string BucketName = "Tencent:OSS:BucketName";
    /// <summary>
    /// Có tạo không gian tên khi chưa tồn tại hay không
    /// </summary>
    public const string CreateBucketIfNotExists = "Tencent:OSS:CreateBucketIfNotExists";
    /// <summary>
    /// Danh sách chống hotlink khi tạo không gian tên
    /// </summary>
    public const string CreateBucketReferer = "Tencent:OSS:CreateBucketReferer";
    /// <summary>
    /// Thời gian hết hạn của Uri đã ký trước (s)
    /// </summary>
    public const string PresignedGetExpirySeconds = "Tencent:OSS:PresignedGetExpirySeconds";
}
