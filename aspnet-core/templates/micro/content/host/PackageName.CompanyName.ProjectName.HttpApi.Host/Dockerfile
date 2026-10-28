FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
LABEL maintainer="colin.in@foxmail.com"
WORKDIR /app

COPY . /app

## Đặt múi giờ máy chủ.
## Nên định nghĩa ở bên ngoài (ví dụ docker-compose.yml)
## Set server time zone.
## Suggest defining it externally (such as Docker Compose. yml)
#ENV TZ=Asia/Shanghai
#RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo '$TZ' > /etc/timezone


## Khắc phục sự cố phiên bản TLS quá cao khi kết nối SqlServer.
## Nếu nhà cung cấp dữ liệu là SqlServer và phiên bản tương thích từ 120 trở xuống, cần bỏ ghi chú thủ công.
## The version of connection SqlServer TLS is too high.
## If the data provider is SqlServer and the compatibility version is 120 and below, manual annotation needs to be cancelled.

#RUN sed -i 's/\[openssl_init\]/# \[openssl_init\]/g' /etc/ssl/openssl.cnf
#RUN sed -i '$a\[openssl_init]' /etc/ssl/openssl.cnf
#RUN sed -i '$a\providers = provider_sect' /etc/ssl/openssl.cnf
#RUN sed -i '$a\ssl_conf = ssl_sect' /etc/ssl/openssl.cnf
 #
#RUN sed -i '$a\[provider_sect]' /etc/ssl/openssl.cnf
#RUN sed -i '$a\default = default_sect' /etc/ssl/openssl.cnf
#RUN sed -i '$a\legacy = legacy_sect' /etc/ssl/openssl.cnf
 #
#RUN sed -i '$a\[default_sect]' /etc/ssl/openssl.cnf
#RUN sed -i '$a\activate = 1' /etc/ssl/openssl.cnf
 #
#RUN sed -i '$a\[legacy_sect]' /etc/ssl/openssl.cnf
#RUN sed -i '$a\activate = 1' /etc/ssl/openssl.cnf
 #
#RUN sed -i '$a\[ssl_sect]' /etc/ssl/openssl.cnf
#RUN sed -i '$a\system_default = system_default_sect' /etc/ssl/openssl.cnf
 #
#RUN sed -i '$a\[system_default_sect]' /etc/ssl/openssl.cnf
#RUN sed -i '$a\CipherString = DEFAULT:@SECLEVEL=0' /etc/ssl/openssl.cnf

## Nguồn mirror Alibaba
#RUN sed -i "s@http://deb.debian.org@http://mirrors.aliyun.com@g" /etc/apt/sources.list.d/debian.sources
#RUN apt-get clean
#RUN apt-get update

RUN apt update && apt install wget -y

USER $APP_UID

## .NET 8.0 mặc định dùng cổng 8080, muốn đổi sang cổng 80 cần biến môi trường ASPNETCORE_HTTP_PORTS=80
## .NET 8.0 defaults to port 8080, changing to port 80 requires the environment variable ASPNETCORE.HTTP-PORTS=80
EXPOSE 8080/tcp

VOLUME [ "./app/Logs" ]
VOLUME [ "./app/Modules" ]

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /build

## Sao chép cấu hình cần thiết để build dự án
COPY ["common.props", "./"]
COPY ["configureawait.props", "./"]
COPY ["Directory.Build.props", "./"]
COPY ["Directory.Packages.props", "./"]
COPY ["NuGet.Config", "./"]

## Sao chép cấu trúc dự án
COPY ["src/", "build/src/"]
COPY ["migrations/", "build/migrations/"]
COPY ["host/", "build/host/"]
RUN dotnet restore "build/host/PackageName.CompanyName.ProjectName.HttpApi.Host/PackageName.CompanyName.ProjectName.HttpApi.Host.csproj"

## Build
COPY . .
WORKDIR "/build/host/PackageName.CompanyName.ProjectName.HttpApi.Host"
RUN dotnet build "./PackageName.CompanyName.ProjectName.HttpApi.Host.csproj" -c $BUILD_CONFIGURATION -o /app/build

## Publish
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./PackageName.CompanyName.ProjectName.HttpApi.Host.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

## Chạy
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PackageName.CompanyName.ProjectName.HttpApi.Host.dll"]