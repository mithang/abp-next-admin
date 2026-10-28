/**
 * Lấy giá trị tương ứng của loại theme, chế độ sáng/tối
 * @param darkModeVal Giá trị chế độ tối
 * @param themeMode Loại theme — giao diện (mặc định), nội dung, khối code
 */
 export const getTheme = (
  darkModeVal: 'light' | 'dark' | string,
  themeMode: 'default' | 'content' | 'code' = 'default',
) => {
  const isDark = darkModeVal === 'dark';
  switch (themeMode) {
    case 'default':
      return isDark ? 'dark' : 'classic';
    case 'content':
      return isDark ? 'dark' : 'light';
    case 'code':
      return isDark ? 'dracula' : 'github';
  }
};