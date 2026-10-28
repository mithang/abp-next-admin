using IdentityServer4;
using IdentityServer4.Models;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using ApiResource = Volo.Abp.IdentityServer.ApiResources.ApiResource;

namespace LINGYUN.Abp.IdentityServer.ApiResources;

[Authorize(AbpIdentityServerPermissions.ApiResources.Default)]
public class ApiResourceAppService : AbpIdentityServerAppServiceBase, IApiResourceAppService
{
    protected IApiResourceRepository ApiResourceRepository { get; }

    public ApiResourceAppService(
        IApiResourceRepository apiResourceRepository)
    {
        ApiResourceRepository = apiResourceRepository;
    }

    public async virtual Task<ApiResourceDto> GetAsync(Guid id)
    {
        var apiResource = await ApiResourceRepository.GetAsync(id);

        return ObjectMapper.Map<ApiResource, ApiResourceDto>(apiResource);
    }

    public async virtual Task<PagedResultDto<ApiResourceDto>> GetListAsync(ApiResourceGetByPagedInputDto input)
    {
        var apiResources = await ApiResourceRepository.GetListAsync(input.Sorting,
            input.SkipCount, input.MaxResultCount,
            input.Filter);
        // Chưa áp dụng bộ lọc Filter? Số lượng kết quả không chính xác
        var apiResourceCount = await ApiResourceRepository.GetCountAsync(input.Filter);

        return new PagedResultDto<ApiResourceDto>(apiResourceCount,
            ObjectMapper.Map<List<ApiResource>, List<ApiResourceDto>>(apiResources));
    }

    [Authorize(AbpIdentityServerPermissions.ApiResources.Create)]
    public async virtual Task<ApiResourceDto> CreateAsync(ApiResourceCreateDto input)
    {
        var apiResourceExists = await ApiResourceRepository.CheckNameExistAsync(input.Name);
        if (apiResourceExists)
        {
            throw new UserFriendlyException(L[AbpIdentityServerErrorConsts.ApiResourceNameExisted, input.Name]);
        }
        var apiResource = new ApiResource(
            GuidGenerator.Create(), 
            input.Name,
            input.DisplayName, 
            input.Description);

        await UpdateApiResourceByInputAsync(apiResource, input);

        apiResource = await ApiResourceRepository.InsertAsync(apiResource);

        await CurrentUnitOfWork!.SaveChangesAsync();

        return ObjectMapper.Map<ApiResource, ApiResourceDto>(apiResource);
    }

    [Authorize(AbpIdentityServerPermissions.ApiResources.Update)]
    public async virtual Task<ApiResourceDto> UpdateAsync(Guid id, ApiResourceUpdateDto input)
    {
        var apiResource = await ApiResourceRepository.GetAsync(id);

        await UpdateApiResourceByInputAsync(apiResource, input);

        apiResource = await ApiResourceRepository.UpdateAsync(apiResource);

        await CurrentUnitOfWork!.SaveChangesAsync();

        return ObjectMapper.Map<ApiResource, ApiResourceDto>(apiResource);
    }

    [Authorize(AbpIdentityServerPermissions.ApiResources.Delete)]
    public async virtual Task DeleteAsync(Guid id)
    {
        var apiResource = await ApiResourceRepository.GetAsync(id);
        await ApiResourceRepository.DeleteAsync(apiResource);

        await CurrentUnitOfWork!.SaveChangesAsync();
    }

    protected async virtual Task UpdateApiResourceByInputAsync(ApiResource apiResource, ApiResourceCreateOrUpdateDto input)
    {
        apiResource.ShowInDiscoveryDocument = input.ShowInDiscoveryDocument;
        apiResource.Enabled = input.Enabled;

        if (!string.Equals(apiResource.AllowedAccessTokenSigningAlgorithms, input.AllowedAccessTokenSigningAlgorithms, StringComparison.InvariantCultureIgnoreCase))
        {
            apiResource.AllowedAccessTokenSigningAlgorithms = input.AllowedAccessTokenSigningAlgorithms;
        }
        if (!string.Equals(apiResource.DisplayName, input.DisplayName, StringComparison.InvariantCultureIgnoreCase))
        {
            apiResource.DisplayName = input.DisplayName;
        }
        if (apiResource.Description?.Equals(input.Description, StringComparison.InvariantCultureIgnoreCase) == false)
        {
            apiResource.Description = input.Description;
        }

        if (await IsGrantAsync(AbpIdentityServerPermissions.ApiResources.ManageClaims))
        {
            // Xóa UserClaim không tồn tại
            apiResource.UserClaims.RemoveAll(claim => !input.UserClaims.Any(inputClaim => claim.Type == inputClaim.Type));
            foreach (var inputClaim in input.UserClaims)
            {
                var userClaim = apiResource.FindClaim(inputClaim.Type);
                if (userClaim == null)
                {
                    apiResource.AddUserClaim(inputClaim.Type);
                }
            }
        }

        if (await IsGrantAsync(AbpIdentityServerPermissions.ApiResources.ManageScopes))
        {
            // Xóa Scope không tồn tại
            apiResource.Scopes.RemoveAll(scope => !input.Scopes.Any(inputScope => scope.Scope == inputScope.Scope));
            foreach (var inputScope in input.Scopes)
            {
                var scope = apiResource.FindScope(inputScope.Scope);
                if (scope == null)
                {
                    apiResource.AddScope(inputScope.Scope);
                }
            }
        }

        if (await IsGrantAsync(AbpIdentityServerPermissions.ApiResources.ManageSecrets))
        {
            // Xóa Secret không tồn tại
            apiResource.Secrets.RemoveAll(secret => !input.Secrets.Any(inputSecret => secret.Type == inputSecret.Type && secret.Value == inputSecret.Value));
            foreach (var inputSecret in input.Secrets)
            {
                // Lần kiểm tra trùng lặp đầu tiên đối với chuỗi đã mã hóa
                if (apiResource.FindSecret(inputSecret.Value, inputSecret.Type) == null)
                {
                    var apiSecretValue = inputSecret.Value;
                    if (IdentityServerConstants.SecretTypes.SharedSecret.Equals(inputSecret.Type))
                    {
                        if (inputSecret.HashType == HashType.Sha256)
                        {
                            apiSecretValue = inputSecret.Value.Sha256();
                        }
                        else if (inputSecret.HashType == HashType.Sha512)
                        {
                            apiSecretValue = inputSecret.Value.Sha512();
                        }
                    }
                    // Sau khi mã hóa vẫn cần kiểm tra thêm một lần để tránh xuất hiện giá trị trùng lặp
                    var secret = apiResource.FindSecret(apiSecretValue, inputSecret.Type);
                    if (secret == null)
                    {
                        apiResource.AddSecret(apiSecretValue, inputSecret.Expiration, inputSecret.Type, inputSecret.Description);
                    }
                }
            }
        }

        if (await IsGrantAsync(AbpIdentityServerPermissions.ApiResources.ManageProperties))
        {
            // Xóa thuộc tính không tồn tại
            apiResource.Properties.RemoveAll(prop => !input.Properties.Any(inputProp => prop.Key == inputProp.Key));
            foreach (var inputProp in input.Properties)
            {
                var apiResourceProperty = apiResource.FindProperty(inputProp.Key);
                if (apiResourceProperty == null)
                {
                    apiResource.AddProperty(inputProp.Key, inputProp.Value);
                }
                else
                {
                    apiResourceProperty.Value = inputProp.Value;
                }
            }
        }
    }
}
