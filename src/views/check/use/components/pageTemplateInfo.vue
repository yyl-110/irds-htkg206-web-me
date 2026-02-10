<template>
  <div class="view-layout" :style="{ height: pageHeight }">
    <div class="dialog-layout">
      <div class="formWrap" :style="{ width: '600px' }">
        <a-form ref="formValidate" :layout="'vertical'" style="display: flex; flex-wrap: wrap">
          <div
            v-for="(item, index) in parameterTempList"
            :key="index"
            class="divList"
            :class="item.paramType == 8 || item.paramType == 1 || item.paramType == 2 || item.paramType == 11 || item.type == 2 ? 'divListBlock' : 'divListLine'"
            style="padding-bottom: 8px">
            <div class="item-wrap">
              <!--默认添加的-->
              <a-form-item v-if="item.type == 1 && !item.paramType" :label="item.elementParamName">
                <a-input v-model:value="item.defaultValue" class="inputStyle" @change="(val: any) => changeInput(item.defaultValue, item, index)"></a-input>
              </a-form-item>
              <a-form-item v-if="item.paramType == 7 && item.inputOuputProperties === 'IN'" :label="item.elementParamName">
                <a-input
                  v-model:value="item.defaultValue"
                  :id="item.associationParamNum"
                  class="inputStyle"
                  :class="item.className"
                  @change="(val: any) => changeInput(item.defaultValue, item, index)" />
              </a-form-item>
              <a-form-item v-if="item.paramType == 7 && item.inputOuputProperties === 'OUT'" :label="item.elementParamName">
                <a-input v-model:value="item.defaultValue" :id="item.associationParamNum" class="inputStyle" disabled />
              </a-form-item>
              <!--下拉值 -->
              <a-form-item v-if="item.paramType == 9" :label="item.elementParamName + '：'" :key="index">
                <a-select v-model:value="item.defaultValue" style="width: 150px" class="ant-select" allow-clear @change="viewActionFun(item)">
                  <a-select-option v-for="item2 in JSON.parse(item.dropDownValue)" :key="item2.value" :value="item2.label">
                    {{ item2.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <!--单选按钮 -->
              <a-form-item v-if="item.paramType == 10" :label="item.elementParamName + '：'">
                <a-radio-group v-model:value="item.defaultValue" @change="viewActionFun(item)">
                  <a-radio v-for="(item2, index) in JSON.parse(item.dropDownValue)" :key="index" :value="item2.label" class="radioStyle">
                    {{ item2.label }}
                  </a-radio>
                </a-radio-group>
              </a-form-item>
              <!--范围值显示 -->
              <div v-if="item.paramType == 7 && item.definitionScopeModality" style="margin-left: 5px; margin-right: 5px; margin-top: 30px">
                <div v-if="item.definitionScopeModality == 1">
                  <div class="rx-range-div">X=<span v-html="getRangeStr(item.definitionScope, 'left')"></span></div>
                </div>
                <div v-if="item.definitionScopeModality == 2">
                  <div class="rx-range-div">X＞<span v-html="getRangeStr(item.definitionScope, 'left')"></span></div>
                </div>
                <div v-if="item.definitionScopeModality == 3">
                  <div class="rx-range-div">X≥<span v-html="getRangeStr(item.definitionScope, 'left')"></span></div>
                </div>
                <div v-if="item.definitionScopeModality == 4">
                  <div class="rx-range-div">X＜<span v-html="getRangeStr(item.definitionScope, 'left')"></span></div>
                </div>
                <div v-if="item.definitionScopeModality == 5">
                  <div class="rx-range-div">X≤<span v-html="getRangeStr(item.definitionScope, 'left')"></span></div>
                </div>
                <div v-if="item.definitionScopeModality == 6">
                  <div class="rx-range-div">
                    <span v-html="getRangeStr(item.definitionScope, 'left')"></span>＜X＜<span v-html="getRangeStr(item.definitionScope, 'right')"></span>
                  </div>
                </div>
                <div v-if="item.definitionScopeModality == 7">
                  <div class="rx-range-div">
                    <span v-html="getRangeStr(item.definitionScope, 'left')"></span>≤X＜<span v-html="getRangeStr(item.definitionScope, 'right')"></span>
                  </div>
                </div>
                <div v-if="item.definitionScopeModality == 8">
                  <div class="rx-range-div">
                    <span v-html="getRangeStr(item.definitionScope, 'left')"></span>＜X≤<span v-html="getRangeStr(item.definitionScope, 'right')"></span>
                  </div>
                </div>
                <div v-if="item.definitionScopeModality == 9">
                  <div class="rx-range-div">
                    <span v-html="getRangeStr(item.definitionScope, 'left')"></span>≤X≤<span v-html="getRangeStr(item.definitionScope, 'right')"></span>
                  </div>
                </div>
              </div>
              <!--知识图标显示 -->
              <div class="rx-knowledge-wrap" v-if="item.paramType == 7 && item.knowledgeDefinition" style="margin-top: 10px; margin-left: 10px">
                <a-tooltip :title="item.knowledgeDefinition" placement="top">
                  <EpcIcon class="infoFilled-ico" type="icon-xiangqingon" :style="{ fontSize: '18px' }" />
                </a-tooltip>
              </div>
            </div>
            <!--分割线-->
            <div class="block-layout" v-if="item.paramType == 11">
              <a-divider style="width: 98%; margin: 10px 0 0 0" />
            </div>
            <!--标题 -->
            <div class="block-layout" v-if="item.paramType == 8">
              <a-form-item v-if="item.paramType == 8" :label="item.elementParamName" style="font-weight: 700; height: 32px; line-height: 32px"> &nbsp; </a-form-item>
            </div>
            <div class="block-layout" v-if="item.paramType == 1">
              <!--文本域 -->
              <a-form-item v-if="item.paramType == 1" :label="item.elementParamName + '：'">
                <a-textarea
                  v-model:value="item.defaultValue"
                  v-if="item.inputOuputProperties != 'OUT'"
                  placeholder=""
                  style="width: 40vw; padding-left: 10px"
                  @change="viewActionFun(item)" />
                <a-textarea v-model:value="item.defaultValue" v-else placeholder="" style="width: 40vw; background-color: #f3f3f3; padding-left: 10px" disabled />
              </a-form-item>
            </div>
            <div class="block-layout" v-if="item.paramType == 2">
              <!--计算校核按钮 -->
              <a-form-item v-if="item.paramType == 2" :style="'margin-left:' + item.leftMargin + 'px;'">
                <a-button v-if="item.buttonName != ''" type="primary" class="btnStyPage2" style="margin-left: 5px" @click="calcBtn(item)">
                  <EpcIcon type="icon-jisuan" style="font-size: 17px" />
                  {{ item.buttonName }}
                </a-button>
                <a-button v-else type="primary" class="btnStyPage2" style="margin-left: 5px" @click="calcBtn(item)">
                  <EpcIcon type="icon-jisuan" style="font-size: 17px" />
                  计算</a-button
                >
                <a-button v-if="!item.callFunctionName" type="primary" class="btnStyPage2" style="margin-left: 5px" @click="reoprt(item)">
                  <EpcIcon type="icon-daochu" style="font-size: 13px" />
                  输出报告</a-button
                >
              </a-form-item>
            </div>
            <!-- 表格配置 -->
            <!-- <div
              style="text-align: left"
              v-if="item.type == '2'"
              :style="{
                display: item.tableMap.preference == 0 ? 'none' : 'block',
              }"
            > 
              <div
                v-if="
                  item.tableMap.tableType == 1 ||
                  item.tableMap.tableType == 3 ||
                  item.tableMap.tableType == 2
                "
              >
                <a-form-item
                  class="formitem"
                  :label="item.tableMap.tableName"
                  layout="inline"
                  :key="index"
                >
                  <a
                    v-if="
                      item.tableMap.tableBtnMess != null &&
                      item.tableMap.tableBtnMess.indexOf('计算') != -1
                    "
                    >计算</a
                  >
                  <a
                    v-if="
                      item.tableMap.tableBtnMess != null &&
                      item.tableMap.tableBtnMess.indexOf('刷新') != -1
                    "
                    >刷新</a
                  >
                  <a
                    v-if="
                      item.tableMap.tableBtnMess != null &&
                      item.tableMap.tableBtnMess.indexOf('添加行') != -1
                    "
                    >添加行</a
                  >
                  <a
                    v-if="
                      item.tableMap.tableBtnMess != null &&
                      item.tableMap.tableBtnMess.indexOf('删除行') != -1
                    "
                    >删除行</a
                  >
                </a-form-item>
              </div> 
              <div
                class="workList"
                v-if="
                  item.tableMap.tableType == 1 ||
                  item.tableMap.tableType == 3 ||
                  item.tableMap.tableType == 2
                "
              >
                <div
                  class="settingTableWrap"
                  :style="
                    'width:' +
                    item.tableMap.tableTotalWidth +
                    'px;height:' +
                    item.tableMap.tableTotalHeight +
                    'px;'
                  "
                >
                  <div
                    class="settingTitleTable btnWrap"
                    :style="'width:' + item.tableMap.tableTotalWidth + 'px;'"
                  >
                    <div
                      class="titleTableItemWrap btnWrap"
                      v-for="(itemcol, index) in item.tableMap.colList"
                      :key="index"
                    >
                      <div
                        :class="
                          index == item.tableMap.colList.length - 1
                            ? 'titleTableItemLast'
                            : 'titleTableItem' + index
                        "
                        v-if="itemcol.colName != '操作'"
                        class="titleTableItem btnWrap"
                        :style="'width: ' + itemcol.colWidth + 'px;'"
                      >
                        <span v-if="itemcol.colName == null">&nbsp;</span>
                        <span v-else> {{ itemcol.colName }}1</span>
                      </div>
                      <div
                        :class="
                          index == item.tableMap.colList.length - 1
                            ? 'titleTableItemLast'
                            : 'titleTableItem' + index
                        "
                        v-else
                        class="titleTableItem btnWrap"
                        :style="'width: ' + itemcol.colWidth + 'px;'"
                      >
                        {{ itemcol.colName }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
               
              <div
                v-if="
                  item.tableMap.tableType == 4 || item.tableMap.tableType == 5
                "
                class="textHot"
              >
                {{ item.tableMap.tableName }}
              </div>
              <div
                class="handsontableStyle"
                v-if="
                  item.tableMap.tableType == 4 || item.tableMap.tableType == 5
                "
                :style="
                  'width:' +
                  item.tableMap.tableTotalWidth +
                  'px;height:' +
                  item.tableMap.tableTotalHeight +
                  'px;'
                "
              >
                <hot-table
                  ref="hotTableInstance"
                  :id="item.tableMap.tableNum"
                  :settings="getHotSetting(item.tableMap, index)"
                  :licenseKey="licenseKey"
                ></hot-table>
              </div>
            </div> -->
          </div>
        </a-form>
      </div>
      <div class="imgWrap" v-if="imageList && imageList.length > 0">
        <a-image :src="item.filePath" v-for="(item, index) in imageList" :key="index" class="img" :style="{ marginTop: item.distanceUp + 'px' }" />
      </div>
    </div>

    <!-- Ant Design Vue 模态框 -->
    <a-modal
      :destroyOnClose="true"
      :maskClosable="false"
      :closable="false"
      :mask="true"
      width="1300"
      v-model:open="viewExcelFileDialogVisible"
      :footer="null"
      :wrapClassName="fullscreenType ? 'fullscreen-modal' : 'normal-modal'"
      @cancel="viewExcelFileDialogVisible = false">
      <template #title>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px">
          <span style="font-weight: bold; color: black">附件预览</span>
          <span style="display: flex; align-items: center">
            <fullscreen-outlined style="cursor: pointer; margin-right: 15px; color: black" @click="fullscreenType = !fullscreenType" />
            <close-outlined style="cursor: pointer; color: black" :size="18" @click="viewExcelFileDialogVisible = false" />
          </span>
        </div>
      </template>
      <div :style="fullscreenType ? 'height:' + '90vh' : 'height:' + knowledgemodelHeight">
        <div
          id="pdfUrl"
          :style="{
            height: fullscreenType ? '100vh' : knowledgemodelHeight,
            overflow: 'auto',
          }">
          <vue-office-excel :src="excelFileUrl"></vue-office-excel>
        </div>
      </div>
      <template #footer>
        <div style="text-align: right">
          <a-button type="primary" style="margin-right: 8px">
            <a :href="excelFileUrl" style="color: #fff" download>下载</a>
          </a-button>
          <a-button @click="viewExcelFileDialogVisible = false">关闭</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import { HotTable } from '@handsontable/vue3';
import { registerAllModules } from 'handsontable/registry';
import { downloadFileFromStream } from '@/utils/file.ts';
import { useUserStore } from '@/store/modules/user';
import 'handsontable/languages/zh-CN'; //中文包
import 'handsontable/dist/handsontable.full.css';
import { onBeforeRouteLeave } from 'vue-router';
import Handsontable from 'handsontable';
import VueOfficeExcel from '@vue-office/excel';
import '@vue-office/excel/lib/index.css';
import { message, Modal } from 'ant-design-vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { AdminApiSystemCheckFlowInfoApi } from '@/api/tags/check/计算流程后台';

registerAllModules();
const viewExcelFileDialogVisible = ref<any>(false);
const fullscreenType = ref<any>(true);
const knowledgemodelHeight = ref<any>(window.innerHeight - 330 + 'px');
const excelFileUrl = ref<any>('');
const hotTableInstance = ref<any>();
const licenseKey = '74a2a-fc683-0276b-e0213-3e4d4';
// 总数据
const parameterTempList = ref<any>([]);

// 反显的图片集合
const imageList = ref<any>([]);

const defProps = defineProps({
  flagSon: Boolean,
  showBackArr: Array,
  treeId: String,
  parentId: String,
  jsfilePath: String,
  initCallMethod: String,
  paramsArr: Array,
  showBackImg: Array,
  exeData: Object,
  pageFormKey: String,
  objdata: Object,
  pageHeight: String,
  pageImgStr: String,
  formKeyArr: Array,
  calcId: String,
  proId: String,
  selectPageData: {
    require: false,
    type: Object,
    default: () => {},
  },
  paramData: {
    require: false,
    type: Object,
    default: () => {},
  },
});
// 输入框构造发送的数据
const rowColumn = ref<any>([]);
// 输出框构造发送的数据
const outData = ref<any>([]);
const resultData = ref<any>([]);
// 输入参数
const dateArr = ref<any>([]);
// 输出参数
const outDataArr = ref<any>([]);
// exe程序数据
const dataExe = ref<any>({});
const pageNewFormKey = ref<any>('');
// 图片信息
const imgUrlStr = ref<any>('');

const emit = defineEmits(['on-click', 'getTempalteInfoSuccess', 'afterCreateRowSuccess', 'changeData', 'changData']);

// 获取点击图片得到的formKey
const formKeyArr = ref<any>([]);

// 主表选中的数据
const nextSelectData = ref<any>({});

//JS AllPageCalculateParamList
const allPageCalculateParamList = ref<any>({});
const h = ref(window.innerHeight - 202 + 'px');

watch(
  () => defProps.pageFormKey,
  val => {
    if (val) {
      pageNewFormKey.value = val;
      if (formKeyArr.value[0] == val && defProps.initCallMethod) {
        nextTick(() => {
          let __paramsArr = JSON.stringify(defProps.paramsArr);
          let callBackData = eval(defProps.initCallMethod + '(' + __paramsArr + ')');
          callBackData;
        });
      }
    }
  }
);

watch(
  () => defProps.flagSon,
  val => {
    if (val === true) {
      saveFun();
    }
  },
  {
    deep: true,
  }
);

// 获取总数居
watch(
  () => defProps.showBackArr,
  val => {
    debugger;
    console.log(val);
    parameterTempList.value = [];
    if (val && val.length > 0) {
      // 整个页面的总数居
      parameterTempList.value = val;
      nextTick(() => {
        let hotTableDataArr: any = [];
        parameterTempList.value.forEach((item: any, index: any) => {
          if ((item.tableMap && item.tableMap.tableType == 4) || (item.tableMap && item.tableMap.tableType == 5)) {
            hotTableDataArr.push(item);
          }
        });
        if (hotTableDataArr && hotTableDataArr.length > 0) {
          hotTableInstance.value?.forEach((item: any, index: any) => {
            hotTableDataArr.forEach((itm: any, idx: any) => {
              if (item.hotInstance.getSettings().title == itm.tableMap?.tableName) {
                item.hotInstance.updateSettings(itm.tableMap.hotSettings);
              }
            });
          });
        }
      });
    }
  }
);

// exe程序数据
watch(
  () => defProps.exeData,
  val => {
    if (val) {
      dataExe.value = val;
    }
  }
);

// 获取反显的图片
watch(
  () => defProps.showBackImg,
  val => {
    if (val && val.length > 0) {
      imageList.value = val;
    }
  }
);
watch(
  () => defProps.formKeyArr,
  val => {
    if (val && val.length > 0) {
      formKeyArr.value = val;
    }
  }
);

//  关联参数
watch(
  () => defProps.paramsArr,
  val => {
    val && paramsFelevanceValueShow(val);
  },
  { deep: true }
);

//获取取值范围类型
const getRangeStr = (data: any, type: any) => {
  let str = '';
  if (type == 'left') {
    str = JSON.parse(data).left;
  } else {
    str = JSON.parse(data).right;
  }
  return str;
};

//关联参数反显 table
const paramsFelevanceValueShow = (val: any) => {
  nextTick(() => {
    setTimeout(() => {
      val.forEach((item: any, index: any) => {
        parameterTempList.value.forEach((itm: any) => {
          let tableData = itm.tableMap?.hotSettings.data;
          itm.tableMap?.hotSettings?.dataDetail?.forEach((i: any, idx: any) => {
            for (let serial in i) {
              if (item.associationId == i[serial].tableInfoParameterId) {
                tableData[idx][serial] = item.associationValue;
              }
            }
          });
        });
      });
    }, 500);
  });
};

// 设置校验后input的calss
const conditionsFun = (item: any, definitionScopeValue: any, index: any) => {
  if (definitionScopeValue == 1) {
    parameterTempList.value[index].defaultValue = '';
    message.warning(`参数：“${item.paramName}“输入数值范围不符合`);
    return;
  } else {
    item.className = 'fontRedColor';
    message.warning(`参数：“${item.paramName}“输入数值范围不符合，请注意！`);
    return;
  }
};
//校验输入值
const verifyInputValue = (val: any, item: any, index: any) => {
  let definitionScopeModality = item.definitionScopeModality; //条件
  let definitionScopeValue = item.definitionScopeValue; //1,强制性范围;2,警告性范围
  let scopeValueArr = JSON.parse(item.definitionScope); //范围值
  item.className = '';
  //x=10
  if (definitionScopeModality == 1 && val && val != parseFloat(scopeValueArr['left'])) {
    conditionsFun(item, definitionScopeValue, index);
  }
  //x>10
  if (definitionScopeModality == 2 && val && val <= parseFloat(scopeValueArr['left'])) {
    conditionsFun(item, definitionScopeValue, index);
  }
  //x>=10
  if (definitionScopeModality == 3 && val && val < parseFloat(scopeValueArr['left'])) {
    conditionsFun(item, definitionScopeValue, index);
  }
  //x<10
  if (definitionScopeModality == 4 && val && val >= parseFloat(scopeValueArr['left'])) {
    conditionsFun(item, definitionScopeValue, index);
  }
  //x<=10
  if (definitionScopeModality == 5 && val && val > parseFloat(scopeValueArr['left'])) {
    conditionsFun(item, definitionScopeValue, index);
  }
  //10<x<20
  if (definitionScopeModality == 6 && val && (val <= parseFloat(scopeValueArr['left']) || val >= parseFloat(scopeValueArr['right']))) {
    conditionsFun(item, definitionScopeValue, index);
  }
  //10=<x<20
  if (definitionScopeModality == 7 && val && (val < parseFloat(scopeValueArr['left']) || val >= parseFloat(scopeValueArr['right']))) {
    conditionsFun(item, definitionScopeValue, index);
  }
  //10<x<=20
  if (definitionScopeModality == 8 && val && (val <= parseFloat(scopeValueArr['left']) || val > parseFloat(scopeValueArr['right']))) {
    conditionsFun(item, definitionScopeValue, index);
  }
  //10=<x<=20
  if (definitionScopeModality == 9 && val && (val < parseFloat(scopeValueArr['left']) || val > parseFloat(scopeValueArr['right']))) {
    conditionsFun(item, definitionScopeValue, index);
  }
};

// 改变输入框的值
const changeInput = (val: any, item: any, index: any) => {
  emit('changData', false);
  if (item.callFunctionName) {
    setTimeout(() => {
      let callBackData = eval(item.callFunctionName + '(' + val + ')');
      callBackData;
    }, 500);
  }
  if (item.associationParam) {
    // getTempalteInfo(item.associationParam);
  } else {
    emit('getTempalteInfoSuccess', '');
  }
  if (val) {
    parameterTempList.value.map((v: any) => {
      if (v.elementParamName === item.name && v.inputOuputProperties === 'IN' && v.paramType === '7') {
        v.defaultValue = val;
      }
    });
    verifyInputValue(val, item, index);
  }
};

// 处理输入框的值重构数据 点击计算的时候用
const resetData = data => {
  let result = [];
  // 3个为一组进行数组切割，加上封号
  for (let i = 0; i < data.length; i += 4) {
    result.push(data.slice(i, i + 4) + ';');
  }
  return result;
};

const controlsHsTableDataFun = (tableName: any, settingData: any) => {
  if (allPageCalculateParamList.value && allPageCalculateParamList.value.length > 0) {
    allPageCalculateParamList.value?.forEach((item: any, index: any) => {
      item.forEach((itm: any, idx: any) => {
        if (itm.tableMap?.tableName == tableName) {
          itm.tableMap.hotSettings.data = settingData;
        }
      });
    });
  }
};

const getHotSetting = (tableMap: any, index: any) => {
  let setting = tableMap.hotSettings || {}; //hotSettings
  let tableType = tableMap.tableType; //表格类型
  let tableName = tableMap.tableName; //表格名称
  let colNum = setting.data[0]?.length;
  setting.autoColumnSize = false; // 禁止自动扩展列
  setting.readOnlyCellClassName = 'is-readOnly';

  if (tableType == 5) {
    setting.contextMenu = {
      items: {
        row_below: {
          name: '下方插入一行',
        },
        remove_row: {
          name: '删除行',
        },
      },
      callback: () => {},
    };
  } else {
    setting.contextMenu = {
      items: {},
      callback: () => {},
    };
  }
  //鼠标点击事件
  setting.afterOnCellMouseDown = (event: any, coords: any, TD: any) => {
    let colItem = tableMap.colList[coords.col];
    let jsCallFunName = colItem.callFunctionName; //配置的js调用函数名称
    let jsActionType = colItem.callFunctionType; //配置的js调用事件
    let cellValue = '';
    if (jsCallFunName && jsActionType == 'click') {
      handleHsTableActionPublicFun(coords.row, coords.col, cellValue, tableName, jsActionType, jsCallFunName);
    }
  };
  //选中事件
  setting.afterSelection = (row: any, column: any) => {
    let colItem = tableMap.colList[column];
    let tableInfoParameterId = colItem.parameterId; //参数ID
    if (tableInfoParameterId) {
      //   getTempalteInfo(tableInfoParameterId);
    } else {
      emit('getTempalteInfoSuccess', '');
    }
  };
  setting.afterChange = (changes: any, source: any) => {
    if (changes && changes.length > 0) {
      let rowIndex = changes[0][0]; //第几行
      let colIndex = changes[0][1]; //第几列
      let colItem = tableMap.colList[colIndex];
      let jsCallFunName = colItem.callFunctionName; //配置的js调用函数名称
      let jsActionType = colItem.callFunctionType; //配置的js调用事件
      let cellValue = changes[0][3];
      if (source == 'CopyPaste.paste') {
        if (cellValue) {
          parameterTempList.value.forEach((item: any) => {
            if (item.tableName == tableName && item.tableMap) {
              item.tableMap.hotSettings.data[rowIndex][colIndex] = cellValue;
            }
          });
        }
        hotTableInstance.value?.forEach((item: any, idx: any) => {
          if (item.hotInstance.getSettings().className == tableName) {
            setting.cell = changeSettingCell(item.hotInstance.getSettings().data, item.hotInstance.getSettings().cell);
            controlsHsTableDataFun(tableName, item.hotInstance.getSettings().data);
            nextTick(() => {
              item.hotInstance.render();
            });
          }
        });
      } else if (source == 'edit' && changes) {
        emit('changData', false);
        if (allPageCalculateParamList.value && allPageCalculateParamList.value.length > 0) {
          allPageCalculateParamList.value?.forEach((item: any, index: any) => {
            item.forEach((itm: any, idx: any) => {
              if (itm.tableMap?.tableName == tableName && cellValue) {
                itm.tableMap.hotSettings.data[rowIndex][colIndex] = cellValue;
              }
            });
          });
        }
        if (jsCallFunName) {
          handleHsTableActionPublicFun(rowIndex, colIndex, cellValue, tableName, jsActionType, jsCallFunName);
        }
        if (cellValue) {
          parameterTempList.value.forEach((item: any) => {
            //console.log(item);
            if (item.tableName == tableName && item.tableMap) {
              item.tableMap.hotSettings.data[rowIndex][colIndex] = cellValue;
            }
          });
        }
      }
    }
  };
  //删除行
  setting.afterRemoveRow = (index: any, amount: any, physicalRows: any) => {
    controlsHsTableDataFun(tableName, setting.data);
  };
  //添加行
  setting.afterCreateRow = (index: any, amount: any, source: any) => {
    hotTableInstance.value?.forEach((item: any, idx: any) => {
      if (item.hotInstance.getSettings().className == tableName) {
        setting.cell = changeSettingCell(item.hotInstance.getSettings().data, item.hotInstance.getSettings().cell);
        controlsHsTableDataFun(tableName, item.hotInstance.getSettings().data);
        nextTick(() => {
          item.hotInstance.render();
        });
      }
    });
  };
  setting.beforeCreateCol = (index: any, amount: any, source: any) => {
    if (index >= Number(colNum - 1)) {
      return false;
    }
  };
  //更新setting
  setting.afterUpdateSettings = () => {
    let hot = null;
    const element = document.getElementById(tableMap.tableNum);
    if (!element) {
      return;
    }
    hot = new Handsontable(element, setting);
  };
  setting.cell = changeSettingCell(setting.data, setting.cell);
  setting.licenseKey = licenseKey;

  return setting;
};

//处理hsTable单元格的click以及change事件的公共方法,更新allPageCalculateParamList相关修改内容
const handleHsTableActionPublicFun = (rowIndex: any, colIndex: any, cellValue: any, tableName: any, jsActionType: any, jsCallFunName: any) => {
  if (allPageCalculateParamList.value && allPageCalculateParamList.value.length > 0) {
    allPageCalculateParamList.value?.forEach((item: any, index: any) => {
      item.forEach((itm: any, idx: any) => {
        if (itm.tableMap && itm.tableMap.tableName == tableName && cellValue) {
          itm.tableMap.hotSettings.data[rowIndex][colIndex] = cellValue;
        }
      });
    });
    publickJsInvoke(rowIndex, jsActionType, jsCallFunName);
  }
};

//调用外挂JS的公共方法
const publickJsInvoke = (rowIndex: any, jsActionType: any, jsCallFunName: any) => {
  let argument = {
    rowIndex: rowIndex,
    jsActionType: jsActionType, //事件类型
    paramsTempListArr: allPageCalculateParamList.value,
  };
  let __parsms = JSON.stringify(argument);
  let jsCallBack = eval(jsCallFunName + '(' + __parsms + ')');
  if (jsCallBack && jsCallBack.length > 0) {
    allPageCalculateParamList.value = jsCallBack;
    updateHsTableSetting();
  }
};

//外挂JS回传Data遍历更新hstable数据
const updateHsTableSetting = () => {
  let hotTableDataArr: any = [];
  allPageCalculateParamList.value?.forEach((item: any, index: any) => {
    item.forEach((itm: any, idx: any) => {
      if (itm.tableMap?.tableType == 4 || itm.tableMap?.tableType == 5) {
        hotTableDataArr.push(itm);
      }
    });
  });
  if (hotTableDataArr && hotTableDataArr.length > 0) {
    hotTableDataArr.forEach((item: any, index: any) => {
      hotTableInstance.value?.forEach((itm: any, idx: any) => {
        if (item.tableMap.tableName == itm.hotInstance.getSettings().className) {
          item.tableMap.hotSettings.cell = changeSettingCell(item.tableMap.hotSettings.data, item.tableMap.hotSettings.cell);
          item.tableMap.hotSettings.contextMenu = {
            items: {
              row_below: {
                name: '下方插入一行',
              },
              remove_row: {
                name: '删除行',
              },
            },
          };
          item.tableMap.hotSettings.licenseKey = licenseKey;
          itm.hotInstance.updateSettings(item.tableMap.hotSettings);
        }
      });
    });
  }
};

const changeSettingCell = (settingData: any, settingColumnsMap: any) => {
  let arr = [];
  arr = settingColumnsMap;
  return arr;
};
// 计算按钮calcBtn
const calcBtn = async (item: any) => {
  rowColumn.value = [];
  outData.value = [];
  if (item.callFunctionName) {
    setTimeout(() => {
      eval(item.callFunctionName + '()');
    }, 1000);
  } else {
    let sheet;
    let sellData: any = [];
    parameterTempList.value.map((v: any) => {
      if (v.extendTable) {
        sheet = v.extendTable;
      }
      if (v.cellNumber) {
        excelData(v.cellNumber, v);
      }
      if ((v.tableMap && v.tableMap.tableType == 4) || (v.tableMap && v.tableMap.tableType == 5)) {
        sellData = sellData.concat(v.tableMap.hotSettings.cell);
      }
    });
    function getExl(data: any) {
      const regex = /([A-Za-z]+)(\d+)/;
      const result = data.match(regex);
      const letter = result[1];
      const number = parseInt(result[2]);
      return `${number},${columnToNumber(letter)}`;
    }
    let expTableStr: any = [];
    let impTableStr: any = [];
    sellData.forEach((item: any) => {
      if (item.paramType === '1') {
        expTableStr.push(`${item.sheetNum},${item.row},${item.col},${getExl(item.cellNum)}`);
      } else if (item.paramType === '0') {
        let val = '';
        let __data: any = [];
        function getVal(row: any, col: any) {
          parameterTempList.value.map((v: any) => {
            if ((v.tableMap && v.tableMap.tableType == 4) || (v.tableMap && v.tableMap.tableType == 5)) {
              __data = v.tableMap.hotSettings.data;
            }
          });
          val = __data[row][col];
          return val;
        }
        getVal(item.row, item.col);
        impTableStr.push(`${getExl(item.cellNum)},${val}`);
      }
    });
    dateArr.value = [];
    outDataArr.value = [];
    // 输入的参数处理
    const arrayData = resetData(rowColumn.value);
    dateArr.value = [...new Set(arrayData)];
    const configurationData = dateArr.value.join('');
    // 输出的参数处理
    const data = resetData(outData.value);
    outDataArr.value = [...new Set(data)];
    const dataFilter = outDataArr.value.join('');
    const params = {
      pageId: pageNewFormKey.value ? pageNewFormKey.value : formKeyArr.value[0],
      sheetNum: sheet,
      impStr: configurationData + impTableStr.join(';'),
      expStr: dataFilter,
      expTableStr: expTableStr.join(';'),
      userId: useUserStore().getUser.id,
      pageImgStr: defProps.pageImgStr,
    };
    const res = await AdminApiSystemCheckFlowInfoApi.calculate(params);
    if (res && res.data.code === '0') {
      message.success('计算成功');
      outData.value = [];
      rowColumn.value = [];
      resultData.value = [];
      imgUrlStr.value = res.data.data.imgUrlStr;
      res.data.data.result.map((v: any) => {
        resultData.value.push(...Object.entries(v));
      });
      resultData.value.map((e: any) => {
        parameterTempList.value.map((l: any) => {
          if (l.inputOuputProperties === 'OUT' && l.id == e[0]) {
            l.defaultValue = e[1];
          }
        });
      });

      hotTableInstance.value?.forEach((item: any, index: any) => {
        //console.log(item, ' hotTableInstance.value');
        if (res.data.data.tableMap) {
          res.data.data.tableMap.forEach((i: any) => {
            item.hotInstance.setDataAtRowProp(i.rowNum, i.colNum, i.values);
          });
        }
      });
    } else {
      dateArr.value = [];
      outDataArr.value = [];
    }
  }
  if (item.associationParam) {
    // getTempalteInfo(item.associationParam);
  } else {
    emit('getTempalteInfoSuccess', '');
  }
};

//输出报告
const reoprt = async (item: any) => {
  var arrArr: any = [];
  parameterTempList.value.forEach((ite: any) => {
    if (ite.paramType == '7') {
      if (ite.defaultValue != null && ite.defaultValue != '' && ite.defaultValue != undefined) {
        let str = `{{${ite.associationParamNum}}}:${ite.defaultValue};`;
        arrArr.push(str);
      }
    }
  });
  debugger;
  const res = await AdminApiSystemCheckFlowInfoApi.expTemplateReports({
    userid: useUserStore().getUser.id,
    id: defProps.paramData.treeId,
    imps: arrArr.join(''),
    picImps: imgUrlStr.value,
    fileName: nextSelectData.value.projectName,
  });
  const fileName = defProps.proId + '-' + defProps.calcId + '计算报告.docx';
  downloadFileFromStream(res, fileName);
};

const paramsData = ref([]);
// 计算UUID
const calculateUUID = ref('');

// 下拉框和文本域的修改
const viewActionFun = (data: any) => {
  emit('changData', false);
  if (data.callFunctionName) {
    setTimeout(() => {
      let obj = JSON.stringify({
        type: data.defaultValue,
      });
      let callBackData = eval(data.callFunctionName + '(' + obj + ')');
      callBackData;
    }, 500);
  } else {
    parameterTempList.value.map((v: any) => {
      if (v.paramType === '9' && v.id === data.id && data.paramType === '9') {
        v.defaultValue = data.defaultValue;
      }
      if (v.paramType === '1' && v.id === data.id && data.paramType === '1') {
        v.defaultValue = data.defaultValue;
      }
      if (v.paramType === '10' && v.id === data.id && data.paramType === '10') {
        v.defaultValue = data.defaultValue;
      }
    });
  }
};

// 根据名称框获取行和列
const excelData = (data: any, obj: any) => {
  //console.log('data', data, 'obj', obj);
  if (obj.inputOuputProperties && obj.inputOuputProperties === 'IN' && obj.defaultValue) {
    const regex = /([A-Za-z]+)(\d+)/;
    const result = data.match(regex);
    const letter = result[1];
    const number = parseInt(result[2]);
    rowColumn.value.push(number, columnToNumber(letter), obj.defaultValue, obj.extendTable);
  }
  if (obj.inputOuputProperties && obj.inputOuputProperties === 'OUT') {
    const regex = /([A-Za-z]+)(\d+)/;
    const result = data.match(regex);
    const letter = result[1];
    const number = parseInt(result[2]);
    outData.value.push(obj.id, number, columnToNumber(letter), obj.extendTable);
  }
};
// 解析excel表格
const columnToNumber = (column: any) => {
  let result = 0;
  for (let i = 0; i < column.length; i++) {
    result = result * 26 + (column.charCodeAt(i) - 64);
  }
  return result;
};

//保存方法
const saveFun = async () => {
  const params = {
    paramVOList: parameterTempList.value,
    pagestatus: 0,
    pagemainid: defProps.selectPageData.id ? defProps.selectPageData.id : defProps.selectPageData.id,
    formKey: pageNewFormKey.value,
    calculateUUID: '',
  };
  if (calculateUUID.value) {
    params.calculateUUID = calculateUUID.value;
  }
  const res = await AdminApiSystemCheckFlowInfoApi.saveOrUpdateCalculateParamList(params);
  emit('changeData', true);
  emit('on-click', false);
  saveData();
};

// 保存数据
const saveData = async () => {
  if (allPageCalculateParamList.value && allPageCalculateParamList.value.length > 0) {
    let params = {
      paramAllList: allPageCalculateParamList.value,
    };
    const res = await AdminApiSystemCheckFlowInfoApi.updateAllPageCalculateParamList(params);
    allPageCalculateParamList.value = [];
  } else {
    //  saveFun();
  }
};

onMounted(() => {});
// 监听路由离开
onBeforeRouteLeave((to, from, next) => {
  allPageCalculateParamList.value = [];
  next();
});
</script>
<style lang="less" scoped>
.tit {
  padding-bottom: 10px;
  margin-bottom: 15px;
  border-bottom: 1px solid #f1f1f1;
}
.view-layout {
  height: calc(100vh - 30px);
  padding-left: 20px;
  padding-right: 2px;
  overflow-y: auto;
  margin-top: 0px;
  margin-bottom: 10px;
  .dialog-layout {
    display: flex;
    height: calc(100vh - 210px) !important;
    overflow: auto;
  }

  .formWrap {
    min-width: 75%;
    overflow: auto;
    padding-bottom: 30px;
    :deep(.ant-form-vertical) {
      display: flex;
      flex-wrap: wrap;
      .divList {
        margin-top: 10px;
        overflow: inherit;
        // width: 100%;
      }
      .divListBlock {
        width: 100%;
      }
      .divListLine {
        width: 368px;
      }
    }
  }

  .imgWrap {
    margin-left: 2%;
    width: 23%;
    border-left: 1px dotted #ddd;
    padding-left: 10px;
    overflow: hidden;
    .img {
      border: 1px solid #f0f0f0;
      width: 100%;
      display: block;
      border-radius: 5px;
    }
  }

  .formitem {
    margin-bottom: 0px;

    :deep(.ivu-form-item-label) {
      font-size: 14px !important;
      text-align: left;
    }

    :deep(.ivu-form-item-content) {
      display: flex;

      a {
        color: #1971ff;
        margin-left: 20px;
        min-width: 30px;
      }
    }
  }

  .divList {
    margin-top: 12px;
    overflow: inherit;
  }

  :deep(.ht_master .wtHolder) {
    overflow: auto;
  }

  .btnWrap {
    // display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    color: #222;
  }

  .titleTableItem {
    height: 32px;
    line-height: 32px;
    background-color: #f1f1f1;
    cursor: pointer;
    border-left: 1px solid #e8eaec;
    border-right: 1px solid #e8eaec;
  }

  .textHot {
    font-size: 14px !important;
    text-align: left;
    margin-bottom: 5px;
  }

  .item-wrap {
    display: flex;
    align-items: center;
    :deep(.ivu-form-item) {
      margin-bottom: 10px;
    }
  }
}
:deep(.workList .vxe-body--column) {
  height: 32px !important;
  line-height: 32px !important;
  padding: 0 !important;
  background-image: linear-gradient(#f0f0f0, #f0f0f0), linear-gradient(#f0f0f0, #f0f0f0);
}
.settingTableWrap {
  width: 100%;
  overflow: auto;
}
.celllist {
  text-align: center;
}
.settingTitleTable {
  height: 32px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-bottom: none;
}
.titleTableItemWrap {
  box-sizing: border-box;
}
:deep(.el-input__wrapper) {
  border: none !important;
  box-shadow: none !important;
  padding: 0px !important;
}
:deep(.el-dialog .el-dialog__footer) {
  border-top: none !important;
}
.elselect {
  :deep(.el-input__inner) {
    padding: 0 10px;
  }

  :deep(.el-icon) {
    right: 10px;
  }
}
.infoFilled-ico {
  color: #1971ff;
  font-size: 18px;
  cursor: pointer;
}
.rx-range-div {
  width: 80px;
  height: 30px;
  color: #515a6e;
  line-height: 30px;
  font-size: 12px;
  border: 1px solid #dcdee2;
  background-color: #f3f3f3;
  margin-top: -25px;
  border-radius: 4px;
}
.inputStyle {
  width: 192px !important;
  border: 1px solid #dcdee2 !important;
  :deep(.el-input__inner) {
    padding-left: 10px !important;
  }
}
:deep(.ivu-input) {
  border-radius: 0 !important;
  border: none !important;
}
:deep(.htGhostTable) {
  z-index: 5069 !important;
}
.fontRedColor {
  :deep(.el-input__inner) {
    color: red;
  }
}
//hstable cell 背景色
:deep(.handsontable) {
  .cls-DCDCDC {
    background-color: #dcdcdc !important;
    cursor: default;
  }
  .cls-FF4500 {
    background-color: #ff4500 !important;
    cursor: default;
  }
  .cls-19BE6B {
    background-color: #19be6b !important;
    cursor: default;
  }
  .cls-FFD700 {
    background-color: #ffd700 !important;
    cursor: default;
  }
  th,
  td {
    white-space: nowrap;
  }
}
.excel-wrap {
  width: 100%;
  height: 550px;
  :deep(.vue-office-excel) {
    height: 550px;
  }
}

:deep(.viewExcelFileDialog .el-dialog__body) {
  margin: 0 !important;
  padding-bottom: 0;
}
:deep(.handsontable .is-readOnly) {
  background: #f0f0f0 !important;
}
</style>
