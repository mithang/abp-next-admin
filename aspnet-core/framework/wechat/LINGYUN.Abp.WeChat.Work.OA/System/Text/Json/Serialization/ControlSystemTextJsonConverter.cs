using LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;

namespace System.Text.Json.Serialization;
internal class ControlSystemTextJsonConverter : JsonConverter<Control>
{
    public override Control Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        using var doc = JsonDocument.ParseValue(ref reader);
        var root = doc.RootElement;

        var control = new Control();

        // Giải tuần tự hóa các trường cơ bản
        if (root.TryGetProperty("property", out var propertyElement))
        {
            control.Property = JsonSerializer.Deserialize<ControlInfo>(propertyElement.GetRawText(), options)!;
        }
        // Giải tuần tự hóa Config một cách động theo loại Control
        if (root.TryGetProperty("config", out var configElement) && configElement.ValueKind != JsonValueKind.Null)
        {
            control.Config = ControlConfigFactory.CreateConfig(control.Property.Control, configElement)!;
        }

        return control;
    }

    public override void Write(Utf8JsonWriter writer, Control value, JsonSerializerOptions options)
    {
        writer.WriteStartObject();

        writer.WritePropertyName("property");
        JsonSerializer.Serialize(writer, value.Property, options);

        if (value.Config != null)
        {
            writer.WritePropertyName("config");
            JsonSerializer.Serialize(writer, value.Config, value.Config.GetType(), options);
        }

        writer.WriteEndObject();
    }
}
