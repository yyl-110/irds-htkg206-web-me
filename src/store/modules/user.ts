// import { store } from '../index'
import { defineStore } from 'pinia';
import type { App } from 'vue';
import { getAccessToken, removeToken } from '@/utils/auth';
import { CACHE_KEY, useCache } from '@/hooks/web/useCache';
import { AdminApiSystemAuth } from '@/api/tags/管理后台认证';
// import { swaggerApi } from '@/httpRequest'
import { Locales, WeiI18n } from '@/utils/WeiI18n';

const { wsCache } = useCache();
interface UserVO {
  id: number;
  avatar: string;
  nickname: string;
  userName: string;
  userCategoryName: string;
  lang: string;
  userType: string;
  type: string;
}
interface UserInfoVO {
  permissions: string[];
  docDir: number[];
  funcIds: number[];
  roles: string[];
  isSetUser: boolean;
  user: UserVO;
}

export const useUserStore = defineStore('admin-user', {
  /** state */
  state: (): UserInfoVO => ({
    permissions: [],
    docDir: [],
    funcIds: [],
    roles: [],
    isSetUser: false,
    user: {
      id: 0,
      avatar: '',
      nickname: '',
      userName: '',
      userCategoryName: '',
      lang: '',
      userType: '',
    },
  }),
  getters: {
    getPermissions(): string[] {
      return this.permissions;
    },
    getRoles(): string[] {
      return this.roles;
    },
    getIsSetUser(): boolean {
      return this.isSetUser;
    },
    getUser(): UserVO {
      return this.user;
    },
    getConfidentialLevel(): Array<{ value: number; label: string }> {
      // 可以从用户信息中获取用户权限级别，或者返回静态的密级配置
      return [
        {
          value: 0,
          label: '公开',
        },
        {
          value: 1,
          label: '内部',
        },
        {
          value: 2,
          label: '秘密',
        },
        {
          value: 3,
          label: '机密',
        },
      ];
    },
    getDocDir(): number[] {
      return this.docDir;
    },
    getFuncIds(): number[] {
      return this.funcIds;
    },
  },
  actions: {
    /**
     * 更新本地存储的用户信息(本地不存在用户信息时)
     * @param forceUpdate 是否强制更新用户信息
     */
    async setUserInfoAction(forceUpdate?: boolean) {
      if (!getAccessToken()) {
        this.resetState();
        return null;
      }
      let userInfo = wsCache.get(CACHE_KEY.USER);
      if (!userInfo || forceUpdate) {
        // const res = await swaggerApi.adminApi.getPermissionInfo()
        const res = await AdminApiSystemAuth.getPermissionInfo();
        userInfo = res.data.data;
        // userInfo = await getInfo()
      }
      this.docDir = userInfo.docDir;
      this.funcIds = userInfo.funcIds;
      this.permissions = userInfo.permissions;
      this.roles = userInfo.roles;
      this.user = userInfo.user;
      this.isSetUser = true;
      if (userInfo.user.lang) {
        localStorage.setItem('wei-language', userInfo.user.lang);
        // 此处重新加载初始化多语言配置，此处需要延迟执行
        if (Object.keys(Locales).length !== 0) {
          const languages = Locales;
          WeiI18n.updateHTMLLang(userInfo.user.lang);
          WeiI18n.fetchLocales(languages[userInfo.user.lang]);
        }
      }

      wsCache.set(CACHE_KEY.USER, userInfo);
    },
    async loginOut() {
      // await loginOut()
      try {
        // await swaggerApi.adminApi.logout()
        await AdminApiSystemAuth.logout();
      } finally {
        removeToken();
        wsCache.clear();
        this.resetState();
      }
    },
    resetState() {
      this.permissions = [];
      this.docDir = [];
      this.funcIds = [];
      this.roles = [];
      this.isSetUser = false;
      this.user = {
        id: 0,
        avatar: '',
        nickname: '',
        userName: '',
        userCategoryName: '',
        lang: '',
      };
    },
  },
});

// export const useUserStoreWithOut = () => {
//   return useUserStore(store)
// }
