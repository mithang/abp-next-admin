using LINGYUN.Abp.BackgroundTasks;
using System;
using System.Collections.Generic;
using Volo.Abp;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace LINGYUN.Abp.TaskManagement;

public class BackgroundJobInfo : AuditedAggregateRoot<string>, IMultiTenant
{
    public virtual Guid? TenantId { get; protected set; }
    /// <summary>
    /// Tên tác vụ
    /// </summary>
    public virtual string Name { get; protected set; } = default!;
    /// <summary>
    /// Nhóm tác vụ
    /// </summary>
    public virtual string Group { get; protected set; } = default!;
    /// <summary>
    /// Loại tác vụ
    /// </summary>
    public virtual string Type { get; protected set; } = default!;
    /// <summary>
    /// Kết quả thực thi lần trước
    /// </summary>
    public virtual string? Result { get; protected set; }
    /// <summary>
    /// Tham số tác vụ
    /// </summary>
    public virtual ExtraPropertyDictionary Args { get; set; } = default!;
    /// <summary>
    /// Trạng thái tác vụ
    /// </summary>
    public virtual JobStatus Status { get; protected set; }
    /// <summary>
    /// Có bật hay không
    /// </summary>
    public virtual bool IsEnabled { get; set; }
    /// <summary>
    /// Mô tả
    /// </summary>
    public virtual string? Description { get; set; }
    /// <summary>
    /// Thời lượng timeout độc quyền của tác vụ (giây)
    /// 0 hoặc nhỏ hơn thì không có hiệu lực
    /// </summary>
    public virtual int LockTimeOut { get; set; }
    /// <summary>
    /// Thời gian bắt đầu
    /// </summary>
    public virtual DateTime BeginTime { get; protected set; }
    /// <summary>
    /// Thời gian kết thúc
    /// </summary>
    public virtual DateTime? EndTime { get; protected set; }
    /// <summary>
    /// Thời gian thực thi lần trước
    /// </summary>
    public virtual DateTime? LastRunTime { get; protected set; }
    /// <summary>
    /// Thời gian thực thi lần tới
    /// </summary>
    public virtual DateTime? NextRunTime { get; protected set; }
    /// <summary>
    /// Danh mục tác vụ
    /// </summary>
    public virtual JobType JobType { get; protected set; }
    /// <summary>
    /// Biểu thức Cron, nếu là tác vụ liên tục thì cần chỉ định
    /// </summary>
    public virtual string? Cron { get; protected set; }
    /// <summary>
    /// Nguồn công việc
    /// </summary>
    public virtual JobSource Source { get; protected set; }
    /// <summary>
    /// Mức độ ưu tiên của tác vụ
    /// </summary>
    public virtual JobPriority Priority { get; protected set; }
    /// <summary>
    /// Số lần kích hoạt
    /// </summary>
    public virtual int TriggerCount { get; set; }
    /// <summary>
    /// Số lần thử lại khi thất bại
    /// </summary>
    public virtual int TryCount { get; set; }
    /// <summary>
    /// Giới hạn thử lại khi thất bại
    /// Mặc định: 50
    /// </summary>
    public virtual int MaxTryCount { get; set; }
    /// <summary>
    /// Số lần thực thi tối đa
    /// Mặc định: 0, không giới hạn
    /// </summary>
    public virtual int MaxCount { get; set; }
    /// <summary>
    /// Khoảng thời gian, đơn vị giây, xung đột với biểu thức Cron
    /// Mặc định: 300
    /// </summary>
    public virtual int Interval { get; protected set; }
    /// <summary>
    /// Thất bại liên tục và sẽ không thực thi lại
    /// </summary>
    public virtual bool IsAbandoned { get; set; }
    /// <summary>
    /// Chỉ định nút chạy công việc
    /// </summary>
    public virtual string? NodeName { get; protected set; }
    protected BackgroundJobInfo() { }

    public BackgroundJobInfo(
        string id,
        string name,
        string group,
        string type,
        IDictionary<string, object?> args,
        DateTime beginTime,
        DateTime? endTime = null,
        JobPriority priority = JobPriority.Normal,
        JobSource source = JobSource.None,
        int maxCount = 0,
        int maxTryCount = 50,
        string? nodeName = null,
        Guid? tenantId = null) : base(id)
    {
        Name = Check.NotNullOrWhiteSpace(name, nameof(name), BackgroundJobInfoConsts.MaxNameLength);
        Group = Check.NotNullOrWhiteSpace(group, nameof(group), BackgroundJobInfoConsts.MaxGroupLength);
        Type = Check.NotNullOrWhiteSpace(type, nameof(type), BackgroundJobInfoConsts.MaxTypeLength);
        Priority = priority;
        Source = source;
        BeginTime = beginTime;
        EndTime = endTime;

        MaxCount = maxCount;
        MaxTryCount = maxTryCount;
        NodeName = Check.Length(nodeName, nameof(nodeName), BackgroundJobInfoConsts.MaxNodeNameLength);
        TenantId = tenantId;

        Status = JobStatus.Queuing;

        // TODO: Có cần chuyển tham số sang một thực thể khác không? 
        // Đề xuất tham số tác vụ là càng tối thiểu càng tốt, chỉ lưu trữ thông tin quan trọng
        Args = new ExtraPropertyDictionary();
        if (args != null)
        {
            foreach (var arg in args)
            {
                Args[arg.Key] = arg.Value;
            }
        }
    }

    public void SetPeriodJob(string cron)
    {
        Cron = Check.NotNullOrWhiteSpace(cron, nameof(cron), BackgroundJobInfoConsts.MaxCronLength);
        JobType = JobType.Period;
    }

    public void SetOnceJob(int interval)
    {
        Interval = interval;
        JobType = JobType.Once;
    }

    public void SetPersistentJob(int interval)
    {
        Interval = interval;
        JobType = JobType.Persistent;
    }

    public void SetLastRunTime(DateTime? lastRunTime)
    {
        LastRunTime = lastRunTime;
    }

    public void SetNextRunTime(DateTime? nextRunTime)
    {
        NextRunTime = nextRunTime;
    }

    public void SetResult(string? result)
    {
        if (result.IsNullOrWhiteSpace())
        {
            return;
        }
        if (result.Length > BackgroundJobInfoConsts.MaxResultLength)
        {
            result = result.Substring(0, BackgroundJobInfoConsts.MaxResultLength - 1);
        }

        Result = result;
    }

    public void SetStatus(JobStatus status)
    {
        Status = status;
    }

    public void SetPriority(JobPriority priority)
    {
        Priority = priority;
    }
}
