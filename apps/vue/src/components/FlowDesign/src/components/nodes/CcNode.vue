<template>
  <Node
    :title="config.name"
    :show-error="state.showError"
    :content="content"
    :error-info="state.errorInfo"
    @selected="$emit('selected')"
    @delNode="$emit('delNode')"
    @insertNode="(type) => $emit('insertNode', type)"
    placeholder="Vui lòng đặt người nhận bản sao"
    header-bgc="#3296fa"
  >
    <template #headerIcon>
      <SettingOutlined />
    </template>
  </Node>
</template>

<script lang="ts">
  export default {
    name: 'CC',
  };
</script>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { SettingOutlined } from '@ant-design/icons-vue';
  import Node from './Node.vue';

  defineEmits(['delNode', 'insertNode', 'selected']);
  const props = defineProps({
    config: {
      type: Object,
      default: () => {
        return {};
      },
    },
  });
  const content = computed(() => {
    if (props.config.props.shouldAdd) {
      return 'Do người khởi tạo chỉ định';
    } else if (props.config.props.assignedUser.length > 0) {
      let texts: string[] = [];
      props.config.props.assignedUser.forEach((org) => texts.push(org.name));
      return String(texts).replaceAll(',', '、');
    } else {
      return undefined;
    }
  });
  const state = reactive({
    showError: false,
    errorInfo: '',
  });
  //Kiểm tra tính hợp lệ của cấu hình dữ liệu
  function validate(err: string[]) {
    state.showError = false;
    if (props.config.props.shouldAdd) {
      state.showError = false;
    } else if (props.config.props.assignedUser.length === 0) {
      state.showError = true;
      state.errorInfo = 'Vui lòng chọn người cần nhận bản sao';
    }
    if (state.showError) {
      err.push(`Nút nhận bản sao ${props.config.name} chưa đặt người nhận bản sao`);
    }
    return !state.showError;
  }

  defineExpose({
    validate,
  });
</script>

<style scoped></style>
