<script setup lang="ts">
import type {
  AntTreeNodeDropEvent,
  DataNode,
  EventDataNode,
} from 'ant-design-vue/es/tree';
import type { Key } from 'ant-design-vue/es/vc-table/interface';

import { defineAsyncComponent, h, onMounted, ref, watchEffect } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { createIconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { PermissionModal } from '@abp/permissions';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  RedoOutlined,
} from '@ant-design/icons-vue';
import {
  Button,
  Card,
  Dropdown,
  Menu,
  message,
  Modal,
  Tree,
} from 'ant-design-vue';

import { useOrganizationUnitsApi } from '../../api/useOrganizationUnitsApi';

defineOptions({
  name: 'OrganizationUnitTree',
});

const emits = defineEmits<{
  (event: 'selected', id?: string): void;
}>();

const { deleteApi, getApi, getChildrenApi, getRootListApi, moveTo } =
  useOrganizationUnitsApi();

const MenuItem = Menu.Item;
const PermissionsOutlined = createIconifyIcon('icon-park-outline:permissions');
const OrganizationUnitModal = defineAsyncComponent(
  () => import('./OrganizationUnitModal.vue'),
);

interface ContextMenuActionMap {
  [key: string]: (id: string) => Promise<void> | void;
}
const actionsMap: ContextMenuActionMap = {
  create: onCreate,
  delete: onDelete,
  permissions: onPermissions,
  refresh: onRefresh,
  update: onUpdate,
};

const organizationUnits = ref<DataNode[]>([]);
const loadedKeys = ref<string[]>([]);
const selectedKey = ref<string>();

const [OrganizationUnitEditModal, editModalApi] = useVbenModal({
  connectedComponent: OrganizationUnitModal,
});
const [OrganizationUnitPermissionModal, permissionModalApi] = useVbenModal({
  connectedComponent: PermissionModal,
});

/** Làm mới cây tổ chức */
async function onRefresh() {
  loadedKeys.value = [];
  const { items } = await getRootListApi();
  organizationUnits.value = items.map((item) => {
    return {
      isLeaf: false,
      key: item.id,
      title: item.displayName,
      children: [],
    };
  });
}

/** Tải nút cây tổ chức */
async function onLoad(node: EventDataNode) {
  const nodeKey = String(node.key);
  const { items } = await getChildrenApi({ id: nodeKey });
  node.dataRef!.isLeaf = items.length === 0;
  node.dataRef!.children = items.map((item): DataNode => {
    return {
      isLeaf: false,
      key: item.id,
      title: item.displayName,
      children: [],
    };
  });
  organizationUnits.value = [...organizationUnits.value];
  loadedKeys.value.push(nodeKey);
}

/** Sự kiện nhấp chuột phải */
function onRightClick() {
  // Ngăn sự kiện mặc định
}

/** Tạo cây tổ chức */
function onCreate(parentId?: string) {
  editModalApi.setData({ parentId });
  editModalApi.open();
}

/** Sửa cây tổ chức */
function onUpdate(id: string) {
  editModalApi.setData({ id });
  editModalApi.open();
}

/** Sửa quyền cây tổ chức */
async function onPermissions(id: string) {
  const dto = await getApi(id);
  permissionModalApi.setData({
    displayName: dto.displayName,
    providerKey: id,
    providerName: 'O',
  });
  permissionModalApi.open();
}

/** Xóa tổ chức */
function onDelete(id: string) {
  Modal.confirm({
    centered: true,
    content: $t('AbpUi.ItemWillBeDeletedMessage'),
    maskClosable: false,
    onOk: async () => {
      await deleteApi(id);
      message.success($t('AbpUi.DeletedSuccessfully'));
      onRefresh();
    },
    title: $t('AbpUi.AreYouSure'),
  });
}

/** Sự kiện nhấp menu chuột phải */
function onMenuClick(id: string, eventKey: Key) {
  actionsMap[eventKey]!(id);
}

/** Sự kiện thay đổi lựa chọn tổ chức */
function onSelectChange(selectedKeys: Key[]) {
  if (selectedKeys.length === 0) {
    selectedKey.value = undefined;
    return;
  }
  selectedKey.value = String(selectedKeys[0]);
}

/** Sự kiện kéo nút tổ chức */
function onDrop(info: AntTreeNodeDropEvent) {
  if (!info.dragNode.eventKey) {
    return;
  }
  const eventKey = String(info.dragNode.eventKey);
  const api =
    info.dropPosition === -1
      ? moveTo(eventKey, undefined) // parent
      : moveTo(eventKey, String(info.node.eventKey)); // children
  api.then(onRefresh);
}

onMounted(onRefresh);

watchEffect(() => {
  emits('selected', selectedKey.value);
});
</script>

<template>
  <Card :title="$t('AbpIdentity.OrganizationUnit:Tree')">
    <template #extra>
      <Button :icon="h(PlusOutlined)" type="primary" @click="() => onCreate()">
        {{ $t('AbpIdentity.OrganizationUnit:AddRoot') }}
      </Button>
    </template>
    <Tree
      :load-data="onLoad"
      :loaded-keys="loadedKeys"
      :tree-data="organizationUnits"
      block-node
      draggable
      @drop="onDrop"
      @right-click="onRightClick"
      @select="onSelectChange"
    >
      <template #title="{ key: treeKey, title }">
        <Dropdown :trigger="['contextmenu']">
          <span> {{ title }}</span>
          <template #overlay>
            <Menu @click="({ key: menuKey }) => onMenuClick(treeKey, menuKey)">
              <MenuItem key="update" :icon="h(EditOutlined)">
                {{ $t('AbpUi.Edit') }}
              </MenuItem>
              <MenuItem key="create" :icon="h(PlusOutlined)">
                {{ $t('AbpIdentity.OrganizationUnit:AddChildren') }}
              </MenuItem>
              <MenuItem key="delete" :icon="h(DeleteOutlined)">
                {{ $t('AbpUi.Delete') }}
              </MenuItem>
              <MenuItem key="permissions" :icon="h(PermissionsOutlined)">
                {{ $t('AbpIdentity.Permissions') }}
              </MenuItem>
              <MenuItem key="refresh" :icon="h(RedoOutlined)">
                {{ $t('AbpIdentity.OrganizationUnit:RefreshRoot') }}
              </MenuItem>
            </Menu>
          </template>
        </Dropdown>
      </template>
    </Tree>
  </Card>
  <OrganizationUnitEditModal @change="onRefresh" />
  <OrganizationUnitPermissionModal />
</template>

<style scoped></style>
