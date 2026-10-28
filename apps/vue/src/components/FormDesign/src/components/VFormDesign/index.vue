<template>
  <Layout>
    <LayoutSider
      :class="`left ${prefixCls}-sider`"
      collapsible
      collapsedWidth="0"
      width="270"
      :zeroWidthTriggerStyle="{
        'margin-top': '-70px',
        'background-color': 'gray',
      }"
      breakpoint="md"
    >
      <CollapseContainer title="Điều khiển cơ bản">
        <CollapseItem
          :list="baseComponents"
          :handleListPush="handleListPushDrag"
          @add-attrs="handleAddAttrs"
          @handle-list-push="handleListPush"
        />
      </CollapseContainer>
      <CollapseContainer title="Điều khiển tuỳ chỉnh">
        <CollapseItem
          :list="customComponents"
          @add-attrs="handleAddAttrs"
          :handleListPush="handleListPushDrag"
          @handle-list-push="handleListPush"
        />
      </CollapseContainer>
      <CollapseContainer title="Điều khiển bố cục">
        <CollapseItem
          :list="layoutComponents"
          :handleListPush="handleListPushDrag"
          @add-attrs="handleAddAttrs"
          @handle-list-push="handleListPush"
        />
      </CollapseContainer>
    </LayoutSider>
    <LayoutContent>
      <Toolbar
        @handle-open-json-modal="handleOpenModal(jsonModal!)"
        @handle-open-import-json-modal="handleOpenModal(importJsonModal!)"
        @handle-preview="handleOpenModal(eFormPreview!)"
        @handle-preview2="handleOpenModal(eFormPreview2!)"
        @handle-open-code-modal="handleOpenModal(codeModal!)"
        @handle-clear-form-items="handleClearFormItems"
      />
      <FormComponentPanel
        :current-item="formConfig.currentItem"
        :data="formConfig"
        @handle-set-select-item="handleSetSelectItem"
      />
    </LayoutContent>
    <LayoutSider
      :class="`right ${prefixCls}-sider`"
      collapsible
      :reverseArrow="true"
      collapsedWidth="0"
      width="270"
      :zeroWidthTriggerStyle="{ 'margin-top': '-70px', 'background-color': 'gray' }"
      breakpoint="lg"
    >
      <PropsPanel ref="propsPanel" :activeKey="formConfig.activeKey">
        <template v-for="item of formConfig.schemas" #[`${item.component}Props`]="data">
          <slot
            :name="`${item.component}Props`"
            v-bind="{ formItem: data, props: data.componentProps }"
          ></slot>
        </template>
      </PropsPanel>
    </LayoutSider>
  </Layout>

  <JsonModal ref="jsonModal" />
  <CodeModal ref="codeModal" />
  <ImportJsonModal ref="importJsonModal" />
  <VFormPreview ref="eFormPreview" :formConfig="formConfig" />
  <VFormPreview2 ref="eFormPreview2" :formConfig="formConfig" />
</template>

<script lang="ts" setup>
  import CollapseItem from './modules/CollapseItem.vue';
  import FormComponentPanel from './modules/FormComponentPanel.vue';
  import JsonModal from './components/JsonModal.vue';
  import VFormPreview from '../VFormPreview/index.vue';
  import VFormPreview2 from '../VFormPreview/useForm.vue';
  import Toolbar from './modules/Toolbar.vue';
  import PropsPanel from './modules/PropsPanel.vue';
  import ImportJsonModal from './components/ImportJsonModal.vue';
  import CodeModal from './components/CodeModal.vue';
  import 'codemirror/mode/javascript/javascript';
  import { ref, provide, Ref } from 'vue';
  import { Layout, LayoutContent, LayoutSider } from 'ant-design-vue';
  import { IVFormComponent, IFormConfig, PropsTabKey } from '../../typings/v-form-component';
  import { formItemsForEach, generateKey } from '../../utils';
  import { cloneDeep } from 'lodash-es';
  import { baseComponents, customComponents, layoutComponents } from '../../core/formItemConfig';
  import { useRefHistory, UseRefHistoryReturn } from '@vueuse/core';
  import { globalConfigState } from './config/formItemPropsConfig';
  import { IFormDesignMethods, IPropsPanel, IToolbarMethods } from '../../typings/form-type';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { CollapseContainer } from '/@/components/Container/index';
  defineProps({
    title: {
      type: String,
      default: 'Trình thiết kế form v-form-antd',
    },
  });
  const { prefixCls } = useDesign('form-design');
  // Thể hiện của component con
  const propsPanel = ref<null | IPropsPanel>(null);
  const jsonModal = ref<null | IToolbarMethods>(null);
  const importJsonModal = ref<null | IToolbarMethods>(null);
  const eFormPreview = ref<null | IToolbarMethods>(null);
  const eFormPreview2 = ref<null | IToolbarMethods>(null);
  const codeModal = ref<null | IToolbarMethods>(null);
  const formModel = ref({});
  // endregion
  const formConfig = ref<IFormConfig>({
    // Cấu hình form
    schemas: [],
    layout: 'horizontal',
    labelLayout: 'flex',
    labelWidth: 100,
    labelCol: {},
    wrapperCol: {},
    currentItem: {
      component: '',
      componentProps: {},
    },
    activeKey: 1,
  });
  const setFormConfig = (config: IFormConfig) => {
    //Khi import từ bên ngoài, có thể thiếu thông tin cần thiết.
    config.schemas = config.schemas || [];
    config.schemas.forEach((item) => {
      item.colProps = item.colProps || { span: 24 };
      item.componentProps = item.componentProps || {};
      item.itemProps = item.itemProps || {};
    });
    formConfig.value = config;
  };
  // Lấy lịch sử, dùng để hoàn tác và làm lại
  const historyReturn = useRefHistory(formConfig, {
    deep: true,
    capacity: 20,
    parse: (val: IFormConfig) => {
      // Dùng lodash.cloneDeep để sao chép lại dữ liệu, trỏ currentItem tới mục đang chọn
      const formConfig = cloneDeep(val);
      const { currentItem, schemas } = formConfig;
      // Tìm mục đang chọn trong formItems
      const item = schemas && schemas.find((item) => item.key === currentItem?.key);
      // Nếu có thì gán cho mục hiện tại, nếu không thì chuyển bảng thuộc tính
      if (item) {
        formConfig.currentItem = item;
      }
      return formConfig;
    },
  });
  /**
   * Chọn trường form
   * @param schema Trường form đang chọn
   */
  const handleSetSelectItem = (schema: IVFormComponent) => {
    formConfig.value.currentItem = schema;
    handleChangePropsTabs(
      schema.key ? (formConfig.value.activeKey! === 1 ? 2 : formConfig.value.activeKey!) : 1,
    );
  };
  const setGlobalConfigState = (formItem: IVFormComponent) => {
    formItem.colProps = formItem.colProps || {};
    formItem.colProps.span = globalConfigState.span;
    // console.log('setGlobalConfigState', formItem);
  };
  /**
   * Thêm thuộc tính
   * @param schemas
   * @param index
   */
  const handleAddAttrs = (_formItems: IVFormComponent[], _index: number) => {};
  const handleListPushDrag = (item: IVFormComponent) => {
    const formItem = cloneDeep(item);
    setGlobalConfigState(formItem);
    generateKey(formItem);
    return formItem;
  };
  /**
   * Khi nhấn vào điều khiển thì thêm vào bảng
   * @param item {IVFormComponent} Component đang nhấn
   */
  const handleListPush = (item: IVFormComponent) => {
    // console.log('handleListPush', item);
    const formItem = cloneDeep(item);
    setGlobalConfigState(formItem);
    generateKey(formItem);
    if (!formConfig.value.currentItem?.key) {
      handleSetSelectItem(formItem);
      formConfig.value.schemas && formConfig.value.schemas.push(formItem);
      return;
    }
    handleCopy(formItem, false);
  };
  /**
   * Sao chép trường form, nếu trường form là bố cục lưới thì duyệt tất cả các trường form con để tạo lại key
   * @param {IVFormComponent} formItem
   * @return {IVFormComponent}
   */
  const copyFormItem = (formItem: IVFormComponent) => {
    const newFormItem = cloneDeep(formItem);
    if (newFormItem.component === 'Grid') {
      formItemsForEach([formItem], (item) => {
        generateKey(item);
      });
    }
    return newFormItem;
  };
  /**
   * Sao chép hoặc thêm form, khi isCopy là true thì sao chép form
   * @param item {IVFormComponent} Component đang nhấn
   * @param isCopy {boolean} Có sao chép hay không
   */
  const handleCopy = (
    item: IVFormComponent = formConfig.value.currentItem as IVFormComponent,
    isCopy = true,
  ) => {
    const key = formConfig.value.currentItem?.key;
    /**
     * Duyệt cấu hình trường form, nếu là sao chép thì sao chép một trường form, nếu không thì thêm trực tiếp vào trường form
     * @param schemas
     */
    const traverse = (schemas: IVFormComponent[]) => {
      // Dùng some để duyệt, tìm thấy mục tiêu thì dừng duyệt
      schemas.some((formItem: IVFormComponent, index: number) => {
        if (formItem.key === key) {
          // Kiểm tra có phải sao chép hay không
          isCopy
            ? schemas.splice(index, 0, copyFormItem(formItem))
            : schemas.splice(index + 1, 0, item);
          const event = {
            newIndex: index + 1,
          };
          // Thêm vào trường form
          handleBeforeColAdd(event, schemas, isCopy);
          return true;
        }
        if (['Grid', 'Tabs'].includes(formItem.component)) {
          // Bố cục lưới
          formItem.columns?.forEach((item) => {
            traverse(item.children);
          });
        }
      });
    };
    if (formConfig.value.schemas) {
      traverse(formConfig.value.schemas);
    }
  };
  /**
   * Thêm vào form
   * @param newIndex {object} Đối tượng sự kiện
   * @param schemas {IVFormComponent[]} Danh sách trường form
   * @param isCopy {boolean} Có sao chép hay không
   */
  const handleBeforeColAdd = ({ newIndex }: any, schemas: IVFormComponent[], isCopy = false) => {
    const item = schemas[newIndex];
    isCopy && generateKey(item);
    handleSetSelectItem(item);
  };
  /**
   * Mở hộp thoại
   * @param Modal {IToolbarMethods}
   */
  const handleOpenModal = (Modal: IToolbarMethods) => {
    const config = cloneDeep(formConfig.value);
    Modal?.showModal(config);
  };
  /**
   * Chuyển bảng thuộc tính
   * @param key
   */
  const handleChangePropsTabs = (key: PropsTabKey) => {
    formConfig.value.activeKey = key;
  };
  /**
   * Xoá sạch danh sách trường form
   */
  const handleClearFormItems = () => {
    formConfig.value.schemas = [];
    handleSetSelectItem({ component: '' });
  };
  const setFormModel = (key, value) => (formModel.value[key] = value);
  provide('formModel', formModel);
  // Inject các phương thức của component tổ tiên vào component con, component con có thể lấy qua inject
  provide<(key: String, value: any) => void>('setFormModelMethod', setFormModel);
  // region Các thuộc tính inject cho component con
  // provide('currentItem', formConfig.value.currentItem)
  // Inject các mục cấu hình form vào component con, component con có thể lấy qua inject, dữ liệu lấy được là reactive
  provide<Ref<IFormConfig>>('formConfig', formConfig);
  // Inject lịch sử
  provide<UseRefHistoryReturn<any, any>>('historyReturn', historyReturn);
  // Inject các phương thức của component tổ tiên vào component con, component con có thể lấy qua inject
  provide<IFormDesignMethods>('formDesignMethods', {
    handleBeforeColAdd,
    handleCopy,
    handleListPush,
    handleSetSelectItem,
    handleAddAttrs,
    setFormConfig,
  });
  // endregion
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-form-design';

  [data-theme='dark'] {
  .@{prefix-cls}-sider{
    background-color: #1f1f1f;
  }}

  [data-theme='light'] {
    .@{prefix-cls}-sider{
    background-color: #fff;
  }
  }
</style>
