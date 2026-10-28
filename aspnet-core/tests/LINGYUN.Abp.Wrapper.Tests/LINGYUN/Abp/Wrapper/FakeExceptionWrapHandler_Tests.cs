using Shouldly;
using Volo.Abp;
using Volo.Abp.Http;
using Xunit;

namespace LINGYUN.Abp.Wrapper.Tests
{
    public class FakeExceptionWrapHandler_Tests: AbpWrapperTestsBase
    {
        private readonly IExceptionWrapHandlerFactory _exceptionWrapHandlerFactory;

        public FakeExceptionWrapHandler_Tests()
        {
            _exceptionWrapHandlerFactory = GetRequiredService<IExceptionWrapHandlerFactory>();
        }

        [Fact]
        public void Should_Return_Wraped_Result_With_Fake_Exception()
        {
            var exception = new FakeException();
            var exceptionWrapContext = new ExceptionWrapContext(
                exception, 
                new RemoteServiceErrorInfo(),
                ServiceProvider);

            var handler = _exceptionWrapHandlerFactory.CreateFor(exceptionWrapContext);
            handler.Wrap(exceptionWrapContext);

            exceptionWrapContext.ErrorInfo.Code.ShouldBe("1001");
            exceptionWrapContext.ErrorInfo.Message.ShouldBe("Thông báo xử lý ngoại lệ tùy chỉnh");
            exceptionWrapContext.ErrorInfo.Details.ShouldBe("Chi tiết thông báo xử lý ngoại lệ tùy chỉnh");
        }

        [Fact]
        public void Should_Return_Wraped_Result_With_Default_Exception()
        {
            var exception = new AbpException();
            var errorInfo = new RemoteServiceErrorInfo(
                "Thông báo xử lý ngoại lệ mặc định",
                "Chi tiết thông báo xử lý ngoại lệ mặc định",
                "1000");
            var exceptionWrapContext = new ExceptionWrapContext(
                exception,
                errorInfo,
                ServiceProvider);

            var handler = _exceptionWrapHandlerFactory.CreateFor(exceptionWrapContext);
            handler.Wrap(exceptionWrapContext);

            exceptionWrapContext.ErrorInfo.Code.ShouldBe("1000");
            exceptionWrapContext.ErrorInfo.Message.ShouldBe("Thông báo xử lý ngoại lệ mặc định");
            exceptionWrapContext.ErrorInfo.Details.ShouldBe("Chi tiết thông báo xử lý ngoại lệ mặc định");
        }

        [Fact]
        public void Should_Return_Wraped_Result_Code_500_With_Unhandled_Exception()
        {
            var exception = new AbpException();
            var errorInfo = new RemoteServiceErrorInfo(
                "Thông báo xử lý ngoại lệ mặc định",
                "Chi tiết thông báo xử lý ngoại lệ mặc định");
            var exceptionWrapContext = new ExceptionWrapContext(
                exception,
                errorInfo,
                ServiceProvider);

            var handler = _exceptionWrapHandlerFactory.CreateFor(exceptionWrapContext);
            handler.Wrap(exceptionWrapContext);

            exceptionWrapContext.ErrorInfo.Code.ShouldBe("500");
            exceptionWrapContext.ErrorInfo.Message.ShouldBe("Thông báo xử lý ngoại lệ mặc định");
            exceptionWrapContext.ErrorInfo.Details.ShouldBe("Chi tiết thông báo xử lý ngoại lệ mặc định");
        }
    }
}
