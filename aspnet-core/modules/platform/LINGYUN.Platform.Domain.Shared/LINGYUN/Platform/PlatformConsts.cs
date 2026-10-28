namespace LINGYUN.Platform;

public static class PlatformConsts
{
    /// <summary>
    /// Ký tự đệm khi số hiệu thiếu chữ số, ví dụ số hiệu là 3, độ dài 5 ký tự, ký tự đệm là 0 thì số hiệu là 00003
    /// </summary>
    public static char CodePrefix { get; set; } = '0';
    /// <summary>
    /// Độ dài số hiệu
    /// </summary>
    public const int CodeUnitLength = 5;
}
