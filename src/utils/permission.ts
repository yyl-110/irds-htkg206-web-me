import { CACHE_KEY, useCache } from '@/hooks/web/useCache'

// const { t } = useI18n() // 国际化
const t = (text: string) => text

/**
 * 字符权限校验
 * @param {Array} value 校验值
 * @returns {boolean}
 */
export function checkPermi(value: string[]) {
  if (value && Array.isArray(value) && value.length > 0) {
    const { wsCache } = useCache()
    const permissionDatas = value
    const all_permission = '*:*:*'
    const permissions = wsCache.get(CACHE_KEY.USER).permissions
    const hasPermission = permissions.some((permission: any) => {
      return all_permission === permission || permissionDatas.includes(permission)
    })
    return !!hasPermission
  }
  else {
    console.error(t('请设置操作权限标签值'))
    return false
  }
}

/**
 * 角色权限校验
 * @param {string[]} value 校验值
 * @returns {boolean}
 */
export function checkRole(value: string[]) {
  if (value && Array.isArray(value) && value.length > 0) {
    const { wsCache } = useCache()
    const permissionRoles = value
    const super_admin = 'admin'
    const roles = wsCache.get(CACHE_KEY.USER).roles
    const hasRole = roles.some((role: any) => {
      return super_admin === role || permissionRoles.includes(role)
    })
    return !!hasRole
  }
  else {
    console.error(t('请设置角色权限标签值'))
    return false
  }
}
