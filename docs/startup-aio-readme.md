# Hướng dẫn khởi động dịch vụ đơn khối

[English](startup-aio-readme.en.md) | Tiếng Việt

## Mục lục

- [Khởi động nhanh bằng CLI](#khởi-động-nhanh-bằng-cli)
  - [Yêu cầu môi trường](#yêu-cầu-môi-trường)
  - [Cài đặt công cụ dòng lệnh](#cài-đặt-công-cụ-dòng-lệnh)
  - [Tạo dự án](#tạo-dự-án)
  - [Chạy dự án](#chạy-dự-án)
- [Khởi động từ mã nguồn](#khởi-động-từ-mã-nguồn)
  - [Yêu cầu môi trường](#yêu-cầu-môi-trường)
  - [Biên dịch dự án](#biên-dịch-dự-án)
  - [Cấu hình môi trường](#cấu-hình-môi-trường)
    - [Cấu hình bắt buộc](#cấu-hình-bắt-buộc)
    - [Cấu hình tuỳ chọn](#cấu-hình-tuỳ-chọn)
  - [Khởi tạo cơ sở dữ liệu](#khởi-tạo-cơ-sở-dữ-liệu)
  - [Khởi động dịch vụ](#khởi-động-dịch-vụ)
  - [Giải thích cấu hình](#giải-thích-cấu-hình)
- [Câu hỏi thường gặp](#câu-hỏi-thường-gặp)

## Khởi động nhanh bằng CLI

### Yêu cầu môi trường CLI

- .NET 8.0 SDK
- Cơ sở dữ liệu (hỗ trợ bất kỳ loại nào sau đây):
  - MySQL
  - SQL Server
  - SQLite
  - Oracle
  - Oracle Devart
  - PostgreSQL
- Redis

### Cài đặt template

```bash
# Cài đặt template microservice: lam
dotnet new install LINGYUN.Abp.MicroService.Templates

# Cài đặt template ứng dụng đơn khối: laa
dotnet new install LINGYUN.Abp.AllInOne.Templates
```

### Cài đặt công cụ dòng lệnh labp

```bash
  dotnet tool install --global LINGYUN.Abp.Cli
```

### Tạo dự án

```bash
# Tên viết tắt: laa (LINGYUN Abp AllInOne)
labp create YourCompanyName.YourProjectName -pk YourPackageName -t laa -o /path/to/output --dbms MySql --cs "Server=127.0.0.1;Database=Platform-V70;User Id=root;Password=123456;SslMode=None" --no-random-port
```

Giải thích tham số:

- `-pk` hoặc `--package-name`: Tên gói
- `-t` hoặc `--template`: Loại template, dùng `laa` để chỉ template ứng dụng đơn khối
- `-o` hoặc `--output`: Thư mục đầu ra
- `--dbms`: Loại cơ sở dữ liệu, hỗ trợ MySql, SqlServer, Sqlite, Oracle, OracleDevart, PostgreSql
- `--cs`: Chuỗi kết nối cơ sở dữ liệu
- `--no-random-port`: Không dùng cổng ngẫu nhiên

### Chạy dự án

Sau khi tạo dự án, vào thư mục dự án:

```bash
cd /path/to/output/host/YourPackageName.YourCompanyName.YourProjectName.AIO.Host
dotnet run --launch-profile "YourPackageName.YourCompanyName.YourProjectName.Development"
```

## Khởi động từ mã nguồn

### Yêu cầu môi trường

- .NET 8.0 SDK
- Cơ sở dữ liệu (hỗ trợ bất kỳ loại nào sau đây):
  - PostgreSQL
  - MySQL
  - SQL Server (sắp hỗ trợ)
- Redis
- Docker (tuỳ chọn)

### Biên dịch dự án

1. Đảm bảo đã cài .NET 8.0 SDK
2. Trong thư mục gốc của dự án, thực thi lệnh sau để biên dịch toàn bộ dự án:

```shell
./build/build-aspnetcore-release.ps1
```

3. Dùng IDE mở solution `LINGYUN.Abp.MicroService.AllInOne` để debug hoặc publish

### Cấu hình môi trường

#### Cấu hình bắt buộc

#### 1. Cấu hình cơ sở dữ liệu

Hỗ trợ nhiều loại cơ sở dữ liệu, sau đây là ví dụ cấu hình của từng loại cơ sở dữ liệu:

##### PostgreSQL

```shell
# Dùng Docker để khởi động PostgreSQL
docker run -d --name postgres \
    -p 5432:5432 \
    -e POSTGRES_PASSWORD=123456 \
    -e PGDATA=/var/lib/postgresql/data \
    postgres:16
```

##### MySQL

```shell
# Dùng Docker để khởi động MySQL
docker run -d --name mysql \
    -p 3306:3306 \
    -e MYSQL_ROOT_PASSWORD=123456 \
    mysql:8.0.46
```

##### SQL Server

```shell
# Dùng Docker để khởi động SQL Server
docker run -d --name sqlserver \
    -p 1433:1433 \
    -e "ACCEPT_EULA=Y" \
    -e "SA_PASSWORD=123456" \
    mcr.microsoft.com/mssql/server:2022-CU27-ubuntu-22.04
```

#### 2. Sửa file cấu hình

Cần sửa chuỗi kết nối cơ sở dữ liệu trong các file cấu hình sau theo loại cơ sở dữ liệu đã chọn:

Ví dụ chuỗi kết nối cơ sở dữ liệu:

PostgreSQL:

- `LINGYUN.Abp.MicroService.AllInOne/appsettings.Development.PostgreSql.json`
```json
{
  "ConnectionStrings": {
    "Default": "Host=127.0.0.1;Database=Platform-V70;Username=postgres;Password=123456;"
  }
}
```

MySQL:

- `LINGYUN.Abp.MicroService.AllInOne/appsettings.Development.MySql.json`
```json
{
  "ConnectionStrings": {
    "Default": "Server=127.0.0.1;Database=Platform-V70;User Id=root;Password=123456;SslMode=None"
  }
}
```

SQL Server:

- `LINGYUN.Abp.MicroService.AllInOne/appsettings.Development.SqlServer.json`
```json
{
  "ConnectionStrings": {
    "Default": "Server=localhost,1433;Database=Platform-V70;User Id=sa;Password=123456;TrustServerCertificate=True"
  }
}
```

#### 3. Dịch vụ Redis

```shell
# Dùng Docker để khởi động Redis
docker run -d --name redis -p 6379:6379 redis:6
```

Ví dụ cấu hình Redis:

```json
{
  "DistributedLock": {
    "IsEnabled": true,
    "Redis": {
      "Configuration": "127.0.0.1,defaultDatabase=14"
    }
  },
  "Redis": {
    "IsEnabled": true,
    "Configuration": "127.0.0.1,defaultDatabase=15",
    "InstanceName": "LINGYUN.Abp.Application"
  },
  "Features": {
    "Validation": {
      "Redis": {
        "Configuration": "127.0.0.1,defaultDatabase=13",
        "InstanceName": "LINGYUN.Abp.Application"
      }
    }
  }
}
```

### Cấu hình tuỳ chọn

Các cấu hình sau áp dụng cho kiến trúc phân tán đơn khối:

#### 1. Lưu trữ file phân tán MinIO

```json
{
  "Minio": {
    "WithSSL": false,
    "BucketName": "blobs",
    "EndPoint": "127.0.0.1:19000",
    "AccessKey": "{AccessKey}",
    "SecretKey": "{SecretKey}",
    "CreateBucketIfNotExists": false
  }
}
```

#### 2. Nhật ký kiểm toán phân tán Elasticsearch

```json
{
  "Elasticsearch": {
    "NodeUris": "http://127.0.0.1:9200"
  }
}
```

### Khởi tạo cơ sở dữ liệu

1. Chạy script migration cơ sở dữ liệu:

Phương án 1:

```shell
./aspnet-core/migrations/Migrate.ps1
```

Theo nhắc của dòng lệnh để tạo file migration và script sql, sau đó thực thi script sql để tạo bảng dữ liệu

Phương án 2 (khuyến nghị):
Lấy pgsql làm ví dụ

1. Chọn cấu hình khởi động
   - Chọn `Single.PostgreSql.Dev` trong `LINGYUN.Abp.MicroService.AllInOne.DbMigrator/Properties/launchSettings.json`

2. Cấu hình khởi tạo dữ liệu:

   - Sửa thông tin kết nối cơ sở dữ liệu trong `LINGYUN.Abp.MicroService.AllInOne.DbMigrator/appsettings.PostgreSql.json`

3. Thực thi migration dữ liệu:
   - Chạy dự án `LINGYUN.Abp.MicroService.AllInOne.DbMigrator`
   - Chờ migration dữ liệu hoàn tất, dữ liệu bảng cơ bản sẽ được khởi tạo

### Khởi động dịch vụ
1. Chọn cấu hình khởi động
   - Chọn `Single.PostgreSql.Dev` trong `LINGYUN.Abp.MicroService.AllInOne/Properties/launchSettings.json`
1. Chạy dự án `LINGYUN.Abp.MicroService.AllInOne`
2. Trong trình duyệt, truy cập tài liệu giao diện Swagger:
   - URL: http://127.0.0.1:30000/swagger

### Giải thích cấu hình

#### Cấu hình cơ bản

#### Cấu hình ứng dụng

```json
{
  "App": {
    "ShowPii": true,
    "SelfUrl": "http://127.0.0.1:30001/",
    "CorsOrigins": "http://127.0.0.1:3100,http://127.0.0.1:30001"
  }
}
```

#### Cấu hình bộ nhớ đệm phân tán

```json
{
  "DistributedCache": {
    "HideErrors": true,
    "KeyPrefix": "LINGYUN.Abp.Application",
    "GlobalCacheEntryOptions": {
      "SlidingExpiration": "30:00:00",
      "AbsoluteExpirationRelativeToNow": "60:00:00"
    }
  }
}
```

### Cấu hình xác thực

#### Cấu hình OpenIddict

```json
{
  "OpenIddict": {
    "Applications": {
      "VueAdmin": {
        "ClientId": "vue-admin-client",
        "RootUrl": "http://127.0.0.1:3100/"
      }
    },
    "Lifetime": {
      "AccessToken": "14:00:00",
      "IdentityToken": "00:20:00",
      "RefreshToken": "14:00:00"
    }
  }
}
```

#### Cấu hình xác thực danh tính

```json
{
  "Identity": {
    "Password": {
      "RequiredLength": 6,
      "RequireNonAlphanumeric": false,
      "RequireLowercase": false,
      "RequireUppercase": false,
      "RequireDigit": false
    },
    "Lockout": {
      "AllowedForNewUsers": false,
      "LockoutDuration": 5,
      "MaxFailedAccessAttempts": 5
    },
    "SignIn": {
      "RequireConfirmedEmail": false,
      "RequireConfirmedPhoneNumber": false
    }
  }
}
```

### Cấu hình công tắc tính năng

```json
{
  "FeatureManagement": {
    "IsDynamicStoreEnabled": true
  },
  "SettingManagement": {
    "IsDynamicStoreEnabled": true
  },
  "PermissionManagement": {
    "IsDynamicStoreEnabled": true
  }
}
```

### Cấu hình nhật ký

```json
{
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "System": "Warning",
        "Microsoft": "Warning"
      }
    },
    "WriteTo": [
      {
        "Name": "File",
        "Args": {
          "path": "Logs/Info-.log",
          "rollingInterval": "Day"
        }
      }
    ]
  }
}
```

## Câu hỏi thường gặp

Nếu gặp vấn đề, hãy kiểm tra:

1. Chuỗi kết nối cơ sở dữ liệu có đúng không
2. Có chọn đúng provider cơ sở dữ liệu không
3. Kết nối Redis có bình thường không
4. Các cổng cần thiết có bị chiếm không
5. Migration cơ sở dữ liệu đã hoàn tất thành công chưa
6. Cấu hình máy chủ xác thực có đúng không
7. Cấu hình CORS có đúng không (nếu frontend truy cập gặp vấn đề cross-origin)
