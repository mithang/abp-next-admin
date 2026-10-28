namespace LINGYUN.Abp.BlobManagement.Features;

public static class BlobManagementFeatureNames
{
    public const string GroupName = "AbpBlobManagement";
    /// <summary>
    /// Bật quản lý lưu trữ đối tượng
    /// </summary>
    public const string Enable = GroupName + ".Enable";
    /// <summary>
    /// Có cho phép người dùng chưa được ủy quyền truy cập thư mục công khai hay không
    /// </summary>
    public const string PublicAccess = GroupName + ".PublicAccess";

    public class Blob
    {
        public const string Default = GroupName + ".Blob";
        /// <summary>
        /// Bật Blob
        /// </summary>
        public const string Enable = Default + ".Enable";
        /// <summary>
        /// Tạo liên kết tải xuống tệp tạm thời
        /// </summary>
        public const string GenerateDownloadUrl = Default + ".GenerateDownloadUrl";
        /// <summary>
        /// Chức năng tải xuống tệp
        /// </summary>
        public const string DownloadFile = Default + ".DownloadFile";
        /// <summary>
        /// Số lần giới hạn của chức năng tải xuống tệp
        /// </summary>
        public const string DownloadLimit = Default + ".DownloadLimit";
        /// <summary>
        /// Chu kỳ giới hạn số lần của chức năng tải xuống tệp
        /// </summary>
        public const string DownloadInterval = Default + ".DownloadInterval";
        /// <summary>
        /// Chức năng tải lên tệp
        /// </summary>
        public const string UploadFile = Default + ".UploadFile";
        /// <summary>
        /// Số lần giới hạn của chức năng tải lên tệp
        /// </summary>
        public const string UploadLimit = Default + ".UploadLimit";
        /// <summary>
        /// Chu kỳ giới hạn số lần của chức năng tải lên tệp
        /// </summary>
        public const string UploadInterval = Default + ".UploadInterval";
        /// <summary>
        /// Số tệp tải lên tối đa
        /// </summary>
        public const string MaxUploadFileCount = Default + ".MaxUploadFileCount";
    }
}
