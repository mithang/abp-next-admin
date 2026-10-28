# LINGYUN.Abp.Elsa.Notifications

Tích hợp thông báo quy trình làm việc, khi quy trình làm việc được kích hoạt sẽ phát hành thông báo sự kiện tương ứng    

## Trạng thái khả dụng

* Faulted:      Quy trình làm việc thực thi gặp lỗi  
* Cancelled:    Quy trình làm việc bị hủy  
* Completed:    Quy trình làm việc thực thi xong  
* Suspended:    Quy trình làm việc tạm dừng  


## Cấu hình sử dụng

```csharp

    [DependsOn(
        typeof(AbpElsaNotificationsModule)
        )]
    public class YouProjectModule : AbpModule
    {
    }
```

```csharp
    // Định nghĩa thông báo
    public class DemoNotificationDefinitionProvider : NotificationDefinitionProvider
    {
        public override void Define(INotificationDefinitionContext context)
        {
            var demoGroup = context.AddGroup("Group");

            // Do tính đa dạng của thông báo, cần dùng thông báo mẫu để truyền dữ liệu
            demoGroup.AddNotification("Faulted")
                .WithTemplate(template => { });
            demoGroup.AddNotification("Cancelled")
                .WithTemplate(template => { });
            demoGroup.AddNotification("Suspended")
                .WithTemplate(template => { });
            demoGroup.AddNotification("Completed")
                .WithTemplate(template => { });
        }
    }
```

```csharp

    // Định nghĩa quy trình làm việc
    public class DemoWorkflow : IWorkflow
    {
        public void Build(IWorkflowBuilder builder)
        {
            builder
                .WithFaultedNotification("Faulted")
                .WithCancelledNotification("Cancelled")
                .WithSuspendedNotification("Suspended")
                .WithCompletedNotification("Completed")
                .SetVariable("demo", context =>
                {
                    // Có thể truyền tham số tùy chỉnh, sẽ được ghi vào dữ liệu thông báo đã phát hành dưới dạng biến tạm thời
                    context.WithNotificationData("demo", "demo");
                    // Mã định danh tenant tùy chỉnh dùng để phát hành thông báo
                    context.WithNotificationTenantId(Guid.NewGuid());
                })
                .WriteLine("Start a workflow.")
                .WriteLine("Workflow finished.");
        }
    }
```