<!--
 * @Description: Bảng bố cục form ở giữa
 * https://github.com/SortableJS/vue.draggable.next/issues/138
-->
<template>
  <div class="form-panel v-form-container">
    <Empty
      class="empty-text"
      v-show="formConfig.schemas.length === 0"
      description="Thêm bằng cách chọn control từ bên trái"
    />
    <Form v-bind="formConfig">
      <div class="draggable-box">
        <draggable
          class="list-main ant-row"
          group="form-draggable"
          :component-data="{ name: 'list', tag: 'div', type: 'transition-group' }"
          ghostClass="moving"
          :animation="180"
          handle=".drag-move"
          v-model="formConfig.schemas"
          item-key="key"
          @add="addItem"
          @start="handleDragStart"
        >
          <template #item="{ element }">
            <LayoutItem
              class="drag-move"
              :schema="element"
              :data="formConfig"
              :current-item="formConfig.currentItem || {}"
            />
          </template>
        </draggable>
      </div>
    </Form>
  </div>
</template>
<script lang="ts">
  import draggable from 'vuedraggable';
  import { defineComponent, computed } from 'vue';
  import LayoutItem from '../components/LayoutItem.vue';
  import { cloneDeep } from 'lodash-es';
  import { useFormDesignState } from '../../../hooks/useFormDesignState';
  import { Form, Empty } from 'ant-design-vue';
  export default defineComponent({
    name: 'FormComponentPanel',
    components: {
      LayoutItem,
      draggable,
      Form,
      Empty,
    },
    emits: ['handleSetSelectItem'],
    setup(_, { emit }) {
      const { formConfig } = useFormDesignState() as Recordable;
      /**
       * Sự kiện hoàn tất kéo thả
       * @param newIndex
       */
      const addItem = ({ newIndex }: any) => {
        formConfig.value.schemas = formConfig.value.schemas || [];
        const schemas = formConfig.value.schemas;
        schemas[newIndex] = cloneDeep(schemas[newIndex]);
        emit('handleSetSelectItem', schemas[newIndex]);
      };
      /**
       * Sự kiện bắt đầu kéo thả
       * @param e {Object} Đối tượng sự kiện
       */
      const handleDragStart = (e: any) => {
        emit('handleSetSelectItem', formConfig.value.schemas[e.oldIndex]);
      };
      // Lấy currentItem do component tổ tiên truyền xuống
      // Tính toán phần tử bố cục, ở chế độ ngang là ACol, ở chế độ không ngang là div
      const layoutTag = computed(() => {
        return formConfig.value.layout === 'horizontal' ? 'Col' : 'div';
      });
      return {
        addItem,
        handleDragStart,
        formConfig,
        layoutTag,
      };
    },
  });
</script>

<style lang="less" scoped>
  @import url(../styles/variable.less);
  @import url(../styles/drag.less);

  .v-form-container {
    // Kiểu bố cục nội tuyến
    .ant-form-inline {
      .list-main {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-content: flex-start;

        .layout-width {
          width: 100%;
        }
      }

      .ant-form-item-control-wrapper {
        min-width: 175px !important;
      }
    }
  }

  .form-panel {
    position: relative;
    height: 100%;

    .empty-text {
      color: #aaa;
      height: 150px;
      top: -10%;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      position: absolute;
      z-index: 100;
    }

    .draggable-box {
      // width: 100%;
      .drag-move {
        cursor: move;
        min-height: 62px;
      }

      .list-main {
        overflow: auto;
        height: 100%;
        // Hiệu ứng chuyển động danh sách
        .list-enter-active {
          transition: all 0.5s;
        }

        .list-leave-active {
          transition: all 0.3s;
        }

        .list-enter,
        .list-leave-to {
          opacity: 0;
          transform: translateX(-100px);
        }

        .list-enter {
          height: 30px;
        }
      }
    }
  }
</style>
