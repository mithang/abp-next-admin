using LINGYUN.Abp.Wrapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.ApiExploring;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Reflection;
using Volo.Abp.Threading;

namespace LINGYUN.Abp.AspNetCore.Mvc.Wrapper.ApiExploring;
public class AbpWrapResultApiDescriptionProvider : IApiDescriptionProvider, ITransientDependency
{
    private readonly MvcOptions _mvcOptions;
    private readonly AbpWrapperOptions _wrapperOptions;
    private readonly AbpRemoteServiceApiDescriptionProviderOptions _providerOptions;
    private readonly IWrapResultChecker _wrapResultChecker;
    private readonly IModelMetadataProvider _modelMetadataProvider;

    public AbpWrapResultApiDescriptionProvider(
        IOptions<MvcOptions> mvcOptions,
        IOptions<AbpWrapperOptions> wrapperOptions,
        IOptions<AbpRemoteServiceApiDescriptionProviderOptions> providerOptions,
        IWrapResultChecker wrapResultChecker,
        IModelMetadataProvider modelMetadataProvider)
    {
        _mvcOptions = mvcOptions.Value;
        _wrapperOptions = wrapperOptions.Value;
        _providerOptions = providerOptions.Value;
        _wrapResultChecker = wrapResultChecker;
        _modelMetadataProvider = modelMetadataProvider;
    }

    public int Order => -999;

    public virtual void OnProvidersExecuted(ApiDescriptionProviderContext context)
    {
    }

    public virtual void OnProvidersExecuting(ApiDescriptionProviderContext context)
    {
        WrapperOKResponse(context);
    }

    protected virtual void WrapperOKResponse(ApiDescriptionProviderContext context)
    {
        foreach (var result in context.Results.Where(x => x.IsRemoteService()))
        {
            var actionProducesResponseTypeAttributes =
                    ReflectionHelper.GetAttributesOfMemberOrDeclaringType<ProducesResponseTypeAttribute>(
                        result.ActionDescriptor.GetMethodInfo());
            if (actionProducesResponseTypeAttributes.Any(x => x.StatusCode == (int)_wrapperOptions.HttpStatusCode))
            {
                continue;
            }

            if (_wrapResultChecker.WrapOnAction(result.ActionDescriptor) &&
                result.ActionDescriptor is ControllerActionDescriptor actionDescriptor)
            {
                var returnType = AsyncHelper.UnwrapTask(actionDescriptor.MethodInfo.ReturnType);

                Type? wrapResultType = null;
                if (returnType == null || returnType == typeof(void))
                {
                    wrapResultType = typeof(WrapResult);
                }
                else
                {
                    wrapResultType = typeof(WrapResult<>).MakeGenericType(returnType);
                }

                var responseType = new ApiResponseType
                {
                    Type = wrapResultType,
                    StatusCode = (int)_wrapperOptions.HttpStatusCode,
                    ModelMetadata = _modelMetadataProvider.GetMetadataForType(wrapResultType)
                };

                foreach (var responseTypeMetadataProvider in _mvcOptions.OutputFormatters.OfType<IApiResponseTypeMetadataProvider>())
                {
                    var formatterSupportedContentTypes = responseTypeMetadataProvider.GetSupportedContentTypes(null, wrapResultType);
                    if (formatterSupportedContentTypes == null)
                    {
                        continue;
                    }

                    foreach (var formatterSupportedContentType in formatterSupportedContentTypes)
                    {
                        responseType.ApiResponseFormats.Add(new ApiResponseFormat
                        {
                            Formatter = (IOutputFormatter)responseTypeMetadataProvider,
                            MediaType = formatterSupportedContentType
                        });
                    }
                }
                // TODO: Có cần định nghĩa kết quả bao bọc cho các mã phản hồi khác không?
                // Ngoại lệ 1: Khi người dùng truyền tiêu đề yêu cầu _AbpDontWrapResult, kết quả phản hồi không khớp với mong đợi
                // Ngoại lệ 2: Khi Url của controller nằm trong Url bị bỏ qua, kết quả phản hồi không khớp với mong đợi
                // Ngoại lệ 3: Khi ngoại lệ phát sinh nằm trong các ngoại lệ bị bỏ qua, kết quả phản hồi là đối tượng RemoteServiceErrorResponse, không khớp với mong đợi

                result.SupportedResponseTypes.RemoveAll(x => x.StatusCode == responseType.StatusCode);
                result.SupportedResponseTypes.AddIfNotContains(
                    x => x.StatusCode == responseType.StatusCode,
                    () => responseType);
                WrapperErrorResponse(result);
            }
        }
    }

    protected virtual void WrapperErrorResponse(ApiDescription description)
    {
        foreach (var apiResponse in _providerOptions.SupportedResponseTypes)
        {
            var wrapResultType = typeof(WrapResult);
            var responseType = new ApiResponseType
            {
                Type = wrapResultType,
                StatusCode = apiResponse.StatusCode,
                ModelMetadata = _modelMetadataProvider.GetMetadataForType(wrapResultType)
            };

            foreach (var responseTypeMetadataProvider in _mvcOptions.OutputFormatters.OfType<IApiResponseTypeMetadataProvider>())
            {
                var formatterSupportedContentTypes = responseTypeMetadataProvider.GetSupportedContentTypes(null, responseType.Type);
                if (formatterSupportedContentTypes == null)
                {
                    continue;
                }

                foreach (var formatterSupportedContentType in formatterSupportedContentTypes)
                {
                    responseType.ApiResponseFormats.Add(new ApiResponseFormat
                    {
                        Formatter = (IOutputFormatter)responseTypeMetadataProvider,
                        MediaType = formatterSupportedContentType
                    });
                }
            }

            description.SupportedResponseTypes.RemoveAll(x => x.StatusCode == responseType.StatusCode);
            description.SupportedResponseTypes.AddIfNotContains(
                x => x.StatusCode == responseType.StatusCode,
                () => responseType);
        }
    }
}
