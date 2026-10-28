. "../build/build-aspnetcore-common.ps1"

Write-host "Bắt đầu triển khai container."

$rootFolder = (Get-Item -Path "../" -Verbose).FullName
$deployPath = $rootFolder + "/deploy";
$buildPath = $rootFolder + "/build";
$aspnetcorePath = $rootFolder + "/aspnet-core";
$vuePath = $rootFolder + "/apps/vben5";

Write-host "root: " + $rootFolder

## Triển khai middleware
Write-host "deploy middleware..."
Set-Location $rootFolder
docker-compose -f .\docker-compose.middleware.yml -p labp up -d --build

## Chờ 30 giây, khởi tạo cơ sở dữ liệu hoàn tất
Write-host "initial database..."
Start-Sleep -Seconds 30
## Tạo cơ sở dữ liệu
# Write-host "create database..."
# Set-Location $aspnetcorePath
# cmd.exe /c create-database.bat

## Thực hiện di chuyển cơ sở dữ liệu
Write-host "migrate database..."
Set-Location $rootFolder
foreach ($solution in $migrationArray) {  
    Set-Location $solution.Path
    dotnet run --no-build
}

## Xây dựng image docker backend
Write-host "publish backend docker image..."
Set-Location $rootFolder
foreach ($docker in $dockerArray) {    
    $image = $docker.Image + ":" + $docker.Version
    Write-host "docker build -f " $docker.Dockerfile " -t " $image " ."
    docker build -f $docker.Dockerfile -t $image .
}
## Chạy ứng dụng backend
Write-host "running backend application..."
Set-Location $rootFolder
docker-compose -f .\docker-compose.yml -f .\docker-compose.override.yml -f .\docker-compose.override.configuration.yml -p labp up -d

## Xây dựng dự án frontend
Write-host "build front project..."
Set-Location $vuePath
Start-Process pnpm -ArgumentList "dev:app" -NoNewWindow

Set-Location $deployPath
Write-host "application is running..."
