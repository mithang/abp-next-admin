using Shouldly;
using System;
using Volo.Abp;
using Xunit;

namespace LINGYUN.Abp.BlobManagement;

/// <summary>
/// Vùng chứa lưu trữ
/// </summary>
public class BlobContainer_Tests : AbpBlobManagementDomainTestBase
{
    [Theory]
    [InlineData("..")]
    [InlineData(".")]
    [InlineData("a/b")]
    [InlineData("a\\b")]
    [InlineData("x/../abp-c")]
    [InlineData("..\\..\\evil")]
    [InlineData("NUL")]
    [InlineData("con.txt")]
    [InlineData("COM1")]
    [InlineData("a:b")]
    [InlineData("a*b")]
    [InlineData("trailing.")]
    [InlineData("trailing ")]
    public void Should_Reject_Unsafe_Names(string name)
    {
        var container = new TestBlobContainer();

        var exception = Should.Throw<BusinessException>(() => container.SetName(name));

        exception.Code.ShouldBe(BlobManagementErrorCodes.Container.InvalidName);
        exception.Data["Name"].ShouldBe(name);
    }

    [Theory]
    [InlineData("public")]
    [InlineData("users")]
    [InlineData("my-container")]
    [InlineData("my_container.1")]
    [InlineData("lưu trữ đối tượng")]
    public void Should_Allow_Legitimate_Names(string name)
    {
        var container = new TestBlobContainer();

        container.SetName(name);

        container.Name.ShouldBe(name);
    }

    /// <summary>
    /// Hàm tạo của thực thể là internal, lớp con dùng cho kiểm thử công khai hàm tạo protected
    /// </summary>
    private sealed class TestBlobContainer : BlobContainer
    {
        public TestBlobContainer()
        {
        }
    }
}
