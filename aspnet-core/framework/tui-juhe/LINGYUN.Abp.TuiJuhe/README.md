# LINGYUN.Abp.TuiJuhe

Tích hợp TuiJuhe (chỉ áp dụng cho thông báo tin nhắn và nhân sự cụ thể, không hỗ trợ gửi hàng loạt)

Triển khai tài liệu Api liên quan đến TuiJuhe, sở hữu năng lực mở của TuiJuhe  

Chi tiết xem tài liệu TuiJuhe: https://tui.juhe.cn/docs 

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpTuiJuheModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Features

* TuiJuhe								Nhóm tính năng TuiJuhe  
* TuiJuhe.Enable						Bật TuiJuhe toàn cục
* TuiJuhe.Message.Enable				Bật kênh tin nhắn TuiJuhe toàn cục  
* TuiJuhe.Message						Đẩy tin nhắn TuiJuhe	
* TuiJuhe.Message.Enable				Bật đẩy tin nhắn TuiJuhe	
* TuiJuhe.Message.SendLimit				Số lần giới hạn đẩy tin nhắn TuiJuhe	
* TuiJuhe.Message.SendLimitInterval		Chu kỳ giới hạn đẩy tin nhắn TuiJuhe (giờ)	

## Settings

* TuiJuhe.Security.Token			Mã thông báo người dùng.  
