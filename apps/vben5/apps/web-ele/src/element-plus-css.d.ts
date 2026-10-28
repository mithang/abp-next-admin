// Khai báo kiểu cho các import CSS phụ của element-plus trong
// src/adapter/component/index.ts (import('element-plus/es/components/*/style/css')).
// Đây là import side-effect chỉ để nạp CSS khi load async component; element-plus
// không kèm .d.ts cho các module style con này nên vue-tsc báo TS7016.
// File này cố tình KHÔNG có import/export ở cấp cao nhất để là file ambient
// (xem bài học shims.d.ts ở QG10: declare module trong file module bị bỏ qua).
// Không đổi runtime.

declare module 'element-plus/es/components/*/style/css';
