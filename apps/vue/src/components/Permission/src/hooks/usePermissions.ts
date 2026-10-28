import type { Ref } from 'vue';
import type { PermissionProps, PermissionTree } from '../types/permission';

import { computed, watch, unref, ref } from 'vue';
import { useLocalization } from '/@/hooks/abp/useLocalization';
import { get, update } from '/@/api/permission-management/permissions';
import { PermissionProvider } from '/@/api/permission-management/permissions/model';
import {
  generatePermissionTree,
  getGrantedPermissionKeys,
  getPermissionCount,
  getGrantPermissionCount,
  getPermissionsCount,
  getGrantPermissionsCount,
  find,
  updateParentGrant,
  updateChildrenGrant,
  toPermissionList,
} from '../utils/helper';
import { useAbpStoreWithOut } from '/@/store/modules/abp';

interface UsePermission {
  getPropsRef: Ref<PermissionProps>;
}

export function usePermissions({ getPropsRef }: UsePermission) {
  const { L } = useLocalization('AbpPermissionManagement');
  /** Tiêu đề lớp bật lên */
  const title = ref('');
  /** Cây quyền */
  const permissionTree = ref<PermissionTree[]>([]);
  /**
   * Lấy dữ liệu cấp quyền
   * @param name Tên nhà cung cấp cấp quyền
   * @param key  Mã định danh nhà cung cấp cấp quyền
   */
  function handleGetPermission(name: string, key?: string) {
    get({ providerName: name, providerKey: key }).then((res) => {
      title.value = `${L('Permissions')} - ${res.entityDisplayName}`;
      permissionTree.value = generatePermissionTree(res.groups);
    });
  }

  /** Tên tab hiện tại
   * @description Định dạng: tên hiển thị quyền + (số lượng đã cấp quyền)
   */
  const permissionTab = computed(() => {
    return (tree: PermissionTree) => {
      const grantCount = getGrantPermissionCount(tree);
      return `${tree.displayName} (${grantCount})`;
    };
  });

  /** Có vô hiệu hóa mọi hộp kiểm quyền hay không */
  const permissionTreeDisabled = computed(() => {
    const abpStore = useAbpStoreWithOut();
    const props = unref(getPropsRef);
    const { currentUser } = abpStore.getApplication;
    // if (props.providerName === 'R') {
    //   // Nhóm người dùng đang đăng nhập bị cấm thao tác quyền của chính nhóm mình
    //   // Nên cho phép
    //   return currentUser.roles.includes(props.providerKey!);
    // }
    // Người dùng đang đăng nhập bị cấm thao tác quyền của chính mình
    return currentUser.id === props.providerKey;
  });

  /** Mã định danh nút quyền đã cấp quyền dưới tab hiện tại (đã tick hộp kiểm) */
  const permissionGrantKeys = computed(() => {
    return (tree: PermissionTree) => {
      return getGrantedPermissionKeys(tree.children);
    };
  });

  /** Trạng thái hộp kiểm quyền dưới tab hiện tại
   * @returns checked Có được chọn hay không
   * @returns indeterminate Có ở trạng thái không xác định (chọn một nửa) hay không
   */
  const permissionTabCheckState = computed(() => {
    return (tree: PermissionTree) => {
      const grantCount = getGrantPermissionCount(tree);
      const permissionCount = getPermissionCount(tree);
      return {
        indeterminate: grantCount > 0 && grantCount < permissionCount,
        checked: grantCount == permissionCount,
      };
    };
  });

  /** Trạng thái hộp kiểm của cây quyền */
  const permissionTreeCheckState = computed(() => {
    const treeList = unref(permissionTree);
    const grantCount = getGrantPermissionsCount(treeList);
    const permissionCount = getPermissionsCount(treeList);
    return {
      indeterminate: grantCount > 0 && grantCount < permissionCount,
      checked: grantCount == permissionCount,
    };
  });

  /** Thay đổi mọi dữ liệu cấp quyền */
  function handleGrantAllPermission(e) {
    if (!unref(permissionTreeDisabled)) {
      updateChildrenGrant(unref(permissionTree), e.target.checked);
    }
  }

  /** Thay đổi dữ liệu cấp quyền dưới tab hiện tại */
  function handleGrantPermissions(tree, e) {
    if (!unref(permissionTreeDisabled)) {
      updateChildrenGrant(tree.children, e.target.checked);
    }
  }

  /** Sự kiện khi chọn một nút cấp quyền */
  function handlePermissionGranted(tree, _selectedKeys, info) {
    const permission = find(tree.children, info.node.eventKey) as PermissionTree;
    if (!permission) return;
    permission.isGranted = info.checked;
    if (permission.parentName && info.checked) {
      // Sau khi cấp quyền cho quyền con thì quyền cha cũng phải được cấp quyền
      updateParentGrant(tree, permission.parentName, true);
    }
    if (permission.children && !info.checked) {
      // Khi hủy cấp quyền cho quyền cha, mọi quyền con đều bị hủy cấp quyền
      updateChildrenGrant(permission.children, false);
    }
  }

  /** Lưu dữ liệu cấp quyền */
  function handleSavePermission() {
    const props = unref(getPropsRef);
    const provider: PermissionProvider = {
      providerName: props.providerName,
      providerKey: props.providerKey,
    };
    const permissions = toPermissionList(unref(permissionTree));
    return update(provider, {
      permissions: permissions,
    });
  }

  /** Theo dõi mã định danh nhà cung cấp cấp quyền, truy vấn lại quyền */
  watch(
    () => unref(getPropsRef).providerKey,
    (key) => {
      permissionTree.value = [];
      if (key) {
        const props = unref(getPropsRef);
        handleGetPermission(props.providerName, key);
      }
    },
  );

  return {
    title,
    permissionTree,
    permissionTab,
    permissionGrantKeys,
    permissionTabCheckState,
    permissionTreeCheckState,
    permissionTreeDisabled,
    handlePermissionGranted,
    handleSavePermission,
    handleGrantAllPermission,
    handleGrantPermissions,
  };
}
