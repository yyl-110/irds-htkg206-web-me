// utils/transferUtils.js
// import { defineStore } from 'pinia'
// import { ref, computed } from 'vue'
import { getSwitchAndRoles } from '@/api/bpm/task'

export interface TransferConfig {
  'initiatorEnabled': boolean
  'adminEnabled': boolean
  'adminRoles': string[]
}



class TransferConfigService {
  private config: TransferConfig | null = null

  // 获取配置
  async getConfig(): Promise<TransferConfig> {
    if (this.config) return this.config

    try {
      debugger
      const response = await getSwitchAndRoles()
      this.config = response
      if (!this.config) {
        console.error('获取转办配置失败:', response)
        return {
          'initiatorEnabled': false, //发起人
          'adminEnabled': false,    //管理员
          'adminRoles': []           //管理员角色列表
        }
      }
      return this.config
    } catch (error) {
      console.error('获取转办配置失败:', error)
      return {
        'initiatorEnabled': false,
        'adminEnabled': false,
        'adminRoles': []
      }
    }
  }

  // 清除缓存
  clearCache(): void {
    this.config = null
  }
}
export default new TransferConfigService()