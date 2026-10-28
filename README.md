[English](./README.en.md) | Tiếng Việt

[Hướng dẫn cập nhật](./RELEASE.md) Hướng dẫn cập nhật

## Tổng quan

Đây là giao diện quản trị backend của framework Abp dựa trên [vue-vben-admin](https://github.com/anncwb/vue-vben-admin)

## Build

[![Build](https://github.com/colinin/abp-next-admin/actions/workflows/build.yml/badge.svg)](https://github.com/colinin/abp-next-admin/actions/workflows/build.yml)  [![NuGet](https://img.shields.io/nuget/v/LINGYUN.Abp.Core.svg?style=flat-square)](https://www.nuget.org/packages/LINGYUN.Abp.Core)

## Phương án triển khai

### Triển khai dịch vụ đơn khối

Nếu bạn không cần kiến trúc microservice, bạn có thể chọn phương án triển khai dịch vụ đơn khối. Dịch vụ đơn khối có đặc điểm triển khai đơn giản, bảo trì thuận tiện.

- [Hướng dẫn khởi động dịch vụ đơn khối](./docs/startup-aio-readme.md)
- [Monolithic Service Startup Guide](./docs/startup-aio-readme.en.md)

### Triển khai microservice

Nếu bạn cần khả năng mở rộng cao hơn và kiến trúc dịch vụ linh hoạt hơn, bạn có thể chọn phương án triển khai microservice.

## Nhanh chóng tạo dự án khởi động microservice

### 0. Thiết lập file hosts
Trên Windows, sửa file C:\Windows\System32\drivers\etc\hosts;
Trên Linux, sửa /etc/hosts;
Thêm cấu hình sau:
```
	127.0.0.1 host.docker.internal
```
Trên Linux, sau khi sửa xong hosts cần khởi động lại mạng, thực thi trong shell:
```shell
	/etc/init.d/network restart
```

### 1. Cài đặt công cụ dotnet

```shell
  dotnet tool install --global LINGYUN.Abp.Cli
```

### 2. Cài đặt template .NET

```shell
  dotnet new --install LINGYUN.Abp.MicroService.Templates
```

### 3. Dùng CLI tạo một dự án

```shell
  # Dùng chuỗi kết nối sqlserver để khởi tạo một dự án
  # MyCompanyName Tên công ty
  # MyProjectName Tên dự án
  # MyPackageName Tên gói
  # -o  Xuất ra thư mục chỉ định, xem abp cli
  # --dbms  Chỉ định driver cơ sở dữ liệu, xem abp cli
  # --cs    Chỉ định chuỗi kết nối cơ sở dữ liệu
  # --no-random-port Không dùng cổng ngẫu nhiên (mặc định cổng ứng dụng 5000, cổng lắng nghe dapr 3500)
  labp create MyCompanyName.MyProjectName -pk MyPackageName -o "D:\Project" --dbms sqlserver --cs "Server=127.0.0.1;Database=MyProject;User Id=sa;Password=123456" --no-random-port

  cd D:\Project\host\MyPackageName.MyCompanyName.MyProjectName.HttpApi.Host

  dotnet restore

  dotnet run

  start http://127.0.0.1:5000/

```

### Phản hồi vấn đề

* Tác giả không phải freelancer, không có nhiều thời gian để bảo trì dự án, nếu gặp vấn đề, có thể liên hệ qua email **colin.in@foxmail.com**, hoặc tham gia nhóm chat QQ: 795966922

## Ảnh chụp màn hình

![Nhật ký hệ thống](./apps/vue/images/logging.png)

![Nhật ký kiểm toán](./apps/vue/images/audit-log.png)

![Nhật ký bảo mật](./apps/vue/images/security-log.png)

![Từ điển dữ liệu](./apps/vue/images/data-dictionary.png)

![Lưu trữ đối tượng](./apps/vue/images/oss.png)

![Quản lý tính năng](./apps/vue/images/features.png)

![Cài đặt hệ thống](./apps/vue/images/settings.png)

![Quản lý menu](./apps/vue/images/menus.png)

![Tổ chức](./apps/vue/images/organization-unit.png)

![Quản lý bản địa hoá](./apps/vue/images/localization.png)

## Dự án liên quan

Dự án backend

[abpframework/abp](https://github.com/abpframework/abp) (abp vNext)

[EasyAbp/Cap](https://github.com/EasyAbp/Abp.EventBus.CAP) (EasyAbp)

[DotNetCore/CAP](https://github.com/dotnetcore/CAP) (CAP)

Dự án frontend

[vue-vben-admin](https://github.com/anncwb/vue-vben-admin.git) (vue-vben-admin)

## Chuẩn bị

- [node](http://nodejs.org/) và [git](https://git-scm.com/) - Môi trường phát triển dự án
- [Vite](https://vitejs.dev/) - Làm quen với các tính năng của vite
- [Vue3](https://v3.vuejs.org/) - Làm quen với cú pháp cơ bản của Vue
- [TypeScript](https://www.typescriptlang.org/) - Làm quen với cú pháp cơ bản của `TypeScript`
- [Es6+](http://es6.ruanyifeng.com/) - Làm quen với cú pháp cơ bản của es6
- [Vue-Router-Next](https://next.router.vuejs.org/) - Làm quen với cách dùng cơ bản của vue-router
- [Ant-Design-Vue](https://2x.antdv.com/docs/vue/introduce-cn/) - Cách dùng cơ bản của UI
- [Mock.js](https://github.com/nuysoft/Mock) - Cú pháp cơ bản của mockjs

## Cấu trúc thư mục

### Frontend: apps/vben5 (monorepo pnpm workspace + turbo)

```bash
apps/vben5/
├── apps/                        # Ứng dụng UI có thể chạy độc lập
│   ├── app-antd/                # Frontend nghiệp vụ ABP (đang dùng: pnpm dev:app / pnpm build:app)
│   ├── web-antd/                # Ứng dụng mẫu antd chính thức của vben
│   ├── web-antdv-next/          # Ứng dụng mẫu antdv-next
│   ├── web-ele/                 # Ứng dụng mẫu Element Plus
│   ├── web-naive/               # Ứng dụng mẫu Naive UI
│   └── web-tdesign/             # Ứng dụng mẫu TDesign
├── packages/
│   ├── @abp/                    # Các gói module nghiệp vụ ABP (27 gói)
│   │   ├── account/             # Tài khoản, đăng nhập bên ngoài (liên kết tài khoản bên thứ ba)
│   │   ├── ai-management/       # Quản lý AI (workspace, công cụ, agent)
│   │   ├── auditing/            # Nhật ký kiểm toán, nhật ký bảo mật
│   │   ├── blob-management/     # Lưu trữ đối tượng (container, file)
│   │   ├── cache-management/    # Quản lý bộ nhớ đệm
│   │   ├── components/          # Component nghiệp vụ dùng chung cho frontend ABP
│   │   ├── core/                # Lõi frontend ABP (khả năng cơ bản như request, quyền, menu)
│   │   ├── data-protection/     # Bảo vệ dữ liệu (kiểm soát truy cập cấp thực thể/trường)
│   │   ├── demo/                # Module mẫu
│   │   ├── features/            # Quản lý tính năng (Feature)
│   │   ├── gdpr/                # GDPR xuất và xoá dữ liệu
│   │   ├── identity/            # Người dùng, vai trò, tổ chức, phiên, nhật ký đăng nhập
│   │   ├── localization/        # Bản địa hoá (ngôn ngữ, tài nguyên, văn bản)
│   │   ├── notifications/       # Thông báo (định nghĩa thông báo, thông báo của tôi, bản ghi gửi)
│   │   ├── openiddict/          # OpenIddict (ứng dụng, phạm vi, uỷ quyền, token)
│   │   ├── oss/                 # Danh sách file OSS/Blob
│   │   ├── permissions/         # Định nghĩa quyền và uỷ quyền
│   │   ├── platform/            # Nền tảng (bố cục, menu, từ điển dữ liệu, email/SMS)
│   │   ├── request/             # Đóng gói request HTTP (token, xử lý lỗi, header tenant)
│   │   ├── saas/                # Tenant và phiên bản (Edition)
│   │   ├── settings/            # Định nghĩa cài đặt và giá trị cài đặt
│   │   ├── signalr/             # Giao tiếp thời gian thực SignalR
│   │   ├── tasks/               # Nhiệm vụ nền (quản lý job)
│   │   ├── text-templating/     # Template văn bản
│   │   ├── ui/                  # Thư viện component UI cho frontend ABP
│   │   ├── webhooks/            # Webhook: định nghĩa, đăng ký và bản ghi gửi
│   │   └── wechat/              # WeChat (tài khoản công khai, WeChat doanh nghiệp, v.v.)
│   ├── @core/                   # Nhân: base / ui-kit / forward
│   ├── effects/                 # Khả năng dùng chung: plugins / hooks / common-ui, v.v.
│   ├── icons/  types/           # Định nghĩa icon, kiểu
│   └── ...                      # Các gói công khai còn lại (xem pnpm-workspace.yaml)
├── internal/                    # Cấu hình kỹ thuật: vite-config / lint-configs / tailwind-config / tsconfig / node-utils
├── docs/                        # Tài liệu VitePress
├── playground/                  # Sân chơi component và mẫu
├── scripts/                     # Các script dọn dẹp, build, triển khai, v.v.
├── package.json                 # Script gốc: dev / dev:app / build:app / lint / format / test:unit / check:type
├── pnpm-workspace.yaml          # Phân chia workspace và dependency catalog
├── turbo.json                   # Cấu hình pipeline turbo
└── vitest.config.ts             # Cấu hình unit test (vitest)
```

### Backend: aspnet-core và các thư mục kèm theo

```bash
.
├── aspnet-core/
│   ├── services/                # Host của từng dịch vụ (kèm Dockerfile)
│   │   ├── LINGYUN.Abp.MicroService.AuthServer/        # Dịch vụ xác thực (STS, 44385)
│   │   ├── LINGYUN.Abp.MicroService.IdentityService/   # Dịch vụ identity (30015)
│   │   ├── LINGYUN.Abp.MicroService.AdminService/      # Dịch vụ quản trị (30010)
│   │   ├── LINGYUN.Abp.MicroService.LocalizationService/# Dịch vụ bản địa hoá (30030)
│   │   ├── LINGYUN.Abp.MicroService.PlatformService/   # Dịch vụ nền tảng (30025)
│   │   ├── LINGYUN.Abp.MicroService.MessageService/    # Dịch vụ tin nhắn (30020)
│   │   ├── LINGYUN.Abp.MicroService.TaskService/       # Dịch vụ nhiệm vụ (30040)
│   │   ├── LINGYUN.Abp.MicroService.WebhookService/    # Dịch vụ Webhook (30045)
│   │   ├── LINGYUN.Abp.MicroService.WorkflowService/   # Dịch vụ quy trình làm việc (30050)
│   │   ├── LINGYUN.Abp.MicroService.WeChatService/     # Dịch vụ WeChat (30060)
│   │   ├── LINGYUN.Abp.MicroService.AIService/         # Dịch vụ AI (30070)
│   │   ├── LINGYUN.Abp.MicroService.AllInOne/        # Ứng dụng đơn khối (30000, gộp gateway và toàn bộ module)
│   │   ├── LY.MicroService.IdentityServer/             # Dịch vụ và host phiên bản IdentityServer
│   │   ├── LINGYUN.Abp.Applications/  LY.AIO.Applications.Single/  # Các host khác
│   │   └── Publish/             # Thư mục đầu ra publish (dùng để build image container)
│   ├── modules/                 # Module nghiệp vụ, mỗi module phân tầng theo DDD (Domain / Application / EntityFrameworkCore / HttpApi ...)
│   │   ├── account/             # Tài khoản và đăng nhập (kèm tích hợp Web OpenIddict/IdentityServer, mã xác minh)
│   │   ├── identity/            # Người dùng, vai trò, tổ chức, phiên, nhật ký đăng nhập
│   │   ├── identityServer/      # Triển khai liên quan IdentityServer4
│   │   ├── openIddict/          # Phía server OpenIddict (ứng dụng, phạm vi, token, Portal, mã QR, SMS, đăng nhập WeChat)
│   │   ├── permissions-management/  # Quản lý quyền và uỷ quyền
│   │   ├── saas/                # Đa tenant và phiên bản
│   │   ├── settings/  feature-management/  # Cài đặt, quản lý tính năng
│   │   ├── localization-management/  text-templating/  # Bản địa hoá, template văn bản
│   │   ├── auditing/  data-protection/  gdpr/  captcha/  # Kiểm toán, bảo vệ dữ liệu, GDPR, mã xác minh
│   │   ├── blob-management/  caching-management/  # Lưu trữ đối tượng, quản lý bộ nhớ đệm
│   │   ├── platform/  project/  system-info/  demo/  # Nền tảng, dự án, thông tin hệ thống, mẫu
│   │   ├── realtime-message/  realtime-notifications/  # Tin nhắn tức thời, thông báo thời gian thực
│   │   ├── task-management/  rules-management/  webhooks/  # Nhiệm vụ nền, engine quy tắc, Webhook
│   │   ├── ai/  elsa/           # Khả năng AI, quy trình làm việc (Elsa)
│   ├── framework/               # Các gói framework cơ bản (33 nhóm), các nhóm thường dùng:
│   │   ├── common/  core Các gói cơ bản liên quan (LINGYUN.Abp.Core, CAP, Hangfire, BlobStoring, SignalR ...)
│   │   ├── security/  authentication/  authorization/   # Bảo mật, phương thức đăng nhập, uỷ quyền
│   │   ├── auditing/  logging/  telemetry/              # Kiểm toán, nhật ký, trace liên kết (OpenTelemetry/SkyWalking)
│   │   ├── multi-tenancy Liên quan: tenants/                 # Đa tenant và phiên bản
│   │   ├── wechat/  wx-pusher/  pushplus/  tui-juhe/    # WeChat, đẩy tin nhắn
│   │   ├── cloud-aliyun/  cloud-tencent/                # Tích hợp Alibaba Cloud, Tencent Cloud
│   │   ├── dapr/  elasticsearch/  efcore/  data-protection/  # Dapr, ES, EF Core, bảo vệ dữ liệu
│   │   ├── dynamic-queryable/  dynamic-definition/  exporter/  # Truy vấn động, định nghĩa động, import/export
│   │   ├── localization/  settings/  features/  mvc/  open-api/  cli/  ...  # Các gói cơ bản khác
│   ├── migrations/              # Dự án migration DbMigrator và EntityFrameworkCore của từng dịch vụ (deploy.ps1 sẽ thực thi lần lượt)
│   ├── aspire/                  # .NET Aspire: LINGYUN.Abp.MicroService.AppHost và host Aspire của từng dịch vụ
│   ├── templates/               # Template dự án dotnet new (micro microservice / aio đơn khối)
│   ├── tests/                   # Dự án unit test
│   ├── LINGYUN.MicroService.All.slnx            # Solution đầy đủ
│   ├── LINGYUN.MicroService.Aspire.slnx         # Solution Aspire
│   └── LINGYUN.MicroService.AllInOne.slnx  # Solution đơn khối
├── gateways/
│   ├── internal/                # Gateway nội bộ (YARP): Internal.Gateway / OpenApi.Gateway + route yarp*.json
│   └── web/                     # Gateway Web: LY.MicroService.ApiGateway
├── apps/                        # Frontend: vben5 (hiện tại) / vue (phiên bản cũ)
├── build/                       # Script build và migration: build-aspnetcore-ef-update.ps1, build-aspnetcore-docker-build.ps1 ...
├── deploy/                      # Script triển khai một chạm (deploy.ps1), dữ liệu middleware và thư mục log của từng dịch vụ
├── docs/                        # Tài liệu (hướng dẫn khởi động dịch vụ đơn khối, v.v.)
├── docker-compose.yml                        # Điều phối dịch vụ backend
├── docker-compose.override.yml               # Tag image, map volume và thứ tự khởi động
├── docker-compose.override.configuration.yml # Biến môi trường của từng dịch vụ (chuỗi kết nối, CAP, Redis, Elasticsearch, v.v.)
├── docker-compose.middleware.yml             # Middleware: MySQL/Redis/RabbitMQ/Elasticsearch/Kibana/Logstash/OpenObserve
├── docker-compose.override.agile.yml         # Trung tâm cấu hình AgileConfig (tuỳ chọn)
├── Directory.Build.props  Directory.Packages.props  NuGet.Config  common.props  # Quản lý build và phiên bản gói thống nhất
└── README.md  README.en.md  RELEASE.md  LICENSE  # Tài liệu và giấy phép
```

## Khởi động dự án

Dự án này cung cấp ba cách khởi động, hãy chọn theo nhu cầu:

| Cách | Mô tả | Middleware | Frontend |
| --- | --- | --- | --- |
| Cách 1: Microservice | Kiến trúc microservice đầy đủ, toàn bộ backend chạy bằng container | Cần **khởi động trước** `docker-compose.middleware.yml` | Khởi động riêng vben5 |
| Cách 2: Aspire | AppHost điều phối môi trường phát triển microservice local | AppHost tự tạo container (PostgreSQL/Redis/RabbitMQ/Elasticsearch/Kibana) | AppHost tự khởi động |
| Cách 3: Đơn khối | Gateway, xác thực và module nghiệp vụ gộp thành một tiến trình | Cần **khởi động trước** `docker-compose.middleware.yml` | Khởi động riêng vben5 |

### Điều kiện tiên quyết chung

- **.NET SDK 10** (`dotnet --version`)
- **Docker / Docker Compose** (middleware của cách 1, 3; container middleware của cách 2 cũng do Docker cung cấp)
- **Node.js 20+ và pnpm** (frontend nằm tại `apps/vben5`, là pnpm monorepo, `preinstall` sẽ thực thi `only-allow pnpm`)
- **hosts**: Windows sửa `C:\Windows\System32\drivers\etc\hosts`, Linux sửa `/etc/hosts`, thêm cấu hình sau
  ```
  127.0.0.1 host.docker.internal
  ```
  (Bên trong container truy cập middleware trên máy host qua `extra_hosts: host.docker.internal:host-gateway`)

---

### Cách 1: Khởi động microservice

#### 1) Khởi động một chạm: deploy/deploy.ps1

```powershell
cd ./deploy
powershell -ExecutionPolicy Bypass -File .\deploy.ps1
```

Script lần lượt hoàn thành (xem `deploy/deploy.ps1`):

1. Khởi động middleware: `docker-compose -f .\docker-compose.middleware.yml -p labp up -d --build` (MySQL, Redis, RabbitMQ, Elasticsearch, Kibana, Logstash, OpenObserve)
2. Chờ 30 giây, đợi MySQL khởi tạo xong
3. Lần lượt thực thi 8 dự án migration cơ sở dữ liệu (`dotnet run --no-build`, **do đó trước khi chạy script phải build backend trước**)
4. Build 12 image backend (`labp-*-service:10.6.0`)
5. Khởi động backend: `docker-compose -f .\docker-compose.yml -f .\docker-compose.override.yml -f .\docker-compose.override.configuration.yml -p labp up -d`
6. Trong `apps/vben5` thực thi `pnpm dev:app` để khởi động frontend

Lưu ý:

- Phải thực thi script trong thư mục **deploy** (bên trong script dùng đường dẫn tương đối).
- Script gọi `docker-compose` (lệnh Compose V1); khi máy local chỉ cài plugin Compose V2, hãy đổi `docker-compose` trong script thành `docker compose`.
- Script không bao gồm AgileConfig (`docker-compose.override.agile.yml`), cấu hình đều lấy từ `docker-compose.override.configuration.yml`.

#### 2) Khởi động thủ công (tương đương script, nhất định phải khởi động middleware trước)

```powershell
# ① Khởi động middleware (nhất định phải khởi động trước)
docker-compose -f .\docker-compose.middleware.yml -p labp up -d
# Lần khởi động đầu tiên hãy chờ hơn 30 giây, để MySQL thực thi script khởi tạo trong deploy/mysql/docker-entrypoint-initdb.d

# ② Migration cơ sở dữ liệu: dùng script migration (bên trong lần lượt thực thi dotnet run cho 8 *.DbMigrator trong aspnet-core/migrations, sẽ tự động build)
cd .\build
.\build-aspnetcore-ef-update.ps1

# ③ Build image backend: tạo 12 image labp-*-service:10.6.0 (tag phải khớp với image trong docker-compose.override.yml)
.\build-aspnetcore-docker-build.ps1

# ④ Khởi động backend (thiếu một trong ba file compose cũng không được)
docker-compose -f .\docker-compose.yml -f .\docker-compose.override.yml -f .\docker-compose.override.configuration.yml -p labp up -d

# ⑤ Khởi động frontend
cd .\apps\vben5
pnpm install
pnpm dev:app
```

Giải thích các bước thủ công:

- Hai script ②③ đều phải thực thi trong thư mục **build** (bên trong script tham chiếu tương đối `./build-aspnetcore-common.ps1`).
- Bên trong `build-aspnetcore-ef-update.ps1` dùng `dotnet run` (sẽ build trước rồi mới chạy), do đó quy trình thủ công **không cần** build backend trước; còn script một chạm `deploy.ps1` dùng `dotnet run --no-build`, nên trước khi đi theo script một chạm phải build backend trước.
- Nếu chỉ muốn migrate một dịch vụ nào đó, có thể trực tiếp vào thư mục tương ứng để thực thi, ví dụ:

  ```powershell
  cd .\aspnet-core\migrations\LINGYUN.Abp.MicroService.AuthServer.DbMigrator
  dotnet run
  ```

#### 3) Địa chỉ truy cập

| Thành phần | Địa chỉ |
| --- | --- |
| Frontend (vben5, `@abp/app-antd`) | http://localhost:5666 |
| API gateway | http://localhost:30000 |
| Dịch vụ xác thực (STS) | http://localhost:44385 |
| Identity / Quản trị / Nền tảng / Tin nhắn / Bản địa hoá | 30015 / 30010 / 30025 / 30020 / 30030 |
| Nhiệm vụ / Webhook / Quy trình làm việc / WeChat / AI | 30040 / 30045 / 30050 / 30060 / 30070 |
| Kibana | http://localhost:5601 |
| Bảng quản trị RabbitMQ | http://localhost:15672 (admin / 123456) |
| MySQL | localhost:3306 (root / 123456, cơ sở dữ liệu `abp`) |
| Redis | localhost:6379 |
| Bảng quản trị OpenObserve | http://localhost:5080 (admin@abp.io / ww1Z5L%6) |

### Cách 2: Khởi động Aspire

AppHost sẽ tự động kéo lên các container middleware của chính nó (PostgreSQL, Redis, RabbitMQ, Elasticsearch, Kibana), trong môi trường Development tự động thực thi các dự án migration cơ sở dữ liệu của từng dịch vụ, và tự động khởi động frontend vben5 bằng `pnpm dev:app`, **không cần** khởi động thêm `docker-compose.middleware.yml`.

```powershell
cd ./aspnet-core/aspire/LINGYUN.Abp.MicroService.AppHost
aspire run
```

- Cần cài Aspire CLI (phiên bản phải khớp với `Aspire.AppHost.Sdk` 13.x của AppHost): `dotnet tool install --global Aspire.Cli`; khi không dùng CLI cũng có thể trực tiếp `dotnet run --project .\LINGYUN.Abp.MicroService.AppHost.csproj`.
- Cần Docker đang chạy, và `apps/vben5` đã thực thi `pnpm install` (AppHost sẽ chạy `pnpm dev:app`, cổng frontend cố định 5666).
- Sau khi khởi động, terminal sẽ xuất địa chỉ Aspire Dashboard, có thể xem trạng thái tài nguyên, nhật ký và trace trên bảng điều khiển.
- Các cổng máy host mà AppHost chiếm hoàn toàn trùng với middleware của cách 1 (6379/9200/5601/5672/15672/5432, v.v.), **xin đừng chạy đồng thời với middleware của cách 1**.

### Cách 3: Khởi động dịch vụ đơn khối

Dịch vụ đơn khối gộp gateway, xác thực và các module nghiệp vụ thành một tiến trình, nhưng **vẫn phụ thuộc middleware, phải khởi động middleware trước**:

```powershell
# ① Khởi động middleware
docker-compose -f .\docker-compose.middleware.yml -p labp up -d
# Lần khởi động đầu tiên hãy chờ hơn 30 giây

# ② Khởi động dịch vụ đơn khối
cd .\aspnet-core\services\LINGYUN.Abp.MicroService.AllInOne
dotnet run --launch-profile Single.MySql.Dev

# ③ Khởi động frontend
cd .\apps\vben5
pnpm install
pnpm dev:app
```

- Địa chỉ mặc định **http://localhost:30000**: `App:SelfUrl` và `AuthServer:Authority` đều trỏ tới nó, endpoint xác thực và API cùng cổng.
- **Khuyến nghị chỉ định rõ Profile**: khi không chỉ định, `dotnet run` dùng Profile đầu tiên trong `launchSettings.json` (hiện là `Single.PostgreSql.Dev`). Dùng cơ sở dữ liệu mặc định (MySQL) hãy dùng `Single.MySql.Dev`, các lựa chọn khác là `Single.PostgreSql.Dev`, `Single.SqlServer.Dev`.
- Chuỗi kết nối của từng cơ sở dữ liệu xem tại `appsettings.Development.MySql.json` / `appsettings.Development.PostgreSql.json` / `appsettings.Development.SqlServer.json`.

### Câu hỏi thường gặp

- **Lệnh `docker-compose` không tồn tại**: script dùng lệnh Compose V1; khi chỉ cài Compose V2 hãy đổi sang `docker compose`.
- **Nhắc không tìm thấy image `labp-*-service:10.6.0`**: `docker-compose.override.yml` tham chiếu image đã build trước qua `image:`, hãy thực thi trước `build/build-aspnetcore-docker-build.ps1` (cách 1 · khởi động thủ công bước ③).
- **Script một chạm báo lỗi khi migrate (`dotnet run --no-build`)**: bên trong `deploy.ps1` dùng `--no-build`, trước khi thực thi script cần build backend trước (`dotnet build .\aspnet-core\LINGYUN.MicroService.All.slnx`); migrate thủ công hãy đổi sang **build/build-aspnetcore-ef-update.ps1** (bên trong `dotnet run`, sẽ tự động build).
- **Cài đặt dependency frontend thất bại**: `apps/vben5` bắt buộc dùng pnpm (`preinstall` sẽ thực thi `only-allow pnpm`), hãy dùng `pnpm install` / `pnpm dev:app`.
- **Bên trong container không kết nối được middleware máy host**: xác nhận file hosts chứa `127.0.0.1 host.docker.internal`.

---

### Kiểm tra định dạng code và tự động sửa

Thực thi trong `apps/vben5` (vben5 bắt buộc dùng pnpm):

```bash
cd apps/vben5

# Kiểm tra code
pnpm lint

# Tự động sửa
pnpm format

# Kiểm tra kiểu
pnpm check:type
```

### Chạy unit test

```bash
cd apps/vben5

pnpm test:unit
```

## Cách đóng góp

Rất hoan nghênh bạn tham gia! Tạo một Issue hoặc gửi một Pull Request.

**Pull Request:**

1. Fork code!
2. Tạo nhánh của riêng bạn: `git checkout -b feat/xxxx`
3. Commit thay đổi của bạn: `git commit -am 'feat(function): add xxxxx'`
4. Push nhánh của bạn: `git push origin feat/xxxx`
5. Gửi `pull request`

## Quy chuẩn commit đóng góp Git

- Tham khảo quy chuẩn [vue](./apps/vue/.github/COMMIT_CONVENTION.md) ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))

  - `feat` Thêm tính năng mới
  - `fix` Sửa vấn đề/BUG
  - `style` Liên quan phong cách code, không ảnh hưởng kết quả chạy
  - `perf` Tối ưu / nâng cao hiệu năng
  - `refactor` Tái cấu trúc
  - `revert` Hoàn tác thay đổi
  - `test` Liên quan kiểm thử
  - `docs` Tài liệu / chú thích
  - `chore` Cập nhật dependency / sửa cấu hình scaffold, v.v.
  - `workflow` Cải tiến workflow
  - `ci` Tích hợp liên tục
  - `types` Thay đổi file định nghĩa kiểu
  - `wip` Đang phát triển

## Hỗ trợ trình duyệt

Phát triển local khuyến nghị dùng trình duyệt `Chrome 80+`

Hỗ trợ trình duyệt hiện đại, không hỗ trợ IE

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| :-: | :-: | :-: | :-: | :-: |
| not support | last 2 versions | last 2 versions | last 2 versions | last 2 versions |



## License

[MIT License](./LICENSE)

## Thanks

![JetBrains Logo (Main) logo](https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.svg)
