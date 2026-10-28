import { formatDate, isNumber } from '@vben/utils';

/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs from 'dayjs';

const DATE_TIME_FORMAT: Format = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT: Format = 'YYYY-MM-DD';

type FormatDate = Date | dayjs.Dayjs | number | string;
type Format =
  | 'HH'
  | 'HH:mm'
  | 'HH:mm:ss'
  | 'YYYY'
  | 'YYYY-MM'
  | 'YYYY-MM-DD'
  | 'YYYY-MM-DD HH'
  | 'YYYY-MM-DD HH:mm'
  | 'YYYY-MM-DD HH:mm:ss'
  | (string & {});

/**
 * @zh_CN Định dạng thời gian
 * @param date thời gian cần định dạng
 * @param format chuỗi định dạng,tham khảo tài liệu dayJs
 * @returns Trả về chuỗi thời gian sau khi định dạng
 */
export function formatToDateTime(
  date?: FormatDate,
  format: Format = DATE_TIME_FORMAT,
): string {
  return formatDate(date, format);
}

/**
 * @zh_CN Định dạng ngày
 * @param date ngày cần định dạng
 * @param format chuỗi định dạng,tham khảo tài liệu dayJs
 * @returns Trả về chuỗi ngày sau khi định dạng
 */
export function formatToDate(
  date?: FormatDate,
  format: Format = DATE_FORMAT,
): string {
  if (isNumber(date)) {
    date *= 1000;
  }
  return formatDate(date, format);
}

/**
 * @zh_CN Chuyển đổi thành ngày
 * @param date ngày/chuỗi
 * @returns ngày
 */
export function toDate(date: dayjs.ConfigType): dayjs.Dayjs {
  return dayjs(date);
}

/**
 * @zh_CN Lấy ngày chỉ định
 * @param days số ngày
 * @returns Trả về ngày sau số ngày chỉ định
 */
export function getAppointDate(days: number): dayjs.Dayjs {
  const today = new Date(); // Lấy ngày hiện tại
  const tomorrow = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + days,
  );
  return dayjs(tomorrow);
}

/**
 * @zh_CN Lấy ngày đầu tiên của tuần này
 * @returns Trả về ngày đầu tiên của tuần này
 */
export function firstDayOfWeek(): dayjs.Dayjs {
  const now = new Date();
  const today = now.getDay();
  const dayOffset = today === 0 ? -6 : 1 - today;
  const monday = new Date(now);
  monday.setDate(now.getDate() + dayOffset);
  return dayjs(
    new Date(monday.getFullYear(), monday.getMonth(), monday.getDate()),
  );
}

/**
 * @zh_CN Lấy ngày cuối cùng của tuần này
 * @returns Trả về ngày cuối cùng của tuần này
 */
export function lastDayOfWeek(): dayjs.Dayjs {
  return firstDayOfWeek().add(6, 'day');
}

/**
 * @zh_CN Lấy ngày đầu tiên của tháng này
 * @returns Trả về ngày đầu tiên của tháng này
 */
export function firstDayOfMonth(): dayjs.Dayjs {
  const now = new Date();
  return dayjs(new Date(now.getFullYear(), now.getMonth(), 1));
}

/**
 * @zh_CN Lấy ngày cuối cùng của tháng này00:00:00
 * @returns Trả về ngày cuối cùng của tháng này00:00:00
 */
export function lastDayOfMonth(): dayjs.Dayjs {
  const now = new Date();
  return dayjs(new Date(now.getFullYear(), now.getMonth() + 1, 0));
}

/**
 * @zh_CN Lấy ngày cuối cùng của tháng này23:59:59
 * @returns Trả về ngày cuối cùng của tháng này23:59:59
 */
export function lastDateOfMonth(): dayjs.Dayjs {
  const now = new Date();
  return dayjs(
    new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
  );
}

/**
 * @zh_CN Lấy ngày đầu tiên của tháng trước
 * @returns Trả về ngày đầu tiên của tháng trước
 */
export function firstDayOfLastMonth(): dayjs.Dayjs {
  const now = new Date();
  return dayjs(new Date(now.getFullYear(), now.getMonth() - 1, 1));
}

/**
 * @zh_CN Lấy ngày cuối cùng của tháng trước23:59:59
 * @returns Trả về ngày cuối cùng của tháng trước23:59:59
 */
export function lastDateOfLastMonth(): dayjs.Dayjs {
  const now = new Date();
  return dayjs(
    new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999), // ngày thứ 0 của tháng này = ngày cuối cùng của tháng trước
  );
}

/**
 * @zh_CN Lấy ngày đầu tiên của năm này
 * @returns Trả về ngày đầu tiên của năm này
 */
export function firstDayOfYear(): dayjs.Dayjs {
  const now = new Date();
  return dayjs(new Date(now.getFullYear(), 0, 1));
}

/**
 * @zh_CN Lấy ngày cuối cùng của năm này
 * @returns Trả về ngày cuối cùng của năm này
 */
export function lastDayOfYear(): dayjs.Dayjs {
  const now = new Date();
  return dayjs(new Date(now.getFullYear(), 11, 31));
}

/**
 * @zh_CN Lấy ngày đầu tiên của nửa năm gần nhất
 * @returns Trả về ngày đầu tiên của nửa năm gần nhất
 */
export function firstDayOfLastHalfYear(): dayjs.Dayjs {
  const now = new Date();
  return dayjs(new Date(now.getFullYear(), now.getMonth() - 6, 1));
}

/**
 * @zh_CN Lấy ngày đầu tiên của quý này
 * @returns Trả về ngày đầu tiên của quý này
 */
export function firstDayOfQuarter(): dayjs.Dayjs {
  const now = new Date();
  const quarter = Math.floor(now.getMonth() / 3) + 1;
  return dayjs(new Date(now.getFullYear(), (quarter - 1) * 3, 1));
}

/**
 * @zh_CN Lấy ngày cuối cùng của quý này
 * @returns Trả về ngày cuối cùng của quý này
 */
export function lastDayOfQuarter(): dayjs.Dayjs {
  const now = new Date();
  const quarter = Math.floor(now.getMonth() / 3) + 1;
  return dayjs(new Date(now.getFullYear(), quarter * 3, 0));
}

export const dateUtil = dayjs;
