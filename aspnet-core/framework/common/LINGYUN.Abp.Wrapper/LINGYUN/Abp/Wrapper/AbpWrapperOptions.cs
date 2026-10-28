using System;
using System.Collections.Generic;
using System.Net;
using Volo.Abp.Collections;

namespace LINGYUN.Abp.Wrapper;

public class AbpWrapperOptions
{
    /// <summary>
    /// Mã lỗi ngoại lệ chưa được xử lý
    /// Mặc định: 500
    /// </summary>
    public string CodeWithUnhandled { get; set; }
    /// <summary>
    /// Có bật wrapper hay không
    /// Mặc định: false
    /// </summary>
    public bool IsEnabled { get; set; }
    /// <summary>
    /// Mã trả về khi thành công
    /// Mặc định：0
    /// </summary>
    public string CodeWithSuccess { get; set; }
    /// <summary>
    /// Khi tài nguyên trống có báo lỗi hay không
    /// Mặc định: false
    /// </summary>
    public bool ErrorWithEmptyResult { get; set; }
    /// <summary>
    /// Có bật đóng gói lỗi 401 hay không
    /// Mặc định: false
    /// </summary>
    public bool IsWrapUnauthorizedEnabled { get; set; }
    /// <summary>
    /// Mã trả về khi tài nguyên trống
    /// Mặc định：404
    /// </summary>
    public Func<IServiceProvider, string> CodeWithEmptyResult { get; set; }
    /// <summary>
    /// Thông báo lỗi trả về khi tài nguyên trống
    /// </summary>
    public Func<IServiceProvider, string> MessageWithEmptyResult { get; set; }
    /// <summary>
    /// Mã trạng thái trả về sau khi đóng gói
    /// Mặc định：200  HttpStatusCode.OK
    /// </summary>
    public HttpStatusCode HttpStatusCode { get; set; }
    /// <summary>
    /// Bỏ qua các loại bắt đầu bằng Url
    /// </summary>
    public IList<string> IgnorePrefixUrls { get; }
    /// <summary>
    /// Bỏ qua namespace đã chỉ định
    /// </summary>
    public IList<string> IgnoreNamespaces { get; }
    /// <summary>
    /// Bỏ qua controller
    /// </summary>
    public ITypeList IgnoreControllers { get; }
    /// <summary>
    /// Bỏ qua giá trị trả về
    /// </summary>
    public ITypeList IgnoreReturnTypes { get; }
    /// <summary>
    /// Bỏ qua ngoại lệ
    /// </summary>
    public ITypeList<Exception> IgnoreExceptions { get; }
    /// <summary>
    /// Bỏ qua loại giao diện
    /// </summary>
    public ITypeList IgnoredInterfaces { get; }

    internal IDictionary<Type, IExceptionWrapHandler> ExceptionHandles { get; }

    public AbpWrapperOptions()
    {
        CodeWithUnhandled = "500";
        CodeWithSuccess = "0";
        HttpStatusCode = HttpStatusCode.OK;
        ErrorWithEmptyResult = false;

        IgnorePrefixUrls = new List<string>();
        IgnoreNamespaces = new List<string>();

        IgnoreControllers = new TypeList();
        IgnoreReturnTypes = new TypeList();
        IgnoredInterfaces = new TypeList()
        {
            typeof(IWrapDisabled)
        };
        IgnoreExceptions = new TypeList<Exception>();

        CodeWithEmptyResult = (_) => "404";
        MessageWithEmptyResult = (_) => "Not Found";

        ExceptionHandles = new Dictionary<Type, IExceptionWrapHandler>();
    }

    public void AddHandler<TException>(IExceptionWrapHandler handler)
        where TException : Exception
    {
        AddHandler(typeof(TException), handler);
    }

    public void AddHandler(Type exceptionType, IExceptionWrapHandler handler)
    {
        ExceptionHandles[exceptionType] = handler;
    }

    public IExceptionWrapHandler? GetHandler(Type exceptionType)
    {
        ExceptionHandles.TryGetValue(exceptionType, out var handler);

        return handler;
    }
}
