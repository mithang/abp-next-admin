using System;
using System.Security.Cryptography;
using System.Text;

namespace LINGYUN.Abp.Tencent.Captcha.Security;

public class CbcCaptchaAppIdEncryptor : ICaptchaAppIdEncryptor
{
    private const int IvLengthBytes = 16; // IV ở chế độ CBC là 16 byte
    public string Encrypt(string plaintext, byte[] key, byte[] iv, byte[]? aad = null)
    {
        ArgumentNullException.ThrowIfNull(plaintext);
        ArgumentNullException.ThrowIfNull(key);
        ArgumentNullException.ThrowIfNull(iv);

        if (key.Length != 32)
            throw new ArgumentException("Key must be 32 bytes for AES-256.", nameof(key));
        if (iv.Length != IvLengthBytes)
            throw new ArgumentException($"IV must be {IvLengthBytes} bytes for CBC.", nameof(iv));

        var plaintextBytes = Encoding.UTF8.GetBytes(plaintext);

        byte[] encrypted;

        // Aes của .NET mặc định dùng đệm PKCS7, tương đương với PKCS5Padding của Java
        using (var aes = Aes.Create())
        {
            aes.KeySize = 256;
            aes.BlockSize = 128;
            aes.Mode = CipherMode.CBC;
            aes.Padding = PaddingMode.PKCS7;
            aes.Key = key;
            aes.IV = iv;

            using var encryptor = aes.CreateEncryptor();
            encrypted = encryptor.TransformFinalBlock(plaintextBytes, 0, plaintextBytes.Length);
        }

        // Nối IV + bản mã
        var ivAndCiphertext = new byte[iv.Length + encrypted.Length];
        Buffer.BlockCopy(iv, 0, ivAndCiphertext, 0, iv.Length);
        Buffer.BlockCopy(encrypted, 0, ivAndCiphertext, iv.Length, encrypted.Length);

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
