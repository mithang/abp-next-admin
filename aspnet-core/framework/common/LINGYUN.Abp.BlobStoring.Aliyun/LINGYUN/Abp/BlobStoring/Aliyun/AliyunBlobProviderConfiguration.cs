using AlibabaCloud.OSS.V2.Models;
using System.Collections.Generic;
using Volo.Abp.BlobStoring;

namespace LINGYUN.Abp.BlobStoring.Aliyun;

public class AliyunBlobProviderConfiguration
{
    /// <summary>
    /// Phiên bản chữ ký mặc định
    /// </summary>
    public const string DefaultSignatureVersion = "v1"; //TODO: Alibaba Cloud OSS SDKv2 SignerV4.ResourcePath có khiếm khuyết, tạm thời dùng chữ ký v1
    /// <summary>
    /// Mặc định bỏ qua xác thực chứng chỉ máy chủ
    /// </summary>
    public const bool DefaultInsecureSkipVerify = false;
    /// <summary>
    /// Mặc định có tạo namespace khi chưa tồn tại hay không
    /// </summary>
    public const bool DefaultCreateBucketIfNotExists = false;
    /// <summary>
    /// Thời gian hết hạn mặc định của liên kết presigned
    /// </summary>
    public const int DefaultPresignedGetExpirySeconds = 600;
    /// <summary>
    /// Namespace
    /// </summary>
    public string BucketName
    {
        get => _containerConfiguration.GetConfiguration<string>(AliyunBlobProviderConfigurationNames.BucketName);
        set => _containerConfiguration.SetConfiguration(AliyunBlobProviderConfigurationNames.BucketName, value);
    }
    /// <summary>
    /// Phiên bản chữ ký (tùy chọn: v1, v4)
    /// Mặc định: v1
    /// </summary>
    public string? SignatureVersion {
        get => _containerConfiguration.GetConfigurationOrDefault(AliyunBlobProviderConfigurationNames.SignatureVersion, DefaultSignatureVersion);
        set => _containerConfiguration.SetConfiguration(AliyunBlobProviderConfigurationNames.SignatureVersion, value);
    }
    /// <summary>
    /// Bỏ qua xác thực chứng chỉ máy chủ
    /// </summary>
    public bool InsecureSkipVerify {
        get => _containerConfiguration.GetConfigurationOrDefault(AliyunBlobProviderConfigurationNames.InsecureSkipVerify, DefaultInsecureSkipVerify);
        set => _containerConfiguration.SetConfiguration(AliyunBlobProviderConfigurationNames.InsecureSkipVerify, value);
    }
    /// <summary>
    /// Có tạo namespace khi chưa tồn tại hay không
    /// </summary>
    public bool CreateBucketIfNotExists
    {
        get => _containerConfiguration.GetConfigurationOrDefault(AliyunBlobProviderConfigurationNames.CreateBucketIfNotExists, DefaultCreateBucketIfNotExists);
        set => _containerConfiguration.SetConfiguration(AliyunBlobProviderConfigurationNames.CreateBucketIfNotExists, value);
    }
    /// <summary>
    /// Acl khi tạo namespace
    /// </summary>
    public BucketAclType? CreateBucketAcl {
        get => _containerConfiguration.GetConfigurationOrDefault<BucketAclType?>(AliyunBlobProviderConfigurationNames.CreateBucketAcl);
        set => _containerConfiguration.SetConfiguration(AliyunBlobProviderConfigurationNames.CreateBucketAcl, value);
    }
    /// <summary>
    /// Danh sách chống hotlink khi tạo namespace
    /// </summary>
    public List<string>? CreateBucketReferer
    {
        get => _containerConfiguration.GetConfigurationOrDefault(AliyunBlobProviderConfigurationNames.CreateBucketReferer, new List<string>());
        set
        {
            if (value == null)
            {
                _containerConfiguration.SetConfiguration(AliyunBlobProviderConfigurationNames.CreateBucketReferer, new List<string>());
            }
            else
            {
                _containerConfiguration.SetConfiguration(AliyunBlobProviderConfigurationNames.CreateBucketReferer, value);
            }
        }
    }


    public int PresignedGetExpirySeconds {
        get => _containerConfiguration.GetConfigurationOrDefault(AliyunBlobProviderConfigurationNames.PresignedGetExpirySeconds, DefaultPresignedGetExpirySeconds);
        set => _containerConfiguration.SetConfiguration(AliyunBlobProviderConfigurationNames.PresignedGetExpirySeconds, value);
    }

    public string? Endpoint {
        get => _containerConfiguration.GetConfigurationOrDefault<string>(AliyunBlobProviderConfigurationNames.Endpoint, null);
        set => _containerConfiguration.SetConfiguration(AliyunBlobProviderConfigurationNames.Endpoint, value);
    }
    public bool? UsePathStyle {
        get => _containerConfiguration.GetConfigurationOrDefault<bool?>(AliyunBlobProviderConfigurationNames.UsePathStyle, null);
        set => _containerConfiguration.SetConfiguration(AliyunBlobProviderConfigurationNames.UsePathStyle, value);
    }
    public bool? UseCName {
        get => _containerConfiguration.GetConfigurationOrDefault<bool?>(AliyunBlobProviderConfigurationNames.UseCName, null);
        set => _containerConfiguration.SetConfiguration(AliyunBlobProviderConfigurationNames.UseCName, value);
    }
    public bool? UseDualStackEndpoint {
        get => _containerConfiguration.GetConfigurationOrDefault<bool?>(AliyunBlobProviderConfigurationNames.UseDualStackEndpoint, null);
        set => _containerConfiguration.SetConfiguration(AliyunBlobProviderConfigurationNames.UseDualStackEndpoint, value);
    }
    public bool? UseAccelerateEndpoint {
        get => _containerConfiguration.GetConfigurationOrDefault<bool?>(AliyunBlobProviderConfigurationNames.UseAccelerateEndpoint, null);
        set => _containerConfiguration.SetConfiguration(AliyunBlobProviderConfigurationNames.UseAccelerateEndpoint, value);
    }
    public bool? UseInternalEndpoint {
        get => _containerConfiguration.GetConfigurationOrDefault<bool?>(AliyunBlobProviderConfigurationNames.UseInternalEndpoint, null);
        set => _containerConfiguration.SetConfiguration(AliyunBlobProviderConfigurationNames.UseInternalEndpoint, value);
    }
    public bool? DisableUploadCrc64Check {
        get => _containerConfiguration.GetConfigurationOrDefault<bool?>(AliyunBlobProviderConfigurationNames.DisableUploadCrc64Check, null);
        set => _containerConfiguration.SetConfiguration(AliyunBlobProviderConfigurationNames.DisableUploadCrc64Check, value);
    }
    public bool? DisableDownloadCrc64Check {
        get => _containerConfiguration.GetConfigurationOrDefault<bool?>(AliyunBlobProviderConfigurationNames.DisableDownloadCrc64Check, null);
        set => _containerConfiguration.SetConfiguration(AliyunBlobProviderConfigurationNames.DisableDownloadCrc64Check, value);
    }

    private readonly BlobContainerConfiguration _containerConfiguration;

    public AliyunBlobProviderConfiguration(BlobContainerConfiguration containerConfiguration)
    {
        _containerConfiguration = containerConfiguration;
    }
}
