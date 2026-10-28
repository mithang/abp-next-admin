# LINGYUN.Abp.Aliyun

Mô-đun tích hợp Alibaba Cloud SDK.

Tham khảo: [Tài liệu API Alibaba Cloud](https://help.aliyun.com/document_detail/28763.html)

## Tính năng

- Cung cấp tích hợp SDK cơ sở cho dịch vụ Alibaba Cloud
- Hỗ trợ xác thực Alibaba Cloud RAM (kiểm soát truy cập)
- Hỗ trợ truy cập bằng STS Token
- Hỗ trợ dịch vụ SMS của Alibaba Cloud
- Hỗ trợ lưu trữ đối tượng của Alibaba Cloud (OSS)
- Cung cấp hỗ trợ bộ nhớ đệm phân tán, tối ưu kịch bản đồng thời cao

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpAliyunModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Giải thích các mục cấu hình

### Cấu hình xác thực

- **AliyunSettingNames.Authorization.RegionId**

  - Giải thích: Khu vực dịch vụ Alibaba Cloud
  - Loại: Tùy chọn
  - Giá trị mặc định: default
  - Ví dụ: oss-cn-hangzhou

- **AliyunSettingNames.Authorization.AccessKeyId**

  - Giải thích: AccessKey ID của tài khoản RAM Alibaba Cloud
  - Loại: Bắt buộc
  - Cách lấy: Truy cập bảng điều khiển Alibaba Cloud - Kiểm soát truy cập

- **AliyunSettingNames.Authorization.AccessKeySecret**
  - Giải thích: AccessKey Secret của tài khoản RAM
  - Loại: Bắt buộc
  - Cách lấy: Truy cập bảng điều khiển Alibaba Cloud - Kiểm soát truy cập

### Cấu hình STS Token

- **AliyunSettingNames.Authorization.UseSecurityTokenService**

  - Giải thích: Có sử dụng STS Token để truy cập hay không
  - Loại: Tùy chọn
  - Giá trị mặc định: false
  - Khuyến nghị: Nên bật, để tăng tính bảo mật

- **AliyunSettingNames.Authorization.RamRoleArn**

  - Giải thích: ARN của vai trò RAM Alibaba Cloud
  - Loại: Bắt buộc khi bật STS Token
  - Định dạng: acs:ram::$accountID:role/$roleName

- **AliyunSettingNames.Authorization.RoleSessionName**

  - Giải thích: Tên token do người dùng tự định nghĩa
  - Loại: Tùy chọn
  - Công dụng: Dùng cho kiểm toán truy cập

- **AliyunSettingNames.Authorization.DurationSeconds**

  - Giải thích: Thời gian hết hạn của token người dùng
  - Loại: Tùy chọn
  - Giá trị mặc định: 3000
  - Đơn vị: giây

- **AliyunSettingNames.Authorization.Policy**
  - Giải thích: Chính sách quyền
  - Loại: Tùy chọn
  - Định dạng: Chuỗi JSON

### Cấu hình dịch vụ SMS

```json
{
  "Settings": {
    "Abp.Aliyun.Sms": {
      "Domain": "dysmsapi.aliyuncs.com", // Tên miền API, mặc định là dysmsapi.aliyuncs.com
      "Version": "2017-05-25", // Phiên bản API, mặc định là 2017-05-25
      "ActionName": "SendSms", // Tên phương thức API, mặc định là SendSms
      "DefaultSignName": "", // Chữ ký SMS mặc định
      "DefaultTemplateCode": "", // Mã mẫu SMS mặc định
      "DefaultPhoneNumber": "", // Số điện thoại nhận SMS mặc định
      "VisableErrorToClient": "false" // Có hiển thị thông tin lỗi cho client hay không
    }
  }
}
```

## Các khu vực khả dụng

Mô-đun này hỗ trợ các khu vực Alibaba Cloud sau:

- Khu vực Trung Quốc

  - Hoa Bắc 1 (Thanh Đảo) - cn-qingdao
  - Hoa Bắc 2 (Bắc Kinh) - cn-beijing
  - Hoa Bắc 3 (Trương Gia Khẩu) - cn-zhangjiakou
  - Hoa Bắc 5 (Hô Hòa Hạo Đặc) - cn-huhehaote
  - Hoa Đông 1 (Hàng Châu) - cn-hangzhou
  - Hoa Đông 2 (Thượng Hải) - cn-shanghai
  - Hoa Nam 1 (Thâm Quyến) - cn-shenzhen
  - Hoa Nam 2 (Hà Nguyên) - cn-heyuan
  - Hoa Nam 3 (Quảng Châu) - cn-guangzhou
  - Tây Nam 1 (Thành Đô) - cn-chengdu

- Hồng Kông và các khu vực hải ngoại
  - Hồng Kông - cn-hongkong
  - Hoa Kỳ (Thung lũng Silicon) - us-west-1
  - Hoa Kỳ (Virginia) - us-east-1
  - Nhật Bản (Tokyo) - ap-northeast-1
  - Hàn Quốc (Seoul) - ap-northeast-2
  - Singapore - ap-southeast-1
  - Úc (Sydney) - ap-southeast-2
  - Malaysia (Kuala Lumpur) - ap-southeast-3
  - Indonesia (Jakarta) - ap-southeast-5
  - Philippines (Manila) - ap-southeast-6
  - Thái Lan (Bangkok) - ap-southeast-7
  - Ấn Độ (Mumbai) - ap-south-1
  - Đức (Frankfurt) - eu-central-1
  - Anh (Luân Đôn) - eu-west-1
  - UAE (Dubai) - me-east-1

## Tối ưu hiệu năng

- Trong kịch bản đồng thời cao, nên bật bộ nhớ đệm phân tán để tăng hiệu năng
- Khi sử dụng STS Token, Token sẽ tự động được lưu đệm cho đến trước khi hết hạn
- Nên đặt DurationSeconds hợp lý, tránh làm mới Token quá thường xuyên

## Các mô-đun liên quan

- [LINGYUN.Abp.Aliyun.SettingManagement](../LINGYUN.Abp.Aliyun.SettingManagement/README.md) - Cung cấp chức năng quản lý cấu hình
- [LINGYUN.Abp.Aliyun.Features](../LINGYUN.Abp.Aliyun.Features/README.md) - Cung cấp chức năng quản lý tính năng

[Nhấn để xem tài liệu tiếng Anh](README.EN.md)
