using LINGYUN.Abp.BackgroundTasks;
using LINGYUN.Abp.Saas.Features;
using LINGYUN.Abp.Saas.Tenants;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Emailing;
using Volo.Abp.Features;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Timing;

namespace LINGYUN.Abp.Saas.Jobs;
public class TenantUsageMonitoringJob : IJobRunnable
{
    #region Definition Paramters

    public readonly static IReadOnlyList<JobDefinitionParamter> Paramters =
        new List<JobDefinitionParamter>
        {
            new JobDefinitionParamter(PropertyAdminEmail, LocalizableStatic.Create("Saas:AdminEmail"), required: true),
            new JobDefinitionParamter(PropertyTenantId, LocalizableStatic.Create("Saas:TenantId"), required: true),
        };

    #endregion

    public const string PropertyAdminEmail = "AdminEmail";
    public const string PropertyTenantId = "TenantId";

    public async virtual Task ExecuteAsync(JobRunnableContext context)
    {
        var clock = context.GetRequiredService<IClock>();
        var currentTenant = context.GetRequiredService<ICurrentTenant>();
        var repository = context.GetRequiredService<ITenantRepository>();
        var featureChecker = context.GetRequiredService<IFeatureChecker>();
        using (currentTenant.Change(null))
        {
            var tenantId = context.GetJobData<Guid>(PropertyTenantId);
            // TODO: Tenant đã bị xóa cần hủy việc chạy job
            var tenant = await repository.GetAsync(tenantId);
            if (!tenant.DisableTime.HasValue)
            {
                return;
            }
            using (currentTenant.Change(tenantId))
            {
                var allowExpirationDays = await featureChecker.GetAsync(SaasFeatureNames.Tenant.ExpirationReminderDays, 15);
                if (tenant.DisableTime <= clock.Now.AddDays(allowExpirationDays))
                {
                    var adminEmail = context.GetString(PropertyAdminEmail);
                    var emailSender = context.GetRequiredService<IEmailSender>();
                    // TODO: Cần gửi bằng mẫu (template)
                    await emailSender.SendAsync(adminEmail, "Cảnh báo hết thời gian sử dụng tài nguyên", "Xin chào, tài nguyên nền tảng của bạn đã đến thời gian cảnh báo hết hạn, tài nguyên quá hạn sẽ bị thu hồi và không thể khôi phục, vui lòng kịp thời gia hạn thời gian sử dụng hoặc sao lưu tài nguyên!");
                    return;
                }

                var expiredRecoveryTime = await featureChecker.GetAsync(SaasFeatureNames.Tenant.ExpiredRecoveryTime, 15);
                if (clock.Now > tenant.DisableTime && clock.Now.Subtract(TimeSpan.FromDays(expiredRecoveryTime)) <= tenant.DisableTime)
                {
                    // Tenant đã hết hạn và đạt thời gian gia hạn tối đa, xóa tenant
                    await repository.DeleteAsync(tenant);
                }
            }
        }
    }
}
