using JetBrains.Annotations;

namespace LINGYUN.Abp.Location.Amap
{
    /// <summary>
    /// Tham số yêu cầu phân giải địa chỉ thuận của bản đồ Amap
    /// </summary>
    public class AmapPositiveHttpRequestParamter
    {
        /// <summary>
        /// Địa chỉ có cấu trúc
        /// Quy tắc tuân theo: quốc gia, tỉnh, thành phố, quận/huyện, thị trấn, thôn/xã, đường phố, số nhà, khu dân cư, tòa nhà, ví dụ: số 6 đường Futong Đông, quận Triều Dương, Bắc Kinh.
        /// Nếu cần phân giải nhiều địa chỉ, hãy dùng "|" để phân tách và đặt tham số batch thành true, tối đa hỗ trợ 10 địa chỉ gửi dạng phân tách bằng "|"
        /// </summary>
        [NotNull]
        public string Address { get; set; }
        /// <summary>
        /// Thành phố
        /// Nội dung nhập tùy chọn gồm: tên thành phố (ví dụ: Bắc Kinh), phiên âm đầy đủ tên thành phố (beijing), citycode (010), adcode (110000), không hỗ trợ thành phố cấp huyện.
        /// Khi nội dung truy vấn thành phố được chỉ định để trống, hệ thống sẽ tìm kiếm chuyển đổi địa chỉ trên phạm vi toàn quốc.
        /// </summary>
        [CanBeNull]
        public string City { get; set; }
        /// <summary>
        /// Điều khiển truy vấn hàng loạt
        /// Khi tham số batch được đặt thành true sẽ thực hiện truy vấn hàng loạt, tối đa hỗ trợ 10 địa chỉ.
        /// Khi tham số batch được đặt thành false sẽ truy vấn từng điểm, lúc này dù truyền nhiều địa chỉ cũng chỉ trả về kết quả phân giải của địa chỉ đầu tiên
        /// </summary>
        [CanBeNull]
        public bool Batch { get; set; } = false;
        /// <summary>
        /// Chữ ký số
        /// </summary>
        [CanBeNull]

        public string Sig { get; set; }
        /// <summary>
        /// Loại định dạng dữ liệu trả về
        /// Nội dung nhập tùy chọn gồm: JSON, XML. Đặt JSON thì dữ liệu kết quả trả về sẽ được cấu thành theo cấu trúc JSON;
        /// nếu đặt XML thì dữ liệu kết quả trả về sẽ được cấu thành theo cấu trúc XML.
        /// </summary>
        [CanBeNull]
        public string Output { get; set; } = "JSON";
    }
}
