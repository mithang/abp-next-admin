# Thông báo tin nhắn WeChat doanh nghiệp

## Tính năng

* [Gửi tin nhắn ứng dụng](https://developer.work.weixin.qq.com/document/path/90236)
* [Gửi tin nhắn nhóm](https://developer.work.weixin.qq.com/document/path/90248)
* [Gửi tin nhắn Webhook](https://developer.work.weixin.qq.com/document/path/99110)


## Cách sử dụng

- Gửi tin nhắn Webhook
```csharp
public class Demo
{
	private readonly IWeChatWorkMessageSender _sender;
	
	public Demo(IWeChatWorkMessageSender sender)
	{
		_sender = sender;
	}

	public async Task Send()
	{
		await _sender.SendAsync(
            "693a91f6-7xxx-4bc4-97a0-0ec2sifa5aaa",
            new WeChatWorkWebhookTemplateCardMessage(
                new WebhookTextNoticeCardMessage(
                    WebhookTemplateCardAction.Link("https://developer.work.weixin.qq.com/document/path/99110"),
                    new WebhookTemplateCardMainTitle("Thông báo phê duyệt nghỉ phép", "Đơn xin nghỉ phép của bạn đã được phê duyệt, vui lòng vào xem!"),
                    source: WebhookTemplateCardSource.Black("https://wwcdn.weixin.qq.com/node/wework/images/wecom-logo.a61830413b.svg", "WeChat doanh nghiệp"),
                    horizontalContents: new List<WebhookTemplateCardHorizontalContent>
                    {
                        WebhookTemplateCardHorizontalContent.Default("Số đơn phê duyệt", "QJ20251000000136"),
                        WebhookTemplateCardHorizontalContent.Default("Ngày nghỉ phép", "2025/10/01-2025/10/10"),
                        WebhookTemplateCardHorizontalContent.Default("Thời gian phê duyệt", "2025-10-01 15:30:00"),
                        WebhookTemplateCardHorizontalContent.Default("Ghi chú phê duyệt", "Thực hiện tốt việc chấm công và bàn giao công việc"),
                    },
                    jumps: new List<WebhookTemplateCardJump>
                    {
                        WebhookTemplateCardJump.Link("Vào OA xem", "https://developer.work.weixin.qq.com/document/path/99110")
                    })));
	}
}
```


## Tài liệu thêm

* [Tài liệu WeChat doanh nghiệp](https://developer.work.weixin.qq.com/document/path/90664)

