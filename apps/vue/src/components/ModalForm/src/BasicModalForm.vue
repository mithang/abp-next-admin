<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :title="title"
    :width="width"
    :height="height"
    :minHeight="minHeight"
    :maskClosable="maskClosable"
    @ok="handleSubmit"
    @visible-change="handleVisible"
  >
    <BasicForm @register="registerForm" :model="model" />
  </BasicModal>
</template>

<script lang="ts">
  import { computed, defineComponent, ref } from 'vue';

  import { useI18n } from '/@/hooks/web/useI18n';

  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form/index';

  const props = {
    /** Nhận một định nghĩa biểu mẫu động */
    formItems: { type: Array as PropType<Array<FormSchema>>, required: true },
    /** Tiêu đề cửa sổ popup */
    title: { type: String, required: true },
    /** Sự kiện cần gọi sau khi nhấn nút xác nhận
     *  Phải là hàm trả về kiểu Promise
     */
    saveChanges: { type: Function as PropType<(data: any) => Promise<any>>, required: true },
    labelWidth: { type: Number, default: 120 },
    width: { type: Number, default: 500 },
    height: { type: Number, default: 356 },
    minHeight: { type: Number },
    maskClosable: { type: Boolean, default: false },
  } as const;

  export default defineComponent({
    name: 'BasicModalForm',
    components: {
      BasicForm,
      BasicModal,
    },
    props,
    emits: ['register'],
    setup(props) {
      const model = ref({} as Recordable);
      const { t } = useI18n();

      const schemas = computed(() => {
        return props.formItems;
      });

      const [registerForm, { validate, getFieldsValue, resetFields }] = useForm({
        labelWidth: props.labelWidth,
        schemas,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 24,
        },
      });
      const [register, { setModalProps, closeModal }] = useModalInner((dataVal) => {
        model.value = dataVal;
      });

      return {
        t,
        registerForm,
        register,
        model,
        setModalProps,
        validate,
        resetFields,
        getFieldsValue,
        closeModal,
      };
    },
    methods: {
      handleSubmit() {
        this.validate().then(() => {
          this.changeModalManeuverability(false);
          this.saveChanges(this.getFieldsValue())
            .then(() => {
              this.closeModal();
            })
            .finally(() => {
              this.changeModalManeuverability(true);
            });
        });
      },
      handleVisible(visible: Boolean) {
        if (!visible) {
          this.resetFields();
        }
      },
      changeModalManeuverability(allow: boolean) {
        this.setModalProps({
          loading: !allow,
          confirmLoading: !allow,
          showCancelBtn: allow,
          closable: allow,
        });
      },
    },
  });
</script>
