# LINGYUN.Abp.BackgroundTasks.ExceptionHandling

Triển khai thông báo khi job nền thực thi gặp ngoại lệ, mặc định gửi thông báo bằng Email    

## Cấu hình sử dụng

Tham chiếu module theo nhu cầu  

```csharp
[DependsOn(typeof(AbpBackgroundTasksExceptionHandlingModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Tham số Action

** Khi định nghĩa job, hãy chỉ định các tham số sau trong tham số; khi job thực thi thất bại sẽ gửi thông báo  

* to		Bắt buộc, địa chỉ email của người nhận  
* from		Tùy chọn, tên người gửi hiển thị trong tiêu đề email  
* body		Tùy chọn, nội dung email (là tham số bắt buộc nếu chưa chỉ định tên mẫu)  
* subject	Tùy chọn, tiêu đề email
* template	Tùy chọn, mẫu email  
* context	Tùy chọn, tham số ngữ cảnh khi sử dụng mẫu  
* culture	Tùy chọn, vùng văn hóa của mẫu khi sử dụng mẫu  
