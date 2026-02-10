<script lang="ts" setup>
import { nextTick, reactive, ref } from 'vue';
import type { TableColumnType } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { useRender } from '@/components/escape';
import { BoardPageRequestDTOModel } from '@/api/models/board/BoardPageRequestDTOModel';
import { AdminApiSystemBoard } from '@/api/tags/board/平台看板管理';
import { sortermethod } from '@/utils/tools';
import type { BoardInfoRequestDTOModel } from '@/api/models/board/BoardInfoRequestDTOModel';

const powerModel = ref<InstanceType<typeof BoardInfoRequestDTOModel>>();
const addOrUpdateModel = ref<InstanceType<typeof BoardInfoRequestDTOModel>>();

const loading = ref<boolean>(false);
const powVisible = ref<boolean>(false);

const reportIndex = ref<string>('');
const reportName = ref<string>('');

/** 是否显示 新增 / 编辑 弹窗 */
const visibleEditor = ref<boolean>(false);
const columns = ref<TableColumnType<BoardInfoRequestDTOModel>[]>([
  {
    title: WeiI18n.$t('报表名称'),
    dataIndex: 'reportName',
    key: 'reportName',
    align: 'left',
    resizable: true,
    sorter: (a: any, b: any) => sortermethod(a.reportName, b.reportName),
    width: 490,
  },
  {
    title: WeiI18n.$t('报表区域'),
    dataIndex: 'reportIndex',
    key: 'reportIndex',
    align: 'center',
    resizable: true,
    width: 260,
    sorter: (a: any, b: any) => sortermethod(a.reportIndex, b.reportIndex),
  },
  {
    title: WeiI18n.$t('创建时间'),
    key: 'addTime',
    dataIndex: 'addTime',
    align: 'center',
    resizable: true,
    width: 320,
    sorter: (a: any, b: any) => sortermethod(a.addTime, b.addTime),
    /**
     * customRender
     * @param root0 params
     * @param root0.text text
     */
    customRender: ({ text }) => {
      return useRender.renderDateNoTime(text);
    },
  },
  {
    title: WeiI18n.$t('操作'),
    dataIndex: 'operation',
    align: 'left',
    width: 350,
  },
  {},
]);
/** 列表请求参数 */
const requestParams = reactive(new BoardPageRequestDTOModel());

/** 列表数据 */
const resources = ref<Array<BoardInfoRequestDTOModel>>([]);

onActivated(() => {
  getResources();
});

function handleResizeColumn(w, col) {
  col.width = w;
}

function handleClosePowModal() {
  powVisible.value = false;
}

function handleCloseAddModal() {
  visibleEditor.value = false;
}

/** 获取公告列表数据 */
async function getResources() {
  loading.value = true;
  try {
    requestParams.reportIndex = reportIndex;
    requestParams.reportName = reportName;
    const res = await AdminApiSystemBoard.getReportInfoList({
      ...requestParams,
    });
    resources.value = res.data.data.result || [];
  } finally {
    loading.value = false;
  }
}
/**
 * 详情查看页面
 */
// async function seeDetailFun(id: string) {
//   requestParams.id = id;
//   const res = await AdminApiSystemNotice.getNoticeInfoById({ ...requestParams });
//   powVisible.value = true;
//   nextTick(() => {
//     powerModel.value.getDetailFromMain(res.data.data.data, res.data.data.pdfFileName);
//   });
// }

/**
 * 删除公告
 * @param id id
 */
async function handleDelete(id: string) {
  await AdminApiSystemBoard.reportinfoDeleteReportInfo({ id });
  message.success(WeiI18n.$t('删除成功'));
  getResources();
}

/**
 * 添加数据和编辑页面
 */
function infoAdd(record?: any) {
  visibleEditor.value = true;
  nextTick(() => {
    addOrUpdateModel.value?.infoReload(record);
  });
}
</script>

<template>
  <div class="main" ref="mainRef">
    <div class="nav-sub"></div>
  </div>
</template>

<style lang="less" scoped>
.main {
  width: calc(~'100vw - 168px');
  height: calc(~'100% - 60px');
  background: #f3f2f7;
  position: absolute;
  top: 60px;
  overflow-y: scroll;
  z-index: 10;
}
.fit {
  width: calc(~'100vw - 64px');
}
.mainbox {
  display: flex;
  padding: 0 0 0 16px;
  justify-content: space-between;
}
.boxall {
  position: relative;
  margin-bottom: 15px;
  z-index: 10;
  .alltitle {
    font-family:
      Source Sans 3,
      Source Sans 3;
    font-weight: 600;
    font-size: 18px;
    color: #000;
    line-height: 18px;
    text-align: left;
    font-style: normal;
    text-transform: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .bnts-wrap {
      .el-tag {
        margin-left: 12px;
        cursor: pointer;
        border-radius: 10px;
      }
    }
  }
  .sub-alltitle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 36px 8px 8px;
    span {
      font-family:
        Source Sans 3,
        Source Sans 3;
      font-weight: 400;
      font-size: 12px;
      color: #a2a1a6;
      line-height: 12px;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
  }
}
.navboxall {
  height: calc(100% - 30px);
}
.num {
  padding-right: 20px;
}
.table1 .list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 42px;
  border-radius: 2px 2px 2px 2px;
  border-bottom: 1px solid #eaeaf1;
  position: relative;
  .pm {
    min-width: 24px;
    max-width: 24px;
    height: 24px;
    overflow: hidden;
    margin-left: 10px;
  }
  .contentWrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 200px;
    height: 41px;
    overflow: hidden;
    background: #fff;
    display: none;
    line-height: 20px;
    font-family:
      Source Sans 3,
      Source Sans 3;
    font-weight: 400;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.8);
  }
  &:hover {
    .contentWrap {
      display: block;
    }
  }
}
.table1 .tit {
  font-family:
    Source Sans 3,
    Source Sans 3;
  font-weight: 400;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.8);
  text-align: left;
  font-style: normal;
  text-transform: none;
  height: 24px;
  width: 177px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  .username {
    display: flex;
    align-items: center;
    img {
      min-width: 24px;
      max-width: 24px;
      height: 24px;
      border-radius: 24px;
      margin-right: 4px;
    }
  }

  .number {
    font-size: 12px;
  }
}
.table1 .status {
  height: 20px;
  background: #fef1d8;
  border-radius: 13px 13px 13px 13px;
  padding: 0 8px;
  font-family:
    Source Sans 3,
    Source Sans 3;
  font-weight: 400;
  font-size: 12px;
  color: #fff;
  font-style: normal;
  text-transform: none;
}

@keyframes myfirst2 {
  from {
    width: 0;
  }
  to {
  }
}
.h352 {
  min-width: 296px;
  max-width: 296px;
  height: 352px;
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  overflow: hidden;
  margin-right: 16px;
  padding: 20px 16px 24px 16px;
}
.h395 {
  min-width: 296px;
  max-width: 296px;
  height: 480px;
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  overflow: hidden;
  margin-right: 16px;
  padding: 20px 16px 24px 16px;
  .box-inner {
    margin-top: 26px;
    height: 420px;
    overflow-y: auto;
    ::-webkit-scrollbar {
      width: 2px; /* 设置滚动条的宽度 */
    }
  }
  .box-list {
    margin-bottom: 22px;
    .inner-tit {
      font-family:
        Source Sans 3,
        Source Sans 3;
      font-weight: 400;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.8);
      line-height: 14px;
      text-align: left;
      font-style: normal;
      text-transform: none;
      margin-bottom: 6px;
    }
    .block-wrap {
      display: flex;
      align-items: center;
      .b-list {
        height: 12px;
        width: 30px;
        margin-right: 2px;
        cursor: pointer;
        &:nth-child(odd) {
          background: linear-gradient(270deg, #ffd153 0%, #ffd400 100%);
        }
        &:nth-child(even) {
          background: linear-gradient(270deg, #ff8e8a 0%, #ff6571 100%);
        }
        &:first-child {
          background: linear-gradient(270deg, #6f96fa 0%, #3172f5 72%);
        }
      }
    }
  }
}
.h420 {
  height: 414px;
  overflow: hidden;
}
.c-tit {
  text-align: center;
  font-size: 18px;
  color: #fff;
}
.echarts-wrap {
  width: calc(100vw - 10px);
  height: 352px;
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  overflow: hidden;
  margin-right: 16px;
  padding: 20px 16px 24px 16px;
  #echart1 {
    width: 100%;
    height: 330px;
    margin: 0 auto;
  }
}
.echarts-bom-wrap {
  width: calc(100vw - 10px);
  height: 480px;
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  overflow: hidden;
  margin-right: 16px;
  padding: 20px 16px 24px 16px;
}
.list-container {
  height: 380px;
  overflow: hidden;
  position: relative;
}
.marquee {
  animation: marquee 15s linear infinite;
}
.marquee:hover {
  animation-play-state: paused;
}
@keyframes marquee {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(-51%);
  }
}
.diaEchart {
  width: 100%;
  height: 400px;
  #diaEchart {
    height: 400px;
    width: 100%;
  }
}
:deep(.el-carousel__button) {
  background: #000;
}
</style>
