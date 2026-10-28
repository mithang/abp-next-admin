<template>
  <Node
    :title="config.name"
    :show-error="state.showError"
    :content="content"
    :error-info="state.errorInfo"
    @selected="$emit('selected')"
    @delNode="$emit('delNode')"
    @insertNode="(type) => $emit('insertNode', type)"
    placeholder="Vui lòng đặt đường dẫn kích hoạt hoạt động"
    header-bgc="#3296fa"
  >
    <template #headerIcon>
      <GlobalOutlined />
    </template>
  </Node>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { GlobalOutlined } from '@ant-design/icons-vue';
  import { isNullOrWhiteSpace } from '/@/utils/strings';
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
    return props.config.props.path;
  });
  const state = reactive({
    showError: false,
    errorInfo: '',
  });

  function validate(err: string[]) {
    state.showError = false;
    if (isNullOrWhiteSpace(props.config.props.name)) {
      state.showError = true;
      state.errorInfo = 'Vui lòng đặt tên hoạt động';
      return;
    }
    if (isNullOrWhiteSpace(props.config.props.path)) {
      state.showError = true;
      state.errorInfo = 'Vui lòng đặt địa chỉ yêu cầu kích hoạt hoạt động';
      return;
    }
    if (Array.isArray(props.config.props.methods) && props.config.props.methods.length === 0) {
      state.showError = true;
      state.errorInfo = 'Vui lòng đặt phương thức yêu cầu kích hoạt hoạt động';
      return;
    }
    if (state.showError) {
      err.push(`${props.config.name} cấu hình hoạt động chưa được đặt đầy đủ`);
    }
    return !state.showError;
  }

  defineExpose({
    validate,
  });
</script>

<style scoped></style>
