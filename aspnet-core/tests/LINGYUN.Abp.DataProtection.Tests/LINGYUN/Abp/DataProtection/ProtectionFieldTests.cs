using LINGYUN.Abp.Authorization.OrganizationUnits;
using LINGYUN.Abp.Authorization.Permissions;
using LINGYUN.Abp.DataProtection.Keywords;
using LINGYUN.Abp.DataProtection.Stores;
using Shouldly;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Volo.Abp.Authorization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Data;
using Volo.Abp.Security.Claims;
using Xunit;

namespace LINGYUN.Abp.DataProtection
{
    public class ProtectionFieldTests : AbpDataProtectionTestBase
    {
        private readonly IFakeProtectionObjectRepository _repository;
        private readonly ICurrentPrincipalAccessor _accessor;
        private readonly IDataProtectedResourceStore _store;
        private readonly IDataFilter _dataFilter;

        public ProtectionFieldTests()
        {
            _repository = GetRequiredService<IFakeProtectionObjectRepository>();
            _accessor = GetRequiredService<ICurrentPrincipalAccessor>();
            _store = GetRequiredService<IDataProtectedResourceStore>();
            _dataFilter = GetRequiredService<IDataFilter>();
        }

        [Fact]
        public async virtual Task Should_Protected_Data_By_Repo()
        {
            var validUser = Guid.NewGuid();

            await WithUnitOfWorkAsync(async () =>
            {
                var identity = new ClaimsIdentity();
                identity.AddClaim(new Claim(AbpClaimTypes.UserId, validUser.ToString()));
                identity.AddClaim(new Claim(AbpClaimTypes.UserName, "user1"));
                identity.AddClaim(new Claim(AbpClaimTypes.Role, "role1"));
                identity.AddClaim(new Claim(AbpClaimTypes.Role, "role2"));
                identity.AddClaim(new Claim(AbpOrganizationUnitClaimTypes.OrganizationUnit, "00001"));
                identity.AddClaim(new Claim(AbpOrganizationUnitClaimTypes.OrganizationUnit, "00001.00002"));
                using (_accessor.Change(new ClaimsPrincipal(identity)))
                {
                    var values = new List<FakeProtectionObject>()
                    {
                        new FakeProtectionObject(1)
                        {
                            Protect1 = "Protect1",
                            Protect2 = "Protect1",
                            Value1 = "Value1",
                            Value2 = "Value1",
                            ProtectNum1 = 100,
                            ProtectNum2 = 200,
                            Num3 = 400,
                        },
                        new FakeProtectionObject(2)
                        {
                            Protect1 = "test",
                            Protect2 = "Protect2",
                            Value1 = "Value2",
                            Value2 = "Value2",
                            ProtectNum1 = 1000,
                            ProtectNum2 = 2000,
                            Num3 = 3000
                        },
                        new FakeProtectionObject(3)
                        {
                            Protect1 = "test1",
                            Protect2 = "Protect3",
                            Value1 = "Value3",
                            Value2 = "Value3",
                            ProtectNum1 = 10000,
                            ProtectNum2 = 20000,
                            Num3 = 300
                        },
                        new FakeProtectionObject(4)
                        {
                            Protect1 = "test3",
                            Protect2 = "Protect4",
                            Value1 = "Value4",
                            Value2 = "Value4",
                            ProtectNum1 = 10000,
                            ProtectNum2 = 20000,
                            Num3 = 300
                        }
                    };
                    await _repository.InsertManyAsync(values, true);
                }

                // Quy tắc của role2
                var rule2FilterGroup = new DataAccessFilterGroup();
                // Chỉ cho phép truy vấn Num3 nhỏ hơn hoặc bằng 400
                rule2FilterGroup.AddRule(new DataAccessFilterRule(nameof(FakeProtectionObject.Num3), 400, typeof(int).FullName, "number", DataAccessFilterOperate.LessOrEqual));
                await _store.SetAsync(new DataAccessResource(RolePermissionValueProvider.ProviderName, "role2", typeof(FakeProtectionObject).FullName, DataAccessOperation.Read, rule2FilterGroup));

                // Quy tắc chỉnh sửa của role3
                var rule3WriteAccess = new DataAccessFilterGroup();
                // Chỉ cho phép chỉnh sửa dữ liệu do chính mình gửi
                rule3WriteAccess.AddRule(new DataAccessFilterRule(nameof(FakeProtectionObject.CreatorId), DataAccessCurrentUserContributor.Name, typeof(Guid?).FullName, "string", DataAccessFilterOperate.Equal));
                var rule3WriteAccessCacheItem = new DataAccessResource(RolePermissionValueProvider.ProviderName, "role3", typeof(FakeProtectionObject).FullName, DataAccessOperation.Write, rule3WriteAccess);
                // Chỉ cho phép chỉnh sửa trường Num3
                rule3WriteAccessCacheItem.AccessedProperties.AddRange(new string[] { nameof(FakeProtectionObject.Num3) });
                await _store.SetAsync(rule3WriteAccessCacheItem);

                // Quy tắc đọc của role1
                var rule1ReadAccess = new DataAccessFilterGroup();
                // Chỉ cho phép đọc dữ liệu do chính mình gửi
                rule1ReadAccess.AddRule(new DataAccessFilterRule(nameof(FakeProtectionObject.CreatorId), DataAccessCurrentUserContributor.Name, typeof(Guid?).FullName, "string", DataAccessFilterOperate.Equal));
                var rule1ReadAccessCacheItem = new DataAccessResource(RolePermissionValueProvider.ProviderName, "role1", typeof(FakeProtectionObject).FullName, DataAccessOperation.Read, rule1ReadAccess);
                // Chỉ cho phép đọc trường Num3
                rule1ReadAccessCacheItem.AccessedProperties.AddRange(new string[] { nameof(FakeProtectionObject.Id), nameof(FakeProtectionObject.Num3) });
                await _store.SetAsync(rule1ReadAccessCacheItem);


                // Quy tắc đọc của ou1
                var ou1ReadAccess = new DataAccessFilterGroup();
                // Cho phép đọc dữ liệu của phòng ban mình và các phòng ban cấp dưới
                // Lấy danh sách cấu trúc cây phòng ban, thuận tiện thêm nhiều tập điều kiện phòng ban
                ou1ReadAccess.AddRule(new DataAccessFilterRule($"{nameof(FakeProtectionObject.CreatorId)}", new List<Guid?>() { validUser, Guid.NewGuid() }, typeof(Guid?).FullName, "string", DataAccessFilterOperate.Contains, true));
                //ou1ReadAccess.AddRule(new DataAccessFilterRule($"{nameof(FakeProtectionObject.ExtraProperties)}.{DataAccessKeywords.AUTH_ORGS}", "[00001]", DataAccessFilterOperate.Contains));
                //ou1ReadAccess.AddRule(new DataAccessFilterRule($"{nameof(FakeProtectionObject.ExtraProperties)}.{DataAccessKeywords.AUTH_ORGS}", "[00001.00002]", DataAccessFilterOperate.Contains));

                var ou1ReadAccessCacheItem = new DataAccessResource(OrganizationUnitPermissionValueProvider.ProviderName, "00001", typeof(FakeProtectionObject).FullName, DataAccessOperation.Read, ou1ReadAccess);

                // Chỉ cho phép đọc trường Num3
                ou1ReadAccessCacheItem.AccessedProperties.AddRange(new string[] { nameof(FakeProtectionObject.Id), nameof(FakeProtectionObject.Num3) });
                await _store.SetAsync(ou1ReadAccessCacheItem);
            });

            await WithUnitOfWorkAsync(async () =>
            {
                // Đánh dấu không bật bộ lọc dữ liệu thì phải lấy được toàn bộ dữ liệu
                var result = await _repository.GetAllListAsync();
                result.Count.ShouldBe(4);
            });

            var readUser = Guid.NewGuid();
            await WithUnitOfWorkAsync(async () =>
            {
                var identity2 = new ClaimsIdentity();
                identity2.AddClaim(new Claim(AbpClaimTypes.UserId, readUser.ToString()));
                identity2.AddClaim(new Claim(AbpClaimTypes.UserName, "user2"));
                identity2.AddClaim(new Claim(AbpClaimTypes.Role, "role2"));
                using (_accessor.Change(identity2))
                {
                    // Phải chỉ đọc được dữ liệu Num3 nhỏ hơn hoặc bằng 400, chỉ có 3 bản ghi
                    var result = await _repository.GetListAsync();
                    result.Count.ShouldBe(3);
                }
            });

            await WithUnitOfWorkAsync(async () =>
            {
                var identity3 = new ClaimsIdentity();
                identity3.AddClaim(new Claim(AbpClaimTypes.UserId, readUser.ToString()));
                identity3.AddClaim(new Claim(AbpClaimTypes.UserName, "user2"));
                identity3.AddClaim(new Claim(AbpOrganizationUnitClaimTypes.OrganizationUnit, "00001"));
                using (_accessor.Change(identity3))
                {
                    // Phải lấy được 4 bản ghi
                    var result = await _repository.GetListAsync();
                    result.Count.ShouldBe(4);
                }
            });

            await WithUnitOfWorkAsync(async () =>
            {
                var identity3 = new ClaimsIdentity();
                identity3.AddClaim(new Claim(AbpClaimTypes.UserId, validUser.ToString()));
                identity3.AddClaim(new Claim(AbpClaimTypes.UserName, "user3"));
                identity3.AddClaim(new Claim(AbpClaimTypes.Role, "role3"));
                using (_accessor.Change(identity3))
                {
                    var entity = await _repository.FindAsync(1);
                    entity.Protect1 = "New Protect1";
                    entity.Num3 = 100;
                    // Chuyển sang người dùng được ủy quyền thì phải lưu được dữ liệu
                    var resultEntity = await _repository.UpdateAsync(entity, true);
                    // Trường được ủy quyền phải lưu thành công
                    resultEntity.Num3.ShouldBe(100);
                    // Trường chưa được ủy quyền phải không lưu thành công
                    resultEntity.Protect1.ShouldBe("Protect1");
                }
            });

            await WithUnitOfWorkAsync(async () =>
            {
                var identity3 = new ClaimsIdentity();
                identity3.AddClaim(new Claim(AbpClaimTypes.UserId, validUser.ToString()));
                identity3.AddClaim(new Claim(AbpClaimTypes.UserName, "user3"));
                identity3.AddClaim(new Claim(AbpClaimTypes.Role, "role1"));
                // identity3.AddClaim(new Claim(AbpClaimTypes.Role, "role3"));
                using (_accessor.Change(identity3))
                {

                    //var filterBuilder = GetRequiredService<IEntityTypeFilterBuilder>();
                    //var group = new DataAccessFilterGroup();
                    //group.AddRule(new DataAccessFilterRule(nameof(FakeProtectionObject.Num3), 300, DataAccessFilterOperate.LessOrEqual));

                    //var exp1 = await filterBuilder.BuildAsync(typeof(FakeProtectionObject), DataAccessOperation.Read, group);
                    //var queryable = await _repository.GetQueryableAsync();
                    //var entities = queryable.Where(exp1.Compile().As<Func<FakeProtectionObject, bool>>()).ToList();

                    var entity = await _repository.FindAsync(1);

                    var resultBuilder = GetRequiredService<IEntityPropertyResultBuilder>();
                    var exp = await resultBuilder.Build(typeof(FakeProtectionObject), DataAccessOperation.Read);
                    var comp = exp.Compile();
                    // Dùng interface phi generic để biên dịch cây biểu thức, thay thế kết quả trả về
                    var resultEntity = comp.DynamicInvoke(entity).As<FakeProtectionObject>();
                    // Trường chưa được ủy quyền phải trả về giá trị mặc định
                    resultEntity.Protect1.ShouldBeNullOrWhiteSpace();
                }
            });

            await WithUnitOfWorkAsync(async () =>
            {
                var identity3 = new ClaimsIdentity();
                identity3.AddClaim(new Claim(AbpClaimTypes.UserId, Guid.NewGuid().ToString()));
                identity3.AddClaim(new Claim(AbpClaimTypes.UserName, "user3"));
                identity3.AddClaim(new Claim(AbpClaimTypes.Role, "role3"));
                using (_accessor.Change(identity3))
                {
                    var entity = await _repository.FindAsync(1);

                    entity.Num3 = 300;
                    // Thao tác trên thực thể chưa được ủy quyền phải ném ngoại lệ chưa được ủy quyền
                    await Assert.ThrowsAsync<AbpAuthorizationException>(async () => await _repository.UpdateAsync(entity, true));
                }
            });

            await WithUnitOfWorkAsync(async () =>
            {
                var entity = await _repository.FindAsync(1);
                entity.Num3 = 200;
                using (_dataFilter.Disable<IDataProtected>())
                {
                    // Sau khi tắt bộ lọc bảo vệ dữ liệu thì phải lưu được dữ liệu
                    var resultEntity = await _repository.UpdateAsync(entity);
                    resultEntity.Num3.ShouldBe(200);
                }
            });
        }
    }
}
