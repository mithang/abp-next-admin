export class StateHandler {
  private condition: boolean = false;
  private rejectCondition: (() => void) | null = null;
  private resolveCondition: (() => void) | null = null;

  isConditionTrue(): boolean {
    return this.condition;
  }

  reset() {
    this.condition = false;
    this.clearPromises();
  }

  // Khi trạng thái kích hoạt là false thì reject
  setConditionFalse() {
    this.condition = false;
    if (this.rejectCondition) {
      this.rejectCondition();
      this.clearPromises();
    }
  }

  // Khi trạng thái kích hoạt là true thì resolve
  setConditionTrue() {
    this.condition = true;
    if (this.resolveCondition) {
      this.resolveCondition();
      this.clearPromises();
    }
  }

  // Trả về một Promise, chờ condition chuyển thành true
  waitForCondition(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.condition) {
        resolve(); // Nếu condition đã là true thì resolve ngay
      } else {
        this.resolveCondition = resolve;
        this.rejectCondition = reject;
      }
    });
  }

  // Dọn hàm resolve/reject
  private clearPromises() {
    this.resolveCondition = null;
    this.rejectCondition = null;
  }
}
