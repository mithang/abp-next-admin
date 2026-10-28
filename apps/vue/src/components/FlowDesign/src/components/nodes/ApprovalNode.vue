<template>
  <Node
    :title="config.name"
    :show-error="state.showError"
    :content="content"
    :error-info="state.errorInfo"
    @selected="$emit('selected')"
    @delNode="$emit('delNode')"
    @insertNode="(type) => $emit('insertNode', type)"
    placeholder="Vui lòng đặt người phê duyệt"
    header-bgc="#ff943e"
  >
    <template #headerIcon>
      <UserOutlined />
    </template>
  </Node>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { UserOutlined } from '@ant-design/icons-vue';
  import { useFlowStoreWithOut } from '/@/store/modules/flow';
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
    console.log('props', props);
    const config = props.config.props;
    switch (config.assignedType) {
      case 'ASSIGN_USER':
        if (config.assignedUser.length > 0) {
          let texts: string[] = [];
          config.assignedUser.forEach((org) => texts.push(org.name));
          return String(texts).replaceAll(',', '、');
        } else {
          return 'Vui lòng chỉ định người phê duyệt';
        }
      case 'SELF':
        return 'Chính người khởi tạo';
      case 'SELF_SELECT':
        return config.selfSelect.multiple ? 'Người khởi tạo tự chọn nhiều người' : 'Người khởi tạo tự chọn một người';
      case 'FORM_USER':
        if (!config.formUser || config.formUser === '') {
          return 'Liên hệ trong biểu mẫu（chưa chọn）';
        } else {
          let text = getFormItemById(config.formUser);
          if (text && text.title) {
            return `Người trong biểu mẫu（${text.title}）`;
          } else {
            return 'Biểu mẫu này đã bị xóa😥';
          }
        }
      case 'ROLE':
        if (config.role.length > 0) {
          let texts: string[] = [];
          config.role.forEach((org) => texts.push(org.name));
          return String(texts).replaceAll(',', '、');
        } else {
          return 'Vai trò được chỉ định（chưa đặt）';
        }
      default:
        return 'Mục cài đặt không xác định😥';
    }
  });
  const state = reactive({
    showError: false,
    errorInfo: '',
    validate: {} as any,
  });
  const flowStore = useFlowStoreWithOut();

  function getFormItemById(id: any) {
    return flowStore.design.formItems.find((item) => item.id === id);
  }

  function validate(err: string[]) {
    try {
      return (state.showError =
        !state.validate[`validate_${props.config.props.assignedType}`](err));
    } catch (e) {
      return true;
    }
  }

  function validate_ASSIGN_USER(err: string[]) {
    if (props.config.props.assignedUser.length > 0) {
      return true;
    } else {
      state.errorInfo = 'Vui lòng chỉ định nhân viên phê duyệt';
      err.push(`${props.config.name} Chưa chỉ định nhân viên phê duyệt`);
      return false;
    }
  }

  function validate_SELF_SELECT(err: string[]) {
    console.log(err);
    return true;
  }

  function validate_LEADER_TOP(err: string[]) {
    console.log(err);
    return true;
  }

  function validate_LEADER(err: string[]) {
    console.log(err);
    return true;
  }

  function validate_ROLE(err: string[]) {
    if (props.config.props.role.length <= 0) {
      state.errorInfo = 'Vui lòng chỉ định vai trò hệ thống chịu trách nhiệm phê duyệt';
      err.push(`${props.config.name} Chưa chỉ định vai trò phê duyệt`);
      return false;
    }
    return true;
  }

  function validate_SELF(err: string[]) {
    console.log(err);
    return true;
  }

  function validate_FORM_USER(err: string[]) {
    if (props.config.props.formUser === '') {
      state.errorInfo = 'Vui lòng chỉ định component người trong biểu mẫu';
      err.push(`${props.config.name} Người phê duyệt là người trong biểu mẫu，nhưng chưa được chỉ định`);
      return false;
    }
    return true;
  }

  function validate_REFUSE(err: string[]) {
    console.log(err);
    return true;
  }

  defineExpose({
    validate,
    validate_ASSIGN_USER,
    validate_SELF_SELECT,
    validate_LEADER_TOP,
    validate_LEADER,
    validate_ROLE,
    validate_SELF,
    validate_FORM_USER,
    validate_REFUSE,
  });
</script>

<style scoped></style>
