using System;

namespace LINGYUN.Abp.BackgroundWorkers.Hangfire;

public class CronGenerator
{
    public const long MilliSecondsOfYear = 315_3600_0000L;
    public const long MilliSecondsOfMonth = 26_7840_0000L;
    public const int MilliSecondsOfWeek = 6_0480_0000;
    public const int MilliSecondsOfDays = 8640_0000;
    public const int MilliSecondsOfHours = 360_0000;
    public const int MilliSecondsOfMinutes = 60000;

    /// <summary>
    /// Tính biểu thức Cron từ mili giây
    /// </summary>
    /// <param name="milliseconds"></param>
    /// <returns></returns>
    public static string FormMilliseconds(long milliseconds = 1000)
    {
        if (milliseconds <= 1000)
        {
            return Seconds(0, 1);
        }

        if (milliseconds >= MilliSecondsOfYear)
        {
            return Year(1, 1, 0, 0, 2001, (int)(milliseconds / MilliSecondsOfYear));
        }

        if (milliseconds >= MilliSecondsOfMonth)
        {
            return Month(1, 0, 0, 1, (int)(milliseconds / MilliSecondsOfMonth));
        }

        // TODO: Tác vụ Cron theo đơn vị tuần
        if (milliseconds >= MilliSecondsOfWeek)
        {
            return Day(0, 0, 1, (int)(milliseconds / MilliSecondsOfWeek));
        }

        if (milliseconds >= MilliSecondsOfDays)
        {
            return Day(0, 0, 1, (int)(milliseconds / MilliSecondsOfDays));
        }

        if (milliseconds >= MilliSecondsOfHours)
        {
            return Hour(0, 0, (int)(milliseconds / MilliSecondsOfHours));
        }

        if (milliseconds >= MilliSecondsOfMinutes)
        {
            return Minute(0, 0, (int)(milliseconds / MilliSecondsOfMinutes));
        }

        return Seconds(0, (int)(milliseconds / 1000));
    }
    /// <summary>
    /// Tác vụ có chu kỳ theo giây
    /// </summary>
    /// <param name="second">Giây bắt đầu, mặc định là giây thứ 0</param>
    /// <param name="interval">Khoảng cách chu kỳ thực thi, mặc định là mỗi 5 giây một lần</param>
    /// <returns></returns>
    public static string Seconds(int second = 0, int interval = 5)
    {
        Check.Range(second, nameof(second), 0, 59);

        return $"{second}/{interval} * * * * ? ";
    }

    /// <summary>
    /// Tác vụ có chu kỳ theo phút
    /// </summary>
    /// <param name="second">Giây bắt đầu, mặc định là giây thứ 0</param>
    /// <param name="minute">Phút bắt đầu, mặc định là phút thứ 0</param>
    /// <param name="interval">Khoảng cách chu kỳ thực thi, mặc định là mỗi phút một lần</param>
    /// <returns></returns>
    public static string Minute(int second = 0, int minute = 0, int interval = 1)
    {
        Check.Range(second, nameof(second), 0, 59);
        Check.Range(minute, nameof(minute), 0, 59);

        return $"{second} {minute}/{interval} * * * ? ";
    }

    /// <summary>
    /// Tác vụ có chu kỳ theo giờ
    /// </summary>
    /// <param name="minute">Phút bắt đầu, mặc định là phút thứ 0</param>
    /// <param name="hour">Giờ bắt đầu, mặc định là 0 giờ</param>
    /// <param name="interval">Khoảng cách chu kỳ thực thi, mặc định là mỗi giờ một lần</param>
    /// <returns></returns>
    public static string Hour(int minute = 0, int hour = 0, int interval = 1)
    {
        Check.Range(hour, nameof(hour), 0, 23);
        Check.Range(minute, nameof(minute), 0, 59);

        return $"0 {minute} {hour}/{interval} * * ? ";
    }

    /// <summary>
    /// Tác vụ có chu kỳ theo ngày
    /// </summary>
    /// <param name="hour">Giờ bắt đầu, mặc định bắt đầu từ 0 giờ</param>
    /// <param name="minute">Phút bắt đầu, mặc định bắt đầu từ phút thứ 0</param>
    /// <param name="day">Ngày bắt đầu, mặc định bắt đầu từ ngày thứ 1</param>
    /// <param name="interval">Khoảng cách chu kỳ thực thi, mặc định là mỗi ngày một lần</param>
    /// <returns></returns>
    public static string Day(int hour = 0, int minute = 0, int day = 1, int interval = 1)
    {
        Check.Range(hour, nameof(hour), 0, 23);
        Check.Range(minute, nameof(minute), 0, 59);
        Check.Range(day, nameof(day), 1, 31);

        return $"0 {minute} {hour} {day}/{interval} * ? ";
    }

    /// <summary>
    /// Tác vụ có chu kỳ theo tuần
    /// </summary>
    /// <param name="dayOfWeek">Thứ bắt đầu, mặc định bắt đầu từ thứ Hai</param>
    /// <param name="hour">Giờ bắt đầu, mặc định bắt đầu từ 0 giờ</param>
    /// <param name="minute">Phút bắt đầu, mặc định bắt đầu từ phút thứ 0</param>
    /// <returns></returns>
    public static string Week(DayOfWeek dayOfWeek = DayOfWeek.Monday, int hour = 0, int minute = 0)
    {
        Check.Range(hour, nameof(hour), 0, 23);
        Check.Range(minute, nameof(minute), 0, 59);

        return $"{minute} {hour} * * {dayOfWeek.ToString().Substring(0, 3)}";
    }

    /// <summary>
    /// Tác vụ có chu kỳ theo tháng
    /// </summary>
    /// <param name="day">Ngày bắt đầu, mặc định bắt đầu từ ngày 1</param>
    /// <param name="hour">Giờ bắt đầu, mặc định bắt đầu từ 0 giờ</param>
    /// <param name="minute">Phút bắt đầu, mặc định bắt đầu từ phút thứ 0</param>
    /// <param name="month">Tháng bắt đầu, mặc định bắt đầu từ tháng 1</param>
    /// <param name="interval">Khoảng cách tháng</param>
    /// <returns></returns>
    public static string Month(int day = 1, int hour = 0, int minute = 0, int month = 1, int interval = 1)
    {
        Check.Range(hour, nameof(hour), 0, 23);
        Check.Range(minute, nameof(minute), 0, 59);
        Check.Range(day, nameof(day), 1, 31);

        return $"0 {minute} {hour} {day} {month}/{interval} ?";
    }

    /// <summary>
    /// Tác vụ có chu kỳ theo năm
    /// </summary>
    /// <param name="month">Tháng bắt đầu, mặc định bắt đầu từ tháng 1</param>
    /// <param name="day">Ngày bắt đầu, mặc định bắt đầu từ ngày 1</param>
    /// <param name="hour">Giờ bắt đầu, mặc định bắt đầu từ 0 giờ</param>
    /// <param name="year">Năm bắt đầu, mặc định bắt đầu từ năm 2001</param>
    /// <param name="minute">Phút bắt đầu, mặc định bắt đầu từ phút thứ 0</param>
    /// <returns></returns>
    public static string Year(int month = 1, int day = 1, int hour = 0, int minute = 0, int year = 2001, int interval = 1)
    {
        Check.Range(hour, nameof(hour), 0, 23);
        Check.Range(minute, nameof(minute), 0, 59);
        Check.Range(day, nameof(day), 1, 31);
        Check.Range(month, nameof(month), 1, 12);

        return $"0 {minute} {hour} {day} {month} ? {year}/{interval}";
    }
}
