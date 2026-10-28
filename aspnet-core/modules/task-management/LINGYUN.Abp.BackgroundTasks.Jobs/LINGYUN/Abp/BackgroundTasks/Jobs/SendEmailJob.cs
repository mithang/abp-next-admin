using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Emailing;
using Volo.Abp.Json;
using Volo.Abp.TextTemplating;

namespace LINGYUN.Abp.BackgroundTasks.Jobs;

public class SendEmailJob : IJobRunnable
{

    #region Definition Paramters

    public readonly static IReadOnlyList<JobDefinitionParamter> Paramters =
        new List<JobDefinitionParamter>
        {
            new JobDefinitionParamter(PropertyTo, LocalizableStatic.Create("Emailing:To"), required: true),
            new JobDefinitionParamter(PropertySubject, LocalizableStatic.Create("Emailing:Subject"), required: true),

            new JobDefinitionParamter(PropertyFrom, LocalizableStatic.Create("Emailing:From")),
            new JobDefinitionParamter(PropertyBody, LocalizableStatic.Create("Emailing:Body")),
            new JobDefinitionParamter(PropertyTemplate, LocalizableStatic.Create("Emailing:Template")),
            new JobDefinitionParamter(PropertyModel, LocalizableStatic.Create("Emailing:Model")),
            new JobDefinitionParamter(PropertyContext, LocalizableStatic.Create("Emailing:Context")),
            new JobDefinitionParamter(PropertyCulture, LocalizableStatic.Create("Emailing:Culture")),
        };

    #endregion

    public const string PropertyFrom = "from";
    /// <summary>
    /// Người nhận
    /// </summary>
    public const string PropertyTo = "to";
    /// <summary>
    /// Bắt buộc, tiêu đề email
    /// </summary>
    public const string PropertySubject = "subject";
    /// <summary>
    /// Nội dung thông điệp, bắt buộc khi là thông điệp văn bản
    /// </summary>
    public const string PropertyBody = "body";

    /// <summary>
    /// Gửi thông điệp mẫu
    /// </summary>
    public const string PropertyTemplate = "template";
    /// <summary>
    /// Tùy chọn, tham số mô hình trong thông điệp mẫu
    /// </summary>
    public const string PropertyModel = "model";
    /// <summary>
    /// Tùy chọn, tham số ngữ cảnh trong thông điệp mẫu
    /// </summary>
    public const string PropertyContext = "context";
    /// <summary>
    /// Tùy chọn, culture trong thông điệp mẫu
    /// </summary>
    public const string PropertyCulture = "culture";

    public async virtual Task ExecuteAsync(JobRunnableContext context)
    {
        context.TryGetString(PropertyFrom, out var from);
        var to = context.GetString(PropertyTo);
        var subject = context.GetString(PropertySubject);

        var emailSender = context.GetRequiredService<IEmailSender>();

        if (context.TryGetString(PropertyTemplate, out var template) && !template.IsNullOrWhiteSpace())
        {
            var jsonSerializer = context.GetRequiredService<IJsonSerializer>();
            var globalContext = new Dictionary<string, object>();
            context.TryGetString(PropertyCulture, out var culture);
            if (context.TryGetString(PropertyContext, out var globalCtx))
            {
                try
                {
                    globalContext = jsonSerializer.Deserialize<Dictionary<string, object>>(globalCtx);
                }
                catch { }
            }

            object? model = null;
            if (context.TryGetString(PropertyModel, out var modelString) && !modelString.IsNullOrWhiteSpace())
            {
                try
                {
                    model = jsonSerializer.Deserialize<Dictionary<string, object>>(modelString);
                }
                catch { }
            }

            var templateRenderer = context.GetRequiredService<ITemplateRenderer>();

            var content = await templateRenderer.RenderAsync(
                templateName: template,
                model: model,
                cultureName: culture,
                globalContext: globalContext);

            await QueueEmail(emailSender, from, to, subject, content, true);
            return;
        }

        var body = context.GetString(PropertyBody);

        await QueueEmail(emailSender, from, to, subject, body, false);
    }

    private async Task QueueEmail(IEmailSender emailSender, string from, string to, string subject, string body, bool isBodyHtml = true)
    {
        if (from.IsNullOrWhiteSpace())
        {
            await emailSender.SendAsync(to, subject, body, isBodyHtml);
            return;
        }
        await emailSender.SendAsync(from, to, subject, body, isBodyHtml);
    }
}
