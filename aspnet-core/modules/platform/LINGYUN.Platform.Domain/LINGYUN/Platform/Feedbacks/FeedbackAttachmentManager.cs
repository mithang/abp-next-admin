using System.IO;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.BlobStoring;
using Volo.Abp.Domain.Services;
using Volo.Abp.IO;

namespace LINGYUN.Platform.Feedbacks;
public class FeedbackAttachmentManager : DomainService
{
    private const string DefaultSaveToApplication = "abp-application";
    private const string DefaultSaveToTempPath = "feedback-upload-tmp";

    private readonly IBlobContainer<FeedbackContainer> _blobContainer;
    private readonly IApplicationInfoAccessor _applicationInfoAccessor;

    public FeedbackAttachmentManager(
        IBlobContainer<FeedbackContainer> blobContainer,
        IApplicationInfoAccessor applicationInfoAccessor)
    {
        _blobContainer = blobContainer;
        _applicationInfoAccessor = applicationInfoAccessor;
    }

    /// <summary>
    /// Ghi luồng file vào bộ nhớ tạm thời
    /// </summary>
    /// <param name="stream">Luồng file</param>
    /// <returns>Trả về định danh file trong bộ nhớ tạm thời</returns>
    public async Task<FeedbackAttachmentTempFile> SaveToTempAsync(Stream stream)
    {
        var blobSize = stream.Length;
        var blobId = GuidGenerator.Create().ToString("N");
        var timeStampPath = Clock.Now.ToString("yyyy-MM-dd");

        var tempFilePath = Path.Combine(
            Path.GetTempPath(),
            _applicationInfoAccessor.ApplicationName ?? DefaultSaveToApplication,
            DefaultSaveToTempPath,
            timeStampPath);
        var tempSavedFile = Path.Combine(tempFilePath, $"{blobId}.png");

        DirectoryHelper.CreateIfNotExists(tempFilePath);

        using (var fs = new FileStream(tempSavedFile, FileMode.Create, FileAccess.Write))
        {
            await stream.CopyToAsync(fs);
        }

        return new FeedbackAttachmentTempFile
        {
            Path = timeStampPath,
            Size = blobSize,
            Id = blobId,
        };
    }
    /// <summary>
    /// Sao chép tệp đính kèm từ bộ nhớ tạm thời sang bộ nhớ blob
    /// </summary>
    /// <param name="feedback">Thực thể phản hồi của người dùng</param>
    /// <param name="file">File lưu trữ tạm thời của tệp đính kèm</param>
    /// <returns>Tệp đính kèm đã lưu</returns>
    public async Task<FeedbackAttachmentFile> CopyFromTempAsync(Feedback feedback, string filePtah, string fileId)
    {
        var fileName = $"{filePtah}/{fileId}.png";
        var tempFilePath = Path.Combine(
            Path.GetTempPath(),
            _applicationInfoAccessor.ApplicationName ?? DefaultSaveToApplication,
            DefaultSaveToTempPath);
        var tempFromFile = Path.Combine(tempFilePath, fileName);
        var blobFile = $"{fileId}.png";
        var saveToBlobFile = $"{feedback.Id}/{blobFile}";

        if (!File.Exists(tempFromFile))
        {
            throw new BusinessException(PlatformErrorCodes.FeedackAttachmentLoseEffectiveness)
                .WithData("Name", fileId);
        }
        FeedbackAttachmentFile attachmentFile;

        using (var fs = new FileStream(tempFromFile, FileMode.Open, FileAccess.Read))
        {
            await _blobContainer.SaveAsync(saveToBlobFile, fs, true);

            attachmentFile = new FeedbackAttachmentFile(blobFile, fs.Length);
        }

        FileHelper.DeleteIfExists(tempFromFile);

        return attachmentFile;
    }
    /// <summary>
    /// Tải xuống tệp đính kèm
    /// </summary>
    /// <param name="attachment">Thực thể tệp đính kèm</param>
    /// <returns>Luồng file tệp đính kèm</returns>
    public async Task<Stream> DownloadAsync(FeedbackAttachment attachment)
    {
        var blobFile = $"{attachment.FeedbackId}/{attachment.Name}";

        return await _blobContainer.GetAsync(blobFile);
    }
    /// <summary>
    /// Xóa tệp đính kèm
    /// </summary>
    /// <param name="attachment">Thực thể tệp đính kèm</param>
    /// <returns>Luồng file tệp đính kèm</returns>
    public async Task DeleteAsync(FeedbackAttachment attachment)
    {
        var blobFile = $"{attachment.FeedbackId}/{attachment.Name}";

        await _blobContainer.DeleteAsync(blobFile);
    }
}
