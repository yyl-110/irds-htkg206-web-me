<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue';
import { ref, computed, nextTick } from 'vue';
import { TableProps, Modal, Button, Popconfirm, message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { WeiI18n } from '@/utils/WeiI18n';
import CkeditorPlugin from '@/components/Ckeditor/index.vue';
import { ModuleMenuAddRequestDTOModel } from '@/api/models/module/ModuleMenuAddRequestDTOModel';
import { AdminApiSystemModule } from '@/api/tags/module/系统模块库';
import { useUserStore } from '@/store/modules/user';
import UploadImg from '@/components/UploadImg/index.vue';
import { UploadFile } from '@/components/UploadFile';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { characterToList } from '@/utils/tools';
import dynamicForm from '../form/dynamicForm.vue';
import Empty from '@/components/Empty/index.vue';
const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  /** 点击取消按钮 */
  onClose: [visible: boolean];
  /** 点击确定按钮 */
  handleSave: [resource: any];
  modalInit: any;
}>();
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { marginTop: '10px' },
  }),
});
const userStore = useUserStore();
const typeValue = ref<any>([
  { label: 'prt', value: 'prt' },
  { label: 'asm', value: 'asm' },
  { label: 'fat', value: 'fat' },
  { label: 'gph', value: 'gph' },
]);
const moduleTypeValue = ref<any>([
  { label: 'BZ', value: 'BZ' },
  { label: 'MB', value: 'MB' },
]);

const modelStateList = ref<any>([
  { label: '已发布', value: '已发布' },
  { label: '设计中', value: '设计中' },
  { label: '停用', value: '停用' },
  { label: '审核中', value: '审核中' },
]);

const seriviesLevel = ref<any>([
  { label: '公开', value: 1 },
  { label: '内部', value: 2 },
  { label: '秘密', value: 3 },
  { label: '机密', value: 4 },
]);
const childrenList = ref<any>([]);
const projectList = ref<any>([]);
const Generalapplicability = ref<any>([
  { label: '通用模块', value: '通用模块' },
  { label: '专用模块', value: '专用模块' },
]);
const modeltypeList = ref<any>([
  { label: '标准模块', value: '标准模块' },
  { label: '基型模块', value: '基型模块' },
]);
const rankList = ref<any>([
  { label: '1级', value: '1级' },
  { label: '2级', value: '2级' },
  { label: '3级', value: '3级' },
  { label: '4级', value: '4级' },
  { label: '5级', value: '5级' },
]);
const rootList = ref<any>([]);

/** 表单样式 label对象 */
const variableComp = ref<any>(null);
const labelCol = ref({ style: { width: '120px' } });
const dynamicParm = ref<any[]>([]);
const uploadFileList = ref<any[]>([]);
const keywords = ref<any>('');
const categoryid = ref<any>('');
const menuId = ref<any>('');
const loading = ref<boolean>(false);
const modelData = reactive<any>(new ModuleMenuAddRequestDTOModel());
const formRef = ref<FormInstance>();
const ckeditorRef = ref();
const pendingRemarkContent = ref('');
const visible = computed(() => props.modalVisible);

/** 编辑器就绪后写入待写入的备注（解决编辑时 v-if="!loading" 导致 Ckeditor 晚挂载） */
watch(
  [ckeditorRef, pendingRemarkContent],
  () => {
    if (ckeditorRef.value?.setData && pendingRemarkContent.value !== '') {
      const content = pendingRemarkContent.value;
      pendingRemarkContent.value = '';
      nextTick(() => {
        ckeditorRef.value?.setData(content);
      });
    }
  },
  { deep: true, flush: 'post' },
);

/**
 * @description 点击取消事件
 */
function cancel() {
  emit('onClose', false);
}

// 获取平台
async function getChildrenListsApi(ids: any) {
  if (!ids) {
    return;
  }
  let data: any = {};
  data.ids = ids;
  const res = await AdminApiSystemModule.getChildrenLists(data);
  if (res.data.code == 0) {
    childrenList.value = res.data.data?.map(item => ({ label: item.name, value: item.id })) || [];
  } else {
    message.error(res.data.msg);
  }
}

const moduleParaList = ref([]);
// 仅列出专有属性（columnProperties === 0）
const specialProps = computed(() => (moduleParaList.value || []).filter((p: any) => Number(p.columnProperties) === 0));

function parseOptions(item: any) {
  if (!item || !item.selectMultipleValues) return [];
  return String(item.selectMultipleValues)
    .split(';')
    .map((s: string) => s.trim())
    .filter(Boolean);
}

//初始化数据
async function initColumnData(categoryidStr: any) {
  categoryid.value = categoryidStr;
  loading.value = true;
  try {
    let params: any = {};
    params.categoryId = categoryidStr;
    params.menuId = menuId.value;
    const res = await AdminApiSystemModule.findCurrentModuleInfoByCategoryId(params);
    if (res.data.code == 200) {
      var moduleParaList = res.data.data;
      let newList: any = [];
      for (let i = 0; i < moduleParaList.length; i++) {
        if (moduleParaList[i].paraType == 1) {
          newList.push({
            id: moduleParaList[i].id,
            name: 'rxLabel',
            labelName: moduleParaList[i].propertyName + '：',
            type: moduleParaList[i].propertyType,
            modeTypeList: characterToList(moduleParaList[i].selectStr),
            typeKey: moduleParaList[i].dataProp,
            modeTypeVal: moduleParaList[i].paraValue,
          });
        }
      }
      dynamicParm.value = newList;
    }
  } catch (error) {
    loading.value = false;
    console.log(error);
  }
}

// 添加
async function handleModalAdd(id: string, pdmType: string, menu_id: string) {
  try {
    categoryid.value = id;
    menuId.value = menu_id;
    loading.value = true;
    await initColumnData(categoryid.value);
    modelData.id = '';
    modelData.categoryid = '';
    modelData.creator = '';
    modelData.para1 = '';
    modelData.para2 = '';
    modelData.para3 = '';
    modelData.para4 = undefined;
    modelData.para5 = '';
    modelData.para6 = '';
    modelData.para7 = '';
    modelData.para8 = undefined;
    modelData.para9 = '';
    modelData.para10 = undefined;
    filedataSource.value = [];
    uploadFileList.value = [];
    modelData.modelEngName = pdmType;
    pendingRemarkContent.value = '';
    nextTick(() => {
      if (formRef.value) formRef.value.resetFields();
      if (ckeditorRef.value) ckeditorRef.value.setData('');
    });
    loading.value = false;
  } catch (error) {
    message.error(error);
    loading.value = false;
  }
}

// 编辑
async function handleModalUpdate(id: string, row: any, menu_id: any) {
  loading.value = true;
  try {
    menuId.value = menu_id;
    categoryid.value = id;
    dynamicParm.value = [];
    modelData.id = row.id;
    modelData.para1 = row.para1;
    modelData.para2 = row.para2;
    modelData.para3 = row.para3;
    modelData.para4 = row.para4;
    modelData.para5 = row.para5;
    modelData.para6 = row.para6;
    modelData.para7 = row.para7;
    modelData.para8 = row.para8;
    modelData.para9 = row.para9;
    modelData.para10 = row.para10;
    modelData.confidentialLevel = Number(row.confidentialLevel);
    modelData.createUser = row.creatorName;
    const remarkContent = row.para11 ?? '';
    let params: any = {};
    params.categoryId = categoryid.value;
    params.menuId = menuId.value;
    const res = await AdminApiSystemModule.findCurrentModuleInfoByCategoryId(params);
    if (res.data.code == 200) {
      var moduleParaList = res.data.data;
      let newList: any = [];
      for (let i = 0; i < moduleParaList.length; i++) {
        if (moduleParaList[i].paraType == 1) {
          newList.push({
            id: moduleParaList[i].id,
            name: 'rxLabel',
            labelName: moduleParaList[i].propertyName + '：',
            type: moduleParaList[i].propertyType,
            modeTypeList: characterToList(moduleParaList[i].selectStr),
            typeKey: moduleParaList[i].dataProp,
            modeTypeVal: row[moduleParaList[i].dataProp],
          });
        }
      }
      dynamicParm.value = newList;
    }
    const resData = await AdminApiSystemModule.getLibraryFileInfoList({ id: row.id });
    filedataSource.value = resData.data.data;
    loading.value = false;
    nextTick(() => {
      pendingRemarkContent.value = remarkContent;
    });
  } catch (error) {
    console.log(error);
    loading.value = false;
    nextTick(() => {
      pendingRemarkContent.value = row?.para11 ?? '';
    });
  }
}

const selectedRowList = ref<any[]>([]);
const filedataSource = ref<any[]>([]);
const FileColumns = ref([
  {
    title: '文件名称',
    key: 'documentName',
    dataIndex: 'documentName',
    align: 'left',
    minWidth: 200,
  },
  {
    title: '文件类型',
    key: 'fileType',
    dataIndex: 'fileType',
    align: 'left',
    minWidth: 100,
  },
  {
    title: '下载',
    key: 'operation',
    dataIndex: 'operation',
    align: 'center',
    width: 100,
  },
]);

// 声明表格类型
interface DataType {
  // id: Key
  objType: string;
  objId: string;
  amount: number;
  buyFlag: boolean;
}

/** 表格勾选事件 */
const rowSelection: TableProps['rowSelection'] = {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  onChange: (selectedRowKeys: string[], selectedRows: DataType[]) => {
    selectedRowList.value = selectedRows;
  },
};

// 图片上传-----------------
const fileList = ref<any>([]);

const previewImage = ref<string>('');
const previewVisible = ref<boolean>(false);
const previewTitle = ref<string>('');

// 文件上传---------------------
const selectedRowfileList = ref<any[]>([]);
const openfileUploadModal = ref<boolean>(false);

/** 表格勾选事件 */
const rowSelectionfile: TableProps['rowSelection'] = {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  onChange: (selectedRowKeys: string[], selectedRows: DataType[]) => {
    selectedRowfileList.value = selectedRows;
  },
};

/** 删除按钮状态 */
const deletefileFlag = computed(() => {
  return selectedRowfileList.value?.length === 0;
});

function openUpload() {
  uploadFileList.value = [];
  openfileUploadModal.value = true;
}

async function downloadFile(record: any) {
  window.open(record.fileUrl);
}

async function datacustomRequest(options: any) {
  try {
    const res = await AdminApiSystemUploadFile.uploadFile({
      file: options.file as File,
      userId: userStore.getUser.id,
      securityLevel: 1,
    });
    if (res.data.code === 0) {
      const file: any = { ...res.data, name: res.data?.oldFileName };
      uploadFileList.value[0] = file;
      message.success(WeiI18n.t('上传成功').value);
    } else {
      message.error(WeiI18n.t('上传失败').value);
    }
  } catch (err) {
    console.log(err);
  }
}

function datafilechange(file: any) {
  uploadFileList.value[0] = file;
}

function handlefileSave() {
  if (uploadFileList.value[0] && uploadFileList.value[0].id) {
    filedataSource.value.push({
      ...uploadFileList.value[0],
      fileId: uploadFileList.value[0].id,
    });
    openfileUploadModal.value = false;
  } else {
    message.info(WeiI18n.t('请上传文件').value);
  }
}

function FileDownload(row: any) {
  window.open(row.fileUrl);
}

// 删除文件
function removeFile() {
  if (selectedRowfileList.value.length == 0) {
    message.error('请选择要删除的文件');
    return;
  }
  Modal.confirm({
    title: '确认删除此数据？',
    okText: WeiI18n.t('确定').value,
    cancelText: WeiI18n.t('取消').value,
    onOk: async () => {
      filedataSource.value = filedataSource.value.filter(item => !selectedRowfileList.value.find(t => t.id === item.id));
      selectedRowfileList.value = [];
      // let data: any = {};
      // data.userId = userStore.getUser.id;
      // data.categoryId = categoryid.value;
      // data.moduleAttachmentIdList = selectedRowfileList.value;
      // const res = await AdminApiSystemModule.deleteModuleAttachmentByModuleId(data);
      // if (res.data.code == 0) {

      //   message.success(res.data.msg);
      // } else {
      //   message.error(res.data.msg);
      // }
    },
  });
}

function getDynamicComponentVal() {
  //获取动态组件内的查询条件
  let prmList: any = variableComp.value;
  debugger;
  let moduleParaList: any = [];
  if (prmList != undefined) {
    prmList.forEach(function (item: any) {
      debugger;
      let val = '';
      let newModeTypeVal = item.newModeTypeVal;
      if (newModeTypeVal != undefined && newModeTypeVal != '' && item.typeKey == 'para4') {
        val = newModeTypeVal.toLowerCase() == 'prt' ? 'prt' : newModeTypeVal.toLowerCase() == 'asm' ? 'asm' : newModeTypeVal.toLowerCase() == 'gph' ? 'gph' : '';
      } else {
        val = item.newModeTypeVal;
      }
      moduleParaList.push({
        modelInfoProp: item.typeKey,
        modelInfoPropValue: val,
      });
    });
  }
  return moduleParaList;
}

/**
 * @description 点击确认
 */
async function handleSave() {
  formRef.value?.validate().then(async () => {
    let libraryDataBaseDTO = {
      id: '',
      categoryId: categoryid.value,
      menuId: menuId.value,
      creator: userStore.getUser.id,
      para1: modelData.para1, //物料编码
      para2: modelData.para2, //模块编码
      para3: modelData.para3, //模块名称(一般对应中文名称)
      para4: modelData.para4, //模型类型
      para5: modelData.para5, //模型坐标系,未知参数
      para6: modelData.para6, //英文名称
      para7: modelData.para7, //贡献者
      para8: modelData.para8, //所属分类
      para9: modelData.para9, //CAD计算重量
      para10: modelData.para10, //状态
      para11: ckeditorRef.value.getData(), //备注
      confidentialLevel: modelData.confidentialLevel, //密级
    };
    const moduleObj2: any = getDynamicComponentVal();
    const moduleObj2Map: any = Object.fromEntries((moduleObj2 || []).map((item: any) => [item.modelInfoProp, item.modelInfoPropValue]));
    const fileData: any = [];
    filedataSource.value.forEach((item: any) => {
      fileData.push({
        id: '',
        type: 3,
        fileId: item.fileId,
        categoryId: categoryid.value,
        dataId: '',
        versionFlag: 0,
        effectiveVersionFlag: 0,
        lastVersionFlag: 0,
      });
    });
    let data: any = {};
    if (modelData.id == '' || modelData.id == undefined) {
      data.libraryDataBaseDTO = libraryDataBaseDTO;
      data.libraryCustomizeDataBaseDTO = moduleObj2Map;
      data.libraryFileUpdateRequestDTO = fileData;
      const res = await AdminApiSystemModule.moduleInfoKeep(data);
      if (res.data.code == -1) {
        message.warning({
          content: res.data.msg,
          duration: 3,
          closable: true,
        });
      } else {
        message.info('添加成功');
        emit('modalInit');
        emit('onClose', false);
      }
    } else {
      libraryDataBaseDTO.id = modelData.id;
      data.libraryDataBaseDTO = libraryDataBaseDTO;
      data.libraryCustomizeDataBaseDTO = moduleObj2Map;
      data.libraryFileUpdateRequestDTO = fileData;
      const res = await AdminApiSystemModule.moduleInfoKeep(data);
      if (res.data.code == -1) {
        message.warning({
          content: res.data.msg,
          duration: 3,
          closable: true,
        });
      } else {
        message.info('修改成功');
        emit('modalInit');
        emit('onClose', false);
      }
    }
  });
}

defineExpose({ handleModalAdd, handleModalUpdate });
</script>

<template>
  <a-modal
    v-model:visible="visible"
    class="fixed-modal"
    :style="{ width: '1200px', top: '2%' }"
    :title="$t('模块信息')"
    :confirm-loading="$isPending()"
    :mask-closable="false"
    @ok="handleSave"
    @cancel="cancel">
    <div v-if="!loading" class="modal-body">
      <!-- 基本属性 -->
      <section class="module-section">
        <h3 class="module-section-title">基本属性</h3>
        <a-form ref="formRef" layout="vertical" :model="modelData" :label-col="labelCol" class="form-grid">
          <a-form-item label="模型件号：" name="para1" :rules="[{ required: true, message: WeiI18n.t('请输入模型件号').value }]">
            <a-input v-model:value="modelData.para1" placeholder="请输入模型件号" />
          </a-form-item>

          <a-form-item label="模块编码：" name="para2" :rules="[{ required: true, message: WeiI18n.t('请输入模块编码').value }]">
            <a-input v-model:value="modelData.para2" placeholder="请输入模块编码" />
          </a-form-item>

          <a-form-item label="模块名称：" name="para3" :rules="[{ required: true, message: WeiI18n.t('请输入模块名称').value }]">
            <a-input v-model:value="modelData.para3" placeholder="请输入模块名称" />
          </a-form-item>

          <a-form-item label="英文名称：" name="para6">
            <a-input v-model:value="modelData.para6" placeholder="请输入英文名称" />
          </a-form-item>

          <a-form-item label="模型类型：" name="para4" :rules="[{ required: true, message: WeiI18n.t('请选择模型类型').value }]">
            <a-select v-model:value="modelData.para4" show-search placeholder="请选择模型类型">
              <a-select-option v-for="item in typeValue" :key="item.value" :value="item.value">{{ $t(item.label) }}</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="所属分类：" name="para8">
            <a-select v-model:value="modelData.para8" show-search placeholder="请选择分类">
              <a-select-option v-for="item in moduleTypeValue" :key="item.value" :value="item.value">{{ $t(item.label) }}</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="状态：" name="para10" :rules="[{ required: true, message: WeiI18n.t('请选择状态').value }]">
            <a-select v-model:value="modelData.para10" show-search placeholder="请选择状态">
              <a-select-option v-for="item in modelStateList" :key="item.value" :value="item.value">{{ $t(item.label) }}</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="密级：" name="confidentialLevel" :rules="[{ required: true, message: WeiI18n.t('请选择密级').value }]">
            <a-select v-model:value="modelData.confidentialLevel" show-search placeholder="请选择状态">
              <a-select-option v-for="item in seriviesLevel" :key="item.value" :value="item.value">{{ $t(item.label) }}</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="模型坐标系：" name="para5">
            <a-input v-model:value="modelData.para5" placeholder="请输入模型坐标系" />
          </a-form-item>

          <a-form-item label="CAD计算重量：" name="para9">
            <a-input v-model:value="modelData.para9" placeholder="请输入CAD计算重量" />
          </a-form-item>

          <a-form-item label="创建人：" name="createUser">
            <a-input v-model:value="modelData.createUser" disabled />
          </a-form-item>

          <a-form-item label="贡献者：" name="para7">
            <a-input v-model:value="modelData.para7" disabled />
          </a-form-item>
        </a-form>
      </section>
      <!-- 可变参数与附件区域 -->
      <div class="variableParm-box" v-if="dynamicParm && dynamicParm.length > 0">
        <div class="section-subtitle">专有属性</div>
        <div class="varargsBox">
          <dynamicForm
            ref="variableComp"
            v-for="(item, index) in dynamicParm"
            :key="item.id"
            :label="item.labelName"
            :modeTypeList="item.modeTypeList"
            :type="item.type"
            :typeKey="item.typeKey"
            :modeTypeVal="item.modeTypeVal"
            :width="252"
            prop="id"
            :labelWidth="55" />
        </div>
      </div>
      <div class="attachments-row">
        <div class="attachments-column">
          <div class="section-subtitle">备注信息</div>
          <CkeditorPlugin ref="ckeditorRef" height="160" />
        </div>
        <div class="attachments-column">
          <div class="section-subtitle">技术资料</div>
          <div class="attachments-actions">
            <a-button type="primary" size="small" @click="openUpload">文件上传</a-button>
            <a-button type="primary" :disabled="deletefileFlag" danger size="small" class="btn_left" @click="removeFile">删除</a-button>
          </div>
          <a-table
            bordered
            :locale="locale"
            :scroll="{ x: 'calc(27vw - 10px)' }"
            style="margin-top: 8px"
            :pagination="false"
            row-key="id"
            :data-source="filedataSource"
            :columns="FileColumns"
            :row-selection="rowSelectionfile">
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.dataIndex === 'operation'">
                <a-button shape="circle" type="link" @click="downloadFile(record)">下载</a-button>
              </template>
            </template>
          </a-table>
        </div>
      </div>
    </div>
    <div v-else class="example"><a-spin tip="加载中..." /></div>
    <template #footer>
      <a-button type="primary" @click="handleSave">确定</a-button>
      <a-button @click="cancel">取消</a-button>
    </template>
  </a-modal>

  <!-- 文件上传 -->
  <a-modal
    v-model:visible="openfileUploadModal"
    style="width: 40%"
    :title="$t('技术文档与资料上传')"
    :confirm-loading="$isPending()"
    :mask-closable="false"
    @ok="handlefileSave"
    @cancel="openfileUploadModal = false">
    <div style="color: red">温馨提示： 允许上传pdf、doc、docx、xls、xlsx等格式文件</div>
    <UploadFile style="margin-top: 10px; color: red" :fileList="uploadFileList" @change="datafilechange" @customRequest="datacustomRequest" />
    <template #footer>
      <a-button type="primary" @click="handlefileSave">
        {{ $t('确定') }}
      </a-button>
      <a-button @click="openfileUploadModal = false">
        {{ $t('取消') }}
      </a-button>
    </template>
  </a-modal>

  <!-- 图片预览 -->
  <a-modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="previewVisible = false">
    <img alt="example" style="width: 100%" :src="previewImage" />
  </a-modal>
</template>

<style lang="less" scoped>
.example {
  position: absolute;
  top: 45%;
  left: 50%;
}

.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
    overflow: auto;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}

.btn_left {
  margin-left: 15px;
}

:deep(.ant-table-content) {
  overflow: hidden !important;
}

:deep(.ant-form-item) {
  margin-left: 20px !important;
}

.elformitem :deep(.el-form-item__label) {
  width: 120px;
}

.module-section {
  margin-bottom: 24px;
  padding: 16px;
  border-radius: 6px;
  background: #fff;
  border: 1px solid #f0f0f0;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.03);
}

.module-section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
  position: relative;
  padding-left: 12px;
}

.module-section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  width: 4px;
  height: 18px;
  background: linear-gradient(180deg, #1890ff, #2db7f5);
  border-radius: 2px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px 24px;
}

.attachments-row {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}

.attachments-column {
  width: 100%;
  margin-bottom: 8px;
}

.attachments-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.section-subtitle {
  font-weight: 700;
  margin-bottom: 8px;
}

/* 专有属性：可变列横向平铺 */
.varargsBox {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 16px;
}

.varargsBox > * {
  flex: 0 0 252px;
  max-width: 252px;
}

/* footer 按钮右对齐 */
:deep(.ant-modal-footer) {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* 固定 Modal 的头部和底部，内容区可滚动 */
.fixed-modal ::v-deep(.ant-modal-header) {
  position: sticky;
  top: 0;
  z-index: 20;
  background: #fff;
  /* 保持原有头部高度与分隔线 */
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
}

/* 限高并允许内部滚动，避免 modal 内容撑开整个视图 */
.fixed-modal ::v-deep(.ant-modal-body) {
  max-height: calc(75vh - 120px);
  overflow: auto;
  padding: 16px 24px;
}

/* 底部按钮固定显示（覆盖原有 .ant-modal-footer 样式） */
.fixed-modal ::v-deep(.ant-modal-footer) {
  position: sticky;
  bottom: 0;
  z-index: 30;
  background: #fff;
  box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04);
  padding: 12px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* 在窄屏时稍微降低 body 的 max-height */
@media (max-width: 920px) {
  .fixed-modal ::v-deep(.ant-modal-body) {
    max-height: calc(70vh - 120px);
  }
}

/* 响应式 */
@media (max-width: 920px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .single-line ::v-deep(.ant-input),
  .single-line ::v-deep(.ant-select-selector) {
    width: 100% !important;
  }
}
</style>

<style lang="less">
/* Modal 被 teleport，作用域样式无效 -> 全局样式生效 */

/* 选择器针对 a-modal 加的 class="fixed-modal" */
.fixed-modal .ant-modal-content .ant-modal-header {
  position: sticky;
  top: 0;
  z-index: 1200;
  background: #fff;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
}

/* 限高并允许内部滚动 */
.fixed-modal .ant-modal-content .ant-modal-body {
  max-height: calc(75vh - 120px);
  overflow: auto;
  padding: 16px 24px;
  background: #fff;
}

/* 底部按钮固定 */
.fixed-modal .ant-modal-content .ant-modal-footer {
  position: sticky;
  bottom: 0;
  z-index: 1300;
  background: #fff;
  box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04);
  padding: 12px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* 兼容窄屏 */
@media (max-width: 920px) {
  .fixed-modal .ant-modal-content .ant-modal-body {
    max-height: calc(70vh - 120px);
  }
}
</style>
