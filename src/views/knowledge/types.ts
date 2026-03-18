export interface INodeByLevel {
  nodeName: string
  tagging: number
  addTime: string // 或更精确地使用 [Date]
  filePath: string | null
  treeType: number
  parentId: string
  url: string | null
  categoryParentId: number
  nodeLevel: string // 可考虑改为 number，若层级是数字
  deleteStatus: number
  treeKey: number
  tagType: string
  style: string
  id: number
  categoryId: number
  fileId: string | null
}