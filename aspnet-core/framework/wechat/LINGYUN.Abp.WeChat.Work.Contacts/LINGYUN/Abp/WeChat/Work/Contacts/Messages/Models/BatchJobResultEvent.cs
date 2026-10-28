using LINGYUN.Abp.WeChat.Common.Messages;
using LINGYUN.Abp.WeChat.Work.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Messages.Models;
/// <summary>
/// Thông báo hoàn thành tác vụ không đồng bộ
/// </summary>
/// <remarks>
/// Sự kiện này dùng để thành viên nhận thông báo kết quả khi tác vụ đã thực thi xong khi sử dụng giao diện tác vụ không đồng bộ.
/// </remarks>
[EventName("batch_job_result")]
public class BatchJobResultEvent : WeChatWorkEventMessage
{
    /// <summary>
    /// Thông tin tác vụ không đồng bộ
    /// </summary>
    [XmlElement("BatchJob")]
    public BatchJob BatchJob { get; set; } = default!;

    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<BatchJobResultEvent>(this);
    }
}

public class BatchJob
{
    /// <summary>
    /// id tác vụ không đồng bộ, độ dài tối đa 64 ký tự
    /// </summary>
    [XmlElement("JobId")]
    public string JobId { get; set; } = default!;
    /// <summary>
    /// Kiểu thao tác, chuỗi, hiện tại lần lượt gồm: sync_user (cập nhật tăng dần thành viên), replace_user (ghi đè toàn bộ thành viên）, invite_user (mời thành viên theo dõi), replace_party (ghi đè toàn bộ bộ phận)
    /// </summary>
    [XmlElement("JobType")]
    public string JobType { get; set; } = default!;
    /// <summary>
    /// Mã trả về
    /// </summary>
    [XmlElement("ErrCode")]
    public int ErrCode { get; set; }
    /// <summary>
    /// Nội dung mô tả dạng văn bản của mã trả về
    /// </summary>
    [XmlElement("ErrMsg")]
    public string? ErrMsg { get; set; }
}