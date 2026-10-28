interface TreeConfigOptions {
  // Tên của thuộc tính con, mặc định là 'children'
  childProps: string;
}

/**
 * @zh_CN Duyệt cấu trúc cây và trả về giá trị được chỉ định trong tất cả các nút.
 * @param tree Mảng cấu trúc cây
 * @param getValue Hàm lấy giá trị của nút
 * @param options Tên thuộc tính tùy chọn dùng làm mảng nút con.
 * @returns Mảng các giá trị được chỉ định trong tất cả các nút
 */
function traverseTreeValues<T, V>(
  tree: T[],
  getValue: (node: T) => V,
  options?: TreeConfigOptions,
): V[] {
  const result: V[] = [];
  const { childProps } = options || {
    childProps: 'children',
  };

  const dfs = (treeNode: T) => {
    const value = getValue(treeNode);
    result.push(value);
    const children = (treeNode as Record<string, any>)?.[childProps];
    if (!children) {
      return;
    }
    if (children.length > 0) {
      for (const child of children) {
        dfs(child);
      }
    }
  };

  for (const treeNode of tree) {
    dfs(treeNode);
  }
  return result.filter(Boolean);
}

/**
 * Lọc các nút của cấu trúc cây cho trước theo điều kiện và trả về mảng tất cả nút khớp theo thứ tự ban đầu.
 * @param tree Mảng nút gốc của cấu trúc cây cần lọc.
 * @param filter Điều kiện dùng để khớp từng nút.
 * @param options Tên thuộc tính tùy chọn dùng làm mảng nút con.
 * @returns Mảng chứa tất cả nút khớp.
 */
function filterTree<T extends Record<string, any>>(
  tree: T[],
  filter: (node: T) => boolean,
  options?: TreeConfigOptions,
): T[] {
  const { childProps } = options || {
    childProps: 'children',
  };

  const _filterTree = (nodes: T[]): T[] => {
    return nodes.filter((node: Record<string, any>) => {
      if (filter(node as T)) {
        if (node[childProps]) {
          node[childProps] = _filterTree(node[childProps]);
        }
        return true;
      }
      return false;
    });
  };

  return _filterTree(tree);
}

/**
 * Ánh xạ lại các nút của cấu trúc cây cho trước theo điều kiện
 * @param tree Mảng nút gốc của cấu trúc cây cần lọc.
 * @param mapper Điều kiện dùng để map từng nút.
 * @param options Tên thuộc tính tùy chọn dùng làm mảng nút con.
 */
function mapTree<T, V extends Record<string, any>>(
  tree: T[],
  mapper: (node: T) => V,
  options?: TreeConfigOptions,
): V[] {
  const { childProps } = options || {
    childProps: 'children',
  };
  return tree.map((node) => {
    const mapperNode: Record<string, any> = mapper(node);
    if (mapperNode[childProps]) {
      mapperNode[childProps] = mapTree(mapperNode[childProps], mapper, options);
    }
    return mapperNode as V;
  });
}

/**
 * Sắp xếp đệ quy dữ liệu cấu trúc cây
 * @param treeData - Mảng dữ liệu cây
 * @param sortFunction - Hàm sắp xếp, dùng để định nghĩa quy tắc sắp xếp
 * @param options - Tùy chọn cấu hình, bao gồm tên thuộc tính nút con
 * @returns Dữ liệu cây sau khi sắp xếp
 */
function sortTree<T extends Record<string, any>>(
  treeData: T[],
  sortFunction: (a: T, b: T) => number,
  options?: TreeConfigOptions,
): T[] {
  const { childProps } = options || {
    childProps: 'children',
  };

  return treeData.toSorted(sortFunction).map((item) => {
    const children = item[childProps];
    if (children && Array.isArray(children) && children.length > 0) {
      return {
        ...item,
        [childProps]: sortTree(children, sortFunction, options),
      };
    }
    return item;
  });
}

export { filterTree, mapTree, sortTree, traverseTreeValues };
