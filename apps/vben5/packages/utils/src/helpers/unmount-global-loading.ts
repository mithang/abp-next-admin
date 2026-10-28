/**
 * Gỡ bỏ và hủy loading
 * Đặt ở đây thay vì trong thẻ app của index.html, vì như vậy sẽ ít gượng gạo hơn, kết xuất quá nhanh có thể gây nhấp nháy
 * Cải thiện trải nghiệm bằng cách thêm animation css để ẩn trước, sau khi animation kết thúc mới gỡ nút loading
 * Điểm chưa tốt là sẽ tăng thêm một ít lượng code
 * Loading tùy chỉnh xem tại: https://doc.vben.pro/guide/in-depth/loading.html
 */
export function unmountGlobalLoading() {
  // Tìm phần tử loading toàn cục
  const loadingElement = document.querySelector('#__app-loading__');

  if (loadingElement) {
    // Thêm class ẩn, kích hoạt animation chuyển đổi
    loadingElement.classList.add('hidden');

    // Tìm tất cả các phần tử loading được chèn cần gỡ bỏ
    const injectLoadingElements = document.querySelectorAll(
      '[data-app-loading^="inject"]',
    );

    // Khi animation chuyển đổi kết thúc, gỡ phần tử loading và tất cả các phần tử loading được chèn
    loadingElement.addEventListener(
      'transitionend',
      () => {
        loadingElement.remove(); // Gỡ phần tử loading
        injectLoadingElements.forEach((el) => el.remove()); // Gỡ tất cả các phần tử loading được chèn
      },
      { once: true },
    ); // Đảm bảo sự kiện chỉ kích hoạt một lần
  }
}
