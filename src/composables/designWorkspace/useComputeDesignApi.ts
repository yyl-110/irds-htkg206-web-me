/**
 * 计算类任务设计入口 API（占位）。
 * 接入计算后端后在此聚合方法，页面仅依赖本 composable。
 */
export function useComputeDesignApi() {
  return {
    /** TODO: 对接计算流程专属接口 */
    async placeholder(): Promise<never> {
      throw new Error('计算任务设计接口尚未接入')
    },
  }
}
