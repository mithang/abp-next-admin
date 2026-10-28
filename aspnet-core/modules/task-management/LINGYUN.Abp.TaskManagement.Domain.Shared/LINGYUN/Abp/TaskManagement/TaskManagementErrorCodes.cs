namespace LINGYUN.Abp.TaskManagement
{
    public static class TaskManagementErrorCodes
    {
        public const string Namespace = "TaskManagement";
        /// <summary>
        /// Trong nhóm {Group} đã tồn tại một job có tên {Name}!
        /// </summary>
        public const string JobNameAlreadyExists = Namespace + ":01000";
        /// <summary>
        /// Hàng đợi không tìm thấy job có tên {Name} trong nhóm {Group}, vui lòng đưa job vào hàng đợi trước!
        /// </summary>
        public const string JobNotFoundInQueue = Namespace + ":01001";
        /// <summary>
        /// Chỉ cho phép xóa job đã dừng
        /// </summary>
        public const string OnlyDeletionOfStopJobsIsAllowed = Namespace + ":01002";
        /// <summary>
        /// Biểu thức CRON không hợp lệ: {Cron}!
        /// </summary>
        public const string InvalidCronExpression = Namespace + ":01003";
    }
}
