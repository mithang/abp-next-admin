<!--
 * @Description: Control bảng thuộc tính bên phải, bảng thuộc tính form
-->
<template>
  <div class="properties-content">
    <Form class="properties-body" label-align="left" layout="vertical">
      <!--      <e-upload v-model="fileList"></e-upload>-->

      <FormItem label="Bố cục form">
        <RadioGroup button-style="solid" v-model:value="formConfig.layout">
          <RadioButton value="horizontal">Ngang</RadioButton>
          <RadioButton value="vertical" :disabled="formConfig.labelLayout === 'Grid'">
            Dọc
          </RadioButton>
          <RadioButton value="inline" :disabled="formConfig.labelLayout === 'Grid'">
            Nội tuyến
          </RadioButton>
        </RadioGroup>
      </FormItem>

      <!-- <Row> -->
      <FormItem label="Bố cục nhãn">
        <RadioGroup
          buttonStyle="solid"
          v-model:value="formConfig.labelLayout"
          @change="lableLayoutChange"
        >
          <RadioButton value="flex">Cố định</RadioButton>
          <RadioButton value="Grid" :disabled="formConfig.layout !== 'horizontal'">
            Lưới
          </RadioButton>
        </RadioGroup>
      </FormItem>
      <!-- </Row> -->
      <FormItem label="Chiều rộng nhãn (px)" v-show="formConfig.labelLayout === 'flex'">
        <InputNumber
          :style="{ width: '100%' }"
          v-model:value="formConfig.labelWidth"
          :min="0"
          :step="1"
        />
      </FormItem>
      <div v-if="formConfig.labelLayout === 'Grid'">
        <FormItem label="labelCol">
          <Slider v-model:value="formConfig.labelCol!.span" :max="24" />
        </FormItem>
        <FormItem label="wrapperCol">
          <Slider v-model:value="formConfig.wrapperCol!.span" :max="24" />
        </FormItem>

        <FormItem label="Căn chỉnh nhãn">
          <RadioGroup button-style="solid" v-model:value="formConfig.labelAlign">
            <RadioButton value="left">Căn trái</RadioButton>
            <RadioButton value="right">Căn phải</RadioButton>
          </RadioGroup>
        </FormItem>

        <FormItem label="Kích thước control">
          <RadioGroup button-style="solid" v-model:value="formConfig.size">
            <RadioButton value="default">Mặc định</RadioButton>
            <RadioButton value="small">Nhỏ</RadioButton>
            <RadioButton value="large">Lớn</RadioButton>
          </RadioGroup>
        </FormItem>
      </div>
      <FormItem label="Thuộc tính form">
        <Col
          ><Checkbox v-model:checked="formConfig.colon" v-if="formConfig.layout == 'horizontal'"
            >Hiển thị dấu hai chấm sau label</Checkbox
          ></Col
        >
        <Col><Checkbox v-model:checked="formConfig.disabled">Vô hiệu hóa</Checkbox></Col>
        <Col><Checkbox v-model:checked="formConfig.hideRequiredMark">Ẩn dấu bắt buộc</Checkbox></Col>
      </FormItem>
    </Form>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { useFormDesignState } from '../../../hooks/useFormDesignState';
  import { InputNumber, Slider, Checkbox, Col, RadioChangeEvent } from 'ant-design-vue';
  // import RadioButtonGroup from '/@/components/RadioButtonGroup.vue';
  import { Form, FormItem, Radio } from 'ant-design-vue';
  export default defineComponent({
    name: 'FormProps',
    components: {
      InputNumber,
      Slider,
      Checkbox,
      RadioGroup: Radio.Group,
      RadioButton: Radio.Button,
      Form,
      FormItem,
      Col,
    },
    setup() {
      const { formConfig } = useFormDesignState();
      formConfig.value = formConfig.value || {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 },
      };
      const lableLayoutChange = (e: RadioChangeEvent) => {
        if (e.target.value === 'Grid') {
          formConfig.value.layout = 'horizontal';
        }
      };
      return { formConfig, lableLayoutChange };
    },
  });
</script>
