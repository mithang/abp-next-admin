// Khai báo kiểu tối thiểu cho các module không kèm .d.ts (tránh TS7016/TS2307).
// File này cố tình KHÔNG có import/export ở cấp cao nhất: nó phải là file
// ambient (script) thì `declare module` mới áp dụng cho module chưa tồn tại;
// đặt các khai báo này trong global.d.ts (file module) sẽ bị xem là
// augmentation và bị bỏ qua. global.d.ts tham chiếu file này bằng
// `/// <reference path="./shims.d.ts" />`.
// vxe-pc-ui chỉ phát hành file .js cho các gói ngôn ngữ con; vue-simple-uploader
// cũng không kèm khai báo kiểu. Nội dung runtime không đổi.

declare module 'vxe-pc-ui/lib/language/en-US' {
  const messages: Record<string, unknown>;
  export default messages;
}

declare module 'vxe-pc-ui/lib/language/vi-VN' {
  const messages: Record<string, unknown>;
  export default messages;
}

declare module 'vxe-pc-ui/lib/language/zh-CN' {
  const messages: Record<string, unknown>;
  export default messages;
}

declare module 'vue-simple-uploader' {
  type VueComponent = import('vue').Component;
  interface VueSimpleUploader {
    Uploader: VueComponent;
    UploaderDrop: VueComponent;
    UploaderList: VueComponent;
    UploaderUnsupport: VueComponent;
  }
  const uploader: VueSimpleUploader;
  export default uploader;
}
