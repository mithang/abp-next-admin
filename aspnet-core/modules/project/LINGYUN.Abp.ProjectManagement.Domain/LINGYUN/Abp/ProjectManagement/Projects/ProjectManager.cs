using ICSharpCode.SharpZipLib.Zip;
using LINGYUN.Abp.ProjectManagement.Templates;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Cli;
using Volo.Abp.Domain.Services;
using Volo.Abp.IO;
using Volo.Abp.Uow;

namespace LINGYUN.Abp.ProjectManagement.Projects
{
    public class ProjectManager : DomainService
    {
        protected IProjectRepository ProjectRepository { get; }
        protected ITemplateRepository TemplateRepository { get; }

        protected CliService Service => LazyServiceProvider.LazyGetRequiredService<CliService>();
        protected IUnitOfWorkManager UnitOfWorkManager => LazyServiceProvider.LazyGetRequiredService<IUnitOfWorkManager>();

        public ProjectManager(
            IProjectRepository projectRepository,
            ITemplateRepository templateRepository)
        {
            ProjectRepository = projectRepository;
            TemplateRepository = templateRepository;
        }

        public async virtual Task<Project> CreateAsync(Project project)
        {
            if (await ProjectRepository.CheckNameAsync(project.Name))
            {
                throw new BusinessException("");
            }
            project = await ProjectRepository.InsertAsync(project);

            return project;
        }

        public async virtual Task<Project> UpdateAsync(Project project)
        {
            project = await ProjectRepository.UpdateAsync(project);

            return project;
        }

        public async virtual Task DeleteAsync(Project project)
        {
            await ProjectRepository.DeleteAsync(project);
        }

        public async virtual Task<bool> BuildAsync(Project project)
        {
            using var unitOfWork = UnitOfWorkManager.Begin();
            try
            {
                var projectTemplate = await ProjectRepository.FindTemplateAsync(project.Id);

                var template = await TemplateRepository.GetAsync(projectTemplate.TemplateId);

                // Tạo danh sách tham số
                var projectBuildArgs = projectTemplate.Options
                    .Select(x => new { x.Key, x.Value });
                if (projectTemplate.ExtraProperties.Any())
                {
                    projectBuildArgs = projectBuildArgs.Union(
                        projectTemplate.ExtraProperties
                            .Select(x => new { x.Key, Value = x.Value?.ToString() }));
                }
                // Kiểm tra các tham số bắt buộc
                var ignoredArgs = template.GetMustOptions().Where(x => !projectBuildArgs.Any(y => x.Key.Equals(y.Key)));
                if (ignoredArgs.Any())
                {
                    project.BuildFailed(Clock, new Exception($"Tạo dự án thất bại, thiếu các tham số bắt buộc: {ignoredArgs.Select(x => x.Key).JoinAsString(";")}"));
                }
                else
                {
                    // Lấy ID dự án làm đường dẫn lưu trữ
                    var path = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        project.Id.ToString());
                    var argsList = new List<string>
                    {
                        "new", // lệnh new
                        "--skip-cli-version-check", // không kiểm tra phiên bản cli
                        project.Name,
                        "-o", // thư mục đầu ra
                        path
                    };

                    foreach (var option in projectBuildArgs)
                    {
                        argsList.Add(option.Key);
                        if (!option.Value.IsNullOrWhiteSpace())
                        {
                            var value = option.Value;
                            if (value.Contains(" "))
                            {
                                if (!value.StartsWith("\""))
                                {
                                    value = "\"" + value;
                                }
                                if (!value.EndsWith("\""))
                                {
                                    value += "\"";
                                }
                            }
                            argsList.Add(value);
                        }
                    }

                    await Service.RunAsync(argsList.ToArray());
                    project.BuildSuccess(Clock);
                }
            }
            catch (Exception ex)
            {
                project.BuildFailed(Clock, ex);
            }

            await ProjectRepository.UpdateAsync(project);

            await unitOfWork.CompleteAsync();

            return project.Status == BuildStatus.Successed;
        }

        public async virtual Task AddPackagesAsync()
        {

        }

        public async virtual Task<byte[]> DownloadAsync(Project project)
        {
            var projectDir = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        project.Id.ToString());
            var projectZipFile = Path.Combine(projectDir, project.Name + ".zip");
            FileHelper.DeleteIfExists(projectZipFile);

            if (!Directory.Exists(projectDir))
            {
                throw new BusinessException("");
            }
            var zip = new FastZip();
            zip.CreateZip(projectZipFile, projectDir, true, null);

            return await FileHelper.ReadAllBytesAsync(projectZipFile);
        }
    }
}
