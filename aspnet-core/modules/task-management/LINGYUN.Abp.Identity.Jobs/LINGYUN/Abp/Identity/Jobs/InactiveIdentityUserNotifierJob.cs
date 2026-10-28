using LINGYUN.Abp.BackgroundTasks;
using LINGYUN.Abp.Identity.Notifications;
using LINGYUN.Abp.Identity.Settings;
using LINGYUN.Abp.Notifications;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.DistributedLocking;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Roles;
using Volo.Abp.Settings;
using Volo.Abp.Timing;

namespace LINGYUN.Abp.Identity.Jobs;

/// <summary>
/// Tác vụ thông báo người dùng không hoạt động
/// </summary>
/// <remarks>
/// Thông báo cho người dùng lâu ngày không đăng nhập để giữ tài khoản hoạt động
/// </remarks>
public class InactiveIdentityUserNotifierJob : IJobRunnable
{
    public const string Name = "InactiveIdentityUserNotifierJob";

    #region Definition Paramters

    public readonly static IReadOnlyList<JobDefinitionParamter> Paramters =
        new List<JobDefinitionParamter>
        {
            new JobDefinitionParamter(
                PropertyInactivityPeriodDays,
                LocalizableStatic.Create("DisplayName:InactivityPeriodDays"),
                LocalizableStatic.Create("Description:InactivityPeriodDays")),
        };

    #endregion
    /// <summary>
    /// Thời gian thông báo người dùng không hoạt động, đơn vị: ngày
    /// </summary>
    public const string PropertyInactivityPeriodDays = "InactivityPeriodDays";

    public async virtual Task ExecuteAsync(JobRunnableContext context)
    {
        var logger = context.GetRequiredService<ILogger<InactiveIdentityUserNotifierJob>>();

        var currentTenant = context.GetRequiredService<ICurrentTenant>();
        var distributedLock = context.GetRequiredService<IAbpDistributedLock>();
        var distributedLockKey = $"{nameof(InactiveIdentityUserNotifierJob)}_{currentTenant.Id}";
        await using var jobLockHandle = await distributedLock.TryAcquireAsync(distributedLockKey);
        if (jobLockHandle == null)
        {
            logger.LogInformation("Handle is null because of the locking for : {distributedLockKey}", distributedLockKey);
            return;
        }

        logger.LogInformation("Lock is acquired for {distributedLockKey}.", distributedLockKey);

        // Thời gian thông báo người dùng không hoạt động
        var inactiveNotifierDays = context.GetOrDefaultJobData(PropertyInactivityPeriodDays, 180);
        // Loại trừ người dùng quản trị viên hệ thống
        var exceptUserIds = new List<Guid>();

        var clock = context.GetRequiredService<IClock>();

        var identityRoleManager = context.GetRequiredService<IdentityRoleManager>();
        var identityUserManager = context.GetRequiredService<IdentityUserManager>();
        var identityUserRepo = context.GetRequiredService<IIdentityUserRepository>();
        var identityUserInactiveRepo = context.GetRequiredService<IIdentityUserInactiveRepository>();

        // Không dọn dẹp người dùng thuộc vai trò quản trị viên
        var adminRoleUsers = await identityUserRepo.GetListByNormalizedRoleNameAsync(
            identityRoleManager.NormalizeKey(AbpRoleConsts.AdminRoleName));
        if (adminRoleUsers.Count > 0)
        {
            exceptUserIds.AddIfNotContains(adminRoleUsers.Select(x => x.Id));
        }
        // Không dọn dẹp người dùng quản trị viên
        var adminUsers = await identityUserRepo.GetUsersByNormalizedUserNameAsync(
            identityUserManager.NormalizeName("admin"));
        if (adminUsers.Count > 0)
        {
            exceptUserIds.AddIfNotContains(adminUsers.Select(x => x.Id));
        }

        var inactiveUserNotifierTime = clock.Now.AddDays(-inactiveNotifierDays);

        var inactiveUserCount = await identityUserInactiveRepo.GetInactiveUserCountAsync(
            inactiveUserNotifierTime,
            exceptUserIds);
        if (inactiveUserCount == 0)
        {
            logger.LogInformation("There are no inactive users to be notified.");
            return;
        }
        var inactiveUserBatch = 1000;

        while (true)
        {
            var inactiveUsers = await identityUserInactiveRepo.GetInactiveUserListAsync(
                inactiveUserNotifierTime,
                exceptUserIds,
                maxResultCount: inactiveUserBatch);
            if (inactiveUsers.Count == 0)
            {
                logger.LogInformation("There are no inactive users to be notified.");
                break;
            }

            var identityUserInactives = inactiveUsers.Select(user =>
                new IdentityUserInactive(
                    user.Id,
                    user.LastSignInTime ?? user.LastModificationTime ?? user.CreationTime,
                    user.TenantId));

            await identityUserInactiveRepo.InsertManyAsync(identityUserInactives);

            await SendInactiveUserReminderNotifier(context, inactiveUsers);

            if (inactiveUsers.Count < inactiveUserBatch)
            {
                break;
            }
        }

        logger.LogInformation($"The job of sending notifications to inactive users has been successfully completed..");
    }

    /// <summary>
    /// Gửi thông báo nhắc nhở người dùng không hoạt động
    /// </summary>
    /// <param name="context"></param>
    /// <param name="inactiveUsers"></param>
    /// <returns></returns>
    private async Task SendInactiveUserReminderNotifier(JobRunnableContext context, IEnumerable<IdentityUser> inactiveUsers)
    {
        var clock = context.GetRequiredService<IClock>();
        var settingProvider = context.GetRequiredService<ISettingProvider>();
        var notificationSender = context.GetRequiredService<INotificationSender>();

        var userLoginUri = await settingProvider.GetOrNullAsync(IdentitySettingNames.Link.UserLoginUri);
        var inactiveNotifierDays = context.GetOrDefaultJobData(PropertyInactivityPeriodDays, 180);
        var reactivateDate = clock.Now.AddDays(inactiveNotifierDays);
        await Parallel.ForEachAsync(
            inactiveUsers,
            context.CancellationToken,
            async (inactiveUser, ctx) =>
            {
                var notificationTemplateData = new Dictionary<string, object?>
                {
                    { "now", clock.Now },
                    { "loginUrl", userLoginUri },
                    { "name", inactiveUser.Name },
                    { "userName", inactiveUser.UserName },
                    { "surname", inactiveUser.Surname },
                    { "email", inactiveUser.Email },
                    { "isActive", inactiveUser.IsActive },
                    { "reactivateDate", reactivateDate },
                    { "creationTime", clock.Normalize(inactiveUser.CreationTime) },
                };
                if (inactiveUser.LastSignInTime.HasValue)
                {
                    notificationTemplateData["lastSignInTime"] = clock.Normalize(inactiveUser.LastSignInTime.Value.DateTime);
                }
                var notificationTemplate = new NotificationTemplate(
                    IdentityNotificationNames.IdentityUser.InactiveUserReminderNotifier,
                    data: notificationTemplateData);

                await notificationSender.SendNofiterAsync(
                    IdentityNotificationNames.IdentityUser.InactiveUserReminderNotifier,
                    template: notificationTemplate,
                    user: new UserIdentifier(inactiveUser.Id, inactiveUser.UserName),
                    tenantId: inactiveUser.TenantId);
            });
    }
}
