# LINGYUN.Abp.Tencent.TTS

Mô-đun dịch vụ tổng hợp giọng nói Tencent Cloud, tích hợp dịch vụ tổng hợp giọng nói Tencent Cloud vào ứng dụng ABP.

## Tính năng

* Hỗ trợ dịch vụ tổng hợp giọng nói Tencent Cloud (TTS)
* Hỗ trợ cấu hình đa tenant
* Dựa trên Tencent Cloud TTS SDK V20190823
* Cung cấp factory client TTS, hỗ trợ tạo client TTS động

## Cách dùng cơ bản

1. Thêm phụ thuộc mô-đun
```csharp
[DependsOn(typeof(AbpTencentTTSModule))]
public class YourModule : AbpModule
{
    // ...
}
```

2. Cấu hình dịch vụ Tencent Cloud
```json
{
  "Settings": {
    "LINGYUN.Abp.Tencent": {
      "SecretId": "SecretId Tencent Cloud của bạn",
      "SecretKey": "SecretKey Tencent Cloud của bạn"
    }
  }
}
```

3. Ví dụ sử dụng dịch vụ TTS
```csharp
public class YourService
{
    private readonly TencentCloudTTSClientFactory _ttsClientFactory;

    public YourService(TencentCloudTTSClientFactory ttsClientFactory)
    {
        _ttsClientFactory = ttsClientFactory;
    }

    public async Task TextToSpeechAsync(string text)
    {
        var ttsClient = await _ttsClientFactory.CreateAsync();
        // Sử dụng ttsClient để gọi API dịch vụ TTS Tencent Cloud
        // Cách sử dụng API chi tiết, vui lòng tham khảo tài liệu Tencent Cloud TTS SDK
    }
}
```

## Mô tả các mục cấu hình

### Cấu hình cơ bản

```json
{
  "Settings": {
    "Abp.TencentCloud": {
      "SecretId": "SecretId Tencent Cloud của bạn", // Lấy từ bảng điều khiển Tencent Cloud
      "SecretKey": "SecretKey Tencent Cloud của bạn", // Lấy từ bảng điều khiển Tencent Cloud
      "DurationSecond": "600" // Thời lượng phiên (giây)
    }
  }
}
```

### Cấu hình dịch vụ TTS

```json
{
  "Settings": {
    "Abp.TencentCloud.TTS": {
      "AppId": "", // ID ứng dụng TTS
      "VoiceType": "", // Giọng đọc, mặc định là "0"
      "Language": "1", // Ngôn ngữ, 1-Tiếng Trung, 2-Tiếng Anh
      "Speed": "0", // Tốc độ đọc, phạm vi: -2~2
      "Volume": "0", // Âm lượng, phạm vi: 0~10
      "ProjectId": "0" // ID dự án
    }
  }
}
```

## Tài liệu khác

* [Dịch vụ tổng hợp giọng nói Tencent Cloud](https://cloud.tencent.com/document/product/1073)
* [Tài liệu Tencent Cloud TTS SDK](https://cloud.tencent.com/document/product/1073/37927)

[English](./README.EN.md)
