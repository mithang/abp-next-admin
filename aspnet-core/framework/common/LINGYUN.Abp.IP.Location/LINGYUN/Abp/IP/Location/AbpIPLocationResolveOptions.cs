using JetBrains.Annotations;
using System;
using System.Collections.Generic;

namespace LINGYUN.Abp.IP.Location;
public class AbpIPLocationResolveOptions
{
    [NotNull]
    public List<IIPLocationResolveContributor> IPLocationResolvers { get; }

    /// <summary>
    /// Tên quốc gia cần loại khỏi ghi chú (Remarks)
    /// </summary>
    /// <remarks>
    /// Khi tên trùng khớp (bỏ qua chữ hoa/chữ thường và khoảng trắng đầu/cuối, áp dụng cho IP của mọi quốc gia), tên quốc gia đó sẽ không còn xuất hiện trong ghi chú,
    /// ghi chú chuyển sang dùng tổ hợp tỉnh và thành phố: nếu cả tỉnh và thành phố đều có thì "tỉnh + thành phố" (khi tỉnh và thành phố trùng tên thì chỉ dùng thành phố, ví dụ thành phố Trùng Khánh), nếu chỉ có tỉnh thì dùng tỉnh.
    /// 
    /// Ví dụ sau khi đặt thành "Trung Quốc": ghi chú của IP Trung Quốc là "tỉnh + thành phố" (ví dụ Hàng Châu, tỉnh Chiết Giang), các quốc gia khác vẫn chỉ hiển thị tên quốc gia.
    /// Mặc định là tập hợp rỗng (tên quốc gia tham gia tổ hợp ghi chú).
    /// </remarks>
    [NotNull]
    public string[] RemoveCountry { get; set; }

    /// <summary>
    /// Tên tỉnh cần loại khỏi ghi chú (Remarks)
    /// </summary>
    /// <remarks>
    /// Khi tên trùng khớp (bỏ qua chữ hoa/chữ thường và khoảng trắng đầu/cuối, áp dụng cho IP của mọi quốc gia), tên tỉnh đó sẽ không còn xuất hiện trong ghi chú, ghi chú chỉ dùng thành phố (ví dụ thành phố Hàng Châu);
    /// Các IP không trùng khớp không bị ảnh hưởng. Mặc định là tập hợp rỗng (tên tỉnh tham gia tổ hợp ghi chú).
    /// </remarks>
    [NotNull]
    public string[] RemoveProvince { get; set; }

    public AbpIPLocationResolveOptions()
    {
        IPLocationResolvers = new List<IIPLocationResolveContributor>();

        RemoveCountry = Array.Empty<string>();
        RemoveProvince = Array.Empty<string>();
    }
}
