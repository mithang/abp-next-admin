export interface JsonViewerProps {
  /** Dữ liệu có cấu trúc cần hiển thị */
  value: any;
  /** Độ sâu mở rộng */
  expandDepth?: number;
  /** Có thể sao chép hay không */
  copyable?: boolean;
  /** Có sắp xếp hay không */
  sort?: boolean;
  /** Hiển thị viền */
  boxed?: boolean;
  /** Chủ đề */
  theme?: string;
  /** Có mở rộng hay không */
  expanded?: boolean;
  /** Hàm định dạng thời gian */
  timeformat?: (time: Date | number | string) => string;
  /** Chế độ xem trước */
  previewMode?: boolean;
  /** Hiển thị chỉ số mảng */
  showArrayIndex?: boolean;
  /** Hiển thị dấu ngoặc kép */
  showDoubleQuotes?: boolean;
}

export interface JsonViewerAction {
  action: string;
  text: string;
  trigger: HTMLElement;
}

export interface JsonViewerValue {
  value: any;
  path: string;
  depth: number;
  el: HTMLElement;
}

export interface JsonViewerToggle {
  /** Sự kiện chuột */
  event: MouseEvent;
  /** Trạng thái mở rộng hiện tại */
  open: boolean;
}
