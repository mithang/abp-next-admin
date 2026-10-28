/**
 * Định dạng chuỗi
 * @param formatted Chuỗi cần xử lý
 * @param args Danh sách tham số, có thể là mảng hoặc đối tượng
 * @returns Trả về chuỗi đã định dạng
 * @example format('Hello, {0}!', ['World'])
 * @example format('Hello, {name}!', {name: 'World'})
 */
export function format(formatted: string, args: object | any[]) {
  if (Array.isArray(args)) {
    for (let i = 0; i < args.length; i++) {
      const regexp = new RegExp('\\{' + i + '\\}', 'gi');
      formatted = formatted.replace(regexp, args[i]);
    }
  } else if (typeof args === 'object') {
    Object.keys(args).forEach((key) => {
      const regexp = new RegExp('\\{' + key + '\\}', 'gi');
      formatted = formatted.replace(regexp, args[key]);
    });
  }
  return formatted;
}
/**
 * Chuyển chuỗi sang định dạng camelCase
 * @param str Chuỗi
 * @returns Dạng camelCase của chuỗi
 * @example toCamelCase('hello-world')  =>  helloWorld
 * @example toCamelCase('my_variable_name')  =>  myVariableName
 */
export function toCamelCase(str: string) {
  return str.replace(/[-_\s](\w)/g, function (_, c) {
      return c ? c.toUpperCase() : '';
  });
}
/**
 *
 * @param str Chuỗi có rỗng hoặc chỉ chứa khoảng trắng hay không
 * @returns
 */
export function isNullOrWhiteSpace(str?: string) {
  return str === undefined || str === null || str === '' || str === ' ';
}

export function tryToJson(str: string | undefined) {
  if (!str || str.length === 0) return {};
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}

export function getUnique(val: string) {
  const arr = val.split('');
  const newArr = [...new Set(arr)];
  return newArr.join('');
}
