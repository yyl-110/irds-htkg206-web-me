<script lang="ts" setup>
// 系统功能配置
import { ref, watch, nextTick } from 'vue';
import { message, Tooltip } from 'ant-design-vue';
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, FormOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import { openModule, assembleModule, openTopAsmTemplateInterfaceModel, apiRenameModel } from '@/utils/webSocket';
import { AdminApiSystemModule } from '@/api/tags/module/系统模块库';
import { useUserStore } from '@/store/modules/user';
import { DesignApiInfo } from '@/api/tags/design/产品设计';
import { checkfileExtension } from '@/utils/tools';
import Empty from '@/components/Empty/index.vue';
const props = defineProps({
  taskInfoData: {
    require: false,
    type: Object,
    default: () => {},
  },
  dataUpload: {
    require: false,
    type: Array,
    default: () => [],
  },
  moduleList: {
    require: false,
    type: Array,
    default: () => [],
  },
  moduleColumns: {
    require: false,
    type: Array,
    default: () => [],
  },
  illustrateString: {
    require: false,
    type: String,
  },
  dataString: {
    require: false,
    type: Object,
    default: () => {},
  },
  isEdit: {
    require: false,
    type: Boolean,
    default: false,
  },
  selectedKeys: {
    require: false,
    type: String,
    default: false,
  },
  commitBtnStatus: {
    require: false,
    type: Boolean,
    default: false,
  },
  editBtnStatus: {
    require: false,
    type: Boolean,
    default: false,
  },
  isShowBottomBtns: {
    require: false,
    type: Boolean,
    default: true,
  },
});
const userStore = useUserStore();
const emit = defineEmits(['detaDataUpload', 'toUpload', 'submitOk', 'submitStatus']);
const selfIsShowBottomBtns = ref(true);
const saveBtnStatus = ref<boolean>(false);
const enDesignModul = ref<boolean>(false);
const enDesignName = ref('模块参数'); // 模块名称
const enCollapseNames = ref('1');
const enModuleParaList = ref<any>([]);
const attachmentListData = ref<any>([]);
const pdmResultData = ref<any>([]);
const getGbomData = ref<any>([]);
const filteredEnModuleParaList = computed(() => {
  return enModuleParaList.value.filter(item => item.columnProperties === 1);
});
const filterDefinedParaList = computed(() => {
  return enModuleParaList.value.filter(item => item.columnProperties !== 1);
});
function submitStatus(num: any, operationType: any, nodeId: any) {
  emit('submitStatus', num, operationType, nodeId);
}

//打开模型
const openModuleInfo = row => {
  openModule({}, row.para1, row.para4, '', '', '');
  addModelLog(row, 8);
};

// 打开装配图
const assembleModuleInfo = row => {
  assembleModule({}, row.para1, row.para4, '', '', '', '');
  addModelLog(row, 9);
};

//添加日志
const addModelLog = (moduleInfo: any, logUpdateType: any) => {
  let data: any = {};
  data.categoryId = moduleInfo.categoryId;
  data.userId = userStore.getUser.id;
  data.userName = userStore.getUser.username || 'admin';
  data.moduleId = moduleInfo.id;
  data.moduleNum = moduleInfo.para1 == undefined ? '' : moduleInfo.para1;
  data.logUpdateType = logUpdateType;
  DesignApiInfo.setOperationalModel(data);
};

// 打开详情
const moduleDetails = row => {
  findModule(row);
  toParm(row);
  getGbom(row);
  enDesignModul.value = true;
};

// 获取模块详情参数
async function findModule(row: any) {
  let data = {};
  data.userId = userStore.getUser.id;
  data.categoryId = row.categoryId;
  data.id = row.moduleId;
  const res = await DesignApiInfo.findModuleInfoDetailedById(data);
  enModuleParaList.value = res.data.data.moduleParaList || [];
}

// 获取模块库知识和pdm数据
async function toParm(row: any) {
  let data = {};
  data.id = row.moduleId;
  data.pdmModuleNum = row.para1;
  data.userName = userStore.getUser.username || 'admin';
  data.userId = userStore.getUser.id;
  data.pdmModelType = row.para4;
  const res = await DesignApiInfo.findAllModuleAttachment(data);
  attachmentListData.value = res.data.data.attachmentList || [];
  pdmResultData.value = res.data.data.pdmResult || [];
}

//获取gbom数据
async function getGbom(row: any) {
  let data = {};
  data.number = row.para1;
  const res = await DesignApiInfo.pdmSystemSyncBOM(data);
  console.log(res);
  getGbomData.value = res.data.data;
}

//下载pdm文件
const handleNameClick = (row: any) => {
  const data: any = {};
  data.docnumber = row.docnumber;
  AdminApiSystemModule.getURLApi(data).then(function (res) {
    if (res.data.code == 0) {
      window.open(res.data.data);
    } else {
      message.error(res.data.msg);
    }
  });
};
const bomInfoData = ref([]);
const applicationEditFlag = ref(false); // 编辑应用弹窗
//编辑应用
const applicationEdit = (fos: any) => {
  if (fos.para4 === 'prt') {
    let data: any = {};
    data.number = fos.para1;
    DesignApiInfo.getBomNewNumberApi(data).then(function (res) {
      if (res.data.code == 0) {
        const { moduleNewNum } = res.data.data;
        openModule({}, fos.para1, fos.para4, moduleNewNum, '', '');
      } else {
        message.error(res.data.msg);
      }
    });
  } else {
    let data: any = {};
    data.number = fos.para1;
    data.commonName = fos.para3;
    data.userId = userStore.getUser.id;
    DesignApiInfo.getBomInfoTestApi(data).then(function (res) {
      if (res.data.code === 0) {
        recursiveMapWithAction(res.data).then((newTree: any) => {
          bomInfoData.value = newTree;
        });
        applicationEditFlag.value = true;
      } else {
        message.error(res.data.msg);
      }
    });
  }
};
/**
 * 递归初始化树形结构
 */
function recursiveMapWithAction(tree: any) {
  if (Array.isArray(tree)) {
    return Promise.all(tree.map((subtree: any) => recursiveMapWithAction(subtree)));
  } else if (typeof tree === 'object' && tree !== null) {
    const mapped: any = {};
    const promises = [];
    for (let key in tree) {
      if (tree.hasOwnProperty(key)) {
        const promise = new Promise(resolve => {
          recursiveMapWithAction(tree[key]).then(result => {
            mapped[key] = result;
            resolve();
          });
        });
        promises.push(promise);
      }
    }
    return Promise.all(promises).then(() => {
      return new Promise(resolve => {
        if (+mapped.supeq === 0) {
          mapped.action = '自动命名';
          resolve(
            DesignApiInfo.getBomNewNumberApi({ number: mapped.equnr }).then(function (res) {
              if (res.data.code == 0) {
                const { moduleNewNum } = res.data.data;
                mapped.moduleNewNum = moduleNewNum;
                return mapped;
              } else {
                message.error(res.data.msg);
                return mapped;
              }
            }),
          );
        } else {
          mapped.action = '重新使用';
          resolve(mapped);
        }
      });
    });
  } else {
    return Promise.resolve(tree);
  }
}
const dialogPreview = ref(false);
const pdfName = ref('');
const pdfDetail = ref(false);
// 预览PDF
const previewPDF = (row: any) => {
  dialogPreview.value = false;
  const flag = checkfileExtension(row.fileType);
  if (!flag) {
    message.error('当前文件类型不可以预览');
    return;
  }
  let data: any = {};
  data.categoryId = '';
  data.userId = userStore.getUser.id;
  data.userName = userStore.getUser.userName;
  data.id = row.id;
  DesignApiInfo.getPdfPreviewPath(data).then(function (response) {
    pdfName.value = response.data.data.fileUrl;
    pdfDetail.value = true;
  });
};

// 下载PDF
function downloadPDF(id: number) {
  const baseUrl = import.meta.env.VITE_BASE_HTMLPREVIEW_URL;
  if (id) {
    window.location.href = baseUrl + '/cirpoint-base-api/fileManagerController/download?fileId=' + id;
  } else {
    window.location.href = baseUrl + '/fileManagerController/download?fileId=' + id;
  }
}

const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
});

defineExpose({});
</script>

<template>
  <div class="container">
    <div class="box">
      <a-row class="elrowheight">
        <div class="top-block">
          <div class="block-inner">
            <img class="pic" :src="taskInfoData.picUrl" />
            <div class="dec-wrap">
              <div class="t">{{ taskInfoData.taskName }}</div>
              <div class="tm">平台名称：{{ taskInfoData.platformName }}</div>
              <div class="tm">
                任务时间：{{ taskInfoData.startTime }} ~
                {{ taskInfoData.endTime }}
              </div>
              <div class="pr">
                <span>当前进度：{{ taskInfoData.taskPercentage }}%</span><span>距截止还剩{{ taskInfoData.deadlineDays }}天</span>
              </div>
              <div class="user-wrap">
                <a-progress status="active" :percent="taskInfoData?.taskPercentage" class="elprogress" />
                <div class="create-pop">
                  创建人：<span class="user"><img src="../../../../../assets/workbench/avatar.jpg" alt="" />{{ taskInfoData?.createUserName }} </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="content-title">
          <i></i>
          <span>模块清单</span>
        </div>
        <div style="margin: 20px 20px 28px 16px; width: 100%">
          <a-table
            :scroll="{ y: 400 }"
            style="margin-top: 5px; margin-right: 16px"
            :pagination="false"
            row-key="id"
            :locale="locale"
            :columns="moduleColumns"
            :data-source="moduleList"
            :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'label'">
                <div style="display: flex">
                  <a color="blue" @click="openModuleInfo(record)" style="cursor: pointer" type="primary"> {{ '打开' }}</a>
                  <a color="blue" @click="assembleModuleInfo(record)" style="cursor: pointer; margin-left: 10px" type="primary"> {{ '装配' }}</a>
                  <a color="blue" @click="moduleDetails(record)" style="cursor: pointer; margin-left: 10px" type="primary"> {{ '详情' }}</a>
                  <a color="blue" @click="applicationEdit(record)" style="cursor: pointer; margin-left: 10px" type="primary"> {{ '编辑应用' }}</a>
                </div>
              </template>
              <template v-if="column.dataIndex === 'applicationType'">
                <span v-if="record.applicationType == 0">直接应用</span>
                <span v-else-if="record.applicationType == 1">变形设计</span>
              </template>
            </template>
          </a-table>
        </div>
        <div class="foot-btn">
          <div class="backBtn" v-if="selfIsShowBottomBtns && isShowBottomBtns">
            <a-button type="primary" @click="submitStatus(3, 1, selectedKeys)" :disabled="commitBtnStatus">
              <EpcIcon type="icon-tijiaoqueren" style="font-size: 12px" />
              提交</a-button
            >
            <a-button type="primary" class="btn_left" @click="submitStatus(3, 0)" :disabled="editBtnStatus">
              <EpcIcon type="icon-edit" style="font-size: 15px" />
              编辑</a-button
            >
          </div>
        </div>
      </a-row>
    </div>
  </div>

  <!-- 模块数据详情 -->
  <a-modal v-model:visible="enDesignModul" title="模块详情" width="900px">
    <div style="width: 100%; background: #fff; margin-top: 4px">
      <section style="width: 100%; max-height: 600px; overflow-x: hidden; overflow-y: auto; background-color: #ffffff">
        <a-tabs v-model="enDesignName" type="card" class="design-tabs">
          <a-tab-pane key="first" tab="模块参数" name="模块参数">
            <a-collapse class="custom-collapse" v-model:value="enCollapseNames" accordion>
              <a-collapse-panel header="固定参数" name="1">
                <a-row type="flex" justify="space-between" style="padding-left: 20px; flex-wrap: wrap">
                  <a-col :span="12" v-for="item in filteredEnModuleParaList" :key="item.id" style="margin-top: 16px; box-sizing: border-box">
                    <a-row gutter="8">
                      <a-col :span="8" style="text-align: right">
                        <Tooltip placement="right" :title="item.propertyName">
                          <div class="top-title">{{ item.propertyName }}：</div>
                        </Tooltip>
                      </a-col>
                      <a-col :span="16">
                        <a-input v-model:value="item.paraValue" placeholder="暂无参数值..." style="width: 100%; max-width: 320px" disabled />
                      </a-col>
                    </a-row>
                  </a-col>
                </a-row>
              </a-collapse-panel>
              <a-collapse-panel header="自定义参数" name="2">
                <a-row style="padding-left: 20px">
                  <a-col :span="12" v-for="item in filterDefinedParaList" :key="item.id" style="margin-top: 20px">
                    <a-row v-if="+item.columnProperties !== 1">
                      <a-col :span="4">
                        <Tooltip placement="right" :title="item.propertyName">
                          <div class="top-title">{{ item.propertyName }}：</div>
                        </Tooltip>
                      </a-col>
                      <a-col :span="20">
                        <a-input v-model:value="item.paraValue" placeholder="暂无参数值..." style="width: 234px" disabled />
                      </a-col>
                    </a-row>
                  </a-col>
                </a-row>
              </a-collapse-panel>
            </a-collapse>
          </a-tab-pane>
          <a-tab-pane key="second" tab="模块资料" name="模块资料">
            <a-row>
              <a-col :span="24">
                <div class="top-table-title">模块库知识:</div>
                <a-table :locale="locale" scrollbar-always-on stripe :data-source="attachmentListData" style="width: 100%">
                  <a-table-column align="left" header-align="left" data-index="documentName" title="附件名称" />
                  <a-table-column align="left" header-align="left" data-index="createName" title="创建人" />
                  <a-table-column align="left" header-align="left" data-index="createData" title="创建时间" />
                  <a-table-column align="left" header-align="left" data-index="fileType" title="类型" />
                  <a-table-column align="left" header-align="left" data-index="remark" title="备注" />
                  <a-table-column align="left" header-align="left" data-index="action" title="操作">
                    <template #default="{ record }">
                      <a-link @click="previewPDF(record)" type="primary">预览</a-link>
                      &nbsp;
                      <a-link @click="downloadPDF(record.id)" type="primary">下载</a-link>
                    </template>
                  </a-table-column>
                </a-table>
              </a-col>
              <a-col :span="24">
                <div class="top-table-title">PDM知识:</div>
                <a-table :locale="locale" scrollbar-always-on stripe :data-source="pdmResultData" style="width: 100%">
                  <a-table-column align="left" header-align="left" data-index="docnumber" title="文件编号">
                    <template #default="{ record }">
                      <a-link @click="handleNameClick(record)" type="primary">{{ record.docnumber }}</a-link>
                    </template>
                  </a-table-column>
                  <a-table-column align="left" header-align="left" data-index="docname" title="文件名称" />
                </a-table>
              </a-col>
            </a-row>
          </a-tab-pane>

          <a-tab-pane key="third" tab="BOM结构" name="BOM结构">
            <a-table
              scrollbar-always-on
              stripe
              ref="supGbomRef"
              :locale="locale"
              :data-source="getGbomData"
              style="width: 100%"
              row-key="id"
              default-expand-all
              :tree-props="{ children: 'children' }">
              <a-table-column data-index="descript" title="GBOM名称" align="left"></a-table-column>
              <a-table-column data-index="equnr" title="物料编码" align="left"></a-table-column>
              <a-table-column data-index="version" title="版本" align="left"></a-table-column>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </section>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <!-- <a-button type="primary" @click="designOk()"> 确定 </a-button> -->
        <a-button type="primary" @click="enDesignModul = false"><EpcIcon type="icon-quxiao" style="font-size: 15px" />关闭</a-button>
      </span>
    </template>
  </a-modal>
  <!-- 知识预览  -->
  <a-modal :mask-closable="false" width="1300" v-model:visible="pdfDetail" title="知识详情">
    <div style="height: 800px" class="modalMinHeight">
      <div id="pdfUrl" style="height: 90%">
        <iframe width="100%" height="100%" :src="`/cir/lib/pdfjs-2.12.313-legacy-dist/web/viewer.html?file=${encodeURIComponent(pdfName)}`"></iframe>
      </div>
    </div>
    <template #footer>
      <a-button type="primary" @click="pdfDetail = false"><EpcIcon type="icon-quxiao" style="font-size: 15px" />关闭</a-button>
    </template>
  </a-modal>
</template>

<style lang="less" scoped>
@import '../../../../../assets/css/designFlow/designFlow.less';
@import '../../../../../sheets/collapse.less';
.box {
  width: 100%;
  height: 100%;
  background: #fff;
  position: relative;
  overflow: hidden;
  overflow-y: auto;
}
.design-tabs .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.top-title {
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  line-height: 32px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 10px;
  cursor: default;
}
/* 调整折叠面板样式 */
:deep(.ant-collapse-header) {
  background-color: #fafafa;
  border-radius: 2px 2px 0 0;
}
:deep(.ant-collapse-content) {
  padding: 16px 0 !important;
}
/* 调整输入框样式 */
:deep(.ant-input-disabled) {
  background-color: #fff;
  color: rgba(0, 0, 0, 0.65);
  border-color: #d9d9d9;
  height: 32px;
}
/* 调整行间距 */
:deep(.ant-row) {
  margin-bottom: 8px;
}
/* 增加标签与输入框间距 */
:deep(.ant-col-8) {
  padding-right: 16px;
}
</style>
