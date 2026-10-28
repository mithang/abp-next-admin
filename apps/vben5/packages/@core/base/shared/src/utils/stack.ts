/**
 * @zh_CN Cấu trúc dữ liệu ngăn xếp
 */
export class Stack<T> {
  /**
   * @zh_CN Số lượng phần tử trong ngăn xếp
   */
  get size() {
    return this.items.length;
  }
  /**
   * @zh_CN Có khử trùng lặp hay không
   */
  private readonly dedup: boolean;
  /**
   * @zh_CN Các phần tử trong ngăn xếp
   */
  private items: T[] = [];

  /**
   * @zh_CN Dung lượng tối đa của ngăn xếp
   */
  private readonly maxSize?: number;

  constructor(dedup = true, maxSize?: number) {
    this.maxSize = maxSize;
    this.dedup = dedup;
  }

  /**
   * @zh_CN Xóa sạch các phần tử trong ngăn xếp
   */
  clear() {
    this.items.length = 0;
  }

  /**
   * @zh_CN Xem phần tử ở đỉnh ngăn xếp
   * @returns Phần tử ở đỉnh ngăn xếp
   */
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  /**
   * @zh_CN Lấy ra khỏi ngăn xếp
   * @returns Phần tử ở đỉnh ngăn xếp
   */
  pop(): T | undefined {
    return this.items.pop();
  }

  /**
   * @zh_CN Đưa vào ngăn xếp
   * @param items Các phần tử cần đưa vào ngăn xếp
   */
  push(...items: T[]) {
    items.forEach((item) => {
      // Khử trùng lặp
      if (this.dedup) {
        const index = this.items.indexOf(item);
        if (index !== -1) {
          this.items.splice(index, 1);
        }
      }
      this.items.push(item);
      if (this.maxSize && this.items.length > this.maxSize) {
        this.items.splice(0, this.items.length - this.maxSize);
      }
    });
  }
  /**
   * @zh_CN Loại bỏ các phần tử trong ngăn xếp
   * @param itemList Danh sách các phần tử cần loại bỏ
   */
  remove(...itemList: T[]) {
    this.items = this.items.filter((i) => !itemList.includes(i));
  }
  /**
   * @zh_CN Giữ lại các phần tử trong ngăn xếp
   * @param itemList Danh sách các phần tử cần giữ lại
   */
  retain(itemList: T[]) {
    this.items = this.items.filter((i) => itemList.includes(i));
  }

  /**
   * @zh_CN Chuyển đổi thành mảng
   * @returns Mảng các phần tử trong ngăn xếp
   */
  toArray(): T[] {
    return [...this.items];
  }
}

/**
 * @zh_CN Tạo một thể hiện ngăn xếp
 * @param dedup Có khử trùng lặp hay không
 * @param maxSize Dung lượng tối đa của ngăn xếp
 * @returns Thể hiện ngăn xếp
 */
export const createStack = <T>(dedup = true, maxSize?: number) =>
  new Stack<T>(dedup, maxSize);
