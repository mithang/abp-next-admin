import type { Recordable } from '@vben/types';

/**
 * Một đối tượng bộ nhớ đệm, khi không tải lại trang thì không cần yêu cầu lặp lại tới API từ xa
 */
export const ICONS_MAP: Recordable<string[]> = {};

interface IconifyResponse {
  prefix: string;
  total: number;
  title: string;
  uncategorized?: string[];
  categories?: Recordable<string[]>;
  aliases?: Recordable<string>;
}

const PENDING_REQUESTS: Recordable<Promise<string[]>> = {};

/**
 * Lấy dữ liệu bộ biểu tượng qua API Iconify.
 * Khi nhiều bộ chọn biểu tượng cùng yêu cầu một bộ biểu tượng cùng lúc, thực tế chỉ gửi một yêu cầu duy nhất (mọi yêu cầu dùng chung một kết quả).
 * Kết quả yêu cầu sẽ được lưu vào bộ nhớ đệm, trước khi tải lại trang thì cùng một bộ biểu tượng sẽ không được yêu cầu lại
 * @param prefix Tên bộ biểu tượng
 * @returns Tất cả tên biểu tượng có trong bộ biểu tượng
 */
export async function fetchIconsData(prefix: string): Promise<string[]> {
  if (Reflect.has(ICONS_MAP, prefix) && ICONS_MAP[prefix]) {
    return ICONS_MAP[prefix];
  }
  if (Reflect.has(PENDING_REQUESTS, prefix) && PENDING_REQUESTS[prefix]) {
    return PENDING_REQUESTS[prefix];
  }
  PENDING_REQUESTS[prefix] = (async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000 * 10);
      const response: IconifyResponse = await fetch(
        `https://api.iconify.design/collection?prefix=${prefix}`,
        { signal: controller.signal },
      ).then((res) => res.json());
      clearTimeout(timeoutId);
      const list = response.uncategorized || [];
      if (response.categories) {
        for (const category in response.categories) {
          list.push(...(response.categories[category] || []));
        }
      }
      ICONS_MAP[prefix] = list.map((v) => `${prefix}:${v}`);
    } catch (error) {
      console.error(`Failed to fetch icons for prefix ${prefix}:`, error);
      return [] as string[];
    }
    return ICONS_MAP[prefix];
  })();
  return PENDING_REQUESTS[prefix];
}
