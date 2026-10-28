using Elastic.Clients.Elasticsearch.IndexManagement;

namespace LINGYUN.Abp.AuditLogging.Elasticsearch;

public class AbpAuditLoggingElasticsearchOptions
{
    public const string DefaultIndexPrefix = "auditlogging";
    public string IndexPrefix { get; set; }
    /// <summary>
    /// Khoảng thời gian cuộn chỉ mục
    /// </summary>
    public RollingInterval RollingInterval { get; set; }
    /// <summary>
    /// Ném ngoại lệ khi khởi tạo chỉ mục thất bại
    /// </summary>
    /// <remarks>
    /// Mặc định: true, ứng dụng sẽ dừng chạy sau khi khởi tạo chỉ mục thất bại
    /// </remarks>
    public bool ThrowIfIndexInitFailed { get; set; }
    /// <summary>
    /// Cài đặt chỉ mục nhật ký kiểm toán
    /// </summary>
    public IndexSettings AuditLogSettings { get; set; }
    /// <summary>
    /// Cài đặt chỉ mục nhật ký bảo mật
    /// </summary>
    public IndexSettings SecurityLogSettings { get; set; }

    public AbpAuditLoggingElasticsearchOptions()
    {
        IndexPrefix = DefaultIndexPrefix;
        ThrowIfIndexInitFailed = true;
        RollingInterval = RollingInterval.Year;

        AuditLogSettings = new IndexSettings()
        {
            NumberOfReplicas = 1,
            NumberOfShards = 3,
            Mapping = new MappingLimitSettings
            {
                TotalFields = new MappingLimitSettingsTotalFields
                {
                    Limit = 1000,
                },
                NestedFields = new MappingLimitSettingsNestedFields
                {
                    Limit = 50,
                },
                Depth = new MappingLimitSettingsDepth
                {
                    Limit = 10,
                },
            }
        };

        SecurityLogSettings = new IndexSettings();
    }
}
