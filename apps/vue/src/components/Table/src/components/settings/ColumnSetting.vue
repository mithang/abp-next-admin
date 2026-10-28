<template>
  <Tooltip placement="top">
    <template #title>
      <span>{{ t('component.table.settingColumn') }}</span>
    </template>
    <Popover
      placement="bottomLeft"
      trigger="click"
      @open-change="onOpenChange"
      :overlayClassName="`${prefixCls}__column-list`"
      :getPopupContainer="getPopupContainer"
    >
      <template #title>
        <div :class="`${prefixCls}__popover-title`">
          <Checkbox
            :indeterminate="indeterminate"
            v-model:checked="isColumnAllSelected"
            @change="onColumnAllSelectChange"
          >
            {{ t('component.table.settingColumnShow') }}
          </Checkbox>

          <Checkbox v-model:checked="isIndexColumnShow" @change="onIndexColumnShowChange">
            {{ t('component.table.settingIndexColumnShow') }}
          </Checkbox>
          <!-- Chỉ xuất hiện khi đã thiết lập rowSelection -->
          <Checkbox
            v-model:checked="isRowSelectionShow"
            @change="onRowSelectionShowChange"
            v-if="defaultIsRowSelectionShow"
          >
            {{ t('component.table.settingSelectColumnShow') }}
          </Checkbox>

          <Checkbox v-model:checked="isAllowResizeColumn" @change="onColumnAllowResizeChange">
            {{ t('component.table.settingDragColumnShow') }}
          </Checkbox>


          <a-button size="small" type="link" @click="onReset">
            {{ t('common.resetText') }}
          </a-button>
        </div>
      </template>

      <template #content>
        <ScrollContainer>
          <Checkbox.Group v-model:value="columnCheckedOptions" ref="columnOptionsRef">
            <template v-for="opt in columnOptions" :key="opt.value">
              <div :class="`${prefixCls}__check-item`" :data-no="opt.value">
                <DragOutlined class="table-column-drag-icon" />
                <Checkbox :value="opt.value">
                  {{ opt.label }}
                </Checkbox>

                <Tooltip
                  placement="bottomLeft"
                  :mouseLeaveDelay="0.4"
                  :getPopupContainer="getPopupContainer"
                >
                  <template #title>
                    {{ t('component.table.settingFixedLeft') }}
                  </template>
                  <Icon
                    icon="line-md:arrow-align-left"
                    :class="[
                      `${prefixCls}__fixed-left`,
                      {
                        active: opt.fixed === 'left',
                        disabled: opt.value ? !columnCheckedOptions.includes(opt.value) : true,
                      },
                    ]"
                    @click="onColumnFixedChange(opt, 'left')"
                  />
                </Tooltip>
                <Divider type="vertical" />
                <Tooltip
                  placement="bottomLeft"
                  :mouseLeaveDelay="0.4"
                  :getPopupContainer="getPopupContainer"
                >
                  <template #title>
                    {{ t('component.table.settingFixedRight') }}
                  </template>
                  <Icon
                    icon="line-md:arrow-align-left"
                    :class="[
                      `${prefixCls}__fixed-right`,
                      {
                        active: opt.fixed === 'right',
                        disabled: opt.value ? !columnCheckedOptions.includes(opt.value) : true,
                      },
                    ]"
                    @click="onColumnFixedChange(opt, 'right')"
                  />
                </Tooltip>
              </div>
            </template>
          </Checkbox.Group>
        </ScrollContainer>
      </template>
      <SettingOutlined />
    </Popover>
  </Tooltip>
</template>
<script lang="ts" setup>
  import type { BasicColumn, ColumnOptionsType, ColumnChangeParam } from '../../types/table';
  import { ref, nextTick, unref, computed, useAttrs, watch, onMounted } from 'vue';
  import { Tooltip, Popover, Checkbox, Divider } from 'ant-design-vue';
  import type { CheckboxChangeEvent } from 'ant-design-vue/lib/checkbox/interface';
  import { SettingOutlined, DragOutlined } from '@ant-design/icons-vue';
  import { Icon } from '/@/components/Icon';
  import { ScrollContainer } from '/@/components/Container';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useTableContext } from '../../hooks/useTableContext';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { isFunction, isNil, isNumber } from '/@/utils/is';
  import { getPopupContainer as getParentContainer } from '/@/utils';
  import { cloneDeep, omit } from 'lodash-es';
  import Sortablejs from 'sortablejs';
  import { INDEX_COLUMN_FLAG } from '/@/components/Table/src/const';

  // Bộ nhớ đệm cài đặt danh sách
  import { useTableSettingStore } from '/@/store/modules/tableSetting';
  import { useRoute } from 'vue-router';
  import { TableRowSelection } from '/@/components/Table/src/types/table';

  const tableSettingStore = useTableSettingStore();

  // defineOptions({ name: 'ColumnSetting' });
  const emit = defineEmits(['columns-change']);

  const route = useRoute();

  const { t } = useI18n();
  const { prefixCls } = useDesign('basic-column-setting');

  const attrs = useAttrs();
  const table = useTableContext();

  const props = withDefaults(
    defineProps<{
      /**
       * Có lưu bộ nhớ đệm cài đặt cột hay không
       */
      cache?: boolean;
    }>(),
    {
      cache: () => false,
    },
  );

  const getPopupContainer = () => {
    return isFunction(attrs.getPopupContainer) ? attrs.getPopupContainer() : getParentContainer();
  };

  // Đã khôi phục từ bộ nhớ đệm hay chưa
  let isRestored = false;
  let isInnerChange = false;

  // Các tùy chọn cột
  const columnOptions = ref<ColumnOptionsType[]>([]);
  const columnOptionsRef = ref(null);
  // Cột đã chọn
  const columnCheckedOptions = ref<string[]>([]);
  // Thay đổi cột đã chọn
  watch(columnCheckedOptions, () => {
    // Có hiệu lực sau khi khôi phục bộ nhớ đệm
    if (isRestored) {
      // Hiển thị
      columnOptions.value
        .filter((o) => columnCheckedOptions.value.includes(o.value))
        .forEach((o) => {
          o.column.defaultHidden = false;
        });
      // Ẩn
      columnOptions.value
        .filter((o) => !columnCheckedOptions.value.includes(o.value))
        .forEach((o) => {
          o.column.defaultHidden = true;
          o.fixed = undefined;
        });
      // Cập nhật trạng thái chọn tất cả từ các tùy chọn cột
      isColumnAllSelectedUpdate();

      // Cập nhật cột danh sách
      tableColumnsUpdate();
      // Cập nhật bộ nhớ đệm cột
      props.cache && columnOptionsSave();
    }
  });

  // Chọn tất cả
  const isColumnAllSelected = ref<boolean>(false);
  const onColumnAllSelectChange = () => {
    if (columnCheckedOptions.value.length < columnOptions.value.length) {
      columnCheckedOptions.value = columnOptions.value.map((o) => o.value);
    } else {
      columnCheckedOptions.value = [];
    }
  };

  // Trạng thái chọn một phần
  const indeterminate = computed(() => {
    return (
      columnCheckedOptions.value.length > 0 &&
      columnCheckedOptions.value.length < columnOptions.value.length
    );
  });

  // Có hiển thị cột số thứ tự hay không
  const isIndexColumnShow = ref<boolean>(false);
  // Cập nhật cột số thứ tự
  const onIndexColumnShowChange = (e: CheckboxChangeEvent) => {
    // Cập nhật showIndexColumn
    showIndexColumnUpdate(e.target.checked);
    // Cập nhật bộ nhớ đệm showIndexColumn
    props.cache &&
      typeof route.name === 'string' &&
      tableSettingStore.setShowIndexColumn(route.name, e.target.checked);
  };

  // Có hiển thị cột chọn hay không
  const isRowSelectionShow = ref<boolean>(false);
  // Cập nhật cột chọn
  const onRowSelectionShowChange = (e: CheckboxChangeEvent) => {
    // Cập nhật showRowSelection
    showRowSelectionUpdate(e.target.checked);
    // Cập nhật bộ nhớ đệm showRowSelection
    props.cache &&
      typeof route.name === 'string' &&
      tableSettingStore.setShowRowSelection(route.name, e.target.checked);
  };

  // Có thể thay đổi kích thước cột hay không
  const isAllowResizeColumn = ref<boolean>(false);
  // Thay đổi kích thước cột
  const onColumnAllowResizeChange = (e: CheckboxChangeEvent) => {
    const columns = getTableColumns();
    columns.forEach((col) => {
      if (isNumber(col.width)) {
        col.resizable = e.target.checked;
      }
    });
    props.cache &&
      typeof route.name === 'string' &&
      tableSettingStore.setAllowResizeColumn(route.name, e.target.checked);
  }

  // Cập nhật bộ nhớ đệm cột
  const columnOptionsSave = () => {
    if (typeof route.name === 'string') {
      // Dùng name của route làm key cho bộ nhớ đệm (nếu trong một route có nhiều bảng, cần tự điều chỉnh nguồn key bộ nhớ đệm)
      tableSettingStore.setColumns(route.name, columnOptions.value);
    }
  };

  // Đặt lại
  const onReset = () => {
    // Đặt lại giá trị mặc định
    isIndexColumnShow.value = defaultIsIndexColumnShow;
    // Cập nhật cột số thứ tự
    onIndexColumnShowChange({
      target: { checked: defaultIsIndexColumnShow },
    } as CheckboxChangeEvent);
    // Đặt lại giá trị mặc định
    isRowSelectionShow.value = defaultIsRowSelectionShow;
    // Cập nhật cột chọn
    onRowSelectionShowChange({
      target: { checked: defaultIsRowSelectionShow },
    } as CheckboxChangeEvent);
    // Đặt lại giá trị mặc định
    columnOptions.value = cloneDeep(defaultColumnOptions);
    // Cập nhật trạng thái form
    formUpdate();
  };

  // Thiết lập fixed cho cột
  const onColumnFixedChange = (opt: ColumnOptionsType, type: 'left' | 'right') => {
    if (type === 'left') {
      if (!opt.fixed || opt.fixed === 'right') {
        opt.fixed = 'left';
      } else {
        opt.fixed = undefined;
      }
    } else if (type === 'right') {
      if (!opt.fixed || opt.fixed === 'left') {
        opt.fixed = 'right';
      } else {
        opt.fixed = undefined;
      }
    }

    // Cập nhật cột danh sách
    tableColumnsUpdate();
    // Cập nhật bộ nhớ đệm cột
    props.cache && columnOptionsSave();
  };

  // Giữ nguyên logic
  const sortableFix = async () => {
    // Sortablejs có bug, không rõ ở bước nào sẽ append một childNode vào el, vì vậy ở đây xóa childNode trước
    // Thao tác có thể tái hiện vấn đề trên: kéo một phần tử, di chuyển lên xuống nhanh, cuối cùng thả ở vị trí cuối cùng
    if (columnOptionsRef.value) {
      const el = (columnOptionsRef.value as InstanceType<typeof Checkbox.Group>).$el;
      Array.from(el.children).forEach((item) => el.removeChild(item));
    }
    await nextTick();
  };

  // Logic cột có hiển thị hay không
  const columnIfShow = (column?: Partial<Omit<BasicColumn, 'children'>>) => {
    if (column) {
      if ('ifShow' in column) {
        if (typeof column.ifShow === 'boolean') {
          return column.ifShow;
        } else if (column.ifShow) {
          return column.ifShow(column);
        }
      }
      return true;
    }
    return false;
  };

  // Lấy cột dữ liệu
  const getTableColumns = () => {
    return table
      .getColumns({ ignoreIndex: true, ignoreAction: true })
      .filter((col) => columnIfShow(col));
  };

  // Thiết lập cột danh sách
  const tableColumnsSet = (columns: BasicColumn[]) => {
    isInnerChange = true;
    table?.setColumns(columns);

    // Giữ nguyên logic
    const columnChangeParams: ColumnChangeParam[] = columns.map((col) => ({
      dataIndex: col.dataIndex ? col.dataIndex.toString() : '',
      fixed: col.fixed,
      visible: !col.defaultHidden,
    }));
    emit('columns-change', columnChangeParams);
  };

  // Cập nhật cột danh sách
  const tableColumnsUpdate = () => {
    // Đã xét tất cả các cột
    const columns = cloneDeep(table.getColumns());

    // Sắp xếp bắt đầu từ cột fixed ngoài cùng bên trái (trừ cột số thứ tự)
    let count = columns.filter(
      (o) => o.flag !== INDEX_COLUMN_FLAG && (o.fixed === 'left' || o.fixed === true),
    ).length;

    // Cột số thứ tự lên trước
    if (isIndexColumnShow.value) {
      count++;
    }

    // Điều chỉnh thứ tự và giá trị của table.getColumns() theo thứ tự của columnOptions
    for (const opt of columnOptions.value) {
      const colIdx = columns.findIndex((o) => o.dataIndex === opt.value);
      //
      if (colIdx > -1) {
        const target = columns[colIdx];
        target.defaultHidden = opt.column?.defaultHidden;
        target.fixed = opt.fixed;
        columns.splice(colIdx, 1);
        columns.splice(count++, 0, target); // Chèn tăng dần
      }
    }

    // Có tồn tại action hay không
    const actionIndex = columns.findIndex((o) => o.dataIndex === 'action');
    if (actionIndex > -1) {
      const actionCol = columns.splice(actionIndex, 1);
      columns.push(actionCol[0]);
    }

    // Thiết lập cột danh sách
    tableColumnsSet(columns);
  };

  // Mở cửa sổ nổi
  const onOpenChange = async () => {
    await nextTick();

    if (columnOptionsRef.value) {
      // Đăng ký instance sắp xếp
      const el = (columnOptionsRef.value as InstanceType<typeof Checkbox.Group>).$el;
      Sortablejs.create(unref(el), {
        animation: 500,
        delay: 400,
        delayOnTouchOnly: true,
        handle: '.table-column-drag-icon ',
        dataIdAttr: 'data-no',
        onEnd: (evt) => {
          const { oldIndex, newIndex } = evt;
          if (isNil(oldIndex) || isNil(newIndex) || oldIndex === newIndex) {
            return;
          }

          const options = cloneDeep(columnOptions.value);

          // Sắp xếp
          if (oldIndex > newIndex) {
            options.splice(newIndex, 0, options[oldIndex]);
            options.splice(oldIndex + 1, 1);
          } else {
            options.splice(newIndex + 1, 0, options[oldIndex]);
            options.splice(oldIndex, 1);
          }

          // Cập nhật các tùy chọn cột
          columnOptions.value = options;

          // Cập nhật cột danh sách
          tableColumnsUpdate();
          // Cập nhật bộ nhớ đệm cột
          props.cache && columnOptionsSave();
        },
      });
    }
  };

  // Xóa các cột đã biến mất, thêm các cột mới xuất hiện
  const diff = () => {
    if (typeof route.name === 'string') {
      let cache = tableSettingStore.getColumns(route.name);
      if (cache) {
        // value và label có khớp nhau hay không
        if (
          JSON.stringify(columnOptions.value.map((o) => ({ value: o.value, label: o.label }))) !==
          JSON.stringify(cache.map((o) => ({ value: o.value, label: o.label })))
        ) {
          const map = columnOptions.value.reduce((map, item) => {
            map[item.value] = item.label;
            return map;
          }, {});
          if (Array.isArray(cache)) {
            // Xóa các cột đã biến mất
            cache = cache.filter((o) => map[o.value]);
            // Cập nhật label
            cache.forEach((o) => {
              o.label = map[o.value];
            });
            const cacheKeys = cache.map((o) => o.value);
            // Thêm các cột mới xuất hiện
            cache = cache.concat(columnOptions.value.filter((o) => !cacheKeys.includes(o.value)));
            // Cập nhật bộ nhớ đệm
            tableSettingStore.setColumns(route.name, cache);
          }
        }
      }
    }
  };

  // Khôi phục từ bộ nhớ đệm
  const restore = () => {
    if (typeof route.name === 'string') {
      const isIndexColumnShowCache = tableSettingStore.getShowIndexColumn(route.name);
      // Chỉ khôi phục khi đã từng thiết lập
      if (typeof isIndexColumnShowCache === 'boolean') {
        isIndexColumnShow.value = defaultIsIndexColumnShow && isIndexColumnShowCache;
      }

      const isRowSelectionShowCache = tableSettingStore.getShowRowSelection(route.name);
      // Chỉ khôi phục khi đã từng thiết lập
      if (typeof isRowSelectionShowCache === 'boolean') {
        isRowSelectionShow.value = defaultIsRowSelectionShow && isRowSelectionShowCache;
      }

      const allowResizeColumnCache = tableSettingStore.getAllowResizeColumn(route.name);
      // Chỉ khôi phục khi đã từng thiết lập
      if (typeof allowResizeColumnCache === 'boolean') {
        isAllowResizeColumn.value = defaultIsAllowResizeColumn && allowResizeColumnCache;
      }
    }
    // Cập nhật cột số thứ tự
    onIndexColumnShowChange({
      target: { checked: isIndexColumnShow.value },
    } as CheckboxChangeEvent);
    // Cập nhật cột chọn
    onRowSelectionShowChange({
      target: { checked: isRowSelectionShow.value },
    } as CheckboxChangeEvent);

    if (typeof route.name === 'string') {
      const cache = tableSettingStore.getColumns(route.name);
      // Chỉ khôi phục khi đã từng thiết lập
      if (Array.isArray(cache)) {
        columnOptions.value = cache;
      }
    }
  };

  // Cập nhật các cột đã chọn từ các tùy chọn cột
  const columnCheckedOptionsUpdate = () => {
    columnCheckedOptions.value = columnOptions.value
      .filter((o) => !o.column?.defaultHidden)
      .map((o) => o.value);
  };
  // Cập nhật trạng thái chọn tất cả từ các tùy chọn cột
  const isColumnAllSelectedUpdate = () => {
    isColumnAllSelected.value = columnOptions.value.length === columnCheckedOptions.value.length;
  };
  // Cập nhật showIndexColumn
  const showIndexColumnUpdate = (showIndexColumn) => {
    isInnerChange = true;
    table.setProps({
      showIndexColumn,
    });
  };
  // Cập nhật rowSelection
  const showRowSelectionUpdate = (showRowSelection) => {
    isInnerChange = true;
    table.setProps({
      rowSelection: showRowSelection
        ? {
            ...omit(defaultRowSelection, ['selectedRowKeys']),
            fixed: true,
          }
        : undefined,
    });
  };

  // Cập nhật trạng thái form
  const formUpdate = () => {
    // Cập nhật các cột đã chọn từ các tùy chọn cột
    columnCheckedOptionsUpdate();

    // Cập nhật trạng thái chọn tất cả từ các tùy chọn cột
    isColumnAllSelectedUpdate();

    // Cập nhật showIndexColumn
    showIndexColumnUpdate(isIndexColumnShow.value);

    // Cập nhật showRowSelection
    showRowSelectionUpdate(isRowSelectionShow.value);

    // Cập nhật cột danh sách
    tableColumnsUpdate();
  };

  // Giá trị mặc định
  let defaultIsIndexColumnShow: boolean = false;
  let defaultIsRowSelectionShow: boolean = false;
  let defaultIsAllowResizeColumn: boolean = false;
  let defaultRowSelection: TableRowSelection<Recordable<any>>;
  let defaultColumnOptions: ColumnOptionsType[] = [];

  const init = async () => {
    if (!isRestored) {
      // Lấy cột dữ liệu
      const columns = getTableColumns();

      // Giữ nguyên logic
      table.setCacheColumns?.(columns);

      // Tạo giá trị mặc định
      const options: ColumnOptionsType[] = [];
      for (const col of columns) {
        // Chỉ lưu bộ nhớ đệm các cột kiểu string
        options.push({
          label:
            typeof col.title === 'string'
              ? col.title
              : col.customTitle === 'string'
                ? col.customTitle
                : '',
          value:
            typeof col.dataIndex === 'string'
              ? col.dataIndex
              : col.title === 'string'
                ? col.title
                : '',
          column: {
            defaultHidden: col.defaultHidden,
          },
          fixed: col.fixed,
        });
      }

      // Bộ nhớ đệm giá trị mặc định
      defaultIsIndexColumnShow = table.getBindValues.value.showIndexColumn || false;
      defaultRowSelection = table.getRowSelection();
      defaultIsRowSelectionShow = !!defaultRowSelection; // Chỉ xuất hiện khi đã thiết lập rowSelection
      defaultColumnOptions = options;

      // Gán giá trị mặc định
      isIndexColumnShow.value = defaultIsIndexColumnShow;
      isRowSelectionShow.value = defaultIsRowSelectionShow;
      columnOptions.value = cloneDeep(options);

      // Xóa các cột đã biến mất, thêm các cột mới xuất hiện
      props.cache && diff();

      // Khôi phục từ bộ nhớ đệm
      props.cache && restore();

      // Cập nhật trạng thái form
      formUpdate();

      isRestored = true;
    }
  };

  // Khởi tạo
  const once = async () => {
    // Chỉ thực thi một lần
    await sortableFix();
    init();
  };
  once();

  // Cột bên ngoài thay đổi
  const getColumns = computed(() => {
    return table?.getColumns();
  });
  const getValues = computed(() => {
    return table?.getBindValues;
  });

  onMounted(() => {
    watch([getColumns, getValues], () => {
      if (!isInnerChange) {
        isRestored = false;
        console.log('onMounted isRestored');
        init();
      } else {
        isInnerChange = false;
      }
    });
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-basic-column-setting';

  .table-column-drag-icon {
    margin: 0 5px;
    cursor: move;
  }

  .@{prefix-cls} {
    &__popover-title {
      display: flex;
      position: relative;
      align-items: center;
      justify-content: space-between;
    }

    &__check-item {
      display: flex;
      align-items: center;
      min-width: 100%;
      padding: 4px 16px 8px 0;

      .ant-checkbox-wrapper {
        width: 100%;

        &:hover {
          color: @primary-color;
        }
      }
    }

    &__fixed-left,
    &__fixed-right {
      color: rgb(0 0 0 / 45%);
      cursor: pointer;

      &.active,
      &:hover {
        color: @primary-color;
      }

      &.disabled {
        color: @disabled-color;
        cursor: not-allowed;
      }
    }

    &__fixed-right {
      transform: rotate(180deg);
    }

    &__column-list {
      svg {
        width: 1em !important;
        height: 1em !important;
      }

      .ant-popover-inner-content {
        // max-height: 360px;
        padding-right: 0;
        padding-left: 0;
        // overflow: auto;
      }

      .ant-checkbox-group {
        display: inline-block;
        width: 100%;
        min-width: 260px;
        // flex-wrap: wrap;
      }

      .scrollbar {
        height: 220px;
      }
    }
  }
</style>