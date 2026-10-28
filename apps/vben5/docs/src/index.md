---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
sidebar: false

hero:
  name: Vben Admin
  text: Khung hệ thống quản lý cấp doanh nghiệp
  tagline: Nâng cấp hoàn toàn mới, dùng ngay khi mở hộp, đơn giản và hiệu quả
  image:
    src: https://unpkg.com/@vbenjs/static-source@0.1.7/source/logo-v1.webp
    alt: Vben Admin
  actions:
    - theme: brand
      text: Bắt đầu nhanh ->
      link: /guide/introduction/vben
    - theme: alt
      text: Xem trước trực tuyến
      link: https://www.vben.pro
    - theme: alt
      text: Xem trên GitHub
      link: https://github.com/vbenjs/vue-vben-admin
    - theme: alt
      text: Tài liệu DeepWiki
      link: https://deepwiki.com/vbenjs/vue-vben-admin

features:
  - icon: 🚀
    title: Công nghệ mới nhất
    details: Dựa trên các công nghệ mới nhất như Vue3, Pinia, Vue Router, TypeScript.
    link: /guide/introduction/quick-start
    linkText: Bắt đầu nhanh
  - icon: 🦄
    title: Cấu hình phong phú
    details: Giải pháp frontend trung–hậu đài cấp doanh nghiệp, cung cấp nhiều component và mẫu cùng N phương án kết hợp tùy chọn.
    link: /guide/essentials/settings
    linkText: Tài liệu cấu hình
  - icon: 🎨
    title: Tùy chỉnh chủ đề
    details: Chỉ với cấu hình đơn giản là có thể chuyển đổi nhiều chủ đề khác nhau, đáp ứng nhu cầu cá nhân hóa.
    link: /guide/in-depth/theme
    linkText: Tài liệu chủ đề
  - icon: 🌐
    title: Quốc tế hóa
    details: Tích hợp sẵn giải pháp quốc tế hóa, hỗ trợ chuyển đổi nhiều ngôn ngữ, đáp ứng nhu cầu quốc tế hóa.
    link: /guide/in-depth/locale
    linkText: Tài liệu quốc tế hóa
  - icon: 🔐
    title: Quản lý quyền
    details: Tích hợp sẵn giải pháp quản lý quyền, hỗ trợ nhiều cách kiểm soát quyền, đáp ứng nhiều nhu cầu về quyền.
    link: /guide/in-depth/access
    linkText: Tài liệu quyền
  - title: Vite
    icon:
      src: /logos/vite.svg
    details: Công cụ build frontend hiện đại, khởi động lạnh nhanh, cập nhật nóng tức thì.
    link: https://vitejs.dev/
    linkText: Trang web chính thức
  - title: Shadcn UI
    icon:
      src: /logos/shadcn-ui.svg
    details: Lõi dựa trên Shadcn UI + Tailwindcss, nghiệp vụ có thể hỗ trợ bất kỳ framework UI nào.
    link: https://www.shadcn-vue.com/
    linkText: Trang web chính thức
  - title: Turbo Repo
    icon:
      src: /logos/turborepo.svg
    details: Kiến trúc monorepo chuẩn mực và quy phạm, sử dụng mô hình quản lý kỹ thuật pnpm + monorepo + turbo, cung cấp quy chuẩn phát triển cấp doanh nghiệp.
    link: https://turbo.build/
    linkText: Trang web chính thức
  - title: Nitro Mock Server
    icon:
      src: /logos/nitro.svg
    details: Tích hợp sẵn dịch vụ Nitro Mock, giúp dịch vụ mock của bạn mạnh mẽ hơn.
    link: https://nitro.unjs.io/
    linkText: Trang web chính thức
---

<!-- <script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers,
  VPTeamPageSection
} from 'vitepress/theme';

const members = [
  {
    avatar: 'https://avatars.githubusercontent.com/u/28132598?v=4',
    name: 'Vben',
    title: 'Người sáng lập',
    desc: 'Tác giả của Vben Admin và hệ sinh thái liên quan, phụ trách phát triển tổng thể của dự án.',
    links: [
      { icon: 'github', link: 'https://github.com/anncwb' },
    ]
  },
]
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>
      Giới thiệu thành viên cốt lõi
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers
    :members="members"
  />
</VPTeamPage> -->

<VbenContributors />
