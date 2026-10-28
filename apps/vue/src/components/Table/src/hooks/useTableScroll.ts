import type { BasicTableProps, TableRowSelection, BasicColumn } from '../types/table';
import { Ref, ComputedRef, ref, computed, unref, nextTick, watch } from 'vue';
import { getViewportOffset } from '/@/utils/domUtils';
import { isBoolean } from '/@/utils/is';
import { useWindowSizeFn } from '/@/hooks/event/useWindowSizeFn';
import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
import { useModalContext } from '/@/components/Modal';
import { useDebounceFn, promiseTimeout } from '@vueuse/core';

import {
  footerHeight as layoutFooterHeight,
  layoutMultipleHeadePlaceholderTime,
} from '/@/settings/designSetting';

import { useRootSetting } from '/@/hooks/setting/useRootSetting';

const { getShowFooter, getFullContent } = useRootSetting();

export function useTableScroll(
  propsRef: ComputedRef<BasicTableProps>,
  tableElRef: Ref<ComponentRef>,
  columnsRef: ComputedRef<BasicColumn[]>,
  rowSelectionRef: ComputedRef<TableRowSelection | null>,
  getDataSourceRef: ComputedRef<Recordable[]>,
  wrapRef: Ref<HTMLElement | null>,
  formRef: Ref<ComponentRef>,
) {
  const tableHeightRef: Ref<Nullable<number | string>> = ref(167);
  const modalFn = useModalContext();

  // Greater than animation time 280
  const debounceRedoHeight = useDebounceFn(redoHeight, 100);

  const getCanResize = computed(() => {
    const { canResize, scroll } = unref(propsRef);
    return canResize && !(scroll || {}).y;
  });

  watch(
    () => [unref(getCanResize), unref(getDataSourceRef)?.length, unref(getShowFooter)],
    () => {
      debounceRedoHeight();
    },
    {
      flush: 'post',
    },
  );

  watch(
    () => [unref(getFullContent)],
    async () => {
      // Đợi 200 mili giây sau khi hoạt ảnh kết thúc
      await promiseTimeout(layoutMultipleHeadePlaceholderTime * 1000 + 200);
      debounceRedoHeight();
    },
    {
      flush: 'post',
    },
  );

  function redoHeight() {
    nextTick(() => {
      calcTableHeight();
    });
  }

  function setHeight(height: number) {
    tableHeightRef.value = height;
    //  Solve the problem of modal adaptive height calculation when the form is placed in the modal
    modalFn?.redoModalHeight?.();
  }

  // No need to repeat queries
  let paginationEl: HTMLElement | null;
  let footerEl: HTMLElement | null;
  let bodyEl: HTMLElement | null;

  /**
   * Chiều cao của table wrapper padding
   * @description Đến từ .vben-basic-table .ant-table-wrapper
   */
  const tableWrapperPadding = 6;

  function handleScrollBar(bodyEl: HTMLElement, tableEl: Element) {
    const hasScrollBarY = bodyEl.scrollHeight > bodyEl.clientHeight;
    const hasScrollBarX = bodyEl.scrollWidth > bodyEl.clientWidth;

    if (hasScrollBarY) {
      tableEl.classList.contains('hide-scrollbar-y') &&
        tableEl.classList.remove('hide-scrollbar-y');
    } else {
      !tableEl.classList.contains('hide-scrollbar-y') && tableEl.classList.add('hide-scrollbar-y');
    }

    if (hasScrollBarX) {
      tableEl.classList.contains('hide-scrollbar-x') &&
        tableEl.classList.remove('hide-scrollbar-x');
    } else {
      !tableEl.classList.contains('hide-scrollbar-x') && tableEl.classList.add('hide-scrollbar-x');
    }
  }

  /**
   * Tính chiều cao của bộ phân trang
   * @param tableEl table element
   * @returns number
   */
  function caclPaginationHeight(tableEl: Element): number {
    const { pagination } = unref(propsRef);

    let paginationHeight = 0;
    if (!isBoolean(pagination)) {
      // Lấy từ Dom
      if (!paginationEl) {
        paginationEl = tableEl.querySelector('.ant-pagination') as HTMLElement;
      }
      if (paginationEl) {
        // margin-top của phân trang
        const paginationElMarginTop = parseInt(getComputedStyle(paginationEl).marginTop);
        // Chiều cao phân trang
        const offsetHeight = paginationEl.offsetHeight;
        paginationHeight = offsetHeight + paginationElMarginTop;
      } else {
        // Không tìm thấy component phân trang, mặc định cho margin-top + chiều cao phân trang mặc định
        paginationHeight = 10 + 24;
      }
    } else {
      // Không hiển thị phân trang, khi pagination là false
      paginationHeight = 0;
    }
    return paginationHeight;
  }

  function caclFooterHeight(tableEl: Element): number {
    const { pagination } = unref(propsRef);
    let footerHeight = 0;
    if (!isBoolean(pagination)) {
      if (!footerEl) {
        footerEl = tableEl.querySelector('.ant-table-footer') as HTMLElement;
      } else {
        const offsetHeight = footerEl.offsetHeight;
        footerHeight += offsetHeight || 0;
      }
    }
    return footerHeight;
  }

  function calcHeaderHeight(headEl: Element): number {
    let headerHeight = 0;
    if (headEl) {
      headerHeight = (headEl as HTMLElement).offsetHeight;
    }
    return headerHeight;
  }

  /**
   * Tính tổng chiều cao từ đầu bảng đến đáy body
   * @param tableEl table element
   * @param headEl element đầu bảng của table
   * @returns number
   */
  function calcBottomAndPaddingHeight(tableEl: Element, headEl: Element) {
    const { isCanResizeParent } = unref(propsRef);
    let bottomIncludeBody = 0;
    if (unref(wrapRef) && isCanResizeParent) {
      // Kế thừa chiều cao của phần tử cha
      const wrapHeight = unref(wrapRef)?.offsetHeight ?? 0;

      let formHeight = unref(formRef)?.$el.offsetHeight ?? 0;
      if (formHeight) {
        // Đến từ .vben-basic-table-form-container .ant-form và .vben-basic-table-form-container
        formHeight += 16 + 16 * 2;
      }

      bottomIncludeBody = wrapHeight - tableWrapperPadding - formHeight;
    } else {
      // Trong trường hợp mặc định không có wrapRef
      bottomIncludeBody = getViewportOffset(headEl).bottomIncludeBody;
    }

    return bottomIncludeBody;
  }

  /**
   * Tính chiều cao mà modal chiếm khi table nằm trong modal
   * @param tableEl table element
   * @returns number
   */
  function calcModalHeight(tableEl: Element) {
    // Kiểm tra xem table có nằm trong modal hay không, lấy modal, wrap, footer và xét trường hợp fullscreen
    let modalEl: Nullable<HTMLElement> = null;
    let modalWrapEl: Nullable<HTMLElement> = null;
    let modalFooterEl: Nullable<HTMLElement> = null;
    let modalElIterator: HTMLElement = tableEl.parentElement!;
    let modalIsFullscreen = false;
    while (modalElIterator !== document.body) {
      if (modalElIterator.classList.contains('ant-modal')) {
        modalEl = modalElIterator;
        modalWrapEl = modalEl.parentElement;
        modalFooterEl = modalElIterator.querySelector('.ant-modal-content>.ant-modal-footer');
        modalIsFullscreen = modalWrapEl?.classList.contains('fullscreen-modal') ?? false;
        break;
      }
      modalElIterator = modalElIterator.parentElement!;
    }

    if (modalEl) {
      // table nằm trong modal

      // modal top
      const { top: modalTop = 0 } = modalEl ? getViewportOffset(modalEl) : {};

      // Đến từ .ant-modal, không toàn màn hình là 24, toàn màn hình là 0
      const modalBottom = modalIsFullscreen ? 0 : 24;

      // Chiều cao modal footer
      const modalFooterHeight = modalFooterEl?.offsetHeight ?? 0;

      // Lề modal footer, đến từ .ant-modal .ant-modal-footer
      const modalFooterMarginTop = modalFooterEl
        ? modalIsFullscreen
          ? 0
          : parseInt(getComputedStyle(modalFooterEl).marginTop)
        : 0;

      // Đến từ .ant-modal .ant-modal-body > .scrollbar
      const modalScrollBarHeight = 14;

      return (
        (modalTop > modalBottom ? modalTop : modalBottom) +
        modalFooterHeight +
        modalFooterMarginTop +
        modalScrollBarHeight
      );
    }

    // table không nằm trong modal
    return 0;
  }

  /**
   * Trả về một số chiều cao khoảng cách theo kiểu
   * @returns number
   */
  function getMarginPaddingHeight() {
    const { isCanResizeParent } = unref(propsRef);

    if (unref(wrapRef) && isCanResizeParent) {
      // Kế thừa chiều cao của phần tử cha
      return tableWrapperPadding;
    }
    return (
      tableWrapperPadding + 16 // Đến từ .vben-basic-table-form-container hoặc .p-4
    );
  }

  async function calcTableHeight() {
    const { resizeHeightOffset, maxHeight } = unref(propsRef);
    const tableData = unref(getDataSourceRef);

    const table = unref(tableElRef);
    if (!table) return;

    const tableEl: Element = table.$el;
    if (!tableEl) return;

    if (!bodyEl) {
      bodyEl = tableEl.querySelector('.ant-table-body');
      if (!bodyEl) return;
    }

    handleScrollBar(bodyEl, tableEl);

    bodyEl!.style.height = 'unset';

    if (!unref(getCanResize) || !unref(tableData) || tableData.length === 0) return;

    await nextTick();
    // Add a delay to get the correct bottomIncludeBody paginationHeight footerHeight headerHeight

    const headEl = tableEl.querySelector('.ant-table-thead ');

    if (!headEl) return;

    const paginationHeight = caclPaginationHeight(tableEl);
    const footerHeight = caclFooterHeight(tableEl);
    const headerHeight = calcHeaderHeight(headEl);
    const bottomIncludeBody = calcBottomAndPaddingHeight(tableEl, headEl);

    const modalHeight = calcModalHeight(tableEl);

    const marginPaddingHeight = getMarginPaddingHeight();

    // Math.floor thà nhỏ hơn 1px cũng không tràn ra ngoài
    let height = Math.floor(
      bottomIncludeBody -
        (resizeHeightOffset || 0) -
        paginationHeight -
        footerHeight -
        headerHeight -
        // Chiều cao liên quan đến cửa sổ bật lên (nếu có)
        modalHeight -
        // Chiều cao footer của trang (khi không phải cửa sổ bật lên)
        (getShowFooter.value && modalHeight <= 0 ? layoutFooterHeight : 0) -
        // Chiều cao khoảng cách kiểu
        marginPaddingHeight -
        // Dự phòng tràn chiều cao không nguyên (ví dụ chiều cao thực tế là 100.5, giá trị offsetHeight là 101)
        1,
    );

    height = (height > maxHeight! ? (maxHeight as number) : height) ?? height;
    setHeight(height);

    bodyEl!.style.height = `${height}px`;
  }
  useWindowSizeFn(calcTableHeight, 280);
  onMountedOrActivated(() => {
    calcTableHeight();
    nextTick(() => {
      debounceRedoHeight();
    });
  });

  const getScrollX = computed(() => {
    let width = 0;
    if (unref(rowSelectionRef)) {
      width += 60;
    }

    // TODO props ?? 0;
    const NORMAL_WIDTH = 150;

    const columns = unref(columnsRef).filter((item) => !item.defaultHidden);
    columns.forEach((item) => {
      width += Number.parseFloat(item.width as string) || 0;
    });
    const unsetWidthColumns = columns.filter(
      (item) => !Reflect.has(item, 'width') && item.ifShow !== false,
    );

    const len = unsetWidthColumns.length;
    if (len !== 0) {
      width += len * NORMAL_WIDTH;
    }

    const table = unref(tableElRef);
    const tableWidth = table?.$el?.offsetWidth ?? 0;
    return tableWidth > width ? '100%' : width;
  });

  const getScrollRef = computed(() => {
    const tableHeight = unref(tableHeightRef);
    const { canResize, scroll } = unref(propsRef);
    return {
      x: unref(getScrollX),
      y: canResize ? tableHeight : null,
      scrollToFirstRowOnChange: false,
      ...scroll,
    } as BasicTableProps['scroll'];
  });

  return { getScrollRef, redoHeight };
}