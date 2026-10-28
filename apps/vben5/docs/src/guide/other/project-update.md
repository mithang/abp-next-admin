# Cập nhật dự án

## Vì sao không thể cập nhật như plugin npm

Vì dự án là một template dự án hoàn chỉnh, không phải plugin hay gói cài đặt, nên không thể cập nhật như plugin; sau khi bạn dùng code, sẽ phát triển lần hai theo nhu cầu nghiệp vụ và cần tự hợp nhất, nâng cấp thủ công.

## Tôi cần làm gì

Dự án được quản lý theo cách `Monorepo` và đã tách một số code khá cốt lõi, ví dụ `packages/@core`, `packages/effects`; chỉ cần code nghiệp vụ không sửa phần code này thì bạn có thể trực tiếp kéo code mới nhất rồi hợp nhất vào nhánh của mình, chỉ cần xử lý đơn giản một phần xung đột. Các thư mục còn lại chỉ điều chỉnh nhỏ, không ảnh hưởng code nghiệp vụ.

::: tip Khuyến nghị

Nên theo dõi hoạt động của kho, tích cực hợp nhất, đừng tích lũy lâu, nếu không sẽ dẫn đến quá nhiều xung đột hợp nhất, làm tăng độ khó hợp nhất.

:::

## Cập nhật code bằng Git

1. Clone code

```bash
git clone https://github.com/vbenjs/vue-vben-admin.git
```

2. Thêm địa chỉ nguồn git của công ty mình

```bash
# up là tên nguồn, có thể đặt tùy ý
# gitUrl là code mã nguồn mở mới nhất
git remote add up gitUrl;
```

3. Commit code lên git công ty mình

```bash
# Commit code lên công ty mình
# main là tên nhánh, cần tự sửa theo tình hình
git push up main

# Đồng bộ code của công ty
# main là tên nhánh, cần tự sửa theo tình hình
git pull up main
```

4. Cách đồng bộ code mã nguồn mở mới nhất

```bash
git pull origin main
```

::: tip Lưu ý

Khi đồng bộ code sẽ xuất hiện xung đột. Chỉ cần giải quyết xung đột là được

:::
