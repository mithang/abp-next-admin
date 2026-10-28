import { describe, expect, it } from 'vitest';

import { StateHandler } from '../state-handler';

describe('stateHandler', () => {
  it('should resolve when condition is set to true', async () => {
    const handler = new StateHandler();

    // Mô phỏng việc đặt condition thành true một cách không đồng bộ
    setTimeout(() => {
      handler.setConditionTrue(); // Kích hoạt rõ ràng condition thành true
    }, 10);

    // Chờ điều kiện được đặt thành true
    await handler.waitForCondition();
    expect(handler.isConditionTrue()).toBe(true);
  });

  it('should resolve immediately if condition is already true', async () => {
    const handler = new StateHandler();
    handler.setConditionTrue(); // Đặt trước thành true

    // Resolve ngay lập tức vì condition đã là true
    await handler.waitForCondition();
    expect(handler.isConditionTrue()).toBe(true);
  });

  it('should reject when condition is set to false after waiting', async () => {
    const handler = new StateHandler();

    // Mô phỏng việc đặt condition thành false một cách không đồng bộ
    setTimeout(() => {
      handler.setConditionFalse(); // Kích hoạt rõ ràng condition thành false
    }, 10);

    // Trong quá trình chờ, kỳ vọng Promise bị reject
    await expect(handler.waitForCondition()).rejects.toThrow();
    expect(handler.isConditionTrue()).toBe(false);
  });

  it('should reset condition to false', () => {
    const handler = new StateHandler();
    handler.setConditionTrue(); // Đặt thành true
    handler.reset(); // Đặt lại thành false

    expect(handler.isConditionTrue()).toBe(false);
  });

  it('should resolve when condition is set to true after reset', async () => {
    const handler = new StateHandler();
    handler.reset(); // Đảm bảo ban đầu là false

    setTimeout(() => {
      handler.setConditionTrue(); // Sau khi đặt lại thì đặt thành true
    }, 10);

    await handler.waitForCondition();
    expect(handler.isConditionTrue()).toBe(true);
  });
});
