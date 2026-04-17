<template>
  <div class="layout flex flex-col h-full">
    <div class="title">
      <div class="titleText">创建知识地图</div>
    </div>
    <div class="main flex-1 h-0">
      <!-- 左边儿地图 -->
      <div class="mainCenter wei-scrollbar">
        <div v-if="imgPath.id === 1 || templateId == 1" class="totalFirst mb-[16px]">
          <div class="mainCenterTop" v-if="imgPath.id === 1 || templateId == 1">
            <img v-if="imgPath.fileUrl" class="mainCenterTopImg" :src="imgPath.fileUrl" alt="" />
            <img v-else class="mainCenterTopImg" :src="templateUrl" alt="" />
            <div v-if="imgPath.id === 1 || templateId == 1" class="mainCenterTopTitle">{{ secongData.name }}</div>
            <div v-if="imgPath.id === 1 || templateId == 1" class="mainCenterTopQuery">{{ secongData.queryObj }}</div>
            <div v-if="imgPath.id === 1 || templateId == 1" class="mainCenterTopTotal">
              <div class="mainCenterTopSide" v-for="item in secongData.nodeList" :key="item.id">
                <div :class="item.color === true ? 'fontColor' : 'mainCenterTopSideText'" @click="getFileInfo(item)">{{
                  item.nodeName }}</div>
              </div>
            </div>
            <div v-if="imgPath.id === 1 || templateId == 1">
              <div v-for="data in detailData" :key="data.id">
                <div v-if="data.location === 1">
                  <img class="imagesModal1" src="@/assets/images/modal3.png" alt="" />
                  <a-tooltip :mouseEnterDelay="0.5" :title="data.nodeName" placement="top">
                    <div class="mainCenterTopFile1" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
                <div v-if="data.location === 2">
                  <img class="imagesModal2" src="@/assets/images/modal3.png" alt="" />
                  <a-tooltip :mouseEnterDelay="0.5" :title="data.nodeName" placement="top">
                    <div class="mainCenterTopFile2" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
                <div v-if="data.location === 3">
                  <img class="imagesModal3" src="@/assets/images/modal3.png" alt="" />
                  <a-tooltip :mouseEnterDelay="0.5" :title="data.nodeName" placement="top">
                    <div class="mainCenterTopFile3" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
                <div v-if="data.location === 4">
                  <img class="imagesModal4" src="@/assets/images/modal3.png" alt="" />
                  <a-tooltip :mouseEnterDelay="0.5" :title="data.nodeName" placement="top">
                    <div class="mainCenterTopFile4" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
                <div v-if="data.location === 5">
                  <img class="imagesModal5" src="@/assets/images/modal3.png" alt="" />
                  <a-tooltip :mouseEnterDelay="0.5" :title="data.nodeName" placement="top">
                    <div class="mainCenterTopFile5" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
                <div v-if="data.location === 6">
                  <img class="imagesModal6" src="@/assets/images/modal3.png" alt="" />
                  <a-tooltip :mouseEnterDelay="0.5" :title="data.nodeName" placement="top">
                    <div class="mainCenterTopFile6" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
                <div v-if="data.location === 7">
                  <img class="imagesModal7" src="@/assets/images/modal3.png" alt="" />
                  <a-tooltip :mouseEnterDelay="0.5" :title="data.nodeName" placement="top">
                    <div class="mainCenterTopFile7" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
                <div v-if="data.location === 8">
                  <img class="imagesModal8" src="@/assets/images/modal3.png" alt="" />
                  <a-tooltip :mouseEnterDelay="0.5" :title="data.nodeName" placement="top">
                    <div class="mainCenterTopFile8" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
                <div v-if="data.location === 9">
                  <img class="imagesModal9" src="@/assets/images/modal3.png" alt="" />
                  <a-tooltip :mouseEnterDelay="0.5" :title="data.nodeName" placement="top">
                    <div class="mainCenterTopFile9" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
                <div v-if="data.location === 10">
                  <img class="imagesModal10" src="@/assets/images/modal3.png" alt="" />
                  <a-tooltip :mouseEnterDelay="0.5" :title="data.nodeName" placement="top">
                    <div class="mainCenterTopFile10" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="imgPath.id === 2 || templateId == 2" class="totalSecond mb-[16px]">
          <div class="mainCenterTop8" v-if="imgPath.id === 2 || templateId == 2">
            <img class="mainCenterTopImg8" v-if="imgPath.fileUrl" :src="imgPath.fileUrl" alt="" />
            <img class="mainCenterTopImg8" v-else :src="templateUrl" alt="" />
            <div v-if="imgPath.id === 2 || templateId == 2" class="mainCenterTopTitle8">{{ secongData.name }}</div>
            <div v-if="imgPath.id === 2 || templateId == 2" class="mainCenterTopQuery8" :content="secongData.queryObj">
              {{ secongData.queryObj }}</div>
            <div v-if="imgPath.id === 2 || templateId == 2" class="mainCenterTopTotal8">
              <div class="mainCenterTopSide8" v-for="item in secongData.nodeList" :key="item.id">
                <div :class="item.color === true ? 'fontColor' : 'mainCenterTopSideText8'" @click="getFileInfo(item)"
                  :content="item.nodeName">{{ item.nodeName }}</div>
              </div>
            </div>
            <div v-if="imgPath.id === 2 || templateId == 2">
              <div v-for="data in detailData" :key="data.id">
                <div v-if="data.location === 1">
                  <a-tooltip :mouseEnterDelay="0.5" :title="data.nodeName" placement="top">
                    <div class="mainCenterTopFile18" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
                <div v-if="data.location === 2">
                  <a-tooltip :mouseEnterDelay="0.5" :title="data.nodeName" placement="top">
                    <div class="mainCenterTopFile28" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
                <div v-if="data.location === 3">
                  <a-tooltip :mouseEnterDelay="0.5" :title="data.nodeName" placement="top">
                    <div class="mainCenterTopFile38" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
                <div v-if="data.location === 4">
                  <a-tooltip :mouseEnterDelay="0.5" :title="data.nodeName" placement="top">
                    <div class="mainCenterTopFile48" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
                <div v-if="data.location === 5">
                  <a-tooltip :mouseEnterDelay="0.5" :title="data.nodeName" placement="top">
                    <div class="mainCenterTopFile58" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
                <div v-if="data.location === 6">
                  <a-tooltip :mouseEnterDelay="0.5" :title="data.nodeName" placement="top">
                    <div class="mainCenterTopFile68" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
                <div v-if="data.location === 7">
                  <a-tooltip :mouseEnterDelay="0.5" :title="data.nodeName" placement="top">
                    <div class="mainCenterTopFile78" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
                <div v-if="data.location === 8">
                  <a-tooltip :mouseEnterDelay="0.5" :title="data.nodeName" placement="top">
                    <div class="mainCenterTopFile88" @click="viewPdfFun(data)">{{ data.nodeName }}</div>
                  </a-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mainCenterBot">
          <div class="mainCenterBotText">知识地图模板</div>
          <div style="display: flex">
            <div v-for="(item, index) in templateData" :key="item.id" style="margin: 0 20px 20px 0">
              <img class="mainCenterBotImg" :src="item.fileUrl" alt="" @click="getImgInfo(item)" />
            </div>
          </div>
        </div>
      </div>
      <!-- <div> -->
      <!-- 右侧边栏 -->
      <div class="mainLefts">
        <a-tabs v-model:activeKey="activeName" class="mainRight" @change="handleTabChange">
          <a-tab-pane tab="地图信息" key="first">
            <div class="first h-full flex flex-col">
              <div class="flex-1 overflow-y-auto overflow-x-hidden wei-scrollbar">
                <a-form :model="ruleForm" :rules="rules" layout="vertical" :colon="true">
                  <a-form-item label="地图名称" name="mapName">
                    <a-input v-model:value="ruleForm.mapName" placeholder="请输入地图名称" />
                  </a-form-item>
                  <a-form-item label="查阅对象" name="search">
                    <a-input v-model:value="ruleForm.search" placeholder="请输入查询对象" :maxlength="6" :showCount="true" />
                  </a-form-item>
                  <!-- <el-form-item label="创建者">
                  <el-input v-model="creator" disabled />
                </el-form-item> -->
                  <a-form-item label="OU属性" style="position: relative;display: none;">
                    <a-input :value="checkOUListText" disabled />
                    <span class="elBtn" @click="chooseOUFun">浏览</span>
                  </a-form-item>
                  <a-form-item label="密级">
                    <a-select class="elInput" v-model:value="ruleForm.confidentialLevel" placeholder="请选择密级">
                      <a-select-option :value="item.value" v-for="item in confidentialLevelList" :key="item.value">{{
                        item.label
                        }}</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item label="摘要">
                    <a-textarea v-model:value="abstract" placeholder="请填写摘要" />
                  </a-form-item>
                </a-form>
                <a-button class="uploadBtn" @click="uploadFile">
                  <img v-if="fileInfoList.fileUrl" class="uploadimg " :src="fileInfoList.fileUrl" alt="" />
                  <img v-else-if="fileEditUrl" class="uploadimg" :src="fileEditUrl" alt="" />
                  <div v-else>
                    <img class="uploadimgs" src="@/assets/images/Frame.png" alt="" />
                    <div class="font-[14px] text-primary">
                      上传封面</div>
                  </div>
                </a-button>

                <div style="margin: 16px 0">创建者: {{ creator }}</div>
              </div>
              <div class="flex justify-between w-full">
                <a-button @click="goBack" class="back" type="primary">返回</a-button>
                <div>
                  <a-button @click="Staging" class="back" type="primary">暂存</a-button>
                  <a-button style="margin-left: 12px" @click="saveData" class="back" type="primary">提交</a-button>
                </div>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane tab="地图内容" key="second">
            <div class="secondTop">
              <div class="iconfont" @click="addTreeFun">
                <PlusCircleOutlined class="icon" />
                <!-- <span>添加</span> -->
              </div>
              <div class="iconfont" @click="editTreeFun">
                <EditOutlined class="icon" />
                <!-- <span>编辑</span> -->
              </div>
              <div class="iconfont" @click="upTreeFun">
                <ArrowUpOutlined class="icon" />
              </div>
              <div class="iconfont" @click="downTreeFun">
                <ArrowDownOutlined class="icon" />
              </div>
              <div class="iconfont" @click="deleteTreeFun">
                <DeleteOutlined class="icon" />
                <!-- <span>删除</span> -->
              </div>
              <div class="iconfont" @click="openFileFun">
                <FileTextOutlined class="icon" />
                <!-- <span>附件</span> -->
              </div>
            </div>
            <div class="treeData" v-if="treeMapData.length > 0">
              <a-tree ref="treeMapRef" :selectedKeys="selectedTreeKeys" show-icon defaultExpandAll
                :tree-data="treeMapData" :fieldNames="treeFieldNames" @select="handleTreeSelect">
                <template #icon="data">
                  <WeiIcon :icon="getTreeIconType(data)" :size="14" />
                </template>
              </a-tree>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <div class="wrap" v-dragModal>
      <a-modal :getContainer="customGetContainer" v-model:visible="OUDialogVisible" :maskClosable="false" :width="500"
        title="OU属性" @cancel="closeOUDialogFun">
        <a-checkbox v-model:checked="checkAllOU" :indeterminate="isIndeterminate"
          @change="handleCheckAllChange">电装集团</a-checkbox>
        <div class="mt-[16px]">
          <a-checkbox-group v-model:value="checkOUList" @change="handleCheckedCitiesChange">
            <a-checkbox v-for="item in OUData" :key="item.id" :value="item.name">{{ item.name }}</a-checkbox>
          </a-checkbox-group>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <a-button type="primary" @click="closeOUDialogFun">确定</a-button>
            <a-button @click="closeOUDialogFun">取消</a-button>
          </span>
        </template>
      </a-modal>
    </div>
    <draggable-modal v-model:visible="dialogAddEdit" :maskClosable="false" :width="500" :title="title"
      @cancel="dialogCancel" draggable>
      <a-form :model="ruleForm" :rules="rules" :labelCol="{ style: { width: '100px' } }" :colon="true">
        <a-form-item label="父项名称">
          <a-input v-model:value="parentName" disabled />
        </a-form-item>
        <a-form-item label="标签类型">
          <a-input v-model:value="labelType" disabled />
        </a-form-item>
        <a-form-item label="分类名称" name="classifyName">
          <a-input v-model:value="ruleForm.classifyName" />
        </a-form-item>
      </a-form>
      <template #footer>
        <div class="dialog-footer">
          <a-button type="primary" @click="dialogConfirm">确认</a-button>
          <a-button @click="dialogCancel">取消</a-button>
        </div>
      </template>
    </draggable-modal>
    <center-search :addDataDialogVisible="addDataDialogVisible" @closeCenterDia="addDataDialogVisible = false"
      @handleSuccess="handleSuccess" :nodeId="clickNodeObj.id" />
    <upload-modal :modalVisible="showUpload" @importSuccess="hiddenUpload" @onClose="showUpload = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onActivated, onMounted, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { message, Modal } from 'ant-design-vue';
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, EditOutlined, FileTextOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';
import {
  OuList,
  stagSave,
  queryTemplate,
  taskMapList,
  taskMapRemoveTree,
  taskMapSaveTree,
  saveTreeData,
  queryMapNodeList,
  queryMapTaskDetail,
  getPdfPreviewPath,
  submitMap,
  mapTreeSort,
  updateKldCounting,
} from '@/api/knowledge';
import { useUserStore } from '@/store/modules/user';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { modifyInitMap } from '@/api/knowledge';
import draggableModal from '@/components/DraggableModal/index.vue';
import uploadModal from './components/upload-modal.vue'
import { WeiIcon } from '@/wei-components';
import centerSearch from './components/centerSearch.vue'

const router = useRouter();
const route = useRoute();

const showUpload = ref<boolean>(false);

const clickId = ref<any>({});

const addDataDialogVisible = ref<boolean>(false);

// OU属性标签
const checkOUList = ref<string[]>(['新变厂', '衡变公司', '沈变公司']);

// OU属性弹窗
const OUDialogVisible = ref<boolean>(false);

const isIndeterminate = ref<boolean>(true);
const checkAllOU = ref<boolean>(false);

const dialogAddEdit = ref<boolean>(false);

const title = ref<string>('');

// 标签属性选中得id
const selectId = ref<any[]>([]);

// OU属性所有值
const OUData = ref<any[]>([]);

// 选中标签名称
const selectedName = ref<any[]>([]);

// 选中OU属性的值
const selectedOU = ref<any[]>([]);

const activeName = ref<string>('first');

const imgPath = ref<any>({});

const imgArr = ref<any[]>([
  {
    url: 'modal1.png',
  },
  {
    url: 'modal2.png',
  },
]);

const treeMapData = ref<any[]>([]);

const parentNode = ref<any>({});

const clickNodeObj = ref<any>({});

const defaultProps = {
  children: 'children',
  label: 'nodeName',
};
const treeFieldNames = { children: 'children', title: 'nodeName', key: 'id' };
const selectedTreeKeys = ref<string[]>([]);

const checkOUListText = computed(() => {
  return Array.isArray(checkOUList.value) ? checkOUList.value.join(',') : (checkOUList.value || '');
});

const confidentialLevelList = computed(() => useUserStore().getConfidentialLevel.map((item: any) => ({ ...item, value: String(item.value) })))

const ruleForm = ref({
  mapName: '',
  search: '',
  classifyName: '',
  confidentialLevel: null,
});

// 创建者
const creator = ref<string>(useUserStore().getUser.userName);
// ou属性
const OUProperty = ref<any>();
// 摘要
const abstract = ref<string>('');

const taskMapIdFlag = ref<string | number>('');

const rules = reactive({
  mapName: [{ required: true, message: '请输入地图名称', trigger: 'blur' }],
  search: [{ required: true, message: '请输入查询对象', trigger: 'blur' }],
  classifyName: [{ required: true, message: '分类名称', trigger: 'blur' }],
  confidentialLevel: [{ required: true, message: '请选择密级', trigger: 'blur' }],
});

// 弹窗
const parentName = ref<string>('');
const labelType = ref<string>('分类节点');

// 模板数据
const templateData = ref<any[]>([]);

// 标识
const numberFlag = ref<number>(0);

// 地图内容的三级节点
const thirdData = ref<any[]>([]);

// 地图内容的2级节点
const secongData = ref<any>({});

// 文件路径
const filePath = ref<string>('');

// 编辑的图片路径
const fileEditUrl = ref<string>('');

// 编辑当前数据的id
const currentEditId = ref<string | number>('');

// 模板数据
const templateUrl = ref<string>('');

// 模板数据
const templateId = ref<string | number>('');

// 详情数据
const detailData = ref<any[]>([]);
const fileInfoList = ref<any>({});

const mapEditList = ref<any>({});

onMounted(() => {
  if (route.query.id) getMapInfoData();
  getId();
  getOUList();
});

function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.wrap');
}
const getMapInfoData = async () => {
  try {
    const res = await modifyInitMap({ id: route.query.id as string });
    if (res.data.code === '0') {
      mapEditList.value = res.data.data;
      ruleForm.value.mapName = mapEditList.value.name;
      ruleForm.value.search = mapEditList.value.queryObj;
      ruleForm.value.confidentialLevel = mapEditList.value.confidentialLevel
      creator.value = mapEditList.value.createUserName;
      abstract.value = mapEditList.value.summary;
      fileEditUrl.value = mapEditList.value.coverFileUrl;
      taskMapIdFlag.value = mapEditList.value.id;
      currentEditId.value = mapEditList.value.id;
      templateUrl.value = mapEditList.value.templateUrl;
      templateId.value = mapEditList.value.templateId;
    }
  } catch (error) {
    console.log('error:', error);
  }
};

const getDataList = async () => {
  const params = {
    // taskMapId: 7,
    taskMapId: taskMapIdFlag.value || '',
  };
  try {
    const res = await queryMapNodeList(params);
    if (res && res.data.code === '0') {
      secongData.value = {};
      secongData.value = res.data.data;
      getFileInfo();
    } else {
      message.error(res.data.msg);
    }
  } catch (error) {
    console.error(error);
  }
};

// 初始化数据
const getId = async () => {
  try {
    const res = await queryTemplate({});
    if (res && res.data.code === '0') {
      templateData.value = [];
      templateData.value = res.data.data;
    } else {
      message.error(res.data.msg);
    }
  } catch (error) {
    console.error(error);
  }
};

// 获取图上的数据
const getFileInfo = async (data?: any) => {
  const params = {
    id: data?.nodeId ? data?.nodeId : secongData.value.nodeList?.[0]?.nodeId,
    taskMapId: taskMapIdFlag.value || '',
    type: '2',
    userId: useUserStore().getUser.id,
  };
  if (!params.id) return;
  try {
    const res = await queryMapTaskDetail(params);
    if (res && res.data.code === '0') {
      detailData.value = [];
      detailData.value = res.data.data.result;
    } else {
      message.error(res.data.msg);
    }

    if (secongData.value.nodeList) {
      secongData.value.nodeList.forEach((v: any) => {
        if (data?.nodeId) {
          if (v.nodeId === data?.nodeId) {
            v.color = true;
          } else {
            v.color = false;
          }
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
};

const handleTabChange = (key: string) => {
  if (key === 'second') {
    getTreeList();
  }
  if (taskMapIdFlag.value) {
    getDataList();
  }
};

// 数据树列表
const getTreeList = async () => {
  const params = {
    // taskMapId: 7,
    taskMapId: taskMapIdFlag.value || '',
    userId: useUserStore().getUser.id,
  };
  try {
    const res = await taskMapList(params);
    if (res && res.data.code === '0') {
      treeMapData.value = [];
      treeMapData.value = res.data.data;
    } else {
      message.error(res.data.msg);
    }
  } catch (error) {
    console.error(error);
  }
};

// 暂存
const Staging = async () => {
  const params = {
    id: currentEditId.value || '',
    templateId: imgPath.value.id || (templateData.value.length ? templateData.value[0].id : ''),
    userId: useUserStore().getUser.id,
    name: ruleForm.value.mapName,
    confidentialLevel: ruleForm.value.confidentialLevel,
    queryObj: ruleForm.value.search,
    oU1Id: selectedName.value[0]?.value ? selectedName.value[0]?.value : '',
    oU1Name: selectedName.value[0]?.name ? selectedName.value[0]?.name : '',
    oU2Id: selectedName.value[1]?.value ? selectedName.value[1]?.value : '',
    oU2Name: selectedName.value[1]?.name ? selectedName.value[1]?.name : '',
    oU3Id: selectedName.value[2]?.value ? selectedName.value[2]?.value : '',
    oU3Name: selectedName.value[2]?.name ? selectedName.value[2]?.name : '',
    summary: abstract.value,
    coverFileId: fileInfoList.value.id,
    coverFileUrl: fileInfoList.value.fileUrl,
    taskMapId: taskMapIdFlag.value || '',
  };
  try {
    const res = await stagSave(params);
    if (res && res.data.code === '0') {
      taskMapIdFlag.value = res.data.data.taskMapId;
      activeName.value = 'second';
      getTreeList();
      getDataList();
    } else {
      message.error(res.data.msg);
    }
  } catch (error) {
    console.error(error);
  }
};

// 节点点击
const handleNodeClick = (node: any) => {
  console.log(node, 'clickNode');
  clickNodeObj.value = node;
  treeMapData.value.forEach((v: any) => {
    if (v.id === node.parentId) {
      parentNode.value = v;
    } else {
      if (v.children && v.children.length > 0) {
        v.children.forEach((k: any) => {
          if (k.id === node.parentId) {
            parentNode.value = k;
          }
        });
      }
    }
  });
  if (node.nodeLevel === 2) {
    thirdData.value = [];
    thirdData.value = node.children || [];
  }
};

const handleTreeSelect = (selectedKeys: string[], info: any) => {
  selectedTreeKeys.value = selectedKeys;
  const node = info?.node?.dataRef || info?.node;
  if (node) handleNodeClick(node);
};

// 查看pdf (fix naming to match template)
const viewPdfFun = async (item: any) => {
  const params = {
    id: item.fileId,
  };
  try {
    updateKldCounting({ kldFileId: item.id, countingType: 1 });
    const res = await getPdfPreviewPath(params);
    if (res && res.status === 200) {
      filePath.value = res.data.fileUrl;
      router.push({ path: '/knowledge/pdfView', query: { docId: filePath.value } });
    } else {
      message.error(res.data.msg);
      router.push({ path: '/knowledge/pdfView', query: { docId: item.fileUrl, filePath: filePath.value } });
    }
  } catch (error) {
    console.error(error);
  }
};

const getTreeIconType = (data: any) => {
  if (data?.nodeLevel === 1) return 'icon-wjj';
  if (data?.nodeLevel === 2) return 'icon-wj';
  return 'icon-wj';
};

const addTreeFun = () => {
  if (clickNodeObj.value.nodeLevel === 2) {
    message.warning('已是最后节点，请添加数据！');
    return;
  }
  if (clickNodeObj.value.nodeLevel === 3) {
    message.warning('文件不能操作！');
    return;
  }
  if (!clickNodeObj.value.id) {
    message.error('请选择要编辑的节点！');
    return;
  }
  title.value = '添加数据';
  dialogAddEdit.value = true;
  parentName.value = parentNode.value.nodeName || clickNodeObj.value.nodeName;
  ruleForm.value.classifyName = '';
};

const editTreeFun = () => {
  if (clickNodeObj.value.nodeLevel === 1) {
    message.warning('最顶层的节点不可编辑！');
    return;
  }
  if (clickNodeObj.value.nodeLevel === 3) {
    message.warning('文件不能操作！');
    return;
  }
  if (!clickNodeObj.value.id) {
    message.error('请选择要添加的节点！');
    return;
  }
  title.value = '编辑数据';
  dialogAddEdit.value = true;
  parentName.value = parentNode.value.nodeName || '';
  ruleForm.value.classifyName = clickNodeObj.value.nodeName;
};

const upTreeFun = async () => {
  console.log('向上');
  if (!clickNodeObj.value.id) {
    message.error('请先选择节点！');
    return;
  }
  if (clickNodeObj.value.nodeLevel === 2 || clickNodeObj.value.nodeLevel === 1) {
    message.error('文件夹不可移动！');
    return;
  }
  const params = {
    nodeId: clickNodeObj.value.id,
    type: '0',
  };
  try {
    const res = await mapTreeSort(params);
    if (res && res.data.code === '0') {
      console.log(res.data);
      getDataList();
      getTreeList();
    } else {
      message.error(res.data.msg);
    }
  } catch (error) {
    console.error(error);
  }
};
const downTreeFun = async () => {
  console.log('向下');
  if (!clickNodeObj.value.id) {
    message.error('请先选择节点！');
    return;
  }
  if (clickNodeObj.value.nodeLevel === 2 || clickNodeObj.value.nodeLevel === 1) {
    message.error('文件夹不可移动！');
    return;
  }
  const params = {
    nodeId: clickNodeObj.value.id,
    type: '1',
  };
  try {
    const res = await mapTreeSort(params);
    if (res && res.data.code === '0') {
      console.log(res.data);
      getDataList();
      getTreeList();
    } else {
      message.error(res.data.msg);
    }
  } catch (error) {
    console.error(error);
  }
};

const deleteTreeFun = () => {
  if (!clickNodeObj.value.id) {
    message.error('请选择要删除的节点！');
    return;
  }
  Modal.confirm({
    title: '',
    content: '确定要删除?',
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      const params = {
        id: clickNodeObj.value.id,
        taskMapId: taskMapIdFlag.value || '',
        userId: useUserStore().getUser.id,
      };
      try {
        const res = await taskMapRemoveTree(params);
        if (res && res.data.code === '0') {
          getTreeList();
          getFileInfo();
          getDataList();
          message.success('删除成功');
          return;
        } else {
          message.error(res.data.msg);
        }
      } catch (error) {
        console.error(error);
      }
    },
    onCancel() {
      message.info('取消删除');
    },
  });
  // delete interface
};

// 附件
const openFileFun = () => {
  if (!clickNodeObj.value.id) {
    message.error('请选择节点！');
    return;
  }
  if (clickNodeObj.value.nodeLevel === 3) {
    message.warning('文件不能操作！');
    return;
  }
  if (clickNodeObj.value.nodeLevel === 1) {
    message.warning('顶级节点不能添加数据！');
    return;
  }
  numberFlag.value = 1;
  addDataDialogVisible.value = true;
};

// 获取三级节点的数据
const getThirdData = async () => {
  const params = {
    id: clickNodeObj.value.id,
    taskMapId: taskMapIdFlag.value || '',
    userId: useUserStore().getUser.id,
    // batch: centerDataList.value,
  };
  try {
    const res = await saveTreeData(params);
    if (res && res.data.code === '0') {
      getTreeList();
      getFileInfo();
      message.success(res.data.msg);
    } else {
      message.error(res.data.msg);
    }
  } catch (error) {
    console.error(error);
  }
};

// 弹窗添加和编辑的保存
const dialogConfirm = async () => {
  dialogAddEdit.value = false;
  let params: any;
  if (title.value === '添加数据') {
    params = {
      id: '',
      parentId: clickNodeObj.value.id,
      taskMapId: taskMapIdFlag.value || '',
      userId: useUserStore().getUser.id,
      nodeName: ruleForm.value.classifyName,
    };
  } else {
    params = {
      id: clickNodeObj.value.id,
      parentId: clickNodeObj.value.parentId,
      taskMapId: taskMapIdFlag.value || '',
      userId: useUserStore().getUser.id,
      nodeName: ruleForm.value.classifyName,
    };
  }
  try {
    const res = await taskMapSaveTree(params);
    if (res && res.data.code === '0') {
      ruleForm.value.classifyName = '';
      getTreeList();
      message.success(res.data.msg);
      getDataList();
    } else {
      message.error(res.data.msg);
    }
  } catch (error) {
    console.error(error);
  }
};

const dialogCancel = () => {
  dialogAddEdit.value = false;
};

const getImgInfo = (val: any) => {
  console.log(templateUrl.value, 'templateUrl.value');
  console.log(val, 'valvalvla');
  if (templateUrl.value) {
    templateUrl.value = templateUrl.value;
  } else {
    imgPath.value = val;
  }
};

const goBack = () => {
  ruleForm.value.mapName = '';
  ruleForm.value.search = '';
  ruleForm.value.confidentialLevel = null;
  abstract.value = '';
  treeMapData.value = [];
  activeName.value = 'first';
  secongData.value = {};
  detailData.value = [];
  currentEditId.value = '';
  fileEditUrl.value = '';
  taskMapIdFlag.value = '';
  templateId.value = '';
  templateUrl.value = '';
  router.go(-1);
  // router.push({ path: '/knowledgeBaseManagment/knowledgeBaseManagment_index' });
};

const saveData = () => {
  if (!ruleForm.value.mapName || !ruleForm.value.search) {
    message.warning('请输入完整！');
  } else {
    Modal.confirm({
      title: '',
      content: '提交之后数据不可更改！',
      okText: '确定',
      cancelText: '取消',
      async onOk() {
        const params = {
          taskMapId: taskMapIdFlag.value || '',
          userId: useUserStore().getUser.id,
        };
        try {
          const res = await submitMap(params);
          if (res && res.data.code === '0') {
            ruleForm.value.mapName = '';
            ruleForm.value.search = '';
            ruleForm.value.confidentialLevel = null
            abstract.value = '';
            treeMapData.value = [];
            activeName.value = 'first';
            secongData.value = {};
            detailData.value = [];
            currentEditId.value = '';
            fileEditUrl.value = '';
            taskMapIdFlag.value = '';
            templateId.value = '';
            templateUrl.value = '';
            router.go(-1);
          } else {
            message.error(res.data.msg);
          }
        } catch (error) {
          console.error(error);
        }
      },
      onCancel() {
        message.info('取消');
      },
    });
  }
};

const chooseOUFun = () => {
  OUDialogVisible.value = true;
  getOUList();
};

// OU属性事件
const handleCheckedCitiesChange = (value: string[]) => {
  selectedName.value = OUData.value.filter((v: any) => value.includes(v.name));
  const checkedCount = value.length;
  // 判断选中状态
  checkAllOU.value = checkedCount === OUData.value.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < OUData.value.length;
};

// OU属性全选
const handleCheckAllChange = (e: any) => {
  const checked = e?.target?.checked;
  checkOUList.value = checked ? OUData.value.map((v: any) => v.name) : [];
  selectedName.value = checked ? [...OUData.value] : [];
  isIndeterminate.value = false;
};

// 获取OU属性的数据
const getOUList = async () => {
  const params = {
    key: 'OU',
  };
  try {
    const res = await OuList(params);
    if (res?.data?.data) {
      OUData.value = [];
      selectedName.value = [];
      OUData.value = res.data.data.slice(1);
      selectedName.value = res.data.data.slice(1);
      checkOUList.value = OUData.value.map((v: any) => v.name);
    }
  } catch (error) {
    console.error(error);
  }
};

// OU属性关闭
const closeOUDialogFun = () => {
  OUDialogVisible.value = false;
};

// 文件上传
const uploadFile = () => {
  showUpload.value = true;
};

const hiddenUpload = (data: any) => {
  if (data.id) {
    showUpload.value = false;
    fileInfoList.value = data;
  }
};

// 添加数据弹框保存成功回调
const handleSuccess = () => {
  getTreeList()
  addDataDialogVisible.value = false
}

</script>

<style lang="less">
.mainRight .ant-tabs-content {
  height: 100% !important;
}
</style>

<style lang="less" scoped>
:deep(.ant-tree-iconEle) {
  display: inline-flex !important;
  align-items: center;
}

.layout {
  .title {
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    padding: 16px;
    border-bottom: 1px solid #eaeaf1;


    .titleText {
      line-height: 32px;
      font-family: Source Sans 3, Source Sans 3;
      font-weight: bold;
      font-size: 18px;
      color: #000;
    }
  }

  .back {
    background-color: var(--ant-primary-color);
  }

  .main {
    display: flex;
    width: 100%;
    // min-width: 1200px;
    height: 100%;
    background-color: #fff;
    white-space: nowrap;
    overflow: hidden;
    justify-content: space-between;

    .mainCenter {
      width: 83%;
      background-color: #fff;
      padding: 16px;
      overflow-y: auto;

      .totalFirst {
        overflow: auto;
        background-color: #1262a7;
        display: flex;
        justify-content: center;

        .mainCenterTop {
          width: 1200px;
          position: relative;

          .mainCenterTopImg {
            width: 100%;
            height: 610px;
          }

          .mainCenterTopTitle {
            font-size: 20px;
            color: #fff;
            position: absolute;
            top: 50px;
            transform: translateX(-54%);
            left: 50%;
            width: 450px;
            text-align: center;
          }

          .mainCenterTopQuery {
            color: #fff;
            position: absolute;
            top: 159px;
            left: 2%;
            font-size: 16px;
            width: 100px;
            text-align: center;
          }

          .mainCenterTopTotal {
            height: 125px;
            color: #fff;
            position: absolute;
            top: 215px;
            left: 27px;
            cursor: pointer;
            width: 126px;
            text-align: center;
            overflow: auto;

            .mainCenterTopSide {
              .fontColor {
                margin-top: 5px;
                cursor: pointer;
                color: #0400f2;
              }

              .mainCenterTopSideText {
                margin-top: 5px;
                cursor: pointer;
              }
            }
          }

          .imagesModal1 {
            width: 115px;
            position: absolute;
            top: 420px;
            left: 30px;
          }

          .mainCenterTopFile1 {
            color: #fff;
            position: absolute;
            top: 448px;
            left: 45px;
            font-size: 14px;
            cursor: pointer;
            width: 85px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 500;
          }

          .imagesModal2 {
            width: 115px;
            position: absolute;
            top: 250px;
            left: 150px;
          }

          .mainCenterTopFile2 {
            color: #fff;
            position: absolute;
            top: 277px;
            left: 170px;
            font-size: 14px;
            cursor: pointer;
            width: 85px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 500;
          }

          .imagesModal3 {
            width: 115px;
            position: absolute;
            top: 167px;
            left: 275px;
          }

          .mainCenterTopFile3 {
            color: #fff;
            position: absolute;
            top: 195px;
            left: 295px;
            font-size: 14px;
            cursor: pointer;
            width: 85px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 500;
          }

          .imagesModal4 {
            width: 115px;
            position: absolute;
            top: 337px;
            left: 338px;
          }

          .mainCenterTopFile4 {
            color: #fff;
            position: absolute;
            top: 365px;
            left: 355px;
            font-size: 14px;
            cursor: pointer;
            width: 85px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 500;
          }

          .imagesModal5 {
            width: 115px;
            position: absolute;
            top: 421px;
            left: 459px;
          }

          .mainCenterTopFile5 {
            color: #fff;
            position: absolute;
            top: 448px;
            left: 480px;
            font-size: 14px;
            cursor: pointer;
            width: 85px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 500;
          }

          .imagesModal6 {
            width: 115px;
            position: absolute;
            top: 251px;
            left: 520px;
          }

          .mainCenterTopFile6 {
            color: #fff;
            position: absolute;
            top: 280px;
            left: 540px;
            font-size: 14px;
            cursor: pointer;
            width: 85px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 500;
          }

          .imagesModal7 {
            width: 115px;
            position: absolute;
            top: 165px;
            left: 641px;
          }

          .mainCenterTopFile7 {
            color: #fff;
            position: absolute;
            top: 195px;
            left: 660px;
            font-size: 14px;
            cursor: pointer;
            width: 85px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 500;
          }

          .imagesModal8 {
            width: 115px;
            position: absolute;
            top: 338px;
            left: 700px;
          }

          .mainCenterTopFile8 {
            color: #fff;
            position: absolute;
            top: 365px;
            left: 720px;
            font-size: 14px;
            cursor: pointer;
            width: 85px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 500;
          }

          .imagesModal9 {
            width: 115px;
            position: absolute;
            top: 421px;
            left: 823px;
          }

          .mainCenterTopFile9 {
            color: #fff;
            position: absolute;
            top: 448px;
            left: 840px;
            font-size: 14px;
            cursor: pointer;
            width: 85px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 500;
          }

          .imagesModal10 {
            width: 115px;
            position: absolute;
            top: 165px;
            left: 945px;
          }

          .mainCenterTopFile10 {
            color: #fff;
            position: absolute;
            top: 195px;
            left: 965px;
            font-size: 14px;
            cursor: pointer;
            width: 85px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 500;
          }
        }
      }

      .totalSecond {
        overflow: auto;
        background-color: #c9ddf8;
        display: flex;
        justify-content: center;

        .mainCenterTop8 {
          width: 1200px;
          position: relative;

          .mainCenterTopImg8 {
            width: 100%;
            height: 610px;
          }

          .mainCenterTopTitle8 {
            font-size: 24px;
            color: #176dfc;
            position: absolute;
            top: 30px;
            text-align: center;
            width: 1200px;
          }

          .mainCenterTopQuery8 {
            color: #fff;
            position: absolute;
            top: 163px;
            left: 60px;
            font-size: 16px;
            width: 90px;
            text-align: center;
            cursor: pointer;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .mainCenterTopTotal8 {
            height: 125px;
            color: #f78e41;
            position: absolute;
            top: 210px;
            left: 58px;
            width: 92px;
            text-align: center;
            cursor: pointer;
            overflow: auto;
            white-space: nowrap;
            text-overflow: ellipsis;

            .mainCenterTopSide8 {
              .fontColor {
                margin-top: 5px;
                cursor: pointer;
                color: #176dfc;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }

              .mainCenterTopSideText8 {
                margin-top: 5px;
                cursor: pointer;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
          }

          .mainCenterTopFile18 {
            color: #f2262f;
            position: absolute;
            top: 475px;
            left: 165px;
            font-size: 14px;
            cursor: pointer;
            width: 130px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 600;
          }

          .mainCenterTopFile28 {
            color: #f2262f;
            position: absolute;
            top: 150px;
            left: 200px;
            font-size: 14px;
            cursor: pointer;
            width: 130px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 600;
          }

          .mainCenterTopFile38 {
            color: #f2262f;
            position: absolute;
            top: 140px;
            left: 675px;
            font-size: 14px;
            cursor: pointer;
            width: 130px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 600;
          }

          .mainCenterTopFile48 {
            color: #f2262f;
            position: absolute;
            top: 155px;
            left: 890px;
            font-size: 14px;
            cursor: pointer;
            width: 130px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 600;
          }

          .mainCenterTopFile58 {
            color: #f2262f;
            position: absolute;
            top: 490px;
            left: 550px;
            font-size: 14px;
            cursor: pointer;
            width: 130px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 600;
          }

          .mainCenterTopFile68 {
            color: #f2262f;
            position: absolute;
            top: 300px;
            left: 430px;
            font-size: 14px;
            cursor: pointer;
            width: 130px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 600;
          }

          .mainCenterTopFile78 {
            color: #f2262f;
            position: absolute;
            top: 290px;
            left: 640px;
            font-size: 14px;
            cursor: pointer;
            width: 130px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 600;
          }

          .mainCenterTopFile88 {
            color: #f2262f;
            position: absolute;
            top: 380px;
            left: 980px;
            font-size: 14px;
            cursor: pointer;
            width: 130px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 600;
          }
        }
      }

      .mainCenterBot {
        // padding: 30px;
        background-color: #fff;

        .mainCenterBotText {
          margin-bottom: 30px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 600;
          font-size: 16px;
          color: #000;
        }

        .mainCenterBotImg {
          width: 100%;
          height: 240px;
        }
      }
    }

    .mainLefts {
      width: 16%;
      min-width: 20.3125rem;
      max-width: 20.3125rem;
      border-left: 2px solid #eaeaf1;
      padding: 10px 16px 16px;

      .mainRight {
        width: 100%;
        height: 100%;
        background-color: #fff;
        overflow-y: hidden;

        .first {
          width: 100%;
          // overflow: auto;

          .uploadBtn {
            width: 270px;
            height: 141px;
            border-radius: 4px;
            border: 1px solid var(--ant-primary-color);
            padding: 0
          }

          .uploadimg {
            width: 270px;
            height: 141px;
            border-radius: 4px;
            border: 1px solid var(--ant-primary-color);
          }

          .uploadimgs {
            width: 40px;
            height: 40px;
          }

          .elBtn {
            font-family: Source Sans 3, Source Sans 3;
            font-weight: 400;
            font-size: 14px;
            color: var(--ant-primary-color);
            position: relative;
            top: 0;
            right: 40px;
            cursor: pointer;
          }

          :deep(.el-textarea__inner) {
            margin-left: 0;
          }

          :deep(.el-form-item__label) {
            font-family: Source Sans 3, Source Sans 3;
            font-weight: 400;
            font-size: 14px;
          }

          :deep(.el-textarea__inner) {
            width: 270px;
          }
        }

        .secondTop {
          width: 100%;
          display: flex;
          margin-right: 20px;
          justify-content: space-around;
          border-bottom: 1px solid #f1f1f1;
          padding-bottom: 10px;
          margin-bottom: 10px;

          .iconfont {
            display: flex;
            align-items: center;
            margin-right: 10px;
            color: #7c8392;
            cursor: pointer;
          }
        }

        .treeData {
          width: 100%;
          height: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          display: flex;

          :deep(.el-tree) {
            .el-tree-node {
              .el-tree-node__children {
                .el-tree-node {
                  .el-tree-node__children {
                    .el-tree-node {
                      .el-tree-node__content {
                        .title {
                          color: #1122ff;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }

        :deep(.el-tabs__item) {
          font-family: Source Sans 3, Source Sans 3;
          font-weight: 400;
          font-size: 16px;
          color: #6a696e;
          padding-left: 16px;
        }

        :deep(.el-tabs__nav-scroll) {
          overflow: hidden;
        }

        :deep(.el-tabs__active-bar) {
          display: none;
        }

        :deep(.is-active) {
          font-family: Source Sans 3, Source Sans 3;
          font-weight: 600;
          font-size: 16px;
          color: #000;
        }
      }
    }
  }

  :deep(.el-input) {
    width: 270px;
  }

  :deep(.el-textarea__inner) {
    width: 59%;
    margin-left: 20px;
  }
}
</style>
