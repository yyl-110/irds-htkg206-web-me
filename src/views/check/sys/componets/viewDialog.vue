<template>
  <div class="dialogWarp">
    <a-modal width="100%" wrapClassName="full-modal" v-model:visible="viewDialogArgs.isShow" :title="'页面预览'" class="page-eldialog" :mask-closable="false" @closed="closedFun">
      <div class="dialog-layout">
        <div class="formWrap" :style="{ width: props.viewDialogArgs.workPageWidth + 'px' }">
          <a-form ref="formValidate" :layout="'vertical'" style="display: flex; flex-wrap: wrap">
            <div
              v-for="(item, index) in props.viewDialogArgs.data"
              :key="index"
              class="divList"
              :class="item.paramType == 8 || item.paramType == 1 || item.paramType == 2 || item.paramType == 11 || item.type == 2 ? 'divListBlock' : 'divListLine'"
              style="overflow: hidden">
              <div class="item-wrap">
                <!--默认添加的-->
                <a-form-item v-if="item.type == 1 && !item.paramType" :label="item.elementParamName">
                  <a-input v-model:value="item.defaultValue" style="width: 192px"></a-input>
                </a-form-item>
                <a-form-item v-if="item.paramType == 7 && item.inputOuputProperties === 'IN'" :label="item.elementParamName">
                  <a-input v-model:value="item.defaultValue" style="width: 192px"></a-input>
                </a-form-item>
                <a-form-item v-if="item.paramType == 7 && item.inputOuputProperties === 'OUT'" :label="item.elementParamName">
                  <a-input v-model:value="item.defaultValue" style="width: 192px !important" :id="item.associationParamNum" class="inputStyle" disabled />
                </a-form-item>
                <!--下拉值 -->
                <a-form-item v-if="item.paramType == 9" :label="item.elementParamName + '：'" abel-colon="true" :key="index">
                  <a-select v-model:value="item.defaultValue" style="border-radius: 5px; width: 192px" class="elselect">
                    <a-select-option v-for="item2 in JSON.parse(item.dropDownValue)" :key="item2.value" :value="item2.label" :label="item2.label" />
                  </a-select>
                </a-form-item>
                <!--单选按钮 -->
                <a-form-item v-if="item.paramType == 10" :label="item.elementParamName + '：'">
                  <RadioGroup v-model:value="item.defaultValue">
                    <Radio v-for="(item2, index) in JSON.parse(item.dropDownValue)" :key="index" :label="item2.label" class="radioStyle">{{ item2.label }}</Radio>
                  </RadioGroup>
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
                <div class="rx-knowledge-wrap" v-if="item.paramType == 7 && item.knowledgeDefinition" :style="item.paramType == 8 ? 'margin-top: 0;' : ' margin-top: 40px'">
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
                <!--标题行 -->
                <a-form-item v-if="item.paramType == 8" :label="item.elementParamName" style="font-weight: 700; height: 32px; line-height: 32px; overflow: hidden">
                  &nbsp;
                </a-form-item>
              </div>
              <div class="block-layout" v-if="item.paramType == 1">
                <!--文本域 -->
                <a-form-item v-if="item.paramType == 1" :label="item.elementParamName + '：'">
                  <a-textarea v-model:value="item.defaultValue" v-if="item.inputOuputProperties != 'OUT'" placeholder="" style="width: 560px; float: left; padding-left: 10px" />
                  <a-textarea v-model:value="item.defaultValue" v-else placeholder="" style="width: 560px; float: left; background-color: #f3f3f3; padding-left: 10px" disabled />
                </a-form-item>
              </div>
              <div class="block-layout" v-if="item.paramType == 2">
                <!--计算校核按钮 -->
                <a-form-item v-if="item.paramType == 2" :style="'margin-left:' + item.leftMargin + 'px;'">
                  <a-button type="primary" class="btnStyPage2" style="margin-left: 5px" v-if="item.buttonName != ''">{{ item.buttonName }}</a-button>
                  <a-button type="primary" class="btnStyPage2" style="margin-left: 5px" v-else>计算</a-button>
                </a-form-item>
              </div>
              <!-- 表格配置 -->
              <div
                style="text-align: left"
                v-if="item.type == '2'"
                :style="{
                  display: item.tableMap.preference == 0 ? 'none' : 'block',
                }">
                <!--标题行 -->
                <div
                  v-if="
                    item.tableMap.tableType == 1 || item.tableMap.tableType == 3 || item.tableMap.tableType == 2 || item.tableMap.tableType == 5 || item.tableMap.tableType == 4
                  ">
                  <a-form-item class="formitem" :label="item.tableMap.tableName" :key="index">
                    <a v-if="item.tableMap.tableBtnMess != null && item.tableMap.tableBtnMess.indexOf('计算') != -1">计算</a>
                    <a v-if="item.tableMap.tableBtnMess != null && item.tableMap.tableBtnMess.indexOf('刷新') != -1">刷新</a>
                    <a v-if="item.tableMap.tableBtnMess != null && item.tableMap.tableBtnMess.indexOf('添加行') != -1">添加行</a>
                    <a v-if="item.tableMap.tableBtnMess != null && item.tableMap.tableBtnMess.indexOf('删除行') != -1">删除行</a>
                  </a-form-item>
                </div>
                <!--表格内容 -->
                <div class="workList" v-if="item.tableMap.tableType == 1 || item.tableMap.tableType == 3 || item.tableMap.tableType == 2">
                  <div class="settingTableWrap" :style="'width:' + item.tableMap.tableTotalWidth + 'px;height:' + item.tableMap.tableTotalHeight + 'px;'">
                    <!-- 表格 -->
                    <div :style="{ width: item.tableMap.tableTotalWidth + 'px' }">
                      <vxe-table
                        border
                        :show-header="true"
                        :height="auto"
                        v-show="item.tableMap.tableType == 1 || item.tableMap.tableType == 3 || item.tableMap.tableType == 2"
                        @checkbox-change="checkboxChange"
                        @checkbox-all="checkboxChange"
                        @cell-dblclick="dblclick"
                        :column-config="{ resizable: true }"
                        :edit-config="{ trigger: dblclick }"
                        :checkbox-config="{
                          labelField: '',
                          trigger: 'row',
                          reserve: true,
                          range: true,
                        }"
                        size="small"
                        :sort-config="{ trigger: 'cell', showIcon: false }"
                        :data="item.tableMap.rowData"
                        ref="vxeTable1">
                        <vxe-column
                          v-for="(itemcol2, index2) in item.tableMap.colDataMap"
                          :key="index2"
                          sortable
                          align="center"
                          :field="'firstCol' + index2"
                          :title="itemcol2.colName"
                          :width="itemcol2.width">
                          <template v-slot="scope">
                            <div v-if="item.tableMap.firstColType == '序号' && index2 == 0" :key="'firstCol' + index2">
                              <div
                                class="btnWrap"
                                v-if="scope.row.moduleCateId != undefined && scope.row.moduleCateId != null && scope.row.moduleCateId != ''"
                                style="text-align: center; cursor: pointer; background-color: #19be6b; height: 32px">
                                {{ scope.seq }}
                              </div>
                              <div class="btnWrap" v-else style="text-align: center; cursor: pointer">
                                {{ scope.seq }}
                              </div>
                            </div>
                            <div v-if="item.tableMap.firstColType == '单选按钮' && index2 == 0" :key="'firstCol' + index2">
                              <div
                                class="btnWrap"
                                v-if="scope.row.moduleCateId != null && scope.row.moduleCateId != ''"
                                style="text-align: center; cursor: pointer; background-color: #19be6b; height: 32px">
                                <input type="radio" :id="item.tableId + '_' + scope.row.id" :name="itemcol2.id" />&nbsp;
                              </div>
                              <div class="btnWrap" v-else style="text-align: center; cursor: pointer">
                                <input type="radio" :id="item.tableId + '_' + scope.row.id" :name="itemcol2.id" />
                              </div>
                            </div>
                            <div v-if="item.tableMap.firstColType == '复选框' && index2 == 0" :key="'firstCol' + index2">
                              <div class="btnWrap" style="text-align: center; cursor: pointer">
                                <input type="checkbox" :id="item.tableId + '_' + scope.row.id" :name="itemcol2.id" />
                              </div>
                            </div>
                            <div
                              v-if="(item.tableMap.firstColType != '序号' && item.tableMap.firstColType != '单选按钮' && item.tableMap.firstColType != '复选框') || index2 != 0"
                              :key="'col' + index2">
                              <div>
                                <div class="celllist" style="text-align: center; cursor: pointer" v-if="itemcol2.callFunctionType == 'doubleclick'">
                                  <a-input style="border: none; width: 100%; display: block" v-model:value="scope.row[itemcol2.key]"></a-input>
                                </div>
                                <div class="celllist" style="text-align: center; cursor: pointer" v-else-if="itemcol2.callFunctionType == 'change'">
                                  <a-input style="border: none; width: 100%; display: block" v-model:value="scope.row[itemcol2.key]"></a-input>
                                </div>
                                <div class="celllist" style="text-align: center; cursor: pointer" v-else>
                                  <a-input style="border: none; width: 100%; display: block" v-model:value="scope.row[itemcol2.key]"></a-input>
                                </div>
                              </div>
                            </div>
                          </template>
                        </vxe-column>
                      </vxe-table>
                    </div>
                  </div>
                </div>
                <!--加载handsontable固定行列表格 -->
                <div v-if="item.tableMap.tableType == 4 || item.tableMap.tableType == 5" style="margin-top: -30px">
                  <hot-table
                    ref="textHot"
                    class="hottable"
                    :settings="getHotSetting(item.tableMap.hotSettings, index)"
                    id="hottable"
                    :licenseKey="licenseKey"
                    :style="'width:' + item.tableMap.tableTotalWidth + 'px;height:' + item.tableMap.tableTotalHeight + 'px;position:relative;'"></hot-table>
                </div>
              </div>
            </div>
          </a-form>
        </div>
        <div class="imgWrap" v-if="props.viewDialogArgs.parameterImgList && props.viewDialogArgs.parameterImgList.length > 0">
          <a-image :src="item.filePath" v-for="(item, index) in props.viewDialogArgs.parameterImgList" :key="index" class="img" :style="{ marginTop: item.distanceUp + 'px' }" />
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <a-button type="primary" @click="closedFun"><EpcIcon type="icon-quxiao" style="font-size: 15px" />关闭</a-button>
        </span>
      </template>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import { defineProps, ref, defineEmits, watch } from 'vue';
import { HotTable } from '@handsontable/vue3';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/languages/zh-CN'; //中文包
import 'handsontable/dist/handsontable.full.css';
import { EpcIcon } from '@/components/icon/EpcIcon';
const props = defineProps({
  viewDialogArgs: {
    require: false,
    type: Object,
    default: () => {},
  },
});
registerAllModules();
const licenseKey = '74a2a-fc683-0276b-e0213-3e4d4';
const textHot = ref();
const changesArr = ref();
const emit = defineEmits(['closeViewDialog']);
const closedFun = () => {
  emit('closeViewDialog');
};

function getRangeStr(data: any, type: any) {
  let str = '';
  if (type == 'left') {
    str = JSON.parse(data).left;
  } else {
    str = JSON.parse(data).right;
  }
  return str;
}
const reloadTableStyle = () => {};

function getHotSetting(setting: any, index: any) {
  setting = setting || {};
  setting.afterChange = (changes: any, source: any) => {
    if (changes && changes.length > 0) {
      changesArr.value = changes[0];
      if (changesArr.value) {
        setting.columnsMap.forEach((item: any) => {
          if (changesArr.value[1] == item.data && item.callFunctionType == 'change') {
            return;
          }
        });
      }
    }
  };
  setting.afterOnCellCornerDblClick = (event: any) => {
    // 同样添加检查，确保changesArr.value存在时再使用
    if (changesArr.value) {
      setting.columnsMap.forEach((item: any) => {
        if (changesArr.value[1] == item.data && item.callFunctionType == 'doubleclick') {
          return;
        }
      });
    }
  };
  let arr = [];
  setting.columnsMap.forEach((item: any, idx: any) => {
    arr.push({
      row: 0,
      col: idx,
      type: item.type ? item.type : '',
      source: item.source ? item.source : [],
      readOnly: item.readOnly,
      className: `cls-${item.colsBackgroundColor}`,
    });
  });
  setting.readOnlyCellClassName = 'is-readOnly';
  return setting;
}
defineExpose({ reloadTableStyle });
</script>
<style lang="less" scoped>
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
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
.dialog-layout {
  display: flex;
  height: calc(100vh - 150px) !important;
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
  :deep(.ant-form-item-label) {
    font-size: 14px !important;
    text-align: left;
  }
  :deep(.ant-form-item-content) {
    display: flex;
    a {
      color: #1971ff;
      margin-left: 20px;
      min-width: 30px;
    }
  }
}

.divList {
  margin-top: 10px;
  overflow: inherit;
}
.btnWrap {
  display: flex;
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
  :deep(.ant-form-item) {
    margin-bottom: 0;
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
:deep(.vxe-table .a-input__wrapper) {
  border: none !important;
  box-shadow: none !important;
  padding: 0px !important;
}
:deep(.a-dialog .a-dialog__footer) {
  border-top: none !important;
}
.elselect {
  :deep(.a-input__inner) {
    padding: 0 10px;
  }
  :deep(.a-icon) {
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
  margin-top: 5px;
  border-radius: 4px;
}
:deep(.htGhostTable) {
  z-index: 5069 !important;
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
}
.inputStyle {
  width: 150px !important;
  border-radius: 5px;
  border: 1px solid #dcdee2 !important;
  :deep(.a-input__inner) {
    padding-left: 6px !important;
  }
}
:deep(.handsontable .is-readOnly) {
  background: #f0f0f0 !important;
}
.dialog-footer {
  position: fixed;
  right: 20px;
  bottom: 30px;
}

:deep(.page-eldialog .el-dialog__footer) {
  border-top: none !important;
}
:deep(.page-eldialog .el-dialog__header) {
  border-bottom: 1px solid #e5e7ec;
  margin-right: 0;
  padding: 10px 20px;
}
:deep(.page-eldialog .el-dialog__body) {
  margin: 0;
}
:deep(.page-eldialog .el-dialog__headerbtn) {
  top: 0;
}
.dialogWarp {
  .dialog-footer {
    position: fixed;
    right: 20px;
    bottom: 20px;
  }
}
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
}
:deep(.handsontable .is-readOnly) {
  background: #f0f0f0 !important;
}
</style>
