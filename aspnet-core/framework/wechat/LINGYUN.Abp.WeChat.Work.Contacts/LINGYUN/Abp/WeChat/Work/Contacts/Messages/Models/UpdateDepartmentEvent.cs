using LINGYUN.Abp.WeChat.Common.Messages;
using LINGYUN.Abp.WeChat.Work.Common.Messages;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Messages.Models;
/// <summary>
/// Sự kiện cập nhật phòng ban
/// </summary>
[EventName("update_party")]
public class UpdateDepartmentEvent : DepartmentUpdateEvent
{
    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<UpdateDepartmentEvent>(this);
    }
}
