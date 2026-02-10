// composition 写法
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { StorageLike } from 'pinia-plugin-persistedstate'

import type { UserState } from './types'
import { decryptValue, encryptValue } from '@/utils'

// 自定义持久化加解密, localStorage
const dataPersist: StorageLike = {
  setItem(key: string, value: string) {
    window.sessionStorage.setItem(key, encryptValue(value))
  },

  getItem(key: string): string | null {
    const value = window.sessionStorage.getItem(key)
    return decryptValue(value)
  },
}

// composition api 写法,  和组件内部实现大致一样
export const useUserStore = defineStore('user', () => {
  // 定义初始化状态
  const initState: UserState = {
    token: 'aethataetaet',
    userNo: 10,
  }

  const userInfo = ref<UserState>({ ...initState })

  // 类似options 的 getters
  const doubleNum = computed(() => userInfo.value.userNo ? userInfo.value.userNo * 2 : 0)

  // 类似options 的 actions
  const setUserInfo = () => userInfo.value.userNo ? userInfo.value.userNo++ : null
  // 清空用户信息
  const clearUserInfo = async (status = false) => {
    // 需要执行登出请求
    if (status) {
      // await
    }

    // 重置store状态
    $reset()
  }

  // composition api 需要实现reset函数
  function $reset() {
    userInfo.value = initState
  }

  return { userInfo, setUserInfo, doubleNum, $reset, clearUserInfo }
}, {
  persist: {
    storage: dataPersist,
  },
})
