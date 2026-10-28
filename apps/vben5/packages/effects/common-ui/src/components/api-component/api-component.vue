<script lang="ts" setup>
import type { Component } from 'vue';

import type { AnyPromiseFunction } from '@vben/types';

import { computed, nextTick, ref, unref, useAttrs, watch } from 'vue';

import { LoaderCircle } from '@vben/icons';

import { cloneDeep, get, isEqual, isFunction } from '@vben-core/shared/utils';

import { objectOmit } from '@vueuse/core';

type OptionsItem = {
  [name: string]: any;
  children?: OptionsItem[];
  disabled?: boolean;
  label?: string;
  value?: string;
};

interface Props {
  /** Thành phần */
  component: Component;
  /** Có chuyển value từ số sang string hay không */
  numberToString?: boolean;
  /** Hàm lấy dữ liệu options */
  api?: (arg?: any) => Promise<OptionsItem[] | Record<string, any>>;
  /** Tham số truyền cho api */
  params?: Record<string, any>;
  /** Tên trường trích mảng options từ kết quả api trả về */
  resultField?: string;
  /** Tên trường label */
  labelField?: string;
  /** Tên trường children, dùng được cho component cần dữ liệu phân cấp */
  childrenField?: string;
  /** Tên trường value */
  valueField?: string;
  /** Tên trường disabled */
  disabledField?: string;
  /** Tên thuộc tính component nhận dữ liệu options */
  optionsPropName?: string;
  /** Có gọi api ngay hay không */
  immediate?: boolean;
  /** Gọi lại dữ liệu mỗi khi sự kiện `visibleEvent` xảy ra */
  alwaysLoad?: boolean;
  /** Hàm callback trước khi gọi api */
  beforeFetch?: AnyPromiseFunction<any, any>;
  /** Hàm callback sau khi gọi api */
  afterFetch?: AnyPromiseFunction<any, any>;
  /** Truyền trực tiếp dữ liệu lựa chọn, đồng thời làm dữ liệu dự phòng khi api trả về dữ liệu rỗng */
  options?: OptionsItem[];
  /** Tên slot của component, dùng để hiển thị biểu tượng "đang tải" */
  loadingSlot?: string;
  /** Tên sự kiện kích hoạt gọi api */
  visibleEvent?: string;
  /** Tên thuộc tính v-model của component, mặc định là modelValue. Một số component có thể là value */
  modelPropName?: string;
  /**
   * Tự động chọn
   * - `first`: tự động chọn lựa chọn đầu tiên
   * - `last`: tự động chọn lựa chọn cuối cùng
   * - `one`: khi kết quả request chỉ có một lựa chọn thì tự động chọn lựa chọn đó
   * - Hàm: logic chọn tùy chỉnh, tham số của hàm là mảng kết quả request, giá trị trả về là lựa chọn được chọn
   * - false: không tự động chọn (mặc định)
   */
  autoSelect?:
    'first' | 'last' | 'one' | ((item: OptionsItem[]) => OptionsItem) | false;
}

defineOptions({ name: 'ApiComponent', inheritAttrs: false });

const props = withDefaults(defineProps<Props>(), {
  labelField: 'label',
  valueField: 'value',
  disabledField: 'disabled',
  childrenField: '',
  optionsPropName: 'options',
  resultField: '',
  visibleEvent: '',
  numberToString: false,
  params: () => ({}),
  immediate: true,
  alwaysLoad: false,
  loadingSlot: '',
  beforeFetch: undefined,
  afterFetch: undefined,
  modelPropName: 'modelValue',
  api: undefined,
  autoSelect: false,
  options: () => [],
});

const emit = defineEmits<{
  optionsChange: [OptionsItem[]];
}>();

const modelValue = defineModel<any>({ default: undefined });

const attrs = useAttrs();
const innerParams = ref({});
const refOptions = ref<OptionsItem[]>([]);
const loading = ref(false);
// Đã tải lần đầu hay chưa
const isFirstLoaded = ref(false);
// Cờ đánh dấu có request đang chờ xử lý hay không
const hasPendingRequest = ref(false);

const getOptions = computed(() => {
  const {
    labelField,
    valueField,
    disabledField,
    childrenField,
    numberToString,
  } = props;

  const refOptionsData = unref(refOptions);

  function transformData(data: OptionsItem[]): OptionsItem[] {
    return data.map((item) => {
      const value = get(item, valueField);
      const disabled = get(item, disabledField);
      return {
        ...objectOmit(item, [labelField, valueField, disabled, childrenField]),
        label: get(item, labelField),
        value: numberToString ? `${value}` : value,
        disabled: get(item, disabledField),
        ...(childrenField && item[childrenField]
          ? { children: transformData(item[childrenField]) }
          : {}),
      };
    });
  }

  const data: OptionsItem[] = transformData(refOptionsData);

  return data.length > 0 ? data : props.options;
});

const bindProps = computed(() => {
  return {
    [props.modelPropName]: unref(modelValue),
    [props.optionsPropName]: unref(getOptions),
    [`onUpdate:${props.modelPropName}`]: (val: string) => {
      modelValue.value = val;
    },
    ...objectOmit(attrs, [`onUpdate:${props.modelPropName}`]),
    ...(props.visibleEvent
      ? {
          [props.visibleEvent]: handleFetchForVisible,
        }
      : {}),
  };
});

async function fetchApi() {
  const { api, beforeFetch, afterFetch, resultField } = props;

  if (!api || !isFunction(api)) {
    return;
  }

  // Nếu đang tải, đánh dấu có request đang chờ xử lý và trả về
  if (loading.value) {
    hasPendingRequest.value = true;
    return;
  }

  refOptions.value = [];
  try {
    loading.value = true;
    let finalParams = unref(mergedParams);
    if (beforeFetch && isFunction(beforeFetch)) {
      finalParams = (await beforeFetch(cloneDeep(finalParams))) || finalParams;
    }
    let res = await api(finalParams);
    if (afterFetch && isFunction(afterFetch)) {
      res = (await afterFetch(res)) || res;
    }
    isFirstLoaded.value = true;
    if (Array.isArray(res)) {
      refOptions.value = res;
      emitChange();
      return;
    }
    if (resultField) {
      refOptions.value = get(res, resultField) || [];
    }
    emitChange();
  } catch (error) {
    console.warn(error);
    // reset status
    isFirstLoaded.value = false;
  } finally {
    loading.value = false;
    // Nếu có request đang chờ xử lý, kích hoạt ngay request mới
    if (hasPendingRequest.value) {
      hasPendingRequest.value = false;
      // Dùng nextTick để đảm bảo cập nhật trạng thái xong mới kích hoạt request mới
      await nextTick();
      fetchApi();
    }
  }
}

async function handleFetchForVisible(visible: boolean) {
  if (visible) {
    if (props.alwaysLoad) {
      await fetchApi();
    } else if (!props.immediate && !unref(isFirstLoaded)) {
      await fetchApi();
    }
  }
}

const mergedParams = computed(() => {
  return {
    ...props.params,
    ...unref(innerParams),
  };
});

watch(
  mergedParams,
  (value, oldValue) => {
    if (isEqual(value, oldValue)) {
      return;
    }
    fetchApi();
  },
  { deep: true, immediate: props.immediate },
);

function emitChange() {
  if (
    modelValue.value === undefined &&
    props.autoSelect &&
    unref(getOptions).length > 0
  ) {
    let firstOption;
    if (isFunction(props.autoSelect)) {
      firstOption = props.autoSelect(unref(getOptions));
    } else {
      switch (props.autoSelect) {
        case 'first': {
          firstOption = unref(getOptions)[0];
          break;
        }
        case 'last': {
          firstOption = unref(getOptions)[unref(getOptions).length - 1];
          break;
        }
        case 'one': {
          if (unref(getOptions).length === 1) {
            firstOption = unref(getOptions)[0];
          }
          break;
        }
      }
    }

    if (firstOption) modelValue.value = firstOption.value;
  }
  emit('optionsChange', unref(getOptions));
}
const componentRef = ref();
defineExpose({
  /** Lấy dữ liệu options */
  getOptions: () => unref(getOptions),
  /** Lấy giá trị hiện tại */
  getValue: () => unref(modelValue),
  /** Lấy instance của component được bọc */
  getComponentRef: <T = any,>() => componentRef.value as T,
  /** Cập nhật tham số Api */
  updateParam(newParams: Record<string, any>) {
    innerParams.value = newParams;
  },
});
</script>
<template>
  <component
    :is="component"
    v-bind="bindProps"
    :placeholder="$attrs.placeholder"
    ref="componentRef"
  >
    <template v-for="item in Object.keys($slots)" #[item]="data">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
    <template v-if="loadingSlot && loading" #[loadingSlot]>
      <LoaderCircle class="animate-spin" />
    </template>
  </component>
</template>
