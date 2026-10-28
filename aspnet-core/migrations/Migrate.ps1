# Script migration cơ sở dữ liệu

# Nhập các module cần thiết
using namespace System.Management.Automation.Host

# Thêm biến môi trường FROM_MIGRATION để có thể kiểm tra trong file Program.cs
$env:FROM_MIGRATION = "true"

# Định nghĩa đường dẫn dự án
$projectPath = Resolve-Path (Join-Path $PSScriptRoot "..")

# Định nghĩa các DbContext khả dụng
$dbContexts = @{
    "1" = @{
        Name = "LINGYUN.Abp.MicroService.AllInOne.EntityFrameworkCore.MySql"
        Context = "SingleMigrationsDbContext"
        Factory = "SingleMigrationsDbContextFactory"
    }
    "2" = @{
        Name = "LINGYUN.Abp.MicroService.AllInOne.EntityFrameworkCore.PostgreSql"
        Context = "SingleMigrationsDbContext"
        Factory = "SingleMigrationsDbContextFactory"
    }
    "3" = @{
        Name = "LINGYUN.Abp.MicroService.AllInOne.EntityFrameworkCore.SqlServer"
        Context = "SingleMigrationsDbContext"
        Factory = "SingleMigrationsDbContextFactory"
    }
}

# Hiển thị menu chọn DbContext
function Show-DbContextMenu {
    $host.UI.RawUI.BackgroundColor = "Black"
    $host.UI.RawUI.ForegroundColor = "White"
    Clear-Host

    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "     Lựa chọn ngữ cảnh migration cơ sở dữ liệu" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Hãy chọn ngữ cảnh cơ sở dữ liệu cần migration:" -ForegroundColor Green
    foreach ($key in $dbContexts.Keys) {
        $context = $dbContexts[$key]
        Write-Host "[$key] " -NoNewline -ForegroundColor Magenta
        Write-Host "$($context.Name)" -ForegroundColor White
    }
    Write-Host ""
}

# Chọn DbContext
function Select-DbContext {
    Show-DbContextMenu
    
    while ($true) {
        $choice = Read-Host "Nhập số để chọn"
        if ($dbContexts.ContainsKey($choice)) {
            return $dbContexts[$choice]
        }
        Write-Host "Lựa chọn không hợp lệ, vui lòng nhập lại." -ForegroundColor Red
    }
}

# Lấy tên migration
function Get-MigrationName {
    $defaultName = "AddNewMigration_" + (Get-Date -Format "yyyyMMdd_HHmmss")
    $migrationName = Read-Host "Nhập tên migration (để trống sẽ dùng tên mặc định: $defaultName)"
    
    return ($migrationName ? $migrationName : $defaultName)
}

# Thực thi migration cơ sở dữ liệu
function Invoke-DatabaseMigration($dbContext, $migrationName) {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Đang thực thi migration cơ sở dữ liệu..." -ForegroundColor Green
    Write-Host "Ngữ cảnh: " -NoNewline -ForegroundColor Yellow
    Write-Host "$($dbContext.Name)" -ForegroundColor White
    Write-Host "Tên migration: " -NoNewline -ForegroundColor Yellow
    Write-Host "$migrationName" -ForegroundColor White
    Write-Host "Đường dẫn dự án: " -NoNewline -ForegroundColor Yellow
    Write-Host "$projectPath" -ForegroundColor White
    Write-Host "========================================" -ForegroundColor Cyan
    
    # Chuyển tới thư mục dự án và thực thi migration
    Push-Location $projectPath
    try {
        dotnet ef migrations add $migrationName --project "migrations/$($dbContext.Name)" --context "$($dbContext.Context)"
    }
    finally {
        Pop-Location
    }
}

# Lấy tất cả các file migration
function Get-AllMigrations($dbContext) {
    Push-Location $projectPath
    try {
        $migrations = @(dotnet ef migrations list --project "migrations/$($dbContext.Name)" --context "$($dbContext.Context)")
        return $migrations | Where-Object { $_ -match '\S' } # Lọc các dòng trống
    }
    finally {
        Pop-Location
    }
}

# Chọn migration bắt đầu
function Select-FromMigration($dbContext) {
    $migrations = Get-AllMigrations -dbContext $dbContext
    
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Các file migration khả dụng:" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Cyan
    
    for ($i = 0; $i -lt $migrations.Count; $i++) {
        Write-Host "[$i] " -NoNewline -ForegroundColor Magenta
        Write-Host "$($migrations[$i])" -ForegroundColor White
    }
    
    Write-Host "[A] " -NoNewline -ForegroundColor Magenta
    Write-Host "Tạo script SQL cho tất cả các migration" -ForegroundColor White
    Write-Host "[L] " -NoNewline -ForegroundColor Magenta
    Write-Host "Chỉ tạo script SQL cho migration mới nhất" -ForegroundColor White
    
    while ($true) {
        $choice = Read-Host "Hãy chọn file migration bắt đầu"
        if ($choice -eq "A" -or $choice -eq "a") {
            return $null
        }
        if ($choice -eq "L" -or $choice -eq "l") {
            if ($migrations.Count -gt 1) {
                return $migrations[$migrations.Count - 2]
            }
            return $null
        }
        if ([int]::TryParse($choice, [ref]$null)) {
            $index = [int]$choice
            if ($index -ge 0 -and $index -lt $migrations.Count) {
                return $migrations[$index]
            }
        }
        Write-Host "Lựa chọn không hợp lệ, vui lòng nhập lại." -ForegroundColor Red
    }
}

# Tạo script SQL
function Export-SqlScript($dbContext, $migrationName) {
    $choice = Read-Host "Có tạo script SQL migration không? (Y/N)"
    
    if ($choice -eq "Y" -or $choice -eq "y") {
        $sqlFileName = (Get-Date -Format "yyyyMMddHHmm") + ".sql"
        $initSqlPath = Join-Path $projectPath "InitSql"
        $contextSqlPath = Join-Path $initSqlPath $dbContext.Name
        
        # Đảm bảo thư mục InitSql và thư mục riêng theo ngữ cảnh tồn tại
        if (-not (Test-Path $initSqlPath)) {
            New-Item -ItemType Directory -Path $initSqlPath | Out-Null
        }
        if (-not (Test-Path $contextSqlPath)) {
            New-Item -ItemType Directory -Path $contextSqlPath | Out-Null
        }
        
        $sqlFilePath = Join-Path $contextSqlPath $sqlFileName
        
        # Chọn migration bắt đầu
        $fromMigration = Select-FromMigration -dbContext $dbContext
        
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "Đang tạo script SQL..." -ForegroundColor Green
        Write-Host "Đường dẫn đầu ra: " -NoNewline -ForegroundColor Yellow
        Write-Host "$sqlFilePath" -ForegroundColor White
        if ($fromMigration) {
            Write-Host "Migration bắt đầu: " -NoNewline -ForegroundColor Yellow
            Write-Host "$fromMigration" -ForegroundColor White
        }
        Write-Host "========================================" -ForegroundColor Cyan
        
        # Chuyển tới thư mục dự án và tạo script SQL
        Push-Location $projectPath
        try {
            if ($fromMigration) {
                dotnet ef migrations script $fromMigration --project "migrations/$($dbContext.Name)" --context "$($dbContext.Context)" --output $sqlFilePath
            }
            else {
                dotnet ef migrations script --project "migrations/$($dbContext.Name)" --context "$($dbContext.Context)" --output $sqlFilePath
            }
        }
        finally {
            Pop-Location
        }
        
        Write-Host "Script SQL đã được tạo: " -NoNewline -ForegroundColor Green
        Write-Host "$sqlFilePath" -ForegroundColor White
    }
}

# Luồng thực thi chính
try {
    $dbContext = Select-DbContext
    $migrationName = Get-MigrationName
    Invoke-DatabaseMigration -dbContext $dbContext -migrationName $migrationName
    
    # Tạo script SQL
    Export-SqlScript -dbContext $dbContext -migrationName $migrationName
    
    Write-Host "Migration hoàn tất!" -ForegroundColor Green
}
catch {
    Write-Host "Đã xảy ra lỗi trong quá trình migration:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
finally {
    Write-Host "`nNhấn phím bất kỳ để thoát..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
