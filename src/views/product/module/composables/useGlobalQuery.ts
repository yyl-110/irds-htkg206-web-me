import { reactive, ref, type Ref } from 'vue';
import { message } from 'ant-design-vue';
import { AdminApiSystemModule } from '@/api/tags/module/系统模块库';

type QueryGroup = {
  field: string;
  queryType: string;
  keyword: string;
};

const GLOBAL_QUERY_EXCLUDED_FIELDS = new Set(['categoryName', 'creatorName']);

const DEFAULT_GLOBAL_QUERY_COLUMNS = [
  { title: '模型件号', dataIndex: 'para1', key: 'para1', align: 'center', width: 120, resizable: true },
  { title: '模型编码', dataIndex: 'para2', key: 'para2', align: 'center', width: 120, resizable: true },
  { title: '模型名称', dataIndex: 'para3', key: 'para3', align: 'center', width: 120, resizable: true },
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
    customRender: ({ text }: any) => {
      const v = Number(text);
      if (v === 0) return '已发布';
      if (v === 1) return '设计中';
      if (v === 2) return '已停用';
      if (v === 3) return '审核中';
      return text ?? '';
    },
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

  async function fetchGlobalQueryData(pageNo: number, pageSize: number) {
    globalQueryLoading.value = true;
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
      const activeConditions = buildGlobalQueryConditionList();
      data.keyword = activeConditions[0]?.keyword || '';
      data.queryConditionList = activeConditions;

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
    globalQueryModalVisible.value = true;
    await fetchGlobalQueryData(1, globalQueryTablePagination.pageSize);
  }

  function handleGlobalTableChange(pagination: any) {
    const current = pagination?.current ?? globalQueryTablePagination.current;
    const pageSize = pagination?.pageSize ?? globalQueryTablePagination.pageSize;
    fetchGlobalQueryData(current, pageSize);
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
    fetchGlobalQueryData(1, globalQueryTablePagination.pageSize);
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
