namespace LINGYUN.Abp.BlobStoring.Aliyun;

public static class AliyunBlobProviderConfigurationNames
{
    /// <summary>
    /// Trung tâm dữ liệu
    /// </summary>
    public const string Endpoint = "Aliyun:OSS:Endpoint";
    /// <summary>
    /// Không gian tên
    /// </summary>
    public const string BucketName = "Aliyun:OSS:BucketName";
    /// <summary>
    /// Phiên bản chữ ký (tùy chọn: v1, v4)
    /// </summary>
    public const string SignatureVersion = "Aliyun:OSS:SignatureVersion";
    /// <summary>
    /// Bỏ qua việc xác thực chứng chỉ máy chủ
    /// </summary>
    public const string InsecureSkipVerify = "Aliyun:OSS:InsecureSkipVerify";
    /// <summary>
    /// Có tạo không gian tên hay không khi không gian tên chưa tồn tại
    /// </summary>
    public const string CreateBucketIfNotExists = "Aliyun:OSS:CreateBucketIfNotExists";
    /// <summary>
    /// Danh sách chống liên kết trộm khi tạo không gian tên
    /// </summary>
    public const string CreateBucketReferer = "Aliyun:OSS:CreateBucketReferer";
    /// <summary>
    /// Acl khi tạo không gian tên
    /// </summary>
    public const string CreateBucketAcl = "Aliyun:OSS:CreateBucketAcl"; 
    /// <summary>
    /// Thời gian hết hạn (giây) của Uri ký trước khi tạo
    /// </summary>
    public const string PresignedGetExpirySeconds = "Aliyun:OSS:PresignedGetExpirySeconds";

    public const string UsePathStyle = "Aliyun:OSS:UsePathStyle";
    public const string UseCName = "Aliyun:OSS:UseCName";
    public const string UseDualStackEndpoint = "Aliyun:OSS:UseDualStackEndpoint";
    public const string UseAccelerateEndpoint = "Aliyun:OSS:UseAccelerateEndpoint";
    public const string UseInternalEndpoint = "Aliyun:OSS:UseInternalEndpoint";
    public const string DisableUploadCrc64Check = "Aliyun:OSS:DisableUploadCrc64Check";
    public const string DisableDownloadCrc64Check = "Aliyun:OSS:DisableDownloadCrc64Check";
}
