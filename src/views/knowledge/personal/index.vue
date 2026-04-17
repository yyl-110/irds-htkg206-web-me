<template>
  <div class="layout h-full">
    <div class="elMain">
      <div class="content h-full flex flex-col" id="tabContent">
        <a-tabs v-model:active-key="activeName" class="elTabs" @change="handleClick" size="small">
          <a-tab-pane tab="文档" key="doc" v-if="hideFile"></a-tab-pane>
          <a-tab-pane tab="问答" key="ask" v-if="hideQuest"></a-tab-pane>
          <a-tab-pane tab="视频" key="video" v-if="hideFile"></a-tab-pane>
          <a-tab-pane tab="图片" key="pic" v-if="hideFile"></a-tab-pane>
          <template #rightExtra>
            <div class="flex items-center">
              <a-input-search v-model:value="searchKey" placeholder="输入关键字进行搜索" @search="publicFun"
                class="max-w-[400px]">
                <template #enterButton>
                  <div class="flex items-center">
                    <SearchOutlined />
                    <span class="ml-[4px]">搜索</span>
                  </div>
                </template>
              </a-input-search>
            </div>
          </template>
        </a-tabs>
        <main class="flex-1 h-0">
          <div class="list h-full overflow-y-auto pt-[16px]">
            <a-empty v-if="documentList.length === 0 && !spinning" :image="simpleImage" />
            <a-row class="w-full items-start h-full" v-if="activeName === 'doc'" :gutter="[16, 16]">
              <a-col :span="12" class="item" v-for="item in documentList" :key="item.id">
                <text-card :text-data="{ content: item }" @handleFetchList="publicFun" />
              </a-col>
            </a-row>

            <div class="w-full h-full" v-if="activeName === 'ask'">
              <div class="item" v-for="item in documentList" :key="item.id">
                <ask-card :ask-data="{ content: item }" @handleFetchList="publicFun" />
              </div>
            </div>
            <div class="flex flex-wrap w-full h-full gap-[10px]" v-if="activeName === 'video'">
              <div class="item" v-for="item in documentList" :key="item.id">
                <video-card :video-data="{ content: item }" @handleFetchList="publicFun" />
              </div>
            </div>
            <div class="flex flex-wrap w-full h-full gap-[10px]" v-if="activeName === 'pic'">
              <div class="item" v-for="item in documentList" :key="item.id">
                <img-card :img-data="{ content: item }" @handleFetchList="publicFun" />
              </div>
            </div>
          </div>
        </main>
        <footer class="pagination-footer flex justify-end">
          <a-pagination v-model:current="page.currentPage" :total="page.pageCount" :default-page-size="page.pageSize"
            show-less-items show-size-changer :show-total="(total) => `共${total}条`" @change="handleCurrentChange" />
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { collectFileList, interestList, shareFileList, shareQuestionList } from '@/api/knowledge'
import askCard from '../components/askCard.vue'
import imgCard from '../components/imgCard.vue'
import textCard from '../components/textCard.vue'
import videoCard from '../components/videoCard.vue'
import { useUserStore } from '@/store/modules/user'
import { Empty, message } from 'ant-design-vue'
import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'

type TabKey = 'doc' | 'ask' | 'video' | 'pic'

/** 用于取消请求的 AbortController */
let abortController: AbortController | null = null

/** 取消上一个请求并创建新的 AbortController */
const cancelPreviousRequest = () => {
  if (abortController) {
    abortController.abort()
  }
  abortController = new AbortController()
  return abortController.signal
}

interface PageState {
  pageSize: number
  pageCount: number
  currentPage: number
}

/** Tab 名称 → attachmentType 映射（1文档 2视频 3图片 4问答） */
const TAB_FLAG_MAP: Record<TabKey, number> = { doc: 1, video: 2, pic: 3, ask: 4 }

const simpleImage = computed(() => Empty.PRESENTED_IMAGE_SIMPLE)

const activeName = ref<TabKey>('doc')
const searchKey = ref<string>('')
const documentList = ref<any[]>([])
const spinning = ref<boolean>(false)

const hideFile = ref<boolean>(true)
const hideQuest = ref<boolean>(false)

/** 当前侧边栏选中项 */
const sideData = ref<any>({})

/** 当前 tab 对应的附件类型 */
const tabFlag = ref<number>(1)

const props = defineProps({
  personalInfo: {
    type: Object as () => any,
    default: () => ({}),
  },
})

const page = ref<PageState>({
  pageSize: 10,
  pageCount: 100,
  currentPage: 1,
})

/** 收藏列表 */
const myCollect = async () => {
  const signal = cancelPreviousRequest()
  spinning.value = true
  const params = {
    titleOrUserName: searchKey.value || '',
    userId: useUserStore().getUser.id,
    attachmentType: tabFlag.value,
    currentPage: page.value.currentPage,
    pageSize: page.value.pageSize,
  }
  try {
    const res = await collectFileList(params, { signal })
    if (res?.data.code === '0') {
      documentList.value = res.data.data.result || []
      page.value.pageCount = res.data.data.rowCount
    } else {
      message.error(res.data.msg)
    }
  } catch (error: any) {
    // 请求被取消时不报错
    if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
      console.error('myCollect error:', error)
    }
  } finally {
    spinning.value = false
  }
}

/** 关注列表 */
const myInterestList = async () => {
  const signal = cancelPreviousRequest()
  spinning.value = true
  const params = {
    titleOrUserName: searchKey.value || '',
    userId: useUserStore().getUser.id,
    currentPage: page.value.currentPage,
    pageSize: page.value.pageSize,
  }
  try {
    const res = await interestList(params, { signal })
    if (res?.data.code === '0') {
      const result: any[] = res.data.data.result || []
      result.forEach((v) => {
        v.hidden = false
        v.replay = false
      })
      documentList.value = result
      page.value.pageCount = res.data.data.rowCount
    } else {
      message.error(res.data.msg)
    }
  } catch (error: any) {
    // 请求被取消时不报错
    if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
      console.error('myInterestList error:', error)
    }
  } finally {
    spinning.value = false
  }
}

/** 分享的问答列表 */
const myShareQuestionList = async () => {
  const signal = cancelPreviousRequest()
  spinning.value = true
  const params = {
    titleOrUserName: searchKey.value || '',
    userId: useUserStore().getUser.id,
    currentPage: page.value.currentPage,
    pageSize: page.value.pageSize,
  }
  try {
    const res = await shareQuestionList(params, { signal })
    if (res?.data.code === '0') {
      documentList.value = res.data.data.result || []
      page.value.pageCount = res.data.data.rowCount
    } else {
      message.error(res.data.msg)
    }
  } catch (error: any) {
    // 请求被取消时不报错
    if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
      console.error('myShareQuestionList error:', error)
    }
  } finally {
    spinning.value = false
  }
}

/** 分享的文件列表 */
const myShareFileList = async () => {
  const signal = cancelPreviousRequest()
  spinning.value = true
  const params = {
    titleOrUserName: searchKey.value || '',
    attachmentType: tabFlag.value,
    userId: useUserStore().getUser.id,
    currentPage: page.value.currentPage,
    pageSize: page.value.pageSize,
  }
  try {
    const res = await shareFileList(params, { signal })
    if (res?.data.code === '0') {
      documentList.value = res.data.data.result || []
      page.value.pageCount = res.data.data.rowCount
    } else {
      message.error(res.data.msg)
    }
  } catch (error: any) {
    // 请求被取消时不报错
    if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
      console.error('myShareFileList error:', error)
    }
  } finally {
    spinning.value = false
  }
}

/** 根据 sideData.key 分发到对应的接口请求 */
const publicFun = () => {
  documentList.value = []
  const key = sideData.value?.key

  if (key === 'my-contribution') {
    myCollect()
  } else if (key === 'my-follow') {
    myInterestList()
  } else if (key === 'my-knowledgeShare') {
    tabFlag.value === 4 ? myShareQuestionList() : myShareFileList()
  } else {
    // 初始默认状态（sideData 为空时），加载收藏列表
    myCollect()
  }
}

/** 侧边栏菜单切换 */
const sideFun = (item: any) => {
  page.value.currentPage = 1
  page.value.pageSize = 10
  sideData.value = item
  documentList.value = []

  if (item.key === 'my-contribution') {
    activeName.value = 'doc'
    hideFile.value = true
    hideQuest.value = false
    tabFlag.value = 1
    myCollect()
  } else if (item.key === 'my-follow') {
    activeName.value = 'ask'
    hideFile.value = false
    hideQuest.value = true
    myInterestList()
  } else if (item.key === 'my-knowledgeShare') {
    activeName.value = 'doc'
    hideFile.value = true
    hideQuest.value = true
    tabFlag.value = 1
    myShareFileList()
  }
}

const handleCurrentChange = (val: number, size: number) => {
  page.value.currentPage = val
  page.value.pageSize = size
  publicFun()
}

/** Tab 切换：通过常量 Map 更新 tabFlag，避免冗余的 if/else 链 */
const handleClick = (val: string) => {
  page.value.currentPage = 1
  page.value.pageSize = 10
  tabFlag.value = TAB_FLAG_MAP[val as TabKey] ?? 1
  publicFun()
}

onMounted(() => {
  publicFun()
})

onBeforeUnmount(() => {
  // 组件卸载时取消所有未完成的请求
  if (abortController) {
    abortController.abort()
    abortController = null
  }
})

watch(
  () => props.personalInfo,
  (data: any) => {
    if (data?.key) {
      sideFun(data)
    }
  },
  { deep: true, immediate: true }
)

</script>

<style scoped lang="less">
.elMain {
  padding: 0;
  height: 100%;

  .content {
    position: relative;
    background: #fff;

    :deep(.ant-tabs-tab+.ant-tabs-tab) {
      margin-left: 0px;
    }

    .elTabs {
      border-radius: 4px;

      :deep(.ant-tabs-nav) {
        // height: 48px;
        margin-bottom: 0;
        background-color: #ffffff;
        padding: 0 0 16px 0;
      }

      :deep(.ant-tabs-tab) {
        width: 96px;
        // height: 32px;
        font-size: 14px;
        background: #f2f5f7;
        border-radius: 2px 0 0 2px;
        border: 1px solid #ffffff;
        margin-right: 2px;
        justify-content: center;
        padding: 0 !important;
      }

      :deep(.ant-tabs-tab-active) {
        background: #e6effb;

        .ant-tabs-tab-btn {
          font-weight: 600;
          font-size: 14px;
          color: var(--ant-primary-color);
          text-shadow: none !important;
        }
      }

      :deep(.ant-tabs-ink-bar) {
        display: none;
      }

      :deep(.ant-tabs-content-holder) {
        display: none;
      }
    }
  }
}
</style>