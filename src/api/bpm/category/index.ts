import httpRequest from '@/httpRequest'

// BPM 流程分类 VO
export interface CategoryVO {
  id: number // 分类编号
  name: string // 分类名
  code: string // 分类标志
  status: number // 分类状态
  sort: number // 分类排序
}

// BPM 流程分类 API
export const CategoryApi = {
  // 查询流程分类分页
  getCategoryPage(data: any) {
    return httpRequest({
      url: `bpm-service/bpm/category/page`,
      data,
      method: 'POST',
    })
  },

  // 查询流程分类列表
  getCategorySimpleList() {
    return httpRequest({
      url: `bpm-service/bpm/category/simple-list`,
      method: 'GET',
    })
  },

  // 查询流程分类详情
  getCategory(id: number) {
    return httpRequest({
      url: `bpm-service/bpm/category/get?id=${id}`,
      method: 'GET',
    })
  },

  // 新增流程分类
  createCategory(data: CategoryVO) {
    return httpRequest({
      url: `bpm-service/bpm/category/create`,
      data,
      method: 'POST',
    })
  },

  // 修改流程分类
  updateCategory(data: CategoryVO) {
    return httpRequest({
      url: `bpm-service/bpm/category/update`,
      data,
      method: 'PUT',
    })
  },

  // 批量修改流程分类的排序
  updateCategorySortBatch(ids: number[]) {
    return httpRequest({
      url: `bpm-service/bpm/category/update-sort-batch`,
      params: {
        ids: ids.join(','),
      },
      method: 'PUT',
    })
  },

  // 删除流程分类
  deleteCategory(id: number) {
    return httpRequest({
      url: `bpm-service/bpm/category/delete?id=${id}`,
      method: 'DELETE',
    })
  },
}
