<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import type { TableColumnsType } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { FileOutlined, FolderOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { WeiI18n } from '@/utils/WeiI18n';

const { t } = useI18n();

export type WbsRow = {
  id: string;
  serialNo: number;
  wbsCode: string;
  nodeName: string;
  planLevel: string;
  /** 是否必选项（开关） */
  required: boolean;
  /** 关联任务流程展示：节点名称 +「流程」；下拉行会同步为所选文案 */
  taskFlow: string;
  /** 序号 4、7 行：关联任务流程为下拉时的选中值 */
  taskFlowSelectValue?: string;
  children?: WbsRow[];
};

/** 指定序号行使用下拉选择关联任务流程 */
function isTaskFlowDropdownRow(row: WbsRow): boolean {
  return row.serialNo === 4 || row.serialNo === 7;
}

const TASK_FLOW_DROPDOWN_OPTIONS = [
  { value: 'flow_requirement', label: '需求分析类流程' },
  { value: 'flow_design', label: '方案设计类流程' },
  { value: 'flow_cost', label: '成本评审类流程' },
  { value: 'flow_review', label: '综合评审流程' },
];

function taskFlowLabelFromSelectValue(value: string | undefined, row: WbsRow): string {
  if (!value) return `${row.nodeName ?? ''}流程`;
  const hit = TASK_FLOW_DROPDOWN_OPTIONS.find(o => o.value === value);
  return hit?.label ?? `${row.nodeName ?? ''}流程`;
}

/** 根为一级，子节点依次为二级、三级…（深度 ≥100 时用阿拉伯数字 +「级」） */
function depthToTaskLevel(depth: number): string {
  if (depth < 1) return '-';
  const d = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  if (depth < 10) return `${d[depth]}级`;
  if (depth === 10) return '十级';
  if (depth < 20) return `十${d[depth % 10]}级`;
  if (depth < 100) {
    const tens = Math.floor(depth / 10);
    const ones = depth % 10;
    return `${tens === 1 ? '十' : `${d[tens]}十`}${ones ? d[ones] : ''}级`;
  }
  return `${depth}级`;
}

function applyPlanLevelByTreeDepth(rows: WbsRow[], depth = 1): void {
  for (const row of rows) {
    row.planLevel = depthToTaskLevel(depth);
    if (row.children?.length) {
      applyPlanLevelByTreeDepth(row.children, depth + 1);
    }
  }
}

/** 「关联任务流程」列：普通行为 节点名称+「流程」；序号 4、7 为下拉时写入所选标签 */
function syncTaskFlowLabel(rows: WbsRow[]): void {
  for (const row of rows) {
    if (isTaskFlowDropdownRow(row)) {
      row.taskFlow = taskFlowLabelFromSelectValue(row.taskFlowSelectValue, row);
    } else {
      row.taskFlow = `${row.nodeName ?? ''}流程`;
    }
    if (row.children?.length) {
      syncTaskFlowLabel(row.children);
    }
  }
}

function onTaskFlowSelectChange(record: WbsRow) {
  record.taskFlow = taskFlowLabelFromSelectValue(record.taskFlowSelectValue, record);
}

/** 与示意界面一致的示例树（后续可接模板 WBS 接口替换；任务层级由树深度计算） */
function buildDemoWbsTree(): WbsRow[] {
  const tree: WbsRow[] = [
    {
      id: 'n1',
      serialNo: 1,
      wbsCode: '1',
      nodeName: '厨房龙头',
      planLevel: '',
      required: true,
      taskFlow: '',
      children: [
        {
          id: 'n1-1',
          serialNo: 2,
          wbsCode: '1.1',
          nodeName: '单把手抽拉龙头',
          planLevel: '',
          required: true,
          taskFlow: '',
          children: [
            { id: 'n1-1-1', serialNo: 3, wbsCode: '1.1.1', nodeName: '需求录入', planLevel: '', required: true, taskFlow: '' },
            {
              id: 'n1-1-2',
              serialNo: 4,
              wbsCode: '1.1.2',
              nodeName: '可行性分析',
              planLevel: '',
              required: true,
              taskFlow: '',
              taskFlowSelectValue: 'flow_requirement',
              children: [
                { id: 'n1-1-2-1', serialNo: 5, wbsCode: '1.1.2.1', nodeName: '市场调研', planLevel: '', required: true, taskFlow: '' },
                { id: 'n1-1-2-2', serialNo: 6, wbsCode: '1.1.2.2', nodeName: '技术预研', planLevel: '', required: true, taskFlow: '' },
                {
                  id: 'n1-1-2-3',
                  serialNo: 7,
                  wbsCode: '1.1.2.3',
                  nodeName: '成本评估',
                  planLevel: '',
                  required: true,
                  taskFlow: '',
                  taskFlowSelectValue: 'flow_cost',
                },
                { id: 'n1-1-2-4', serialNo: 8, wbsCode: '1.1.2.4', nodeName: '风险识别', planLevel: '', required: true, taskFlow: '' },
              ],
            },
            { id: 'n1-1-3', serialNo: 9, wbsCode: '1.1.3', nodeName: '方案评价', planLevel: '', required: true, taskFlow: '' },
            { id: 'n1-1-4', serialNo: 10, wbsCode: '1.1.4', nodeName: '设计评审', planLevel: '', required: true, taskFlow: '' },
            { id: 'n1-1-5', serialNo: 11, wbsCode: '1.1.5', nodeName: '规格书', planLevel: '', required: true, taskFlow: '' },
            { id: 'n1-1-6', serialNo: 12, wbsCode: '1.1.6', nodeName: '数模搭建', planLevel: '', required: true, taskFlow: '' },
            { id: 'n1-1-7', serialNo: 13, wbsCode: '1.1.7', nodeName: '图纸设计', planLevel: '', required: true, taskFlow: '' },
            { id: 'n1-1-8', serialNo: 14, wbsCode: '1.1.8', nodeName: '工装', planLevel: '', required: true, taskFlow: '' },
            { id: 'n1-1-10', serialNo: 15, wbsCode: '1.1.10', nodeName: '样品', planLevel: '', required: true, taskFlow: '' },
          ],
        },
      ],
    },
  ];
  applyPlanLevelByTreeDepth(tree);
  syncTaskFlowLabel(tree);
  return tree;
}

const route = useRoute();
const router = useRouter();

const tableData = ref<WbsRow[]>(buildDemoWbsTree());

const pageTitle = computed(() => {
  const name = (route.query.tempName as string) || '';
  const num = (route.query.tempNum as string) || '';
  if (name && num) return `${name}（${num}）`;
  if (name) return name;
  return t('WBS结构');
});

const SCROLL_X_BUFFER_PX = 48;

/** 序号、WBS、节点名称左侧固定；操作列右侧固定；树展开图标在 WBS 列（无行选时 expandIconColumnIndex 为 1） */
function createWbsColumns(): TableColumnsType<WbsRow> {
  return [
    { title: t('序号'), dataIndex: 'serialNo', key: 'serialNo', width: 60, align: 'center', fixed: 'left', resizable: true },
    { title: t('WBS编号'), dataIndex: 'wbsCode', key: 'wbsCode', width: 180, ellipsis: true, fixed: 'left', resizable: true },
    { title: t('节点名称'), dataIndex: 'nodeName', key: 'nodeName', width: 260, ellipsis: true, fixed: 'left', resizable: true },
    { title: t('任务层级'), dataIndex: 'planLevel', key: 'planLevel', width: 120, align: 'center', ellipsis: true, resizable: true },
    { title: t('是否必选项'), dataIndex: 'required', key: 'required', width: 96, align: 'center', resizable: true },
    {
      title: t('关联任务流程'),
      dataIndex: 'taskFlow',
      key: 'taskFlow',
      width: 220,
      align: 'left',
      ellipsis: true,
      resizable: true,
    },
    { title: t('操作'), key: 'operation', dataIndex: 'operation', width: 180, align: 'center', fixed: 'right', resizable: false },
  ];
}

const columns = ref<TableColumnsType<WbsRow>>(createWbsColumns());

const scrollX = computed(() =>
  columns.value.reduce((s, c) => s + (Number(c.width) || 0), 0) + SCROLL_X_BUFFER_PX,
);

function handleResizeColumn(w: number, col: { width?: number | string }) {
  col.width = w;
}

function wbsRowKey(r: WbsRow) {
  return r.id;
}

function isLeaf(record: WbsRow) {
  return !record.children?.length;
}

function toggleRequired(record: WbsRow) {
  record.required = !record.required;
}

function onAddRoot() {
  message.info(t('新增节点（演示）'));
}

function onEdit(record: WbsRow) {
  message.info(`${t('编辑')}：${record.nodeName}`);
}

function onDelete(record: WbsRow) {
  message.warning(`${t('删除')}：${record.nodeName}`);
}

function onMoveUp(record: WbsRow) {
  message.info(`${t('上移')}：${record.wbsCode}`);
}

function onMoveDown(record: WbsRow) {
  message.info(`${t('下移')}：${record.wbsCode}`);
}

function goBack() {
  router.back();
}

function onSave() {
  message.success(WeiI18n.$t('保存成功'));
}
</script>

<template>
  <div class="drawerContent product-temp-wbs-page">
    <a-card class="wbs-card" :bordered="false">
      <div class="wbs-top-bar">
        <div class="wbs-top-bar__left">
          <a-button type="primary" @click="onAddRoot">
            <template #icon>
              <PlusOutlined />
            </template>
            {{ $t('新增') }}
          </a-button>
        </div>
        <div class="wbs-top-bar__right">{{ t('模版名称') }}：{{ pageTitle }}</div>
      </div>
      <a-table
        class="wbs-table exe-config-table"
        table-layout="fixed"
        :columns="columns"
        :data-source="tableData"
        :row-key="wbsRowKey"
        :pagination="false"
        bordered
        :scroll="{ x: scrollX }"
        default-expand-all-rows
        :expand-icon-column-index="1"
        @resize-column="handleResizeColumn">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'wbsCode'">
            <span class="wbs-code-cell">
              <component :is="isLeaf(record) ? FileOutlined : FolderOutlined" class="wbs-code-cell__icon" />
              <span>{{ record.wbsCode }}</span>
            </span>
          </template>
          <template v-else-if="column.key === 'required'">
            <button
              type="button"
              class="wbs-switch"
              :class="record.required ? 'wbs-switch--on' : 'wbs-switch--off'"
              :aria-pressed="record.required"
              @click.stop="toggleRequired(record)">
              <span class="wbs-switch__track">
                <span class="wbs-switch__label">{{ record.required ? 'ON' : 'OFF' }}</span>
                <span class="wbs-switch__thumb" />
              </span>
            </button>
          </template>
          <template v-else-if="column.key === 'taskFlow'">
            <a-select
              v-if="isTaskFlowDropdownRow(record)"
              v-model:value="record.taskFlowSelectValue"
              :options="TASK_FLOW_DROPDOWN_OPTIONS"
              class="wbs-taskflow-select"
              dropdown-class-name="wbs-taskflow-select-dropdown"
              allow-clear
              :placeholder="t('请选择')"
              @click.stop
              @change="onTaskFlowSelectChange(record)" />
            <span v-else class="wbs-taskflow-text">{{ record.taskFlow }}</span>
          </template>
          <template v-else-if="column.key === 'operation'">
            <span class="wbs-ops">
              <a class="wbs-ops__link" @click.prevent="onEdit(record)">{{ $t('编辑') }}</a>
              <a class="wbs-ops__link" @click.prevent="onMoveUp(record)">{{ $t('上移') }}</a>
              <a class="wbs-ops__link" @click.prevent="onMoveDown(record)">{{ $t('下移') }}</a>
              <a class="wbs-ops__link wbs-ops__link--danger" @click.prevent="onDelete(record)">{{ $t('删除') }}</a>
            </span>
          </template>
        </template>
      </a-table>
      <div class="wbs-footer-actions">
        <a-button type="primary" @click="onSave">{{ $t('保存') }}</a-button>
        <a-button @click="goBack">{{ $t('返回') }}</a-button>
      </div>
    </a-card>
  </div>
</template>

<style lang="less" scoped>
.product-temp-wbs-page {
  min-height: 0;
  padding: 0 12px 12px;
  box-sizing: border-box;
}

.wbs-card {
  border: none !important;
  box-shadow: none !important;

  :deep(.ant-card-body) {
    padding: 12px 0;
  }
}

.wbs-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.wbs-top-bar__left {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  flex: 0 0 auto;
}

.wbs-top-bar__right {
  flex: 1 1 200px;
  min-width: 0;
  text-align: right;
  font-size: 15px;
  color: rgba(0, 0, 0, 0.88);
  line-height: 32px;
}

.wbs-footer-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.wbs-table {
  :deep(.ant-table-thead > tr > th) {
    background: #fafafa;
  }
}

/* 与 ant-table 表体一致：14px（与 .ant-table-tbody 默认字号对齐） */
.wbs-taskflow-select {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  font-size: 14px;
}

.wbs-taskflow-select :deep(.ant-select-selector) {
  display: flex !important;
  align-items: center !important;
  font-size: 14px !important;
}

.wbs-taskflow-select :deep(.ant-select-selection-item),
.wbs-taskflow-select :deep(.ant-select-selection-placeholder) {
  display: flex !important;
  align-items: center !important;
  font-size: 14px !important;
  line-height: 1.5715 !important;
}

.wbs-taskflow-select :deep(.ant-select-selection-search-input) {
  font-size: 14px !important;
  line-height: 1.5715 !important;
}

.wbs-taskflow-text {
  display: inline-block;
  max-width: 100%;
  font-size: 14px;
  line-height: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

.wbs-code-cell {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.wbs-code-cell__icon {
  color: #8c8c8c;
  font-size: 14px;
}

/* 拟物胶囊开关（是否必选项） */
.wbs-switch {
  display: inline-flex;
  vertical-align: middle;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  line-height: 0;
}

.wbs-switch:focus-visible {
  outline: 2px solid var(--ant-primary-color, #1677ff);
  outline-offset: 2px;
  border-radius: 11px;
}

.wbs-switch__track {
  position: relative;
  display: block;
  width: 46px;
  height: 22px;
  border-radius: 11px;
  box-sizing: border-box;
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.35), inset 0 -1px 2px rgba(0, 0, 0, 0.12);
  transition: background 0.2s ease;
}

.wbs-switch--on .wbs-switch__track {
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--ant-primary-color, #1677ff) 88%, #fff) 0%,
    var(--ant-primary-color, #1677ff) 45%,
    color-mix(in srgb, var(--ant-primary-color, #1677ff) 72%, #000) 100%
  );
}

.wbs-switch--off .wbs-switch__track {
  background: linear-gradient(180deg, #e8e8e8 0%, #c4c4c4 45%, #a8a8a8 100%);
}

.wbs-switch__label {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.02em;
  user-select: none;
  pointer-events: none;
}

.wbs-switch--on .wbs-switch__label {
  left: 5px;
  color: #fff;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
}

.wbs-switch--off .wbs-switch__label {
  right: 4px;
  color: #5c5c5c;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.6);
}

.wbs-switch__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(180deg, #fafafa 0%, #e8e8e8 55%, #d4d4d4 100%);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.85);
  transition: transform 0.22s ease;
  pointer-events: none;
}

/* 轨道 46 - 左右各 2 - 滑块 18 = 24px 行程 */
.wbs-switch--on .wbs-switch__thumb {
  transform: translateX(24px);
}

.wbs-ops {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
}

.wbs-ops__link {
  /* 与「样式配置 → 系统主题」一致：common.less 中 --ant-primary-color 随 --project-system-primary 更新 */
  color: var(--ant-primary-color);
  cursor: pointer;
  user-select: none;
}

.wbs-ops__link:hover {
  color: var(--ant-primary-color-hover);
}

.wbs-ops__link--danger {
  color: #ff4d4f;
}
</style>

<!-- 下拉层 teleport 到 body，与表格同字号 -->
<style lang="less">
.wbs-taskflow-select-dropdown .ant-select-item-option {
  display: flex !important;
  align-items: center !important;
}

.wbs-taskflow-select-dropdown .ant-select-item-option-content {
  font-size: 14px;
  line-height: 1.5715;
  display: flex;
  align-items: center;
}
</style>
