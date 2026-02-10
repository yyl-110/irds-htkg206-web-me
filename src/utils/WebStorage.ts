/// <reference path="../../types/web-storage-cache.d.ts" />
import WebStorageCache from 'web-storage-cache'

/**
 * 封装的 localStorage / sessionStorage 数据处理类, 基于 {@link WebStorageCache}
 * @see https://www.npmjs.com/package/web-storage-cache#%E4%BE%8B%E5%AD%90
 */
export class WebStorage extends WebStorageCache {
  /**
   * 获取当前 `storage` 所有已保存的 `keys`
   */
  getAllKeys() {
    const keys: Array<string> = []
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i)
      if (key)
        keys.push(key)
    }
    return keys
  }

  /**
   * 删除除了指定 key 之外的所有数据
   * @param ignoreKeys 需要排除的 keys
   */
  clearExcept(ignoreKeys: Array<string>) {
    const keys = this.getAllKeys()
    for (const k of keys) {
      if (ignoreKeys.includes(k))
        continue
      this.delete(k)
    }
  }
}
