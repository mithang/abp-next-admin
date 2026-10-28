<!--
 * @Description: Control thao tác node: sao chép, xóa
-->
<template>
  <div class="copy-delete-box">
    <a class="copy" :class="activeClass" @click.stop="handleCopy">
      <Icon icon="ant-design:copy-outlined" />
    </a>
    <a class="delete" :class="activeClass" @click.stop="handleDelete">
      <Icon icon="ant-design:delete-outlined" />
    </a>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { IVFormComponent } from '../../../typings/v-form-component';
  import { remove } from '../../../utils';
  import { useFormDesignState } from '../../../hooks/useFormDesignState';
  import Icon from '/@/components/Icon/index';
  export default defineComponent({
    name: 'FormNodeOperate',
    components: {
      Icon,
    },
    props: {
      schema: {
        type: Object,
        default: () => ({}),
      },
      currentItem: {
        type: Object,
        default: () => ({}),
      },
    },
    setup(props) {
      const { formConfig, formDesignMethods } = useFormDesignState();
      const activeClass = computed(() => {
        return props.schema.key === props.currentItem.key ? 'active' : 'unactivated';
      });
      /**
       * Xóa mục hiện tại
       */
      const handleDelete = () => {
        const traverse = (schemas: IVFormComponent[]) => {
          schemas.some((formItem, index) => {
            const { component, key } = formItem;
            // Xử lý bố cục lưới và tab
            ['Grid', 'Tabs'].includes(component) &&
              formItem.columns?.forEach((item) => traverse(item.children));
            if (key === props.currentItem.key) {
              let params: IVFormComponent =
                schemas.length === 1
                  ? { component: '' }
                  : schemas.length - 1 > index
                  ? schemas[index + 1]
                  : schemas[index - 1];
              formDesignMethods.handleSetSelectItem(params);
              remove(schemas, index);
              return true;
            }
          });
        };
        traverse(formConfig.value!.schemas);
      };
      const handleCopy = () => {
        formDesignMethods.handleCopy();
      };
      return { activeClass, handleDelete, handleCopy };
    },
  });
</script>
