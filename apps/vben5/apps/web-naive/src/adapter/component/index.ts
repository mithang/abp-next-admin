/**
 * Component cơ sở dùng chung cho các component thông dụng, trước đây nằm trong adapter/form nên bị giới hạn phạm vi sử dụng, ở đây tách ra để các nơi khác tiện dùng
 * Có thể dùng cho các component như vben-form, vben-modal, vben-drawer,
 */

import type { Component } from 'vue';

import type { BaseFormComponentType } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import {
  defineAsyncComponent,
  defineComponent,
  getCurrentInstance,
  h,
  ref,
} from 'vue';

import { ApiComponent, globalShareState, IconPicker } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message } from '#/adapter/naive';

const NButton = defineAsyncComponent(() =>
  import('naive-ui/es/button').then((res) => res.NButton),
);
const NCheckbox = defineAsyncComponent(() =>
  import('naive-ui/es/checkbox').then((res) => res.NCheckbox),
);
const NCheckboxGroup = defineAsyncComponent(() =>
  import('naive-ui/es/checkbox').then((res) => res.NCheckboxGroup),
);
const NDatePicker = defineAsyncComponent(() =>
  import('naive-ui/es/date-picker').then((res) => res.NDatePicker),
);
const NDivider = defineAsyncComponent(() =>
  import('naive-ui/es/divider').then((res) => res.NDivider),
);
const NInput = defineAsyncComponent(() =>
  import('naive-ui/es/input').then((res) => res.NInput),
);
const NInputNumber = defineAsyncComponent(() =>
  import('naive-ui/es/input-number').then((res) => res.NInputNumber),
);
const NRadio = defineAsyncComponent(() =>
  import('naive-ui/es/radio').then((res) => res.NRadio),
);
const NRadioButton = defineAsyncComponent(() =>
  import('naive-ui/es/radio').then((res) => res.NRadioButton),
);
const NRadioGroup = defineAsyncComponent(() =>
  import('naive-ui/es/radio').then((res) => res.NRadioGroup),
);
const NSelect = defineAsyncComponent(() =>
  import('naive-ui/es/select').then((res) => res.NSelect),
);
const NSpace = defineAsyncComponent(() =>
  import('naive-ui/es/space').then((res) => res.NSpace),
);
const NSwitch = defineAsyncComponent(() =>
  import('naive-ui/es/switch').then((res) => res.NSwitch),
);
const NTimePicker = defineAsyncComponent(() =>
  import('naive-ui/es/time-picker').then((res) => res.NTimePicker),
);
const NTreeSelect = defineAsyncComponent(() =>
  import('naive-ui/es/tree-select').then((res) => res.NTreeSelect),
);
const NUpload = defineAsyncComponent(() =>
  import('naive-ui/es/upload').then((res) => res.NUpload),
);

const withDefaultPlaceholder = <T extends Component>(
  component: T,
  type: 'input' | 'select',
  componentProps: Recordable<any> = {},
) => {
  return defineComponent({
    name: component.name,
    inheritAttrs: false,
    setup: (props: any, { attrs, expose, slots }) => {
      const placeholder =
        props?.placeholder ||
        attrs?.placeholder ||
        $t(`ui.placeholder.${type}`);
      // Các phương thức mà component truyền qua công khai
      const innerRef = ref();
      const publicApi: Recordable<any> = {};
      expose(publicApi);
      const instance = getCurrentInstance();
      instance?.proxy?.$nextTick(() => {
        for (const key in innerRef.value) {
          if (typeof innerRef.value[key] === 'function') {
            publicApi[key] = innerRef.value[key];
          }
        }
      });
      return () =>
        h(
          component,
          { ...componentProps, placeholder, ...props, ...attrs, ref: innerRef },
          slots,
        );
    },
  });
};

// Tại đây cần tự điều chỉnh theo thư viện component nghiệp vụ, mọi component cần dùng đều phải khai báo kiểu tại đây
export type ComponentType =
  | 'ApiSelect'
  | 'ApiTreeSelect'
  | 'Checkbox'
  | 'CheckboxGroup'
  | 'DatePicker'
  | 'Divider'
  | 'IconPicker'
  | 'Input'
  | 'InputNumber'
  | 'RadioGroup'
  | 'Select'
  | 'Space'
  | 'Switch'
  | 'TimePicker'
  | 'TreeSelect'
  | 'Upload'
  | BaseFormComponentType;

async function initComponentAdapter() {
  const components: Partial<Record<ComponentType, Component>> = {
    // Nếu component của bạn có dung lượng lớn, có thể dùng tải không đồng bộ
    // Button: () =>
    // import('xxx').then((res) => res.Button),

    ApiSelect: withDefaultPlaceholder(
      {
        ...ApiComponent,
        name: 'ApiSelect',
      },
      'select',
      {
        component: NSelect,
        modelPropName: 'value',
      },
    ),
    ApiTreeSelect: withDefaultPlaceholder(
      {
        ...ApiComponent,
        name: 'ApiTreeSelect',
      },
      'select',
      {
        component: NTreeSelect,
        nodeKey: 'value',
        loadingSlot: 'arrow',
        keyField: 'value',
        modelPropName: 'value',
        optionsPropName: 'options',
        visibleEvent: 'onVisibleChange',
      },
    ),
    Checkbox: NCheckbox,
    CheckboxGroup: (props, { attrs, slots }) => {
      let defaultSlot;
      if (Reflect.has(slots, 'default')) {
        defaultSlot = slots.default;
      } else {
        const { options } = attrs;
        if (Array.isArray(options)) {
          defaultSlot = () => options.map((option) => h(NCheckbox, option));
        }
      }
      return h(
        NCheckboxGroup,
        { ...props, ...attrs },
        { default: defaultSlot },
      );
    },
    DatePicker: NDatePicker,
    // Tùy chỉnh nút mặc định
    DefaultButton: (props, { attrs, slots }) => {
      return h(NButton, { ...props, attrs, type: 'default' }, slots);
    },
    // Tùy chỉnh nút chính
    PrimaryButton: (props, { attrs, slots }) => {
      return h(NButton, { ...props, attrs, type: 'primary' }, slots);
    },
    Divider: NDivider,
    IconPicker: withDefaultPlaceholder(IconPicker, 'select', {
      iconSlot: 'suffix',
      inputComponent: NInput,
    }),
    Input: withDefaultPlaceholder(NInput, 'input'),
    InputNumber: withDefaultPlaceholder(NInputNumber, 'input'),
    RadioGroup: (props, { attrs, slots }) => {
      let defaultSlot;
      if (Reflect.has(slots, 'default')) {
        defaultSlot = slots.default;
      } else {
        const { options } = attrs;
        if (Array.isArray(options)) {
          defaultSlot = () =>
            options.map((option) =>
              h(attrs.isButton ? NRadioButton : NRadio, option),
            );
        }
      }
      const groupRender = h(
        NRadioGroup,
        { ...props, ...attrs },
        { default: defaultSlot },
      );
      return attrs.isButton
        ? h(NSpace, { vertical: true }, () => groupRender)
        : groupRender;
    },
    Select: withDefaultPlaceholder(NSelect, 'select'),
    Space: NSpace,
    Switch: NSwitch,
    TimePicker: NTimePicker,
    TreeSelect: withDefaultPlaceholder(NTreeSelect, 'select'),
    Upload: NUpload,
  };

  // Đăng ký component vào trạng thái chia sẻ toàn cục
  globalShareState.setComponents(components);

  // Định nghĩa gợi ý thông báo trong trạng thái chia sẻ toàn cục
  globalShareState.defineMessage({
    // Gợi ý thông báo sao chép thành công
    copyPreferencesSuccess: (title, content) => {
      message.success(content || title, {
        duration: 0,
      });
    },
  });
}

export { initComponentAdapter };
