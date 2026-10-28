import { useSettings } from '@abp/core';

/**
 * Trích từ https://www.html5tricks.com/demo/js-passwd-generator/index.html
 * Nếu xâm phạm bản quyền, vui lòng liên hệ để gỡ bỏ
 */
export function useRandomPassword() {
  const randomFunc: { [key: string]: () => string } = {
    defaultNumber: getRandomNumber,
    lower: getRandomLower,
    number: getRandomNumber,
    symbol: getRandomSymbol,
    upper: getRandomUpper,
  };

  function getRandomLower() {
    return String.fromCodePoint(Math.floor(Math.random() * 26) + 97);
  }

  function getRandomUpper() {
    return String.fromCodePoint(Math.floor(Math.random() * 26) + 65);
  }

  function getRandomNumber() {
    return String.fromCodePoint(Math.floor(Math.random() * 10) + 48);
  }

  function getRandomSymbol() {
    const symbols = '~!@#$%^&*()_+{}":?><;.,';
    return symbols[Math.floor(Math.random() * symbols.length)] ?? '';
  }

  function generatePassword() {
    const { getNumber, isTrue } = useSettings();
    // Tạo mật khẩu ngẫu nhiên theo các tùy chọn cấu hình
    // Độ dài mật khẩu
    const length = getNumber('Abp.Identity.Password.RequiredLength');
    // Cần chữ thường
    const lower = isTrue('Abp.Identity.Password.RequireLowercase');
    // Cần chữ hoa
    const upper = isTrue('Abp.Identity.Password.RequireUppercase');
    // Cần chữ số
    const number = isTrue('Abp.Identity.Password.RequireDigit');
    // Cần ký tự đặc biệt
    const symbol = isTrue('Abp.Identity.Password.RequireNonAlphanumeric');
    // Mặc định tạo chữ số
    const defaultNumber = !lower && !upper && !number && !symbol;

    let generatedPassword = '';
    const typesArr = [
      { lower },
      { upper },
      { number },
      { symbol },
      { defaultNumber },
    ].filter((item) => Object.values(item)[0]);
    for (let i = 0; i < length; i++) {
      typesArr.forEach((type) => {
        const funcName = Object.keys(type)[0];
        if (funcName && randomFunc[funcName]) {
          generatedPassword += randomFunc[funcName]();
        }
      });
    }
    return generatedPassword.slice(0, length);
  }

  return { generatePassword };
}
