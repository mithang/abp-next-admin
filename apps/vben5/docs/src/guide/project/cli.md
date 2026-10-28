---
outline: deep
---

# CLI

Trong dự án, có cung cấp một số công cụ dòng lệnh dùng cho một số thao tác thường dùng, mã nguồn nằm trong `scrips`.

## vsh

Dùng cho một số thao tác của dự án, như dọn dẹp dự án, kiểm tra dự án, v.v.

### Cách dùng

```bash
pnpm vsh [command] [options]
```

### vsh check-circular

Kiểm tra tham chiếu vòng trong toàn bộ dự án, nếu có tham chiếu vòng sẽ xuất mô-đun tham chiếu vòng ra console.

#### Cách dùng

```bash
pnpm vsh check-circular
```

#### Tùy chọn

| Tùy chọn   | Mô tả                               |
| ---------- | ----------------------------------- |
| `--staged` | Chỉ kiểm tra các tệp trong khu vực staged của git, mặc định `false` |

### vsh check-dep

Kiểm tra tình trạng phụ thuộc của toàn bộ dự án và xuất thông tin `phụ thuộc chưa sử dụng`, `phụ thuộc chưa cài đặt` ra console

#### Cách dùng

```bash
pnpm vsh check-dep
```

#### Tùy chọn

| Tùy chọn         | Mô tả                                   |
| ---------------- | --------------------------------------- |
| `-r,--recursive` | Xóa đệ quy toàn bộ dự án, mặc định `true` |
| `--del-lock`     | Có xóa tệp `pnpm-lock.yaml` hay không, mặc định `true` |

### vsh lint

Kiểm tra lint cho dự án, kiểm tra mã nguồn trong dự án có tuân thủ quy chuẩn hay không.

#### Cách dùng

```bash
pnpm vsh lint
```

#### Tùy chọn

| Tùy chọn   | Mô tả                          |
| ---------- | ------------------------------ |
| `--format` | Kiểm tra và thử sửa lỗi, mặc định `false` |

### vsh publint

Kiểm tra quy chuẩn gói cho dự án `Monorepo`, kiểm tra các gói trong dự án có tuân thủ quy chuẩn hay không.

#### Cách dùng

```bash
pnpm vsh publint
```

#### Tùy chọn

| Tùy chọn  | Mô tả                  |
| --------- | ---------------------- |
| `--check` | Chỉ thực hiện kiểm tra, mặc định `false` |

### vsh code-workspace

Tạo tệp `vben-admin.code-workspace`, hiện tại không cần thực thi thủ công, sẽ tự động thực thi khi commit mã nguồn.

#### Cách dùng

```bash
pnpm vsh code-workspace
```

#### Tùy chọn

| Tùy chọn        | Mô tả                                  |
| --------------- | -------------------------------------- |
| `--auto-commit` | Khi `git commit`, tự động commit, mặc định `false` |
| `--spaces`      | Định dạng thụt lề, mặc định thụt lề `2` |

## turbo-run

Dùng để nhanh chóng thực thi script trong monorepo và cung cấp lựa chọn tương tác dạng tùy chọn.

### Cách dùng

```bash
pnpm turbo-run [command]
```

### turbo-run dev

Nhanh chóng thực thi lệnh `dev` và cung cấp lựa chọn tương tác dạng tùy chọn.
