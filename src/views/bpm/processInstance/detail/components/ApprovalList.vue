<template>
  <div class="tableinfo" v-if="ifApprovalData">
    <el-card>
      <template #header>
        <div class="tableinfo__header">
          <span>{{ $t('签审列表') }}</span>
        </div>
      </template>
      <div class="tableinfo__search" v-if="ifSearch">
        <el-input v-model="searchForm.content" clearable :placeholder="$t('请输入')" style="width: 245px"></el-input>
        <el-button type="primary" plain @click="handleSearch">
          {{ $t('查询') }}
        </el-button>
      </div>
      <BaseDataList
        :columns="columns"
        :apiLists="{ query: matchTableType()?.request }"
        :defaultParams="defaultParams"
        :searchForm="searchForm"
        :serveParamsTransForm="handlearamsTransForm"
        :deleFlag="false"
        :ifPagination="false"
        :ifBorderTop="false"
        ref="baseTableRef"
        :style="{ paddingTop: ifSearch ? '16px' : '0' }"
        @refreshTableData="getTableData">
        <template #order="{ row, $index }">
          <div>{{ $index + 1 }}</div>
        </template>
        <template #areaConfigNo="{ row }">
          <el-link type="primary" :underline="false" @click="toDetailPage(row)">
            {{ row.areaConfigNo }}
          </el-link>
        </template>
      </BaseDataList>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
// import { getApprovalListByOrderNo, getProductConfigNoList } from '@/api/orderBom'
import BaseDataList from './BaseDataList.vue'
import { BpmBusinessProcessTypeEnum } from '@/components/config/consts'

type ITableType = BpmBusinessProcessTypeEnum

const { t } = useI18n() // 国际化
const route = useRoute()
const router = useRouter()
const props = withDefaults(defineProps<{ tableType: ITableType; id?: string }>(), {
  tableType: BpmBusinessProcessTypeEnum.ORDER_CONFIG_PROCESS,
  // 产品型号审签流程获取签审列表所需id
  id: '',
})
// 可触发的事件
const emit = defineEmits(['getApprovalList'])

const baseTableRef = ref(null)
const currentRow = ref({}) // 存储当前点击的表格行数据
const searchForm = ref({ content: '' })
const propductInstanceId = ref('')
const approvalDataList = ref([]) // 当前签审列表数据
/* 列表相关配置 */
const columns = ref([])
// 营销点单处理流程表头
const columnsOrderApproval = ref([
  { prop: 'order', label: '序号', slotName: 'order', width: 60 },
  { prop: 'areaConfigNo', label: t('编号'), slotName: 'areaConfigNo', width: 200 },
  { prop: 'areaConfigName', label: t('名称') },
  { prop: 'saleModel', label: t('销售型号') },
  { prop: 'productModel', label: t('产品型号') },
  { prop: 'saleArea', label: t('区域') },
  { prop: 'countryName', label: t('国家') },
  { prop: 'colorSolution', label: t('区域颜色') },
  { prop: 'basePartNo', label: t('标配BOM编码'), width: 200 },
  { prop: 'version', label: t('版本') },
  { prop: 'createdBy', label: t('创建人') },
  { prop: 'lastUpdatedBy', label: t('修改人') },
  { prop: 'lastUpdatedDate', label: t('更新时间') },
])
// 产品型号审签流程表头
const columnsProductModel = ref([
  { prop: 'order', label: '序号', slotName: 'order', width: 60 },
  { prop: 'number', label: t('配置版本'), slotName: 'number', width: 200 },
  { prop: 'configVersion', label: t('产品配置') },
  { prop: 'basePartNo', label: t('生产物料号') },
  { prop: 'configDesc', label: t('配置描述') },
  { prop: 'version', label: t('版本') },
  { prop: 'createdBy', label: t('创建人') },
  { prop: 'lastUpdatedBy', label: t('修改人') },
  { prop: 'lastUpdatedDate', label: t('更新时间') },
])
const ifApprovalData = ref(true)
const ifSearch = computed(() => props.tableType == BpmBusinessProcessTypeEnum.ORDER_CONFIG_PROCESS)
const defaultParams = computed(() => ({ orderNo: route.query.orderNo || '', id: route.query.businessKey || '' }))
const handlearamsTransForm = (message, type) => message

// 根据编号跳转详情，区分不同类型
const toDetailPage = row => {
  currentRow.value = row
  router.push({
    path: matchTableType().path,
    query: matchTableType().query,
  })
}
// 根据传入类型区分表格列和对应获取数据接口
const matchTableType = (type?: ITableType) => {
  const tableType = type || props.tableType
  switch (tableType) {
    // 点单审签
    case BpmBusinessProcessTypeEnum.ORDER_CONFIG_PROCESS:
      return {
        columns: columnsOrderApproval.value,
        path: '/salesconfig/createsalesmodel',
        query: {
          productModelId: currentRow.value['productModelId'],
          modalType: 'detail',
          saleModelId: currentRow.value['saleModelId'],
          title: currentRow.value['productModel'],
          treeId: '',
        },
        // request: getApprovalListByOrderNo,
      }
    // 产品型号审签
    case BpmBusinessProcessTypeEnum.PRODUCT_MODEL_FINALIZATION_RELEASE:
      return {
        columns: columnsProductModel.value,
        path: '/config/createconfignumber',
        query: {
          productModelId: propductInstanceId.value,
          modalType: '3',
          configNoId: currentRow.value['id'],
          number: currentRow.value['number'],
        },
        // request: getProductConfigNoList,
      }
    default:
      return {
        columns: columnsOrderApproval.value,
        request: null,
      }
  }
}
// 查询
const handleSearch = () => {
  if (baseTableRef.value) {
    ;(baseTableRef.value as any).getTableList({
      content: searchForm.value.content,
      ...defaultParams.value,
      id: propductInstanceId.value,
    })
  }
}
// 及时传递审签列表表格数据
const getTableData = (list: any) => {
  ifApprovalData.value = list.length > 0
  emit('getApprovalList', list)
}
watch(
  () => props.tableType,
  (newVal: ITableType) => {
    columns.value = matchTableType(newVal)?.columns as any
  },
  {
    immediate: true,
  },
)
watch(
  () => props.id,
  newVal => {
    if (newVal) {
      propductInstanceId.value = newVal
      nextTick(() => {
        if (baseTableRef.value) {
          ;(baseTableRef.value as any).getTableList({
            content: searchForm.value.content,
            id: newVal,
          })
        }
      })
    }
  },
  {
    immediate: true,
  },
)
</script>
<style lang="scss" scoped>
.tableinfo {
  padding: 10px 30px 10px 10px;
  &__header {
    font-weight: 700;
  }
  &__search {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: end;
    gap: 8px;
  }
}
</style>
