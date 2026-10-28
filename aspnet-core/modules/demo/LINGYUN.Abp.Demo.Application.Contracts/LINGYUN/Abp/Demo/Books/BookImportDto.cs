using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace LINGYUN.Abp.Demo.Books;
public class BookImportDto
{
    [Required]
    [StringLength(128)]
    [DisplayName("Tên")]
    public string Name { get; set; } = default!;

    [Required]
    [DisplayName("Loại")]
    public BookType Type { get; set; } = BookType.Undefined;

    [Required]
    [DataType(DataType.Date)]
    [DisplayName("Ngày xuất bản")]
    public DateTime PublishDate { get; set; } = DateTime.Now;

    [Required]
    [DisplayName("Giá")]
    public float Price { get; set; }

    public Guid AuthorId { get; set; }

    [DisplayName("Tác giả")]
    public string AuthorName { get; set; } = default!;
}
