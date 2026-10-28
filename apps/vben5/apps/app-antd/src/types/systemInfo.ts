interface ComponentKey {
  /** Tên component */
  name: string;
  /** Tên hiển thị của component */
  displayName: string;
}

interface ComponentInfo {
  /** Tên component */
  name: string;
  /** Tập hợp tên component */
  keys: ComponentKey[];
  /** Tập hợp trạng thái component */
  details: Record<string, any>;
}

interface SystemInfo {
  components: ComponentInfo[];
}

export type { SystemInfo };
