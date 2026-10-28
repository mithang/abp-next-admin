# Về Vben Admin

::: info Bạn đang đọc tài liệu phiên bản `5.0` của [Vben Admin](https://github.com/vbenjs/vue-vben-admin)!

- Vben Admin 2.x hiện đã được lưu trữ, chỉ sửa các vấn đề nghiêm trọng.
- Phiên bản mới không tương thích với phiên bản cũ, nếu bạn đang dùng phiên bản cũ (v2, v3), vui lòng xem [Tài liệu Vue Vben Admin 2.x](https://doc.vvbin.cn)
- Nếu phát hiện tài liệu có sai sót, bạn có thể gửi [issue](https://github.com/vbenjs/vue-vben-admin/issues) để giúp chúng tôi cải thiện.
- Nếu bạn chỉ muốn trải nghiệm thử, bạn có thể xem [Bắt đầu nhanh](./quick-start.md).

:::

[Vben Admin](https://github.com/vbenjs/vue-vben-admin) là một giải pháp quản trị trung - hậu đài dựa trên [Vue3.0](https://github.com/vuejs/core), [Vite](https://github.com/vitejs/vite), [TypeScript](https://www.typescriptlang.org/), với mục tiêu cung cấp giải pháp dùng ngay cho việc phát triển các dự án vừa và lớn. Bao gồm các tính năng như đóng gói lại component, utils, hooks, menu động, kiểm tra quyền, cấu hình đa chủ đề, kiểm soát quyền ở cấp nút bấm, v.v. Dự án sẽ sử dụng các công nghệ frontend khá mới, có thể dùng làm mẫu khởi động dự án để giúp bạn nhanh chóng xây dựng nguyên mẫu sản phẩm quản trị doanh nghiệp. Đồng thời cũng có thể dùng làm ví dụ để học các công nghệ phổ biến như `vue3`, `vite`, `ts`. Dự án này sẽ liên tục theo dõi các công nghệ mới nhất và áp dụng chúng vào dự án.

## Đặc điểm

- **Công nghệ mới nhất**：Phát triển bằng các công nghệ frontend tiên tiến như `Vue3`, `Vite`, `TypeScript`.
- **Quốc tế hóa**：Tích hợp sẵn giải pháp quốc tế hóa hoàn chỉnh, hỗ trợ chuyển đổi đa ngôn ngữ.
- **Xác thực quyền**：Giải pháp xác thực quyền hoàn chỉnh, kiểm soát quyền ở cấp nút bấm.
- **Đa chủ đề**：Tích hợp sẵn nhiều cấu hình chủ đề và chế độ tối, đáp ứng nhu cầu cá nhân hóa.
- **Menu động**：Hỗ trợ menu động, có thể hiển thị menu theo cấu hình quyền.
- **Dữ liệu Mock**：Giải pháp dữ liệu Mock cục bộ hiệu năng cao dựa trên `Nitro`.
- **Component phong phú**：Cung cấp nhiều component, có thể đáp ứng hầu hết nhu cầu nghiệp vụ.
- **Quy chuẩn**：Quy chuẩn code, sử dụng các công cụ như `ESLint`, `Prettier`, `Stylelint`, `Publint`, `CSpell` để đảm bảo chất lượng code.
- **Kỹ thuật hóa**：Sử dụng các công cụ như `Pnpm Monorepo`, `TurboRepo`, `Changeset` để nâng cao hiệu quả phát triển.
- **Hỗ trợ đa thư viện UI**：Hỗ trợ các thư viện UI phổ biến như `Ant Design Vue`, `Element Plus`, `Naive`, không còn giới hạn ở một framework cụ thể.

## Hỗ trợ trình duyệt

- **Phát triển cục bộ**nên dùng trình duyệt `Chrome phiên bản mới nhất`, **không hỗ trợ** các phiên bản dưới `Chrome 80`.

- **Môi trường production**hỗ trợ các trình duyệt hiện đại, không hỗ trợ IE.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png" alt="IE" width="24px" height="24px"  />](http://godban.github.io/browsers-support-badges/)IE | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)Safari |
| :-: | :-: | :-: | :-: | :-: |
| Không hỗ trợ | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## Đóng góp

- [Vben Admin](https://github.com/vbenjs/vue-vben-admin) vẫn đang được cập nhật liên tục, dự án này hoan nghênh sự tham gia của bạn, cùng nhau bảo trì, từng bước hoàn thiện, xây dựng giải pháp quản trị trung - hậu đài tốt hơn.
- Nếu bạn có hứng thú tham gia cùng chúng tôi, bạn có thể bắt đầu bằng các cách sau, chúng tôi sẽ mời bạn tham gia dựa trên mức độ tích cực của bạn.

::: info Tham gia cùng chúng tôi

- Gửi `PR` lâu dài.
- Đưa ra những đề xuất có giá trị.
- Tham gia thảo luận, giúp giải quyết `issue`.
- Cùng nhau bảo trì tài liệu.

:::
