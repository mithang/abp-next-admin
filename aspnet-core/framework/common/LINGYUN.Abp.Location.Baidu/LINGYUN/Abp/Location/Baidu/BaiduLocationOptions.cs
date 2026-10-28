using System;

namespace LINGYUN.Abp.Location.Baidu;

public class BaiduLocationOptions
{
    /// <summary>
    /// Key người dùng đăng ký
    /// </summary>
    public string AccessKey { get; set; } = default!;
    /// <summary>
    /// AccessSecret người dùng đăng ký
    /// </summary>
    public string AccessSecret { get; set; } = default!;
    /// <summary>
    /// Loại tọa độ, các loại tọa độ hiện được hỗ trợ bao gồm:
    /// bd09ll (tọa độ kinh/vĩ độ Baidu)
    /// bd09mc (tọa độ hệ mét Baidu)
    /// gcj02ll (tọa độ kinh/vĩ độ của Cục Đo đạc Quốc gia, chỉ giới hạn ở Trung Quốc)
    /// wgs84ll (kinh/vĩ độ GPS)
    /// </summary>
    public string CoordType { get; set; } = "bd09ll";
    /// <summary>
    /// Tham số tùy chọn, sau khi thêm sẽ trả về tọa độ kinh/vĩ độ của Cục Đo đạc Quốc gia hoặc hệ mét Baidu
    /// gcj02ll (tọa độ của Cục Đo đạc Quốc gia)
    /// bd09mc (tọa độ Mercator Baidu)
    /// </summary>
    public string ReturnCoordType { get; set; } = "bd09ll";
    /// <summary>
    /// Tính sn
    /// </summary>
    public bool CaculateAKSN => !AccessSecret.IsNullOrWhiteSpace();
    /// <summary>
    /// extensions_poi=0, không truy hồi dữ liệu pois.
    /// extensions_poi=1, trả về dữ liệu pois,
    /// Theo mặc định hiển thị poi trong phạm vi 1000 mét xung quanh.
    /// </summary>
    public string ExtensionsPoi { get; set; } = "1";
    /// <summary>
    /// Khi giá trị là true, truy hồi dữ liệu của 3 tuyến đường gần nhất xung quanh tọa độ.
    /// Khác với tham số street trong phân chia hành chính (tham số street là đường phố trong phân chia hành chính, không tương ứng với đường thông thường)
    /// </summary>
    public bool ExtensionsRoad { get; set; } = false;
    /// <summary>
    /// Khi giá trị là true, phân chia hành chính trả về dữ liệu cấp xã/thị trấn (chỉ truy hồi dữ liệu cấp xã trong nước).
    /// Theo mặc định không truy cập.
    /// </summary>
    public bool ExtensionsTown { get; set; } = false;
    /// <summary>
    /// Chỉ định loại ngôn ngữ của phân chia hành chính mới được truy hồi.
    /// el gu en vi ca it iw sv eu ar cs gl id es en-GB ru sr nl pt tr tl lv en-AU lt th ro 
    /// fil ta fr bg hr bn de hu fa hi pt-BR fi da ja te pt-PT ml ko kn sk zh-CN pl uk sl mr 
    /// local
    /// </summary>
    public string Language { get; set; } = "zh-CN";
    /// <summary>
    /// Định dạng đầu ra là json hoặc xml
    /// </summary>
    public string Output { get; set; } = "json";
    /// <summary>
    /// Hiển thị lỗi cho client
    /// </summary>
    public bool VisableErrorToClient { get; set; } = false;
}
