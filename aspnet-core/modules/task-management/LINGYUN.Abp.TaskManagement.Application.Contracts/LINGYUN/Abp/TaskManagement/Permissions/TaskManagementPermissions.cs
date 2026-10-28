namespace LINGYUN.Abp.TaskManagement.Permissions;

public static class TaskManagementPermissions
{
    public const string GroupName = "TaskManagement";

    public static class BackgroundJobs
    {
        public const string Default = GroupName + ".BackgroundJobs";
        public const string Create = Default + ".Create";
        public const string Update = Default + ".Update";
        public const string Delete = Default + ".Delete";
        public const string Trigger = Default + ".Trigger";
        public const string Pause = Default + ".Pause";
        public const string Resume = Default + ".Resume";
        public const string Start = Default + ".Start";
        public const string Stop = Default + ".Stop";
        /// <summary>
        /// Có cho phép quản lý các công việc tích hợp sẵn của hệ thống hay không
        /// Thông thường các công việc tích hợp sẵn được tạo ra trong quá trình chương trình chạy, cần kiểm soát hành vi người dùng
        /// </summary>
        public const string ManageSystemJobs = Default + ".ManageSystemJobs";
        /// <summary>
        /// Quản lý hành vi công việc
        /// </summary>
        public const string ManageActions = Default + ".ManageActions";
    }

    public static class BackgroundJobLogs
    {
        public const string Default = GroupName + ".BackgroundJobLogs";
        public const string Delete = Default + ".Delete";
    }
}
