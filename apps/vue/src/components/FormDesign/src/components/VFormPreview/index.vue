<!--
 * @Description: Render component, không thể dùng component của Vben
-->
<template>
  <Modal
    title="Xem trước (hỗ trợ bố cục)"
    :visible="visible"
    @ok="handleGetData"
    @cancel="handleCancel"
    okText="Lấy dữ liệu"
    cancelText="Đóng"
    style="top: 20px"
    :destroyOnClose="true"
    :width="900"
  >
    <VFormCreate
      :form-config="formConfig"
      v-model:fApi="fApi"
      v-model:formModel="formModel"
      @submit="onSubmit"
    >
      <template #slotName="{ formModel, field }">
        <a-input v-model:value="formModel[field]" placeholder="Tôi là ô nhập được truyền qua slot" />
      </template>
    </VFormCreate>
    <JsonModal ref="jsonModal" />
  </Modal>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, toRefs } from 'vue';
  import { IFormConfig } from '../../typings/v-form-component';
  import { IAnyObject } from '../../typings/base-type';
  import VFormCreate from '../VFormCreate/index.vue';
  import { formatRules } from '../../utils';
  import { IVFormMethods } from '../../hooks/useVFormMethods';
  import JsonModal from '../VFormDesign/components/JsonModal.vue';
  import { IToolbarMethods } from '../../typings/form-type';
  import { Modal } from 'ant-design-vue';
  export default defineComponent({
    name: 'VFormPreview',
    components: {
      JsonModal,
      VFormCreate,
      Modal,
    },
    setup() {
      const jsonModal = ref<IToolbarMethods | null>(null);
      const state = reactive<{
        formModel: IAnyObject;
        visible: boolean;
        formConfig: IFormConfig;
        fApi: IVFormMethods;
      }>({
        formModel: {},
        formConfig: {} as IFormConfig,
        visible: false,
        fApi: {} as IVFormMethods,
      });
      /**
       * Hiển thị hộp thoại dữ liệu Json
       * @param jsonData
       */
      const showModal = (jsonData: IFormConfig) => {
        // console.log('showModal-', jsonData);
        formatRules(jsonData.schemas);
        state.formConfig = jsonData;
        state.visible = true;
      };
      /**
       * Lấy dữ liệu form
       * @return {Promise<void>}
       */
      const handleCancel = () => {
        state.visible = false;
        state.formModel = {};
      };
      const handleGetData = async () => {
        const _data = await state.fApi.submit?.();
        jsonModal.value?.showModal?.(_data);
      };
      const onSubmit = (_data: IAnyObject) => {
        //
      };
      const onCancel = () => {
        state.formModel = {};
      };
      return {
        handleGetData,
        handleCancel,
        ...toRefs(state),
        showModal,
        jsonModal,
        onSubmit,
        onCancel,
      };
    },
  });
</script>
