import { TestConfig } from './TestConfig'
import type { DictTypeCreateRequestDTO } from '@/api/tags/data-contracts'

/** 用于测试的字典类型数据 */
export const TestDictType: DictTypeCreateRequestDTO = {
  name: `${TestConfig.DATA_PREFIX}字典管理`,
  status: 1,
  type: `${TestConfig.DATA_PREFIX}dict_type`,
  remark: `${TestConfig.DATA_PREFIX}remark`,
}
