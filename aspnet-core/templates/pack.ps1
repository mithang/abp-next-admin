# Dọn dẹp bản dựng trước đó
if (Test-Path -Path "./aio/LocalNuget") {
    Remove-Item -Path "./aio/LocalNuget/*" -Recurse -Force
}
else {
    New-Item -ItemType Directory -Path "./aio/LocalNuget"
}

if (Test-Path -Path "./micro/LocalNuget") {
    Remove-Item -Path "./micro/LocalNuget/*" -Recurse -Force
}
else {
    New-Item -ItemType Directory -Path "./micro/LocalNuget"
}

# Hiển thị menu lựa chọn
Write-Host "Hãy chọn mẫu cần đóng gói:"
Write-Host "1. Mẫu microservice (PackageName.CompanyName.ProjectName)"
Write-Host "2. Mẫu AllInOne (PackageName.CompanyName.ProjectName.AIO)"
Write-Host "3. Đóng gói tất cả"

$choice = Read-Host "Hãy nhập lựa chọn (1-3)"

switch ($choice) {
    "1" {
        Write-Host "Đang đóng gói mẫu microservice..."
        dotnet pack ./micro/PackageName.CompanyName.ProjectName.csproj -c Release -o ./micro/LocalNuget --nologo -p:NoDefaultExcludes=true
    }
    "2" {
        Write-Host "Đang đóng gói mẫu AllInOne..."
        dotnet pack ./aio/PackageName.CompanyName.ProjectName.AIO.csproj -c Release -o ./aio/LocalNuget --nologo -p:NoDefaultExcludes=true
    }
    "3" {
        Write-Host "Đang đóng gói tất cả các mẫu..."
        dotnet pack ./micro/PackageName.CompanyName.ProjectName.csproj -c Release -o ./micro/LocalNuget --nologo -p:NoDefaultExcludes=true
        dotnet pack ./aio/PackageName.CompanyName.ProjectName.AIO.csproj -c Release -o ./aio/LocalNuget --nologo -p:NoDefaultExcludes=true
    }
    default {
        Write-Host "Lựa chọn không hợp lệ, thoát script"
        exit 1
    }
}

# Hỏi có phát hành lên máy chủ NuGet không
$publishChoice = Read-Host "Bạn có muốn phát hành lên máy chủ NuGet không? (Y/N)"

if ($publishChoice -eq "Y" -or $publishChoice -eq "y") {
    # Phát hành gói tương ứng theo lựa chọn trước đó
    switch ($choice) {
        "1" {
            $packages = Get-ChildItem -Path "./micro/LocalNuget/*.nupkg"
        }
        "2" {
            $packages = Get-ChildItem -Path "./aio/LocalNuget/*.nupkg"
        }
        "3" {
            $packages = @()
            $packages += Get-ChildItem -Path "./micro/LocalNuget/*.nupkg"
            $packages += Get-ChildItem -Path "./aio/LocalNuget/*.nupkg"
        }
    }
    
    foreach ($package in $packages) {
        Write-Host "Đang phát hành gói: $($package.Name)"
        dotnet nuget push $package.FullName --source "https://custom.nuget.net/nuget/abp/v3/index.json" --api-key "" --skip-duplicate
    }
    Write-Host "Phát hành hoàn tất!"
}
else {
    Write-Host "Bỏ qua bước phát hành."
    if ($choice -eq "1") {
        Write-Host "Tệp gói đã được lưu trong thư mục ./micro/LocalNuget."
    }
    elseif ($choice -eq "2") {
        Write-Host "Tệp gói đã được lưu trong thư mục ./aio/LocalNuget."
    }
    else {
        Write-Host "Tệp gói đã được lưu trong thư mục ./micro/LocalNuget và ./aio/LocalNuget."
    }
}
