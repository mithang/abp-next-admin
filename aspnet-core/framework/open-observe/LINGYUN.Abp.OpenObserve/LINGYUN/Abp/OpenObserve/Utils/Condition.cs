namespace LINGYUN.Abp.OpenObserve.Utils;

/// <summary>
/// Điều kiện truy vấn
/// </summary>
/// <param name="Field">Tên trường (tên thành viên biểu thức)</param>
/// <param name="Op">Toán tử so sánh</param>
/// <param name="Value">Giá trị điều kiện</param>
public record Condition(string Field, ComparisonOp Op, object? Value);
