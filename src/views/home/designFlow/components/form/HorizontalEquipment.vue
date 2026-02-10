<!-- 平断面及其设备配置 -->
<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue';
import { message } from 'ant-design-vue';
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, FormOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';
import { DesignApiInfo } from '@/api/tags/design/产品设计';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
import { useUserStore } from '@/store/modules/user';
import { AdminApiSystemProduct } from '@/api/tags/product/产品平台后台';
import AddModuleTablevue from '../table/AddModuleTable.vue';
import type { TreeProps } from 'ant-design-vue';
import { filterTree } from '@/utils/tools';
const userStore = useUserStore();
const props = defineProps({
  taskInfoData: {
    require: false,
    type: Object,
    default: () => {},
  },
  taskId: {
    require: false,
    type: Number,
    default: () => '',
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
  saveBtnStatus: {
    require: false,
    type: Boolean,
    default: false,
  },
  isShowBottomBtns: {
    require: false,
    type: Boolean,
    default: false,
  },
  editBtnStatus: {
    require: false,
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['submitOkHorizontalEquipment', 'toUpload', 'submitOk', 'submitStatus']);
const defaultCheckProps = {
  children: 'children',
  label: 'title',
};
const fieldNames: TreeProps['fieldNames'] = {
  children: 'children',
  title: 'categoryName',
  key: 'id',
};
const TreeselectedKeys = ref<any>([]);
const newExpandedKeys = ref<any>([]);
const uploadPlaceData = ref<any>([]);
const equipmentUpload = ref<any>([]);
const moduleTree = ref<any>([]); //模块库数据
const temporaryTreeData = ref<any>([]); //模块库数据
const modulesEcho = ref<any>([]); //关联模块的回显
const dialogAddmodule = ref(false); //选择平断面库
const moduleFosArr = ref<any>([]); //关联模块回显的全部树
const moduleInfo = ref([]); //模块数据
const moduleParaListInfo = ref([]); // 模块表头数据
const selectedNodeId = ref(0); //高亮显示的id
const isCallBack = ref(false);
const searchValue = ref(''); //搜索模块树搜索值
const selectPNodeId = ref(0); //刚打开的父亲id
const moduleIds = ref([]); //模块关联选择id集合
const equipmentString = ref(null); // 车下设备布置描述

const getFlatCutDetail = () => {
  DesignApiInfo.getFlatCutDetailApi({
    taskId: props.taskId,
  }).then(function (res) {
    if (res.data.code == 0) {
      equipmentUpload.value = res.data.data.equipmentFile == null ? [] : res.data.data.equipmentFile;
      equipmentString.value = res.data.data.equipmentString;
      uploadPlaceData.value = res.data.data.flat;
    }
  });
};

//关联车辆平断面
const relevanceModule = () => {
  if (props.isEdit) {
    return;
  }
  nextTick(() => {
    getModulesEcho();
  });
};
// 获取模块回显
const getModulesEcho = () => {
  const obj: any = {};
  obj.taskId = props.taskId;
  DesignApiInfo.callBackApi(obj).then(function (res) {
    if (res.data.code == 0) {
      const { data } = res.data;
      const keys = Object.keys(data) || [];
      modulesEcho.value = res.data.data;
      getModuleTree(keys);
    } else {
      message.error(res.data.msg);
    }
  });
};
//递归查找树值
const findNodeById = (tree: any, targetId: any) => {
  if (tree.id === targetId) {
    return tree; // 找到目标节点，返回节点对象
  }

  if (tree.children && tree.children.length > 0) {
    for (const child of tree.children) {
      const foundNode = findNodeById(child, targetId); // 递归调用，查找子节点
      if (foundNode) {
        return foundNode; // 找到目标节点，返回节点对象
      }
    }
  }

  return null; // 未找到目标节点，返回null
};
// 获取模块列表导航树
const getModuleTree = (key: any) => {
  DesignApiInfo.getDelDataApi({}).then(function (res) {
    if (res.data.code == 0) {
      moduleTree.value = res.data.data || [];
      newExpandedKeys.value = [moduleTree.value[0].id];
      temporaryTreeData.value = res.data.data || [];
      let moduleFos = moduleTree.value.map((tree: any) => {
        return key.map((item: any) => findNodeById(tree, +item));
      });
      moduleFosArr.value = moduleFos.flat().filter((item: any) => item !== null);

      if (key[0]) {
        getModuleInfoList(key[0]);
        nextTick(() => {
          selectedNodeId.value = +key[0];
        });
      } else {
        getModuleInfoList(res.data.data[0].id);
        nextTick(() => {
          selectedNodeId.value = res.data.data[0].id;
        });
      }
      dialogAddmodule.value = isCallBack.value ? false : true;
      isCallBack.value = false;
    } else {
      message.error(res.data.msg);
    }
  });
};
//模块数据获取
const getModuleInfoList = (id: string) => {
  TreeselectedKeys.value = [];
  nextTick(() => {
    TreeselectedKeys.value = [Number(id)];
  });
  let data: any = {};
  data.userId = userStore.getUser.id;
  data.userName = userStore.getUser.userName;
  data.moduleParaList = [];
  data.categoryId = id;
  data.currentPage = 1;
  data.numberPage = 10000;
  AdminApiSystemProduct.findModelByCategoryId(data).then(function (res) {
    const data = res.data;
    if (data.code == 0) {
      const { moduleList, moduleParaList, currentPage, pageCount } = data.data;
      moduleInfo.value = moduleList || [];
      moduleParaListInfo.value = moduleParaList || [];
    } else {
      message.error(res.data.msg);
    }
  });
};
//模块树选择
const onSelect = (data: any, node: any) => {
  selectedNodeId.value = node.node.id;
  selectPNodeId.value = node.node.parentid;
  TreeselectedKeys.value = data;
  getModuleInfoList(node.node.id);
};

// 模块选择回掉函数
const handleModuleChange = (arr: any) => {
  moduleIds.value = arr;
};
// 编辑平断面库
const saveModules = () => {
  const data: any = {};
  data.ids = moduleIds.value;
  data.taskId = props.taskId;
  DesignApiInfo.addFlatCutApi(data).then(function (res) {
    if (res.data.code == 0) {
      message.success('选择成功');
      getFlatCutDetail();
      dialogAddmodule.value = false;
    } else {
      message.error(res.data.msg);
    }
  });
};
function detaDataUpload(row: any) {
  if (row.fileType == 1) {
    deleteImageCancelAss(delFun(row));
  } else {
    delFun(row);
  }
}
const delFun = (row: any) => {
  uploadPlaceData.value = uploadPlaceData.value.filter((item: any) => item.id !== row.id);
};
const deleteImageCancelAss = (callBack: any) => {
  const data: any = {};
  data.taskId = props.taskId;
  DesignApiInfo.deleteImageCancelAssApi(data).then(function (res) {
    if (res.data.code == 0) {
      if (callBack) {
        callBack();
      }
      relevanceModule();
      isCallBack.value = true;
    } else {
      message.error(res.data.msg);
    }
  });
};
function delEquipmentUpload(row: any) {
  equipmentUpload.value = equipmentUpload.value.filter((item: any) => item.id !== row.id);
}
function linkClick(url: string) {
  window.open(url);
}
function uploadPlaceDatafilelist(uploadSuccesscData: any) {
  uploadSuccesscData.forEach((item: any) => {
    item.fileType = 0;
  });
  if (uploadPlaceData.value != undefined && uploadPlaceData.value != null && uploadPlaceData.value.length > 0) {
    uploadPlaceData.value = uploadPlaceData.value.concat(uploadSuccesscData);
  } else {
    uploadPlaceData.value = uploadSuccesscData;
  }
}
function equipmentUploadDatafilelist(uploadSuccesscData: any) {
  if (equipmentUpload.value != null && equipmentUpload.value.length > 0) {
    equipmentUpload.value = equipmentUpload.value.concat(uploadSuccesscData);
  } else {
    equipmentUpload.value = uploadSuccesscData;
  }
}
function toUpload(type: string) {
  emit('toUpload', type);
}

// 保存
function submitOk(type: any) {
  emit('submitOkHorizontalEquipment', type, equipmentString.value, equipmentUpload.value, uploadPlaceData.value);
}
function submitStatus(num: any, operationType: any, nodeId?: any) {
  emit('submitStatus', num, operationType, nodeId);
}

watch(searchValue, value => {
  // 查询条件变更更改结构树
  if (value) {
    const condition = (node: any) => node?.categoryName.includes(value);
    moduleTree.value = filterTree(moduleTree.value, condition);
  } else {
    moduleTree.value = temporaryTreeData.value;
  }
});
defineExpose({ uploadPlaceDatafilelist, equipmentUploadDatafilelist, getFlatCutDetail });
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
              <div class="tm">任务时间：{{ taskInfoData.startTime }} ~ {{ taskInfoData.endTime }}</div>
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
          <span>平断面及设备布置</span>
        </div>

        <div class="upload-layout">
          <div class="sub-title">车辆平断面：</div>
          <div class="upload-btn-wrap">
            <div class="upload-btn" :disabled="isEdit" @click="relevanceModule" :style="{ cursor: isEdit ? 'not-allowed' : 'pointer', background: isEdit ? '#f5f5f5' : '' }">
              <EpcIcon type="icon-liulan" style="color: #1a71ff; font-size: 20px; position: absolute; left: 35px; top: 20px" />
              <div>浏览库文件</div>
            </div>
            <div class="upload-btn" :disabled="isEdit" @click="toUpload('车辆平断面')" :style="{ cursor: isEdit ? 'not-allowed' : 'pointer', background: isEdit ? '#f5f5f5' : '' }">
              <EpcIcon type="icon-shangchuanwenjian1" style="color: #1a71ff; font-size: 20px; position: absolute; left: 35px; top: 20px" />
              <div>上传文件</div>
            </div>
            <div class="upload-dec">
              <div>文件要求</div>
              <p>格式：支持格式PDF、Word文档（DOCX）、CAD文件</p>
              <p>文件大小限制：对单个文件大小有限制，每个文档不超过100M</p>
            </div>
          </div>
        </div>

        <div class="upload-file-wrap">
          <div v-for="(item, index) in uploadPlaceData" :key="index">
            <div class="file-list" v-if="item.url">
              <EpcIcon type="icon-document-checked" style="display: flex; align-items: center; font-size: 40px; color: #0d53e2; margin: 19px 13px 20px 15px" />
              <div class="file-dec">
                <div class="tit">{{ item.originalFilename }}</div>
                <div class="number">
                  <span>编号：{{ item.docNumber }}</span>
                  <div class="hover-link" @click="linkClick(item.url)">链接：{{ item.url }}</div>
                </div>
                <a-button class="elbutton" :disabled="isEdit" @click="detaDataUpload(item)">
                  <EpcIcon type="icon-shanchu2" style="font-size: 15px" />
                </a-button>
              </div>
            </div>
          </div>
        </div>

        <div class="upload-layout">
          <div class="sub-title">车辆车下设备布置：</div>
          <div class="upload-btn-wrap">
            <div
              class="upload-btn"
              :disabled="isEdit"
              @click="toUpload('车下设备布置')"
              :style="{ cursor: isEdit ? 'not-allowed' : 'pointer', background: isEdit ? '#f5f5f5' : '' }">
              <EpcIcon type="icon-shangchuanwenjian1" style="color: #1a71ff; font-size: 20px; position: absolute; left: 35px; top: 20px" />
              <div>上传文件</div>
            </div>
            <div class="upload-dec">
              <div>文件要求</div>
              <p>格式：支持格式PDF、Word文档（DOCX）、CAD文件</p>
              <p>文件大小限制：对单个文件大小有限制，每个文档不超过100M</p>
            </div>
          </div>
        </div>

        <div class="upload-file-wrap">
          <div v-for="(item, index) in equipmentUpload" :key="index">
            <div class="file-list" v-if="item.url">
              <EpcIcon type="icon-document-checked" style="display: flex; align-items: center; font-size: 40px; color: #0d53e2; margin: 19px 13px 20px 15px" />
              <div class="file-dec">
                <div class="tit">{{ item.originalFilename }}</div>
                <div class="number">
                  <span>编号：{{ item.docNumber }}</span>
                  <div class="hover-link" @click="linkClick(item.url)">链接：{{ item.url }}</div>
                </div>
                <a-button class="elbutton" v-if="item.docNumber" :disabled="isEdit" @click="delEquipmentUpload(item)">
                  <EpcIcon type="icon-shanchu2" style="font-size: 15px" />
                </a-button>
              </div>
            </div>
          </div>
        </div>
        <div class="textar-wrap">
          <div class="sub-title">设备布置描述：</div>
          <a-textarea :disabled="isEdit" v-model:value="equipmentString" :rows="4" placeholder="车下设备布置描述" />
        </div>
        <div class="foot-btn">
          <div class="backBtn" v-if="isShowBottomBtns">
            <a-button @click="submitOk(4)" type="primary" :disabled="saveBtnStatus">
              <EpcIcon type="icon-baocun" style="font-size: 15px" />
              保存</a-button
            >
            <a-button class="btn_left" type="primary" @click="submitStatus(4, 1, selectedKeys)" :disabled="commitBtnStatus">
              <EpcIcon type="icon-tijiaoqueren" style="font-size: 12px" />
              提交</a-button
            >
            <a-button class="btn_left" @click="submitStatus(4, 0)" type="primary" :disabled="editBtnStatus">
              <EpcIcon type="icon-edit" style="font-size: 15px" />
              编辑</a-button
            >
          </div>
        </div>
      </a-row>
    </div>
  </div>
  <!-- 选择平断面 -->
  <a-modal style="width: 1400px" v-model:visible="dialogAddmodule" title="车辆平断面选择">
    <div style="width: 100%; background: #fff; margin-top: 4px" v-if="dialogAddmodule">
      <section style="width: 100%; height: 400px; background-color: #ffffff; overflow: auto">
        <div style="width: 100%; height: 100%">
          <a-row class="tac">
            <a-col :span="4" style="margin-right: 30px">
              <div class="libray-content">
                <a-input-search v-model:value="searchValue" placeholder="搜索节点" />
                <a-directory-tree
                  v-model:selected-keys="TreeselectedKeys"
                  :show-icon="true"
                  default-expand-all
                  style="width: 100%; overflow-y: auto; margin-top: 10px"
                  :tree-data="moduleTree"
                  :expand-action="false"
                  :field-names="fieldNames"
                  @select="onSelect">
                  <template #title="{ categoryName }">
                    <span v-if="categoryName.indexOf(searchValue) > -1">
                      {{ categoryName.substr(0, categoryName.indexOf(searchValue)) }}
                      <span style="color: #f50">{{ searchValue }}</span>
                      {{ categoryName.substr(categoryName.indexOf(searchValue) + searchValue.length) }}
                    </span>
                    <span v-else>{{ categoryName }}</span>
                  </template>
                </a-directory-tree>
              </div>
            </a-col>

            <a-col :span="18">
              <div class="libray-content">
                <a-row class="tac" style="font-size: 16px; height: 40px; line-height: 40px" v-if="moduleFosArr.length">
                  <a-col :span="24">
                    已关联模块节点：
                    <span v-for="item in moduleFosArr" :key="item.id">{{ item.categoryName }} &nbsp; &nbsp;</span>
                  </a-col>
                </a-row>
                <AddModuleTablevue
                  :tableData="moduleInfo"
                  :selectedNodeId="selectedNodeId"
                  :selectPNodeId="selectPNodeId"
                  :moduleParaListInfo="moduleParaListInfo"
                  :relevanceObj="relevanceObj"
                  :modulesEcho="modulesEcho"
                  paramet="gbom"
                  @handleModuleChange="handleModuleChange" />
              </div>
            </a-col>
          </a-row>
        </div>
      </section>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <a-button type="primary" @click="saveModules()"> 确定 </a-button>
        <a-button @click="dialogAddmodule = false">取消</a-button>
      </span>
    </template>
  </a-modal>
</template>

<style lang="less" scoped>
@import '../../../../../assets/css/designFlow/designFlow.less';
.box {
  width: 100%;
  height: calc(100vh - 80px);
  background: #fff;
  position: relative;
  /* 使 .box 成为滚动容器，sticky 在其子元素上生效 */
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

/* 固定顶部区域：平断面及设备布置 上部信息保持可见 */
.top-block {
  position: sticky;
  top: 0; /* 若有全局 header，按 header 高度调整（如 top: 64px） */
  z-index: 50;
  color: #6b778c; /* 遮盖下方内容，保持原视觉 */
}

:deep(.ant-tree-treenode-selected:before) {
  background: #6aa1ff !important;
}
</style>
