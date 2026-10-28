# LINGYUN.Abp.Data.DbMigrator

Mô-đun di chuyển dữ liệu, dùng để phối hợp với các kịch bản cần cung cấp khởi tạo dữ liệu (ví dụ khi tạo tenant mới)  

## Cấu hình và sử dụng


```csharp
[DependsOn(typeof(AbpDataDbMigratorModule))]
public class YouProjectModule : AbpModule
{
  // other
}

public class FakeDbContext : AbpDbContext<FakeDbContext>
{
	public FakeDbContext(DbContextOptions<FakeDbContext> options)
		: base(options)
    {
        
     }

	 protected override void OnModelCreating(ModelBuilder modelBuilder)
     {
		base.OnModelCreating(modelBuilder);
     }
}

public class FakeMigretor 
{
	private readonly IDbSchemaMigrator _migrator;

	public FakeMigretor(
		IDbSchemaMigrator migrator)
	{
		_migrator = migrator;
	}

	public async Task MigrateAsync()
	{
		// Sẽ thực thi script migration EF, cần cung cấp DbContext dùng để di chuyển dữ liệu
		await _migrator.MigrateAsync<FakeDbContext>(
			// connectionString:	Chuỗi kết nối của tenant hiện tại, dùng để xây dựng kết nối
			// builder:				Trình xây dựng (builder) dùng để khởi tạo context
			(connectionString, builder) =>
			{

				// Trong delegate, người dùng quyết định tham số cơ sở dữ liệu
				builder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));

				// Trả về DbContext đã được khởi tạo
				return new FakeDbContext(builder.Options);
            });
	}
}
```
