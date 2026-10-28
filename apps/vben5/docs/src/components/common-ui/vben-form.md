---
outline: deep
---

# Vben Form

Component biểu mẫu do framework cung cấp, có thể tương thích với các framework như `Element Plus`, `Ant Design Vue`, `Naive UI`.

> Nếu trong tài liệu không có mô tả tham số, hãy thử tìm trong ví dụ trực tuyến

::: info Lời nói đầu

Nếu bạn thấy việc đóng gói component hiện có chưa đủ tốt, hoặc chưa hoàn toàn phù hợp với nhu cầu của bạn, bạn hoàn toàn có thể trực tiếp sử dụng component gốc, hoặc tự tay đóng gói một component phù hợp. Các component do framework cung cấp không phải là ràng buộc, dùng hay không hoàn toàn tùy thuộc vào nhu cầu và sự tự do của bạn.

:::

## Bộ điều hợp

Tầng dưới của biểu mẫu sử dụng [vee-validate](https://vee-validate.logaretm.com/v4/) để kiểm tra biểu mẫu, vì vậy bạn có thể sử dụng mọi tính năng của `vee-validate`. Đối với các framework UI khác nhau, chúng tôi cung cấp bộ điều hợp để tương thích tốt hơn với từng framework UI.

### Mô tả bộ điều hợp

Mỗi ứng dụng có framework UI khác nhau, vì vậy bên trong `src/adapter/form` và `src/adapter/component` của ứng dụng, bạn có thể điều hợp component theo nhu cầu của mình. Dưới đây là mã ví dụ bộ điều hợp của `Ant Design Vue`, có thể xem mô tả theo chú thích:

::: details Bộ điều hợp biểu mẫu Ant Design Vue

```ts
import type {
  VbenFormSchema as FormSchema,
  VbenFormProps,
} from '@vben/common-ui';

import type { ComponentType } from './component';

import { setupVbenForm, useVbenForm as useForm, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

setupVbenForm<ComponentType>({
  config: {
    // Thư viện component Ant Design Vue mặc định đều dùng v-model:value
    baseModelPropName: 'value',
    // Một số component dùng v-model:checked hoặc v-model:fileList
    modelPropNameMap: {
      Checkbox: 'checked',
      Radio: 'checked',
      Switch: 'checked',
      Upload: 'fileList',
    },
  },
  defineRules: {
    // Điều hợp i18n cho trường nhập bắt buộc
    required: (value, _params, ctx) => {
      if (value === undefined || value === null || value.length === 0) {
        return $t('ui.formRules.required', [ctx.label]);
      }
      return true;
    },
    // Điều hợp i18n cho trường chọn bắt buộc
    selectRequired: (value, _params, ctx) => {
      if (value === undefined || value === null) {
        return $t('ui.formRules.selectRequired', [ctx.label]);
      }
      return true;
    },
  },
});

const useVbenForm = useForm<ComponentType>;

export { useVbenForm, z };
export type VbenFormSchema = FormSchema<ComponentType>;
export type { VbenFormProps };
```

:::

::: details Bộ điều hợp component Ant Design Vue

```ts
/**
 * Component cơ sở dùng chung cho các component thông dụng, trước đây đặt trong adapter/form nên bị giới hạn phạm vi sử dụng, ở đây tách ra để các nơi khác tiện sử dụng
 * Có thể dùng cho vben-form, vben-modal, vben-drawer và các component khác,
 */

import type { BaseFormComponentType } from '@vben/common-ui';

import type { Component, SetupContext } from 'vue';
import { h } from 'vue';

import { globalShareState, IconPicker } from '@vben/common-ui';
import { $t } from '@vben/locales';

const AutoComplete = defineAsyncComponent(
  () => import('ant-design-vue/es/auto-complete'),
);
const Button = defineAsyncComponent(() => import('ant-design-vue/es/button'));
const Checkbox = defineAsyncComponent(
  () => import('ant-design-vue/es/checkbox'),
);
const CheckboxGroup = defineAsyncComponent(() =>
  import('ant-design-vue/es/checkbox').then((res) => res.CheckboxGroup),
);
const DatePicker = defineAsyncComponent(
  () => import('ant-design-vue/es/date-picker'),
);
const Divider = defineAsyncComponent(() => import('ant-design-vue/es/divider'));
const Input = defineAsyncComponent(() => import('ant-design-vue/es/input'));
const InputNumber = defineAsyncComponent(
  () => import('ant-design-vue/es/input-number'),
);
const InputPassword = defineAsyncComponent(() =>
  import('ant-design-vue/es/input').then((res) => res.InputPassword),
);
const Mentions = defineAsyncComponent(
  () => import('ant-design-vue/es/mentions'),
);
const Radio = defineAsyncComponent(() => import('ant-design-vue/es/radio'));
const RadioGroup = defineAsyncComponent(() =>
  import('ant-design-vue/es/radio').then((res) => res.RadioGroup),
);
const RangePicker = defineAsyncComponent(() =>
  import('ant-design-vue/es/date-picker').then((res) => res.RangePicker),
);
const Rate = defineAsyncComponent(() => import('ant-design-vue/es/rate'));
const Select = defineAsyncComponent(() => import('ant-design-vue/es/select'));
const Space = defineAsyncComponent(() => import('ant-design-vue/es/space'));
const Switch = defineAsyncComponent(() => import('ant-design-vue/es/switch'));
const Textarea = defineAsyncComponent(() =>
  import('ant-design-vue/es/input').then((res) => res.Textarea),
);
const TimePicker = defineAsyncComponent(
  () => import('ant-design-vue/es/time-picker'),
);
const TreeSelect = defineAsyncComponent(
  () => import('ant-design-vue/es/tree-select'),
);
const Upload = defineAsyncComponent(() => import('ant-design-vue/es/upload'));


const withDefaultPlaceholder = <T extends Component>(
  component: T,
  type: 'input' | 'select',
) => {
  return (props: any, { attrs, slots }: Omit<SetupContext, 'expose'>) => {
    const placeholder = props?.placeholder || $t(`ui.placeholder.${type}`);
    return h(component, { ...props, ...attrs, placeholder }, slots);
  };
};

// Ở đây cần tự điều hợp theo thư viện component nghiệp vụ, các component cần dùng đều phải khai báo kiểu tại đây
export type ComponentType =
  | 'AutoComplete'
  | 'Checkbox'
  | 'CheckboxGroup'
  | 'DatePicker'
  | 'DefaultButton'
  | 'Divider'
  | 'Input'
  | 'InputNumber'
  | 'InputPassword'
  | 'Mentions'
  | 'PrimaryButton'
  | 'Radio'
  | 'RadioGroup'
  | 'RangePicker'
  | 'Rate'
  | 'Select'
  | 'Space'
  | 'Switch'
  | 'Textarea'
  | 'TimePicker'
  | 'TreeSelect'
  | 'Upload'
  | 'IconPicker';
  | BaseFormComponentType;

async function initComponentAdapter() {
  const components: Partial<Record<ComponentType, Component>> = {
    // Nếu component của bạn có kích thước lớn, có thể dùng tải không đồng bộ
    // Button: () =>
    // import('xxx').then((res) => res.Button),

    AutoComplete,
    Checkbox,
    CheckboxGroup,
    DatePicker,
    // Nút mặc định tùy chỉnh
    DefaultButton: (props, { attrs, slots }) => {
      return h(Button, { ...props, attrs, type: 'default' }, slots);
    },
    Divider,
    IconPicker,
    Input: withDefaultPlaceholder(Input, 'input'),
    InputNumber: withDefaultPlaceholder(InputNumber, 'input'),
    InputPassword: withDefaultPlaceholder(InputPassword, 'input'),
    Mentions: withDefaultPlaceholder(Mentions, 'input'),
    // Nút chính tùy chỉnh
    PrimaryButton: (props, { attrs, slots }) => {
      return h(Button, { ...props, attrs, type: 'primary' }, slots);
    },
    Radio,
    RadioGroup,
    RangePicker,
    Rate,
    Select: withDefaultPlaceholder(Select, 'select'),
    Space,
    Switch,
    Textarea: withDefaultPlaceholder(Textarea, 'input'),
    TimePicker,
    TreeSelect: withDefaultPlaceholder(TreeSelect, 'select'),
    Upload,
  };

  // Đăng ký component vào trạng thái chia sẻ toàn cục
  globalShareState.setComponents(components);

  // Định nghĩa thông báo trong trạng thái chia sẻ toàn cục
  globalShareState.defineMessage({
    // Thông báo sao chép thành công
    copyPreferencesSuccess: (title, content) => {
      notification.success({
        description: content,
        message: title,
        placement: 'bottomRight',
      });
    },
  });
}

export { initComponentAdapter };
```

:::

## Cách dùng cơ bản

::: tip README

Trong mã ví dụ bên dưới, có một số vấn đề chưa điều hợp i18n và màu chủ đề, những vấn đề này chỉ xuất hiện trong tài liệu, khi sử dụng thực tế sẽ không có những vấn đề này, có thể bỏ qua, không cần băn khoăn.

:::

Sử dụng `useVbenForm` để tạo biểu mẫu cơ bản nhất.

<DemoPreview dir="demos/vben-form/basic" />

## Biểu mẫu truy vấn

Biểu mẫu truy vấn là một loại biểu mẫu đặc biệt, dùng để truy vấn dữ liệu. Biểu mẫu truy vấn sẽ không kích hoạt kiểm tra biểu mẫu, chỉ kích hoạt sự kiện truy vấn.

<DemoPreview dir="demos/vben-form/query" />

## Kiểm tra biểu mẫu

Kiểm tra biểu mẫu là một tính năng rất quan trọng, có thể thực hiện kiểm tra thông qua thuộc tính `rules`.

<DemoPreview dir="demos/vben-form/rules" />

## Liên động biểu mẫu

Liên động biểu mẫu là một tính năng rất phổ biến, có thể thực hiện liên động thông qua thuộc tính `dependencies`.

_Lưu ý_ Cần chỉ định thuộc tính `triggerFields` của `dependencies`, đặt xem thay đổi của ai sẽ kích hoạt, để component biểu mẫu có thể liên động chính xác.

<DemoPreview dir="demos/vben-form/dynamic" />

## Component tùy chỉnh

Nếu thư viện component nghiệp vụ của bạn không cung cấp một component nào đó, bạn có thể tự đóng gói một component rồi thêm vào bên trong biểu mẫu.

<DemoPreview dir="demos/vben-form/custom" />

## Thao tác

Một số thao tác biểu mẫu thường gặp.

<DemoPreview dir="demos/vben-form/api" />

## API

`useVbenForm` trả về một mảng, phần tử đầu tiên là component biểu mẫu, phần tử thứ hai là các phương thức của biểu mẫu.

```vue
<script setup lang="ts">
import { useVbenForm } from '#/adapter/form';

// Form là component popup
// formApi là các phương thức của popup
const [Form, formApi] = useVbenForm({
  // Thuộc tính
  // Sự kiện
});
</script>

<template>
  <Form />
</template>
```

### FormApi

Tham số thứ hai mà useVbenForm trả về là một đối tượng, chứa một số phương thức của biểu mẫu.

| Tên phương thức | Mô tả | Kiểu | Phiên bản |
| --- | --- | --- | --- |
| submitForm | Gửi biểu mẫu | `(e:Event)=>Promise<Record<string,any>>` | - |
| validateAndSubmitForm | Gửi và kiểm tra biểu mẫu | `(e:Event)=>Promise<Record<string,any>>` | - |
| resetForm | Đặt lại biểu mẫu | `()=>Promise<void>` | - |
| setValues | Đặt giá trị biểu mẫu, mặc định sẽ lọc các field không được định nghĩa trong schema, có thể tắt lọc bằng tham số filterFields | `(fields: Record<string, any>, filterFields?: boolean, shouldValidate?: boolean) => Promise<void>` | - |
| getValues | Lấy giá trị biểu mẫu | `(fields:Record<string, any>,shouldValidate: boolean = false)=>Promise<void>` | - |
| validate | Kiểm tra biểu mẫu | `()=>Promise<void>` | - |
| validateField | Kiểm tra trường chỉ định | `(fieldName: string)=>Promise<ValidationResult<unknown>>` | - |
| isFieldValid | Kiểm tra một trường đã vượt qua kiểm tra hay chưa | `(fieldName: string)=>Promise<boolean>` | - |
| resetValidate | Đặt lại kiểm tra biểu mẫu | `()=>Promise<void>` | - |
| updateSchema | Cập nhật formSchema | `(schema:FormSchema[])=>void` | - |
| setFieldValue | Đặt giá trị trường | `(field: string, value: any, shouldValidate?: boolean)=>Promise<void>` | - |
| setState | Đặt trạng thái component (props) | `(stateOrFn:\| ((prev: VbenFormProps) => Partial<VbenFormProps>)\| Partial<VbenFormProps>)=>Promise<void>` | - |
| getState | Lấy trạng thái component (props) | `()=>Promise<VbenFormProps>` | - |
| form | Đối tượng thể hiện của biểu mẫu, có thể thao tác biểu mẫu, xem [useForm](https://vee-validate.logaretm.com/v4/api/use-form/) | - | - |
| getFieldComponentRef | Lấy thể hiện component của trường chỉ định | `<T=unknown>(fieldName: string)=>T` | >5.5.3 |
| getFocusedField | Lấy trường hiện đang được focus | `()=>string\|undefined` | >5.5.3 |

## Props

Tất cả các thuộc tính đều có thể truyền vào tham số đầu tiên của `useVbenForm`.

| Tên thuộc tính | Mô tả | Kiểu | Giá trị mặc định |
| --- | --- | --- | --- |
| layout | Bố cục mục biểu mẫu | `'horizontal' \| 'vertical'\| 'inline'` | `horizontal` |
| showCollapseButton | Có hiển thị nút thu gọn hay không | `boolean` | `false` |
| wrapperClass | Bố cục của biểu mẫu, dựa trên tailwindcss | `any` | - |
| actionWrapperClass | class của khu vực thao tác biểu mẫu | `any` | - |
| actionLayout | Vị trí nút thao tác biểu mẫu | `'newLine' \| 'rowEnd' \| 'inline'` | `rowEnd` |
| actionPosition | Cách căn lề nút thao tác biểu mẫu | `'left' \| 'center' \| 'right'` | `right` |
| handleReset | Callback đặt lại biểu mẫu | `(values: Record<string, any>,) => Promise<void> \| void` | - |
| handleSubmit | Callback gửi biểu mẫu | `(values: Record<string, any>,) => Promise<void> \| void` | - |
| handleValuesChange | Callback khi giá trị biểu mẫu thay đổi | `(values: Record<string, any>, fieldsChanged: string[]) => void` | - |
| handleCollapsedChange | Callback khi trạng thái thu gọn/mở rộng của biểu mẫu thay đổi | `(collapsed: boolean) => void` | - |
| actionButtonsReverse | Đảo vị trí nút thao tác | `boolean` | `false` |
| resetButtonOptions | Tham số component nút đặt lại | `ActionButtonOptions` | - |
| submitButtonOptions | Tham số component nút gửi | `ActionButtonOptions` | - |
| showDefaultActions | Có hiển thị nút thao tác mặc định hay không | `boolean` | `true` |
| collapsed | Có thu gọn hay không, có hiệu lực khi `showCollapseButton` là `true` | `boolean` | `false` |
| collapseTriggerResize | Khi thu gọn, kích hoạt sự kiện `resize` | `boolean` | `false` |
| collapsedRows | Số dòng giữ lại khi thu gọn | `number` | `1` |
| fieldMappingTime | Dùng để ánh xạ giá trị mảng trong biểu mẫu thành 2 trường | `[string, [string, string],Nullable<string>\|[string,string]\|((any,string)=>any)?][]` | - |
| commonConfig | Cấu hình chung của các mục biểu mẫu, mỗi cấu hình sẽ được truyền tới từng mục biểu mẫu, mục biểu mẫu có thể ghi đè | `FormCommonConfig` | - |
| schema | Cấu hình của từng mục biểu mẫu | `FormSchema[]` | - |
| submitOnEnter | Gửi biểu mẫu khi nhấn phím Enter | `boolean` | false |
| submitOnChange | Gửi biểu mẫu khi giá trị trường thay đổi (chống rung nội bộ, thuộc tính này thường dùng cho biểu mẫu tìm kiếm của bảng) | `boolean` | false |
| compact | Có phải chế độ thu gọn hay không (bỏ qua không gian dành sẵn cho thông tin kiểm tra) | `boolean` | false |
| scrollToFirstError | Khi kiểm tra biểu mẫu thất bại có tự động cuộn đến trường lỗi đầu tiên hay không | `boolean` | false |

::: tip handleValuesChange

Tham số đầu tiên `values` của hàm callback `handleValuesChange` chứa đối tượng giá trị hiện tại sau khi biểu mẫu thay đổi, tham số thứ hai `fieldsChanged` là một mảng, chứa tên của tất cả các trường đã thay đổi. Lưu ý: tham số thứ hai chỉ khả dụng ở phiên bản trên v5.5.4 (không bao gồm v5.5.4), và truyền vào là tên trường đã được định nghĩa trong schema. Nếu bạn đã dùng ánh xạ trường và cần kiểm tra những trường nào đã thay đổi, xin lưu ý tham số này sẽ không chứa tên trường sau khi ánh xạ.

:::

::: tip fieldMappingTime

Thuộc tính này dùng để ánh xạ giá trị mảng trong biểu mẫu thành 2 trường, nó cần nhận vào một mảng, mỗi phần tử của mảng là một quy tắc ánh xạ, thành viên đầu tiên của quy tắc là một chuỗi, biểu thị tên trường cần ánh xạ, thành viên thứ hai là một mảng, biểu thị tên trường sau khi ánh xạ, thành viên thứ ba là một mặt nạ định dạng tùy chọn, dùng để định dạng trường ngày giờ; cũng có thể cung cấp một hàm định dạng (tham số lần lượt là giá trị hiện tại và tên trường hiện tại, trả về giá trị sau khi định dạng). Nếu đặt rõ mặt nạ định dạng là null, thì giá trị gốc sẽ được ánh xạ mà không định dạng (áp dụng cho trường không phải ngày giờ). Ví dụ: `[['timeRange', ['startTime', 'endTime'], 'YYYY-MM-DD']]`, `timeRange` phải là một giá trị kiểu mảng có ít nhất 2 thành viên. Form sẽ lấy 2 giá trị đầu của `timeRange` định dạng theo mặt nạ `YYYY-MM-DD` rồi ánh xạ lần lượt sang các trường `startTime` và `endTime`. Tham số thứ ba của mỗi phần tử là một mặt nạ định dạng tùy chọn,

:::

### Mô tả kiểu TS

::: details ActionButtonOptions

```ts
export interface ActionButtonOptions {
  /** Kiểu dáng */
  class?: ClassType;
  /** Có vô hiệu hoá hay không */
  disabled?: boolean;
  /** Có đang tải hay không */
  loading?: boolean;
  /** Kích thước nút */
  size?: ButtonVariantSize;
  /** Loại nút */
  variant?: ButtonVariants;
  /** Có hiển thị hay không */
  show?: boolean;
  /** Văn bản nút */
  content?: string;
  /** Thuộc tính tùy ý */
  [key: string]: any;
}
```

:::

::: details FormCommonConfig

```ts
export interface FormCommonConfig {
  /**
   * Props của tất cả các mục biểu mẫu
   */
  componentProps?: ComponentProps;
  /**
   * Kiểu dáng điều khiển của tất cả các mục biểu mẫu
   */
  controlClass?: string;
  /**
   * Hiển thị dấu hai chấm sau Label của mục biểu mẫu
   */
  colon?: boolean;
  /**
   * Trạng thái vô hiệu hoá của tất cả các mục biểu mẫu
   * @default false
   */
  disabled?: boolean;
  /**
   * Kiểu dáng điều khiển của tất cả các mục biểu mẫu
   * @default {}
   */
  formFieldProps?: Partial<typeof Field>;
  /**
   * Bố cục lưới của tất cả các mục biểu mẫu
   * @default ""
   */
  formItemClass?: (() => string) | string;
  /**
   * Ẩn label của tất cả các mục biểu mẫu
   * @default false
   */
  hideLabel?: boolean;
  /**
   * Có ẩn dấu bắt buộc hay không
   * @default false
   */
  hideRequiredMark?: boolean;
  /**
   * Kiểu dáng label của tất cả các mục biểu mẫu
   * @default ""
   */
  labelClass?: string;
  /**
   * Chiều rộng label của tất cả các mục biểu mẫu
   */
  labelWidth?: number;
  /**
   * Tên thuộc tính model của tất cả các mục biểu mẫu. Khi dùng component tùy chỉnh có thể chỉ định tên thuộc tính model của component qua cấu hình này. Các component đã đăng ký trong modelPropNameMap không bị ảnh hưởng bởi cấu hình này
   * @default "modelValue"
   */
  modelPropName?: string;
  /**
   * Kiểu dáng wrapper của tất cả các mục biểu mẫu
   */
  wrapperClass?: string;
}
```

:::

::: details FormSchema

```ts
export interface FormSchema<
  T extends BaseFormComponentType = BaseFormComponentType,
> extends FormCommonConfig {
  /** Component */
  component: Component | T;
  /** Tham số component */
  componentProps?: ComponentProps;
  /** Giá trị mặc định */
  defaultValue?: any;
  /** Phụ thuộc */
  dependencies?: FormItemDependencies;
  /** Mô tả */
  description?: string;
  /** Tên trường, cũng là tên của slot tùy chỉnh */
  fieldName: string;
  /** Thông tin trợ giúp */
  help?: CustomRenderType;
  /** Có ẩn mục biểu mẫu hay không */
  hide?: boolean;
  /** Nhãn của biểu mẫu (nếu là một string, sẽ dùng cho thông báo của quy tắc bắt buộc mặc định) */
  label?: CustomRenderType;
  /** Kết xuất nội bộ của component tùy chỉnh  */
  renderComponentContent?: RenderComponentContentType;
  /** Quy tắc trường */
  rules?: FormSchemaRuleType;
  /** Hậu tố */
  suffix?: CustomRenderType;
}
```

:::

### Liên động biểu mẫu

Liên động biểu mẫu cần thực hiện liên động thông qua thuộc tính `dependencies` trong schema, cho phép bạn thêm các mục phụ thuộc giữa các trường để điều khiển trường dựa trên giá trị của các trường khác.

```ts
dependencies: {
  // Trường kích hoạt. Chỉ khi giá trị của các trường này thay đổi thì liên động mới kích hoạt
  triggerFields: ['name'],
  // Đánh giá động xem trường hiện tại có cần hiển thị hay không, nếu không hiển thị thì hủy trực tiếp
  if(values,formApi){},
  // Đánh giá động xem trường hiện tại có cần hiển thị hay không, nếu không hiển thị thì ẩn bằng css
  show(values,formApi){},
  // Đánh giá động xem trường hiện tại có cần vô hiệu hoá hay không
  disabled(values,formApi){},
  // Mỗi khi trường thay đổi, hàm này đều được kích hoạt
  trigger(values,formApi){},
  // rules động
  rules(values,formApi){},
  // Bắt buộc động
  required(values,formApi){},
  // Tham số component động
  componentProps(values,formApi){},
}
```

### Kiểm tra biểu mẫu

Kiểm tra biểu mẫu cần cấu hình thông qua thuộc tính `rules` trong schema.

Giá trị của rules có thể là chuỗi (tên quy tắc kiểm tra được định nghĩa sẵn), cũng có thể là một schema của zod.

#### Quy tắc kiểm tra được định nghĩa sẵn

```ts
// Biểu thị trường bắt buộc, mặc định sẽ thực hiện i18n theo required của bộ điều hợp
{
  rules: 'required';
}

// Biểu thị trường bắt buộc, mặc định sẽ thực hiện i18n theo required của bộ điều hợp, dùng cho các loại như lựa chọn từ danh sách thả xuống
{
  rules: 'selectRequired';
}
```

#### zod

rules cũng hỗ trợ schema của zod, có thể thực hiện kiểm tra phức tạp hơn, cách dùng zod xem [tài liệu zod](https://zod.dev/).

```ts
import { z } from '#/adapter/form';

// Kiểu cơ bản
{
  rules: z.string().min(1, { message: 'Vui lòng nhập chuỗi' });
}

// Tùy chọn (có thể là undefined), và mang giá trị mặc định. Lưu ý optional của zod không bao gồm chuỗi rỗng ''
{
  rules: z.string().default('Giá trị mặc định').optional();
}

// Có thể là chuỗi rỗng, undefined hoặc một địa chỉ email (hai cách dùng khác nhau)
{
  rules: z.union([z.string().email().optional(), z.literal('')]);
}

{
  rules: z.string().email().or(z.literal('')).optional();
}

// Kiểm tra phức tạp
{
  z.string()
    .min(1, { message: 'Vui lòng nhập' })
    .refine((value) => value === '123', {
      message: 'Giá trị phải là 123',
    });
}
```

## Slots

Có thể sử dụng các slot sau để chèn nội dung tùy chỉnh vào biểu mẫu

| Tên slot        | Mô tả               |
| ------------- | ------------------ |
| reset-before  | Vị trí trước nút đặt lại |
| submit-before | Vị trí trước nút gửi |
| expand-before | Vị trí trước nút mở rộng |
| expand-after  | Vị trí sau nút mở rộng |

::: tip Slot trường

Ngoài các slot tích hợp sẵn ở trên, mỗi trường trong thuộc tính `schema` với `fieldName` đều có thể dùng làm tên slot, các slot trường này có độ ưu tiên cao hơn component được định nghĩa bởi `component`. Nói cách khác, khi cung cấp slot có cùng tên với `fieldName`, nội dung của các slot này sẽ trở thành component của các trường đó, lúc này giá trị của `component` sẽ bị bỏ qua.

:::
