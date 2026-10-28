<script lang="ts" setup>
import type {
  WorkbenchProjectItem,
  WorkbenchQuickNavItem,
  WorkbenchTodoItem,
  WorkbenchTrendItem,
} from '@vben/common-ui';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import {
  AnalysisChartCard,
  WorkbenchHeader,
  WorkbenchProject,
  WorkbenchQuickNav,
  WorkbenchTodo,
  WorkbenchTrends,
} from '@vben/common-ui';
import { preferences } from '@vben/preferences';
import { useUserStore } from '@vben/stores';
import { openWindow } from '@vben/utils';

import AnalyticsVisitsSource from '../analytics/analytics-visits-source.vue';

const userStore = useUserStore();

// Đây là dữ liệu mẫu, trong dự án thực tế cần điều chỉnh theo tình hình thực tế
// url cũng có thể là route nội bộ, được nhận diện và xử lý trong phương thức navTo để chuyển hướng nội bộ
// Ví dụ: url: /dashboard/workspace
const projectItems: WorkbenchProjectItem[] = [
  {
    color: '',
    content: 'Đừng chờ đợi cơ hội, mà hãy tự tạo ra cơ hội.',
    date: '2021-04-01',
    group: 'Nhóm mã nguồn mở',
    icon: 'carbon:logo-github',
    title: 'Github',
    url: 'https://github.com',
  },
  {
    color: '#3fb27f',
    content: 'Bạn của hiện tại quyết định bạn của tương lai.',
    date: '2021-04-01',
    group: 'Nhóm thuật toán',
    icon: 'ion:logo-vue',
    title: 'Vue',
    url: 'https://vuejs.org',
  },
  {
    color: '#e18525',
    content: 'Không có tài năng nào quan trọng hơn sự nỗ lực.',
    date: '2021-04-01',
    group: 'Nhóm trốn việc',
    icon: 'ion:logo-html5',
    title: 'Html5',
    url: 'https://developer.mozilla.org/zh-CN/docs/Web/HTML',
  },
  {
    color: '#bf0c2c',
    content: 'Nhiệt huyết và khát vọng có thể vượt qua mọi khó khăn.',
    date: '2021-04-01',
    group: 'UI',
    icon: 'ion:logo-angular',
    title: 'Angular',
    url: 'https://angular.io',
  },
  {
    color: '#00d8ff',
    content: 'Cơ thể khỏe mạnh là nền tảng để đạt được mục tiêu.',
    date: '2021-04-01',
    group: 'Nhóm chuyên gia kỹ thuật',
    icon: 'bx:bxl-react',
    title: 'React',
    url: 'https://reactjs.org',
  },
  {
    color: '#EBD94E',
    content:
      'Con đường là do đi mà thành, chứ không phải do tưởng tượng mà ra.',
    date: '2021-04-01',
    group: 'Nhóm kiến trúc',
    icon: 'ion:logo-javascript',
    title: 'Js',
    url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript',
  },
];

// Tương tự, url ở đây cũng có thể dùng liên kết ngoài bắt đầu bằng http
const quickNavItems: WorkbenchQuickNavItem[] = [
  {
    color: '#1fdaca',
    icon: 'ion:home-outline',
    title: 'Trang chủ',
    url: '/',
  },
  {
    color: '#bf0c2c',
    icon: 'ion:grid-outline',
    title: 'Bảng điều khiển',
    url: '/dashboard',
  },
  {
    color: '#e18525',
    icon: 'ion:layers-outline',
    title: 'Thành phần',
    url: '/demos/features/icons',
  },
  {
    color: '#3fb27f',
    icon: 'ion:settings-outline',
    title: 'Quản lý hệ thống',
    url: '/demos/features/login-expired', // URL này chỉ là ví dụ, trong dự án thực tế cần điều chỉnh theo tình hình thực tế
  },
  {
    color: '#4daf1bc9',
    icon: 'ion:key-outline',
    title: 'Quản lý quyền',
    url: '/demos/access/page-control',
  },
  {
    color: '#00d8ff',
    icon: 'ion:bar-chart-outline',
    title: 'Biểu đồ',
    url: '/analytics',
  },
];

const todoItems = ref<WorkbenchTodoItem[]>([
  {
    completed: false,
    content: `Rà soát mã frontend vừa được commit lên kho Git, đảm bảo chất lượng và quy chuẩn mã.`,
    date: '2024-07-30 11:00:00',
    title: 'Rà soát commit mã frontend',
  },
  {
    completed: true,
    content: `Kiểm tra và tối ưu hiệu năng hệ thống, giảm mức sử dụng CPU.`,
    date: '2024-07-30 11:00:00',
    title: 'Tối ưu hiệu năng hệ thống',
  },
  {
    completed: false,
    content: `Thực hiện kiểm tra bảo mật hệ thống, đảm bảo không có lỗ hổng bảo mật hay truy cập trái phép. `,
    date: '2024-07-30 11:00:00',
    title: 'Kiểm tra bảo mật',
  },
  {
    completed: false,
    content: `Cập nhật tất cả các gói phụ thuộc npm trong dự án, đảm bảo dùng phiên bản mới nhất.`,
    date: '2024-07-30 11:00:00',
    title: 'Cập nhật dependency dự án',
  },
  {
    completed: false,
    content: `Sửa lỗi hiển thị UI trang do người dùng báo cáo, đảm bảo hiển thị nhất quán trên các trình duyệt khác nhau. `,
    date: '2024-07-30 11:00:00',
    title: 'Sửa lỗi hiển thị UI',
  },
]);
const trendItems: WorkbenchTrendItem[] = [
  {
    avatar: 'svg:avatar-1',
    content: `Đã tạo dự án <a>Vue</a> trong <a>Nhóm mã nguồn mở</a>`,
    date: 'Vừa xong',
    title: 'William',
  },
  {
    avatar: 'svg:avatar-2',
    content: `Đã theo dõi <a>William</a> `,
    date: '1 giờ trước',
    title: 'Evan',
  },
  {
    avatar: 'svg:avatar-3',
    content: `Đã đăng <a>bài viết cá nhân</a> `,
    date: '1 ngày trước',
    title: 'Chris',
  },
  {
    avatar: 'svg:avatar-4',
    content: `Đã đăng bài viết <a>Cách viết một plugin Vite</a> `,
    date: '2 ngày trước',
    title: 'Vben',
  },
  {
    avatar: 'svg:avatar-1',
    content: `Đã trả lời câu hỏi <a>Làm thế nào để tối ưu dự án?</a> của <a>Jack</a>`,
    date: '3 ngày trước',
    title: 'Pete',
  },
  {
    avatar: 'svg:avatar-2',
    content: `Đã đóng vấn đề <a>Cách chạy dự án</a> `,
    date: '1 tuần trước',
    title: 'Jack',
  },
  {
    avatar: 'svg:avatar-3',
    content: `Đã đăng <a>bài viết cá nhân</a> `,
    date: '1 tuần trước',
    title: 'William',
  },
  {
    avatar: 'svg:avatar-4',
    content: `Đã đẩy mã lên <a>Github</a>`,
    date: '2021-04-01 20:00',
    title: 'William',
  },
  {
    avatar: 'svg:avatar-4',
    content: `Đã đăng bài viết <a>Cách viết và sử dụng Admin Vben</a> `,
    date: '2021-03-01 20:00',
    title: 'Vben',
  },
];

const router = useRouter();

// Đây là một phương thức mẫu, trong dự án thực tế cần điều chỉnh theo tình hình thực tế
// This is a sample method, adjust according to the actual project requirements
function navTo(nav: WorkbenchProjectItem | WorkbenchQuickNavItem) {
  if (nav.url?.startsWith('http')) {
    openWindow(nav.url);
    return;
  }
  if (nav.url?.startsWith('/')) {
    router.push(nav.url).catch((error) => {
      console.error('Navigation failed:', error);
    });
  } else {
    console.warn(`Unknown URL for navigation item: ${nav.title} -> ${nav.url}`);
  }
}
</script>

<template>
  <div class="p-5">
    <WorkbenchHeader
      :avatar="userStore.userInfo?.avatar || preferences.app.defaultAvatar"
    >
      <template #title>
        Chào buổi sáng, {{ userStore.userInfo?.realName }}, bắt đầu một ngày làm
        việc của bạn nào!
      </template>
      <template #description> Hôm nay trời nắng, 20℃ - 32℃! </template>
    </WorkbenchHeader>

    <div class="mt-5 flex flex-col lg:flex-row">
      <div class="mr-4 w-full lg:w-3/5">
        <WorkbenchProject :items="projectItems" title="Dự án" @click="navTo" />
        <WorkbenchTrends
          :items="trendItems"
          class="mt-5"
          title="Hoạt động mới nhất"
        />
      </div>
      <div class="w-full lg:w-2/5">
        <WorkbenchQuickNav
          :items="quickNavItems"
          class="mt-5 lg:mt-0"
          title="Điều hướng nhanh"
          @click="navTo"
        />
        <WorkbenchTodo :items="todoItems" class="mt-5" title="Việc cần làm" />
        <AnalysisChartCard class="mt-5" title="Nguồn truy cập">
          <AnalyticsVisitsSource />
        </AnalysisChartCard>
      </div>
    </div>
  </div>
</template>
