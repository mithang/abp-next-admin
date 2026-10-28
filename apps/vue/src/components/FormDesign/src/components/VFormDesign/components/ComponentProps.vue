<!--
 * @Description: Control thuộc tính component
-->
<template>
  <div class="properties-content">
    <div class="properties-body" v-if="formConfig.currentItem">
      <Empty class="hint-box" v-if="!formConfig.currentItem.key" description="Chưa chọn component" />

      <Form label-align="left" layout="vertical">
        <!--    Lặp để render thuộc tính component      -->

        <div v-if="formConfig.currentItem && formConfig.currentItem.componentProps">
          <FormItem v-for="item in inputOptions" :key="item.name" :label="item.label">
            <!--     Xử lý thuộc tính mảng，placeholder       -->

            <div v-if="item.children">
              <component
                v-for="(child, index) of item.children"
                :key="index"
                v-bind="child.componentProps"
                :is="child.component"
                v-model:value="formConfig.currentItem.componentProps[item.name][index]"
              />
            </div>
            <!--     Nếu không phải mảng，thì xử lý giá trị thuộc tính bình thường       -->
            <component
              v-else
              class="component-prop"
              v-bind="item.componentProps"
              :is="item.component"
              v-model:value="formConfig.currentItem.componentProps[item.name]"
            />
          </FormItem>
          <FormItem label="Thuộc tính điều khiển">
            <Col v-for="item in controlOptions" :key="item.name">
              <Checkbox
                v-if="showControlAttrs(item.includes)"
                v-bind="item.componentProps"
                v-model:checked="formConfig.currentItem.componentProps[item.name]"
              >
                {{ item.label }}
              </Checkbox>
            </Col>
          </FormItem>
        </div>
        <FormItem label="Trường liên kết">
          <Select
            mode="multiple"
            v-model:value="formConfig.currentItem['link']"
            :options="linkOptions"
          />
        </FormItem>

        <FormItem
          label="Tùy chọn"
          v-if="
            [
              'Select',
              'ApiSelect',
              'CheckboxGroup',
              'RadioGroup',
              'TreeSelect',
              'ApiTreeSelect',
              'Cascader',
              'AutoComplete',
            ].includes(formConfig.currentItem.component)
          "
        >
          <FormOptions />
        </FormItem>

        <FormItem label="Bảng" v-if="['Table'].includes(formConfig.currentItem.component)">
          <FormOptions />
        </FormItem>

        <FormItem label="Lưới" v-if="['Grid'].includes(formConfig.currentItem.component)">
          <FormOptions />
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script lang="ts">
  import {
    Empty,
    Input,
    Form,
    FormItem,
    Switch,
    Checkbox,
    Select,
    InputNumber,
    RadioGroup,
  } from 'ant-design-vue';
  import RadioButtonGroup from '/@/components/Form/src/components/RadioButtonGroup.vue';
  import { Col, Row } from 'ant-design-vue';
  import { computed, defineComponent, ref, watch } from 'vue';
  import { useFormDesignState } from '../../../hooks/useFormDesignState';
  import {
    baseComponentControlAttrs,
    baseComponentAttrs,
    baseComponentCommonAttrs,
    componentPropsFuncs,
  } from '../../VFormDesign/config/componentPropsConfig';
  import FormOptions from './FormOptions.vue';
  import { formItemsForEach, remove } from '../../../utils';
  import { IBaseFormAttrs } from '../config/formItemPropsConfig';
  export default defineComponent({
    name: 'ComponentProps',
    components: {
      FormOptions,
      Empty,
      Input,
      Form,
      FormItem,
      Switch,
      Checkbox,
      Select,
      InputNumber,
      RadioGroup,
      RadioButtonGroup,
      Col,
      Row,
    },
    setup() {
      // Để thuộc tính compuated tự động cập nhật
      const allOptions = ref([] as Omit<IBaseFormAttrs, 'tag'>[]);
      const showControlAttrs = (includes: string[] | undefined) => {
        if (!includes) return true;
        return includes.includes(formConfig.value.currentItem!.component);
      };
      const { formConfig } = useFormDesignState();
      if (formConfig.value.currentItem) {
        formConfig.value.currentItem.componentProps =
          formConfig.value.currentItem.componentProps || {};
      }
      watch(
        () => formConfig.value.currentItem?.field,
        (_newValue, oldValue) => {
          formConfig.value.schemas &&
            formItemsForEach(formConfig.value.schemas, (item) => {
              if (item.link) {
                const index = item.link.findIndex((linkItem) => linkItem === oldValue);
                index !== -1 && remove(item.link, index);
              }
            });
        },
      );
      watch(
        () => formConfig.value.currentItem && formConfig.value.currentItem.component,
        () => {
          allOptions.value = [];
          baseComponentControlAttrs.forEach((item) => {
            item.category = 'control';
            if (!item.includes) {
              // Nếu thuộc tính không cóinclude，tất cả các control đều áp dụng
              allOptions.value.push(item);
            } else if (item.includes.includes(formConfig.value.currentItem!.component)) {
              // Nếu cóinclude，kiểm tra xem có bao gồm loại control hiện tại không
              allOptions.value.push(item);
            }
          });
          baseComponentCommonAttrs.forEach((item) => {
            item.category = 'input';
            if (item.includes) {
              if (item.includes.includes(formConfig.value.currentItem!.component)) {
                allOptions.value.push(item);
              }
            } else if (item.exclude) {
              if (!item.exclude.includes(formConfig.value.currentItem!.component)) {
                allOptions.value.push(item);
              }
            } else {
              allOptions.value.push(item);
            }
          });
          baseComponentAttrs[formConfig.value.currentItem!.component] &&
            baseComponentAttrs[formConfig.value.currentItem!.component].forEach(async (item) => {
              if (item.component) {
                if (['Switch', 'Checkbox', 'Radio'].includes(item.component)) {
                  item.category = 'control';
                  allOptions.value.push(item);
                } else {
                  item.category = 'input';
                  allOptions.value.push(item);
                }
              }
            });
        },
        {
          immediate: true,
        },
      );
      // Tùy chọn mang tính điều khiển
      const controlOptions = computed(() => {
        return allOptions.value.filter((item) => {
          return item.category == 'control';
        });
      });
      // Lựa chọn không mang tính điều khiển
      const inputOptions = computed(() => {
        return allOptions.value.filter((item) => {
          return item.category == 'input';
        });
      });
      watch(
        () => formConfig.value.currentItem!.componentProps,
        () => {
          const func = componentPropsFuncs[formConfig.value.currentItem!.component];
          if (func) {
            func(formConfig.value.currentItem!.componentProps, allOptions.value);
          }
        },
        {
          immediate: true,
          deep: true,
        },
      );
      const linkOptions = computed(() => {
        return (
          formConfig.value.schemas &&
          formConfig.value.schemas
            .filter((item) => item.key !== formConfig.value.currentItem!.key)
            .map(({ label, field }) => ({ label: label + '/' + field, value: field }))
        );
      });
      return {
        formConfig,
        showControlAttrs,
        linkOptions,
        controlOptions,
        inputOptions,
      };
    },
  });
</script>
