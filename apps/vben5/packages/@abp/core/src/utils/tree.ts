interface TreeHelperConfig {
  children: string;
  id: string;
  pid: string;
}
const DEFAULT_CONFIG: TreeHelperConfig = {
  id: 'id',
  pid: 'pid',
  children: 'children',
};

const getConfig = (config: Partial<TreeHelperConfig>) =>
  Object.assign({}, DEFAULT_CONFIG, config);

// tree from list
export function listToTree<T = any>(
  list: any[],
  config: Partial<TreeHelperConfig> = {},
): T[] {
  const conf = getConfig(config) as TreeHelperConfig;
  const map: { [key: string]: any } = {};
  const roots: any[] = [];
  const { id, pid, children } = conf;

  // Đưa từng phần tử vào map để dễ dàng tra cứu theo id
  list.forEach((item) => {
    map[item[id]] = { ...item, [children]: [] };
  });

  // Xây dựng cấu trúc cây
  list.forEach((item) => {
    const parentId = item[pid];
    if (parentId === null || parentId === undefined) {
      // Nút gốc
      roots.push(map[item[id]]);
    } else {
      // Nút không phải nút gốc, thêm vào mảng children của nút cha
      if (map[parentId]) {
        map[parentId][children].push(map[item[id]]);
      }
    }
  });

  return roots;
}
