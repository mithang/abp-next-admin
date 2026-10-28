export interface PermissionProps {
  providerName: string;
  providerKey?: string;
  readonly: boolean;
  identity?: string;
}

export interface PermissionTree {
  isRoot: boolean;
  /** Định danh quyền */
  name: string;
  /** Tên hiển thị */
  displayName: string;
  /** Có được cấp quyền hay không */
  isGranted?: boolean;
  /** Có bị vô hiệu hóa hay không */
  disabled: boolean;
  /** Nút con */
  children: PermissionTree[];
  /** Nút cha */
  parentName?: string;
}
