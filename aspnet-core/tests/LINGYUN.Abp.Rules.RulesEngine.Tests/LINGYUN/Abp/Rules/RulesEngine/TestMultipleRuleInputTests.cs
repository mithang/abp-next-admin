using Shouldly;
using System.Threading.Tasks;
using Volo.Abp.Validation;
using Xunit;

namespace LINGYUN.Abp.Rules.RulesEngine
{
    public class TestMultipleRuleInputTests : AbpRulesEngineTestBase
    {
        private readonly IRuleProvider _ruleProvider;

        public TestMultipleRuleInputTests()
        {
            _ruleProvider = GetRequiredService<IRuleProvider>();
        }

        [Fact]
        public async Task Multiple_Rule_Input_Should_Failed()
        {
            var input = new TestMultipleRuleInput
            {
                Length = "12345",
                Integer1 = 100,
                Integer2 = 100
            };

            var exception = await Assert.ThrowsAsync<AbpValidationException>(async () =>
            {
                await _ruleProvider.ExecuteAsync(input);
            });

            exception.Message.ShouldBe("Một hoặc nhiều quy tắc không đạt");
            exception.ValidationErrors.Count.ShouldBe(2);
            exception.ValidationErrors[0].ErrorMessage.ShouldBe("Xác thực trường nhập không hợp lệ!");
            exception.ValidationErrors[1].ErrorMessage.ShouldBe("Xác thực độ dài và tổng không hợp lệ!");
        }
    }
}
