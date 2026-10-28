using System;
using System.IO;
using Volo.Abp;

namespace LINGYUN.Abp.BlobManagement;

/// <summary>
/// Kiểm tra tên BlobManagement
/// </summary>
public static class BlobManagementNameValidator
{
    /// <summary>
    /// Các ký tự không được phép (hợp của các ký tự không hợp lệ trên các nền tảng, bao gồm ký tự phân tách đường dẫn)
    /// </summary>
    public static readonly char[] InvalidNameCharacters =
    [
        '\0', '/', '\\', ':', '*', '?', '"', '<', '>', '|',
    ];

    /// <summary>
    /// Kiểm tra một tên đơn (tên container, tên tệp/thư mục), ném ngoại lệ khi không hợp lệ
    /// </summary>
    /// <remarks>
    /// Không cho phép ký tự phân tách đường dẫn, nếu không sẽ tạo bí danh container hoặc ghi cấp bậc vào tên;
    /// Kiểm tra lần lượt: giá trị rỗng → đoạn traversal (./..) → ký tự không hợp lệ → dấu chấm/khoảng trắng ở cuối → tên thiết bị dự trữ.
    /// </remarks>
    public static void CheckName(string? name, string errorCode)
    {
        if (!IsValidSegment(name))
        {
            throw CreateInvalidNameException(name, errorCode);
        }
    }

    /// <summary>
    /// Kiểm tra đường dẫn tên (ví dụ <see cref="Blob.FullName"/>), ném ngoại lệ khi không hợp lệ
    /// </summary>
    /// <remarks>
    /// Cho phép '/' và '\' làm ký tự phân tách, nhưng kiểm tra từng đoạn theo quy tắc tên đơn;
    /// Trước tiên loại bỏ '/' ở đầu (quy ước của module là tên đầy đủ bắt đầu bằng '/'), sau đó từ chối đường dẫn tuyệt đối và UNC.
    /// </remarks>
    public static void CheckPath(string? path, string errorCode)
    {
        if (!IsValidPath(path))
        {
            throw CreateInvalidNameException(path, errorCode);
        }
    }

    /// <summary>
    /// Có phải là đường dẫn hợp lệ không (kiểm tra từng đoạn, cho phép ký tự phân tách)
    /// </summary>
    public static bool IsValidPath(string? path)
    {
        if (path.IsNullOrWhiteSpace())
        {
            return false;
        }

        var name = path.RemovePreFix("/");

        if (Path.IsPathRooted(name) ||
            name.StartsWith(@"\\", StringComparison.Ordinal))
        {
            return false;
        }

        var segments = name.Split(new[] { '/', '\\' }, StringSplitOptions.RemoveEmptyEntries);
        if (segments.Length == 0)
        {
            return false;
        }

        foreach (var segment in segments)
        {
            if (!IsValidSegment(segment))
            {
                return false;
            }
        }

        return true;
    }

    /// <summary>
    /// Có phải là tên đơn hợp lệ không (không chứa ký tự phân tách)
    /// </summary>
    public static bool IsValidName(string? name)
    {
        return IsValidSegment(name);
    }

    /// <summary>
    /// Có phải là đoạn đường dẫn hợp lệ không
    /// </summary>
    public static bool IsValidSegment(string? segment)
    {
        if (segment.IsNullOrWhiteSpace())
        {
            return false;
        }
        if (segment == "." || segment == "..")
        {
            return false;
        }
        if (segment.IndexOfAny(InvalidNameCharacters) >= 0)
        {
            return false;
        }
        if (segment.EndsWith(".") || segment.EndsWith(" "))
        {
            return false;
        }

        return !IsReservedDeviceName(segment);
    }

    /// <summary>
    /// Có phải là tên thiết bị dự trữ của Windows không (CON/PRN/AUX/NUL/COM1-9/LPT1-9)
    /// </summary>
    public static bool IsReservedDeviceName(string name)
    {
        if (name.IsNullOrWhiteSpace())
        {
            return false;
        }

        var extensionIndex = name.IndexOf('.');
        if (extensionIndex > 0)
        {
            name = name.Substring(0, extensionIndex);
        }

        if (name.Equals("CON", StringComparison.OrdinalIgnoreCase) ||
            name.Equals("PRN", StringComparison.OrdinalIgnoreCase) ||
            name.Equals("AUX", StringComparison.OrdinalIgnoreCase) ||
            name.Equals("NUL", StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }

        if (name.Length == 4)
        {
            var prefix = name.Substring(0, 3);
            var suffix = name[3];

            return suffix >= '1' && suffix <= '9' &&
                   (prefix.Equals("COM", StringComparison.OrdinalIgnoreCase) ||
                    prefix.Equals("LPT", StringComparison.OrdinalIgnoreCase));
        }

        return false;
    }

    /// <summary>
    /// Tạo ngoại lệ tên không hợp lệ
    /// </summary>
    public static BusinessException CreateInvalidNameException(string? name, string errorCode)
    {
        return new BusinessException(errorCode, $"Not allowed name: {name}!")
            .WithData("Name", name ?? string.Empty);
    }
}
