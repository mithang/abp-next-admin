import type { EventType, Handler, WildcardHandler } from '../utils/mitt';

import mitt from '../utils/mitt';

const emitter = mitt();

interface EventBus {
  /** Phát hành sự kiện */
  publish(type: '*', event?: any): void;
  /** Phát hành sự kiện */
  publish<T = any>(type: EventType, event?: T): void;

  /** Đăng ký sự kiện */
  subscribe(type: '*', handler: WildcardHandler): void;
  /** Đăng ký sự kiện */
  subscribe<T = any>(type: EventType, handler: Handler<T>): void;

  /** Hủy đăng ký sự kiện */
  unSubscribe(type: '*', handler: WildcardHandler): void;
  /** Hủy đăng ký sự kiện */
  unSubscribe<T = any>(type: EventType, handler: Handler<T>): void;
}

export function useEventBus(): EventBus {
  return {
    publish: emitter.emit,
    subscribe: emitter.on,
    unSubscribe: emitter.off,
  };
}
