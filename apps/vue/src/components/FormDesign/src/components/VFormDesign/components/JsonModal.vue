<!--
 * @Description: Render dữ liệu JSON
-->
<template>
  <Modal
    title="Dữ liệu JSON"
    :footer="null"
    :visible="visible"
    @cancel="handleCancel"
    :destroyOnClose="true"
    wrapClassName="v-code-modal"
    style="top: 20px"
    width="850px"
  >
    <PreviewCode :editorJson="editorJson" />
  </Modal>
</template>
<script lang="ts">
  import { computed, defineComponent, reactive, toRefs } from 'vue';
  import PreviewCode from './PreviewCode.vue';
  import { IFormConfig } from '../../../typings/v-form-component';
  import { formatRules, removeAttrs } from '../../../utils';
  import { Modal } from 'ant-design-vue';
  export default defineComponent({
    name: 'JsonModal',
    components: {
      PreviewCode,
      Modal,
    },
    emits: ['cancel'],
    setup(_props, { emit }) {
      const state = reactive<{
        visible: boolean;
        jsonData: IFormConfig;
      }>({
        visible: false, // Điều khiển hiển thị hộp thoại dữ liệu json
        jsonData: {} as IFormConfig, // dữ liệu json
      });
      /**
       * Hiển thị hộp thoại dữ liệu Json
       * @param jsonData
       */
      const showModal = (jsonData: IFormConfig) => {
        formatRules(jsonData.schemas);
        state.jsonData = jsonData;
        state.visible = true;
      };
      // Tính toán dữ liệu json
      const editorJson = computed(() => {
        return JSON.stringify(removeAttrs(state.jsonData), null, '\t');
      });
      // Đóng hộp thoại
      const handleCancel = () => {
        state.visible = false;
        emit('cancel');
      };
      return { ...toRefs(state), editorJson, handleCancel, showModal };
    },
  });
</script>
