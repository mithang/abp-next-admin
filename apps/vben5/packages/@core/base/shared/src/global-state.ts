/**
 * Các biến, component, cấu hình dùng chung toàn cục, được chia sẻ giữa các module
 * Triển khai bằng mẫu singleton; singleton phải chú ý không bị ảnh hưởng bởi request, ví dụ thông tin người dùng cần lấy theo request. Về sau nếu có nhu cầu SSR cũng sẽ không bị ảnh hưởng
 */

interface ComponentsState {
  [key: string]: any;
}

interface MessageState {
  copyPreferencesSuccess?: (title: string, content?: string) => void;
}

export interface IGlobalSharedState {
  components: ComponentsState;
  message: MessageState;
}

class GlobalShareState {
  #components: ComponentsState = {};
  #message: MessageState = {};

  /**
   * Định nghĩa thông báo cho từng tình huống bên trong framework
   */
  public defineMessage({ copyPreferencesSuccess }: MessageState) {
    this.#message = {
      copyPreferencesSuccess,
    };
  }

  public getComponents(): ComponentsState {
    return this.#components;
  }

  public getMessage(): MessageState {
    return this.#message;
  }

  public setComponents(value: ComponentsState) {
    this.#components = value;
  }
}

export const globalShareState = new GlobalShareState();
