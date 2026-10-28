namespace LINGYUN.Abp.Location.Amap
{
    /// <summary>
    /// Kết quả phân tích địa chỉ ngược
    /// </summary>
    public class AmapInverseLocationResponse : AmapHttpResponse
    {
        public AmapRegeocode Regeocode { get; set; }
        public AmapInverseLocationResponse()
        {
            Regeocode = new AmapRegeocode();
        }
    }
}
