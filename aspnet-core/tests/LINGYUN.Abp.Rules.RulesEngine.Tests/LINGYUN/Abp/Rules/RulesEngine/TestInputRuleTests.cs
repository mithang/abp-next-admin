using Shouldly;
using System;
using System.Threading.Tasks;
using Volo.Abp.Validation;
using Xunit;

namespace LINGYUN.Abp.Rules.RulesEngine
{
    public class TestInputRuleTests : AbpRulesEngineTestBase
    {
        private readonly IRuleProvider _ruleProvider;

        public TestInputRuleTests()
        {
            _ruleProvider = GetRequiredService<IRuleProvider>();
        }

        [Fact]
        public async Task Input_Required_Should_Required()
        {
            var input = new TestInput 
            {
                Integer1 = 101,
                Integer2 = 99,
                Length = "123456"
            }
            ;
            var exception = await Assert.ThrowsAsync<AbpValidationException>(async () =>
            {
                await _ruleProvider.ExecuteAsync(input);
            });

            exception.Message.ShouldBe("Một hoặc nhiều quy tắc không đạt");
            exception.ValidationErrors.Count.ShouldBe(1);
            exception.ValidationErrors[0].ErrorMessage.ShouldBe("Trường Required bắt buộc phải nhập!");
        }

        [Fact]
        public async Task Input_Integer1_Should_MustBeGreaterThan100()
        {
            var input = new TestInput
            {
                Required = "123456",
                Integer1 = 99,
                Integer2 = 99,
                Length = "123456"
            };
            var exception = await Assert.ThrowsAsync<AbpValidationException>(async () =>
            {
                await _ruleProvider.ExecuteAsync(input);
            });

            exception.Message.ShouldBe("Một hoặc nhiều quy tắc không đạt");
            exception.ValidationErrors.Count.ShouldBe(1);
            exception.ValidationErrors[0].ErrorMessage.ShouldBe("Trường Integer1 phải lớn hơn 100!");
        }

        [Fact]
        public async Task Input_Integer2_Should_MustBeLessThan100()
        {
            var input = new TestInput
            {
                Required = "123456",
                Integer1 = 101,
                Integer2 = 100,
                Length = "123456"
            };
            var exception = await Assert.ThrowsAsync<AbpValidationException>(async () =>
            {
                await _ruleProvider.ExecuteAsync(input);
            });

            exception.Message.ShouldBe("Một hoặc nhiều quy tắc không đạt");
            exception.ValidationErrors.Count.ShouldBe(1);
            exception.ValidationErrors[0].ErrorMessage.ShouldBe("Trường Integer2 phải nhỏ hơn 100!");
        }

        [Fact]
        public async Task Input_Sum_Integer1_And_Integer2_Should_MustBeGreaterThan150()
        {
            var input = new TestInput
            {
                Required = "1",
                Integer1 = 101,
                Integer2 = 48,
                Length = "123456"
            };
            var exception = await Assert.ThrowsAsync<AbpValidationException>(async () =>
            {
                await _ruleProvider.ExecuteAsync(input);
            });

            exception.Message.ShouldBe("Một hoặc nhiều quy tắc không đạt");
            exception.ValidationErrors.Count.ShouldBe(1);
            exception.ValidationErrors[0].ErrorMessage.ShouldBe("Tổng của trường Integer1 và Integer2 phải lớn hơn 150!");
        }

        [Fact]
        public async Task Input_Required_Length_Should_MustBeGreaterThan5()
        {
            var input = new TestInput
            {
                Required = "1",
                Integer1 = 101,
                Integer2 = 50,
                Length = "12345"
            };
            var exception = await Assert.ThrowsAsync<AbpValidationException>(async () =>
            {
                await _ruleProvider.ExecuteAsync(input);
            });

            exception.Message.ShouldBe("Một hoặc nhiều quy tắc không đạt");
            exception.ValidationErrors.Count.ShouldBe(1);
            exception.ValidationErrors[0].ErrorMessage.ShouldBe("Độ dài trường Length phải lớn hơn 5!");
        }
    }
}
