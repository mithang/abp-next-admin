using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Identity;

namespace LINGYUN.Abp.Identity.Session;
/// <summary>
/// Lưu trữ phiên người dùng
/// </summary>
public interface IIdentitySessionStore
{
    /// <summary>
    /// Tạo phiên người dùng
    /// </summary>
    /// <param name="sessionId">Id phiên</param>
    /// <param name="device">Thiết bị</param>
    /// <param name="deviceInfo">Thông tin thiết bị</param>
    /// <param name="userId">Id người dùng</param>
    /// <param name="clientId">Id máy khách</param>
    /// <param name="ipAddresses">Địa chỉ IP</param>
    /// <param name="signedIn">Thời gian đăng nhập</param>
    /// <param name="lastAccessed">Thời gian truy cập lần cuối</param>
    /// <param name="ipRegion">Vùng IP</param>
    /// <param name="userName">Tên người dùng</param>
    /// <param name="tenantId">Id tenant</param>
    /// <param name="cancellationToken"></param>
    /// <returns><seealso cref="IdentitySession"/> đã được tạo</returns>
    Task<IdentitySession> CreateAsync(
        string sessionId,
        string device,
        string? deviceInfo,
        Guid userId,
        string? clientId,
        string? ipAddresses,
        DateTime signedIn,
        DateTime? lastAccessed = null,
        string? ipRegion = null,
        string? userName = null,
        Guid? tenantId = null,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Cập nhật phiên người dùng
    /// </summary>
    /// <param name="session">Thực thể phiên người dùng</param>
    /// <param name="cancellationToken"></param>
    /// <returns>a completed task.</returns>
    Task UpdateAsync(
        IdentitySession session,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Truy vấn phiên người dùng
    /// </summary>
    /// <param name="id">Khóa phiên</param>
    /// <param name="cancellationToken"></param>
    /// <returns><seealso cref="IdentitySession"/> đã truy vấn được</returns>
    /// <exception cref="Volo.Abp.Domain.Entities.EntityNotFoundException"></exception>
    Task<IdentitySession> GetAsync(
        Guid id,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Truy vấn phiên người dùng
    /// </summary>
    /// <param name="id">Khóa phiên</param>
    /// <param name="cancellationToken"></param>
    /// <returns>Nếu tồn tại, trả về <seealso cref="IdentitySession"/> , ngược lại trả về null.</returns>
    Task<IdentitySession?> FindAsync(
        Guid id,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Truy vấn phiên người dùng
    /// </summary>
    /// <param name="sessionId">Id phiên</param>
    /// <param name="cancellationToken"></param>
    /// <returns><seealso cref="IdentitySession"/> đã truy vấn được</returns>
    /// <exception cref="Volo.Abp.Domain.Entities.EntityNotFoundException"></exception>
    Task<IdentitySession> GetAsync(
        string sessionId,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Truy vấn phiên người dùng
    /// </summary>
    /// <param name="sessionId">Id phiên</param>
    /// <param name="cancellationToken"></param>
    /// <returns>Nếu tồn tại, trả về <seealso cref="IdentitySession"/> , ngược lại trả về null.</returns>
    Task<IdentitySession?> FindAsync(
        string sessionId,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Truy vấn phiên gần nhất của người dùng
    /// </summary>
    /// <param name="userId">Id người dùng</param>
    /// <param name="device">Thiết bị</param>
    /// <param name="cancellationToken"></param>
    /// <returns>Nếu tồn tại, trả về <seealso cref="IdentitySession"/> , ngược lại trả về null.</returns>
    Task<IdentitySession?> FindLastAsync(
        Guid userId,
        string device,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Phiên đã tồn tại hay chưa
    /// </summary>
    /// <param name="sessionId">Id phiên</param>
    /// <param name="cancellationToken"></param>
    /// <returns>Nếu tồn tại, trả về true, ngược lại trả về false.</returns>
    Task<bool> ExistAsync(
        string sessionId,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Thu hồi phiên người dùng
    /// </summary>
    /// <param name="id">Khóa phiên</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task RevokeAsync(
        Guid id,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Thu hồi phiên người dùng
    /// </summary>
    /// <param name="sessionId">Id phiên</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task RevokeAsync(
        string sessionId,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Thu hồi tất cả phiên
    /// </summary>
    /// <param name="userId">Id người dùng</param>
    /// <param name="exceptSessionId">Khóa phiên loại trừ</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task RevokeAllAsync(
        Guid userId,
        Guid? exceptSessionId = null,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Thu hồi tất cả phiên
    /// </summary>
    /// <param name="userId">Id người dùng</param>
    /// <param name="device">Thiết bị</param>
    /// <param name="exceptSessionId">Khóa phiên loại trừ</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task RevokeAllAsync(
        Guid userId,
        string device,
        Guid? exceptSessionId = null,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Thu hồi các phiên không hoạt động
    /// </summary>
    /// <param name="inactiveTimeSpan">Khoảng thời gian không hoạt động</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task RevokeAllAsync(
        TimeSpan inactiveTimeSpan,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Thu hồi các phiên chỉ định
    /// </summary>
    /// <param name="userId">Id người dùng</param>
    /// <param name="device">Thiết bị</param>
    /// <param name="exceptSessionId">Id phiên loại trừ</param>
    /// <param name="maxCount">Số lượng tối đa</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task RevokeWithAsync(
        Guid userId,
        string? device = null,
        Guid? exceptSessionId = null,
        int maxCount = 0,
        CancellationToken cancellationToken = default);
    /// <summary>
    /// Thu hồi danh sách phiên
    /// </summary>
    /// <param name="identitySessions">Danh sách phiên</param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task RevokeManyAsync(
        IEnumerable<IdentitySession> identitySessions,
        CancellationToken cancellationToken = default);
}
