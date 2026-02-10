<!-- 输入配置 -->
<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue';
import { message } from 'ant-design-vue';
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, FormOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import { DesignApiInfo } from '@/api/tags/design/产品设计';
import { useUserStore } from '@/store/modules/user';
import { AdminApiSystemModule } from '@/api/tags/module/系统模块库';
import { checkfileExtension } from '@/utils/tools';
import Empty from '@/components/Empty/index.vue';
import {
  openModule,
  assembleModule,
  openDrawing,
  parameterInFirstCsys,
  GetLocParametersInFirstCsys,
  DownloadModuleFile,
  openTopAsmTemplateInterfaceModel,
  apiRenameModel,
} from '@/libs/webSocket';
import { an } from 'vitest/dist/chunks/reporters.nr4dxCkA';
const userStore = useUserStore();
const props = defineProps({
  taskInfoData: {
    require: false,
    type: Object,
    default: () => {},
  },
  taskInfo: {
    require: false,
    type: Object,
    default: () => {},
  },
  relevantDataEnd: {
    require: false,
    type: Object,
    default: () => {},
  },
  taskId: {
    require: false,
    type: String,
    default: '',
  },
  relevantStringEnd: {
    require: false,
    type: String,
    default: '',
  },
  twoRoundVersionBuilds: {
    require: false,
    type: Array,
    default: () => [],
  },
  gbomPlatformTableDataEnd: {
    require: false,
    type: Array,
    default: () => [],
  },
  selectedKeys: {
    require: false,
    type: String,
    default: false,
  },
});
const emit = defineEmits(['clickisShowVersionDialog']);
const dialogPreview = ref(false);
const enParameterList = ref<any>([]); // 工程师获取定义系统参数数据
const projectParametersArr = ref<any>([]);
const argsItemInfo = ref<any>({});
const enDesignName = ref('模块参数'); // 模块名称
const relevantStringEnds = ref('');
const enCollapseNames = ref('1');
const filteredEnModuleParaList: any = computed(() => {
  return enModuleParaList.value.filter(item => item.columnProperties === 1);
});
const filterDefinedParaList: any = computed(() => {
  return enModuleParaList.value.filter(item => item.columnProperties !== 1);
});
function linkClick(url: string) {
  window.open(url);
}
// 工程师获取定义系统参数数据
const getDefSysParameterList = (taskNum: any, taskType: any) => {
  const obj: any = {
    taskNum,
    taskType,
  };
  obj.projectId = props.taskInfo.projectId;
  obj.seriesgbomId = props.taskInfo.seriesGbomId;
  obj.taskId = props.taskInfo.id;
  DesignApiInfo.getDefSysParameterListApi(obj).then(function (res) {
    if (res.data.code == 0) {
      enParameterList.value = res.data.data || [];
      const dataArr = res.data.data.result || [];
      // getGbomParameterList(props.taskInfo.seriesGbomId, dataArr);
      projectParametersArr.value = dataArr;
    } else {
      message.error(res.data.msg);
    }
  });
};

const gbomPlatformTableData = ref<any>([]);
const enInpuColorType = reactive<any>({}); // 控制参数展示状态
// 获取bom参数定义
const getGbomParameterList = (id: string, enarr: any) => {
  const data: any = {};
  data.seriesGBOMId = id;
  data.taskId = props.taskId;
  DesignApiInfo.seriesGBOMGetParameterList(data).then(function (res) {
    if (res.data.code == 0) {
      const dataArr = res.data.data || [];
      dataArr.map((item: any) => {
        const fos = enarr.filter((element: any) => +element.seriesgbomParameterId === +item.id)[0];
        if (fos) {
          item.value = fos.value;
          item.seriesgbomParameterId = fos.seriesgbomParameterId;
          item.fosId = fos.id;
        }
      });
      enarr.forEach((element: any) => {
        enInpuColorType[element.seriesgbomParameterId] = element.markerColor;
      });
      gbomPlatformTableData.value = dataArr || [];
    }
  });
};

/**----------------------模块清单------------------------------------ */
// 获取模块清单数据
const enInventoryDataEnd = ref([]);
const enInventoryColumnListEnd = ref<any>([]);
const loading = ref(true);
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
});
const eninventoryEnd = (designObj: any) => {
  try {
    loading.value = true;
    const data: any = {};
    data.taskId = designObj.taskSourceId;
    data.projectId = designObj.projectId;
    DesignApiInfo.enqueryModuleListApi(data).then(function (res) {
      if (res.data.code == 0) {
        loading.value = false;
        enInventoryDataEnd.value = res.data.data.tableData || [];
        enInventoryColumnListEnd.value = res.data.data.columnList || [];
        enInventoryColumnListEnd.value.forEach((item: any) => {
          item.title = item.propertyName;
          item.dataIndex = item.modelInfoProp;
          item.key = item.modelInfoProp;
          item.minWidth = 100;
        });
        enInventoryColumnListEnd.value.push({
          title: '模块选取',
          dataIndex: 'action',
          key: 'action',
          width: 220,
          fixed: 'right',
        });
      }
    });
  } finally {
    loading.value = false;
  }
};
const getVersion = (id: any) => {
  let items: any = '';
  projectParametersArr.value.forEach((item: any) => {
    if ((item.seriesParameterId == id || item.seriesgbomParameterId == id) && item.paramVersion && item.paramVersion.length > 0 && item.paramVersion != null) {
      items = item;
    }
  });
  argsItemInfo.value = items;
  return items.paramVersion;
};
const isShowDialog = ref(false);
const versionData = ref([]);
const showDialog = (items: any) => {
  isShowDialog.value = true;
  versionData.value = items;
};

//添加日志
const addModelLog = (moduleInfo: any, logUpdateType: any) => {
  let data: any = {};
  data.categoryId = moduleInfo.categoryId;
  data.userId = userStore.getUser.id;
  data.userName = userStore.getUser.userName;
  data.moduleId = moduleInfo.id;
  data.moduleNum = moduleInfo.para1 == undefined ? '' : moduleInfo.para1;
  data.logUpdateType = logUpdateType;
  DesignApiInfo.setOperationalModel(data);
};

//打开模型
const openModuleInfo = (row: any) => {
  openModule({}, row.para1, row.para4, '', '', '');
  addModelLog(row, 8);
};

// 打开装配图
const assembleModuleInfo = (row: any) => {
  assembleModule({}, row.para1, row.para4, '', '', '', '');
  addModelLog(row, 9);
};
const fosModule = ref({}); //需要操作的模块数据
const enDesignModul = ref(false); // 模块详情弹窗
const enModuleParaList = ref([]); // 模块清单详情数据
// 获取模块详情参数
const findModule = (row: any) => {
  let data: any = {};
  data.userId = userStore.getUser.id;
  data.categoryId = row.categoryId;
  data.id = row.moduleId;
  DesignApiInfo.findModuleInfoDetailedById(data).then(function (res) {
    if (res.data.code == 0) {
      enModuleParaList.value = res.data.data.moduleParaList || [];
    }
  });
};
const attachmentListData = ref([]); //本地文件预览
const pdmResultData = ref([]); //pdm文件打开
const getGbomData = ref([]); //bom数据
// 获取模块库知识和pdm数据
const toParm = (row: any) => {
  let data: any = {};
  data.id = row.moduleId;
  data.pdmModuleNum = row.para1;
  data.userName = userStore.getUser.userName;
  data.userId = userStore.getUser.id;
  data.pdmModelType = row.para4;
  DesignApiInfo.findAllModuleAttachment(data).then(function (res) {
    if (res.data.code == 0) {
      attachmentListData.value = res.data.data.attachmentList || [];
      pdmResultData.value = res.data.data.pdmResult || [];
    }
  });
};
//获取gbom数据
const getGbom = (row: any) => {
  AdminApiSystemModule.syncBOMApi({ number: row.para1 }).then(function (res) {
    if (res.data.code == 0) {
      const data = res.data.data || [];
      getGbomData.value = data;
    }
  });
};
// 打开详情
const moduleDetails = (row: any) => {
  fosModule.value = row;
  findModule(row);
  toParm(row);
  getGbom(row);
  enDesignModul.value = true;
};

const bomInfoData = ref([]);
const applicationEditFlag = ref(false); // 编辑应用弹窗
// 编辑应用树形结构//编辑应用
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
const pdfName = ref('');
const pdfDetail = ref(false);
//预览本地
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
//下载本地
function downloadPDF(id: number) {
  const baseUrl = import.meta.env.VITE_BASE_HTMLPREVIEW_URL;
  if (id) {
    window.location.href = baseUrl + '/cirpoint-base-api/fileManagerController/download?fileId=' + id;
  } else {
    window.location.href = baseUrl + '/fileManagerController/download?fileId=' + id;
  }
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
/**
 * 编辑应用的类型
 */
const editMode = (e: any, row: any) => {
  if (e === '自动命名') {
    DesignApiInfo.getBomNewNumberApi({ number: row.equnr }).then(function (res) {
      if (res.data.code === 0) {
        const { moduleNewNum } = res.data.data;
        bomInfoData.value = recursiveUpdate(bomInfoData.value, row.equnr, moduleNewNum);
      } else {
        message.error(res.data.msg);
      }
    });
  } else if (e === '重新使用') {
    bomInfoData.value = recursiveUpdate(bomInfoData.value, row.equnr, null);
  }
};
/**
 * 递归初修改树形结构
 */
const recursiveUpdate = (tree: any, equnr: any, moduleNewNum: any) => {
  if (Array.isArray(tree)) {
    // 如果是数组，则递归处理每个子节点
    return tree.map((subtree: any) => recursiveUpdate(subtree, equnr, moduleNewNum));
  } else if (typeof tree === 'object' && tree !== null) {
    // 如果是对象，则检查当前节点是否是目标节点
    if (tree.equnr === equnr) {
      // 找到目标节点，修改其值
      tree.moduleNewNum = moduleNewNum;
    }

    // 递归处理子节点
    for (let key in tree) {
      if (tree.hasOwnProperty(key)) {
        recursiveUpdate(tree[key], equnr, moduleNewNum);
      }
    }

    return tree;
  } else {
    // 其他情况，直接返回当前节点
    return tree;
  }
};

/**
 * 打开编辑应用的类型
 */
const openBomInfoData = async () => {
  const tree: any = bomInfoData.value[0];
  let openTop = await openTopAsmTemplateInterfaceModel({}, tree.equnr, tree.moduleType, tree.moduleNewNum, '', '');
  if (openTop.ReturnStatus == 0) {
    recursiveTraversal(bomInfoData.value);
  }
};
/**
 * 递归调用接口数据
 */
const recursiveTraversal = tree => {
  if (Array.isArray(tree)) {
    // 如果是数组，则递归处理每个子节点
    return Promise.all(tree.map(subtree => recursiveTraversal(subtree)));
  } else if (typeof tree === 'object' && tree !== null) {
    // 如果是对象，则遍历当前节点的数据并进行循环调用接口
    const promises = [];
    const promise = {};
    for (let key in tree) {
      if (tree.hasOwnProperty(key)) {
        const data = tree[key];
        if (key === 'supeq') {
          if (+data !== 0) {
            if (tree.moduleNewNum) {
              apiRenameModel({}, tree.equnr, tree.moduleType, tree.moduleNewNum);
            }
          }
        }
        recursiveTraversal(data);
      }
    }
  }
};

function clickisShowVersionDialog() {
  emit('clickisShowVersionDialog');
}

watch(
  () => props.relevantStringEnd,
  (newPath, oldPath) => {
    relevantStringEnds.value = newPath;
  },
  { immediate: true },
);
defineExpose({ getDefSysParameterList, eninventoryEnd });
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
                  创建人：<span class="user"><img src="../../../../../assets/workbench/avatar.jpg" alt="" />{{ taskInfoData.createUserName }} </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="content-title">
          <i></i>
          <span>系统参数</span>
        </div>
        <div style="width: 100%">
          <a-row class="elrowheight" v-if="gbomPlatformTableDataEnd && gbomPlatformTableDataEnd.length" style="margin-bottom: 20px">
            <div v-for="item in gbomPlatformTableDataEnd" :key="item.id" style="margin: 20px 0 0px 16px; width: 240px; overflow: hidden">
              <a-row>
                <a-col :span="24">
                  <div class="top-title">{{ item.parameterName }}：</div>
                  <a-icon style="position: absolute; top: 10px; left: 360px; cursor: pointer" v-if="getVersion(item.id)" @click="showDialog(getVersion(item.id))"><Timer /></a-icon>
                </a-col>
                <a-col :span="24">
                  <a-input :value="item.value" placeholder="暂无参数值..." style="width: 234px" disabled />
                </a-col>
              </a-row>
            </div>
          </a-row>
        </div>

        <div class="content-title">
          <i></i>
          <span>相关文件</span>
          <EpcIcon
            v-if="twoRoundVersionBuilds && twoRoundVersionBuilds.length"
            @click="clickisShowVersionDialog"
            type="icon-banbenlishi"
            style="font-size: 12px; color: #0d53e2; width: 14px; height: 14px; margin-left: 5px" />
        </div>

        <div class="upload-file-wrap" v-if="relevantDataEnd.oldFileName">
          <div class="file-list">
            <EpcIcon type="icon-document-checked" style="display: flex; align-items: center; font-size: 40px; color: #0d53e2; margin: 19px 13px 20px 15px" />
            <div class="file-dec">
              <div class="tit">{{ relevantDataEnd.oldFileName }}</div>
              <div class="number">
                <span>编号：</span>
                <div class="hover-link" @click="linkClick(relevantDataEnd.fileUrl)">链接：{{ relevantDataEnd.fileUrl }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="textar-wrap">
          <div class="sub-title">文件描述：</div>
          <a-textarea class="textarea" disabled v-model:value="relevantStringEnds" :rows="4" placeholder="文件描述" />
        </div>
        <div class="content-title">
          <i></i>
          <span>模块清单</span>
        </div>

        <div style="margin: 0 20px 28px 16px; width: 97%; padding-bottom: 30px">
          <a-table
            style="margin-top: 5px"
            :pagination="false"
            row-key="id"
            :locale="locale"
            :columns="enInventoryColumnListEnd"
            :data-source="enInventoryDataEnd"
            :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'applicationType'">
                <div>
                  {{ record.applicationType == 0 ? '直接应用' : '变形设计' }}
                </div>
              </template>
              <template v-if="column.dataIndex === 'action'">
                <div>
                  <a @click="openModuleInfo(record)" type="primary">打开</a>
                  <a-divider type="vertical" />
                  <a @click="assembleModuleInfo(record)" type="primary">装配</a>
                  <a-divider type="vertical" />
                  <a @click="moduleDetails(record)" type="primary">详情</a>
                  <a-divider type="vertical" />
                  <a @click="applicationEdit(record)" type="primary">编辑应用</a>
                </div>
              </template>
            </template>
          </a-table>
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
                    <a-row v-if="item.columnProperties !== 1">
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
                      <a @click="previewPDF(record)" type="primary">预览</a>
                      <a @click="downloadPDF(record.id)" type="primary">下载</a>
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
      <!-- <a-button type="primary" @click="designOk()"> 确定 </a-button> -->
      <a-button type="primary" @click="enDesignModul = false"><EpcIcon type="icon-quxiao" style="font-size: 15px" />关闭</a-button>
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
  <!-- 编辑应用 -->
  <a-modal v-model:visible="applicationEditFlag" width="50%" title="编辑应用">
    <div style="width: 100%; background: #fff; margin-top: 4px">
      <section style="width: 100%; max-height: 400px; overflow-x: hidden; overflow-y: auto; background-color: #ffffff; padding-top: 20px; margin-left: 15px">
        <div>
          <a-table
            scrollbar-always-on
            stripe
            ref="supGbomRef"
            :data-source="bomInfoData"
            style="width: 100%"
            row-key="id"
            :locale="locale"
            default-expand-all
            :tree-props="{ children: 'children' }">
            <a-table-column data-index="equnr" title="模型结构树" align="left"></a-table-column>
            <a-table-column data-index="action" title="操作" align="left">
              <template #default="{ record }">
                <a-select v-model:value="record.action" @change="editMode($event, record)" allow-clear show-search style="width: 234px">
                  <a-select-option key="重新使用" value="重新使用">
                    {{ '重新使用' }}
                  </a-select-option>
                  <a-select-option key="手动命名" value="手动命名">
                    {{ '手动命名' }}
                  </a-select-option>
                  <a-select-option key="自动命名" value="自动命名">
                    {{ '自动命名' }}
                  </a-select-option>
                </a-select>
              </template>
            </a-table-column>
            <a-table-column data-index="moduleNewNum" title="新文件名称" align="left">
              <template #default="{ record }">
                <a-input v-model:value="record.moduleNewNum" :disabled="record.action !== '手动命名'" />
              </template>
            </a-table-column>
            <a-table-column data-index="descript" title="公用名称" align="left"> </a-table-column>
          </a-table>
        </div>
      </section>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <a-button type="primary" @click="openBomInfoData"> 打开 </a-button>
        <a-button @click="applicationEditFlag = false">取消</a-button>
      </span>
    </template>
  </a-modal>
</template>

<style lang="less" scoped>
@import '../../../../../assets/css/designFlow/designFlow.less';
@import '../../../../../sheets/collapse.less';
.box {
  width: 100%;
  height: calc(100vh - 80px);
  background: #fff;
  position: relative;
  /* 设置为滚动容器，position: sticky 在其子元素上生效 */
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

/* 固定顶部区域（设计计划定义） */
.top-block {
  position: sticky;
  top: 0; /* 若页面有全局 header，调整为 header 高度（例如 64px） */
  z-index: 50;
  color: #6b778c; /* 遮盖下方内容，保持视觉一致 */
  /* 保持原有内边距/布局，避免添加 box-shadow 以不改变视觉 */
}

/* 其余保持原样 */
</style>
