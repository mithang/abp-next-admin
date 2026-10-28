<!--
 * @Description:
-->
<template>
  <Col v-bind="colPropsComputed">
    <FormItem v-bind="{ ...formItemProps }">
      <template #label v-if="!formItemProps.hiddenLabel && schema.component !== 'Divider'">
        <Tooltip>
          <span>{{ schema.label }}</span>
          <template #title v-if="schema.helpMessage"
            ><span>{{ schema.helpMessage }}</span></template
          >
          <Icon v-if="schema.helpMessage" class="ml-5" icon="ant-design:question-circle-outlined" />
        </Tooltip>
      </template>

      <slot
        v-if="schema.componentProps && schema.componentProps?.slotName"
        :name="schema.componentProps.slotName"
        v-bind="schema"
      ></slot>
      <Divider
        v-else-if="schema.component == 'Divider' && schema.label && !formItemProps.hiddenLabel"
        >{{ schema.label }}</Divider
      >
      <!-- Một số control cần một div trống -->
      <div
        ><component
          class="v-form-item-wrapper"
          :is="componentItem"
          v-bind="{ ...cmpProps, ...asyncProps }"
          :schema="schema"
          :style="schema.width ? { width: schema.width } : {}"
          @change="handleChange"
          @click="handleClick(schema)"
      /></div>
      <span v-if="['Button'].includes(schema.component)">{{ schema.label }}</span>
    </FormItem>
  </Col>
</template>
<script lang="ts">
  import { defineComponent, reactive, toRefs, computed, PropType, unref } from 'vue';
  import { componentMap } from '../../core/formItemConfig';
  import { IVFormComponent, IFormConfig } from '../../typings/v-form-component';
  import { asyncComputed } from '@vueuse/core';
  import { handleAsyncOptions } from '../../utils';
  import { omit } from 'lodash-es';
  import { Tooltip, FormItem, Divider, Col } from 'ant-design-vue';
  // import FormItem from '/@/components/Form/src/components/FormItem.vue';
  import { Icon } from '/@/components/Icon';
  import { useFormModelState } from '../../hooks/useFormDesignState';
  export default defineComponent({
    name: 'VFormItem',
    components: {
      Tooltip,
      Icon,
      FormItem,
      Divider,
      Col,
    },
    props: {
      formData: {
        type: Object,
        default: () => ({}),
      },
      schema: {
        type: Object as PropType<IVFormComponent>,
        required: true,
      },
      formConfig: {
        type: Object as PropType<IFormConfig>,
        required: true,
      },
    },
    emits: ['update:form-data', 'change'],
    setup(props, { emit }) {
      const state = reactive({
        componentMap,
      });
      const { formModel: formData1, setFormModel } = useFormModelState();
      const colPropsComputed = computed(() => {
        const { colProps = {} } = props.schema;
        return colProps;
      });
      const formItemProps = computed(() => {
        const { formConfig } = unref(props);
        let { field, required, rules, labelCol, wrapperCol } = unref(props.schema);
        const { colon } = props.formConfig;
        const { itemProps } = unref(props.schema);
        //<editor-fold desc="Thuộc tính bố cục">
        labelCol = labelCol
          ? labelCol
          : formConfig.layout === 'horizontal'
          ? formConfig.labelLayout === 'flex'
            ? { style: `width:${formConfig.labelWidth}px` }
            : formConfig.labelCol
          : {};
        wrapperCol = wrapperCol
          ? wrapperCol
          : formConfig.layout === 'horizontal'
          ? formConfig.labelLayout === 'flex'
            ? { style: 'width:auto;flex:1' }
            : formConfig.wrapperCol
          : {};
        const style =
          formConfig.layout === 'horizontal' && formConfig.labelLayout === 'flex'
            ? { display: 'flex' }
            : {};
        /**
         * Định dạng regex dạng chuỗi thành biểu thức chính quy
         */
        const newConfig = Object.assign(
          {},
          {
            name: field,
            style: { ...style },
            colon,
            required,
            rules,
            labelCol,
            wrapperCol,
          },
          itemProps,
        );
        if (!itemProps?.labelCol?.span) {
          newConfig.labelCol = labelCol;
        }
        if (!itemProps?.wrapperCol?.span) {
          newConfig.wrapperCol = wrapperCol;
        }
        if (!itemProps?.rules) {
          newConfig.rules = rules;
        }
        return newConfig;
      }) as Recordable;
      const componentItem = computed(() => componentMap.get(props.schema.component as string));
      // console.log('component change:', props.schema.component, componentItem.value);
      const handleClick = (schema: IVFormComponent) => {
        if (schema.component === 'Button' && schema.componentProps?.handle)
          emit(schema.componentProps?.handle);
      };
      /**
       * Xử lý thuộc tính bất đồng bộ; thuộc tính bất đồng bộ có thể gây lỗi render cho một số thuộc tính, ví dụ defaultValue tải bất đồng bộ sẽ không render được, vì vậy ở đây chỉ xử lý options, treeData, các thuộc tính đồng bộ được xử lý trong cmpProps
       */
      const asyncProps = asyncComputed(async () => {
        let { options, treeData } = props.schema.componentProps ?? {};
        if (options) options = await handleAsyncOptions(options);
        if (treeData) treeData = await handleAsyncOptions(treeData);
        return {
          options,
          treeData,
        };
      });
      /**
       * Xử lý thuộc tính đồng bộ
       */
      const cmpProps = computed(() => {
        const isCheck =
          props.schema && ['Switch', 'Checkbox', 'Radio'].includes(props.schema.component);
        let { field } = props.schema;
        let { disabled, ...attrs } =
          omit(props.schema.componentProps, ['options', 'treeData']) ?? {};
        disabled = props.formConfig.disabled || disabled;
        return {
          ...attrs,
          disabled,
          [isCheck ? 'checked' : 'value']: formData1.value[field!],
        };
      });
      const handleChange = function (e) {
        const isCheck = ['Switch', 'Checkbox', 'Radio'].includes(props.schema.component);
        const target = e ? e.target : null;
        const value = target ? (isCheck ? target.checked : target.value) : e;
        setFormModel(props.schema.field!, value);
        emit('change', value);
      };
      return {
        ...toRefs(state),
        componentItem,
        formItemProps,
        handleClick,
        asyncProps,
        cmpProps,
        handleChange,
        colPropsComputed,
      };
    },
  });
</script>
<style lang="less" scoped>
  .ml-5 {
    margin-left: 5px;
  }
  // Nhãn trong trường form có ant-col, không thể dùng width:100%
  :deep(.ant-col) {
    width: auto;
  }

  .ant-form-item:not(.ant-form-item-with-help) {
    margin-bottom: 20px;
  }
  // .w-full {
  //   width: 100% !important;
  // }
</style>
