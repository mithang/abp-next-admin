<!--
 * @Description: Render bằng chức năng của vbenForm
-->
<template>
  <Modal
    title="Xem trước (không hỗ trợ bố cục)"
    :visible="state.visible"
    @ok="handleGetData"
    @cancel="handleCancel"
    okText="Lấy dữ liệu"
    cancelText="Đóng"
    style="top: 20px"
    :destroyOnClose="true"
    :width="900"
  >
    <BasicForm v-bind="attrs" @register="registerForm" />
    <JsonModal ref="jsonModal" />
  </Modal>
</template>
<script lang="ts" setup>
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { reactive, ref, computed } from 'vue';
  import { IFormConfig } from '../../typings/v-form-component';
  import { IAnyObject } from '../../typings/base-type';
  import JsonModal from '../VFormDesign/components/JsonModal.vue';
  import { IToolbarMethods } from '../../typings/form-type';
  import { Modal } from 'ant-design-vue';
  const jsonModal = ref<IToolbarMethods | null>(null);
  const state = reactive<{
    formModel: IAnyObject;
    visible: boolean;
    formConfig: IFormConfig;
  }>({
    formModel: {},
    formConfig: {} as IFormConfig,
    visible: false,
  });
  const attrs = computed(() => {
    return {
      ...state.formConfig,
    } as Recordable;
  });
  /**
   * Hiển thị hộp thoại dữ liệu Json
   * @param jsonData
   */
  const showModal = (jsonData: IFormConfig) => {
    state.formConfig = jsonData;
    state.visible = true;
  };
  //Form
  const [registerForm, { validate }] = useForm();
  const handleCancel = () => {
    state.visible = false;
  };
  /**
   * Lấy dữ liệu form
   * @return {Promise<void>}
   */
  const handleGetData = async () => {
    let data = await validate();
    jsonModal.value?.showModal?.(data);
  };
  defineExpose({ showModal });
</script>
