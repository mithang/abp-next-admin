import { Ref, unref, watchEffect } from 'vue';
import { useTimeoutFn } from '/@/hooks/core/useTimeout';

export interface UseModalDragMoveContext {
  draggable: Ref<boolean>;
  destroyOnClose: Ref<boolean | undefined> | undefined;
  visible: Ref<boolean>;
}

export function useModalDragMove(context: UseModalDragMoveContext) {
  const getStyle = (dom: any, attr: any) => {
    return getComputedStyle(dom)[attr];
  };
  const drag = (wrap: any) => {
    if (!wrap) return;
    wrap.setAttribute('data-drag', unref(context.draggable));
    const dialogHeaderEl = wrap.querySelector('.ant-modal-header');
    const dragDom = wrap.querySelector('.ant-modal');

    if (!dialogHeaderEl || !dragDom || !unref(context.draggable)) return;

    dialogHeaderEl.style.cursor = 'move';

    dialogHeaderEl.onmousedown = (e: any) => {
      if (!e) return;
      // Khi nhấn chuột, tính khoảng cách từ phần tử hiện tại đến vùng hiển thị
      const disX = e.clientX;
      const disY = e.clientY;
      const screenWidth = document.body.clientWidth; // Chiều rộng hiện tại của body
      const screenHeight = document.documentElement.clientHeight; // Chiều cao vùng hiển thị (đáng lẽ là chiều cao body, nhưng trong một số môi trường không lấy được)

      const dragDomWidth = dragDom.offsetWidth; // Chiều rộng hộp thoại
      const dragDomheight = dragDom.offsetHeight; // Chiều cao hộp thoại

      const minDragDomLeft = dragDom.offsetLeft;

      const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth;
      const minDragDomTop = dragDom.offsetTop;
      const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight;
      // Giá trị lấy được kèm px, dùng regex để khớp và thay thế
      const domLeft = getStyle(dragDom, 'left');
      const domTop = getStyle(dragDom, 'top');
      let styL = +domLeft;
      let styT = +domTop;

      // Lưu ý trong IE, lần đầu giá trị lấy được là 50% mặc định của component, sau khi di chuyển sẽ được gán thành px
      if (domLeft.includes('%')) {
        styL = +document.body.clientWidth * (+domLeft.replace(/%/g, '') / 100);
        styT = +document.body.clientHeight * (+domTop.replace(/%/g, '') / 100);
      } else {
        styL = +domLeft.replace(/px/g, '');
        styT = +domTop.replace(/px/g, '');
      }

      document.onmousemove = function (e) {
        // Thông qua ủy quyền sự kiện, tính khoảng cách di chuyển
        let left = e.clientX - disX;
        let top = e.clientY - disY;

        // Xử lý biên
        if (-left > minDragDomLeft) {
          left = -minDragDomLeft;
        } else if (left > maxDragDomLeft) {
          left = maxDragDomLeft;
        }

        if (-top > minDragDomTop) {
          top = -minDragDomTop;
        } else if (top > maxDragDomTop) {
          top = maxDragDomTop;
        }

        // Di chuyển phần tử hiện tại
        dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`;
      };

      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  };

  const handleDrag = () => {
    const dragWraps = document.querySelectorAll('.ant-modal-wrap');
    for (const wrap of Array.from(dragWraps)) {
      if (!wrap) continue;
      const display = getStyle(wrap, 'display');
      const draggable = wrap.getAttribute('data-drag');
      if (display !== 'none') {
        // Vị trí kéo thả
        if (draggable === null || unref(context.destroyOnClose)) {
          drag(wrap);
        }
      }
    }
  };

  watchEffect(() => {
    if (!unref(context.visible) || !unref(context.draggable)) {
      return;
    }
    useTimeoutFn(() => {
      handleDrag();
    }, 30);
  });
}
