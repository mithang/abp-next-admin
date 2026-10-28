import type { Arrayable, MaybeElementRef } from '@vueuse/core';

import type { Ref } from 'vue';

import { computed, effectScope, onUnmounted, ref, unref, watch } from 'vue';

import { isFunction } from '@vben/utils';

import { useElementHover } from '@vueuse/core';

interface HoverDelayOptions {
  /** Thời gian trễ khi chuột di vào */
  enterDelay?: (() => number) | number;
  /** Thời gian trễ khi chuột di ra */
  leaveDelay?: (() => number) | number;
}

const DEFAULT_LEAVE_DELAY = 500; // Thời gian trễ khi chuột di ra, mặc định là 500ms
const DEFAULT_ENTER_DELAY = 0; // Thời gian trễ khi chuột di vào, mặc định là 0 (phản hồi ngay)

/**
 * Theo dõi xem chuột có đang ở bên trong phần tử hay không, nếu ở bên trong thì trả về true, ngược lại trả về false
 * @param refElement Tất cả các phần tử cần kiểm tra. Hỗ trợ một phần tử, mảng phần tử hoặc mảng phần tử dạng tham chiếu phản ứng. Nếu chuột ở bên trong bất kỳ phần tử nào cũng sẽ trả về true
 * @param delay Thời gian trễ cập nhật trạng thái, có thể là số hoặc đối tượng cấu hình chứa thời gian trễ khi vào/ra
 * @returns Trả về một mảng, phần tử đầu tiên là một ref cho biết chuột có đang ở bên trong phần tử hay không, phần tử thứ hai là một bộ điều khiển, có thể bật/tắt listener thông qua các phương thức enable và disable
 */
export function useHoverToggle(
  refElement: Arrayable<MaybeElementRef> | Ref<HTMLElement[] | null>,
  delay: (() => number) | HoverDelayOptions | number = DEFAULT_LEAVE_DELAY,
) {
  // Tương thích với API phiên bản cũ
  const normalizedOptions: HoverDelayOptions =
    typeof delay === 'number' || isFunction(delay)
      ? { enterDelay: DEFAULT_ENTER_DELAY, leaveDelay: delay }
      : {
          enterDelay: DEFAULT_ENTER_DELAY,
          leaveDelay: DEFAULT_LEAVE_DELAY,
          ...delay,
        };

  const value = ref(false);
  const enterTimer = ref<ReturnType<typeof setTimeout> | undefined>();
  const leaveTimer = ref<ReturnType<typeof setTimeout> | undefined>();
  const hoverScopes = ref<ReturnType<typeof effectScope>[]>([]);

  // Dùng computed để bọc refElement, giúp nó thay đổi một cách phản ứng
  const refs = computed(() => {
    const raw = unref(refElement);
    if (raw === null) return [];
    return Array.isArray(raw) ? raw : [raw];
  });
  // Lưu trữ tất cả trạng thái hover
  const isHovers = ref<Array<Ref<boolean>>>([]);

  // Hàm cập nhật listener hover
  function updateHovers() {
    // Dừng và dọn dẹp các scope trước đó
    hoverScopes.value.forEach((scope) => scope.stop());
    hoverScopes.value = [];

    isHovers.value = refs.value.map((refEle) => {
      if (!refEle) {
        return ref(false);
      }
      const eleRef = computed(() => {
        const ele = unref(refEle);
        return ele instanceof Element ? ele : (ele?.$el as Element);
      });

      // Tạo scope riêng cho từng phần tử
      const scope = effectScope();
      const hoverRef = scope.run(() => useElementHover(eleRef)) || ref(false);
      hoverScopes.value.push(scope);

      return hoverRef;
    });
  }

  // Theo dõi sự thay đổi số lượng phần tử, tránh thực thi quá mức
  const elementsCount = computed(() => {
    const raw = unref(refElement);
    if (raw === null) return 0;
    return Array.isArray(raw) ? raw.length : 1;
  });

  // Thiết lập ban đầu
  updateHovers();

  // Chỉ thiết lập lại listener khi số lượng phần tử thay đổi
  const stopWatcher = watch(elementsCount, updateHovers, { deep: false });

  const isOutsideAll = computed(() => isHovers.value.every((v) => !v.value));

  function clearTimers() {
    if (enterTimer.value) {
      clearTimeout(enterTimer.value);
      enterTimer.value = undefined;
    }
    if (leaveTimer.value) {
      clearTimeout(leaveTimer.value);
      leaveTimer.value = undefined;
    }
  }

  function setValueDelay(val: boolean) {
    clearTimers();

    if (val) {
      // Chuột di vào
      const enterDelay = normalizedOptions.enterDelay ?? DEFAULT_ENTER_DELAY;
      const delayTime = isFunction(enterDelay) ? enterDelay() : enterDelay;

      if (delayTime <= 0) {
        value.value = true;
      } else {
        enterTimer.value = setTimeout(() => {
          value.value = true;
          enterTimer.value = undefined;
        }, delayTime);
      }
    } else {
      // Chuột di ra
      const leaveDelay = normalizedOptions.leaveDelay ?? DEFAULT_LEAVE_DELAY;
      const delayTime = isFunction(leaveDelay) ? leaveDelay() : leaveDelay;

      if (delayTime <= 0) {
        value.value = false;
      } else {
        leaveTimer.value = setTimeout(() => {
          value.value = false;
          leaveTimer.value = undefined;
        }, delayTime);
      }
    }
  }

  const hoverWatcher = watch(
    isOutsideAll,
    (val) => {
      setValueDelay(!val);
    },
    { immediate: true },
  );

  const controller = {
    enable() {
      hoverWatcher.resume();
    },
    disable() {
      hoverWatcher.pause();
    },
  };

  onUnmounted(() => {
    clearTimers();
    // Dừng listener
    stopWatcher();
    // Dừng tất cả các scope còn lại
    hoverScopes.value.forEach((scope) => scope.stop());
  });

  return [value, controller] as [typeof value, typeof controller];
}
