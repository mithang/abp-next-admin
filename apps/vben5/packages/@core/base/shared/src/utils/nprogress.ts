import type NProgress from 'nprogress';

// Tạo một biến cho instance NProgress, giá trị ban đầu là null
let nProgressInstance: null | typeof NProgress = null;

/**
 * Tải động thư viện NProgress và cấu hình.
 * Hàm này trước tiên kiểm tra xem thư viện NProgress đã được tải hay chưa, nếu đã tải thì trả về trực tiếp instance NProgress.
 * Ngược lại, import động thư viện NProgress, cấu hình rồi trả về instance NProgress.
 *
 * @returns  Đối tượng Promise của instance NProgress.
 */
async function loadNprogress() {
  if (nProgressInstance) {
    return nProgressInstance;
  }
  nProgressInstance = await import('nprogress');
  nProgressInstance.configure({
    showSpinner: true,
    speed: 300,
  });
  return nProgressInstance;
}

/**
 * Bắt đầu hiển thị thanh tiến trình.
 * Hàm này trước tiên tải thư viện NProgress, sau đó gọi phương thức start của NProgress để bắt đầu hiển thị thanh tiến trình.
 */
async function startProgress() {
  const nprogress = await loadNprogress();
  nprogress?.start();
}

/**
 * Dừng hiển thị thanh tiến trình và ẩn thanh tiến trình.
 * Hàm này trước tiên tải thư viện NProgress, sau đó gọi phương thức done của NProgress để dừng và ẩn thanh tiến trình.
 */
async function stopProgress() {
  const nprogress = await loadNprogress();
  nprogress?.done();
}

export { startProgress, stopProgress };
