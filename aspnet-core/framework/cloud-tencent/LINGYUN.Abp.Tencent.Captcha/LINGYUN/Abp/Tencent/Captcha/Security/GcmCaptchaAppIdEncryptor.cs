using System;
using System.Security.Cryptography;
using System.Text;

namespace LINGYUN.Abp.Tencent.Captcha.Security;

public class GcmCaptchaAppIdEncryptor : ICaptchaAppIdEncryptor
{
    private const int GcmTagLengthBits = 128; // 16 byte = 128 bit
    private const int GcmTagLengthBytes = GcmTagLengthBits / 8; // 16
    private const int IvLengthBytes = 12;     // GCM khuyến nghị IV 12 byte

    public string Encrypt(string plaintext, byte[] key, byte[] iv, byte[]? aad = null)
    {
        ArgumentNullException.ThrowIfNull(plaintext);
        ArgumentNullException.ThrowIfNull(key);
        ArgumentNullException.ThrowIfNull(iv);

        if (key.Length != 32)
            throw new ArgumentException("Key must be 32 bytes for AES-256.", nameof(key));
        if (iv.Length != IvLengthBytes)
            throw new ArgumentException($"IV must be {IvLengthBytes} bytes for GCM.", nameof(iv));

        var plaintextBytes = Encoding.UTF8.GetBytes(plaintext);

        // Bộ đệm đầu ra: bản mã + tag
        var ciphertextWithTag = new byte[plaintextBytes.Length + GcmTagLengthBytes];
        var tag = ciphertextWithTag.AsSpan(plaintextBytes.Length, GcmTagLengthBytes);
        var ciphertext = ciphertextWithTag.AsSpan(0, plaintextBytes.Length);

        // Trong .NET 10, hàm khởi tạo AesGcm cần chỉ định rõ độ dài tag
        using var aesGcm = new AesGcm(key, GcmTagLengthBytes);

        aesGcm.Encrypt(
            nonce: iv,
            plaintext: plaintextBytes,
            ciphertext: ciphertext,
            tag: tag,
            associatedData: aad);

        // Nối IV + bản mã + tag
        var ivAndCiphertext = new byte[iv.Length + ciphertextWithTag.Length];
        Buffer.BlockCopy(iv, 0, ivAndCiphertext, 0, iv.Length);
        Buffer.BlockCopy(ciphertextWithTag, 0, ivAndCiphertext, iv.Length, ciphertextWithTag.Length);

        return Convert.ToBase64String(ivAndCiphertext);
    }

    public byte[] PadKey(byte[] appSecretKey)
    {
        ArgumentNullException.ThrowIfNull(appSecretKey);
        if (appSecretKey.Length == 0)
            throw new ArgumentException("appSecretKey must not be empty.", nameof(appSecretKey));

        if (appSecretKey.Length >= 32)
            return appSecretKey;

        var key = new byte[32];
        var srcPos = 0;
        for (var i = 0; i < 32; i++)
        {
            key[i] = appSecretKey[srcPos];
            srcPos++;
            if (srcPos >= appSecretKey.Length)
                srcPos = 0;
        }
        return key;
    }
}
