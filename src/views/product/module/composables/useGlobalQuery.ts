import { defineComponent, reactive, ref, type Ref, h } from 'vue';
import { message } from 'ant-design-vue';
import { AdminApiSystemModule } from '@/api/tags/module/系统模块库';
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();
type QueryGroup = {
  field: string;
  queryType: string;
  keyword: string;
};

const GLOBAL_QUERY_EXCLUDED_FIELDS = new Set(['categoryName', 'creatorName']);

/** 全局查询表格「状态」列：需在 #bodyCell 中用 GlobalQueryPara10Cell 渲染，否则仅写 columns.customRender 会被 bodyCell 插槽覆盖而不生效 */
export function getGlobalQueryPara10Status(text: unknown): { label: string; color: string } | null {
  if (text === null || text === undefined || text === '') return null;
  const byLabel: Record<string, { label: string; color: string }> = {
    已发布: { label: '已发布', color: 'rgba(80, 188, 109, 1)' },
    设计中: { label: '设计中', color: 'rgb(83, 112, 199)' },
    停用: { label: '停用', color: '#a2a1a6' },
    审核中: { label: '审核中', color: 'rgb(240, 231, 73)' },
  };
  const trimmed = String(text).trim();
  const mapped = byLabel[trimmed];
  if (mapped) return mapped;
  const v = Number(text);
  if (Number.isNaN(v)) return null;
  switch (v) {
    case 0:
      return { label: '已发布', color: '#52c41a' };
    case 1:
      return { label: '设计中', color: '#1890ff' };
    case 2:
      return { label: '已停用', color: '#ff4d4f' };
    case 3:
      return { label: '审核中', color: '#faad14' };
    default:
      return null;
  }
}

export const GlobalQueryPara10Cell = defineComponent({
  name: 'GlobalQueryPara10Cell',
  props: {
    /** 接口可能返回数字、数字字符串或中文状态文案 */
    text: { type: null as any, default: undefined },
  },
  setup(props) {
    return () => {
      const s = getGlobalQueryPara10Status(props.text as unknown);
      if (s) return h('span', { style: { color: s.color, fontWeight: '500' } }, s.label);
      const raw = props.text as unknown;
      return h('span', {}, raw === null || raw === undefined ? '' : String(raw));
    };
  },
});

const DEFAULT_GLOBAL_QUERY_COLUMNS = [
  { title: '模型件号', dataIndex: 'para1', key: 'para1', align: 'left', width: 120, resizable: true },
  { title: '模型编码', dataIndex: 'para2', key: 'para2', align: 'left', width: 120, resizable: true },
  { title: '模型名称', dataIndex: 'para3', key: 'para3', align: 'left', width: 120, resizable: true },
  { title: '模型类型', dataIndex: 'para4', key: 'para4', align: 'center', width: 120, resizable: true },
  { title: '节点名称', dataIndex: 'categoryName', key: 'categoryName', align: 'center', width: 120, resizable: true },
  { title: '模型坐标系', dataIndex: 'para5', key: 'para5', align: 'center', width: 120, resizable: true },
  { title: '英文名称', dataIndex: 'para6', key: 'para6', align: 'center', width: 120, resizable: true },
  { title: '所属分类', dataIndex: 'para8', key: 'para8', align: 'center', width: 120, resizable: true },
  { title: 'CAD计算重量', dataIndex: 'para9', key: 'para9', align: 'center', width: 120, resizable: true },
  {
    title: '状态',
    dataIndex: 'para10',
    key: 'para10',
    align: 'center',
    width: 120,
    resizable: true,
  },
  { title: '创建用户', dataIndex: 'creatorName', key: 'creatorName', align: 'center', width: 120, resizable: true },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', align: 'center', width: 120, resizable: true },
];

const DEFAULT_GLOBAL_QUERY_TYPE_OPTIONS = [
  { label: '模糊查询', value: 'fuzzy' },
  { label: '精确查询', value: 'exact' },
];

const createGlobalQueryGroup = (field = '', queryType = 'fuzzy', keyword = ''): QueryGroup => ({
  field,
  queryType,
  keyword,
});

const buildGlobalRowKey = (item: any, idx: number) => String(item?.id ?? item?.ROW_ID ?? item?.para2 ?? item?.para1 ?? `global_${idx}`);

export function useGlobalQuery(menuId: Ref<any>) {
  const globalQueryModalVisible = ref(false);
  const globalQueryLoading = ref(false);
  const globalQueryList = ref<any[]>([]);
  /** 用户是否已执行过至少一次查询；未查询前表格分页 change 不触发请求，避免弹窗挂载误拉数据 */
  const globalQueryHasSearched = ref(false);
  const globalQueryTableScrollY = 420;
  const globalQueryTablePagination = reactive({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: false,
    showTotal: (total: number) => `共 ${total} 条`,
    locale: {
      items_per_page: '条/页',
      jump_to: '跳至',
      page: '页',
    },
  });
  const globalQueryColumns = ref<any[]>(DEFAULT_GLOBAL_QUERY_COLUMNS);
  const globalQueryTypeOptions = DEFAULT_GLOBAL_QUERY_TYPE_OPTIONS;
  const globalQueryFieldOptions = ref<any[]>([
    { label: '全部字段', value: '' },
    ...globalQueryColumns.value.filter((c: any) => !GLOBAL_QUERY_EXCLUDED_FIELDS.has(c.dataIndex)).map((c: any) => ({ label: c.title, value: c.dataIndex })),
  ]);
  const maxGlobalQueryGroups = 3;
  const globalQueryGroups = ref<QueryGroup[]>([createGlobalQueryGroup('', 'fuzzy', '')]);

  const buildGlobalQueryConditionList = () =>
    globalQueryGroups.value
      .map((g: QueryGroup) => ({
        field: g.field ?? '',
        queryType: g.queryType ?? 'fuzzy',
        keyword: String(g.keyword ?? '').trim(),
      }))
      .filter((g: QueryGroup) => g.keyword);
  const queryType = ref<any>();
  async function fetchGlobalQueryData(pageNo: number, pageSize: number, query: any) {
    globalQueryLoading.value = true;
    queryType.value = query;
    try {
      if (!menuId.value) {
        globalQueryList.value = [];
        globalQueryTablePagination.total = 0;
        return;
      }
      const data: any = {};
      data.menuId = menuId.value;
      data.pageNo = pageNo;
      data.pageSize = pageSize;
      data.queryType = queryType.value;
      const activeConditions = buildGlobalQueryConditionList();
      data.keyword = activeConditions[0]?.keyword || '';
      data.queryConditionList = activeConditions;
      data.creator = userStore.getUser.id;
      const res = await AdminApiSystemModule.getLibraryDataFixedColumnsPage(data);
      const resData: any = res?.data?.data ?? {};
      const list: any[] = resData.list || resData.moduleList || resData.records || [];
      globalQueryList.value = list.map((item: any, idx: number) => ({
        ...item,
        _rowKey: buildGlobalRowKey(item, idx),
      }));
      globalQueryTablePagination.current = resData.currentPage ?? pageNo;
      globalQueryTablePagination.pageSize = resData.pageSize ?? pageSize;
      globalQueryTablePagination.total = resData.total ?? resData.totalCount ?? resData.totalPage ?? list.length ?? 0;
      globalQueryHasSearched.value = true;
    } catch (e) {
      console.log(e);
      message.error('全局查询失败');
    } finally {
      globalQueryLoading.value = false;
    }
  }

  async function selectAllModuleInfo() {
    if (!menuId.value) {
      message.warning('当前节点缺少菜单信息，无法全局查询');
      return;
    }
    globalQueryGroups.value = [createGlobalQueryGroup('', 'fuzzy', '')];
    globalQueryHasSearched.value = false;
    globalQueryList.value = [];
    globalQueryTablePagination.current = 1;
    globalQueryTablePagination.total = 0;
    globalQueryModalVisible.value = true;
  }

  function handleGlobalTableChange(pagination: any) {
    if (!globalQueryHasSearched.value) return;
    const current = pagination?.current ?? globalQueryTablePagination.current;
    const pageSize = pagination?.pageSize ?? globalQueryTablePagination.pageSize;
    fetchGlobalQueryData(current, pageSize, queryType.value);
  }

  function addGlobalQueryGroup() {
    if (globalQueryGroups.value.length >= maxGlobalQueryGroups) return;
    globalQueryGroups.value.push(createGlobalQueryGroup('', 'fuzzy', ''));
  }

  function removeGlobalQueryGroup(index: number) {
    if (globalQueryGroups.value.length <= 1) return;
    globalQueryGroups.value.splice(index, 1);
  }

  function resetGlobalQueryGroups() {
    globalQueryGroups.value = [createGlobalQueryGroup('', 'fuzzy', '')];
    globalQueryHasSearched.value = false;
    globalQueryList.value = [];
    globalQueryTablePagination.current = 1;
    globalQueryTablePagination.total = 0;
  }

  return {
    globalQueryModalVisible,
    globalQueryLoading,
    globalQueryList,
    globalQueryTableScrollY,
    globalQueryTablePagination,
    globalQueryColumns,
    globalQueryTypeOptions,
    globalQueryFieldOptions,
    globalQueryGroups,
    selectAllModuleInfo,
    fetchGlobalQueryData,
    handleGlobalTableChange,
    addGlobalQueryGroup,
    removeGlobalQueryGroup,
    resetGlobalQueryGroups,
  };
}
