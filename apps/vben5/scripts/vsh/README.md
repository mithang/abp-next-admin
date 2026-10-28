# @vben/vsh

Một bộ sưu tập script Shell, dùng cho việc phát triển và quản lý dự án Vue Vben Admin.

## Tính năng

- 🚀 Công cụ Shell hiện đại dựa trên Node.js
- 📦 Hỗ trợ phát triển theo module và tải theo nhu cầu
- 🔍 Cung cấp chức năng kiểm tra và phân tích dependency
- 🔄 Hỗ trợ quét dependency vòng tròn
- 📝 Cung cấp chức năng kiểm tra phát hành package

## Cài đặt

```bash
# Cài đặt bằng pnpm
pnpm add -D @vben/vsh

# Hoặc dùng npm
npm install -D @vben/vsh

# Hoặc dùng yarn
yarn add -D @vben/vsh
```

## Cách dùng

### Cài đặt toàn cục

```bash
# Cài đặt toàn cục
pnpm add -g @vben/vsh

# Dùng lệnh vsh
vsh [command]
```

### Dùng cục bộ

```bash
# Thêm script vào package.json
{
  "scripts": {
    "vsh": "vsh"
  }
}

# Chạy lệnh
pnpm vsh [command]
```

## Danh sách lệnh

- `vsh check-deps`: Kiểm tra dependency của dự án
- `vsh scan-circular`: Quét dependency vòng tròn
- `vsh publish-check`: Kiểm tra cấu hình phát hành package
