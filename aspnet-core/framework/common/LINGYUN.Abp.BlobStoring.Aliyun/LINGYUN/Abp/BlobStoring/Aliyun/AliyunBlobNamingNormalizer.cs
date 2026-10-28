using System;
using System.Text.RegularExpressions;
using Volo.Abp.BlobStoring;
using Volo.Abp.DependencyInjection;

namespace LINGYUN.Abp.BlobStoring.Aliyun;

public class AliyunBlobNamingNormalizer : IBlobNamingNormalizer, ITransientDependency
{
    /// <summary>
    /// Quy tắc đặt tên đối tượng của Alibaba Cloud
    /// https://help.aliyun.com/document_detail/31827.html?spm=a2c4g.11186623.6.607.37b332eaM3NKzY
    /// </summary>
    /// <param name="blobName"></param>
    /// <returns></returns>
    public virtual string NormalizeBlobName(string blobName)
    {
        // Không được bắt đầu bằng dấu gạch chéo xuôi (/) hoặc dấu gạch chéo ngược (\).
        return blobName
            .RemovePreFix("/")
            .RemovePreFix("\\");
    }

    /// <summary>
    /// Quy tắc đặt tên BucketName của Alibaba Cloud
    /// https://help.aliyun.com/document_detail/31885.html?spm=a2c4g.11186623.6.583.56081c62w6meOR
    /// </summary>
    /// <param name="containerName"></param>
    /// <returns></returns>
    public virtual string NormalizeContainerName(string containerName)
    {
        // Chữ thường, chữ số và dấu gạch ngang (-)
        containerName = containerName.ToLower();
        containerName = Regex.Replace(containerName, "[^a-z0-9-]", string.Empty);

        // Không được bắt đầu bằng dấu gạch ngang (-)
        containerName = Regex.Replace(containerName, "^-", string.Empty);
        // Không được kết thúc bằng dấu gạch ngang (-)
        containerName = Regex.Replace(containerName, "-$", string.Empty);

        // Độ dài phải nằm trong khoảng 3-63
        if (containerName.Length < 3)
        {
            var length = containerName.Length;
            for (var i = 0; i < 3 - length; i++)
            {
                containerName += "0";
            }
        }

        if (containerName.Length > 63)
        {
            containerName = containerName.Substring(0, 63);
        }

        return containerName;
    }
}
