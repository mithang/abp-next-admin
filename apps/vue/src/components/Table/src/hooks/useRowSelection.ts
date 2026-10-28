import { isFunction } from '/@/utils/is';
import type { BasicTableProps, TableRowSelection } from '../types/table';
import { computed, ComputedRef, nextTick, Ref, ref, toRaw, unref, watch } from 'vue';
import { ROW_KEY } from '../const';
import { omit } from 'lodash-es';
import { findNodeAll } from '/@/utils/helper/treeHelper';
import type { Key } from 'ant-design-vue/lib/table/interface';
import { parseRowKey, parseRowKeyValue } from '../helper';

export function useRowSelection(
  propsRef: ComputedRef<BasicTableProps>,
  tableData: Ref<Recordable[]>,
  emit: EmitType,
) {
  const selectedRowKeysRef = ref<Key[]>([]);
  const selectedRowRef = ref<Recordable[]>([]);

  const getRowSelectionRef = computed((): TableRowSelection | null => {
    const { rowSelection } = unref(propsRef);
    if (!rowSelection) {
      return null;
    }

    return {
      selectedRowKeys: unref(selectedRowKeysRef),
      onChange: (selectedRowKeys: Key[], selectedRows: any[], isClickCustomRow?: boolean) => {
        if (isClickCustomRow) {
          // Kích hoạt khi nhấn vào hàng

          // Duy trì callback onChange do bên ngoài định nghĩa
          rowSelection.onChange?.(selectedRowKeys, selectedRows);
        } else {
          // Kích hoạt khi nhấn checkbox/radiobox

          // Lấy tất cả keyValues của 【trang hiện tại】
          const currentPageKeys = tableData.value.map((o) => parseRowKeyValue(unref(getRowKey), o));

          // Từ keyValues đã chọn của 【tất cả các trang】 và thuộc phần của 【trang hiện tại】
          for (const selectedKey of selectedRowKeysRef.value.filter((k) =>
            currentPageKeys.includes(k),
          )) {
            // Xác định xem đã không còn tồn tại trong 【trang hiện tại】 chưa
            if (selectedRowKeys.findIndex((k) => k === selectedKey) < 0) {
              // Không tồn tại = bỏ chọn
              const removeIndex = selectedRowKeysRef.value.findIndex((k) => k === selectedKey);
              if (removeIndex > -1) {
                // Bỏ chọn
                selectedRowKeysRef.value.splice(removeIndex, 1);
                selectedRowRef.value.splice(removeIndex, 1);
              }
            }
          }

          // Tồn tại trong 【trang hiện tại】 nhưng không tồn tại trong 【tất cả các trang】 thì được coi là mới thêm
          for (const selectedKey of selectedRowKeys) {
            const existIndex = selectedRowKeysRef.value.findIndex((k) => k === selectedKey);
            if (existIndex < 0) {
              // Chọn mới thêm
              selectedRowKeysRef.value.push(selectedKey);
              const record = selectedRows.find(
                (o) => parseRowKeyValue(unref(getRowKey), o) === selectedKey,
              );
              if (record) {
                selectedRowRef.value.push(record);
              }
            }
          }

          // Gán giá trị đã điều chỉnh
          setSelectedRowKeys(selectedRowKeysRef.value);

          // Duy trì callback onChange do bên ngoài định nghĩa
          rowSelection.onChange?.(selectedRowKeysRef.value, selectedRowRef.value);
        }
      },
      ...omit(rowSelection, ['onChange']),
    };
  });

  watch(
    () => unref(propsRef).rowSelection?.selectedRowKeys,
    (v?: Key[]) => {
      setSelectedRowKeys(v);
    },
  );

  watch(
    () => unref(selectedRowKeysRef),
    () => {
      nextTick(() => {
        const { rowSelection } = unref(propsRef);
        if (rowSelection) {
          const { onChange } = rowSelection;
          if (onChange && isFunction(onChange)) onChange(getSelectRowKeys(), getSelectRows(), true);
        }
        emit('selection-change', {
          keys: getSelectRowKeys(),
          rows: getSelectRows(),
        });
      });
    },
    { deep: true },
  );

  const getAutoCreateKey = computed(() => {
    return unref(propsRef).autoCreateKey && !unref(propsRef).rowKey;
  });

  const getRowKey = computed(() => {
    const { rowKey } = unref(propsRef);
    return unref(getAutoCreateKey) ? ROW_KEY : rowKey;
  });

  function setSelectedRowKeys(keyValues?: Key[]) {
    selectedRowKeysRef.value = keyValues || [];
    const rows = toRaw(unref(tableData)).concat(toRaw(unref(selectedRowRef)));
    const allSelectedRows = findNodeAll(
      rows,
      (item) => keyValues?.includes(parseRowKeyValue(unref(getRowKey), item)),
      {
        children: propsRef.value.childrenColumnName ?? 'children',
      },
    );
    const trueSelectedRows: any[] = [];
    keyValues?.forEach((keyValue: Key) => {
      const found = allSelectedRows.find(
        (item) => parseRowKeyValue(unref(getRowKey), item) === keyValue,
      );
      if (found) {
        trueSelectedRows.push(found);
      } else {
        // Khi chuyển trang, dữ liệu không thuộc trang này không lấy được, tạm xử lý như vậy
        // tableData hoặc selectedRowRef luôn có dữ liệu
        if (rows[0]) {
          trueSelectedRows.push({ [parseRowKey(unref(getRowKey), rows[0])]: keyValue });
        }
      }
    });
    selectedRowRef.value = trueSelectedRows;
  }

  function setSelectedRows(rows: Recordable[]) {
    selectedRowRef.value = rows;
    selectedRowKeysRef.value = selectedRowRef.value.map((o) =>
      parseRowKeyValue(unref(getRowKey), o),
    );
  }

  function clearSelectedRowKeys() {
    selectedRowRef.value = [];
    selectedRowKeysRef.value = [];
  }

  function deleteSelectRowByKey(key: Key) {
    const selectedRowKeys = unref(selectedRowKeysRef);
    const index = selectedRowKeys.findIndex((item) => item === key);
    if (index !== -1) {
      unref(selectedRowKeysRef).splice(index, 1);
    }
  }

  function getSelectRowKeys() {
    return unref(selectedRowKeysRef);
  }

  function getSelectRows<T = Recordable>() {
    // const ret = toRaw(unref(selectedRowRef)).map((item) => toRaw(item));
    return unref(selectedRowRef) as T[];
  }

  function getRowSelection() {
    return unref(getRowSelectionRef)!;
  }

  return {
    getRowSelection,
    getRowSelectionRef,
    getSelectRows,
    getSelectRowKeys,
    setSelectedRowKeys,
    clearSelectedRowKeys,
    deleteSelectRowByKey,
    setSelectedRows,
  };
}