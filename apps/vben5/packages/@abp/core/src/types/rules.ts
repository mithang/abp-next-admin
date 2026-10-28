import type {
  Field,
  FieldBeetWeen,
  FieldContains,
  FieldDefineValidator,
  FieldLength,
  FieldMatch,
  FieldRange,
  FieldRegular,
  FieldValidator,
  Rule,
} from './validations';

/** Trình tạo quy tắc */
interface RuleCreator {
  /** Trình xác thực tùy chỉnh */
  defineValidator(field: FieldDefineValidator): Rule[];
  /** input và value có khớp nhau hay không */
  doNotMatch(field: FieldMatch): Rule[];
  /** Trường {0} không phải là số thẻ tín dụng hợp lệ */
  fieldDoNotValidCreditCardNumber(field: Field): Rule[];
  /** Trường {0} không phải là địa chỉ email hợp lệ */
  fieldDoNotValidEmailAddress(field: Field): Rule[];
  /** Trường {0} không phải là URL http, https hoặc ftp đầy đủ hợp lệ. */
  fieldDoNotValidFullyQualifiedUrl(field: Field): Rule[];
  /** Trường {0} không phải là số điện thoại di động hợp lệ */
  fieldDoNotValidPhoneNumber(field: Field): Rule[];
  /** Trường có giá trị không hợp lệ */
  fieldInvalid(field: FieldValidator): Rule[];
  /** Xác thực không đạt */
  fieldIsNotValid(field: FieldValidator): Rule[];
  /** Giá trị trường {0} phải nằm trong khoảng từ {1} đến {2} */
  fieldMustBeetWeen(field: FieldBeetWeen): Rule[];
  /** Trường {0} phải là chuỗi hoặc mảng có độ dài tối đa là '{1}' */
  fieldMustBeStringOrArrayWithMaximumLength(field: FieldLength): Rule[];
  /** Trường {0} phải là chuỗi hoặc mảng có độ dài tối thiểu là '{1}' */
  fieldMustBeStringOrArrayWithMinimumLength(field: FieldLength): Rule[];
  /** Trường {0} phải là chuỗi có độ dài tối đa là {1} */
  fieldMustBeStringWithMaximumLength(field: FieldLength): Rule[];
  /** Trường {0} phải là chuỗi có độ dài tối thiểu là {2} và độ dài tối đa là {1} */
  fieldMustBeStringWithMinimumLengthAndMaximumLength(field: FieldRange): Rule[];
  /** Trường {0} không khớp với biểu thức chính quy */
  fieldMustMatchRegularExpression(field: FieldRegular): Rule[];
  /** Trường {0} chỉ cho phép các tệp có phần mở rộng sau: {1} */
  fieldOnlyAcceptsFilesExtensions(field: FieldContains): Rule[];
  /** Trường {0} không được để trống */
  fieldRequired(field: Field): Rule[];
  /** Lấy thông báo xác thực của một enum lỗi */
  mapEnumValidMessage(
    enumName: string,
    args?: any[] | Record<string, string> | undefined,
  ): string;
}

export type { RuleCreator };
