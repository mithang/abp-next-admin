/**
 * Viết hoa chữ cái đầu của chuỗi
 * @param string
 */
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Chuyển chữ cái đầu của chuỗi thành chữ thường.
 *
 * @param str Chuỗi cần chuyển đổi
 * @returns Chuỗi có chữ cái đầu viết thường
 */
function toLowerCaseFirstLetter(str: string): string {
  if (!str) return str; // Nếu chuỗi rỗng, trả về trực tiếp
  return str.charAt(0).toLowerCase() + str.slice(1);
}

/**
 *  Tạo tên khóa theo quy tắc camelCase
 * @param key
 * @param parentKey
 */
function toCamelCase(key: string, parentKey: string): string {
  if (!parentKey) {
    return key;
  }
  return parentKey + key.charAt(0).toUpperCase() + key.slice(1);
}

function kebabToCamelCase(str: string): string {
  return str
    .split('-')
    .filter(Boolean)
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join('');
}

export {
  capitalizeFirstLetter,
  kebabToCamelCase,
  toCamelCase,
  toLowerCaseFirstLetter,
};
