<template>
  <Node
    :title="config.name"
    :show-error="state.showError"
    :content="content"
    :error-info="state.errorInfo"
    @selected="$emit('selected')"
    @delNode="$emit('delNode')"
    @insertNode="(type) => $emit('insertNode', type)"
    placeholder="Vui lòng đặt thời gian trễ"
    header-bgc="#f25643"
  >
    <template #headerIcon>
      <ClockCircleOutlined />
    </template>
  </Node>
</template>

<script lang="ts">
  export default {
    name: 'Delay',
  };
</script>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { ClockCircleOutlined } from '@ant-design/icons-vue';
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
  const state = reactive({
    showError: false,
    errorInfo: '',
  });

  const content = computed(() => {
    if (props.config.props.type === 'FIXED') {
      return `Chờ ${props.config.props.time} ${getName(props.config.props.unit)}`;
    } else if (props.config.props.type === 'AUTO') {
      return `Đến ${props.config.props.dateTime} trong ngày`;
    } else {
      return undefined;
    }
  });

  function getName(unit: string) {
    switch (unit) {
      case 'D':
        return 'ngày';
      case 'H':
        return 'giờ';
      case 'M':
        return 'phút';
      default:
        return 'Không xác định';
    }
  }

  function validate(err: string[]) {
    state.showError = false;
    try {
      if (props.config.props.type === 'AUTO') {
        if ((props.config.props.dateTime || '') === '') {
          state.showError = true;
          state.errorInfo = 'Vui lòng chọn thời điểm';
        }
      } else {
        if (props.config.props.time <= 0) {
          state.showError = true;
          state.errorInfo = 'Vui lòng đặt thời lượng trễ';
        }
      }
    } catch (e) {
      state.showError = true;
      state.errorInfo = 'Cấu hình gặp vấn đề';
    }
    if (state.showError) {
      err.push(`${props.config.name} chưa đặt quy tắc trễ`);
    }
    return !state.showError;
  }

  defineExpose({
    validate,
  });
</script>

<style scoped></style>
