# Phát triển cục bộ {#development}

::: tip Lấy mã nguồn

Nếu bạn chưa lấy mã nguồn, bạn có thể bắt đầu đọc tài liệu từ [Bắt đầu nhanh](../introduction/quick-start.md).

:::

## Chuẩn bị trước

Để có trải nghiệm phát triển tốt hơn, chúng tôi cung cấp một số cấu hình công cụ và mô tả dự án, giúp bạn phát triển tốt hơn.

### Kiến thức cơ bản cần nắm vững

Dự án này cần một số kiến thức cơ bản về frontend, hãy đảm bảo nắm vững kiến thức cơ bản về Vue để xử lý một số vấn đề thường gặp. Bạn nên học trước các nội dung sau trong quá trình phát triển, việc tìm hiểu và học trước các kiến thức này sẽ rất hữu ích cho việc hiểu dự án:

- [Vue3](https://vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vue Router](https://router.vuejs.org/)
- [Vitejs](https://vitejs.dev/)
- [Pnpm](https://pnpm.io/)
- [Turbo](https://turbo.build/)

### Cấu hình công cụ

Nếu IDE bạn sử dụng là [vscode](https://code.visualstudio.com/) (khuyến nghị), bạn có thể cài đặt các công cụ sau để nâng cao hiệu quả phát triển và định dạng mã nguồn:

- [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) - Plugin chính thức của Vue (bắt buộc).
- [Tailwind CSS](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) - Plugin gợi ý Tailwindcss.
- [CSS Variable Autocomplete](https://marketplace.visualstudio.com/items?itemName=bradlc.vunguyentuan.vscode-css-variables) - Plugin gợi ý biến Css.
- [Iconify IntelliSense](https://marketplace.visualstudio.com/items?itemName=antfu.iconify) - Plugin biểu tượng Iconify
- [i18n Ally](https://marketplace.visualstudio.com/items?itemName=Lokalise.i18n-ally) - Plugin i18n
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - Kiểm tra mã script
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - Định dạng mã nguồn
- [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) - Định dạng css
- [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) - Kiểm tra ngữ pháp từ
- [DotENV](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv) - Làm nổi bật tệp .env

## Npm Scripts

npm script là cấu hình thường gặp của dự án, dùng để thực hiện một số tác vụ thường gặp, ví dụ như khởi động dự án, đóng gói dự án, v.v. Các script dưới đây đều có thể tìm thấy trong tệp `package.json` ở thư mục gốc của dự án.

Cách thực thi là: `pnpm run [script]` hoặc `npm run [script]`.

```json
{
  "scripts": {
    // Xây dựng dự án
    "build": "cross-env NODE_OPTIONS=--max-old-space-size=8192 turbo build",
    // Xây dựng dự án và phân tích
    "build:analyze": "turbo build:analyze",
    // Xây dựng image docker cục bộ
    "build:docker": "./build-local-docker-image.sh",
    // Xây dựng riêng ứng dụng web-antd
    "build:antd": "pnpm run build --filter=@vben/web-antd",
    // Xây dựng riêng tài liệu
    "build:docs": "pnpm run build --filter=@vben/docs",
    // Xây dựng riêng ứng dụng web-ele
    "build:ele": "pnpm run build --filter=@vben/web-ele",
    // Xây dựng riêng ứng dụng web-naive
    "build:naive": "pnpm run build --filter=@vben/naive",
    // Xây dựng riêng ứng dụng web-tdesign
    "build:tdesign": "pnpm run build --filter=@vben/web-tdesign",
    // Xây dựng riêng ứng dụng playground
    "build:play": "pnpm run build --filter=@vben/playground",
    // Quản lý phiên bản changeset
    "changeset": "pnpm exec changeset",
    // Kiểm tra các vấn đề của dự án
    "check": "pnpm run check:circular && pnpm run check:dep && pnpm run check:type && pnpm check:cspell",
    // Kiểm tra tham chiếu vòng tròn
    "check:circular": "vsh check-circular",
    // Kiểm tra chính tả
    "check:cspell": "cspell lint **/*.ts **/README.md .changeset/*.md --no-progress"
    // Kiểm tra phụ thuộc
    "check:dep": "vsh check-dep",
    // Kiểm tra kiểu
    "check:type": "turbo run typecheck",
    // Dọn dẹp dự án (xóa các thư mục node_modules, dist, .turbo) v.v.
    "clean": "node ./scripts/clean.mjs",
    // Commit mã nguồn
    "commit": "czg",
    // Khởi động dự án (mặc định sẽ chạy script dev của tất cả các gói trong toàn bộ kho)
    "dev": "turbo-run dev",
    // Khởi động ứng dụng web-antd
    "dev:antd": "pnpm -F @vben/web-antd run dev",
    // Khởi động tài liệu
    "dev:docs": "pnpm -F @vben/docs run dev",
    // Khởi động ứng dụng web-ele
    "dev:ele": "pnpm -F @vben/web-ele run dev",
    // Khởi động ứng dụng web-naive
    "dev:naive": "pnpm -F @vben/web-naive run dev",
    // Khởi động ứng dụng demo
    "dev:play": "pnpm -F @vben/playground run dev",
    // Định dạng mã nguồn
    "format": "vsh lint --format",
    // Lint mã nguồn
    "lint": "vsh lint",
    // Sau khi cài đặt phụ thuộc xong, thực thi script stub của tất cả các gói
    "postinstall": "pnpm -r run stub --if-present",
    // Chỉ cho phép sử dụng pnpm
    "preinstall": "npx only-allow pnpm",
    // Cài đặt lefthook
    "prepare": "is-ci || lefthook install",
    // Xem trước ứng dụng
    "preview": "turbo-run preview",
    // Kiểm tra quy chuẩn gói
    "publint": "vsh publint",
    // Xóa tất cả node_modules, yarn.lock, package.lock.json, rồi cài đặt lại phụ thuộc
    "reinstall": "pnpm clean --del-lock && pnpm install",
    // Chạy kiểm thử đơn vị vitest
    "test:unit": "vitest run --dom",
    // Cập nhật phụ thuộc của dự án
    "update:deps": " pnpm update --latest --recursive",
    // changeset tạo tập hợp commit
    "version": "pnpm exec changeset version && pnpm install --no-frozen-lockfile"
  }
}
```

## Chạy dự án cục bộ

Nếu cần chạy tài liệu cục bộ và điều chỉnh, bạn có thể thực thi lệnh sau, khi thực thi lệnh này, bạn có thể chọn ứng dụng cần thiết để phát triển:

```bash
pnpm dev
```

Nếu bạn muốn chạy trực tiếp một ứng dụng nào đó, bạn có thể thực thi lệnh sau:

Chạy ứng dụng `web-antd`:

```bash
pnpm dev:antd
```

Chạy ứng dụng `web-naive`:

```bash
pnpm dev:naive
```

Chạy ứng dụng `web-ele`:

```bash
pnpm dev:ele
```

Chạy ứng dụng `docs`:

```bash
pnpm dev:docs
```

## Phân biệt môi trường build

Trong quá trình phát triển nghiệp vụ thực tế, thường phân biệt nhiều môi trường khi build, ví dụ như môi trường kiểm thử `test`, môi trường sản xuất `build`, v.v.

Lúc này có thể sửa ba tệp, thêm cấu hình script tương ứng trong đó để đạt hiệu quả phân biệt môi trường sản xuất.

Lấy ví dụ thêm môi trường kiểm thử `test` cho `@vben/web-antd`:

- `apps\web-antd\package.json`

```json
"scripts": {
  "build:prod": "pnpm vite build --mode production",
  "build:test": "pnpm vite build --mode test",
  "build:analyze": "pnpm vite build --mode analyze",
  "dev": "pnpm vite --mode development",
  "preview": "vite preview",
  "typecheck": "vue-tsc --noEmit --skipLibCheck"
},
```

Thêm lệnh `"build:test"`, và đổi `"build"` gốc thành `"build:prod"` để tránh build đồng thời gói của hai môi trường.

- `package.json`

```json
"scripts": {
    "build": "cross-env NODE_OPTIONS=--max-old-space-size=8192 turbo build",
    "build:analyze": "turbo build:analyze",
    "build:antd": "pnpm run build --filter=@vben/web-antd",
    "build-test:antd": "pnpm run build --filter=@vben/web-antd build:test",

    ······
}
```

Thêm lệnh build môi trường kiểm thử vào `package.json` ở thư mục gốc

- `turbo.json`

```json
"tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [
        "dist/**",
        "dist.zip",
        ".vitepress/dist.zip",
        ".vitepress/dist/**"
      ]
    },

    "build-test:antd": {
      "dependsOn": ["@vben/web-antd#build:test"],
      "outputs": ["dist/**"]
    },

    "@vben/web-antd#build:test": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },

    ······
```

Thêm lệnh phụ thuộc liên quan vào `turbo.json`

## Tài nguyên tĩnh công cộng

Tài nguyên tĩnh công cộng cần sử dụng trong dự án, ví dụ như: hình ảnh, HTML tĩnh, v.v., cần được nhúng trực tiếp trong quá trình phát triển qua `src="/xxx.png"`.

Cần đặt tài nguyên vào thư mục `public/static` của dự án tương ứng. Đường dẫn nhúng là: `src="/static/xxx.png"`.

## DevTools

Dự án đã tích hợp sẵn plugin [Vue DevTools](https://github.com/vuejs/devtools-next), có thể sử dụng trong quá trình phát triển. Mặc định tắt, có thể bật trong `.env.development` và chạy lại dự án:

```bash
VITE_DEVTOOLS=true
```

Sau khi bật, khi dự án chạy sẽ hiển thị một biểu tượng Vue DevTools ở cuối trang, nhấp vào là có thể mở DevTools.

![Vue DevTools](/guide/devtools.png)

## Chạy tài liệu cục bộ

Nếu cần chạy tài liệu cục bộ và điều chỉnh, bạn có thể thực thi lệnh sau:

```bash
pnpm dev:docs
```

## Giải quyết vấn đề

Nếu bạn gặp vấn đề liên quan đến phụ thuộc trong quá trình sử dụng, bạn có thể thử cài đặt lại phụ thuộc như sau:

```bash
# Hãy thực thi tại thư mục gốc của dự án
# Lệnh này sẽ xóa toàn bộ node_modules, yarn.lock, package.lock.json của kho
# rồi cài đặt lại phụ thuộc (tốc độ cài đặt sẽ chậm hơn rõ rệt).
pnpm reinstall
```
