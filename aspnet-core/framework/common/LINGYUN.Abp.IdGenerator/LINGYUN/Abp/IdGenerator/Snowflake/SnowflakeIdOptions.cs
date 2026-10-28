namespace LINGYUN.Abp.IdGenerator.Snowflake;

public class SnowflakeIdOptions
{
    /// <summary>
    /// Id máy
    /// </summary>
    public int WorkerId { get; set; }
    /// <summary>
    /// Độ dài Id máy
    /// </summary>
    public int WorkerIdBits { get; set; }
    /// <summary>
    /// Id trung tâm dữ liệu
    /// </summary>
    public int DatacenterId { get; set; }
    /// <summary>
    /// Độ dài Id trung tâm dữ liệu
    /// </summary>
    public int DatacenterIdBits { get; set; }
    /// <summary>
    /// Số thứ tự 12 bit
    /// </summary>
    public long Sequence { get; set; }

    public int SequenceBits { get; set; }
    /// <summary>
    /// Khi thời gian bị lùi lại thì dùng ID trước đó
    /// </summary>
    public bool UsePreviousInTimeRollback { get; set; }

    public SnowflakeIdOptions()
    {
        WorkerIdBits = 5;
        DatacenterIdBits = 5;
        Sequence = 0L;
        SequenceBits = 12;
        UsePreviousInTimeRollback = true;
    }
}
