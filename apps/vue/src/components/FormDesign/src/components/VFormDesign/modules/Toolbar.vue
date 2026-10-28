<!--
 * @Description: Thanh công cụ
-->
<template>
  <div class="operating-area">
    <!-- Vùng nút thao tác ở đầu trang start -->
    <!-- Vùng bên trái thao tác start -->
    <div class="left-btn-box">
      <Tooltip v-for="item in toolbarsConfigs" :title="item.title" :key="item.icon">
        <a @click="$emit(item.event)" class="toolbar-text">
          <Icon :icon="item.icon" />
        </a>
      </Tooltip>
      <Divider type="vertical" />
      <Tooltip title="Hoàn tác">
        <a :class="{ disabled: !canUndo }" :disabled="!canUndo" @click="undo">
          <Icon icon="ant-design:undo-outlined" />
        </a>
      </Tooltip>
      <Tooltip title="Làm lại">
        <a :class="{ disabled: !canRedo }" :disabled="!canRedo" @click="redo">
          <Icon icon="ant-design:redo-outlined" />
        </a>
      </Tooltip>
    </div>
  </div>
  <!-- Vùng thao tác start -->
</template>
<script lang="ts">
  import { defineComponent, inject, reactive, toRefs } from 'vue';
  import { UseRefHistoryReturn } from '@vueuse/core';
  import { IFormConfig } from '../../../typings/v-form-component';
  import { Tooltip, Divider } from 'ant-design-vue';
  import Icon from '/@/components/Icon/index';
  interface IToolbarsConfig {
    type: string;
    title: string;
    icon: string;
    event: string;
  }
  export default defineComponent({
    name: 'OperatingArea',
    components: {
      Tooltip,
      Icon,
      Divider,
    },
    setup() {
      const state = reactive<{
        toolbarsConfigs: IToolbarsConfig[];
      }>({
        toolbarsConfigs: [
          {
            title: 'Xem trước - hỗ trợ bố cục',
            type: 'preview',
            event: 'handlePreview',
            icon: 'ant-design:chrome-filled',
          },
          {
            title: 'Xem trước - không hỗ trợ bố cục',
            type: 'preview',
            event: 'handlePreview2',
            icon: 'ant-design:chrome-filled',
          },
          {
            title: 'Nhập JSON',
            type: 'importJson',
            event: 'handleOpenImportJsonModal',
            icon: 'ant-design:import-outlined',
          },
          {
            title: 'Tạo JSON',
            type: 'exportJson',
            event: 'handleOpenJsonModal',
            icon: 'ant-design:export-outlined',
          },
          {
            title: 'Tạo code',
            type: 'exportCode',
            event: 'handleOpenCodeModal',
            icon: 'ant-design:code-filled',
          },
          {
            title: 'Dọn sạch',
            type: 'reset',
            event: 'handleClearFormItems',
            icon: 'ant-design:clear-outlined',
          },
        ],
      });
      const historyRef = inject('historyReturn') as UseRefHistoryReturn<IFormConfig, IFormConfig>;
      const { undo, redo, canUndo, canRedo } = historyRef;
      return { ...toRefs(state), undo, redo, canUndo, canRedo };
    },
  });
</script>

<style lang="less" scoped>
  //noinspection CssUnknownTarget
  @import url('../styles/variable.less');

  .operating-area {
    border-bottom: 2px solid @border-color;
    font-size: 16px;
    text-align: left;
    height: @operating-area-height;
    line-height: @operating-area-height;
    padding: 0 12px;
    display: flex;
    justify-content: space-between;
    align-content: center;
    padding-left: 30px;

    a {
      color: #666;
      margin: 0 5px;

      &.disabled,
      &.disabled:hover {
        color: #ccc;
      }

      &:hover {
        color: @primary-color;
      }

      > span {
        font-size: 14px;
        padding-left: 2px;
      }
    }
  }
</style>
