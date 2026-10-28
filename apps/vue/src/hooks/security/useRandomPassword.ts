import { useSettings } from '/@/hooks/abp/useSettings';
/**
 * Trích từ https://www.html5tricks.com/demo/js-passwd-generator/index.html
 * Nếu xâm phạm bản quyền, vui lòng liên hệ để gỡ bỏ
 */
export function useRandomPassword() {
  const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol,
    defaultNumber: getRandomNumber,
  };

  function getRandomLower() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
  }

  function getRandomUpper() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
  }

  function getRandomNumber() {
    return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
  }

  function getRandomSymbol() {
    const symbols = '~!@#$%^&*()_+{}":?><;.,';
    return symbols[Math.floor(Math.random() * symbols.length)];
  }

  function generatePassword() {
    const { settingProvider } = useSettings();
    // Tạo mật khẩu ngẫu nhiên theo các tùy chọn cấu hình
    // Độ dài mật khẩu
    const length = settingProvider.getNumber('Abp.Identity.Password.RequiredLength');
    // Cần chữ thường
    const lower = settingProvider.isTrue('Abp.Identity.Password.RequireLowercase');
    // Cần chữ hoa
    const upper = settingProvider.isTrue('Abp.Identity.Password.RequireUppercase');
    // Cần chữ số
    const number = settingProvider.isTrue('Abp.Identity.Password.RequireDigit');
    // Cần ký tự đặc biệt
    const symbol = settingProvider.isTrue('Abp.Identity.Password.RequireNonAlphanumeric');
    // Mặc định tạo chữ số
    const defaultNumber = !lower && !upper && !number && !symbol;

    let generatedPassword = '';
    const typesArr = [{ lower }, { upper }, { number }, { symbol }, { defaultNumber }].filter(
      (item) => Object.values(item)[0],
    );
    for (let i = 0; i < length; i++) {
      typesArr.forEach((type) => {
        const funcName = Object.keys(type)[0];
        generatedPassword += randomFunc[funcName]();
      });
    }
    return generatedPassword.slice(0, length);
  }

  return { generatePassword };
}
