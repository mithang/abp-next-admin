namespace LINGYUN.Platform.Menus;

public static class MenuConsts
{
    public static int MaxComponentLength
    {
        get;
        set;
    } = 255;

    /// <summary>
    /// Độ sâu tối đa
    /// </summary>
    /// <remarks>
    /// Mặc định là 4, chỉ hỗ trợ menu con bốn cấp
    /// </remarks>
    public const int MaxDepth = 4;

    public const int MaxCodeLength = MaxDepth * (PlatformConsts.CodeUnitLength + 1) - 1;
}
