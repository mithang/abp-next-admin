# Quy chuẩn

::: tip Đóng góp mã nguồn

- Nếu bạn muốn đóng góp mã nguồn cho dự án, hãy đảm bảo mã nguồn của bạn tuân thủ quy chuẩn mã nguồn của dự án.
- Nếu bạn đang dùng `vscode`, cần cài đặt các plugin sau:
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - Kiểm tra mã script
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - Định dạng mã nguồn
  - [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) - Kiểm tra chính tả từ ngữ
  - [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) - Định dạng css

:::

## Tác dụng

Bất kỳ ai có kiến thức cơ bản về kỹ thuật đều chú trọng quy chuẩn viết mã, và kiểm tra phong cách mã nguồn (Code Linting, gọi tắt là Lint) là biện pháp quan trọng để đảm bảo tính nhất quán của quy chuẩn mã nguồn.

Việc tuân thủ các quy chuẩn mã nguồn tương ứng có những lợi ích sau:

- Giảm tỷ lệ lỗi bug
- Hiệu suất phát triển cao hơn
- Khả năng đọc hiểu cao hơn

## Công cụ

Các file cấu hình của dự án nằm trong `internal/lint-configs`, bạn có thể sửa cấu hình của các loại lint tại đây.

Dự án đã tích hợp các công cụ kiểm tra mã nguồn sau:

- [ESLint](https://eslint.org/) dùng để kiểm tra mã JavaScript
- [Stylelint](https://stylelint.io/) dùng để kiểm tra kiểu CSS
- [Prettier](https://prettier.io/) dùng để định dạng mã nguồn
- [Commitlint](https://commitlint.js.org/) dùng để kiểm tra tính chuẩn mực của thông điệp commit git
- [Publint](https://publint.dev/) dùng để kiểm tra tính chuẩn mực của gói npm
- [Cspell](https://cspell.org/) dùng để kiểm tra lỗi chính tả
- [lefthook](https://github.com/evilmartians/lefthook) dùng để quản lý Git hooks, tự động chạy kiểm tra và định dạng mã nguồn trước khi commit

## ESLint

ESLint là công cụ kiểm tra quy chuẩn mã nguồn và lỗi, dùng để nhận biết và báo cáo lỗi cú pháp trong mã TypeScript.

### Lệnh

```bash
pnpm eslint .
```

### Cấu hình

File cấu hình eslint là `eslint.config.mjs`, cấu hình cốt lõi của nó nằm trong thư mục `internal/lint-configs/eslint-config` và có thể sửa theo nhu cầu của dự án.

## Stylelint

Stylelint dùng để kiểm tra phong cách css nội bộ của dự án, kết hợp với tính năng tự động sửa của trình soạn thảo, có thể thống nhất tốt phong cách css nội bộ của dự án

### Lệnh

```bash
pnpm stylelint "**/*.{vue,css,less.scss}"
```

### Cấu hình

File cấu hình Stylelint là `stylelint.config.mjs`, cấu hình cốt lõi của nó nằm trong thư mục `internal/lint-configs/stylelint-config` và có thể sửa theo nhu cầu của dự án.

## Prettier

Prettier có thể dùng để thống nhất phong cách mã nguồn của dự án, thống nhất thụt lề, dấu ngoặc đơn/kép, dấu phẩy cuối cùng và các phong cách khác

### Lệnh

```bash
pnpm prettier .
```

### Cấu hình

File cấu hình Prettier là `.prettier.mjs`, cấu hình cốt lõi của nó nằm trong thư mục `internal/lint-configs/prettier-config` và có thể sửa theo nhu cầu của dự án.

## CommitLint

Trong một nhóm, thông điệp commit git của mỗi người đều khác nhau, muôn hình muôn vẻ, không có cơ chế thì rất khó đảm bảo tính chuẩn mực, làm thế nào để chuẩn mực hóa? Có thể bạn nghĩ đến cơ chế hook của git, viết shell script để thực hiện. Điều này tất nhiên là được, thực ra JavaScript có một công cụ rất tốt có thể thực hiện mẫu này, đó chính là commitlint (dùng để kiểm tra tính chuẩn mực của thông điệp commit git).

### Cấu hình

File cấu hình CommitLint là `.commitlintrc.mjs`, cấu hình cốt lõi của nó nằm trong thư mục `internal/lint-configs/commitlint-config` và có thể sửa theo nhu cầu của dự án.

### Quy chuẩn commit Git

Tham khảo [Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular)

- `feat` thêm tính năng mới
- `fix` sửa lỗi/vấn đề/BUG
- `style` liên quan đến phong cách mã nguồn, không ảnh hưởng đến kết quả chạy
- `perf` tối ưu/cải thiện hiệu năng
- `refactor` tái cấu trúc
- `revert` hoàn tác thay đổi
- `test` liên quan đến kiểm thử
- `docs` tài liệu/chú thích
- `chore` cập nhật dependency/sửa cấu hình scaffold, v.v.
- `workflow` cải tiến quy trình làm việc
- `ci` tích hợp liên tục
- `types` sửa kiểu dữ liệu

### Tắt kiểm tra quy chuẩn commit Git

Nếu bạn muốn tắt kiểm tra quy chuẩn commit Git, có hai cách:

::: code-group

```bash [Tạm thời tắt]
git commit -m 'feat: add home page' --no-verify
```

```bash [Tắt vĩnh viễn]
# Chỉ cần chú thích đoạn mã sau trong .husky/commit-msg là được
pnpm exec commitlint --edit "$1" # [!code --]
```

:::

## Publint

Publint là công cụ dùng để kiểm tra tính chuẩn mực của gói npm, có thể kiểm tra xem số phiên bản của gói có đúng chuẩn hay không, có phải là gói ESM đúng chuẩn hay không, v.v.

### Lệnh

```bash
pnpm vsh publint
```

## Cspell

Cspell là công cụ dùng để kiểm tra lỗi chính tả, có thể kiểm tra lỗi chính tả trong mã nguồn, tránh bug do lỗi chính tả gây ra.

### Lệnh

```bash
pnpm cspell lint \"**/*.ts\"  \"**/README.md\" \".changeset/*.md\" --no-progress
```

### Cấu hình

File cấu hình cspell là `cspell.json`, có thể sửa theo nhu cầu của dự án.

## Git Hook

git hook thường kết hợp với các loại lint, thực hiện kiểm tra phong cách mã nguồn khi commit mã lên git, nếu kiểm tra không đạt thì sẽ không commit. Nhà phát triển cần tự sửa rồi commit lại

### lefthook

Vấn đề là việc kiểm tra sẽ kiểm tra toàn bộ mã nguồn, nhưng chúng ta chỉ muốn kiểm tra mã nguồn do chính mình commit, lúc này có thể dùng lefthook.

Giải pháp hiệu quả nhất là đưa việc kiểm tra Lint về máy cục bộ, cách làm phổ biến là dùng lefthook để thực hiện một lần kiểm tra Lint trước khi commit tại máy cục bộ.

Dự án đã định nghĩa các hooks tương ứng bên trong `lefthook.yml`:

- `pre-commit`: chạy trước khi commit, dùng để định dạng và kiểm tra mã nguồn
  - `code-workspace`: cập nhật cấu hình workspace VSCode
  - `lint-md`: định dạng file Markdown
  - `lint-vue`: định dạng và kiểm tra file Vue
  - `lint-js`: định dạng và kiểm tra file JavaScript/TypeScript
  - `lint-style`: định dạng và kiểm tra file kiểu
  - `lint-package`: định dạng package.json
  - `lint-json`: định dạng các file JSON khác

- `post-merge`: chạy sau khi merge, dùng để tự động cài đặt dependency
  - `install`: chạy `pnpm install` để cài đặt dependency mới

- `commit-msg`: chạy khi commit, dùng để kiểm tra định dạng thông điệp commit
  - `commitlint`: dùng commitlint để kiểm tra thông điệp commit

#### Cách tắt lefthook

Nếu bạn muốn tắt lefthook, có hai cách:

::: code-group

```bash [Tạm thời tắt]
git commit -m 'feat: add home page' --no-verify
```

```bash [Tắt vĩnh viễn]
# Chỉ cần xóa file lefthook.yml là được
rm lefthook.yml
```

:::

#### Cách sửa cấu hình lefthook

Nếu bạn muốn sửa cấu hình lefthook, có thể sửa file `lefthook.yml`. Ví dụ:

```yaml
pre-commit:
  parallel: true # Thực thi các tác vụ song song
  jobs:
    - name: lint-js
      run: pnpm prettier --cache --ignore-unknown --write {staged_files}
      glob: '*.{js,jsx,ts,tsx}'
```

Trong đó:

- `parallel`: có thực thi các tác vụ song song hay không
- `jobs`: định nghĩa danh sách các tác vụ cần thực thi
- `name`: tên tác vụ
- `run`: lệnh cần thực thi
- `glob`: mẫu file khớp
- `{staged_files}`: biểu thị danh sách các file đã stage
