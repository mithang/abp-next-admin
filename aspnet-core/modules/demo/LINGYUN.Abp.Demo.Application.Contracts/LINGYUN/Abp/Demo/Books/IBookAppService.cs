using LINGYUN.Abp.DataProtection.Models;
using LINGYUN.Abp.Exporter;
using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace LINGYUN.Abp.Demo.Books;
public interface IBookAppService :
    IApplicationService,
    IExporterAppService<BookDto, BookExportListInput>,
    IImporterAppService<BookImportInput>
{
    Task<BookDto> CreateAsync(CreateBookDto input);

    Task<BookDto> UpdateAsync(Guid id, UpdateBookDto input);

    Task<BookDto> GetAsync(Guid id);

    Task DeleteAsync(Guid id);

    Task<PagedResultDto<BookDto>> GetListAsync(BookGetListInput input);

    Task<ListResultDto<AuthorLookupDto>> GetAuthorLookupAsync();
    /// <summary>
    /// Lấy quy tắc truy cập thực thể
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task<EntityTypeInfoModel> GetEntityRuleAsync(EntityTypeInfoGetModel input);
}