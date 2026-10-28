namespace LINGYUN.Abp.BlobStoring.Nexus;
public static class NexusBlobProviderConfigurationNames
{
    /// <summary>
    /// Đường dẫn cơ sở
    /// </summary>
    public const string BasePath = "Sonatype:Nexus:Raw:BasePath";
    /// <summary>
    /// Thêm tên container vào đường dẫn cơ sở
    /// </summary>
    public const string AppendContainerNameToBasePath = "Sonatype:Nexus:Raw:AppendContainerNameToBasePath";
    /// <summary>
    /// Tên kho raw của Nexus
    /// </summary>
    public const string Repository = "Sonatype:Nexus:Raw:Repository";
}
