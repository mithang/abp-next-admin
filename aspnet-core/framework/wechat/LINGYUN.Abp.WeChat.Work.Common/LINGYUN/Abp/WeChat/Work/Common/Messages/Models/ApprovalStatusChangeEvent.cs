using LINGYUN.Abp.WeChat.Common.Messages;
using System.Collections.Generic;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.Common.Messages.Models;
/// <summary>
/// Sự kiện thông báo trạng thái phê duyệt
/// </summary>
[EventName("open_approval_change")]
public class ApprovalStatusChangeEvent : WeChatWorkEventMessage
{
    /// <summary>
    /// Giá trị KEY sự kiện
    /// </summary>
    [XmlElement("EventKey")]
    public string EventKey { get; set; } = default!;
    /// <summary>
    /// Thông tin phê duyệt
    /// </summary>
    [XmlElement("ApprovalInfo")]
    public ApprovalInfo ApprovalInfo { get; set; } = default!;
    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<ApprovalStatusChangeEvent>(this);
    }
}

public class ApprovalInfo
{
    /// <summary>
    /// Số đơn phê duyệt, do nhà phát triển tự định nghĩa khi khởi tạo đơn
    /// </summary>
    [XmlElement("ThirdNo")]
    public string ThirdNo { get; set; } = default!;
    /// <summary>
    /// Tên mẫu phê duyệt
    /// </summary>
    [XmlElement("OpenSpName")]
    public string OpenSpName { get; set; } = default!;
    /// <summary>
    /// Id mẫu phê duyệt
    /// </summary>
    [XmlElement("OpenTemplateId")]
    public string OpenTemplateId { get; set; } = default!;
    /// <summary>
    /// Trạng thái phê duyệt hiện tại của đơn:
    /// 1-Đang phê duyệt;
    /// 2-Đã thông qua;
    /// 3-Đã từ chối;
    /// 4-Đã hủy
    /// </summary>
    [XmlElement("OpenSpStatus")]
    public byte OpenSpStatus { get; set; }
    /// <summary>
    /// Thời gian nộp đơn
    /// </summary>
    [XmlElement("ApplyTime")]
    public int ApplyTime { get; set; }
    /// <summary>
    /// Tên người nộp đơn
    /// </summary>
    [XmlElement("ApplyUserName")]
    public string ApplyUserName { get; set; } = default!;
    /// <summary>
    /// Userid người nộp đơn
    /// </summary>
    [XmlElement("ApplyUserId")]
    public string ApplyUserId { get; set; } = default!;
    /// <summary>
    /// Phòng ban của người nộp đơn
    /// </summary>
    [XmlElement("ApplyUserParty")]
    public string? ApplyUserParty { get; set; }
    /// <summary>
    /// Ảnh đại diện người nộp đơn
    /// </summary>
    [XmlElement("ApplyUserImage")]
    public string? ApplyUserImage { get; set; }
    /// <summary>
    /// Thông tin quy trình phê duyệt
    /// </summary>
    [XmlElement("ApprovalNodes")]
    public List<ApprovalNode> ApprovalNodes { get; set; } = default!;
    /// <summary>
    /// Thông tin CC, có thể có nhiều người nhận CC
    /// </summary>
    [XmlElement("NotifyNodes")]
    public List<NotifyNode>? NotifyNodes { get; set; }
    /// <summary>
    /// Nút phê duyệt hiện tại: 0-Nút phê duyệt đầu tiên; 1-Nút phê duyệt thứ hai… cứ thế tiếp tục
    /// </summary>
    [XmlElement("approverstep")]
    public int ApproverStep { get; set; }
}

/// <summary>
/// Thông tin quy trình phê duyệt, có thể có nhiều nút phê duyệt
/// </summary>
[XmlRoot("ApprovalNode")]
public class ApprovalNode
{
    /// <summary>
    /// Trạng thái thao tác phê duyệt của nút:
    /// 1-Đang phê duyệt;
    /// 2-Đã đồng ý;
    /// 3-Đã từ chối;
    /// 4-Đã chuyển xét duyệt
    /// </summary>
    [XmlElement("NodeStatus")]
    public byte NodeStatus { get; set; }
    /// <summary>
    /// Thuộc tính nút phê duyệt:
    /// 1-Ký hoặc (một người ký);
    /// 2-Ký hội đồng
    /// </summary>
    [XmlElement("NodeAttr")]
    public byte NodeAttr { get; set; }
    /// <summary>
    /// Loại nút phê duyệt:
    /// 1-Thành viên cố định;
    /// 2-Nhãn;
    /// 3-Cấp trên
    /// </summary>
    [XmlElement("NodeType")]
    public byte NodeType { get; set; }
    /// <summary>
    /// Thông tin nút phê duyệt, khi nút là nhãn hoặc cấp trên, một nút có thể có nhiều nhánh
    /// </summary>
    [XmlElement("Items")]
    public List<ApprovalNodeItem> Items { get; set; } = default!;
}
/// <summary>
/// Nhánh nút phê duyệt, khi nút là nhãn hoặc cấp trên, một nút có thể có nhiều nhánh
/// </summary>
[XmlRoot("Item")]
public class ApprovalNodeItem
{
    /// <summary>
    /// Tên người phê duyệt của nhánh
    /// </summary>
    [XmlElement("ItemName")]
    public string ItemName { get; set; } = default!;
    /// <summary>
    /// Userid người phê duyệt của nhánh
    /// </summary>
    [XmlElement("ItemUserId")]
    public string ItemUserId { get; set; } = default!;
    /// <summary>
    /// Ảnh đại diện người phê duyệt của nhánh
    /// </summary>
    [XmlElement("ItemImage")]
    public string? ItemImage { get; set; }
    /// <summary>
    /// Trạng thái thao tác phê duyệt của nhánh:
    /// 1-Đang phê duyệt;
    /// 2-Đã đồng ý;
    /// 3-Đã từ chối;
    /// 4-Đã chuyển xét duyệt
    /// </summary>
    [XmlElement("ItemStatus")]
    public byte ItemStatus { get; set; }
    /// <summary>
    /// Ý kiến phê duyệt của người phê duyệt nhánh
    /// </summary>
    [XmlElement("ItemSpeech")]
    public string? ItemSpeech { get; set; }
    /// <summary>
    /// Ý kiến phê duyệt của người phê duyệt nhánh
    /// </summary>
    [XmlElement("ItemOpTime")]
    public int ItemOpTime { get; set; }
}
/// <summary>
/// Thông tin người nhận CC
/// </summary>
[XmlRoot("NotifyNode")]
public class NotifyNode
{
    /// <summary>
    /// Tên người nhận CC
    /// </summary>
    [XmlElement("ItemName")]
    public string ItemName { get; set; } = default!;
    /// <summary>
    /// Userid người nhận CC
    /// </summary>
    [XmlElement("ItemUserId")]
    public string ItemUserId { get; set; } = default!;
    /// <summary>
    /// Ảnh đại diện người nhận CC
    /// </summary>
    [XmlElement("ItemImage")]
    public string? ItemImage { get; set; }
}