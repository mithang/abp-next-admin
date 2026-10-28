// import { VueConstructor } from 'vue';
import { IVFormComponent, IFormConfig, IValidationRule } from '../typings/v-form-component';
import { cloneDeep, isArray, isFunction, isNumber, uniqueId } from 'lodash-es';
// import { del } from '@vue/composition-api';
// import { withInstall } from '/@/utils';

/**
 * Phương thức install của component
 * @param comp Component cần gắn phương thức install
 */
// export function withInstall<T extends { name: string }>(comp: T) {
//   return Object.assign(comp, {
//     install(Vue: VueConstructor) {
//       Vue.component(comp.name, comp);
//     },
//   });
// }

/**
 * Tạo key
 * @param [formItem] Control cần tạo key, tùy chọn, nếu không truyền thì mặc định trả về một key duy nhất
 * @returns {string|boolean} Trả về một id duy nhất hoặc false
 */
export function generateKey(formItem?: IVFormComponent): string | boolean {
  if (formItem && formItem.component) {
    const key = uniqueId(`${toLine(formItem.component)}_`);
    formItem.key = key;
    formItem.field = key;

    return true;
  }
  return uniqueId('key_');
}

/**
 * Xóa phần tử chỉ định trong mảng, value có thể là một chỉ số dạng số, cũng có thể là một hàm, xóa phần tử đầu tiên mà hàm trả về true
 * @param array {Array<T>} Mảng cần xóa phần tử
 * @param value {number | ((item: T, index: number, array: Array<T>) => boolean}
 * @returns {T} Trả về mục mảng đã xóa
 */
export function remove<T>(
  array: Array<T>,
  value: number | ((item: T, index: number, array: Array<T>) => boolean),
): T | undefined {
  let removeVal: Array<T | undefined> = [];
  if (!isArray(array)) return undefined;
  if (isNumber(value)) {
    removeVal = array.splice(value, 1);
  } else {
    const index = array.findIndex(value);
    if (index !== -1) {
      removeVal = array.splice(index, 1);
    }
  }
  return removeVal.shift();
}

/**
 * Xác định kiểu dữ liệu
 * @param value
 */
export function getType(value: any): string {
  return Object.prototype.toString.call(value).slice(8, -1);
}

/**
 * Tạo guid duy nhất
 * @returns {String} Định danh id duy nhất
 */
export function randomUUID(): string {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4() + S4() + S4()}`;
}

/**
 * Chuyển camelCase thành snake_case
 * @param str
 */
export function toLine(str: string) {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

/**
 * Duyệt qua các mục form
 * @param array
 * @param cb
 */
export function formItemsForEach(array: IVFormComponent[], cb: (item: IVFormComponent) => void) {
  if (!isArray(array)) return;
  const traverse = (schemas: IVFormComponent[]) => {
    schemas.forEach((formItem: IVFormComponent) => {
      if (['Grid'].includes(formItem.component)) {
        // Bố cục lưới
        formItem.columns?.forEach((item) => traverse(item.children));
      } else {
        cb(formItem);
      }
    });
  };
  traverse(array);
}

/**
 * Tìm mục form
 */
export const findFormItem: (
  schemas: IVFormComponent[],
  cb: (formItem: IVFormComponent) => boolean,
) => IVFormComponent | undefined = (schemas, cb) => {
  let res;
  const traverse = (schemas: IVFormComponent[]): boolean => {
    return schemas.some((formItem: IVFormComponent) => {
      const { component: type } = formItem;
      // Xử lý lưới
      if (['Grid'].includes(type)) {
        return formItem.columns?.some((item) => traverse(item.children));
      }
      if (cb(formItem)) res = formItem;
      return cb(formItem);
    });
  };
  traverse(schemas);
  return res;
};

/**
 * Xóa thuộc tính của mục hiện tại khi mở hộp thoại json
 * @param formConfig {IFormConfig}
 * @returns {IFormConfig}
 */
export const removeAttrs = (formConfig: IFormConfig): IFormConfig => {
  const copyFormConfig = cloneDeep(formConfig);
  delete copyFormConfig.currentItem;
  delete copyFormConfig.activeKey;
  copyFormConfig.schemas &&
    formItemsForEach(copyFormConfig.schemas, (item) => {
      delete item.icon;
      delete item.key;
    });
  return copyFormConfig;
};

/**
 * Xử lý thuộc tính tùy chọn bất đồng bộ, ví dụ các thuộc tính tùy chọn như select, treeSelect nếu được truyền dưới dạng hàm và trả về đối tượng Promise, thì lấy thuộc tính tùy chọn trả về một cách bất đồng bộ
 * @param {(() => Promise<any[]>) | any[]} options
 * @return {Promise<any[]>}
 */
export const handleAsyncOptions = async (
  options: (() => Promise<any[]>) | any[],
): Promise<any[]> => {
  try {
    if (isFunction(options)) return await options();
    return options;
  } catch {
    return [];
  }
};

/**
 * Định dạng cấu hình quy tắc kiểm tra của mục form
 * @param {IVFormComponent[]} schemas
 */
export const formatRules = (schemas: IVFormComponent[]) => {
  formItemsForEach(schemas, (item) => {
    if ('required' in item) {
      !isArray(item.rules) && (item.rules = []);
      item.rules.push({ required: true, message: item.message });
      delete item['required'];
      delete item['message'];
    }
  });
};

/**
 * Chuyển chuỗi regex trong quy tắc kiểm tra thành đối tượng regex
 * @param {IValidationRule[]} rules
 * @return {IValidationRule[]}
 */
export const strToReg = (rules: IValidationRule[]) => {
  const newRules = cloneDeep(rules);
  return newRules.map((item) => {
    if (item.pattern) item.pattern = runCode(item.pattern);
    return item;
  });
};

/**
 * Thực thi một đoạn mã dạng chuỗi và trả về kết quả thực thi, nếu thực thi lỗi thì trả về chính tham số đó
 * @param code
 * @return {any}
 */
export const runCode = <T>(code: any): T => {
  try {
    return new Function(`return ${code}`)();
  } catch {
    return code;
  }
};