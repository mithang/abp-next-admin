import type { ModalApiOptions, ModalState } from './modal';

import { Store } from '@vben-core/shared/store';
import { bindMethods, isFunction } from '@vben-core/shared/utils';

export class ModalApi {
  // Dữ liệu dùng chung
  public sharedData: Record<'payload', any> = {
    payload: {},
  };
  public store: Store<ModalState>;

  private api: Pick<
    ModalApiOptions,
    | 'onBeforeClose'
    | 'onCancel'
    | 'onClosed'
    | 'onConfirm'
    | 'onOpenChange'
    | 'onOpened'
  >;

  // private prevState!: ModalState;
  private state!: ModalState;

  constructor(options: ModalApiOptions = {}) {
    const {
      connectedComponent: _,
      onBeforeClose,
      onCancel,
      onClosed,
      onConfirm,
      onOpenChange,
      onOpened,
      ...storeState
    } = options;

    const defaultState: ModalState = {
      bordered: true,
      centered: false,
      class: '',
      closeOnClickModal: true,
      closeOnPressEscape: true,
      confirmDisabled: false,
      confirmLoading: false,
      contentClass: '',
      destroyOnClose: true,
      draggable: false,
      footer: true,
      footerClass: '',
      fullscreen: false,
      fullscreenButton: true,
      header: true,
      headerClass: '',
      isOpen: false,
      loading: false,
      modal: true,
      openAutoFocus: false,
      showCancelButton: true,
      showConfirmButton: true,
      title: '',
      animationType: 'slide',
    };

    this.store = new Store<ModalState>(
      {
        ...defaultState,
        ...storeState,
      },
      {
        onUpdate: () => {
          const state = this.store.state;

          // Mỗi lần cập nhật trạng thái，đều sẽ gọi onOpenChange hàm callback
          if (state?.isOpen === this.state?.isOpen) {
            this.state = state;
          } else {
            this.state = state;
            this.api.onOpenChange?.(!!state?.isOpen);
          }
        },
      },
    );

    this.state = this.store.state;

    this.api = {
      onBeforeClose,
      onCancel,
      onClosed,
      onConfirm,
      onOpenChange,
      onOpened,
    };
    bindMethods(this);
  }

  /**
   * Đóng popup
   * @description Khi đóng popup sẽ gọi onBeforeClose hàm hook，Nếu onBeforeClose trả về false，thì không đóng popup
   */
  async close() {
    // Thông qua hàm hook onBeforeClose để xác định có cho phép đóng popup không
    // Nếu onBeforeClose trả về false，thì không đóng popup
    const allowClose = (await this.api.onBeforeClose?.()) ?? true;
    if (allowClose) {
      this.store.setState((prev) => ({
        ...prev,
        isOpen: false,
      }));
    }
  }

  getData<T extends object = Record<string, any>>() {
    return (this.sharedData?.payload ?? {}) as T;
  }

  /**
   * Khóa trạng thái popup（dùng cho trạng thái chờ trong quá trình gửi）
   * @description Trạng thái khóa sẽ vô hiệu hóa nút hủy mặc định，Sử dụngspinnerphủ nội dung popup，ẩn nút đóng，chặn đóng popup thủ công，đánh dấu nút gửi mặc định thành trạng thái loading
   * @param isLocked Có khóa không
   */
  lock(isLocked = true) {
    return this.setState({ submitting: isLocked });
  }

  /**
   * Thao tác hủy
   */
  onCancel() {
    if (this.api.onCancel) {
      this.api.onCancel?.();
    } else {
      this.close();
    }
  }

  /**
   * Callback sau khi animation đóng popup phát xong
   */
  onClosed() {
    if (!this.state.isOpen) {
      this.api.onClosed?.();
    }
  }

  /**
   * Thao tác xác nhận
   */
  onConfirm() {
    this.api.onConfirm?.();
  }

  /**
   * Callback sau khi animation mở popup phát xong
   */
  onOpened() {
    if (this.state.isOpen) {
      this.api.onOpened?.();
    }
  }

  open() {
    this.store.setState((prev) => ({
      ...prev,
      isOpen: true,
      submitting: false,
    }));
  }

  setData<T>(payload: T) {
    this.sharedData.payload = payload;
    return this;
  }

  setState(
    stateOrFn:
      ((prev: ModalState) => Partial<ModalState>) | Partial<ModalState>,
  ) {
    if (isFunction(stateOrFn)) {
      this.store.setState(stateOrFn);
    } else {
      this.store.setState((prev) => ({ ...prev, ...stateOrFn }));
    }
    return this;
  }

  /**
   * Hủy trạng thái khóa của popup
   * @description Hủy trạng thái khóa do phương thức lock đặt, là bí danh của lock(false)
   */
  unlock() {
    return this.lock(false);
  }
}
