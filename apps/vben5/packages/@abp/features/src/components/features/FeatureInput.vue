<script setup lang="ts">
import type { Validator } from '@abp/core';

import type { FeatureDto } from '../../types/features';

import { computed } from 'vue';

import { useValidation } from '@abp/core';
import { Checkbox, Form, Input, InputNumber, Select } from 'ant-design-vue';

const props = defineProps<{
  feature: FeatureDto;
  featureIndex: number;
  groupIndex: number;
}>();

const emit = defineEmits<{
  (event: 'change', feature: FeatureDto, groupIndex: number, value: any): void;
}>();

const FormItem = Form.Item;

const {
  fieldMustBeetWeen,
  fieldMustBeStringWithMinimumLengthAndMaximumLength,
  fieldRequired,
} = useValidation();

function createRules(field: string, validator: Validator) {
  const featureRules: any[] = [];
  if (validator?.properties) {
    switch (validator.name) {
      case 'NUMERIC': {
        featureRules.push(
          ...fieldMustBeetWeen({
            end: Number(validator.properties.MaxValue),
            name: field,
            start: Number(validator.properties.MinValue),
            trigger: 'change',
          }),
        );
        break;
      }
      case 'STRING': {
        if (validator.properties.AllowNull?.toLowerCase() === 'true') {
          featureRules.push(
            ...fieldRequired({
              name: field,
              trigger: 'blur',
            }),
          );
        }
        featureRules.push(
          ...fieldMustBeStringWithMinimumLengthAndMaximumLength({
            maximum: Number(validator.properties.MaxLength),
            minimum: Number(validator.properties.MinLength),
            name: field,
            trigger: 'blur',
          }),
        );
        break;
      }
    }
  }
  return featureRules;
}

// Không v-model trực tiếp vào prop `feature` (vue/no-mutating-props):
// chỉ hiển thị giá trị (`:checked`/`:value`) và emit giá trị mới;
// component sở hữu formModel (FeaturesModal2) sẽ ghi giá trị đó.
function handleChange(value: any) {
  emit('change', props.feature, props.groupIndex, value);
}

const isCheckbox = computed(
  () =>
    props.feature.valueType?.name === 'ToggleStringValueType' &&
    props.feature.valueType?.validator?.name === 'BOOLEAN',
);

const isFreeText = computed(
  () => props.feature.valueType?.name === 'FreeTextStringValueType',
);

const isNumeric = computed(
  () => props.feature.valueType?.validator?.name === 'NUMERIC',
);

const isSelection = computed(
  () => props.feature.valueType?.name === 'SelectionStringValueType',
);
</script>

<template>
  <FormItem
    v-if="feature.valueType !== null"
    :name="['groups', groupIndex, 'features', featureIndex, 'value']"
    :label="feature.displayName"
    :extra="feature.description"
    :rules="createRules(feature.displayName, feature.valueType.validator)"
  >
    <!-- Loại hộp kiểm -->
    <Checkbox
      v-if="isCheckbox"
      :checked="feature.value"
      @update:checked="(val) => handleChange(val)"
    >
      {{ feature.displayName }}
    </Checkbox>

    <!-- Loại văn bản/số -->
    <div v-else-if="isFreeText">
      <InputNumber
        v-if="isNumeric"
        style="width: 100%"
        :value="feature.value"
        @update:value="(val) => handleChange(val)"
      />
      <Input
        v-else
        :value="feature.value"
        autocomplete="off"
        @update:value="(val) => handleChange(val)"
      />
    </div>

    <!-- Loại lựa chọn -->
    <Select
      v-else-if="isSelection"
      :value="feature.value"
      :options="feature.valueType.itemSource?.items"
      :field-names="{ label: 'displayName', value: 'value' }"
      @update:value="(val) => handleChange(val)"
    />
  </FormItem>
</template>
