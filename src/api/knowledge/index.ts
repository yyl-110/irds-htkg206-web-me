import httpRequest from "@/httpRequest";

interface SecondTagNodeQuery {
  tagType: number
  nodeLevel: string
  fileType: number
}

/**
 * 知识中心二级筛选tag
 * @param params
 */

export function querySecondTagNode(data: SecondTagNodeQuery) {
  return httpRequest({
    url: '/knowledge-server/knowledgeTag/querySecondTagNode',
    data,
    method: 'POST',
  })
}
