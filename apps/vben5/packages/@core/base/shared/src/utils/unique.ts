/**
 * Khử trùng lặp mảng đối tượng theo trường chỉ định
 * @param arr Mảng đối tượng cần khử trùng lặp
 * @param key Tên trường dùng làm căn cứ khử trùng lặp
 * @returns Mảng đối tượng sau khi khử trùng lặp
 */
function uniqueByField<T>(arr: T[], key: keyof T): T[] {
  const seen = new Map<any, T>();
  return arr.filter((item) => {
    const value = item[key];
    return seen.has(value) ? false : (seen.set(value, item), true);
  });
}

export { uniqueByField };
