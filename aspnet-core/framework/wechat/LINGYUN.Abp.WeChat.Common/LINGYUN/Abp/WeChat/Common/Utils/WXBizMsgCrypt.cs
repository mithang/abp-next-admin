using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using System.Collections;
//using System.Web;
using System.Security.Cryptography;
//-40001 ： Lỗi xác minh chữ ký
//-40002 :  Phân tích xml thất bại
//-40003 :  Mã hóa sha tạo chữ ký thất bại
//-40004 :  AESKey không hợp lệ
//-40005 :  Lỗi kiểm tra corpid
//-40006 :  Mã hóa AES thất bại
//-40007 ： Giải mã AES thất bại
//-40008 ： Buffer thu được sau khi giải mã không hợp lệ
//-40009 :  Ngoại lệ mã hóa base64
//-40010 :  Ngoại lệ giải mã base64
namespace LINGYUN.Abp.WeChat.Common.Utils;
#nullable disable
public class WXBizMsgCrypt
{
    string m_sToken;
    string m_sEncodingAESKey;
    string m_sReceiveId;
    enum WXBizMsgCryptErrorCode
    {
        WXBizMsgCrypt_OK = 0,
        WXBizMsgCrypt_ValidateSignature_Error = -40001,
        WXBizMsgCrypt_ParseXml_Error = -40002,
        WXBizMsgCrypt_ComputeSignature_Error = -40003,
        WXBizMsgCrypt_IllegalAesKey = -40004,
        WXBizMsgCrypt_ValidateCorpid_Error = -40005,
        WXBizMsgCrypt_EncryptAES_Error = -40006,
        WXBizMsgCrypt_DecryptAES_Error = -40007,
        WXBizMsgCrypt_IllegalBuffer = -40008,
        WXBizMsgCrypt_EncodeBase64_Error = -40009,
        WXBizMsgCrypt_DecodeBase64_Error = -40010
    };

    //Hàm khởi tạo
    // @param sToken: Trang quản trị WeChat Doanh nghiệp, Token do nhà phát triển cài đặt
    // @param sEncodingAESKey: Trang quản trị WeChat Doanh nghiệp, EncodingAESKey do nhà phát triển cài đặt
    // @param sReceiveId: Ý nghĩa khác nhau trong các ngữ cảnh khác nhau, xem hướng dẫn tài liệu để biết chi tiết
    public WXBizMsgCrypt(string sToken, string sEncodingAESKey, string sReceiveId)
    {
        m_sToken = sToken;
        m_sReceiveId = sReceiveId;
        m_sEncodingAESKey = sEncodingAESKey;
    }

    //Xác minh URL
    // @param sMsgSignature: Chuỗi chữ ký, tương ứng với tham số URL msg_signature
    // @param sTimeStamp: Dấu thời gian, tương ứng với tham số URL timestamp
    // @param sNonce: Chuỗi ngẫu nhiên, tương ứng với tham số URL nonce
    // @param sEchoStr: Chuỗi ngẫu nhiên, tương ứng với tham số URL echostr
    // @param sReplyEchoStr: echostr sau khi giải mã, có hiệu lực khi return trả về 0
    // @return：Thành công trả về 0, thất bại trả về mã lỗi tương ứng
    public int VerifyURL(string sMsgSignature, string sTimeStamp, string sNonce, string sEchoStr, ref string sReplyEchoStr)
    {
        var ret = 0;
        if (m_sEncodingAESKey.Length != 43)
        {
            return (int)WXBizMsgCryptErrorCode.WXBizMsgCrypt_IllegalAesKey;
        }
        ret = VerifySignature(m_sToken, sTimeStamp, sNonce, sEchoStr, sMsgSignature);
        if (0 != ret)
        {
            return ret;
        }
        sReplyEchoStr = "";
        var cpid = "";
        try
        {
            sReplyEchoStr = Cryptography.AES_decrypt(sEchoStr, m_sEncodingAESKey, ref cpid); //m_sReceiveId);
        }
        catch (Exception)
        {
            sReplyEchoStr = "";
            return (int)WXBizMsgCryptErrorCode.WXBizMsgCrypt_DecryptAES_Error;
        }
        if (cpid != m_sReceiveId)
        {
            sReplyEchoStr = "";
            return (int)WXBizMsgCryptErrorCode.WXBizMsgCrypt_ValidateCorpid_Error;
        }
        return 0;
    }

    // Kiểm tra tính xác thực của tin nhắn, và lấy văn bản thuần sau khi giải mã
    // @param sMsgSignature: Chuỗi chữ ký, tương ứng với tham số URL msg_signature
    // @param sTimeStamp: Dấu thời gian, tương ứng với tham số URL timestamp
    // @param sNonce: Chuỗi ngẫu nhiên, tương ứng với tham số URL nonce
    // @param sPostData: Bản mã, tương ứng với dữ liệu của yêu cầu POST
    // @param sMsg: Văn bản gốc sau khi giải mã, có hiệu lực khi return trả về 0
    // @return: Thành công trả về 0, thất bại trả về mã lỗi tương ứng
    public int DecryptMsg(string sMsgSignature, string sTimeStamp, string sNonce, string sPostData, ref string sMsg)
    {
        if (m_sEncodingAESKey.Length != 43)
        {
            return (int)WXBizMsgCryptErrorCode.WXBizMsgCrypt_IllegalAesKey;
        }
        var doc = new XmlDocument();
        XmlNode root;
        string sEncryptMsg;
        try
        {
            doc.LoadXml(sPostData);
            root = doc.FirstChild;
            sEncryptMsg = root["Encrypt"].InnerText;
        }
        catch (Exception)
        {
            return (int)WXBizMsgCryptErrorCode.WXBizMsgCrypt_ParseXml_Error;
        }
        //verify signature
        var ret = 0;
        ret = VerifySignature(m_sToken, sTimeStamp, sNonce, sEncryptMsg, sMsgSignature);
        if (ret != 0)
            return ret;
        //decrypt
        var cpid = "";
        try
        {
            sMsg = Cryptography.AES_decrypt(sEncryptMsg, m_sEncodingAESKey, ref cpid);
        }
        catch (FormatException)
        {
            sMsg = "";
            return (int)WXBizMsgCryptErrorCode.WXBizMsgCrypt_DecodeBase64_Error;
        }
        catch (Exception)
        {
            sMsg = "";
            return (int)WXBizMsgCryptErrorCode.WXBizMsgCrypt_DecryptAES_Error;
        }
        if (cpid != m_sReceiveId)
            return (int)WXBizMsgCryptErrorCode.WXBizMsgCrypt_ValidateCorpid_Error;
        return 0;
    }

    //Mã hóa và đóng gói tin nhắn mà tài khoản doanh nghiệp trả lời người dùng
    // @param sReplyMsg: Tin nhắn mà tài khoản doanh nghiệp chờ trả lời người dùng, chuỗi định dạng xml
    // @param sTimeStamp: Dấu thời gian, có thể tự tạo, cũng có thể dùng timestamp của tham số URL
    // @param sNonce: Chuỗi ngẫu nhiên, có thể tự tạo, cũng có thể dùng nonce của tham số URL
    // @param sEncryptMsg: Bản mã có thể trả lời trực tiếp cho người dùng sau khi mã hóa, bao gồm chuỗi định dạng xml của msg_signature, timestamp, nonce, encrypt,
    //						có hiệu lực khi return trả về 0
    // return：Thành công trả về 0, thất bại trả về mã lỗi tương ứng
    public int EncryptMsg(string sReplyMsg, string sTimeStamp, string sNonce, ref string sEncryptMsg)
    {
        if (m_sEncodingAESKey.Length != 43)
        {
            return (int)WXBizMsgCryptErrorCode.WXBizMsgCrypt_IllegalAesKey;
        }
        var raw = "";
        try
        {
            raw = Cryptography.AES_encrypt(sReplyMsg, m_sEncodingAESKey, m_sReceiveId);
        }
        catch (Exception)
        {
            return (int)WXBizMsgCryptErrorCode.WXBizMsgCrypt_EncryptAES_Error;
        }
        var MsgSigature = "";
        var ret = 0;
        ret = GenarateSinature(m_sToken, sTimeStamp, sNonce, raw, ref MsgSigature);
        if (0 != ret)
            return ret;
        sEncryptMsg = "";

        var EncryptLabelHead = "<Encrypt><![CDATA[";
        var EncryptLabelTail = "]]></Encrypt>";
        var MsgSigLabelHead = "<MsgSignature><![CDATA[";
        var MsgSigLabelTail = "]]></MsgSignature>";
        var TimeStampLabelHead = "<TimeStamp><![CDATA[";
        var TimeStampLabelTail = "]]></TimeStamp>";
        var NonceLabelHead = "<Nonce><![CDATA[";
        var NonceLabelTail = "]]></Nonce>";
        sEncryptMsg = sEncryptMsg + "<xml>" + EncryptLabelHead + raw + EncryptLabelTail;
        sEncryptMsg = sEncryptMsg + MsgSigLabelHead + MsgSigature + MsgSigLabelTail;
        sEncryptMsg = sEncryptMsg + TimeStampLabelHead + sTimeStamp + TimeStampLabelTail;
        sEncryptMsg = sEncryptMsg + NonceLabelHead + sNonce + NonceLabelTail;
        sEncryptMsg += "</xml>";
        return 0;
    }

    public class DictionarySort : IComparer
    {
        public int Compare(object oLeft, object oRight)
        {
            var sLeft = oLeft as string;
            var sRight = oRight as string;
            var iLeftLength = sLeft.Length;
            var iRightLength = sRight.Length;
            var index = 0;
            while (index < iLeftLength && index < iRightLength)
            {
                if (sLeft[index] < sRight[index])
                    return -1;
                else if (sLeft[index] > sRight[index])
                    return 1;
                else
                    index++;
            }
            return iLeftLength - iRightLength;

        }
    }
    //Verify Signature
    private static int VerifySignature(string sToken, string sTimeStamp, string sNonce, string sMsgEncrypt, string sSigture)
    {
        var hash = "";
        var ret = 0;
        ret = GenarateSinature(sToken, sTimeStamp, sNonce, sMsgEncrypt, ref hash);
        if (ret != 0)
            return ret;
        if (hash == sSigture)
            return 0;
        else
        {
            return (int)WXBizMsgCryptErrorCode.WXBizMsgCrypt_ValidateSignature_Error;
        }
    }

    public static int GenarateSinature(string sToken, string sTimeStamp, string sNonce, string sMsgEncrypt, ref string sMsgSignature)
    {
        var AL = new ArrayList();
        AL.Add(sToken);
        AL.Add(sTimeStamp);
        AL.Add(sNonce);
        AL.Add(sMsgEncrypt);
        AL.Sort(new DictionarySort());
        var raw = "";
        for (var i = 0; i < AL.Count; ++i)
        {
            raw += AL[i];
        }

        SHA1 sha;
        ASCIIEncoding enc;
        var hash = "";
        try
        {
#if NET462
            sha = new SHA1CryptoServiceProvider();
#else
            sha = SHA1.Create();
#endif
            enc = new ASCIIEncoding();
            byte[] dataToHash = enc.GetBytes(raw);
            byte[] dataHashed = sha.ComputeHash(dataToHash);
            hash = BitConverter.ToString(dataHashed).Replace("-", "");
            hash = hash.ToLower();
        }
        catch (Exception)
        {
            return (int)WXBizMsgCryptErrorCode.WXBizMsgCrypt_ComputeSignature_Error;
        }
        sMsgSignature = hash;
        return 0;
    }
}
#nullable enable