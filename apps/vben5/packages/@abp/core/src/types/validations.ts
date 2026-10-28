type RuleType =
  | 'boolean'
  | 'date'
  | 'email'
  | 'enum'
  | 'float'
  | 'hex'
  | 'integer'
  | 'method'
  | 'number'
  | 'object'
  | 'regexp'
  | 'string'
  | 'url';

interface Rule {
  [key: string]: any;
  trigger?: 'blur' | 'change' | ['change', 'blur'];
  type?: 'array' | RuleType;
}

interface Field extends Rule {
  /** Ký tự nối
   * @description Ký tự nối dùng khi bản địa hóa tên trường
   * @example . => L('ResourceName.DisplayName.Field')
   * @example : => L('ResourceName.DisplayName:Field')
   */
  connector?: string;
  /** Tên trường */
  name?: string;
  /** Tiền tố trường
   * @description Dùng để bản địa hóa tên trường
   * @example DisplayName => L('ResourceName.DisplayName:Field')
   */
  prefix?: string;
  /** Tài nguyên bản địa hóa */
  resourceName?: string;
}

interface FieldRequired extends Field {
  /** Có bắt buộc hay không */
  required?: boolean;
}

interface FieldBeetWeen extends Field {
  /** Giá trị kết thúc */
  end: number;
  /** Giá trị bắt đầu */
  start: number;
}

interface FieldLength extends Field {
  /** Độ dài */
  length: number;
}

interface FieldRange extends Field {
  /** Giá trị số tối đa */
  maximum: number;
  /** Giá trị số tối thiểu */
  minimum: number;
}

interface FieldRegular extends Field {
  /** Biểu thức chính quy */
  expression: string;
}

interface FieldMatch extends FieldRequired {
  /** Trường đối chiếu */
  matchField: string;
  /** Giá trị trường đối chiếu */
  matchValue: string;
  /** Tên trường */
  name: string;
}

interface FieldContains extends Field {
  /** Giá trị cần xác thực có nằm trong các giá trị đã định nghĩa hay không */
  value: string;
}

interface FieldValidator extends FieldRequired {
  /** Trình xác thực giá trị có hợp lệ hay không */
  validator: (value: any) => boolean;
}

interface FieldDefineValidator extends FieldRequired {
  message?: string;
  validator: (
    rule: any,
    value: any,
    callback: any,
    source?: any,
    options?: any,
  ) => Promise<void> | void;
}

export type {
  Field,
  FieldBeetWeen,
  FieldContains,
  FieldDefineValidator,
  FieldLength,
  FieldMatch,
  FieldRange,
  FieldRegular,
  FieldRequired,
  FieldValidator,
  Rule,
  RuleType,
};
