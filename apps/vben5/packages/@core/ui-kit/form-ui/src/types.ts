import type { FieldOptions, FormContext, GenericObject } from 'vee-validate';
import type { ZodTypeAny } from 'zod';

import type { Component, HtmlHTMLAttributes, Ref } from 'vue';

import type { VbenButtonProps } from '@vben-core/shadcn-ui';
import type { ClassType, MaybeComputedRef } from '@vben-core/typings';

import type { FormApi } from './form-api';

export type FormLayout = 'horizontal' | 'inline' | 'vertical';

export type BaseFormComponentType =
  | 'DefaultButton'
  | 'PrimaryButton'
  | 'VbenCheckbox'
  | 'VbenInput'
  | 'VbenInputPassword'
  | 'VbenPinInput'
  | 'VbenSelect'
  | (Record<never, never> & string);

type Breakpoints = '2xl:' | '3xl:' | '' | 'lg:' | 'md:' | 'sm:' | 'xl:';

type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export type WrapperClassType =
  `${Breakpoints}grid-cols-${GridCols}` | (Record<never, never> & string);

export type FormItemClassType =
  | `${Breakpoints}cols-end-${'auto' | GridCols}`
  | `${Breakpoints}cols-span-${'auto' | 'full' | GridCols}`
  | `${Breakpoints}cols-start-${'auto' | GridCols}`
  | (Record<never, never> & string)
  | WrapperClassType;

export type FormFieldOptions = Partial<
  FieldOptions & {
    validateOnBlur?: boolean;
    validateOnChange?: boolean;
    validateOnInput?: boolean;
    validateOnModelUpdate?: boolean;
  }
>;

export interface FormShape {
  /** Giá trị mặc định */
  default?: any;
  /** Tên trường */
  fieldName: string;
  /** Có bắt buộc hay không */
  required?: boolean;
  rules?: ZodTypeAny;
}

export type MaybeComponentPropKey =
  | 'options'
  | 'placeholder'
  | 'title'
  | keyof HtmlHTMLAttributes
  | (Record<never, never> & string);

export type MaybeComponentProps = { [K in MaybeComponentPropKey]?: any };

export type FormActions = FormContext<GenericObject>;

export type CustomRenderType = (() => Component | string) | string;

export type FormSchemaRuleType =
  | 'required'
  | 'selectRequired'
  | null
  | (Record<never, never> & string)
  | ZodTypeAny;

type FormItemDependenciesCondition<T = boolean | PromiseLike<boolean>> = (
  value: Partial<Record<string, any>>,
  actions: FormActions,
) => T;

type FormItemDependenciesConditionWithRules = (
  value: Partial<Record<string, any>>,
  actions: FormActions,
) => FormSchemaRuleType | PromiseLike<FormSchemaRuleType>;

type FormItemDependenciesConditionWithProps = (
  value: Partial<Record<string, any>>,
  actions: FormActions,
) => MaybeComponentProps | PromiseLike<MaybeComponentProps>;

export interface FormItemDependencies {
  /**
   * Tham số của component
   * @returns Tham số của component
   */
  componentProps?: FormItemDependenciesConditionWithProps;
  /**
   * Có bị vô hiệu hoá hay không
   * @returns Có bị vô hiệu hoá hay không
   */
  disabled?: boolean | FormItemDependenciesCondition;
  /**
   * Có render hay không (xoá DOM)
   * @returns Có render hay không
   */
  if?: boolean | FormItemDependenciesCondition;
  /**
   * Có bắt buộc hay không
   * @returns Có bắt buộc hay không
   */
  required?: FormItemDependenciesCondition;
  /**
   * Quy tắc của trường
   */
  rules?: FormItemDependenciesConditionWithRules;
  /**
   * Có ẩn hay không (CSS)
   * @returns Có ẩn hay không
   */
  show?: boolean | FormItemDependenciesCondition;
  /**
   * Bất kỳ trigger nào cũng sẽ thực thi
   */
  trigger?: FormItemDependenciesCondition<void>;
  /**
   * Trường kích hoạt
   */
  triggerFields: string[];
}

type ComponentProps =
  | ((
      value: Partial<Record<string, any>>,
      actions: FormActions,
    ) => MaybeComponentProps)
  | MaybeComponentProps;

export interface FormCommonConfig {
  /**
   * Hiển thị dấu hai chấm sau Label
   */
  colon?: boolean;
  /**
   * Props của tất cả các mục form
   */
  componentProps?: ComponentProps;
  /**
   * Kiểu của control cho tất cả các mục form
   */
  controlClass?: string;
  /**
   * Trạng thái vô hiệu hoá của tất cả các mục form
   * @default false
   */
  disabled?: boolean;
  /**
   * Có vô hiệu hoá việc lắng nghe sự kiện change của tất cả các mục form hay không
   * @default true
   */
  disabledOnChangeListener?: boolean;
  /**
   * Có vô hiệu hoá việc lắng nghe sự kiện input của tất cả các mục form hay không
   * @default true
   */
  disabledOnInputListener?: boolean;
  /**
   * Giá trị trạng thái rỗng của tất cả các mục form, mặc định đều là undefined, giá trị trạng thái rỗng của naive-ui là null
   */
  emptyStateValue?: null | undefined;
  /**
   * Kiểu của control cho tất cả các mục form
   * @default {}
   */
  formFieldProps?: FormFieldOptions;
  /**
   * Bố cục lưới của tất cả các mục form, hỗ trợ dạng hàm
   * @default ""
   */
  formItemClass?: (() => string) | string;
  /**
   * Ẩn label của tất cả các mục form
   * @default false
   */
  hideLabel?: boolean;
  /**
   * Có ẩn dấu bắt buộc hay không
   * @default false
   */
  hideRequiredMark?: boolean;
  /**
   * Kiểu label của tất cả các mục form
   * @default ""
   */
  labelClass?: string;
  /**
   * Độ rộng label của tất cả các mục form
   */
  labelWidth?: number;
  /**
   * Tên thuộc tính model của tất cả các mục form
   * @default "modelValue"
   */
  modelPropName?: string;
  /**
   * Kiểu wrapper của tất cả các mục form
   */
  wrapperClass?: string;
}

type RenderComponentContentType = (
  value: Partial<Record<string, any>>,
  api: FormActions,
) => Record<string, any>;

export type HandleSubmitFn = (
  values: Record<string, any>,
) => Promise<void> | void;

export type HandleResetFn = (
  values: Record<string, any>,
) => Promise<void> | void;

export type FieldMappingTime = [
  string,
  [string, string],
  (
    ((value: any, fieldName: string) => any) | [string, string] | null | string
  )?,
][];

export type ArrayToStringFields = Array<
  | [string[], string?] // Định dạng mảng lồng nhau, ký tự phân tách tuỳ chọn
  | string // Một trường duy nhất, dùng ký tự phân tách mặc định
  | string[] // Định dạng mảng đơn giản, phần tử cuối cùng có thể là ký tự phân tách
>;

export interface FormSchema<
  T extends BaseFormComponentType = BaseFormComponentType,
> extends FormCommonConfig {
  /** Component */
  component: Component | T;
  /** Tham số của component */
  componentProps?: ComponentProps;
  /** Giá trị mặc định */
  defaultValue?: any;
  /** Phụ thuộc */
  dependencies?: FormItemDependencies;
  /** Mô tả */
  description?: CustomRenderType;
  /** Tên trường */
  fieldName: string;
  /** Thông tin trợ giúp */
  help?: CustomRenderType;
  /** Có ẩn mục form hay không */
  hide?: boolean;
  /** Mục form */
  label?: CustomRenderType;
  // Render nội bộ của component tuỳ chỉnh
  renderComponentContent?: RenderComponentContentType;
  /** Quy tắc của trường */
  rules?: FormSchemaRuleType;
  /** Hậu tố */
  suffix?: CustomRenderType;
}

export interface FormFieldProps extends FormSchema {
  required?: boolean;
}

export interface FormRenderProps<
  T extends BaseFormComponentType = BaseFormComponentType,
> {
  /**
   * Cấu hình ánh xạ mảng trường form thành chuỗi, mặc định dùng ","
   */
  arrayToStringFields?: ArrayToStringFields;
  /**
   * Có thu gọn hay không, có hiệu lực khi showCollapseButton=true
   * true: thu gọn, false: mở rộng
   */
  collapsed?: boolean;
  /**
   * Giữ số dòng khi thu gọn
   * @default 1
   */
  collapsedRows?: number;
  /**
   * Có kích hoạt sự kiện resize hay không
   * @default false
   */
  collapseTriggerResize?: boolean;
  /**
   * Cấu hình dự phòng chung cho các mục form, khi mục con chưa cấu hình thì dùng cấu hình này, cấu hình của mục con có độ ưu tiên cao hơn cấu hình này
   */
  commonConfig?: FormCommonConfig;
  /**
   * Chế độ gọn (loại bỏ khoảng trống ở cuối mỗi mục form dành cho thông tin kiểm tra)
   */
  compact?: boolean;
  /**
   * Liên kết sự kiện v-model của component
   */
  componentBindEventMap?: Partial<Record<BaseFormComponentType, string>>;
  /**
   * Tập hợp component
   */
  componentMap: Record<BaseFormComponentType, Component>;
  /**
   * Ánh xạ trường form sang định dạng thời gian
   */
  fieldMappingTime?: FieldMappingTime;
  /**
   * Thể hiện của form
   */
  form?: FormContext<GenericObject>;
  /**
   * Bố cục của mục form
   */
  layout?: FormLayout;
  /**
   * Định nghĩa form
   */
  schema?: FormSchema<T>[];

  /**
   * Có hiển thị nút mở rộng/thu gọn hay không
   */
  showCollapseButton?: boolean;
  /**
   * Định dạng ngày tháng
   */

  /**
   * Bố cục lưới của form
   * @default "grid-cols-1"
   */
  wrapperClass?: WrapperClassType;
}

export interface ActionButtonOptions extends VbenButtonProps {
  [key: string]: any;
  content?: MaybeComputedRef<string>;
  show?: boolean;
}

export interface VbenFormProps<
  T extends BaseFormComponentType = BaseFormComponentType,
> extends Omit<
  FormRenderProps<T>,
  'componentBindEventMap' | 'componentMap' | 'form'
> {
  /**
   * Nút thao tác có đảo ngược hay không (nút gửi đặt trước)
   */
  actionButtonsReverse?: boolean;
  /**
   * Kiểu của nhóm nút thao tác
   * newLine: hiển thị trên dòng mới. rowEnd: hiển thị trong dòng, căn phải (mặc định). inline: dùng kiểu mặc định của grid
   */
  actionLayout?: 'inline' | 'newLine' | 'rowEnd';
  /**
   * Vị trí hiển thị của nhóm nút thao tác, mặc định hiển thị căn phải
   */
  actionPosition?: 'center' | 'left' | 'right';
  /**
   * Class của khu vực thao tác form
   */
  actionWrapperClass?: ClassType;
  /**
   * Cấu hình ánh xạ mảng trường form thành chuỗi, mặc định dùng ","
   */
  arrayToStringFields?: ArrayToStringFields;

  /**
   * Ánh xạ trường form
   */
  fieldMappingTime?: FieldMappingTime;
  /**
   * Callback khi trạng thái thu gọn/mở rộng của form thay đổi
   */
  handleCollapsedChange?: (collapsed: boolean) => void;
  /**
   * Callback đặt lại form
   */
  handleReset?: HandleResetFn;
  /**
   * Callback gửi form
   */
  handleSubmit?: HandleSubmitFn;
  /**
   * Callback khi giá trị form thay đổi
   */
  handleValuesChange?: (
    values: Record<string, any>,
    fieldsChanged: string[],
  ) => void;
  /**
   * Tham số của nút đặt lại
   */
  resetButtonOptions?: ActionButtonOptions;

  /**
   * Khi kiểm tra thất bại có tự động cuộn tới trường lỗi đầu tiên hay không
   * @default false
   */
  scrollToFirstError?: boolean;

  /**
   * Có hiển thị nút thao tác mặc định hay không
   * @default true
   */
  showDefaultActions?: boolean;

  /**
   * Tham số của nút gửi
   */
  submitButtonOptions?: ActionButtonOptions;

  /**
   * Có gửi form khi giá trị trường thay đổi hay không
   * @default false
   */
  submitOnChange?: boolean;

  /**
   * Có gửi form khi nhấn Enter hay không
   * @default false
   */
  submitOnEnter?: boolean;
}

export type ExtendedFormApi = FormApi & {
  useStore: <T = NoInfer<VbenFormProps>>(
    selector?: (state: NoInfer<VbenFormProps>) => T,
  ) => Readonly<Ref<T>>;
};

export interface VbenFormAdapterOptions<
  T extends BaseFormComponentType = BaseFormComponentType,
> {
  config?: {
    baseModelPropName?: string;
    disabledOnChangeListener?: boolean;
    disabledOnInputListener?: boolean;
    emptyStateValue?: null | undefined;
    modelPropNameMap?: Partial<Record<T, string>>;
  };
  defineRules?: {
    required?: (
      value: any,
      params: any,
      ctx: Record<string, any>,
    ) => boolean | string;
    selectRequired?: (
      value: any,
      params: any,
      ctx: Record<string, any>,
    ) => boolean | string;
  };
}
