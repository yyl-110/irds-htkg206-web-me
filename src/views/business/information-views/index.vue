<script setup lang="ts">
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import { InformationTreeResponseDTOModel } from '@/api/models/information/InformationTreeResponseDTOModel'
import { InformationTreeResponsePOModel } from '@/api/models/information/InformationTreeResponsePOModel'
import { InformationTreePOModel } from '@/api/models/information/InformationTreePOModel'
import Tree from '@/components/tree/tree.vue'
import { AdminApiInformation } from '@/api/tags/information/管理后台资料管理'
import informationList from '@/views/business/information-views/data/index.vue'

const router = useRoute()

const $router = useRouter()
// 获取树结构信息
const requestParams = reactive(new InformationTreeResponseDTOModel())

const helpLang = ref<string>('zh_CN')
const treeData = ref<any>([])
const helpTreePage = ref()
const informationListPage = ref()
const selectTreeId: any = ref()

const saveDisabled = ref<any>(true)
const editDisabled = ref<any>(true)
/** 富文本对象 */
const selectedKeys: any = ref()
const expandedKeys: any = ref()

const rootKey = ref<string>('')

/** 下载按钮状态 */
const isDownloadFlag = ref<boolean>(false)

async function getInformationTree() {
  requestParams.lang = `${localStorage.getItem('wei-language')}` // 获取国际化语音
  if (requestParams.lang == null || requestParams.lang === 'null') {
    requestParams.lang = 'zh_CN'
  }
  helpLang.value = requestParams.lang
  requestParams.parentId = `${router.query.key}`
  rootKey.value = `${router.query.key}`
  const res = await AdminApiInformation.getInformationTreeByPid(requestParams)
  treeData.value = res.data.data?.data
  isDownloadFlag.value = res.data.data?.isDownloadFlag
  if (treeData.value.length>0) {
    selectedKeys.value = treeData.value[0].key
    expandedKeys.value = treeData.value[0].key
    selectNode(selectedKeys.value)
  }
}

watch(
  () => router.query.key,
  (newPath, oldPath) => {
    if ($router.currentRoute.value.path ==='/business/information-views/index')
      getInformationTree()
  },
  { immediate: true },
)

/**
 * 切换国际化重新加载结构树
 * @param data 选中节点id
 * @param lang
 */
async function reloadTree(lang: string) {
  const requestParams = reactive(new InformationTreeResponseDTOModel())
  requestParams.lang = `${localStorage.getItem('wei-language')}` // 切换国际化语言
  if (requestParams.lang == null || requestParams.lang == 'null') {
    requestParams.lang = 'zh_CN'
  }
  requestParams.parentId = `${router.query.key}`
  rootKey.value = `${router.query.key}`
  helpLang.value = lang
  const res = await AdminApiInformation.getInformationTreeByPid(requestParams)
  treeData.value = res.data.data?.data
  isDownloadFlag.value = res.data.data?.isDownloadFlag
}

const treeNodeColmoun = ref<any>([])

/**
 * 选中节点,调用后端接口赋值
 * @param node
 */
async function selectNode(node: any) {
  selectTreeId.value = node
  const requestParams = reactive(new InformationTreeResponsePOModel())
  requestParams.id = node
  const res = await AdminApiInformation.getDetailData(requestParams)
  helpTreePage.value.changeBtnStyle(res.data.data.innerFlag)// 调用子页面方法进行编辑、删除图标样式
  readonlyBtn()
  informationListPage.value.reloadTableData(node)// 调用右侧子页面切换表格数据
}

/**
 * 选中节点,调用后端接口赋值
 * @param key
 */
async function getNodeDetailData(key: any) {
  // 调用后端接口获取节点信息
  const requestParams = reactive(new InformationTreeResponsePOModel())
  requestParams.id = key
  const res = await AdminApiInformation.getDetailData(requestParams)
  // nextTick(() => {
  treeNodeColmoun.value = [
    {
      title: WeiI18n.t('父节点名称').value,
      key: 'parentName',
      value: res.data.data.parentName==null?'':res.data.data.parentName,
      type: 'input',
      disabled: true,
      hidden: false,
    },
    {
      title: WeiI18n.t('父节点ID').value,
      key: 'parentId',
      value: res.data.data.parentId,
      type: 'input',
      disabled: true,
      hidden: true,
    },
    {
      title: 'ID',
      key: 'id',
      value: res.data.data.id,
      type: 'input',
      disabled: true,
      hidden: true,
    },
    {
      title: WeiI18n.t('分类名称').value,
      key: 'nodeName',
      value: res.data.data.nodeName,
      type: 'input',
      hidden: false,
    },
  ]
  helpTreePage.value.reloadTableStyle(treeNodeColmoun.value)
  // })
}

/**
 * 选中节点,调用后端接口赋值
 * @param key
 */
async function getNodeAddData(key: any) {
  if (key === undefined) {
    key = selectedKeys.value
  }
  if (key == null || key === '') { // 没有根节点添加更节点
    treeNodeColmoun.value = [
      {
        title: WeiI18n.t('父节点名称').value,
        key: 'parentName',
        value: '',
        type: 'input',
        disabled: true,
        hidden: false,
      },
      {
        title: WeiI18n.t('父节点ID').value,
        key: 'parentId',
        value: 0,
        type: 'input',
        disabled: true,
        hidden: true,
      },
      {
        title: 'ID',
        key: 'id',
        value: '',
        type: 'input',
        disabled: true,
        hidden: true,
      },
      {
        title: WeiI18n.t('分类名称').value,
        key: 'nodeName',
        value: '',
        type: 'input',
        hidden: false,
      },
    ]
  }
  else {
    // 调用后端接口获取节点信息
    const requestParams = reactive(new InformationTreeResponsePOModel())
    requestParams.id = key
    const res = await AdminApiInformation.getDetailData(requestParams)
    treeNodeColmoun.value = [
      {
        title: WeiI18n.t('父节点名称').value,
        key: 'parentName',
        value: res.data.data.nodeName,
        type: 'input',
        disabled: true,
        hidden: false,
      },
      {
        title: WeiI18n.t('父节点ID').value,
        key: 'parentId',
        value: res.data.data!.id,
        type: 'input',
        disabled: true,
        hidden: true,
      },
      {
        title: 'ID',
        key: 'id',
        value: '',
        type: 'input',
        disabled: true,
        hidden: true,
      },
      {
        title: WeiI18n.t('分类名称').value,
        key: 'nodeName',
        value: '',
        type: 'input',
        hidden: false,
      },
    ]
  }
  helpTreePage.value.reloadTableStyle(treeNodeColmoun.value)
}

/**
 * 帮助节点添加
 * @param nodeList
 * @param selectedKeys
 */
async function submit(nodeList: Array<any>, selectedKeys: any) {
  const requestParams = reactive(new InformationTreePOModel())
  for (const property of nodeList) {
    if (property.key === 'id') {
      requestParams.id = property.value
    }
    if (property.key === 'parentId') {
      if (property.value=='') {
        requestParams.parentId = '0'
      }
      else {
        requestParams.parentId = property.value
      }
    }
    if (property.key === 'nodeName') {
      requestParams.nodeName = property.value
    }
  }
  requestParams.innerFlag = false
  if (requestParams.id != null && requestParams.id !='0' && requestParams.id !='') {
    await AdminApiInformation.informationTreeUpdate(requestParams)
    reloadTree(helpLang.value)
  }
  else {
    // 保存分类数据
    await AdminApiInformation.informationTreeSave(requestParams)
    reloadTree(helpLang.value)
  }
}

/**
 * 节点删除
 * @param data 添加的属性
 * @param selectedKeys
 */
async function deleteTreeNode(selectedKeys: any) {
  const requestParams = reactive(new InformationTreeResponseDTOModel())
  requestParams.id = selectedKeys
  await AdminApiInformation.informationTreeDelete(requestParams)
  reloadTree(helpLang.value)
}

/**
 * 树节点上移或下移排序
 * @param id
 * @param brotherId
 */
async function upOrDownNode(id: any, brotherId: any) {
  const requestSortParams = reactive(new InformationTreeResponseDTOModel())
  requestSortParams.id = id
  requestSortParams.exchangeId = brotherId
  await AdminApiInformation.informationTreeSort(requestSortParams)
  reloadTree(helpLang.value)
}

/**
 * 树节点上移或下移排序
 * @param id
 * @param type
 */
async function currentNodeList(id: any, type: any) {
  const requestParams = reactive(new InformationTreeResponseDTOModel())
  requestParams.id = id
  const res = await AdminApiInformation.currentNodeList(requestParams)
  let index = 0
  const brotherNode = ref<any>([])
  res.data.data?.forEach((item: any, indexs: any) => {
    brotherNode.value.push(item.id)
    if (item.id === id) {
      index = indexs
    }
  })
  helpTreePage.value.sort(type, brotherNode.value, index)
}

/**
 * 点击编辑修改数据和
 */
function changeHelpBtn() {
  saveDisabled.value = false
  editDisabled.value = true
}

/**
 * 只读状态
 */
function readonlyBtn() {
  saveDisabled.value = true
  editDisabled.value = false
}

/**
 * 点击保存数据
 */
async function saveArticleContent() {
  const requestParams = reactive(new InformationTreeResponsePOModel())
  requestParams.id = selectTreeId.value
  const res = await AdminApiInformation.getDetailData(requestParams)
  const requestParamsPO = reactive(new InformationTreePOModel())
  if (res.data.data != null) {
    requestParamsPO.id = selectTreeId.value
    requestParamsPO.parentId = res.data.data.parentId
    requestParamsPO.nodeName = res.data.data.nodeName
    const res1 = await AdminApiInformation.informationTreeUpdate(requestParamsPO)
    if (res1.data.code === 200) {
      message.success(WeiI18n.t('保存成功').value)
    }
    else {
      message.success(WeiI18n.t('保存失败').value)
    }
    saveDisabled.value = true
    editDisabled.value = false
  }
}
// 查看界面默认不显示左侧的树结构
const showLeft = ref(true)
</script>

<template>
  <div class="user-page" style="display: flex;justify-content: space-between;">
    <a-card v-show="showLeft" class="wei-content-full left-tree">
      <Tree
        ref="helpTreePage"
        :operate-flag="false"
        :node-colmoun="treeNodeColmoun"
        :tree-data="treeData"
        :if-add-root="false"
        sign="informationTreeView"
        :selected-keys="selectedKeys"
        :expanded-keys="expandedKeys"
        @select-node="selectNode"
        @get-node-detail-data="getNodeDetailData"
        @get-node-add-data="getNodeAddData"
        @delete-tree-node="deleteTreeNode"
        @up-or-down-node="upOrDownNode"
        @current-node-list="currentNodeList"
        @submit="submit"
        @reload-tree="reloadTree"
      />
    </a-card>
    <div class="right-list-common" :class="{ 'right-list-show-left': showLeft, 'right-list-noshow-left': !showLeft }">
      <informationList ref="informationListPage" :root-key="rootKey" :is-download-flag="isDownloadFlag" />
    </div>
  </div>
</template>

<style lang="less" scoped>
  .user-page {
    .left-tree {
      width: 240px;
      height: calc(100vh - 80px);
    }
    .right-list-common {
      height:calc(100vh - 80px);
      margin-left: 20px;
      margin-right: 20px;
      overflow-y: scroll;
    }
    .right-list-show-left {
      width: calc(100% - 260px);
    }
    .right-list-noshow-left {
      width: calc(100%);
    }
  }
</style>
