using System;

namespace LINGYUN.Abp.Location;

public class Location
{
    /// <summary>
    /// Bán kính Trái Đất (mét)
    /// </summary>
    public const double EARTH_RADIUS = 6378137;
    /// <summary>
    /// Vĩ độ
    /// </summary>
    public double Latitude { get; set; }
    /// <summary>
    /// Kinh độ
    /// </summary>
    public double Longitude { get; set; }

    /// <summary>
    /// Tính khoảng cách giữa hai vị trí, trả về khoảng cách của hai điểm, đơn vị mét
    /// Công thức này do GOOGLE cung cấp, sai số nhỏ hơn 0,2 mét
    /// </summary>
    /// <param name="location">Thông tin vị trí tham gia tính toán</param>
    /// <returns>Trả về khoảng cách giữa hai vị trí</returns>
    public double CalcDistance(Location location)
    {
        return CalcDistance(this, location);
    }
    /// <summary>
    /// Tính khoảng cách giữa hai vị trí, trả về khoảng cách của hai điểm, đơn vị mét
    /// Công thức này do GOOGLE cung cấp, sai số nhỏ hơn 0,2 mét
    /// </summary>
    /// <param name="location1">Thông tin vị trí tham gia tính toán</param>
    /// <param name="location2">Thông tin vị trí tham gia tính toán</param>
    /// <returns>Trả về khoảng cách giữa hai vị trí</returns>
    public static double CalcDistance(Location location1, Location location2)
    {
        double radLat1 = Rad(location1.Latitude);
        double radLng1 = Rad(location1.Longitude);
        double radLat2 = Rad(location2.Latitude);
        double radLng2 = Rad(location2.Longitude);
        double a = radLat1 - radLat2;
        double b = radLng1 - radLng2;
        double result = 2 * Math.Asin(Math.Sqrt(Math.Pow(Math.Sin(a / 2), 2) + Math.Cos(radLat1) * Math.Cos(radLat2) * Math.Pow(Math.Sin(b / 2), 2)));
        result *= EARTH_RADIUS;
        return result;
    }
    /// <summary>
    /// Tính khoảng cách lệch của vị trí
    /// </summary>
    /// <param name="location">Vị trí tham gia tính toán</param>
    /// <param name="distance">Độ lệch vị trí, đơn vị mét</param>
    /// <returns></returns>
    public static Position CalcOffsetDistance(Location location, double distance)
    {
        double dlng = 2 * Math.Asin(Math.Sin(distance / (2 * EARTH_RADIUS)) / Math.Cos(Rad(location.Latitude)));
        dlng = Deg(dlng);
        double dlat = distance / EARTH_RADIUS;
        dlat = Deg(dlat);
        double leftTopLat = location.Latitude + dlat;
        double leftTopLng = location.Longitude - dlng;

        double leftBottomLat = location.Latitude - dlat;
        double leftBottomLng = location.Longitude - dlng;

        double rightTopLat = location.Latitude + dlat;
        double rightTopLng = location.Longitude + dlng;

        double rightBottomLat = location.Latitude - dlat;
        double rightBottomLng = location.Longitude + dlng;

        return new Position(leftTopLat, leftBottomLat, leftTopLng, leftBottomLng,
            rightTopLat, rightBottomLat, rightTopLng, rightBottomLng);
    }

    /// <summary>
    /// Chuyển đổi góc sang radian
    /// </summary>
    /// <param name="d"></param>
    /// <returns></returns>
    public static double Rad(double d)
    {
        return d * Math.PI / 180d;
    }

    /// <summary>
    /// Chuyển đổi radian sang góc
    /// </summary>
    /// <param name="d"></param>
    /// <returns></returns>
    public static double Deg(double d)
    {
        return d * (180 / Math.PI);
    }
}
