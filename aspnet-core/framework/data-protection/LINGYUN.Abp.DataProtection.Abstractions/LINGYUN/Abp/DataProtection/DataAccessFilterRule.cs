using System;

namespace LINGYUN.Abp.DataProtection;

[Serializable]
public class DataAccessFilterRule
{
    /// <summary>
    /// Tên trường
    /// </summary>
    public string Field { get; set; } = default!;
    /// <summary>
    /// Giá trị trường
    /// </summary>
    public object? Value { get; set; }
    /// <summary>
    /// Tên đầy đủ của kiểu
    /// </summary>
    public string TypeFullName { get; set; } = default!;
    /// <summary>
    /// Kiểu JS
    /// </summary>
    public string JavaScriptType { get; set; } = default!;
    /// <summary>
    /// Loại thao tác
    /// </summary>
    public DataAccessFilterOperate Operate { get; set; }
    /// <summary>
    /// Điều kiện phía trái
    /// </summary>
    public bool IsLeft { get; set; }

    public DataAccessFilterRule()
    {

    }

    public DataAccessFilterRule(
        string field,
        object value,
        string typeFullName,
        string javaScriptType,
        DataAccessFilterOperate operate = DataAccessFilterOperate.Equal, 
        bool isLeft = false)
    {
        Field = field;
        Value = value;
        TypeFullName = typeFullName;
        JavaScriptType = javaScriptType;
        Operate = operate;
        IsLeft = isLeft;
    }
}