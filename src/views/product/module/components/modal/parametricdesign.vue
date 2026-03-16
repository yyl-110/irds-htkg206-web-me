<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue';
import { ref } from 'vue';
import { TableProps, Modal, Button, Popconfirm, message } from 'ant-design-vue';
import { getCurrentInstance } from 'vue';
import { AdminApiwebSocketAuth } from '@/api/tags/管理webSocket';
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();
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
const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },
  parmDesignData: {
    require: false,
    type: Array,
    default: () => [],
  },
  paramsObject: {
    require: false,
    type: Object,
    default: () => {},
  },
  selectModelList: {
    require: false,
    type: Object,
    default: () => [],
  },
  categoryid: {
    require: false,
    type: String,
    default: '',
  },
  moduleId: {
    require: false,
    type: String,
    default: '',
  },
});
const emit = defineEmits<{
  /** 点击取消按钮 */
  onClose: [visible: boolean];
  /** 点击确定按钮 */
  handleSave: [resource: any];
  changeData: any;
}>();
/** 弹窗状态 */
const visible = computed(() => {
  return props.modalVisible;
});
const instance = getCurrentInstance();
const parmDesignColumn = ref([
  {
    title: '模型结构树',
    key: 'equnr',
    dataIndex: 'equnr',
    align: 'left',
    resizable: true,
    width: 100,
  },

  {
    title: '新文件名称',
    key: 'moduleNewNum',
    dataIndex: 'moduleNewNum',
    align: 'center',
    resizable: true,
    width: 100,
  },
  {
    title: '公用名称',
    key: 'descript',
    dataIndex: 'descript',
    align: 'center',
    resizable: true,
    width: 100,
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    align: 'center',
    resizable: true,
    width: 100,
  },
]);
const selectedRowList = ref<any[]>([]);
const imgurl = ref<string>('');
const actionList = ref([
  { label: '重新使用', value: '重新使用' },
  { label: '手动命名', value: '手动命名' },
  { label: '自动命名', value: '自动命名' },
]);
/** 表格勾选事件 */
const rowSelection: TableProps['rowSelection'] = {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
    selectedRowList.value = selectedRows;
  },
};

function setModuleParameter() {
  if (props.paramsObject.inputVal == null || props.paramsObject.inputVal == '') {
    message.warning({
      content: '请先申请件号！',
      duration: 3,
      closable: true,
    });
    return;
  }
  var parametersStr = '';
  for (var i = 0; i < props.parmDesignData.length; i++) {
    if (props.parmDesignData[i].paraDictionaryName != null && props.parmDesignData[i].paraDictionaryName != undefined) {
      parametersStr += '{"Name": "' + props.parmDesignData[i].paraDictionaryName + '","Type": "double","Value": "' + props.parmDesignData[i].paraValue + '","Description": ""},';
    }
  }
  if (parametersStr.length > 1) {
    parametersStr = parametersStr.substring(0, parametersStr.length - 1);
  }
  parameterInFirstCsys(props.paramsObject.inputVal, props.paramsObject.templateModuleType, parametersStr);
}

// 申请件号
async function applyPieceNumber() {
  let data: any = {};
  data.categoryId = props.categoryid;
  data.userId = userStore.getUser.id;
  data.moduleNum = props.paramsObject.templateModuleNum;
  const res = await AdminApiwebSocketAuth.getModuleNumber(data);
  if (res.data.code == 200) {
    emit('changeData', res.data.data.moduleNewNum);
  }
}

function makeModule() {
  if (props.paramsObject.inputVal == null || props.paramsObject.inputVal == '') {
    message.warning({
      content: '请先申请件号！',
      duration: 3,
      closable: true,
    });
    return;
  }
  var parametersStr = '';
  for (var i = 0; i < props.parmDesignData.length; i++) {
    if (props.parmDesignData[i].paraDictionaryName != null && props.parmDesignData[i].paraDictionaryName != undefined) {
      parametersStr += '{"Name": "' + props.parmDesignData[i].paraDictionaryName + '","Type": "double","Value": "' + props.parmDesignData[i].paraValue + '","Description": ""},';
    }
  }
  if (parametersStr.length > 1) {
    parametersStr = parametersStr.substring(0, parametersStr.length - 1);
  }
  openModule(instance, props.paramsObject.templateModuleNum, props.paramsObject.templateModuleType, props.paramsObject.inputVal, '', parametersStr);
}
function getModuleParameter() {
  if (props.paramsObject.inputVal == null || props.paramsObject.inputVal == '') {
    message.warning({
      content: '请先申请件号！',
      duration: 3,
      closable: true,
    });
    return;
  }
  GetLocParametersInFirstCsys(instance, props.paramsObject.inputVal, props.paramsObject.templateModuleType);
}

async function resetParm() {
  let data: any = {};
  data.categoryId = props.categoryid;
  data.userId = userStore.getUser.id;
  let parmDesignData1: any = [];
  if (props.selectModelList.length > 0) {
    data.id = props.selectModelList[0].id;
    const res = await AdminApiwebSocketAuth.modelDesignParametric(data);
    for (var i = 0; i < res.data.data.moduleParaList.length; i++) {
      var modelInfoProp = res.data.data.moduleParaList[i].modelInfoProp;
      if (modelInfoProp.length > 4) {
        modelInfoProp = modelInfoProp.substring(4);
        if (modelInfoProp > 9) {
          parmDesignData1.push(res.data.data.moduleParaList[i]);
        }
      }
    }
    props.parmDesignData = parmDesignData1;
  } else {
    message.warning({
      content: '请选择数据，进行设计',
      duration: 3,
      closable: true,
    });
  }
}
async function saveParm() {
  let data: any = {};
  data.categoryId = props.categoryid;
  data.userId = userStore.getUser.id;
  data.moduleId = props.moduleId;
  data.designData = queryParmList();
  const res = await AdminApiwebSocketAuth.parametricDesignSave(data);
  if (res.data.code == 0) {
    message.info({
      content: '保存成功',
      duration: 3,
      closable: true,
    });
  }
}
function queryParmList() {
  let list: any = [];
  props.parmDesignData.forEach(item => {
    let str: any = {};
    str.moduleNewNum = that.inputVal;
    str.moduleType = that.templateModuleType;
    if (list.length > 0) {
      list[0][item.modelInfoProp] = item.paraValue;
    } else {
      str[item.modelInfoProp] = item.paraValue;
      list.push(str);
    }
  });
  return list;
}
/**
 * @description 点击取消事件
 */
function cancel() {
  emit('onClose', false);
}
</script>

<template>
  <a-modal v-model:visible="visible" style="width: 50%" :title="$t('编辑应用')" @cancel="cancel" :confirm-loading="$isPending()" :mask-closable="false">
    <table>
      <tr>
        <td width="700" valign="top">
          <a-form label-position="left">
            <div style="width: 600px">
              <a-form-item label="模版文件名：" :label-width="150" style="float: left; margin-left: 20px; margin-bottom: 10px">
                <a-input style="width: 220px; margin-left: 14px" v-model:value="paramsObject.templateModuleNum" class="ivu-input" disabled />
                <a-input style="width: 220px; display: none" v-model:value="paramsObject.templateModuleType" class="ivu-input" />
              </a-form-item>
            </div>
            <div style="width: 600px">
              <a-form-item label="新模型文件名：" :label-width="150" style="float: left; margin-left: 20px; margin-bottom: 10px">
                <a-input style="width: 220px" v-model:value="paramsObject.inputVal" class="ivu-input" disabled />
                <a-button type="primary" style="margin-left: 20px" @click="applyPieceNumber">申请件号</a-button>
                <a-button type="primary" class="btnSty" style="margin-left: 15px" @click="makeModule">打开模型</a-button>
              </a-form-item>
            </div>
          </a-form>
          <a-table
            bordered
            style="margin-top: 5px"
            :scroll="{ x: 600 }"
            :pagination="false"
            row-key="id"
            :data-source="parmDesignData"
            :columns="parmDesignColumn"
            :row-selection="rowSelection"
            :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'action'">
                <a-select v-model:value="record.status" style="width: 150px" allowClear>
                  <a-select-option v-for="item in actionList" :value="item.value" :key="item.value">{{ item.label }}</a-select-option>
                </a-select>
              </template>
              <template v-if="column.dataIndex === 'moduleNewNum'">
                <a-input v-model:value="record.moduleNewNum" style="width: 150px" :disabled="record.moduleNewNum !== '手动命名'" />
              </template>
            </template>
          </a-table>
          <div style="width: 100%; float: left; margin-top: 20px; height: 50px">
            <a-button type="primary" class="btnSty" @click="setModuleParameter">再生模型</a-button>
            <a-button type="primary" class="btnSty" style="margin-left: 15px" @click="getModuleParameter">同步模型数据</a-button>
            <a-button type="primary" class="btnSty" style="margin-left: 15px" @click="resetParm">重置参数</a-button>
            <a-button type="primary" class="btnSty" style="margin-left: 15px" @click="saveParm">保存</a-button>
          </div>
        </td>
        <!-- <td valign="top">
          <img :src="imgurl" style="width: 580px; margin-left: 30px" />
        </td> -->
      </tr>
    </table>
    <template v-slot:footer>
      <a-button type="primary" @click="emit('onClose', false)">关闭</a-button>
    </template>
  </a-modal>
</template>
<style lang="less" scoped>
:deep(.ant-table-content) {
  overflow-x: hidden !important;
}
</style>
