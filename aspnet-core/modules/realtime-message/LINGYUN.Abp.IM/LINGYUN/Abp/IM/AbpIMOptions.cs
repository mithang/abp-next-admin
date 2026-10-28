using LINGYUN.Abp.IM.Messages;
using Volo.Abp.Collections;

namespace LINGYUN.Abp.IM;

public class AbpIMOptions
{
    /// <summary>
    ///  Người gửi tin nhắn
    /// </summary>
    public ITypeList<IMessageSenderProvider> Providers { get; }

    public AbpIMOptions()
    {
        Providers = new TypeList<IMessageSenderProvider>();
    }
}
