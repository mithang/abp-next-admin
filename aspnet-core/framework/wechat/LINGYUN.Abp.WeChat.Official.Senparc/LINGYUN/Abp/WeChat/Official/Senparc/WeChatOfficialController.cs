using Microsoft.AspNetCore.Mvc;
using Senparc.NeuChar.MessageHandlers;
using Senparc.Weixin.MP;
using Senparc.Weixin.MP.Entities.Request;
using System.Threading.Tasks;
using Volo.Abp.AspNetCore.Mvc;

namespace LINGYUN.Abp.WeChat.Official.Senparc;

[Area("wechat-official")]
[Route("api/wechat/official")]
public class WeChatOfficialController : AbpControllerBase
{
    private readonly AbpWeChatOfficialOptionsFactory _optionsFactory;

    public WeChatOfficialController(AbpWeChatOfficialOptionsFactory optionsFactory)
    {
        _optionsFactory = optionsFactory;
    }



    /// <summary>
    /// Địa chỉ xác minh phía backend WeChat (dùng Get), Url trong “thông tin cấu hình giao diện” của backend WeChat điền ví dụ: http://weixin.senparc.com/weixin
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> Get(PostModel postModel, string echostr)
    {
        var options = await _optionsFactory.CreateAsync();
        if (CheckSignature.Check(postModel.Signature, postModel.Timestamp, postModel.Nonce, options.Token))
        {
            return Content(echostr); //Trả về chuỗi ngẫu nhiên tức là xác minh thành công
        }
        else
        {
            return Content(
                "failed:" + postModel.Signature + "," + 
                CheckSignature.GetSignature(postModel.Timestamp, postModel.Nonce, options.Token) + "。" +
                "Nếu bạn thấy câu này trong trình duyệt, nghĩa là địa chỉ này có thể được dùng làm Url backend của tài khoản công khai WeChat, lưu ý giữ Token nhất quán.");
        }
    }

    /// <summary>
    /// Sau khi người dùng gửi tin nhắn, nền tảng WeChat tự động Post một request tới đây và chờ phản hồi XML.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Post(PostModel postModel)
    {
        var options = await _optionsFactory.CreateAsync();
        if (!CheckSignature.Check(postModel.Signature, postModel.Timestamp, postModel.Nonce, options.Token))
        {
            return Content("Tham số không hợp lệ!");
        }

        postModel.Token = options.Token;//Giữ nhất quán với cài đặt backend của mình
        postModel.EncodingAESKey = options.EncodingAESKey;//Giữ nhất quán với cài đặt backend của mình
        postModel.AppId = options.AppId;//Giữ nhất quán với cài đặt backend của mình

        //MessageHandler tùy chỉnh, mọi xử lý phán đoán chi tiết cho request WeChat đều ở đây.
        var messageHandler = new WeChatOfficialMessageHandler(Request.Body, postModel);//Nhận tin nhắn

        #region Cài đặt chống trùng lặp tin nhắn + cài đặt ưu tiên gọi phương thức đồng bộ/bất đồng bộ

        /* Nếu cần thêm chức năng chống trùng lặp tin nhắn, chỉ cần bật tính năng OmitRepeatedMessage, SDK sẽ tự xử lý.
         * Nhận tin nhắn trùng lặp thường là do máy chủ WeChat chưa kịp nhận phản hồi, sẽ gửi liên tục 2-5 tin nhắn có nội dung giống nhau RequestMessage */
        messageHandler.OmitRepeatedMessage = true;//Mặc định đã ở trạng thái bật, đây chỉ là minh họa, cũng có thể đặt thành false để tắt tính năng trong request lần này

        //Khi phương thức đồng bộ bị ghi đè mà phương thức bất đồng bộ chưa bị ghi đè, thử gọi phương thức đồng bộ
        messageHandler.DefaultMessageHandlerAsyncEvent = DefaultMessageHandlerAsyncEvent.SelfSynicMethod;

        #endregion

        messageHandler.SaveRequestMessageLog();//Ghi log Request (tùy chọn)

        await messageHandler.ExecuteAsync(HttpContext.RequestAborted);//Thực thi quá trình xử lý WeChat (quan trọng, bước thứ hai)

        messageHandler.SaveResponseMessageLog();//Ghi log Response (tùy chọn)

        return Ok();
    }
}
