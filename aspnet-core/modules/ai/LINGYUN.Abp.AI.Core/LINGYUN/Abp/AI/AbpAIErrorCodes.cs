namespace LINGYUN.Abp.AI;
public static class AbpAIErrorCodes
{
    public const string Namespace = "Abp.AI";
    /// <summary>
    /// Không gian làm việc không khả dụng: {Workspace}!
    /// </summary>
    public const string WorkspaceIsNotEnabled = Namespace + ":110001";
    /// <summary>
    /// ApiKey bị thiếu hoặc không hợp lệ!
    /// </summary>
    public const string MissingOrInvalidApiKey = Namespace + ":110002";
    /// <summary>
    /// Cuộc trò chuyện đã hết hạn, vui lòng tạo lại phiên trò chuyện!
    /// </summary>
    public const string ConversationHasExpired = Namespace + ":110101";
}
