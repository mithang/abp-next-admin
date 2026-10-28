using System;
using System.Collections.Generic;
using System.Text;

namespace LINGYUN.Abp.OpenObserve.Utils;

/// <summary>
/// Trình tạo chuỗi truy vấn OpenObserve
/// </summary>
internal static class OpenObserveQueryString
{
    /// <summary>
    /// Tạo chuỗi truy vấn
    /// </summary>
    /// <returns>như "?type=logs&amp;delete_all=true", khi không có tham số thì trả về chuỗi rỗng</returns>
    public static string Build(params (string Name, object? Value)[] parameters)
    {
        var builder = new StringBuilder();

        foreach (var (name, value) in parameters)
        {
            if (value == null)
            {
                continue;
            }

            var text = value switch
            {
                bool boolean => boolean ? "true" : "false",
                _ => value.ToString(),
            };

            if (text.IsNullOrWhiteSpace())
            {
                continue;
            }

            builder.Append(builder.Length == 0 ? '?' : '&');
            builder.Append(name);
            builder.Append('=');
            builder.Append(Uri.EscapeDataString(text!));
        }

        return builder.ToString();
    }

    /// <summary>
    /// Tạo chuỗi truy vấn
    /// </summary>
    public static string Build(IDictionary<string, object?> parameters)
    {
        var builder = new StringBuilder();

        foreach (var (name, value) in parameters)
        {
            if (value == null)
            {
                continue;
            }

            var text = value switch
            {
                bool boolean => boolean ? "true" : "false",
                _ => value.ToString(),
            };

            if (text.IsNullOrWhiteSpace())
            {
                continue;
            }

            builder.Append(builder.Length == 0 ? '?' : '&');
            builder.Append(name);
            builder.Append('=');
            builder.Append(Uri.EscapeDataString(text!));
        }

        return builder.ToString();
    }
}
