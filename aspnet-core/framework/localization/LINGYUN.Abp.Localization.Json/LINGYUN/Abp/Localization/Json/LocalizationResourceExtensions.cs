using JetBrains.Annotations;
using Volo.Abp;
using Volo.Abp.Localization;

namespace LINGYUN.Abp.Localization.Json
{
    public static class LocalizationResourceExtensions
    {
        /// <summary>
        /// Thêm hỗ trợ tệp Json trên đĩa cục bộ
        /// </summary>
        /// <param name="localizationResource"></param>
        /// <param name="jsonFilePath"></param>
        /// <returns></returns>
        public static LocalizationResource AddPhysicalJson(
            [NotNull] this LocalizationResource localizationResource,
            [NotNull] string jsonFilePath)
        {
            Check.NotNull(localizationResource, nameof(localizationResource));
            Check.NotNull(jsonFilePath, nameof(jsonFilePath));

            localizationResource.Contributors.Add(new JsonPhysicalFileLocalizationResourceContributor(jsonFilePath));

            return localizationResource;
        }
    }
}
