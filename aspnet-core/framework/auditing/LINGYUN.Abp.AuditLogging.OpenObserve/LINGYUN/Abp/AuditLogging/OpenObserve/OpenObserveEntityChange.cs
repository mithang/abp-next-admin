using System;
using System.Text.Json.Serialization;
using Volo.Abp.Data;

namespace LINGYUN.Abp.AuditLogging.OpenObserve;

/// <summary>
/// Bản ghi thay đổi thực thể đã làm phẳng (ghi vào luồng dữ liệu thay đổi thực thể của OpenObserve)
/// </summary>
/// <remarks>
/// Đối tượng dữ liệu thuần túy, không chứa logic tuần tự hóa (xem <see cref="OpenObserveEntityChangeConverter"/>);
/// Vì OpenObserve lưu mảng lồng nhau dưới dạng cột chuỗi JSON,
/// <see cref="EntityChange.PropertyChanges"/> được lưu dưới dạng chuỗi JSON
/// </remarks>
public class OpenObserveEntityChange
{
    /// <summary>
    /// Thời gian tài liệu OpenObserve (micro giây)
    /// </summary>
    /// <remarks>
    /// Được <see cref="EntityChange.ChangeTime"/> ghi đè; khi là null sẽ dùng thời gian ghi của phía máy chủ
    /// </remarks>
    [JsonPropertyName("_timestamp")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public long? Timestamp { get; set; }

    public Guid Id { get; set; }

    public Guid AuditLogId { get; set; }

    public Guid? TenantId { get; set; }

    public Guid? EntityTenantId { get; set; }

    public DateTime ChangeTime { get; set; }

    /// <summary>
    /// Loại thay đổi (tên của <see cref="EntityChangeType"/>)
    /// </summary>
    public string ChangeType { get; set; }

    public string? EntityId { get; set; }

    public string? EntityTypeFullName { get; set; }

    /// <summary>
    /// Người dùng sở hữu nhật ký kiểm toán
    /// </summary>
    public Guid? UserId { get; set; }

    /// <summary>
    /// Tên người dùng sở hữu nhật ký kiểm toán
    /// </summary>
    public string? UserName { get; set; }

    /// <summary>
    /// Chi tiết thay đổi thuộc tính (chuỗi JSON, do <see cref="OpenObserveEntityChangeConverter"/> xử lý)
    /// </summary>
    [JsonPropertyName("propertychanges")]
    public string? PropertyChangesJson { get; set; }

    public ExtraPropertyDictionary ExtraProperties { get; set; }

    public OpenObserveEntityChange()
    {
        ChangeType = string.Empty;
        ExtraProperties = new ExtraPropertyDictionary();
    }
}
