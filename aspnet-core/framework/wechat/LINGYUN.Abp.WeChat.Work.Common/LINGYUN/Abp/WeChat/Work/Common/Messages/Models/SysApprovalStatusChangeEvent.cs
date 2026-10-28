using LINGYUN.Abp.WeChat.Common.Messages;
using System;
using System.Collections.Generic;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.Common.Messages.Models;
/// <summary>
/// Sự kiện thông báo thay đổi trạng thái phê duyệt của “ứng dụng phê duyệt” WeChat Doanh nghiệp
/// </summary>
[EventName("sys_approval_change")]
public class SysApprovalStatusChangeEvent : WeChatWorkEventMessage
{
    /// <summary>
    /// Thông tin phê duyệt
    /// </summary>
    [XmlElement("ApprovalInfo")]
    public SysApprovalInfo ApprovalInfo { get; set; } = default!;

    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<SysApprovalStatusChangeEvent>(this);
    }
}

public class SysApprovalInfo
{
    /// <summary>
    /// Số phê duyệt (kiểu chuỗi)
    /// </summary>
    [XmlElement("SpNoStr")]
    public string SpNoStr { get; set; } = default!;
    /// <summary>
    /// Tên loại đơn phê duyệt (tên mẫu phê duyệt)
    /// </summary>
    [XmlElement("SpName")]
    public string SpName { get; set; } = default!;
    /// <summary>
    /// Trạng thái đơn: 1-Đang phê duyệt; 2-Đã thông qua; 3-Đã từ chối; 4-Đã thu hồi; 6-Thu hồi sau khi thông qua; 7-Đã xóa; 10-Đã thanh toán
    /// </summary>
    [XmlElement("SpStatus")]
    public byte SpStatus { get; set; }
    /// <summary>
    /// Id mẫu phê duyệt. Có thể lấy trong “Lấy chi tiết đơn phê duyệt”, “Thông báo callback thay đổi trạng thái phê duyệt”, hoặc trong liên kết trang chỉnh sửa mẫu của mẫu phê duyệt.
    /// </summary>
    [XmlElement("TemplateId")]
    public string TemplateId { get; set; } = default!;
    /// <summary>
    /// Thời gian nộp đơn phê duyệt, dấu thời gian Unix
    /// </summary>
    [XmlElement("ApplyTime")]
    public int ApplyTime { get; set; }
    /// <summary>
    /// Thông tin người nộp đơn
    /// </summary>
    [XmlElement("Applyer")]
    public SysApprovalApplyer Applyer { get; set; } = default!;
    /// <summary>
    /// Thông tin quy trình phê duyệt, có thể có nhiều nút phê duyệt.
    /// </summary>
    [XmlElement("SpRecord")]
    public List<SysApprovalRecord>? SpRecord { get; set; }
    /// <summary>
    /// Thông tin gửi bản sao, có thể có nhiều nút gửi bản sao
    /// </summary>
    [XmlElement("Notifyer")]
    public List<SysApprovalNotifyer>? Notifyer { get; set; }
    /// <summary>
    /// Thông tin ghi chú của đơn phê duyệt, có thể có nhiều nút ghi chú
    /// </summary>
    [XmlElement("Comments")]
    public List<SysApprovalComment>? Comments { get; set; }
    /// <summary>
    /// Danh sách quy trình phê duyệt
    /// </summary>
    [XmlElement("ProcessList")]
    public List<SysApprovalProcess>? ProcessList { get; set; }
    /// <summary>
    /// Loại thay đổi trạng thái đơn phê duyệt: 1-Nộp đơn; 2-Đồng ý; 3-Từ chối; 4-Chuyển xét duyệt; 5-Đôn đốc; 6-Thu hồi; 8-Thu hồi sau khi thông qua; 10-Thêm ghi chú; 11-Trả lại cho người phê duyệt được chỉ định; 12-Thêm người phê duyệt; 13-Ký thêm và đồng ý; 14-Đã xử lý; 15-Đã chuyển giao
    /// </summary>
    [XmlElement("StatuChangeEvent")]
    public byte StatuChangeEvent { get; set; }
    /// <summary>
    /// Số phê duyệt
    /// </summary>
    /// <remarks>
    /// Đơn phê duyệt của trường học/cục không trả về trường này, các loại đơn phê duyệt khác sẽ trả về trường này, không khuyến nghị sử dụng trường này
    /// </remarks>
    [XmlElement("SpNo")]
    [Obsolete("Đơn phê duyệt của trường học/cục không trả về trường này, các loại đơn phê duyệt khác sẽ trả về trường này, không khuyến nghị sử dụng trường này")]
    public string? SpNo { get; set; }
}

public class SysApprovalApplyer
{
    /// <summary>
    /// Userid của người nộp đơn
    /// </summary>
    [XmlElement("UserId")]
    public string UserId { get; set; } = default!;
    /// <summary>
    /// Pid phòng ban của người nộp đơn
    /// </summary>
    [XmlElement("Party")]
    public string? Party { get; set; }
}

public class SysApprovalRecord
{
    /// <summary>
    /// Trạng thái nút phê duyệt: 1-Đang phê duyệt; 2-Đã đồng ý; 3-Đã từ chối; 4-Đã chuyển xét duyệt
    /// </summary>
    [XmlElement("SpStatus")]
    public byte SpStatus { get; set; }
    /// <summary>
    /// Phương thức phê duyệt của nút: 1-Một người ký là đủ; 2-Tất cả cùng ký
    /// </summary>
    [XmlElement("ApproverAttr")]
    public byte ApproverAttr { get; set; }
    /// <summary>
    /// Phương thức phê duyệt của nút: 1-Một người ký là đủ; 2-Tất cả cùng ký
    /// </summary>
    [XmlElement("Details")]
    public List<SysApprovalRecordDetail>? Details { get; set; }
}

public class SysApprovalRecordDetail
{
    /// <summary>
    /// Người phê duyệt nhánh
    /// </summary>
    [XmlElement("Approver")]
    public SysApprovalApplyer Approver { get; set; } = default!;
    /// <summary>
    /// Trường ý kiến phê duyệt
    /// </summary>
    [XmlElement("Speech")]
    public string? Speech { get; set; }
    /// <summary>
    /// Trạng thái phê duyệt của người phê duyệt nhánh: 1-Đang phê duyệt; 2-Đã đồng ý; 3-Đã từ chối; 4-Đã chuyển xét duyệt
    /// </summary>
    [XmlElement("SpStatus")]
    public byte SpStatus { get; set; }
    /// <summary>
    /// Thời gian thao tác phê duyệt của người phê duyệt nhánh, 0 là chưa thao tác
    /// </summary>
    [XmlElement("SpTime")]
    public int SpTime { get; set; }
    /// <summary>
    /// Tệp đính kèm ý kiến phê duyệt của người phê duyệt nhánh, gán giá trị là media_id; cách dùng cụ thể xem: Tài liệu - Lấy tài liệu tạm thời
    /// </summary>
    [XmlElement("Attach")]
    public string? Attach { get; set; }
}

public class SysApprovalNotifyer
{
    /// <summary>
    /// Userid của người nhận bản sao của nút
    /// </summary>
    [XmlElement("UserId")]
    public string UserId { get; set; } = default!;
}

public class SysApprovalComment
{
    /// <summary>
    /// Thông tin người ghi chú
    /// </summary>
    [XmlElement("CommentUserInfo")]
    public SysApprovalCommenter CommentUserInfo { get; set; } = default!;
    /// <summary>
    /// Thời gian nộp ghi chú
    /// </summary>
    [XmlElement("CommentTime")]
    public int CommentTime { get; set; }
    /// <summary>
    /// Nội dung văn bản ghi chú
    /// </summary>
    [XmlElement("CommentContent")]
    public string? CommentContent { get; set; }
    /// <summary>
    /// Id ghi chú
    /// </summary>
    [XmlElement("CommentId")]
    public string CommentId { get; set; } = default!;
    /// <summary>
    /// Tệp đính kèm ý kiến ghi chú, giá trị là media_id của tệp đính kèm
    /// </summary>
    [XmlElement("Attach")]
    public string? Attach { get; set; }
}

public class SysApprovalCommenter
{
    /// <summary>
    /// Userid của người nhận bản sao của nút
    /// </summary>
    [XmlElement("UserId")]
    public string UserId { get; set; } = default!;
}

public class SysApprovalProcess
{
    /// <summary>
    /// Nút quy trình
    /// </summary>
    [XmlElement("NodeList")]
    public List<SysApprovalProcessNode>? NodeList { get; set; }
}

public class SysApprovalProcessNode
{
    /// <summary>
    /// Loại nút: 1 Người phê duyệt, 2 Người nhận bản sao, 3 Người xử lý
    /// </summary>
    [XmlElement("NodeType")]
    public byte NodeType { get; set; }
    /// <summary>
    /// Trạng thái nút: 1-Đang phê duyệt; 2-Đồng ý; 3-Từ chối; 4-Chuyển xét duyệt; 11-Trả lại cho người phê duyệt được chỉ định; 12-Ký thêm; 13-Đồng ý và ký thêm; 14-Xử lý; 15-Chuyển giao
    /// </summary>
    [XmlElement("SpStatus")]
    public byte SpStatus { get; set; }
    /// <summary>
    /// Cách xử lý nhiều người: 1-Cùng ký; 2-Một người ký là đủ; 3-Phê duyệt lần lượt
    /// </summary>
    [XmlElement("ApvRel")]
    public byte ApvRel { get; set; }
    /// <summary>
    /// Danh sách nút con
    /// </summary>
    [XmlElement("SubNodeList")]
    public List<SysApprovalProcessSubNode>? SubNodeList { get; set; }
}

public class SysApprovalProcessSubNode
{
    /// <summary>
    /// Thông tin người xử lý
    /// </summary>
    [XmlElement("UserInfo")]
    public SysApprovalProcesser UserInfo { get; set; } = default!;
    /// <summary>
    /// Ý kiến phê duyệt/xử lý
    /// </summary>
    [XmlElement("Speech")]
    public string? Speech { get; set; }
    /// <summary>
    /// Trạng thái nút con: 1-Đang phê duyệt; 2-Đồng ý; 3-Từ chối; 4-Chuyển xét duyệt; 11-Trả lại cho người phê duyệt được chỉ định; 12-Ký thêm; 13-Đồng ý và ký thêm; 14-Xử lý; 15-Chuyển giao
    /// </summary>
    [XmlElement("SpYj")]
    public byte SpYj { get; set; }
    /// <summary>
    /// Thời gian thao tác
    /// </summary>
    [XmlElement("Sptime")]
    public int Sptime { get; set; }
    /// <summary>
    /// Tệp đính kèm ý kiến ghi chú, giá trị là media_id của tệp đính kèm
    /// </summary>
    [XmlElement("MediaIds")]
    public string? MediaIds { get; set; }
}

public class SysApprovalProcesser
{
    /// <summary>
    /// Userid của người xử lý	
    /// </summary>
    [XmlElement("UserId")]
    public string UserId { get; set; } = default!;
}