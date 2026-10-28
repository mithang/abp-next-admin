import { RuleType } from 'ant-design-vue/lib/form/interface';

interface IRule {
  type?: RuleType | 'array';
  trigger?: 'blur' | 'change' | ['change', 'blur'];
}

export interface IField extends IRule {
  /** Tên trường */
  name?: string;
  /** Tiền tố trường
   * @description Dùng để bản địa hóa tên trường
   * @example DisplayName => L('ResourceName.DisplayName:Field')
   */
  prefix?: string;
  /** Ký tự nối
   * @description Ký tự nối dùng khi bản địa hóa tên trường
   * @example . => L('ResourceName.DisplayName.Field')
   * @example : => L('ResourceName.DisplayName:Field')
   */
  connector?: string;
  /** Tài nguyên bản địa hóa */
  resourceName?: string;
}

export interface IFieldRequired extends IField {
  /** Có bắt buộc hay không */
  required?: boolean;
}

export interface IFieldBeetWeen extends IField {
  /** Giá trị bắt đầu */
  start: number;
  /** Giá trị kết thúc */
  end: number;
}

export interface IFieldLength extends IField {
  /** Độ dài */
  length: number;
}

export interface IFieldRange extends IField {
  /** Giá trị số tối thiểu */
  minimum: number;
  /** Giá trị số tối đa */
  maximum: number;
}

export interface IFieldRegular extends IField {
  /** Biểu thức chính quy */
  expression: string;
}

export interface IFieldMatch extends IFieldRequired {
  /** Tên trường */
  name: string;
  /** Trường đối chiếu */
  matchField: string;
  /** Giá trị trường đối chiếu */
  matchValue: string;
}

export interface IFieldContains extends IField {
  /** Giá trị cần kiểm tra có nằm trong các giá trị đã định nghĩa hay không */
  value: string;
}

export interface IFieldValidator extends IFieldRequired {
  /** Bộ kiểm tra giá trị có hợp lệ hay không */
  validator: (value: any) => boolean;
}

export interface IDefineFieldValidator extends IFieldRequired {
  message?: string;
  validator: (rule: any, value: any, callback: any, source?: any, options?: any) => Promise<void> | void;
}
