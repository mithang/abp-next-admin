using LINGYUN.Abp.WeChat.Work.Messages;
using LINGYUN.Abp.WeChat.Work.Messages.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LINGYUN.Abp.WeChat.Work.Message;
public class WeChatWorkMessageSender_Tests : AbpWeChatWorkTestBase
{
    protected IWeChatWorkMessageSender Sender { get; }
    public WeChatWorkMessageSender_Tests()
    {
        Sender = GetRequiredService<IWeChatWorkMessageSender>();
    }

    [Theory]
    [InlineData("1000002")]
    public async Task Send_Text_Message_Test(string agentId)
    {
        var text = new TextMessage("Bưu kiện của bạn đã đến, vui lòng mang theo thẻ nhân viên đến trung tâm bưu kiện để nhận.\nTrước khi đi, bạn có thể xem<a href=\"http://work.weixin.qq.com\">video trực tiếp của trung tâm bưu kiện</a> để tránh xếp hàng một cách thông minh.");
        var message = new WeChatWorkTextMessage(agentId, text)
        {
            ToUser = "@all"
        };

        var response = await Sender.SendAsync(message);
        response.IsSuccessed.ShouldBeTrue();
    }

    [Theory]
    [InlineData("1000002", "wr0vTBJwAAFY2xtHp76qFMRDcVXu42qw")]
    public async Task Send_AppChat_Text_Message_Test(string agentId, string chatId)
    {
        var text = new TextMessage("Bưu kiện của bạn đã đến, vui lòng mang theo thẻ nhân viên đến trung tâm bưu kiện để nhận.\nTrước khi đi, bạn có thể xem<a href=\"http://work.weixin.qq.com\">video trực tiếp của trung tâm bưu kiện</a> để tránh xếp hàng một cách thông minh.");
        var message = new WeChatWorkAppChatTextMessage(agentId, chatId, text);

        var response = await Sender.SendAsync(message);
        response.IsSuccessed.ShouldBeTrue();
    }

    [Theory]
    [InlineData("1000002")]
    public async Task Send_Markdown_Message_Test(string agentId)
    {
        var markdown = new MarkdownMessage("Phòng họp của bạn đã được đặt, sau đó sẽ được đồng bộ vào`hộp thư`  \n>**Chi tiết sự kiện**  \n>Hạng mục：<font color=\"info\">Họp</font>  \n>Người tổ chức：@miglioguan  \n>Người tham gia：@miglioguan、@kunliu、@jamdeezhou、@kanexiong、@kisonwang  \n>  \n>Phòng họp：<font color=\"info\">Quảng Châu TIT tầng 1 phòng 301</font>  \n>Ngày tháng：<font color=\"warning\">Ngày 18 tháng 5 năm 2018</font>  \n>Thời gian：<font color=\"comment\">Sáng 9:00-11:00</font>  \n>  \n>Vui lòng tham dự đúng giờ.  \n>  \n>Nếu cần sửa thông tin cuộc họp, vui lòng bấm:[Sửa thông tin cuộc họp](https://work.weixin.qq.com)");
        var message = new WeChatWorkMarkdownMessage(agentId, markdown)
        {
            ToUser = "@all"
        };

        var response = await Sender.SendAsync(message);
        response.IsSuccessed.ShouldBeTrue();
    }

    [Theory]
    [InlineData("1000002", "wr0vTBJwAAFY2xtHp76qFMRDcVXu42qw")]
    public async Task Send_AppChat_Markdown_Message_Test(string agentId, string chatId)
    {
        var markdown = new MarkdownMessage("Phòng họp của bạn đã được đặt, sau đó sẽ được đồng bộ vào`hộp thư`  \n>**Chi tiết sự kiện**  \n>Hạng mục：<font color=\"info\">Họp</font>  \n>Người tổ chức：@miglioguan  \n>Người tham gia：@miglioguan、@kunliu、@jamdeezhou、@kanexiong、@kisonwang  \n>  \n>Phòng họp：<font color=\"info\">Quảng Châu TIT tầng 1 phòng 301</font>  \n>Ngày tháng：<font color=\"warning\">Ngày 18 tháng 5 năm 2018</font>  \n>Thời gian：<font color=\"comment\">Sáng 9:00-11:00</font>  \n>  \n>Vui lòng tham dự đúng giờ.  \n>  \n>Nếu cần sửa thông tin cuộc họp, vui lòng bấm:[Sửa thông tin cuộc họp](https://work.weixin.qq.com)");
        var message = new WeChatWorkAppChatMarkdownMessage(agentId, chatId, markdown);

        var response = await Sender.SendAsync(message);
        response.IsSuccessed.ShouldBeTrue();
    }

    [Theory]
    [InlineData("1000002")]
    public async Task Send_Text_Template_Card_Message_Test(string agentId)
    {
        var cardAction = new TemplateCardCardAction("https://work.weixin.qq.com");
        var template = new TextTemplateCard(cardAction, Guid.NewGuid().ToString("D"))
        {
            Source = new TemplateCardSource("url của hình ảnh", "url của hình ảnh", DescriptionColor.Black),
            ActionMenu = new TemplateCardActionMenu(
                new List<TemplateCardAction>
                {
                    new TemplateCardAction("A","Chấp nhận nhận thông báo đẩy"),
                    new TemplateCardAction("B","Không nhận thông báo đẩy nữa"),
                },
                "Văn bản giải thích phụ trợ tương tác của thẻ"),
            MainTitle = new TemplateCardMainTitle("Chào mừng bạn sử dụng WeChat Doanh nghiệp", "Bạn bè của bạn đang mời bạn tham gia WeChat Doanh nghiệp"),
            QuoteArea = new TemplateCardQuoteArea("https://work.weixin.qq.com", "Kiểu trích dẫn của WeChat Doanh nghiệp", "WeChat Doanh nghiệp thật dễ dùng"),
            EmphasisContent = new TemplateCardEmphasisContent("100", "Dữ liệu cốt lõi"),
            SubTitle = "Tải WeChat Doanh nghiệp còn có thể nhận lì xì!",
            HorizontalContents = new List<TemplateCardHorizontalContent>
            {
                TemplateCardHorizontalContent.None("Người mời","Trương Tam"),
                TemplateCardHorizontalContent.FromUrl("Trang web chính thức của WeChat Doanh nghiệp","https://work.weixin.qq.com", "Bấm để truy cập"),
                //TemplateCardHorizontalContent.FromMedia("Tải WeChat Doanh nghiệp","media_id của tệp", "WeChat Doanh nghiệp.apk"),
                //TemplateCardHorizontalContent.FromUser("Thông tin nhân viên","Bấm để xem", "Trương Tam"),
            },
            Jumps = new List<TemplateCardJump>
            {
                new TemplateCardJump("Trang web chính thức của WeChat Doanh nghiệp","https://work.weixin.qq.com"),
                new TemplateCardJump("Chuyển đến mini-program","Chuyển đến mini-program","/index.html"),
            },
        };
        var message = new WeChatWorkTemplateCardMessage(agentId, template)
        {
            ToUser = "@all"
        };

        var response = await Sender.SendAsync(message);
        response.IsSuccessed.ShouldBeTrue();
    }

    [Theory]
    [InlineData("cee71c5b-6e6a-478a-aafe-fe612198ffbd")]
    public async Task Send_Webhook_Text_Template_Card_Message_Test(string webhookKey)
    {
        var message = new WeChatWorkWebhookTemplateCardMessage(
            new WebhookTextNoticeCardMessage(
                WebhookTemplateCardAction.Link("https://developer.work.weixin.qq.com/document/path/99110"),
                new WebhookTemplateCardMainTitle("Thông báo phê duyệt nghỉ phép", "Đơn xin nghỉ phép của bạn đã được phê duyệt, vui lòng vào xem!"),
                source: WebhookTemplateCardSource.Black("https://wwcdn.weixin.qq.com/node/wework/images/wecom-logo.a61830413b.svg", "WeChat Doanh nghiệp"),
                horizontalContents: new List<WebhookTemplateCardHorizontalContent>
                {
                    WebhookTemplateCardHorizontalContent.Default("Số phiếu phê duyệt", "QJ20251000000136"),
                    WebhookTemplateCardHorizontalContent.Default("Ngày nghỉ phép", "2025/10/01-2025/10/10"),
                    WebhookTemplateCardHorizontalContent.Default("Thời gian phê duyệt", "2025-10-01 15:30:00"),
                    WebhookTemplateCardHorizontalContent.Default("Ghi chú phê duyệt", "Làm tốt việc chấm công và bàn giao công việc"),
                },
                jumps: new List<WebhookTemplateCardJump>
                {
                    WebhookTemplateCardJump.Link("Vào OA để xem", "https://developer.work.weixin.qq.com/document/path/99110")
                }));

        var response = await Sender.SendAsync(webhookKey, message);
        response.IsSuccessed.ShouldBeTrue();
    }
}
