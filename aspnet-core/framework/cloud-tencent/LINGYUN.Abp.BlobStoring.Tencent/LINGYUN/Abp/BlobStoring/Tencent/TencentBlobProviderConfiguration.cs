using System.Collections.Generic;
using Volo.Abp;
using Volo.Abp.BlobStoring;

namespace LINGYUN.Abp.BlobStoring.Tencent;

public class TencentBlobProviderConfiguration
{
    /// <summary>
    /// AppId
    /// </summary>
    public string AppId {
        get => _containerConfiguration.GetConfiguration<string>(TencentBlobProviderConfigurationNames.AppId);
        set => _containerConfiguration.SetConfiguration(TencentBlobProviderConfigurationNames.AppId, Check.NotNullOrWhiteSpace(value, nameof(value)));
    }
    /// <summary>
    /// Vùng
    /// </summary>
    public string? Region {
        get => _containerConfiguration.GetConfiguration<string>(TencentBlobProviderConfigurationNames.Region);
        set => _containerConfiguration.SetConfiguration(TencentBlobProviderConfigurationNames.Region, value);
    }
    /// <summary>
    /// Không gian tên
    /// </summary>
    public string BucketName
    {
        get => _containerConfiguration.GetConfiguration<string>(TencentBlobProviderConfigurationNames.BucketName);
        set => _containerConfiguration.SetConfiguration(TencentBlobProviderConfigurationNames.BucketName, Check.NotNullOrWhiteSpace(value, nameof(value)));
    }
    /// <summary>
    /// Có tạo không gian tên khi chưa tồn tại hay không
    /// </summary>
    public bool CreateBucketIfNotExists
    {
        get => _containerConfiguration.GetConfigurationOrDefault(TencentBlobProviderConfigurationNames.CreateBucketIfNotExists, false);
        set => _containerConfiguration.SetConfiguration(TencentBlobProviderConfigurationNames.CreateBucketIfNotExists, value);
    }
    /// <summary>
    /// Danh sách chống liên kết trộm khi tạo không gian tên
    /// </summary>
    public List<string>? CreateBucketReferer {
        get => _containerConfiguration.GetConfigurationOrDefault(TencentBlobProviderConfigurationNames.CreateBucketReferer, new List<string>());
        set {
            if (value == null)
            {
                _containerConfiguration.SetConfiguration(TencentBlobProviderConfigurationNames.CreateBucketReferer, new List<string>());
            }
            else
            {
                _containerConfiguration.SetConfiguration(TencentBlobProviderConfigurationNames.CreateBucketReferer, value);
            }
        }
    }

    /// <summary>
    /// Default value: 600.
    /// </summary>
    public int PresignedGetExpirySeconds {
        get => _containerConfiguration.GetConfigurationOrDefault(TencentBlobProviderConfigurationNames.PresignedGetExpirySeconds, _defaultExpirySeconds);
        set => _containerConfiguration.SetConfiguration(TencentBlobProviderConfigurationNames.PresignedGetExpirySeconds, value);
    }

    private int _defaultExpirySeconds = 600;

    private readonly BlobContainerConfiguration _containerConfiguration;

    public TencentBlobProviderConfiguration(BlobContainerConfiguration containerConfiguration)
    {
        _containerConfiguration = containerConfiguration;
    }
}
