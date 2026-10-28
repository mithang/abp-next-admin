using System.Text.RegularExpressions;
using Volo.Abp.BlobStoring;
using Volo.Abp.DependencyInjection;

namespace LINGYUN.Abp.BlobStoring.Tencent;

public class TencentBlobNamingNormalizer : IBlobNamingNormalizer, ITransientDependency
{
    /// <summary>
    /// Quy tắc đặt tên đối tượng của Tencent Cloud
    /// https://cloud.tencent.com/document/product/436/13324
    /// </summary>
    /// <param name="blobName"></param>
    /// <returns></returns>
    public virtual string NormalizeBlobName(string blobName)
    {
        // Không được bắt đầu bằng dấu gạch chéo xuôi / hoặc dấu gạch chéo ngược \.
        blobName = Regex.Replace(blobName, "^/", string.Empty);
        blobName = blobName.StartsWith("\\") ? blobName.Substring(1) : blobName;

        // Trong khóa đối tượng không hỗ trợ các ký tự điều khiển ASCII sau
        // ký tự lên (↑), ký tự xuống (↓), ký tự phải (→), ký tự trái (←),
        // tương ứng với CAN(24), EM(25), SUB(26), ESC(27).
        blobName = blobName.Replace("↑", "");
        blobName = blobName.Replace("↓", "");
        blobName = blobName.Replace("←", "");
        blobName = blobName.Replace("→", "");
        
        // TODO: Yêu cầu thật nhiều... các phần khác tạm thời chưa viết

        return blobName;
    }

    /// <summary>
    /// Quy tắc đặt tên BucketName của Tencent Cloud
    /// https://cloud.tencent.com/document/product/436/13312
    /// </summary>
    /// <param name="containerName"></param>
    /// <returns></returns>
    public virtual string NormalizeContainerName(string containerName)
    {
        // Chỉ hỗ trợ chữ thường tiếng Anh và chữ số, tức [a-z, 0-9], dấu gạch ngang "-" và tổ hợp của chúng.
        containerName = containerName.ToLower();
        containerName = Regex.Replace(containerName, "[^a-z0-9-]", string.Empty);

        // Không được bắt đầu bằng dấu gạch ngang (-)
        containerName = Regex.Replace(containerName, "^-", string.Empty);
        // Không được kết thúc bằng dấu gạch ngang (-)
        containerName = Regex.Replace(containerName, "-$", string.Empty);

        // Số ký tự tối đa cho phép của tên bucket bị ảnh hưởng bởi số ký tự của tên viết tắt vùng và APPID, tổng số ký tự của tên miền yêu cầu đầy đủ tạo thành tối đa 60 ký tự.
        // Ví dụ tên miền yêu cầu 123456789012345678901-1250000000.cos.ap-beijing.myqcloud.com tổng cộng là 60 ký tự.
        if (containerName.Length > 60)
        {
            containerName = containerName.Substring(0, 60);
        }

        return containerName;
    }
}
