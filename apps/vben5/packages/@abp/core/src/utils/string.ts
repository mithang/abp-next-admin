/**
 *
 * @param str Chuỗi có rỗng hoặc chỉ chứa khoảng trắng hay không
 */
export function isNullOrWhiteSpace(str?: string) {
  return str === undefined || str === null || str === '' || str === ' ';
}

/**
 * Định dạng chuỗi
 * @param formatted Chuỗi cần xử lý
 * @param args Danh sách tham số, có thể là mảng hoặc đối tượng
 * @returns Trả về chuỗi đã định dạng
 * @example format('Hello, {0}!', ['World'])
 * @example format('Hello, {name}!', {name: 'World'})
 */
export function format(formatted: string, args: any[] | object) {
  if (Array.isArray(args)) {
    for (const [i, arg] of args.entries()) {
      const regexp = new RegExp(String.raw`\{` + i + String.raw`\}`, 'gi');
      formatted = formatted.replace(regexp, arg);
    }
  } else if (typeof args === 'object') {
    Object.keys(args).forEach((key) => {
      const regexp = new RegExp(String.raw`\{` + key + String.raw`\}`, 'gi');
      const param = (args as any)[key];
      formatted = formatted.replace(regexp, param);
    });
  }
  return formatted;
}

export function getUnique(val: string) {
  const arr = [...val];
  const newArr = [...new Set(arr)];
  return newArr.join('');
}
