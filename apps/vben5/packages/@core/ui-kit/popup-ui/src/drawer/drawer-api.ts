import type { DrawerApiOptions, DrawerState } from './drawer';

import { Store } from '@vben-core/shared/store';
import { bindMethods, isFunction } from '@vben-core/shared/utils';

export class DrawerApi {
  // Dữ liệu dùng chung
  public sharedData: Record<'payload', any> = {
    payload: {},
  };
  public store: Store<DrawerState>;

  private api: Pick<
    DrawerApiOptions,
    | 'onBeforeClose'
    | 'onCancel'
    | 'onClosed'
    | 'onConfirm'
    | 'onOpenChange'
    | 'onOpened'
  >;

  // private prevState!: DrawerState;
  private state!: DrawerState;

  constructor(options: DrawerApiOptions = {}) {
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

    const defaultState: DrawerState = {
      class: '',
      closable: true,
      closeIconPlacement: 'right',
      closeOnClickModal: true,
      closeOnPressEscape: true,
      confirmLoading: false,
      contentClass: '',
      footer: true,
      header: true,
      isOpen: false,
      loading: false,
      modal: true,
      openAutoFocus: false,
      placement: 'right',
      showCancelButton: true,
      showConfirmButton: true,
      submitting: false,
      title: '',
    };

    this.store = new Store<DrawerState>(
      {
        ...defaultState,
        ...storeState,
      },
      {
        onUpdate: () => {
          const state = this.store.state;
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
   * Đóng drawer
   * @description Khi đóng drawer sẽ gọi hàm hook onBeforeClose, nếu onBeforeClose trả về false thì không đóng popup
   */
  async close() {
    // Dựa vào hàm hook onBeforeClose để xác định có cho phép đóng popup không
    // Nếu onBeforeClose trả về false thì không đóng popup
    const allowClose = (await this.api.onBeforeClose?.()) ?? true;
    if (allowClose) {
      this.store.setState((prev) => ({
        ...prev,
        isOpen: false,
        submitting: false,
      }));
    }
  }

  getData<T extends object = Record<string, any>>() {
    return (this.sharedData?.payload ?? {}) as T;
  }

  /**
   * Khóa trạng thái drawer (dùng cho trạng thái chờ trong quá trình gửi)
   * @description Trạng thái khóa sẽ vô hiệu hóa nút hủy mặc định, dùng spinner phủ lên nội dung drawer, ẩn nút đóng, ngăn đóng popup thủ công, đánh dấu nút gửi mặc định ở trạng thái loading
   * @param isLocked Có khóa không
   */
  lock(isLocked: boolean = true) {
    return this.setState({ submitting: isLocked });
  }

  /**
   * Hủy thao tác
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
   * Xác nhận thao tác
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
    this.store.setState((prev) => ({ ...prev, isOpen: true }));
  }

  setData<T>(payload: T) {
    this.sharedData.payload = payload;
    return this;
  }

  setState(
    stateOrFn:
      ((prev: DrawerState) => Partial<DrawerState>) | Partial<DrawerState>,
  ) {
    if (isFunction(stateOrFn)) {
      this.store.setState(stateOrFn);
    } else {
      this.store.setState((prev) => ({ ...prev, ...stateOrFn }));
    }
    return this;
  }

  /**
   * Hủy trạng thái khóa của drawer
   * @description Hủy trạng thái khóa do phương thức lock đặt, là bí danh của lock(false)
   */
  unlock() {
    return this.lock(false);
  }
}
