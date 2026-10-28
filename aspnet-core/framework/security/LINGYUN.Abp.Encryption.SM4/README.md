# LINGYUN.Abp.Encryption.SM4

Mô-đun mã hóa dữ liệu, sử dụng thuật toán quốc mật SM4, dùng **AbpStringEncryptionOptions** để cấu hình chuyển đổi liền mạch (độ dài khóa cố định 128 bit để đáp ứng yêu cầu thuật toán)  

## Cấu hình sử dụng


```csharp
[DependsOn(typeof(AbpEncryptionSM4Module))]
public class YouProjectModule : AbpModule
{
  // other
}
```
