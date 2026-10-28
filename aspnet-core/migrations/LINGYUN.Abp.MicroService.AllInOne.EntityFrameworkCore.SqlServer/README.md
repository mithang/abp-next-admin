# SQL Server Hướng dẫn di chuyển cơ sở dữ liệu

Hướng dẫn này sẽ giúp bạn sử dụng tập lệnh di chuyển để quản lý SQL Server các thao tác di chuyển cơ sở dữ liệu.

## Điều kiện tiên quyết

1. Đảm bảo đã cài đặt .NET Core SDK
2. Đảm bảo đã cài đặt công cụ Entity Framework Core
   ```powershell
   dotnet tool install --global dotnet-ef
   ```
3. Đảm bảo đã cấu hình đúng SQL Server chuỗi kết nối

## Hướng dẫn sử dụng

### 1. Tạo di chuyển mới

1. Chạy tập lệnh di chuyển trong thư mục `aspnet-core/migrations`:
   ```powershell
   # Sử dụng phiên bản tiếng Trung
   .\Migrate.ps1
   
   # Hoặc sử dụng phiên bản tiếng Anh
   .\MigrateEn.ps1
   ```

2. Chọn SQL Server ngữ cảnh cơ sở dữ liệu trong menu:
   ```
   [3] LINGYUN.Abp.MicroService.AllInOne.EntityFrameworkCore.SqlServer
   ```

3. Nhập tên di chuyển (tùy chọn):
   - Nhấn Enter trực tiếp sẽ sử dụng tên mặc định:`AddNewMigration_yyyyMMdd_HHmmss`
   - Hoặc nhập tên tùy chỉnh, ví dụ:`AddNewFeature`

### 2. Tạo tập lệnh SQL

Sau khi tạo di chuyển, tập lệnh sẽ hỏi có cần tạo tập lệnh SQL hay không:

1. Chọn có tạo tập lệnh SQL hay không (Y/N)
2. Nếu chọn Y, các tùy chọn sau sẽ được cung cấp:
   - `[A]` - Tạo tập lệnh SQL cho tất cả các di chuyển
   - `[L]` - Chỉ tạo tập lệnh SQL cho di chuyển mới nhất
   - `[0-9]` - Tạo bắt đầu từ phiên bản di chuyển đã chỉ định

Tập lệnh SQL đã tạo sẽ được lưu tại:
```
aspnet-core/InitSql/LINGYUN.Abp.MicroService.AllInOne.EntityFrameworkCore.SqlServer/
```

### 3. Áp dụng di chuyển

Tập lệnh SQL đã tạo có thể được áp dụng vào cơ sở dữ liệu bằng các cách sau:

1. Sử dụng SQL Server Management Studio hoặc công cụ máy khách SQL Server khác để thực thi tập lệnh SQL
2. Hoặc sử dụng dòng lệnh:
   ```bash
   sqlcmd -S your_server -d your_database -i your_script.sql
   ```
