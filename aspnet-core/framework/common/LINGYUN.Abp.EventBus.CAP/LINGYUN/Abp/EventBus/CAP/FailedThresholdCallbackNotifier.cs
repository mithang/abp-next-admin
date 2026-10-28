using Microsoft.Extensions.Options;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Volo.Abp.ExceptionHandling;

namespace LINGYUN.Abp.EventBus.CAP;

[DisableConventionalRegistration]
public class FailedThresholdCallbackNotifier : IFailedThresholdCallbackNotifier
{
    protected AbpCAPEventBusOptions Options { get; }
    protected IExceptionNotifier ExceptionNotifier { get; }

    public FailedThresholdCallbackNotifier(
        IOptions<AbpCAPEventBusOptions> options,
        IExceptionNotifier exceptionNotifier)
    {
        Options = options.Value;
        ExceptionNotifier = exceptionNotifier;
    }

    public async virtual Task NotifyAsync(AbpCAPExecutionFailedException exception)
    {
        // Kiểm soát việc có gửi sự kiện xử lý thông điệp thất bại hay không thông qua tùy chọn bổ sung
        if (Options.NotifyFailedCallback)
        {
            await ExceptionNotifier.NotifyAsync(exception);
        }
    }
}
