using COSXML;
using COSXML.Common;
using COSXML.Model.Bucket;
using COSXML.Model.Object;
using COSXML.Model.Tag;
using LINGYUN.Abp.Tencent.Features;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.BlobStoring;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Features;

namespace LINGYUN.Abp.BlobStoring.Tencent;

[RequiresFeature(TencentCloudFeatures.BlobStoring.Enable)]
public class TencentCloudBlobProvider : BlobProviderBase, ITransientDependency
{
    protected IFeatureChecker FeatureChecker { get; }
    protected ICosClientFactory CosClientFactory { get; }
    protected IHttpClientFactory HttpClientFactory { get; }
    protected ITencentBlobNameCalculator TencentBlobNameCalculator { get; }

    public TencentCloudBlobProvider(
        IFeatureChecker featureChecker,
        ICosClientFactory cosClientFactory,
        IHttpClientFactory httpClientFactory,
        ITencentBlobNameCalculator tencentBlobNameCalculator)
    {
        FeatureChecker = featureChecker;
        CosClientFactory = cosClientFactory;
        HttpClientFactory = httpClientFactory;
        TencentBlobNameCalculator = tencentBlobNameCalculator;
    }

    public override async Task<bool> DeleteAsync(BlobProviderDeleteArgs args)
    {
        var ossClient = await GetOssClientAsync(args);
        var blobName = TencentBlobNameCalculator.Calculate(args);

        if (await BlobExistsAsync(ossClient, args, blobName))
        {
            var request = new DeleteObjectRequest(GetBucketName(args), blobName);
            return ossClient.DeleteObject(request).IsSuccessful();
        }

        return false;
    }

    public override async Task<bool> ExistsAsync(BlobProviderExistsArgs args)
    {
        var ossClient = await GetOssClientAsync(args);
        var blobName = TencentBlobNameCalculator.Calculate(args);

        return await BlobExistsAsync(ossClient, args, blobName);
    }

    public override async Task<Stream?> GetOrNullAsync(BlobProviderGetArgs args)
    {
        var ossClient = await GetOssClientAsync(args);
        var blobName = TencentBlobNameCalculator.Calculate(args);

        if (!await BlobExistsAsync(ossClient, args, blobName))
        {
            return null;
        }

        var configuration = args.Configuration.GetTencentConfiguration();
        // See: https://cloud.tencent.com/document/product/436/47238
        var preSignatureStruct = new PreSignatureStruct
        {
            appid = configuration.AppId,//"1250000000"; //APPID tài khoản Tencent Cloud
            region = configuration.Region,//"COS_REGION"; //Vùng của bucket lưu trữ
            bucket = GetBucketName(args),//"examplebucket-1250000000"; //Bucket lưu trữ
            key = blobName, //Khóa đối tượng
            httpMethod = "GET", //Phương thức yêu cầu HTTP
            isHttps = true, //Tạo URL yêu cầu HTTPS
            signDurationSecond = configuration.PresignedGetExpirySeconds, //Thời gian hiệu lực chữ ký yêu cầu là 600 giây
            headers = null, //Header cần kiểm tra trong chữ ký
            queryParameters = null //Tham số yêu cầu trong URL cần kiểm tra trong chữ ký
        };
        var requestSignURL = ossClient.GenerateSignURL(preSignatureStruct);
        var client = HttpClientFactory.CreateTenantOssClient();

        return await client.GetStreamAsync(requestSignURL);
    }

    public override async Task SaveAsync(BlobProviderSaveArgs args)
    {
        var ossClient = await GetOssClientAsync(args);
        var blobName = TencentBlobNameCalculator.Calculate(args);
        var configuration = args.Configuration.GetTencentConfiguration();

        // Kiểm tra Bucket trước
        if (configuration.CreateBucketIfNotExists)
        {
            await CreateBucketIfNotExists(ossClient, args, configuration.CreateBucketReferer);
        }

        var bucketName = GetBucketName(args);

        // Đã tồn tại hay chưa
        if (await BlobExistsAsync(ossClient, args, blobName))
        {
            // Có ghi đè hay không
            if (!args.OverrideExisting)
            {
                throw new BlobAlreadyExistsException($"Saving BLOB '{args.BlobName}' does already exists in the bucketName '{GetBucketName(args)}'! Set {nameof(args.OverrideExisting)} if it should be overwritten.");
            }
            else
            {
                // Xóa tệp gốc
                var deleteRequest = new DeleteObjectRequest(bucketName, blobName);
                ossClient.DeleteObject(deleteRequest);
            }
        }
        // Lưu
        var putRequest = new PutObjectRequest(bucketName, blobName, args.BlobStream);
        ossClient.PutObject(putRequest);
    }

    protected async virtual Task<CosXml> GetOssClientAsync(BlobProviderArgs args)
    {
        var configuration = args.Configuration.GetTencentConfiguration();
        var ossClient = await CosClientFactory.CreateAsync(configuration);
        return ossClient;
    }

    protected async virtual Task CreateBucketIfNotExists(CosXml cos, BlobProviderArgs args, IList<string>? refererList = null)
    {
        if (!await BucketExistsAsync(cos, args))
        {
            var bucketName = GetBucketName(args);

            var request = new PutBucketRequest(bucketName);

            request.SetCosACL(CosACL.Private);

            cos.PutBucket(request);

            if (refererList != null && refererList.Count > 0)
            {
                var srq = new PutBucketRefererRequest(bucketName);
                var refererConfig = new COSXML.Model.Tag.RefererConfiguration();
                foreach (var domain in refererList)
                {
                    refererConfig.domainList.AddDomain(domain);
                }
                srq.SetRefererConfiguration(refererConfig);

                cos.PutBucketReferer(srq);
            }
        }
    }

    private async Task<bool> BlobExistsAsync(CosXml cos, BlobProviderArgs args, string blobName)
    {
        var bucketExists = await BucketExistsAsync(cos, args);
        if (bucketExists)
        {
            var request = new DoesObjectExistRequest(GetBucketName(args), blobName);
            var objectExists = cos.DoesObjectExist(request);

            return objectExists;
        }
        return false;
    }

    private Task<bool> BucketExistsAsync(CosXml cos, BlobProviderArgs args)
    {
        var request = new DoesBucketExistRequest(GetBucketName(args));
        var bucketExists = cos.DoesBucketExist(request);

        return Task.FromResult(bucketExists);
    }

    private static string GetBucketName(BlobProviderArgs args)
    {
        var configuration = args.Configuration.GetTencentConfiguration();
        return configuration.BucketName.IsNullOrWhiteSpace()
            ? args.ContainerName
            : configuration.BucketName;
    }
}
