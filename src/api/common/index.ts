import httpRequest from '@/httpRequest'

interface DownloadQuery {
  queryId: string
}

/**
 *下载附件
 * @param params
 */
export function downloadFile(params: DownloadQuery) {
  return httpRequest({ url: '/xnysycsrm-external/fileStorgea/downloadFile', params, method: 'GET' })
}
/**
 *预览文件
 * @param params queryId
 */
export function previewFile(params: any) {
  return httpRequest({ url: '/xnysycsrm-external/fileStorgea/showByQueryId', params, method: 'GET' })
}

/**
 *预览文件
 * @param params queryId
 */
export function newPreviewFile(params: any) {
  return httpRequest({ url: '/common-api/common/file-storage/showByFileId', params, method: 'GET' })
}

/**
 * 初始化pvz文件视图配置信息
 * @param params queryId
 */
export function getPvzView(params: any) {
  return httpRequest({ url: '../thingview/CreoViewPreferences.json', params, method: 'GET' })
}
