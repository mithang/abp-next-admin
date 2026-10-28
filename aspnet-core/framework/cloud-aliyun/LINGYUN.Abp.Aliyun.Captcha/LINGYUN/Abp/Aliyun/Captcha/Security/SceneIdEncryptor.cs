using System;
using System.Security.Cryptography;
using System.Text;
using Volo.Abp.DependencyInjection;

namespace LINGYUN.Abp.Aliyun.Captcha.Security;

public class SceneIdEncryptor : ISceneIdEncryptor, ISingletonDependency
{
    // IV cố định 16 byte (kích thước khối AES)
    private const int IvLengthBytes = 16;

    /// <summary>
    /// Mã hóa sceneId để tạo EncryptedSceneId
    /// </summary>
    /// <param name="sceneId">Định danh nghiệp vụ của mã xác minh (CaptchaAppid gốc)</param>
    /// <param name="ekeyStr">ekey lấy từ console (dùng làm cơ sở cho khóa, chuỗi Base64)</param>
    /// <param name="expireTimeSec">Thời gian hết hạn của bản mã, đơn vị giây, phạm vi 1~86400</param>
    /// <returns>Chuỗi mã hóa Base64: EncryptedSceneId (IV + dữ liệu đã mã hóa)</returns>
    public virtual string Encrypt(string sceneId, string ekeyStr, int expireTimeSec)
    {
        if (expireTimeSec <= 0 || expireTimeSec > 86400)
        {
            throw new ArgumentOutOfRangeException(
                nameof(expireTimeSec),
                "expireTimeSec must be between 1 and 86400 seconds.");
        }

        // Lấy dấu thời gian hiện tại (cấp giây)
        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();

        // ==================== Bước 1: Xây dựng khóa Key (32 byte) ====================
        var keyBytes = Convert.FromBase64String(ekeyStr);

        if (keyBytes.Length != 32)
        {
            throw new ArgumentException("ekey must decode to 32 bytes for AES-256.", nameof(ekeyStr));
        }

        // ==================== Bước 2: Xây dựng bản rõ và thực hiện mã hóa AES-256-CBC ====================
        // Định dạng bản rõ: sceneId&timestamp&expireTime
        var plaintext = $"{sceneId}&{timestamp}&{expireTimeSec}";
        var plaintextBytes = Encoding.UTF8.GetBytes(plaintext);

        // Tạo ngẫu nhiên IV 16 byte
        var iv = new byte[IvLengthBytes];
        RandomNumberGenerator.Fill(iv);

        byte[] encryptedBytes;

        using (var aes = Aes.Create())
        {
            aes.KeySize = 256;
            aes.BlockSize = 128;
            aes.Mode = CipherMode.CBC;
            aes.Padding = PaddingMode.PKCS7;
            aes.Key = keyBytes;
            aes.IV = iv;

            using var encryptor = aes.CreateEncryptor();
            encryptedBytes = encryptor.TransformFinalBlock(plaintextBytes, 0, plaintextBytes.Length);
        }

        // ==================== Bước 3: Nối IV + bản mã và mã hóa Base64 ====================
        var result = new byte[IvLengthBytes + encryptedBytes.Length];
        Buffer.BlockCopy(iv, 0, result, 0, IvLengthBytes);
        Buffer.BlockCopy(encryptedBytes, 0, result, IvLengthBytes, encryptedBytes.Length);

        return Convert.ToBase64String(result);
    }
}
