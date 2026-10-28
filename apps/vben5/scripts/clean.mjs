import { promises as fs } from 'node:fs';
import { join, normalize } from 'node:path';

const rootDir = process.cwd();

// Kiểm soát số lượng đồng thời, tránh tạo quá nhiều tác vụ đồng thời
const CONCURRENCY_LIMIT = 10;

// Thư mục cần bỏ qua, tránh đi vào các thư mục này để dọn dẹp
const SKIP_DIRS = new Set(['.DS_Store', '.git', '.idea', '.vscode']);

/**
 * Xử lý từng mục file/thư mục
 * @param {string} currentDir - Đường dẫn thư mục hiện tại
 * @param {string} item - Tên file/thư mục
 * @param {string[]} targets - Danh sách mục tiêu cần xóa
 * @param {number} _depth - Độ sâu đệ quy hiện tại
 * @returns {Promise<boolean>} - Có cần xử lý đệ quy tiếp hay không
 */
async function processItem(currentDir, item, targets, _depth) {
  // Bỏ qua thư mục đặc biệt
  if (SKIP_DIRS.has(item)) {
    return false;
  }

  try {
    const itemPath = normalize(join(currentDir, item));

    if (targets.includes(item)) {
      // Khi khớp với thư mục hoặc file mục tiêu thì xóa trực tiếp
      await fs.rm(itemPath, { force: true, recursive: true });
      console.log(`✅ Deleted: ${itemPath}`);
      return false; // Đã xóa, không cần đệ quy
    }

    // Dùng tùy chọn withFileTypes của readdir, tránh gọi lstat thêm
    return true; // Có thể cần đệ quy, do bên gọi quyết định
  } catch (error) {
    // Thông tin lỗi chi tiết hơn
    if (error.code === 'ENOENT') {
      // File không tồn tại, có thể đã bị xóa, đây là trường hợp bình thường
      return false;
    } else if (error.code === 'EPERM' || error.code === 'EACCES') {
      console.error(`❌ Permission denied: ${item} in ${currentDir}`);
    } else {
      console.error(
        `❌ Error handling item ${item} in ${currentDir}: ${error.message}`,
      );
    }
    return false;
  }
}

/**
 * Tìm và xóa đệ quy thư mục mục tiêu（phiên bản tối ưu đồng thời）
 * @param {string} currentDir - Đường dẫn thư mục đang duyệt hiện tại
 * @param {string[]} targets - Danh sách mục tiêu cần xóa
 * @param {number} depth - Độ sâu đệ quy hiện tại, tránh đệ quy quá sâu
 */
async function cleanTargetsRecursively(currentDir, targets, depth = 0) {
  // Giới hạn độ sâu đệ quy, tránh đệ quy vô hạn
  if (depth > 10) {
    console.warn(`Max recursion depth reached at: ${currentDir}`);
    return;
  }

  let dirents;
  try {
    // Dùng tùy chọn withFileTypes, lấy thông tin kiểu file một lần, tránh gọi lstat sau đó
    dirents = await fs.readdir(currentDir, { withFileTypes: true });
  } catch (error) {
    // Nếu không đọc được thư mục, có thể đã bị xóa hoặc không đủ quyền
    console.warn(`Cannot read directory ${currentDir}: ${error.message}`);
    return;
  }

  // Xử lý theo lô, kiểm soát số lượng đồng thời
  for (let i = 0; i < dirents.length; i += CONCURRENCY_LIMIT) {
    const batch = dirents.slice(i, i + CONCURRENCY_LIMIT);

    const tasks = batch.map(async (dirent) => {
      const item = dirent.name;
      const shouldRecurse = await processItem(currentDir, item, targets, depth);

      // Nếu là thư mục và chưa bị xóa thì xử lý đệ quy
      if (shouldRecurse && dirent.isDirectory()) {
        const itemPath = normalize(join(currentDir, item));
        return cleanTargetsRecursively(itemPath, targets, depth + 1);
      }

      return null;
    });

    // Thực thi đồng thời các tác vụ của lô hiện tại
    const results = await Promise.allSettled(tasks);

    // Kiểm tra có tác vụ nào thất bại hay không（tùy chọn: dùng để gỡ lỗi）
    const failedTasks = results.filter(
      (result) => result.status === 'rejected',
    );
    if (failedTasks.length > 0) {
      console.warn(
        `${failedTasks.length} tasks failed in batch starting at index ${i} in directory: ${currentDir}`,
      );
    }
  }
}

(async function startCleanup() {
  // Tên thư mục và file cần xóa
  const targets = ['node_modules', 'dist', '.turbo', 'dist.zip'];
  const deleteLockFile = process.argv.includes('--del-lock');
  const cleanupTargets = [...targets];

  if (deleteLockFile) {
    cleanupTargets.push('pnpm-lock.yaml');
  }

  console.log(
    `🚀 Starting cleanup of targets: ${cleanupTargets.join(', ')} from root: ${rootDir}`,
  );

  const startTime = Date.now();

  try {
    // Thống kê trước số lượng mục tiêu cần xóa
    console.log('📊 Scanning for cleanup targets...');

    await cleanTargetsRecursively(rootDir, cleanupTargets);

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    console.log(
      `✨ Cleanup process completed successfully in ${duration.toFixed(2)}s`,
    );
  } catch (error) {
    console.error(`💥 Unexpected error during cleanup: ${error.message}`);
    process.exit(1);
  }
})();
