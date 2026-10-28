using System;

namespace LINGYUN.Platform;

/// <summary>
/// Loại nền tảng
/// </summary>
[Flags]
public enum PlatformType
{
    /// <summary>
    /// Chưa xác định
    /// </summary>
    None = 0,
    /// <summary>
    /// Windows CE
    /// </summary>
    WinCe = 2,
    /// <summary>
    /// Windows NT
    /// </summary>
    WinForm = 4,
    /// <summary>
    /// Dùng chung cho Windows desktop
    /// </summary>
    Desktop = WinCe | WinForm,
    /// <summary>
    /// WebForm
    /// </summary>
    WebForm = 8,
    /// <summary>
    /// MVC
    /// </summary>
    WebMvc = 16,
    /// <summary>
    /// Kiến trúc Mvvm khác
    /// </summary>
    WebMvvm = 32,
    /// <summary>
    /// Dùng chung cho Web
    /// </summary>
    Web = WebForm | WebMvc | WebMvvm,
    /// <summary>
    /// Android
    /// </summary>
    Android = 64,
    /// <summary>
    /// IOS
    /// </summary>
    iOS = 128,
    /// <summary>
    /// Dùng chung cho thiết bị di động
    /// </summary>
    Mobile = Android | iOS,
    /// <summary>
    /// Mini Program
    /// </summary>
    MiniProgram = 256,
    /// <summary>
    /// Dùng chung cho mọi nền tảng
    /// </summary>
    All = Desktop | Web | Mobile | MiniProgram
}
