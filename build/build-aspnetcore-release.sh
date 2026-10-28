readonly workdir=$(cd $(dirname $0); pwd)
echo "Thư mục làm việc hiện tại: $workdir"

echo "Xây dựng dịch vụ xác thực danh tính"
cd $workdir"/../aspnet-core/services/account/AuthServer.Host"

dotnet restore
dotnet publish -c Release -o ../../Publish/identityserver --no-cache --no-restore
cp -r -f Dockerfile ../../Publish/identityserver/Dockerfile


echo "Bắt đầu xây dựng dịch vụ quản lý xác thực danh tính"
cd $workdir"/../aspnet-core/services/identity-server/LINGYUN.Abp.IdentityServer4.HttpApi.Host"

dotnet restore
dotnet publish -c Release -o ../../Publish/identityserver4-admin --no-cache --no-restore
cp -r -f Dockerfile ../../Publish/identityserver4-admin/Dockerfile

echo "Bắt đầu xây dựng dịch vụ quản trị backend"

cd $workdir"/../aspnet-core/services/admin/LINGYUN.Abp.BackendAdmin.HttpApi.Host"

dotnet restore
dotnet publish -c Release -o ../../Publish/admin --no-cache --no-restore
cp -r -f Dockerfile ../../Publish/admin/Dockerfile


echo "Bắt đầu xây dựng dịch vụ quản lý nền tảng"

cd $workdir"/../aspnet-core/services/platform/LINGYUN.Platform.HttpApi.Host"

dotnet restore
dotnet publish -c Release -o ../../Publish/platform --no-cache --no-restore
cp -r -f Dockerfile ../../Publish/platform/Dockerfile

echo "Bắt đầu xây dựng dịch vụ quản lý tin nhắn"
cd $workdir"/../aspnet-core/services/messages/LINGYUN.Abp.MessageService.HttpApi.Host"

dotnet restore
dotnet publish -c Release -o ../../Publish/messages --no-cache --no-restore
cp -r -f Dockerfile ../../Publish/messages/Dockerfile

echo "Bắt đầu xây dựng dịch vụ quản lý bản địa hóa"
cd $workdir"/../aspnet-core/services/localization/LINGYUN.Abp.LocalizationManagement.HttpApi.Host"

dotnet restore
dotnet publish -c Release -o ../../Publish/localization --no-cache --no-restore
cp -r -f Dockerfile ../../Publish/localization/Dockerfile

echo "Bắt đầu xây dựng dịch vụ quản lý gateway"
cd $workdir"/../aspnet-core/services/apigateway/LINGYUN.ApiGateway.HttpApi.Host"

dotnet restore
dotnet publish -c Release -o ../../Publish/apigateway-admin --no-cache --no-restore
cp -r -f Dockerfile ../../Publish/apigateway-admin/Dockerfile

echo "Bắt đầu xây dựng dịch vụ gateway"
cd $workdir"/../aspnet-core/services/apigateway/LINGYUN.ApiGateway.Host"

dotnet restore
dotnet publish -c Release -o ../../Publish/apigateway-host --no-cache --no-restore
cp -r -f Dockerfile ../../Publish/apigateway-host/Dockerfile
