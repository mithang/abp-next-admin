using System.Threading.Tasks;

namespace LINGYUN.Abp.DataProtection.Stores;
public interface IDataProtectedResourceCache
{
    /// <summary>
    /// Đặt bộ nhớ đệm của quyền dữ liệu được chỉ định
    /// </summary>
    /// <param name="item">Mục bộ nhớ đệm quyền dữ liệu cần cập nhật</param>
    void SetCache(DataAccessResource resource);
    /// <summary>
    /// Đặt bộ nhớ đệm của quyền dữ liệu được chỉ định
    /// </summary>
    /// <param name="item">Mục bộ nhớ đệm quyền dữ liệu cần cập nhật</param>
    Task SetCacheAsync(DataAccessResource resource);
    /// <summary>
    /// Xóa mục bộ nhớ đệm của chủ thể và loại thực thể được chỉ định
    /// </summary>
    /// <param name="item">Thông tin mục bộ nhớ đệm quyền dữ liệu cần xóa</param>
    void RemoveCache(DataAccessResource resource);
    /// <summary>
    /// Xóa mục bộ nhớ đệm của chủ thể và loại thực thể được chỉ định
    /// </summary>
    /// <param name="item">Thông tin mục bộ nhớ đệm quyền dữ liệu cần xóa</param>
    Task RemoveCacheAsync(DataAccessResource resource);
    /// <summary>
    /// Lấy quy tắc lọc quyền dữ liệu của chủ thể và loại thực thể được chỉ định
    /// </summary>
    /// <param name="subjectName">Chủ thể quyền</param>
    /// <param name="subjectId">Định danh chủ thể quyền</param>
    /// <param name="entityTypeFullName">Tên loại thực thể</param>
    /// <param name="operation">Thao tác quyền dữ liệu</param>
    /// <returns>Nhóm điều kiện lọc dữ liệu</returns>
    DataProtectedResourceCacheItem? GetCache(string subjectName, string subjectId, string entityTypeFullName, DataAccessOperation operation);
    /// <summary>
    /// Lấy quy tắc lọc quyền dữ liệu của chủ thể và loại thực thể được chỉ định
    /// </summary>
    /// <param name="subjectName">Chủ thể quyền</param>
    /// <param name="subjectId">Định danh chủ thể quyền</param>
    /// <param name="entityTypeFullName">Tên loại thực thể</param>
    /// <param name="operation">Thao tác quyền dữ liệu</param>
    /// <returns>Nhóm điều kiện lọc dữ liệu</returns>
    Task<DataProtectedResourceCacheItem?> GetCacheAsync(string subjectName, string subjectId, string entityTypeFullName, DataAccessOperation operation);
}
