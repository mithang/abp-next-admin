using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;

namespace LINGYUN.Abp.OpenObserve.Utils;

/// <summary>
/// Trình xây dựng điều kiện SQL cho OpenObserve
/// </summary>
/// <remarks>
/// Chuyển đổi danh sách <see cref="Condition"/> thành điều kiện SQL WHERE, tên trường có thể được
/// ánh xạ qua <see cref="MapField"/> (tên thành viên biểu thức -> tên cột luồng dữ liệu)
/// </remarks>
public class OpenObserveSqlBuilder
{
    protected Dictionary<string, string> FieldMappings { get; }

    public OpenObserveSqlBuilder()
    {
        FieldMappings = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
    }

    /// <summary>
    /// Thêm ánh xạ trường
    /// </summary>
    public virtual OpenObserveSqlBuilder MapField(string field, string column)
    {
        FieldMappings[field] = column;

        return this;
    }

    /// <summary>
    /// Lấy tên cột sau khi ánh xạ
    /// </summary>
    public virtual string GetMappedField(string field)
    {
        return FieldMappings.TryGetValue(field, out var column) ? column : field;
    }

    /// <summary>
    /// Xây dựng điều kiện SQL WHERE
    /// </summary>
    /// <param name="conditions">Điều kiện truy vấn</param>
    /// <param name="skipFields">Trường cần bỏ qua (thường được xử lý bởi phạm vi thời gian của truy vấn)</param>
    public virtual string Build(IEnumerable<Condition> conditions, params string[] skipFields)
    {
        var parts = new List<string>();

        foreach (var condition in conditions)
        {
            if (IsSkip(condition.Field, skipFields))
            {
                continue;
            }

            parts.Add(BuildCondition(condition));
        }

        return parts.Count == 0 ? "1 = 1" : string.Join(" AND ", parts);
    }

    /// <summary>
    /// Xây dựng một điều kiện đơn lẻ
    /// </summary>
    protected virtual string BuildCondition(Condition condition)
    {
        var field = GetMappedField(condition.Field);
        var value = FormatValue(condition.Field, condition.Value);

        return condition.Op switch
        {
            ComparisonOp.Equal => $"{field} = {value}",
            ComparisonOp.NotEqual => $"{field} != {value}",
            ComparisonOp.GreaterThan => $"{field} > {value}",
            ComparisonOp.GreaterThanOrEqual => $"{field} >= {value}",
            ComparisonOp.LessThan => $"{field} < {value}",
            ComparisonOp.LessThanOrEqual => $"{field} <= {value}",
            ComparisonOp.Contains => $"{field} LIKE '%{Escape(condition.Value?.ToString() ?? string.Empty)}%'",
            ComparisonOp.StartsWith => $"{field} LIKE '{Escape(condition.Value?.ToString() ?? string.Empty)}%'",
            ComparisonOp.EndsWith => $"{field} LIKE '%{Escape(condition.Value?.ToString() ?? string.Empty)}'",
            ComparisonOp.IsNull => $"{field} IS NULL",
            ComparisonOp.IsNotNull => $"{field} IS NOT NULL",
            _ => throw new NotSupportedException($"Unsupported comparison operator: {condition.Op}")
        };
    }

    /// <summary>
    /// Định dạng giá trị điều kiện
    /// </summary>
    protected virtual string FormatValue(string field, object? value)
    {
        return value switch
        {
            null => "NULL",
            string s => $"'{Escape(s)}'",
            bool b => b ? "true" : "false",
            DateTime d => FormatDateTime(d),
            DateTimeOffset d => $"'{d:yyyy-MM-ddTHH:mm:ss.fffffffzzz}'",
            Guid g => $"'{g}'",
            Enum e => $"'{Escape(e.ToString())}'",
            _ => Convert.ToString(value, CultureInfo.InvariantCulture) ?? "NULL"
        };
    }

    /// <summary>
    /// Định dạng giá trị thời gian
    /// </summary>
    /// <remarks>
    /// OpenObserve tuần tự hóa thời gian thành ISO 8601 (kèm độ lệch múi giờ), chỉ khi so sánh theo cùng định dạng mới khớp
    /// </remarks>
    public virtual string FormatDateTime(DateTime value)
    {
        return $"'{value:yyyy-MM-ddTHH:mm:ss.fffffffzzz}'";
    }

    /// <summary>
    /// Thoát ký tự trong giá trị chuỗi
    /// </summary>
    public virtual string Escape(string input)
    {
        return input.Replace("'", "''");
    }

    protected virtual bool IsSkip(string field, string[] skipFields)
    {
        foreach (var skip in skipFields)
        {
            if (string.Equals(field, skip, StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }
        }

        return false;
    }

    /// <summary>
    /// Thêm điều kiện vào SQL
    /// </summary>
    public virtual void AppendCondition(StringBuilder sqlBuilder, string column, string sqlValue, bool isLike = false)
    {
        if (isLike)
        {
            sqlBuilder.AppendFormat(" and {0} like '%{1}%'", column, Escape(sqlValue));
        }
        else
        {
            sqlBuilder.AppendFormat(" and {0} = '{1}'", column, Escape(sqlValue));
        }
    }
}
