FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# copy props
COPY common.props ./
COPY common.secrets.props ./
COPY configureawait.props ./
COPY Directory.Build.props ./
COPY Directory.Packages.props ./
COPY NuGet.Config ./

# copy csproj
COPY aspnet-core/services/LINGYUN.Abp.MicroService.AllInOne/ ./aspnet-core/services/LINGYUN.Abp.MicroService.AllInOne/

# framework
COPY aspnet-core/framework/ ./aspnet-core/framework/

# migrations
COPY aspnet-core/migrations/LINGYUN.Abp.MicroService.AllInOne.EntityFrameworkCore/ ./aspnet-core/migrations/LINGYUN.Abp.MicroService.AllInOne.EntityFrameworkCore/
COPY aspnet-core/migrations/LINGYUN.Abp.MicroService.AllInOne.EntityFrameworkCore.MySql/ ./aspnet-core/migrations/LINGYUN.Abp.MicroService.AllInOne.EntityFrameworkCore.MySql/
COPY aspnet-core/migrations/LINGYUN.Abp.MicroService.AllInOne.EntityFrameworkCore.PostgreSql/ ./aspnet-core/migrations/LINGYUN.Abp.MicroService.AllInOne.EntityFrameworkCore.PostgreSql/
COPY aspnet-core/migrations/LINGYUN.Abp.MicroService.AllInOne.EntityFrameworkCore.SqlServer/ ./aspnet-core/migrations/LINGYUN.Abp.MicroService.AllInOne.EntityFrameworkCore.SqlServer/

# modules
COPY aspnet-core/modules/ ./aspnet-core/modules/

# dotnet restore
RUN dotnet restore aspnet-core/services/LINGYUN.Abp.MicroService.AllInOne/LINGYUN.Abp.MicroService.AllInOne.csproj

# dotnet publish
WORKDIR /src/aspnet-core/services/LINGYUN.Abp.MicroService.AllInOne
RUN dotnet publish -c Release -o /app/publish --no-restore

# dotnet run
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# DEV-16 (devops iter-0013): the AllInOne host reads
# APPLICATION_DATABASE_PROVIDER in Program.cs and, when it is unset,
# loads no provider-specific appsettings, so Quartz falls back to the
# base Development config (clustered=true) with the default RAMJobStore
# and aborts startup (reproduced this round: AbpInitializationException,
# "Property 'clustered' has no setter"). Default to PostgreSql, the
# same default docker-compose.allinone.yml already sets; compose
# environment overrides this, so MySql/SqlServer deployments are
# unaffected. Needs verification by a real `docker build/run`
# (Docker BLOCKED).
ENV APPLICATION_DATABASE_PROVIDER=PostgreSql

ENTRYPOINT ["dotnet", "LINGYUN.Abp.MicroService.AllInOne.dll"]