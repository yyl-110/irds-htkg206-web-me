import { message } from 'ant-design-vue';
/**
 * 根据时间生成随机数
 * @returns
 */
export function generateRandomNumberByTime() {
  const now = new Date();
  const seconds = now.getSeconds(); // 获取当前秒数
  const milliseconds = now.getMilliseconds(); // 获取当前毫秒数
  // 使用秒数和毫秒数作为种子生成随机数
  return Math.floor((seconds * 10000 + milliseconds) * Math.random()).toString();
}

/**
 * 处理日期
 * @param date 日期
 * @returns 2021-07-05
 */
export function handleDate(date: any) {
  const year = date?.getFullYear();
  const month = handleTime(date?.getMonth() + 1);
  const day = handleTime(date?.getDate());
  const hours = handleTime(date?.getHours());
  const minutes = handleTime(date?.getMinutes());
  const seconds = handleTime(date?.getSeconds());
  return `${year}-${month}-${day} `;
}

/**
 * 处理日期
 * @param date 日期
 * @returns 2021-07-05 14:38:09
 */
export function handleDateTime(date: any) {
  const year = date?.$d.getFullYear();
  const month = handleTime(date?.$d.getMonth() + 1);
  const day = handleTime(date?.$d.getDate());
  const hours = handleTime(date?.$d.getHours());
  const minutes = handleTime(date?.$d.getMinutes());
  const seconds = handleTime(date?.$d.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 格式化为 YYYY-MM-DD HH:mm:ss
export function formatDate(date: any) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function handleTime(t) {
  return t < 10 ? `0${t}` : t;
}

/**
 * 替换html中的图片
 * @param html
 */
export function replaceHtmlImg(html: any) {
  if (!html) return html;
  if (html.includes('img')) {
    return html.replace(/<img/gi, '<img style="max-width:100%;height:auto;"');
  } else {
    return html;
  }
}

/**
 * 筛选出children不为空的节点
 * @param {Array} nodes 原始树形数据
 * @returns {Array} 过滤后的树形数据
 */
export function filterNodesWithChildren(nodes: any) {
  return nodes
    .filter((node: any) => {
      // 检查是否有非空children数组
      // && !node.pictureDocNumber
      const hasChildren = (Array.isArray(node.children) && node.children.length > 0) || node.pdfFlag;
      return hasChildren;
    })
    .map((node: any) => {
      // 浅拷贝节点
      const newNode = { ...node };
      // 递归处理子节点
      if (newNode.children) {
        newNode.children = filterNodesWithChildren(newNode.children);
      }
      return newNode;
    });
}

/**
 * @description 过滤树形结构数据
 * @param tree 树形结构数据
 * @param conditionFn 条件函数，用于判断节点是否满足条件
 * @returns 满足条件的节点数组
 */
export function filterTree(tree: any, conditionFn: any): Array<any>[] {
  const result = <Array<any>>[];
  function traverse(node: any, parentId: any) {
    if (conditionFn(node)) {
      node.parentIds = `${parentId}`;
      result.push({ ...node, children: [] });
    }
    if (node.children && node.children.length > 0) {
      node.children.forEach((child: any) => traverse(child, node.id));
    }
  }

  tree.forEach((node: any) => traverse(node, node.id));
  return result;
}

/**
 * 根据给定的ID在树形结构中找到对应的节点
 *
 * @param tree 树形结构的数据
 * @param id 要查找的节点的ID
 * @returns 如果找到对应的节点，则返回该节点；否则返回null
 */
export function findNodeById(tree: any, id: string): any | null {
  for (const node of tree) {
    if (node.masterId === id) {
      return node;
    }
    if (node.children && node.children.length > 0) {
      const foundNode = findNodeById(node.children, id);
      if (foundNode) {
        return foundNode;
      }
    }
  }
  return null; // 如果没有找到节点，返回null
}

/**
 * 在树形结构中查找目标节点的所有父节点
 *
 * @param tree 树形结构数组，其中每个节点可能包含 children 属性
 * @param targetId 目标节点的 key 值
 * @returns 包含目标节点所有父节点的数组
 */
export function findParentNodes(tree: any[], targetId: number, key: any): any[] {
  let parentPath: any[] = [];

  function traverse(nodes: any[], targetId: number, currentPath: any[]) {
    for (const node of nodes) {
      currentPath.push(node);

      if (node[key] === targetId) {
        parentPath = currentPath.slice(); // 创建当前路径的副本
        return;
      }

      if (node.children) {
        traverse(node.children, targetId, currentPath);
      }

      currentPath.pop(); // 回溯时移除当前节点
    }
  }

  traverse(tree, targetId, []);
  return parentPath;
}

/**
 * 从树形数据中查找目标节点的父节点
 * @param {Array} treeData - 树形数据数组（根节点数组）
 * @param {string|number} targetId - 目标对象的id
 * @param {object|null} parentNode - 递归过程中记录当前节点的父节点（初始为null）
 * @returns {object|null} 父节点对象（目标为根节点或未找到时返回null）
 */
export function findParentNode(treeData: any[], targetId: any, parentNode = null, key: any) {
  for (const node of treeData) {
    // 1. 检查当前节点是否为目标节点 → 返回其父节点
    if (node[key] === targetId) {
      return parentNode;
    }
    // 2. 如果有子节点，递归进入子树，同时记录当前节点为父节点
    if (node.children && node.children.length > 0) {
      const foundParent: any = findParentNode(node.children, targetId, node, key);
      if (foundParent !== null) {
        return foundParent; // 子树中找到目标节点，返回其父节点
      }
    }
  }
  // 遍历完所有节点未找到目标节点
  return null;
}

/**
 * 使用indexof方法实现模糊查询
 * @param  {Array}  list     进行查询的数组
 * @param  {string} keyWord  查询的关键词
 * @returns {Array}           查询的结果
 */
export function fuzzyQuery(list: any, keyWord: string) {
  const arr = [];
  for (let i = 0; i < list.length; i++) {
    if (list[i].includes(keyWord)) {
      arr.push(list[i]);
    }
  }
  return arr;
}

//
/**
 * 模糊查询表格数据函数
 * @param  {Array}  data     进行查询的数组
 * @param  {string} keyWord  查询的关键词
 * @param keyword
 * @returns {Array}           查询的结果
 */
export function fuzzySearchTable(data: any, keyword: string) {
  return data.filter((item: any) => {
    // 遍历对象的每个属性
    for (const key in item) {
      if (typeof item[key] === 'string' && item[key].includes(keyword)) {
        return true;
      }
    }
    return false;
  });
}
/**
 * 根据给定的ID在树形结构中找到对应的节点
 *
 * @param tree 树形结构的数据
 * @param id 要查找的节点的ID
 * @param key
 * @returns 如果找到对应的节点，则返回该节点；否则返回null
 */
export function findNodeByIdFromKey(tree: any, id: string, key: string): any | null {
  for (const node of tree) {
    if (node[key] === id) {
      return node;
    }
    if (node.children && node.children.length > 0) {
      const foundNode = findNodeByIdFromKey(node.children, id, key);
      if (foundNode) {
        return foundNode;
      }
    }
  }
  return null; // 如果没有找到节点，返回null
}

/**
 * 列表转树形结构
 * @param {*} list
 * @returns
 */
export function listToTree(list: any[]) {
  const map = <any>{}; // 创建一个映射表来存储元素
  const tree = <any>[]; // 创建树的根节点数组

  // 填充映射表
  list.forEach(item => {
    map[item.id] = { ...item, children: [] };
  });

  // 构建树
  list.forEach(item => {
    const parent = map[item.parentId];
    if (parent) {
      // 如果找到父元素，将当前元素添加到父元素的children数组中
      parent.children.push(map[item.id]);
    } else {
      // 如果没有父元素，说明是根节点，添加到树中
      tree.push(map[item.id]);
    }
  });

  return tree;
}
// 前端判断树形数据根据条件删除指定字段
export function cleanEmptyChildrenBFS(tree: any) {
  if (!Array.isArray(tree)) return tree;

  const queue = [...tree]; // 初始化队列，存储待处理节点
  while (queue.length > 0) {
    const node = queue.shift(); // 取出队首节点
    if (node.children && Array.isArray(node.children)) {
      // 先处理子节点，加入队列
      queue.push(...node.children);
      // 若子节点为空数组，删除children字段
      if (node.children.length === 0) {
        delete node.children;
      }
    }
  }
  return tree;
}
// 获取当前设备类型
export function detectDevice() {
  // 获取userAgent字符串
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // 使用正则表达式来检查userAgent字符串中是否包含某些关键字
  // 这些关键字通常与移动设备相关
  const mobile = /windows phone|iphone|ipad|ipod|android|blackberry|mini|windows ce|palm/i.test(userAgent.toLowerCase());
  localStorage.setItem('isMobile', '1');
  if (mobile) {
    // 如果userAgent包含上述关键字之一，则认为是在移动设备上
    localStorage.setItem('isMobile', '0');
  } else {
    localStorage.setItem('isMobile', '1');
    // 否则，认为是在PC（桌面设备）上
  }
}

//字符串切割成数组
export const characterToList = function (str: any) {
  let list: any = [];
  if (str != null && str != '' && str != undefined && str.indexOf(';') != -1) {
    let arr = str.split(';');
    arr.forEach((item: any) => {
      let data = {
        id: item,
        name: item,
      };
      list.push(data);
    });
  }
  return list;
};

//ux-grid 组件排序
export const uxTabTop = function (index: any, arrList: any) {
  var arr = [];
  arr = arrList;
  if (index === 0) {
    message.warning('已经是列表中第一条数据！');
  } else {
    let obj;
    for (var i = 0; i < arr.length; i++) {
      if (i === index) {
        obj = arr[i];
        arr.splice(i, 1);
        break;
      }
    }
    arr.unshift(obj);
  }
  return arr;
};

export const uxTabToUp = function (index: any, arrList: any) {
  var arr = [];
  arr = arrList;
  if (index === 0) {
    message.warning('已经是列表中第一条数据！');
  } else {
    let temp = arr[index - 1];
    arr.splice(index - 1, 1, arr[index]);
    arr.splice(index, 1, temp);
  }
  return arr;
};

export const uxTabToDown = function (index: any, arrList: any) {
  var arr = [];
  arr = arrList;
  if (index === arr.length - 1) {
    message.warning('已经是列表中最后一条数据！');
  } else {
    let i = arr[index + 1];
    arr.splice(index + 1, 1, arr[index]);
    arr.splice(index, 1, i);
  }
  return arr;
};

export const uxTabDown = function (index: any, arrList: any) {
  var arr = [];
  arr = arrList;
  if (index === arr.length - 1) {
    message.warning('已经是列表中最后一条数据！');
  } else {
    let obj;
    for (var i = 0; i < arr.length; i++) {
      if (i === index) {
        obj = arr[i];
        arr.splice(i, 1);
        break;
      }
    }
    arr.push(obj);
  }
  return arr;
};

//根据id查询索引
export const getUmyIndex = function (columnData: any, id: any) {
  let arr = '';
  columnData.forEach(function (item: any, index: any) {
    if (item.id != undefined) {
      if (item.id == id) {
        arr = index;
      }
    } else {
      if (item.delIndex == id) {
        arr = index;
      }
    }
  });
  return arr;
};

// 排序方法
export const sortermethod = function (a: any, b: any) {
  const valueA = a || '';
  const valueB = b || '';
  return valueA.localeCompare(valueB);
};

//判断文件是否可以转换成pdf
export const checkfileExtension = function (name: any) {
  let flag = false;
  if (name != null && name != undefined) {
    let newName = name.toLocaleLowerCase();
    if (newName == 'doc' || newName == 'docx' || newName == 'wps' || newName == 'wpt' || newName == 'txt' || newName == 'ppt' || newName == 'pptx' || newName == 'pdf') {
      flag = true;
    }
  }
  return flag;
};
