<!--
 * @Description: Nhập mẫu JSON
-->
<template>
  <Modal
    title="Dữ liệu JSON"
    :visible="state.visible"
    @ok="handleImportJson"
    @cancel="handleCancel"
    cancelText="Đóng"
    :destroyOnClose="true"
    wrapClassName="v-code-modal"
    style="top: 20px"
    :width="850"
  >
    <p class="hint-box">Định dạng nhập như sau:</p>
    <div class="v-json-box">
      <CodeEditor v-model:value="state.json" ref="myEditor" :mode="MODE.JSON" />
    </div>

    <template #footer>
      <Button @click="handleCancel">Hủy</Button>
      <Upload
        class="upload-button"
        :beforeUpload="beforeUpload"
        :showUploadList="false"
        accept="application/json"
      >
        <Button type="primary">Nhập file json</Button>
      </Upload>
      <Button type="primary" @click="handleImportJson">Xác nhận</Button>
    </template>
  </Modal>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { Button } from 'ant-design-vue';
  // import message from '../../../utils/message';
  import { useFormDesignState } from '../../../hooks/useFormDesignState';
  // import { codemirror } from 'vue-codemirror-lite';
  import { IFormConfig } from '../../../typings/v-form-component';
  import { formItemsForEach, generateKey } from '../../../utils';
  import { CodeEditor, MODE } from '/@/components/CodeEditor';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Upload, Modal } from 'ant-design-vue';
  const { createMessage } = useMessage();
  const state = reactive({
    visible: false,
    json: `{
"schemas": [
{
  "component": "input",
  "label": "Hộp nhập",
  "field": "input_2",
  "span": 24,
  "props": {
    "type": "text"
  }
}
],
"layout": "horizontal",
"labelLayout": "flex",
"labelWidth": 100,
"labelCol": {},
"wrapperCol": {}
}`,
    jsonData: {
      schemas: {},
      config: {},
    },
    handleSetSelectItem: null,
  });
  const { formDesignMethods } = useFormDesignState();
  const handleCancel = () => {
    state.visible = false;
  };
  const showModal = () => {
    state.visible = true;
  };
  const handleImportJson = () => {
    // Nhập JSON
    try {
      const editorJsonData = JSON.parse(state.json) as IFormConfig;
      editorJsonData.schemas &&
        formItemsForEach(editorJsonData.schemas, (formItem) => {
          generateKey(formItem);
        });
      formDesignMethods.setFormConfig({
        ...editorJsonData,
        activeKey: 1,
        currentItem: { component: '' },
      });
      handleCancel();
      createMessage.success('Nhập thành công');
    } catch {
      createMessage.error('Nhập thất bại, định dạng dữ liệu không đúng');
    }
  };
  const beforeUpload = (e: File) => {
    // Nhập qua file json
    const reader = new FileReader();
    reader.readAsText(e);
    reader.onload = function () {
      state.json = this.result as string;
      handleImportJson();
    };
    return false;
  };

  defineExpose({
    showModal,
  });
</script>

<style lang="less" scoped>
  .upload-button {
    margin: 0 10px;
  }
</style>
