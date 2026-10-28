namespace LINGYUN.Abp.Location;

/// <summary>
/// Đại lượng vị trí
/// </summary>
public class Position
{
    /// <summary>
    /// Vĩ độ góc trên bên trái
    /// </summary>
    public double LeftTopLatitude { get; }
    /// <summary>
    /// Kinh độ góc trên bên trái
    /// </summary>
    public double LeftTopLongitude { get; }
    /// <summary>
    /// Vĩ độ góc dưới bên trái
    /// </summary>
    public double LeftBottomLatitude { get; }
    /// <summary>
    /// Kinh độ góc dưới bên trái
    /// </summary>
    public double LeftBottomLongitude { get; }

    /// <summary>
    /// Vĩ độ góc trên bên phải
    /// </summary>
    public double RightTopLatitude { get; }
    /// <summary>
    /// Kinh độ góc trên bên phải
    /// </summary>
    public double RightTopLongitude { get; }
    /// <summary>
    /// Vĩ độ góc dưới bên phải
    /// </summary>
    public double RightBottomLatitude { get; }
    /// <summary>
    /// Kinh độ góc dưới bên phải
    /// </summary>
    public double RightBottomLongitude { get; }

    internal Position(double leftTopLat, double leftBottomLat, double leftTopLng, double leftBottomLng,
        double rightTopLat, double rightBottomLat, double rightTopLng, double rightBottomLng)
    {
        LeftTopLatitude = leftTopLat;
        LeftBottomLatitude = leftBottomLat;
        LeftTopLongitude = leftTopLng;
        LeftBottomLongitude = leftBottomLng;
        RightTopLatitude = rightTopLat;
        RightTopLongitude = rightTopLng;
        RightBottomLatitude = rightBottomLat;
        RightBottomLongitude = rightBottomLng;
    }
}
