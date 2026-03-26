
import httpRequest from "@/httpRequest";

const proxyApi = '/Know'

/**
 * 协同设计产品列表
 * @param params
 */

export function findProduct(data: any) {
  return httpRequest({
    url: `${proxyApi}/bl-server/productDesignProject/findProduct`,
    data,
    method: 'POST',
  })
}
/**
 * 协同设计删除
 * @param params
 */

export function deleteData(data: any) {
  return httpRequest({
    url: `${proxyApi}/bl-server/productDesignProject/delete`,
    data,
    method: 'DELETE',
  })
}