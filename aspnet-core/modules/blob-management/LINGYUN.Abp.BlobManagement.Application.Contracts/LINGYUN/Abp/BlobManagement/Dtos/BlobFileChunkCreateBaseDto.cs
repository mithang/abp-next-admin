using System.ComponentModel.DataAnnotations;

namespace LINGYUN.Abp.BlobManagement.Dtos;

public abstract class BlobFileChunkCreateBaseDto : BlobFileCreateBaseDto
{
    /// <summary>
    /// Kích thước block thông thường
    /// </summary>
    [Required]
    public long ChunkSize { get; set; }
    /// <summary>
    /// Kích thước block hiện tại
    /// </summary>
    [Required]
    public long CurrentChunkSize { get; set; }
    /// <summary>
    /// Chỉ số của block đang tải lên
    /// </summary>
    [Required]
    public int ChunkNumber { get; set; }
    /// <summary>
    /// Tổng số block
    /// </summary>
    [Required]
    public int TotalChunks { get; set; }
}
