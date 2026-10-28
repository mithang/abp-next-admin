using System;
using System.ComponentModel;
using Volo.Abp.Application.Dtos;

namespace LINGYUN.Abp.Demo.Books;
public class BookDto : AuditedEntityDto<Guid>
{
    [DisplayName("Tên")]
    public string Name { get; set; } = default!;

    [DisplayName("Loại")]
    public BookType Type { get; set; }

    [DisplayName("Ngày xuất bản")]
    public DateTime PublishDate { get; set; }

    [DisplayName("Giá")]
    public float Price { get; set; }

    public Guid AuthorId { get; set; }

    [DisplayName("Tác giả")]
    public string AuthorName { get; set; } = default!;
}
