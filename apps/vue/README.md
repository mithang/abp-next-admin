<div align="center"> <a href="https://github.com/anncwb/vue-vben-admin"> <img alt="VbenAdmin Logo" width="200" height="200" src="https://anncwb.github.io/anncwb/images/logo.png"> </a> <br> <br>

[![license](https://img.shields.io/github/license/anncwb/vue-vben-admin.svg)](LICENSE)

<h1>Vue vben admin</h1>
</div>

## Giới thiệu

Vue Vben Admin là một mẫu quản trị trung/hậu đài mã nguồn mở miễn phí. Được phát triển bằng các công nghệ chủ đạo mới nhất như `vue3`, `vite2`, `TypeScript`, là giải pháp frontend trung/hậu đài dùng ngay sau khi cài đặt, cũng có thể dùng để học tập và tham khảo.

## Tính năng

- **Công nghệ mới nhất**：Phát triển bằng các công nghệ frontend tiên tiến như Vue3/vite2
- **TypeScript**: Ngôn ngữ JavaScript cấp ứng dụng
- **Chủ đề**：Chủ đề có thể cấu hình
- **Quốc tế hoá**：Giải pháp quốc tế hoá hoàn chỉnh tích hợp sẵn
- **Dữ liệu Mock** Giải pháp dữ liệu Mock tích hợp sẵn
- **Quyền hạn** Giải pháp tạo quyền định tuyến động hoàn chỉnh tích hợp sẵn
- **Thành phần** Đã đóng gói lại nhiều thành phần thường dùng

## Xem trước

![Nhật ký hệ thống](./images/logging.png)

![Nhật ký kiểm toán](./images/audit-log.png)

![Nhật ký bảo mật](./images/security-log.png)

![Quản lý cổng](./images/apigateway.png)

![Từ điển dữ liệu](./images/data-dictionary.png)

![Lưu trữ đối tượng](./images/oss.png)

![Quản lý tính năng](./images/features.png)

![Cài đặt hệ thống](./images/settings.png)

![Quản lý menu](./images/menus.png)

![Tổ chức](./images/organization-unit.png)

![Quản lý bản địa hoá](./images/localization.png)

### Sử dụng Gitpod

Mở dự án trong Gitpod (môi trường phát triển trực tuyến miễn phí dành cho GitHub) và bắt đầu viết code ngay lập tức.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/anncwb/vue-vben-admin)

## Tài liệu

[Địa chỉ tài liệu](https://vvbin.cn/doc-next/)

## Chuẩn bị

- [node](http://nodejs.org/) và [git](https://git-scm.com/) - Môi trường phát triển dự án
- [Vite](https://vitejs.dev/) - Làm quen với các tính năng của vite
- [Vue3](https://v3.vuejs.org/) - Làm quen với cú pháp cơ bản của Vue
- [TypeScript](https://www.typescriptlang.org/) - Làm quen với cú pháp cơ bản của `TypeScript`
- [Es6+](http://es6.ruanyifeng.com/) - Làm quen với cú pháp cơ bản của es6
- [Vue-Router-Next](https://next.router.vuejs.org/) - Làm quen với cách dùng cơ bản của vue-router
- [Ant-Design-Vue](https://2x.antdv.com/docs/vue/introduce-cn/) - Cách dùng cơ bản của ui
- [Mock.js](https://github.com/nuysoft/Mock) - Cú pháp cơ bản của mockjs

- [abp-vNext-admin](https://github.com/colinin/abp-vue-admin-element-typescript) - Dịch vụ backend

## Cài đặt và sử dụng

- Lấy mã nguồn dự án

```bash
git clone https://github.com/anncwb/vue-vben-admin.git
```

- Cài đặt các dependency

```bash
cd vue-vben-admin

pnpm install

```

- run

```bash
pnpm serve
```

- build

```bash
pnpm build
```

## Change Log

[CHANGELOG](./CHANGELOG.zh_CN.md)

## Project

- [vue-vben-admin](https://github.com/anncwb/vue-vben-admin) - full version
- [vue-vben-admin-thin-next](https://github.com/anncwb/vben-admin-thin-next) - Simplified version

## How to contribute

You are very welcome to join！[Raise an issue](https://github.com/anncwb/vue-vben-admin/issues/new/choose) Or submit a Pull Request。

**Pull Request:**

1. Fork code!
2. Create your own branch: `git checkout -b feat/xxxx`
3. Submit your changes: `git commit -am 'feat(function): add xxxxx'`
4. Push your branch: `git push origin feat/xxxx`
5. submit`pull request`

## Git Contribution submission specification

- reference [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md) specification ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))

  - `feat` Add new features
  - `fix` Fix the problem/BUG
  - `style` The code style is related and does not affect the running result
  - `perf` Optimization/performance improvement
  - `refactor` Refactor
  - `revert` Undo edit
  - `test` Test related
  - `docs` Documentation/notes
  - `chore` Dependency update/scaffolding configuration modification etc.
  - `workflow` Workflow improvements
  - `ci` Continuous integration
  - `types` Type definition file changes
  - `wip` In development

## Related warehouse

If these plugins are helpful to you, you can give a star support

- [vite-plugin-mock](https://github.com/anncwb/vite-plugin-mock) - Used for local and development environment data mock
- [vite-plugin-html](https://github.com/anncwb/vite-plugin-html) - Used for html template conversion and compression
- [vite-plugin-style-import](https://github.com/anncwb/vite-plugin-style-import) - Used for component library style introduction on demand
- [vite-plugin-theme](https://github.com/anncwb/vite-plugin-theme) - Used for online switching of theme colors and other color-related configurations
- [vite-plugin-imagemin](https://github.com/anncwb/vite-plugin-imagemin) - Used to pack compressed image resources
- [vite-plugin-compression](https://github.com/anncwb/vite-plugin-compression) - Used to pack input .gz|.brotil files
- [vite-plugin-svg-icons](https://github.com/anncwb/vite-plugin-svg-icons) - Used to quickly generate svg sprite

## Browser support

The `Chrome 80+` browser is recommended for local development

Support modern browsers, not IE

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| :-: | :-: | :-: | :-: | :-: |
| not support | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## Maintainer

[@Vben](https://github.com/anncwb)

## Donate

If you think this project is helpful to you, you can help the author buy a cup of coffee to show your support!

![donate](https://anncwb.github.io/anncwb/images/sponsor.png)

<a style="display: block;width: 100px;height: 50px;line-height: 50px; color: #fff;text-align: center; background: #408aed;border-radius: 4px;" href="https://www.paypal.com/paypalme/cvvben">Paypal Me</a>

## Discord

- [github discussions](https://github.com/anncwb/vue-vben-admin/discussions)
- [Discord](https://discord.gg/8GuAdwDhj6)

## License

[MIT © Vben-2020](./LICENSE)
