import type { FeatureDto } from '../../types/features';
import type { TreeNode } from './tree';

import { $t } from '@vben/locales';

/**
 * Chuyển danh sách tính năng phẳng thành cấu trúc cây
 */
export function buildFeatureTree(features: FeatureDto[]): TreeNode[] {
  const nodeMap = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  // Tạo tất cả các nút
  features.forEach((feature) => {
    const node: TreeNode = {
      feature,
      children: [],
      level: 0,
      visible: true,
    };
    nodeMap.set(feature.name, node);
  });

  // Thiết lập quan hệ cha-con
  features.forEach((feature) => {
    const node = nodeMap.get(feature.name);
    if (node && feature.parentName && nodeMap.has(feature.parentName)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const parent = nodeMap.get(feature.parentName)!;
      parent.children.push(node);
      node.parent = parent;
      node.level = parent.level + 1;
    } else if (node && !feature.parentName) {
      roots.push(node);
    }
  });

  // Sắp xếp các nút con
  const sortChildren = (nodes: TreeNode[]) => {
    nodes.forEach((node) => {
      if (node.children.length > 0) {
        node.children.sort((a, b) =>
          a.feature.displayName.localeCompare(b.feature.displayName),
        );
        sortChildren(node.children);
      }
    });
  };
  sortChildren(roots);

  return roots;
}

/**
 * Cập nhật khả năng hiển thị của nút (dựa trên trạng thái nút cha)
 */
export function updateVisibility(
  node: TreeNode,
  parentVisible: boolean = true,
): void {
  node.visible = parentVisible;

  if (isCheckboxFeature(node.feature)) {
    const isChecked = Boolean(node.feature.value);
    node.children.forEach((child) => {
      updateVisibility(child, parentVisible && isChecked);
    });
  } else {
    node.children.forEach((child) => {
      updateVisibility(child, parentVisible);
    });
  }
}

/**
 * Kiểm tra xem có phải tính năng kiểu hộp kiểm hay không
 */
export function isCheckboxFeature(feature: FeatureDto): boolean {
  return (
    feature.valueType?.name === 'ToggleStringValueType' &&
    feature.valueType?.validator?.name === 'BOOLEAN'
  );
}

/**
 * Khi giá trị tính năng thay đổi, cập nhật khả năng hiển thị của các nút con của nó
 */
export function onFeatureValueChange(
  feature: FeatureDto,
  treeNodes: TreeNode[],
): void {
  const findNode = (nodes: TreeNode[]): null | TreeNode => {
    for (const node of nodes) {
      if (node.feature.name === feature.name) {
        return node;
      }
      const found = findNode(node.children);
      if (found) return found;
    }
    return null;
  };

  const node = findNode(treeNodes);
  if (node && isCheckboxFeature(node.feature)) {
    updateVisibility(node, true);
  }
}

/**
 * Xử lý chuyển đổi kiểu giá trị tính năng
 */
export function processFeatureValue(feature: FeatureDto): void {
  if (feature.valueType?.name === 'SelectionStringValueType') {
    const valueType = feature.valueType as any;
    if (valueType.itemSource?.items) {
      valueType.itemSource.items.forEach((valueItem: any) => {
        if (valueItem.displayText?.resourceName === 'Fixed') {
          valueItem.displayName = valueItem.displayText.name;
        } else if (
          valueItem.displayText?.resourceName &&
          valueItem.displayText?.name
        ) {
          valueItem.displayName = $t(
            `${valueItem.displayText.resourceName}.${valueItem.displayText.name}`,
          );
        }
      });
    }
  } else {
    switch (feature.valueType?.validator?.name) {
      case 'BOOLEAN': {
        feature.value = String(feature.value).toLocaleLowerCase() === 'true';
        break;
      }
      case 'NUMERIC': {
        if (
          feature.value !== null &&
          feature.value !== undefined &&
          feature.value !== ''
        ) {
          feature.value = Number(feature.value);
        }
        break;
      }
    }
  }
}

/**
 * Xử lý đệ quy tất cả các giá trị tính năng
 */
export function processAllFeatures(treeNodes: TreeNode[]): void {
  const traverse = (nodes: TreeNode[]) => {
    nodes.forEach((node) => {
      processFeatureValue(node.feature);
      traverse(node.children);
    });
  };
  traverse(treeNodes);
}

/**
 * Lấy kiểu thụt lề
 */
export function getIndentStyle(level: number, indentSize: number = 8): string {
  return `${level * indentSize}px`;
}
