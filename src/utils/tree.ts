interface TreeHelperConfig {
  id: string;
  children: string;
  pid: string;
}
const DEFAULT_CONFIG: TreeHelperConfig = {
  id: 'id',
  children: 'children',
  pid: 'pid',
};

interface Fn<T = any> {
  (...arg: T[]): T;
}

/**
 * get config
 * @param config
 */
const getConfig = (config: Partial<TreeHelperConfig>) => Object.assign({}, DEFAULT_CONFIG, config);

/**
 * tree from list
 * @param list
 * @param config
 */
export function listToTree<T = any>(list: any[], config: Partial<TreeHelperConfig> = {}): T[] {
  const conf = getConfig(config) as TreeHelperConfig;
  const nodeMap = new Map();
  const result: T[] = [];
  const { id, children, pid } = conf;

  for (const node of list) {
    node[children] = node[children] || [];
    nodeMap.set(node[id], node);
  }
  for (const node of list) {
    const parent = nodeMap.get(node[pid]);
    (parent ? parent.children : result).push(node);
  }
  return result;
}

/**
 * tree to list
 * @param tree
 * @param config
 */
export function treeToList<T = any>(tree: any, config: Partial<TreeHelperConfig> = {}): T {
  config = getConfig(config);
  const { children } = config;
  const result: any = [...tree];
  for (let i = 0; i < result.length; i++) {
    if (!result[i][children!]) continue;
    result.splice(i + 1, 0, ...result[i][children!]);
  }
  return result;
}

/**
 * find node
 * @param tree
 * @param func
 * @param config
 */
export function findNode<T = any>(tree: any, func: Fn, config: Partial<TreeHelperConfig> = {}): T | null {
  config = getConfig(config);
  const { children } = config;
  const list = [...tree];
  for (const node of list) {
    if (func(node)) return node;
    node[children!] && list.push(...node[children!]);
  }
  return null;
}

/**
 * find node all
 * @param tree
 * @param func
 * @param config
 */
export function findNodeAll<T = any>(tree: any, func: Fn, config: Partial<TreeHelperConfig> = {}): T[] {
  config = getConfig(config);
  const { children } = config;
  const list = [...tree];
  const result: T[] = [];
  for (const node of list) {
    func(node) && result.push(node);
    node[children!] && list.push(...node[children!]);
  }
  return result;
}

/**
 * find path
 * @param tree
 * @param func
 * @param config
 */
export function findPath<T = any>(tree: any, func: Fn, config: Partial<TreeHelperConfig> = {}): T | T[] | null {
  config = getConfig(config);
  const path: T[] = [];
  const list = [...tree];
  const visitedSet = new Set();
  const { children } = config;
  while (list.length) {
    const node = list[0];
    if (visitedSet.has(node)) {
      path.pop();
      list.shift();
    } else {
      visitedSet.add(node);
      node[children!] && list.unshift(...node[children!]);
      path.push(node);
      if (func(node)) return path;
    }
  }
  return null;
}

/**
 * find path all
 * @param tree
 * @param func
 * @param config
 */
export function findPathAll(tree: any, func: Fn, config: Partial<TreeHelperConfig> = {}) {
  config = getConfig(config);
  const path: any[] = [];
  const list = [...tree];
  const result: any[] = [];
  const visitedSet = new Set();
  const { children } = config;
  while (list.length) {
    const node = list[0];
    if (visitedSet.has(node)) {
      path.pop();
      list.shift();
    } else {
      visitedSet.add(node);
      node[children!] && list.unshift(...node[children!]);
      path.push(node);
      func(node) && result.push([...path]);
    }
  }
  return result;
}

/**
 * filter
 * @param tree
 * @param func
 * @param config
 */
export function filter<T = any>(tree: T[], func: (n: T) => boolean, config: Partial<TreeHelperConfig> = {}): T[] {
  config = getConfig(config);
  const children = config.children as string;
  /**
   * list filter
   * @param list
   */
  function listFilter(list: T[]) {
    return list
      .map((node: any) => ({ ...node }))
      .filter(node => {
        node[children] = node[children] && listFilter(node[children]);
        return func(node) || (node[children] && node[children].length);
      });
  }
  return listFilter(tree);
}

/**
 * 对树形数据结构进行映射，并对每个节点应用转换函数。
 * 该函数递归地遍历树结构，对每个节点应用转换函数。
 * 如果树结构包含嵌套节点，则也会遍历它们。
 * @param {T[]} treeData - 要映射的树形数据结构。
 * @param {{ children?: string, conversion: Fn }} opt - 包含以下属性的选项对象：
 * - `children`（可选）：每个项目中表示子节点的键。默认为 'children'。
 * - `conversion`：要应用于每个节点的转换函数。
 * @param opt.children
 * @param opt.conversion
 * @returns {T[]} 包含转换后的树结构的数组。
 */
export function treeMap<T = any>(treeData: T[], opt: { children?: string; conversion: Fn }): T[] {
  return treeData.map(item => treeMapEach(item, opt));
}

/**
 * 递归处理树形数据结构的每个节点，并应用转换函数。
 * @param {any} data - 要处理的树结构中的当前节点。
 * @param {{ children?: string, conversion: Fn }} - 包含以下属性的选项对象：
 * - `children`（可选）：每个项目中表示子节点的键。默认为 'children'。
 * - `conversion`：要应用于当前节点的转换函数。
 * @returns {any} 带有应用的转换函数的处理后的节点。
 */
export function treeMapEach(data: any, { children = 'children', conversion }: { children?: string; conversion: Fn }) {
  const haveChildren = Array.isArray(data[children]) && data[children].length > 0;
  const conversionData = conversion(data) || {};
  if (haveChildren) {
    return {
      ...conversionData,
      [children]: data[children].map((i: number) =>
        treeMapEach(i, {
          children,
          conversion,
        })
      ),
    };
  } else {
    return {
      ...conversionData,
    };
  }
}

/**
 * 递归遍历树结构
 * @param treeDatas 树
 * @param callBack 回调
 * @param parentNode 父节点
 */
export function eachTree(treeDatas: any[], callBack: Fn, parentNode = {}) {
  treeDatas.forEach(element => {
    const newNode = callBack(element, parentNode) || element;
    if (element.children) eachTree(element.children, callBack, newNode);
  });
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export function handleTree(data: any[], id?: string, parentId?: string, children?: string) {
  if (!Array.isArray(data)) {
    console.warn('data must be an array');
    return [];
  }
  const config = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children',
  };

  const childrenListMap: any = {};
  const nodeIds: any = {};
  const tree: any[] = [];

  for (const d of data) {
    const parentId = d[config.parentId];
    if (childrenListMap[parentId] == null) childrenListMap[parentId] = [];

    nodeIds[d[config.id]] = d;
    childrenListMap[parentId].push(d);
  }

  for (const d of data) {
    const parentId = d[config.parentId];
    if (nodeIds[parentId] == null) tree.push(d);
  }

  for (const t of tree) adaptToChildrenList(t);

  /**
   * adaptToChildrenList
   * @param o
   */
  function adaptToChildrenList(o: any) {
    if (childrenListMap[o[config.id]] !== null) o[config.childrenList] = childrenListMap[o[config.id]];

    if (o[config.childrenList]) {
      for (const c of o[config.childrenList]) adaptToChildrenList(c);
    }
  }
  return tree;
}

/**
 * 构造树型结构数据
 * @param data 数据源
 * @param id id字段 默认 'id'
 * @param parentId 父节点字段 默认 'parentId'
 * @param children 孩子节点字段 默认 'children'
 * @param rootId 根Id 默认 0
 */
export function handleTree2(data: Array<any>, id: string | number, parentId: string | number, children: Array<string | number>, rootId: string | number) {
  id = id || 'id';
  parentId = parentId || 'parentId';
  // children = children || 'children'
  rootId =
    rootId ||
    Math.min(
      ...data.map(item => {
        return item[parentId];
      })
    ) ||
    0;
  // 对源数据深度克隆
  const cloneData: any = JSON.parse(JSON.stringify(data));
  // 循环所有项
  const treeData = cloneData.filter((father: any) => {
    const branchArr = cloneData.filter((child: any) => {
      // 返回每一项的子级数组
      return father[id] === child[parentId];
    });
    if (branchArr.length > 0) father.children = branchArr;

    // 返回第一层
    return father[parentId] === rootId;
  });
  return treeData !== '' ? treeData : data;
}

// 根据条件改变树属性
export function ChangeTreeattribute(treeData: any, checkedKeys: any) {
  // 递归遍历树形数据，根据checkedKeys设置selectFlag
  const updateNodeFlag = (node: any) => {
    node.selectFlag = checkedKeys.includes(node.nodeId); // 核心：判断是否在勾选ID数组中
    if (node.children && node.children.length) {
      node.children.forEach((child: any) => updateNodeFlag(child));
    }
  };
  // 遍历顶层节点
  treeData.forEach((node: any) => updateNodeFlag(node));
}

/**
 * 筛选树形数据中selectFlag为true的节点ID
 * @param {Array} treeData - 树形数据数组（根节点数组）
 * @returns {Array} 包含符合条件节点ID的新数组
 */
export function getSelectedNodeIds(treeData: any[], key: string) {
  const result: any = []; // 存储结果ID的数组

  // 递归处理单个节点
  function traverseNode(node: any) {
    // 检查当前节点是否选中
    if (node.selectFlag === true) {
      result.push(node[key]); // 符合条件则push nodeId
    }
    // 若有子节点，递归遍历
    if (Array.isArray(node.children) && node.children.length > 0) {
      node.children.forEach((child: any) => traverseNode(child));
    }
  }

  // 遍历根节点数组
  treeData.forEach(rootNode => traverseNode(rootNode));

  return result;
}
