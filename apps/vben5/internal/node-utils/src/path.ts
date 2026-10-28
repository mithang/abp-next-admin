import { posix } from 'node:path';

/**
 * Chuyển đổi đường dẫn tệp đã cho sang phong cách POSIX.
 * @param {string} pathname - Đường dẫn tệp gốc.
 */
function toPosixPath(pathname: string) {
  return pathname.split(`\\`).join(posix.sep);
}

export { toPosixPath };
