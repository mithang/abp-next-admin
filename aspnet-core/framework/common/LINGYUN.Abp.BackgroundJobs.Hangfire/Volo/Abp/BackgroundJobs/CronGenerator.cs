using Hangfire;
using System;

namespace Volo.Abp.BackgroundJobs;

public class CronGenerator
{
    /// <summary>
    /// Tác vụ định kỳ theo phút
    /// </summary>
    /// <param name="interval">Khoảng thời gian của chu kỳ thực thi, mặc định là mỗi phút một lần</param>
    /// <returns></returns>
    public static string Minute(int interval = 1)
    {
        return $"1 0/{interval} * * * ? ";
    }

    /// <summary>
    /// Tác vụ định kỳ theo giờ
    /// </summary>
    /// <param name="minute">Bắt đầu từ phút thứ mấy, mặc định là phút đầu tiên</param>
    /// <param name="interval">Khoảng thời gian của chu kỳ thực thi, mặc định là mỗi giờ một lần</param>
    /// <returns></returns>
    public static string Hour(int minute = 1, int interval = 1)
    {
        return $"1 {minute} 0/ {interval} * * ? ";
    }

    /// <summary>
    /// Tác vụ định kỳ theo ngày
    /// </summary>
    /// <param name="hour">Bắt đầu từ giờ thứ mấy, mặc định bắt đầu từ 1 giờ</param>
    /// <param name="minute">Bắt đầu từ phút thứ mấy, mặc định bắt đầu từ phút thứ 1</param>
    /// <param name="interval">Khoảng thời gian của chu kỳ thực thi, mặc định là mỗi ngày một lần</param>
    /// <returns></returns>
    public static string Day(int hour = 1, int minute = 1, int interval = 1)
    {
        return $"1 {minute} {hour} 1/ {interval} * ? ";
    }

    /// <summary>
    /// Tác vụ định kỳ theo tuần
    /// </summary>
    /// <param name="dayOfWeek">Bắt đầu từ thứ mấy, mặc định bắt đầu từ thứ Hai</param>
    /// <param name="hour">Bắt đầu từ giờ thứ mấy, mặc định bắt đầu từ 1 giờ</param>
    /// <param name="minute">Bắt đầu từ phút thứ mấy, mặc định bắt đầu từ phút thứ 1</param>
    /// <returns></returns>
    public static string Week(DayOfWeek dayOfWeek = DayOfWeek.Monday, int hour = 1, int minute = 1)
    {
        return Cron.Weekly(dayOfWeek, hour, minute);
    }

    /// <summary>
    /// Tác vụ định kỳ theo tháng
    /// </summary>
    /// <param name="day">Bắt đầu từ ngày mấy, mặc định bắt đầu từ ngày 1</param>
    /// <param name="hour">Bắt đầu từ giờ thứ mấy, mặc định bắt đầu từ 1 giờ</param>
    /// <param name="minute">Bắt đầu từ phút thứ mấy, mặc định bắt đầu từ phút thứ 1</param>
    /// <returns></returns>
    public static string Month(int day = 1, int hour = 1, int minute = 1)
    {
        return Cron.Monthly(day, hour, minute);
    }

    /// <summary>
    /// Tác vụ định kỳ theo năm
    /// </summary>
    /// <param name="month">Bắt đầu từ tháng mấy, mặc định bắt đầu từ tháng 1</param>
    /// <param name="day">Bắt đầu từ ngày mấy, mặc định bắt đầu từ ngày 1</param>
    /// <param name="hour">Bắt đầu từ giờ thứ mấy, mặc định bắt đầu từ 1 giờ</param>
    /// <param name="minute">Bắt đầu từ phút thứ mấy, mặc định bắt đầu từ phút thứ 1</param>
    /// <returns></returns>
    public static string Year(int month = 1, int day = 1, int hour = 1, int minute = 1)
    {
        return Cron.Yearly(month, day, hour, minute);
    }
}
