/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { HubConnection, IHttpConnectionOptions } from '@microsoft/signalr';

import { useAccessStore } from '@vben/stores';

import { useEventBus } from '@abp/core';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

interface SignalROptions {
  /** Tự động kết nối lại khi mất kết nối */
  automaticReconnect?: boolean;
  /** Tự động thiết lập kết nối khi khởi tạo */
  autoStart?: boolean;
  /** Khoảng thời gian thử lại lần sau (ms) */
  nextRetryDelayInMilliseconds?: number;
  /** URL phía máy chủ */
  serverUrl: string;
  /** Có mang theo mã truy cập hay không */
  useAccessToken?: boolean;
}

export function useSignalR() {
  const { publish, subscribe } = useEventBus();

  let connection: HubConnection | null = null;

  /** Khởi tạo SignalR */
  async function init({
    automaticReconnect = true,
    autoStart = false,
    nextRetryDelayInMilliseconds = 60_000,
    serverUrl,
    useAccessToken = true,
  }: SignalROptions) {
    const httpOptions: IHttpConnectionOptions = {};
    if (useAccessToken) {
      httpOptions.accessTokenFactory = () => {
        const accessStore = useAccessStore();
        const token = accessStore.accessToken;
        if (!token) {
          return '';
        }
        return token.startsWith('Bearer ') ? token.slice(7) : token;
      };
    }
    const connectionBuilder = new HubConnectionBuilder()
      .withUrl(serverUrl, httpOptions)
      .configureLogging(LogLevel.Warning);
    if (automaticReconnect && nextRetryDelayInMilliseconds) {
      connectionBuilder.withAutomaticReconnect({
        nextRetryDelayInMilliseconds: () => nextRetryDelayInMilliseconds,
      });
    }
    connection = connectionBuilder.build();
    if (autoStart) {
      await start();
    }
  }

  /** Khởi động kết nối */
  async function start(): Promise<void> {
    _throwIfNotInit();
    publish('signalR:beforeStart');
    try {
      await connection!.start();
      publish('signalR:onStart');
    } catch (error) {
      publish('signalR:onError', error);
    }
  }

  /** Đóng kết nối */
  async function stop(): Promise<void> {
    _throwIfNotInit();
    publish('signalR:beforeStop');
    try {
      await connection!.stop();
      publish('signalR:onStop');
    } catch (error) {
      publish('signalR:onError', error);
    }
  }

  /** Sự kiện trước khi kết nối */
  function beforeStart<T = any>(callback: (event?: T) => void) {
    subscribe('signalR:beforeStart', callback);
  }

  /** Sự kiện sau khi kết nối */
  function onStart<T = any>(callback: (event?: T) => void) {
    subscribe('signalR:onStart', callback);
  }

  /** Sự kiện trước khi đóng kết nối */
  function beforeStop<T = any>(callback: (event?: T) => void) {
    subscribe('signalR:beforeStop', callback);
  }

  /** Sự kiện sau khi đóng kết nối */
  function onStop<T = any>(callback: (event?: T) => void) {
    subscribe('signalR:onStop', callback);
  }

  /** Sự kiện lỗi kết nối */
  function onError(callback: (error?: Error) => void) {
    subscribe('signalR:onError', callback);
  }

  /** Đăng ký nhận thông báo từ máy chủ */
  function on(methodName: string, newMethod: (...args: any[]) => void): void {
    connection?.on(methodName, newMethod);
  }

  /** Hủy đăng ký nhận thông báo từ máy chủ */
  function off(methodName: string, method: (...args: any[]) => void): void {
    connection?.off(methodName, method);
  }

  /** Sự kiện đóng kết nối */
  function onClose(callback: (error?: Error) => void): void {
    connection?.onclose(callback);
  }

  /** Gửi thông báo */
  function send(methodName: string, ...args: any[]): Promise<void> {
    _throwIfNotInit();
    return connection!.send(methodName, ...args);
  }

  /** Gọi hàm */
  function invoke<T = any>(methodName: string, ...args: any[]): Promise<T> {
    _throwIfNotInit();
    return connection!.invoke(methodName, ...args);
  }

  function _throwIfNotInit() {
    if (connection === null) {
      throw new Error('unable to send message, connection not initialized!');
    }
  }

  return {
    beforeStart,
    beforeStop,
    init,
    invoke,
    off,
    on,
    onClose,
    onError,
    onStart,
    onStop,
    send,
    start,
    stop,
  };
}
