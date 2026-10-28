# Hướng dẫn về thư mục

Thư mục được quản lý bằng Monorepo, cấu trúc dự án như sau:

```bash
.
├── Dockerfile # File build image Docker
├── README.md # Tài liệu mô tả dự án
├── apps # Thư mục ứng dụng của dự án
│   ├── backend-mock # Ứng dụng dịch vụ mô phỏng backend
│   ├── web-antd # Ứng dụng frontend dựa trên Ant Design Vue
│   ├── web-ele # Ứng dụng frontend dựa trên Element Plus
│   └── web-naive # Ứng dụng frontend dựa trên Naive UI
├── build-local-docker-image.sh # Script build image Docker ở local
├── cspell.json # File cấu hình CSpell
├── docs # Thư mục tài liệu dự án
├── eslint.config.mjs # File cấu hình ESLint
├── internal # Thư mục công cụ nội bộ
│   ├── lint-configs # Cấu hình kiểm tra code
│   │   ├── commitlint-config # Cấu hình Commitlint
│   │   ├── eslint-config # Cấu hình ESLint
│   │   ├── prettier-config # Cấu hình Prettier
│   │   └── stylelint-config # Cấu hình Stylelint
│   ├── node-utils # Công cụ Node.js
│   ├── tailwind-config # Cấu hình Tailwind
│   ├── tsconfig # Cấu hình tsconfig chung
│   └── vite-config # Cấu hình Vite chung
├── package.json # Cấu hình dependency của dự án
├── packages # Thư mục package của dự án
│   ├── @core # Package lõi
│   │   ├── base # Package cơ sở
│   │   │   ├── design # Liên quan đến thiết kế
│   │   │   ├── icons # Biểu tượng
│   │   │   ├── shared # Dùng chung
│   │   │   └── typings # Định nghĩa kiểu
│   │   ├── composables # API dạng composition
│   │   ├── preferences # Cài đặt tùy chọn
│   │   └── ui-kit # Tập hợp component UI
│   │       ├── layout-ui # UI bố cục
│   │       ├── menu-ui  # UI menu
│   │       ├── shadcn-ui # shadcn UI
│   │       └── tabs-ui # UI tab
│   ├── constants # Hằng số
│   ├── effects # Package liên quan đến side effect
│   │   ├── access # Kiểm soát truy cập
│   │   ├── plugins # Plugin dependency lớn của bên thứ ba
│   │   ├── common-ui # UI chung
│   │   ├── hooks # API dạng composition
│   │   ├── layouts # Bố cục
│   │   └── request # Yêu cầu
│   ├── icons # Biểu tượng
│   ├── locales # Quốc tế hóa
│   ├── preferences  # Cài đặt tùy chọn
│   ├── stores # Quản lý trạng thái
│   ├── styles # Kiểu dáng
│   ├── types # Định nghĩa kiểu
│   └── utils # Công cụ
├── playground # Thư mục demo
├── pnpm-lock.yaml # File khóa pnpm
├── pnpm-workspace.yaml # File cấu hình workspace pnpm
├── scripts # Thư mục script
│   ├── turbo-run # Script chạy Turbo
│   └── vsh # Script VSH
├── stylelint.config.mjs # File cấu hình Stylelint
├── turbo.json # File cấu hình Turbo
├── vben-admin.code-workspace # File cấu hình workspace VS Code
└── vitest.config.ts # File cấu hình Vite
```
