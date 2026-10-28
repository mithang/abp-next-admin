# Script di chuyển cơ sở dữ liệu

# Nhập các module cần thiết
using namespace System.Management.Automation.Host

# Thêm biến môi trường FROM_MIGRATION để có thể kiểm tra trong file Program.cs
$env:FROM_MIGRATION = "true"

# Định nghĩa đường dẫn dự án
$projectPath = Resolve-Path (Join-Path $PSScriptRoot "..")

# Định nghĩa hàm để tìm động tất cả DbContext khả dụng
function Get-AvailableDbContexts {
    $migrationsPath = Join-Path $projectPath "migrations"
    $dbContexts = @{}
    $counter = 1

    # Tìm tất cả thư mục chứa EntityFrameworkCore
    $efCoreDirectories = Get-ChildItem -Path $migrationsPath -Directory | Where-Object { $_.Name -like "*EntityFrameworkCore*" }
    
    foreach ($dir in $efCoreDirectories) {
        # Ưu tiên tìm file DbContextFactory
        $factoryFiles = Get-ChildItem -Path $dir.FullName -Filter "*DbContextFactory.cs" -Recurse -File
        
        # Nếu tìm thấy file Factory
        $foundFactory = $false
        foreach ($factoryFile in $factoryFiles) {
            $factoryContent = Get-Content $factoryFile.FullName -Raw
            
            # Tìm tên lớp Factory và lớp DbContext tương ứng
            if ($factoryContent -match 'class\s+(\w+Factory)\s*:\s*IDesignTimeDbContextFactory<(\w+)>') {
                $factoryName = $matches[1]
                $contextName = $matches[2]
                
                # Nếu tìm thấy context và factory, thêm vào danh sách
                $dbContexts["$counter"] = @{
                    Name = $dir.Name
                    Context = $contextName
                    Factory = $factoryName
                }
                $counter++
                $foundFactory = $true
            }
        }
        
        # Chỉ khi không tìm thấy Factory mới tìm file DbContext làm phương án dự phòng
        if (-not $foundFactory) {
            $dbContextFiles = Get-ChildItem -Path $dir.FullName -Filter "*DbContext.cs" -Recurse -File
            
            foreach ($contextFile in $dbContextFiles) {
                $contextContent = Get-Content $contextFile.FullName -Raw
                if ($contextContent -match 'class\s+(\w+DbContext)') {
                    $contextName = $matches[1]
                    
                    # Thêm vào danh sách, nhưng không có Factory tương ứng
                    $dbContexts["$counter"] = @{
                        Name = $dir.Name
                        Context = $contextName
                        Factory = $null
                    }
                    $counter++
                }
            }
        }
    }

    # Nếu không tìm thấy context nào, dùng mặc định
    if ($dbContexts.Count -eq 0) {
        $dbContexts["1"] = @{
            Name = "PackageName.CompanyName.ProjectName.AIO.EntityFrameworkCore.DatabaseManagementName"
            Context = "SingleMigrationsDbContext"
            Factory = "SingleMigrationsDbContextFactory"
        }
    }

    return $dbContexts
}

# Lấy các DbContext khả dụng
$dbContexts = Get-AvailableDbContexts

# Hiển thị menu chọn DbContext
function Show-DbContextMenu {
    $host.UI.RawUI.BackgroundColor = "Black"
    $host.UI.RawUI.ForegroundColor = "White"
    Clear-Host

    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "     Chọn context di chuyển cơ sở dữ liệu" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Vui lòng chọn context cơ sở dữ liệu cần di chuyển:" -ForegroundColor Green
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
        $choice = Read-Host "Vui lòng nhập số để chọn"
        if ($dbContexts.ContainsKey($choice)) {
            return $dbContexts[$choice]
        }
        Write-Host "Lựa chọn không hợp lệ, vui lòng nhập lại." -ForegroundColor Red
    }
}

# Lấy tên migration
function Get-MigrationName {
    $defaultName = "AddNewMigration_" + (Get-Date -Format "yyyyMMdd_HHmmss")
    $migrationName = Read-Host "Vui lòng nhập tên migration (để trống sẽ dùng tên mặc định: $defaultName)"
    
    return ($migrationName ? $migrationName : $defaultName)
}

# Thực thi di chuyển cơ sở dữ liệu
function Invoke-DatabaseMigration($dbContext, $migrationName) {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Đang thực thi di chuyển cơ sở dữ liệu..." -ForegroundColor Green
    Write-Host "Context: " -NoNewline -ForegroundColor Yellow
    Write-Host "$($dbContext.Name)" -ForegroundColor White
    Write-Host "Tên migration: " -NoNewline -ForegroundColor Yellow
    Write-Host "$migrationName" -ForegroundColor White
    Write-Host "Đường dẫn dự án: " -NoNewline -ForegroundColor Yellow
    Write-Host "$projectPath" -ForegroundColor White
    Write-Host "========================================" -ForegroundColor Cyan
    
    # Chuyển sang thư mục dự án và thực thi migration
    Push-Location $projectPath
    try {
        dotnet ef migrations add $migrationName --project "migrations/$($dbContext.Name)" --context "$($dbContext.Context)"
    }
    finally {
        Pop-Location
    }
}

# Lấy tất cả file migration
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
    Write-Host "Tạo script SQL cho tất cả migration" -ForegroundColor White
    Write-Host "[L] " -NoNewline -ForegroundColor Magenta
    Write-Host "Chỉ tạo script SQL cho migration mới nhất" -ForegroundColor White
    
    while ($true) {
        $choice = Read-Host "Vui lòng chọn file migration bắt đầu"
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
        
        # Đảm bảo thư mục InitSql và thư mục riêng theo context tồn tại
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
        Write-Host "Đường dẫn xuất: " -NoNewline -ForegroundColor Yellow
        Write-Host "$sqlFilePath" -ForegroundColor White
        if ($fromMigration) {
            Write-Host "Migration bắt đầu: " -NoNewline -ForegroundColor Yellow
            Write-Host "$fromMigration" -ForegroundColor White
        }
        Write-Host "========================================" -ForegroundColor Cyan
        
        # Chuyển sang thư mục dự án và tạo script SQL
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
        
        Write-Host "Đã tạo script SQL: " -NoNewline -ForegroundColor Green
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
    
    Write-Host "Đã hoàn tất di chuyển!" -ForegroundColor Green
}
catch {
    Write-Host "Đã xảy ra lỗi trong quá trình di chuyển:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
finally {
    Write-Host "`nNhấn phím bất kỳ để thoát..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
