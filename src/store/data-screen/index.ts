import { update } from 'lodash-es';
import { defineStore } from 'pinia';

interface IProjectItem {
  projectId: number;
  projectName: string;
  phaseList: IPhaseItem[];
  platFormName: string;
  platformId: number;
  seriesId: number;
  seriesName: string;
}

interface IItem {
  value: number | string;
  label: string;
  platformId?: number;
  platformName?: string;
  seriesId?: number;
  seriesName?: string;
  phaseList?: IPhaseItem[];
}

interface IPhaseItem {
  phaseId: number | string;
  phaseName: string;
}

export const useIndexStore = defineStore('index', {
  state: () => ({
    count: 0,
    projectList: [] as IItem[], // 明确数组元素类型
    phaseList: [] as IItem[],
    platformList: [] as IItem[], // 平台列表
    seriesList: [] as IItem[], // 系列列表
    selectProjectId: '' as string | number, // 选择的项目Id
    selectPhaseId: '' as string | number, // 选择的阶段Id
    selectPlatformId: '' as string | number, // 选择的平台Id
    selectSeriesId: '' as string | number, // 选择的系列Id
  }),
  getters: {
    doubleCount: state => state.count * 2,
  },
  actions: {
    increment() {
      this.count++;
    },
    decrement() {
      this.count--;
    },
    updatePhaseList(list: IPhaseItem[]) {
      if (list && list.length > 0) {
        const _list = list.map(item => ({
          value: item.phaseId,
          label: item.phaseName,
        }));
        _list.unshift({
          value: '-1',
          label: '全部',
        });
        this.phaseList = _list;
      } else {
        this.phaseList = [
          {
            value: '-1',
            label: '全部',
          },
        ];
      }
    },
    updateProjectList(list: IProjectItem[]) {
      console.log('list', list);
      this.projectList = list.map(item => ({
        value: item.projectId,
        label: item.projectName,
        phaseList: item.phaseList,
        platformId: item.platformId,
        platformName: item.platFormName,
        seriesId: item.seriesId,
        seriesName: item.seriesName,
      }));
      
      // 更新平台列表
      this.updatePlatformList(list);
    },
    
    // 更新平台列表
    updatePlatformList(list: IProjectItem[]) {
      const platformMap = new Map();
      list.forEach(item => {
        if (!platformMap.has(item.platformId)) {
          platformMap.set(item.platformId, {
            value: item.platformId,
            label: item.platFormName,
          });
        }
      });
      this.platformList = Array.from(platformMap.values());
    },
    
    // 更新系列列表
    updateSeriesList(list: IProjectItem[], platformId?: string | number) {
      const seriesMap = new Map();
      let filteredList = list;
      
      // 如果有平台ID，则只显示该平台下的系列
      if (platformId) {
        filteredList = list.filter(item => item.platformId === platformId);
      }
      
      filteredList.forEach(item => {
        if (!seriesMap.has(item.seriesId)) {
          seriesMap.set(item.seriesId, {
            value: item.seriesId,
            label: item.seriesName,
          });
        }
      });
      this.seriesList = Array.from(seriesMap.values());
    },
    
    // 更新项目列表（根据平台和系列筛选）
    filterProjectList(platformId?: string | number, seriesId?: string | number) {
      let filteredList = this.projectList;
      
      if (platformId) {
        filteredList = filteredList.filter(item => item.platformId === platformId);
      }
      
      if (seriesId) {
        filteredList = filteredList.filter(item => item.seriesId === seriesId);
      }
      
      return filteredList;
    },
    updateSelectProjectId(id: string | number) {
      this.selectProjectId = id;
    },
    updateSelectPhaseId(id: string | number) {
      this.selectPhaseId = id;
    },
    updateSelectPlatformId(id: string | number) {
      this.selectPlatformId = id;
      // 平台变化时，需要重置系列和项目选择
      this.selectSeriesId = '';
      this.selectProjectId = '';
    },
    updateSelectSeriesId(id: string | number) {
      this.selectSeriesId = id;
      // 系列变化时，需要重置项目选择
      this.selectProjectId = '';
    },
  },
});
