using System.Collections.Generic;
using System.Xml.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Common.Members.Models;

[XmlRoot("Item")]
public class MemberExtendAttribute
{
    /// <summary>
    /// Thuộc tính mở rộng
    /// </summary>
    [XmlElement("Item")]
    public List<MemberExtend>? Items { get;set; }
}

public class MemberExtend
{
    /// <summary>
    /// Loại thuộc tính mở rộng: 0-văn bản, 1-trang web
    /// </summary>
    [XmlElement("Type")]
    public byte Type { get; set; }
    /// <summary>
    /// Tên thuộc tính mở rộng
    /// </summary>
    [XmlElement("Name")]
    public string Name { get; set; } = default!;
    /// <summary>
    /// Nội dung thuộc tính văn bản
    /// </summary>
    [XmlElement("Text", IsNullable = true)]
    public MemberTextExtend? Text { get; set; }
    /// <summary>
    /// Nội dung thuộc tính Web
    /// </summary>
    [XmlElement("Web", IsNullable = true)]
    public MemberWebExtend? Web { get; set; }
}

/// <summary>
/// Loại thuộc tính văn bản, điền khi loại thuộc tính mở rộng là 0
/// </summary>
[XmlRoot("Text")]
public class MemberTextExtend 
{
    /// <summary>
    /// Nội dung thuộc tính văn bản
    /// </summary>
    [XmlElement("Value")]
    public string Value { get; set; } = default!;
}
/// <summary>
/// Thuộc tính loại trang web, điền khi loại thuộc tính mở rộng là 1
/// </summary>
[XmlRoot("Web")]
public class MemberWebExtend
{
    /// <summary>
    /// Tiêu đề hiển thị của trang web
    /// </summary>
    [XmlElement("Title")]
    public string Title { get; set; } = default!;
    /// <summary>
    /// URL của trang web
    /// </summary>
    [XmlElement("Url")]
    public string Url { get; set; } = default!;
}
