/** 排序配置 */
export interface OrderByBean {
  sortType: 'asc' | 'desc'
  attributeName: string
}

/** 基础分页参数 */
export interface BaseQueryParams<T = Record<string, any>> {
  pageIndex: number
  pageRows: number
  orderByBean?: OrderByBean // 可选，更灵活
  params: T // 泛型：由调用方决定 params 结构
}

/** RR 需求列表的查询参数 */
export interface RRParams {
  num?: string
  status?: string
  createType?: string
  title?: string
  processNode?: string
  sourceType?: string
  reqType?: string
  reqCategory?: string
  reqLevel?: string
  salesModelCode?: string | Array<string | number>
  expectedDeliveryDate?: [string, string] // 时间范围：开始 + 结束
  submitTime?: [string, string]
  portfolioScopeIds?: string | Array<string | number>
}

/** 完整 RR 查询参数 */
export type RRQueryParams = BaseQueryParams<RRParams>

/** 场景化 需求列表的查询参数 */
export interface ScenarioParams {
  teamId?: string
  num?: string
  title?: string
  productLineId: string
}

/** 完整 RR 查询参数 */
export type ScenarioQueryParams = BaseQueryParams<ScenarioParams>
