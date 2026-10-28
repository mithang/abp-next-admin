namespace LINGYUN.Abp.OpenObserve.Models.Search;

/// <summary>
/// Nguồn tìm kiếm
/// </summary>
/// <remarks>
/// Tài liệu đưa ra ui / dashboards / reports / alerts, triển khai còn chấp nhận values / other / rum /
/// derived_stream / search_job / download / insights, giá trị không hợp lệ trả về 400
/// </remarks>
public enum SearchType
{
    UI = 0,
    Dashboards = 1,
    Reports = 2,
    Alerts = 3,
    Values = 4,
    Other = 5,
    Rum = 6,
    DerivedStream = 7,
    SearchJob = 8,
    Download = 9,
    Insights = 10,
}

public static class SearchTypeExtensions
{
    /// <summary>
    /// Chuyển đổi thành giá trị chuỗi mà giao diện yêu cầu
    /// </summary>
    public static string AsString(this SearchType searchType)
    {
        return searchType switch
        {
            SearchType.Dashboards => "dashboards",
            SearchType.Reports => "reports",
            SearchType.Alerts => "alerts",
            SearchType.Values => "values",
            SearchType.Other => "other",
            SearchType.Rum => "rum",
            SearchType.DerivedStream => "derived_stream",
            SearchType.SearchJob => "search_job",
            SearchType.Download => "download",
            SearchType.Insights => "insights",
            _ => "ui",
        };
    }
}
