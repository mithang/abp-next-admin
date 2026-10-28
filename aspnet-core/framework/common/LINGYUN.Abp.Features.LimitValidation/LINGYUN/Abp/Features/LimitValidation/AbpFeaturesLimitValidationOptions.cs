using JetBrains.Annotations;
using System;
using System.Collections.Generic;
using Volo.Abp;

namespace LINGYUN.Abp.Features.LimitValidation;

public class AbpFeaturesLimitValidationOptions
{
    public IDictionary<LimitPolicy, Func<DateTime, int, long>> EffectPolicys { get; }

    public AbpFeaturesLimitValidationOptions()
    {
        EffectPolicys = new Dictionary<LimitPolicy, Func<DateTime, int, long>>();
    }
    /// <summary>
    /// Thay đổi phương thức tính thời lượng của chính sách giới hạn tính năng
    /// </summary>
    /// <param name="policy">Chính sách giới hạn</param>
    /// <param name="func">Phương thức tính tùy chỉnh</param>
    /// <remarks>
    /// Giá trị trả về nhất định phải theo đơn vị giây
    /// </remarks>
    public void MapEffectPolicy(LimitPolicy policy,[NotNull] Func<DateTime, int, long> func)
    {
        Check.NotNull(func, nameof(func));

        if (EffectPolicys.ContainsKey(policy))
        {
            EffectPolicys[policy] = func;
        }
        else
        {
            EffectPolicys.Add(policy, func);
        }
    }

    internal void MapDefaultEffectPolicys()
    {
        MapEffectPolicy(LimitPolicy.Minute, (now, tick) =>
        {
            return (long)(now.AddMinutes(tick) - now).TotalSeconds;
        });

        MapEffectPolicy(LimitPolicy.Hours, (now, tick) =>
        {
            return (long)(now.AddHours(tick) - now).TotalSeconds;
        });

        MapEffectPolicy(LimitPolicy.Days, (now, tick) =>
        {
            // Tính theo ngày thì lấy ngày hiện tại
            return (long)(now.Date.AddDays(tick) - now).TotalSeconds;
        });

        MapEffectPolicy(LimitPolicy.Weeks,(now, tick) =>
        {
            // Tính theo tuần thì lấy tuần hiện tại
            var nowDate = now.Date;
            var dayOfWeek = (int)nowDate.DayOfWeek - 1;
            if (nowDate.DayOfWeek == DayOfWeek.Sunday)
            {
                dayOfWeek = 6;
            }
            var utcOnceDayOfWeek = nowDate.AddDays(-dayOfWeek);

            return (long)(utcOnceDayOfWeek.AddDays(tick * 7) - now).TotalSeconds;
        });

        MapEffectPolicy(LimitPolicy.Month, (now, tick) =>
        {
            // Tính theo tháng thì lấy tháng hiện tại
            var utcOnceDayOfMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, 0);

            return (long)(utcOnceDayOfMonth.AddMonths(tick) - now).TotalSeconds; 
        });

        MapEffectPolicy(LimitPolicy.Years, (now, tick) => 
        {
            // Tính theo năm thì lấy năm hiện tại
            var utcOnceDayOfYear = new DateTime(now.Year, 1, 1, 0, 0, 0, 0);

            return (long)(utcOnceDayOfYear.AddYears(tick) - now).TotalSeconds; 
        });
    }
}
