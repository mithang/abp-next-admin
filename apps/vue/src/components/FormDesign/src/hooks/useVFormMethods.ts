import { Ref, SetupContext } from 'vue';
import { IVFormComponent, IFormConfig, AForm } from '../typings/v-form-component';
import { findFormItem, formItemsForEach } from '../utils';
import { cloneDeep, isFunction } from 'lodash-es';
import { IAnyObject } from '../typings/base-type';

interface IFormInstanceMethods extends AForm {
  submit: () => Promise<any>;
}

export interface IProps {
  formConfig: IFormConfig;
  formModel: IAnyObject;
}

type ISet = <T extends keyof IVFormComponent>(
  field: string,
  key: T,
  value: IVFormComponent[T],
) => void;
// Lấy mục form mà field hiện tại liên kết
type IGet = (field: string) => IVFormComponent | undefined;
// Lấy giá trị của field trong formData
type IGetValue = (field: string) => any;
// Đặt giá trị của field trong formData và kích hoạt kiểm tra
type ISetValue = (field: string | IAnyObject, value?: any) => void;
// Ẩn mục form tương ứng với field
type IHidden = (field: string) => void;
// Hiển thị mục form tương ứng với field
type IShow = (field: string) => void;
// Đặt thuộc tính props mà mục form tương ứng với field liên kết
type ISetProps = (field: string, key: string, value: any) => void;
// Lấy giá trị trong formData
type IGetData = () => Promise<IAnyObject>;
// Vô hiệu hóa form, nếu field trống thì vô hiệu hóa toàn bộ form
type IDisable = (field?: string | boolean) => void;
// Phương thức đặt cấu hình form
type ISetFormConfig = (key: string, value: any) => void;
interface ILinkOn {
  [key: string]: Set<IVFormComponent>;
}

export interface IVFormMethods extends Partial<IFormInstanceMethods> {
  set: ISet;
  get: IGet;
  getValue: IGetValue;
  setValue: ISetValue;
  hidden: IHidden;
  show: IShow;
  setProps: ISetProps;
  linkOn: ILinkOn;
  getData: IGetData;
  disable: IDisable;
}
export function useVFormMethods(
  props: IProps,
  _context: Partial<SetupContext>,
  formInstance: Ref<AForm | null>,
  formInstanceMethods: Partial<IFormInstanceMethods>,
): IVFormMethods {
  /**
   * Lấy mục form theo field
   * @param {string} field
   * @return {IVFormComponent | undefined}
   */
  const get: IGet = (field) =>
    findFormItem(props.formConfig.schemas, (item) => item.field === field);

  /**
   * Đặt giá trị trường của mục form theo field của form
   * @param {string} field
   * @param {keyof IVFormComponent} key
   * @param {never} value
   */
  const set: ISet = (field, key, value) => {
    const formItem = get(field);
    if (formItem) formItem[key] = value;
  };

  /**
   * Đặt props của mục form
   * @param {string} field field của mục form cần đặt
   * @param {string} key key cần đặt
   * @param value giá trị cần đặt
   */
  const setProps: ISetProps = (field, key, value) => {
    const formItem = get(field);
    if (formItem?.componentProps) {
      ['options', 'treeData'].includes(key) && setValue(field, undefined);

      formItem.componentProps[key] = value;
    }
  };
  /**
   * Đặt giá trị của trường, sau khi đặt sẽ kích hoạt kiểm tra
   * @param {string} field  trường cần đặt
   * @param value  giá trị cần đặt
   */
  const setValue: ISetValue = (field, value) => {
    if (typeof field === 'string') {
      // props.formData[field] = value
      props.formModel[field] = value;
      formInstance.value?.validateField(field, value, []);
    } else {
      const keys = Object.keys(field);
      keys.forEach((key) => {
        props.formModel[key] = field[key];
        formInstance.value?.validateField(key, field[key], []);
      });
    }
  };
  /**
   * Phương thức đặt cấu hình form
   * @param {string} key
   * @param value
   */
  const setFormConfig: ISetFormConfig = (key, value) => {
    props.formConfig[key] = value;
  };
  /**
   * Lấy giá trị trường theo field của mục form, nếu field trống thì
   * @param {string} field  trường cần đặt
   */
  const getValue: IGetValue = (field) => {
    const formData = cloneDeep(props.formModel);
    return formData[field];
  };

  /**
   * Lấy giá trị trong formData
   * @return {Promise<IAnyObject<any>>}
   */
  const getData: IGetData = async () => {
    return cloneDeep(props.formModel);
  };
  /**
   * Ẩn mục form được chỉ định
   * @param {string} field field của mục form cần ẩn
   */
  const hidden: IHidden = (field) => {
    set(field, 'hidden', true);
  };

  /**
   * Vô hiệu hóa form
   * @param {string | undefined} field
   */
  const disable: IDisable = (field) => {
    typeof field === 'string'
      ? setProps(field, 'disabled', true)
      : setFormConfig('disabled', field !== false);
  };

  /**
   * Hiển thị mục form
   * @param {string} field field của mục form cần hiển thị
   */
  const show: IShow = (field) => {
    set(field, 'hidden', false);
  };

  /**
   * Kích hoạt khi lắng nghe liên động giữa các trường của form
   * @type {ILinkOn}
   */
  const linkOn: ILinkOn = {};
  const initLink = (schemas: IVFormComponent[]) => {
    // Lần duyệt đầu tiên, tìm form có trường cần liên kết
    formItemsForEach(schemas, (formItem) => {
      // Nếu cần liên kết, tiến hành duyệt lớp thứ hai, tìm các trường liên kết trong form và lưu vào Set
      formItemsForEach(schemas, (item) => {
        if (!linkOn[item.field!]) linkOn[item.field!] = new Set<IVFormComponent>();
        if (formItem.link?.includes(item.field!) && isFunction(formItem.update)) {
          linkOn[item.field!].add(formItem);
        }
      });
      linkOn[formItem.field!].add(formItem);
    });
  };
  initLink(props.formConfig.schemas);

  return {
    linkOn,
    setValue,
    getValue,
    hidden,
    show,
    set,
    get,
    setProps,
    getData,
    disable,
    ...formInstanceMethods,
  };
}