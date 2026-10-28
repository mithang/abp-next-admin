namespace LINGYUN.Abp.Wrapper
{
    public class FakeExceptionWrapHandler : IExceptionWrapHandler
    {
        public void Wrap(ExceptionWrapContext context)
        {
            context.WithCode("1001")
                   .WithMessage("Thông báo xử lý ngoại lệ tùy chỉnh")
                   .WithDetails("Chi tiết thông báo xử lý ngoại lệ tùy chỉnh");
        }
    }
}
