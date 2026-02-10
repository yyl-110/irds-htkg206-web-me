import { defineStore } from 'pinia';

export const useLayoutStore = defineStore('layout', {
  state: () => {
    return {
      isRenderTab: true,

      /** 系统管理 、主页切换状态 */
      homepage: true,

      /** 主页状态 */
      homeType: 'home',

      /** 搜索框状态 */
      advancedDrawerVisible: false,

      /** 高级搜索参数 */
      searchVal: '',

      /** 替换关系搜索参数 */
      replaceSearchVal: '',

      /** 点击高级搜索 */
      seniorsearchVal: false,

      /** 系统管理切换状态 system:普通用户   outEpc：外部EPC系统跳  other:仅有发动机匹配手册的权限 */
      systemType: 'system',

      asideWidthStyle: '',
    };
  },
  persist: true,
  actions: {
    setIsRenderTab(data: boolean) {
      this.isRenderTab = data;
    },
    setIsHomepage(data: boolean) {
      this.homepage = data;
    },
    setHomeType(data: string) {
      this.homeType = data;
    },
    setAdvancedDrawerVisible(data: boolean) {
      this.advancedDrawerVisible = data;
    },
    setSearchVal(data: string) {
      this.searchVal = data;
    },
    setseniorsearchVal(data: boolean) {
      this.seniorsearchVal = data;
    },
    setReplaceSearchVal(data: string) {
      this.replaceSearchVal = data;
    },

    setSystemType(data: string) {
      this.systemType = data;
    },
    setAsideWidthStyle(data: string) {
      this.asideWidthStyle = data;
    },
  },
});
