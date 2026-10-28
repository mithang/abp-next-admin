using System.ComponentModel.DataAnnotations;
using Volo.Abp.IdentityServer.Clients;
using Volo.Abp.Validation;

namespace LINGYUN.Abp.IdentityServer.Clients;

public class ClientCloneDto
{
    /// <summary>
    /// Định danh client
    /// </summary>
    [Required]
    [DynamicStringLength(typeof(ClientConsts), nameof(ClientConsts.ClientIdMaxLength))]
    public string ClientId { get; set; } = default!;
    /// <summary>
    /// Tên client
    /// </summary>
    [Required]
    [DynamicStringLength(typeof(ClientConsts), nameof(ClientConsts.ClientNameMaxLength))]
    public string ClientName { get; set; } = default!;
    /// <summary>
    /// Mô tả
    /// </summary>
    [DynamicStringLength(typeof(ClientConsts), nameof(ClientConsts.DescriptionMaxLength))]
    public string? Description { get; set; }
    /// <summary>
    /// Sao chép loại cấp quyền của client
    /// </summary>
    public bool CopyAllowedGrantType { get; set; }
    /// <summary>
    /// Sao chép Uri chuyển hướng của client
    /// </summary>
    public bool CopyRedirectUri { get; set; }
    /// <summary>
    /// Sao chép phạm vi của client
    /// </summary>
    public bool CopyAllowedScope { get; set; }
    /// <summary>
    /// Sao chép claim của client
    /// </summary>
    public bool CopyClaim { get; set; }
    /// <summary>
    /// Sao chép khóa bí mật của client
    /// </summary>
    public bool CopySecret { get; set; }
    /// <summary>
    /// Sao chép nguồn CORS được phép của client
    /// </summary>
    public bool CopyAllowedCorsOrigin { get; set; }
    /// <summary>
    /// Sao chép Uri chuyển hướng sau khi đăng xuất của client
    /// </summary>
    public bool CopyPostLogoutRedirectUri { get; set; }
    /// <summary>
    /// Sao chép thuộc tính của client
    /// </summary>
    public bool CopyPropertie { get; set; }
    /// <summary>
    /// Sao chép giới hạn IdP của client
    /// </summary>
    public bool CopyIdentityProviderRestriction { get; set; }
    public ClientCloneDto()
    {
        CopyAllowedCorsOrigin = true;
        CopyAllowedGrantType = true;
        CopyAllowedScope = true;
        CopyClaim = true;
        CopyIdentityProviderRestriction = true;
        CopyPostLogoutRedirectUri = true;
        CopyPropertie = true;
        CopyRedirectUri = true;
        CopySecret = true;
    }
}
