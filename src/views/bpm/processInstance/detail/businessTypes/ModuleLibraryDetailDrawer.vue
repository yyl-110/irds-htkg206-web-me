<template>
  <a-drawer
    v-model:visible="drawerVisible"
    class="module-detail-drawer"
    title="模块详情"
    placement="right"
    :closable="false"
    width="800">
    <div class="module-detail-drawer-inner px-[16px]">
      <a-tabs v-model:activeKey="parmType" class="module-detail-udf-tabs" :animated="false" @change="toParm">
        <a-tab-pane key="viz" tab="可视化">
          <div class="udfPage_style module-viz-tab">
            <div class="module-viz-section module-viz-3d">
              <div class="module-viz-section-title module-viz-section-title--3d">3D轻量化展示</div>
              <div v-if="vizPvzUrl" class="module-viz-3d-slot">
                <Ddview ref="ddViewRef" height="300px" />
              </div>
              <div v-else class="module-viz-3d-empty">
                <span class="module-viz-empty-tip">暂无 PVZ 轻量化文件</span>
              </div>
            </div>
            <div class="module-viz-section module-viz-2d">
              <div class="module-viz-section-title module-viz-section-title--2d">2D示意图</div>
              <div class="module-viz-2d-card">
                <img class="module-viz-2d-img" :src="vizSchematicDisplaySrc" alt="2D示意图" />
                <button
                  type="button"
                  class="module-viz-2d-eye"
                  aria-label="放大查看"
                  @click.stop="schematicPreviewVisible = true">
                  <EyeOutlined />
                </button>
              </div>
            </div>
          </div>
        </a-tab-pane>

        <a-tab-pane :key="0" tab="分类参数">
          <div class="udfPage_style">
            <a-descriptions v-for="item in modalInfo" :key="item.str" style="margin-bottom: 20px" size="small" bordered>
              <a-descriptions-item :label="item.name" style="width: 150px">
                {{ item.val ?? '—' }}
              </a-descriptions-item>
            </a-descriptions>
          </div>
        </a-tab-pane>

        <a-tab-pane :key="1" tab="常规属性">
          <div class="udfPage_style">
            <div v-if="pdmDataFlag">
              <a-descriptions style="margin-top: 20px" size="small" bordered>
                <a-descriptions-item label="名称：" style="width: 200px">
                  {{ pdmData.name }}
                </a-descriptions-item>
              </a-descriptions>
            </div>

            <div v-if="pdmDataFlag">
              <a-descriptions style="margin-top: 20px" size="small" bordered>
                <a-descriptions-item label="编码：" style="width: 200px">
                  {{ pdmData.number }}
                </a-descriptions-item>
              </a-descriptions>
            </div>

            <div v-if="pdmDataFlag">
              <a-descriptions style="margin-top: 20px" size="small" bordered>
                <a-descriptions-item label="版本：" style="width: 200px">
                  {{ pdmData.version }}
                </a-descriptions-item>
              </a-descriptions>
            </div>

            <div>
              <a-descriptions
                v-for="item in attributeParmList"
                :key="item.name"
                style="margin-top: 20px"
                size="small"
                bordered>
                <a-descriptions-item :label="item.name" style="width: 200px">
                  {{ item.val }}
                </a-descriptions-item>
              </a-descriptions>
            </div>
          </div>
        </a-tab-pane>

        <a-tab-pane :key="3" tab="知识文档">
          <div class="udfPage_style">
            <div style="width: 100%; height: 30px; text-align: left; margin-top: 10px">模块库知识:</div>

            <div style="width: 100%">
              <a-table
                :scroll="{ x: 400 }"
                row-key="id"
                :loading="loading"
                :locale="locale"
                :pagination="false"
                default-expand-all
                :data-source="fileData1"
                :columns="fileColumns1"
                :row-class-name="(_record, index) => (index % 2 === 0 ? 'odd' : 'even')">
                <template #bodyCell="{ column, record }">
                  <template v-if="column.dataIndex === 'oldFileName'">
                    <a class="action-btn" @click.stop="downloadPDF(record.fileId, record.documentName)">下载</a>
                  </template>
                </template>
              </a-table>
            </div>

            <div style="width: 100%; height: 30px; text-align: left; margin-top: 20px">PDM知识:</div>

            <div style="width: 100%">
              <a-table
                :scroll="{ x: 400 }"
                row-key="id"
                :locale="locale"
                :loading="loading"
                :pagination="false"
                default-expand-all
                :data-source="fileData2"
                :columns="fileColumns2"
                :row-class-name="(_record, index) => (index % 2 === 0 ? 'odd' : 'even')">
                <template #bodyCell="{ column, record }">
                  <template v-if="column.dataIndex === 'docnumber'">
                    <a @click.stop="handleNameClick(record)">{{ record.docnumber }}</a>
                  </template>
                </template>
              </a-table>
            </div>
          </div>
        </a-tab-pane>

        <a-tab-pane :key="5" tab="历史文档">
          <div class="udfPage_style history-doc-table-wrap">
            <a-table
              :scroll="{ x: 1200 }"
              row-key="id"
              :loading="loading"
              :locale="locale"
              :pagination="false"
              default-expand-all
              :data-source="doudata"
              :columns="supGbomcolumns"
              :row-class-name="(_record, index) => (index % 2 === 0 ? 'odd' : 'even')" />
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-drawer>

  <a-modal
    v-model:visible="schematicPreviewVisible"
    title="节点树示意图"
    :footer="null"
    width="920px"
    centered
    destroy-on-close
    wrap-class-name="module-viz-schematic-preview-modal"
    @cancel="schematicPreviewVisible = false">
    <div class="module-viz-schematic-preview-body">
      <img class="module-viz-schematic-preview-img" :src="vizSchematicDisplaySrc" alt="节点树示意图预览" />
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue'

import { EyeOutlined } from '@ant-design/icons-vue'

import { message } from 'ant-design-vue'

import Ddview from '@/components/Ddview/index.vue'

import { AdminApiSystemModule } from '@/api/tags/module/系统模块库'

import { AdminApiSystemUploadFile } from '@/api/tags/文件上传'

import { handleEpcDownload, previewUrlFile } from '@/utils/file'

import { insertModelLibraryStatisticsLog } from '@/libs/webSocketNew'

import { useUserStore } from '@/store/modules/user'

import { renderTableEmptyText } from '@/utils/emptyState'

import vizSchematicPlaceholder from '@/assets/images/viz-schematic-placeholder.png'

const props = defineProps<{
  modulePropertyInfo: any[]
}>()

const userStore = useUserStore()

const drawerVisible = ref(false)

const loading = ref(false)

const parmType = ref<string | number>('viz')

const modalInfo = ref<any[]>([])

const vizDetailRow = ref<any>(null)

const pdmModuleCode = ref<any>()

const PDMid = ref<any>()

const pdmModelType = ref<any>()

const categoryId = ref<any>('')

const menuId = ref<any>(null)

const ddViewRef = ref<any>(null)

const schematicPreviewVisible = ref(false)

const vizPvzUrlFromApi = ref('')

const fileData1 = ref<any[]>([])

const fileData2 = ref<any[]>([])

const pdmDataFlag = ref(false)

const attributeParmList = ref<any[]>([])

const doudata = ref<any[]>([])

const pdmData = ref<any>({})

const supGbomcolumns = ref<any[]>([])

const locale = {
  emptyText: renderTableEmptyText('暂无数据'),
}

const fileColumns1 = [
  {
    title: '文件名称',
    key: 'documentName',
    dataIndex: 'documentName',
    align: 'left',
    resizable: true,
    minWidth: 100,
  },

  {
    title: '文件类型',
    key: 'fileType',
    dataIndex: 'fileType',
    align: 'left',
    resizable: true,
    minWidth: 100,
  },

  {
    title: '操作',
    key: 'oldFileName',
    dataIndex: 'oldFileName',
    align: 'left',
    resizable: true,
    minWidth: 100,
  },
]

const fileColumns2 = [
  {
    title: '文件编号',
    key: 'docnumber',
    dataIndex: 'docnumber',
    align: 'center',
    resizable: true,
    minWidth: 150,
  },

  {
    title: '文件名称',
    key: 'docname',
    dataIndex: 'docname',
    align: 'center',
    minWidth: 150,
    resizable: true,
  },
]

const vizPvzUrl = computed(() => vizPvzUrlFromApi.value)

function resolveCategoryId(row: any) {
  return row?.categoryId ?? props.modulePropertyInfo?.find((item: any) => item.categoryId != null)?.categoryId ?? ''
}

function resolveMenuId(row: any) {
  return row?.menuId ?? props.modulePropertyInfo?.find((item: any) => item.menuId != null)?.menuId ?? null
}

function getFieldValue(rowRecord: any, item: any) {
  if (item.propertyName === '贡献者') {
    return rowRecord?.para7Name ?? rowRecord?.para7
  }

  return rowRecord?.[item.dataProp]
}

function vizPickFileId(row: any, keys: string[]): string {
  if (!row) return ''

  for (const k of keys) {
    const v = row[k]

    if (v != null && String(v).trim() !== '' && String(v) !== '-1000') return String(v).trim()
  }

  return ''
}

function vizFileIdFromModalInfo(info: any[], keywords: string[]): string {
  if (!info?.length) return ''
  const kws = keywords.map(k => k.toLowerCase())
  for (const item of info) {
    const label = String(item?.name ?? '').toLowerCase()
    if (kws.some(kw => label.includes(kw))) {
      const v = item?.val
      if (v != null && String(v).trim() !== '' && String(v) !== '-1000') return String(v).trim()
    }
  }

  return ''
}

async function fetchVizPvzByModuleNum(row: any) {
  vizPvzUrlFromApi.value = ''
  const moduleNum = row?.para1 != null && String(row.para1).trim() !== '' ? String(row.para1).trim() : ''
  if (!moduleNum) return

  try {
    const res = await AdminApiSystemUploadFile.getPvzFileByModuleNum({ moduleNum })
    if (res.data.code == 0) {
      vizPvzUrlFromApi.value = (res.data as any)?.fileUrl ?? ''
    }
  } catch (err) {
    console.log(err)
    vizPvzUrlFromApi.value = ''
  }
}

async function loadVizPvzByFileUrl(fileUrl: string) {
  if (!fileUrl) return
  await nextTick()
  ddViewRef.value?.loadModel?.(fileUrl, {})
}

const vizSchematicFileId = computed(() => {
  const row = vizDetailRow.value

  const fromRow = vizPickFileId(row, [
    'nodeTreeDiagramFileId',
    'treeDiagramFileId',
    'schematicFileId',
    'diagramFileId',
    'nodeTreeImageId',
    'treeImageFileId',
  ])

  if (fromRow) return fromRow

  return vizFileIdFromModalInfo(modalInfo.value, ['节点树', '示意图', '树图', 'schematic', 'diagram'])
})

const vizSchematicImageUrl = computed(() => {
  const row = vizDetailRow.value
  const categoryUrl = vizPickFileId(row, ['categorySchematicUrl'])
  if (categoryUrl) return categoryUrl
  const id = vizSchematicFileId.value
  if (!id) return ''
  return previewUrlFile(id)
})

const vizSchematicDisplaySrc = computed(() => vizSchematicImageUrl.value || vizSchematicPlaceholder)

function moduleDetails(rowRecord: any) {
  drawerVisible.value = true
  parmType.value = 'viz'
  const moduleParaList = Array.isArray(props.modulePropertyInfo) ? props.modulePropertyInfo : []
  modalInfo.value = moduleParaList
    .filter((item: any) => item.dataProp !== 'para11')
    .map((item: any) => ({
      name: item.propertyName,
      str: item.dataProp,
      val: getFieldValue(rowRecord, item),
    }))
}

function toParm(type: string | number) {
  pdmDataFlag.value = false
  parmType.value = type
  attributeParmList.value = []
  doudata.value = []
  supGbomcolumns.value = []
  const params = {
    id: PDMid.value,
    pdmModuleNum: pdmModuleCode.value,
    userName: userStore.getUser.userName,
    userId: userStore.getUser.id,
    pdmModelType: pdmModelType.value,
    moduleNum: pdmModuleCode.value,
    moduleType: pdmModelType.value,
  }
  if (type == 3) {
    loading.value = true
    fileData1.value = []
    fileData2.value = []
    AdminApiSystemModule.findAllModuleAttachment(params)
      .then(res => {
        if (res.data.code == 200) {
          const data: any = res.data.data
          fileData1.value = data?.attachmentList || []
          fileData2.value = data?.pdmsResults || []
        }
      })
      .finally(() => {
        loading.value = false
      })
    return
  }

  if (type == 1) {
    loading.value = true
    AdminApiSystemModule.krAttribute(params)
      .then(res => {
        if (res.data.code == 200) {
          const data: any = res.data.data
          if (data?.pdmsResults) {
            pdmData.value = data.pdmsResults
            pdmDataFlag.value = true
            attributeParmList.value = Object.keys(pdmData.value.parameter || {}).map(item => ({
              name: item,
              val: pdmData.value.parameter[item] == null ? '' : pdmData.value.parameter[item],
            }))
          }
        }
      })
      .finally(() => {
        loading.value = false
      })
    return
  }
  if (type == 5) {
    loading.value = true
    const data: any = {
      categoryId: categoryId.value,
      menuId: menuId.value,
      moduleId: PDMid.value,
    }
    AdminApiSystemModule.findParametricDesign(data)
      .then(res => {
        if (res.data.code == 200) {
          doudata.value = res.data.data?.modulesList || []
          const resData = res.data.data?.moduleParaList || []
          supGbomcolumns.value = resData.map((item: any) => {
            const dataProp =
              item.propertyName == '模型件号'
                ? 'moduleNewNum'
                : item.propertyName == '模型类型'
                  ? 'moduleType'
                  : item.dataProp
            return {
              title: item.propertyName,
              dataIndex: dataProp,
              key: dataProp,
              align: 'center',
              resizable: true,
              minWidth: item.colWidth == undefined ? 70 : item.colWidth,
            }
          })
        } else {
          message.error(res.data.msg)
        }
      })
      .finally(() => {
        loading.value = false
      })
  }
}

async function downloadPDF(id: number, documentName: any) {
  handleEpcDownload({ fileId: id }, documentName)
}

function handleNameClick(row: any) {
  AdminApiSystemModule.getURLApi({ docnumber: row.docnumber }).then(res => {
    if (res.data.code == 0) {
      window.open(res.data.data)
    } else {
      message.error(res.data.msg)
    }
  })
}

function openModuleDetail(row: any, key = 'para2') {
  if (key === 'para2') {
    const displayName =
      row?.para3 != null && String(row.para3).trim() !== '' ? String(row.para3) : String(row?.para1 ?? '')
    const modelNumStr = row?.para1 != null ? String(row.para1) : String(row?.para2 ?? '')
    insertModelLibraryStatisticsLog('数据查询', displayName, modelNumStr)
  }

  fileData1.value = []

  fileData2.value = []

  pdmDataFlag.value = false

  attributeParmList.value = []

  doudata.value = []

  supGbomcolumns.value = []

  parmType.value = 'viz'

  vizDetailRow.value = row

  pdmModuleCode.value = row[key]

  PDMid.value = row.id

  pdmModelType.value = row.para4

  categoryId.value = resolveCategoryId(row)

  menuId.value = resolveMenuId(row)

  moduleDetails(row)

  if (key === 'para2') {
    void fetchVizPvzByModuleNum(row)
  }
}

watch(
  () => [drawerVisible.value, parmType.value, vizPvzUrl.value, modalInfo.value?.length ?? 0] as const,

  ([open, tab, pvzUrl]) => {
    if (!open || tab !== 'viz') return

    loadVizPvzByFileUrl(pvzUrl)
  },

  { flush: 'post' },
)

defineExpose({ openModuleDetail })
</script>

<style lang="scss" scoped>
.module-viz-tab {
  display: flex;

  flex-direction: column;

  gap: 16px;

  padding-bottom: 8px;
}

.module-viz-3d {
  margin-top: 20px;
}

.module-viz-section-title {
  font-size: 13px;

  font-weight: 600;

  color: #313133;

  margin-bottom: 8px;
}

.module-viz-section-title--3d,
.module-viz-section-title--2d {
  font-weight: 400;

  display: inline-flex;

  align-items: center;

  gap: 8px;
}

.module-viz-section-title--3d::before,
.module-viz-section-title--2d::before {
  content: '';

  display: block;

  width: 3px;

  height: 14px;

  flex-shrink: 0;

  background: #188efe;

  border-radius: 2px;
}

.module-viz-3d-slot {
  height: 300px;

  overflow: hidden;

  position: relative;

  border: 1px solid #e8e8e8;

  border-radius: 4px;

  background: #fafafa;

  :deep(.db-container) {
    height: 300px !important;

    max-height: 300px;
  }

  :deep(.ant-spin-nested-loading),
  :deep(.ant-spin-container) {
    height: 100%;
  }
}

.module-viz-3d-empty {
  display: flex;

  align-items: center;

  justify-content: center;

  min-height: 300px;

  border: 1px dashed #d9d9d9;

  border-radius: 4px;

  background: #fafafa;

  color: #8c8c8c;

  font-size: 13px;
}

.module-viz-2d-card {
  position: relative;

  border: 1px solid #e8e8e8;

  border-radius: 4px;

  overflow: hidden;

  background: #f5f5f5;

  min-height: 160px;

  max-height: 260px;
}

.module-viz-2d-img {
  display: block;

  width: 100%;

  height: auto;

  max-height: 260px;

  object-fit: contain;

  background: #fff;
}

.module-viz-2d-eye {
  position: absolute;

  left: 50%;

  top: 50%;

  transform: translate(-50%, -50%);

  width: 44px;

  height: 44px;

  padding: 0;

  border: none;

  border-radius: 50%;

  background: rgba(0, 0, 0, 0.45);

  color: #fff;

  cursor: pointer;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 20px;

  line-height: 1;

  transition: background 0.2s;

  &:hover {
    background: rgba(24, 142, 254, 0.88);
  }
}

.module-viz-schematic-preview-body {
  text-align: center;

  padding: 8px 0;
}

.module-viz-schematic-preview-img {
  max-width: 100%;

  max-height: 80vh;

  object-fit: contain;
}

.action-btn {
  color: #1979e0;

  cursor: pointer;
}
</style>
