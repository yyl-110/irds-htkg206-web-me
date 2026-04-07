<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import CkeditorPlugin from '@/components/Ckeditor/index.vue';

const props = defineProps({
  modalVisible: { type: Boolean, default: false },
  record: { type: Object, default: () => ({}) },
});

const emit = defineEmits<{ close: [] }>();
const visible = computed({ get: () => props.modalVisible, set: value => !value && emit('close') });

const previewList = computed(() => {
  const r = props.record || {};
  const merged = [
    ...(Array.isArray(r.basicComponentList) ? r.basicComponentList : []),
    ...(Array.isArray(r.threeDComponentList) ? r.threeDComponentList : []),
    ...(Array.isArray(r.uploadComponentList) ? r.uploadComponentList : []),
    ...(Array.isArray(r.tableComponentList) ? r.tableComponentList : []),
  ];
  return merged
    .slice()
    .sort((a: any, b: any) => (Number(a?.sortNo) || 0) - (Number(b?.sortNo) || 0))
    .map((item: any) => ({ ...item, customProps: item?.customProps || {} }));
});
const radioPreviewValueMap = ref<Record<string, string>>({});
function getPreviewItemKey(item: any, index: number) {
  return String(item?.id ?? `${item?.componentType}-${index}`);
}

function getSelectOptions(item: any) {
  const values = item?.customProps?.sequenceValues || [];
  if (!Array.isArray(values)) return [];
  return values.map((val: string) => (val || '').trim()).filter((val: string) => val !== '');
}
function getRadioOptions(item: any) {
  const raw = item?.customProps?.radioOptions;
  if (Array.isArray(raw) && raw.length) {
    return raw.map((val: string) => (val || '').trim()).filter((val: string) => val !== '');
  }
  const options = item?.customProps?.options;
  if (Array.isArray(options)) {
    return options
      .map((opt: any) => {
        if (opt == null) return '';
        if (typeof opt === 'string') return opt;
        return String(opt?.label ?? opt?.value ?? '');
      })
      .map((val: string) => val.trim())
      .filter((val: string) => val !== '');
  }
  return [];
}
function tableDimensionRange(count: number) {
  const n = Math.max(0, Math.min(100, Number(count) || 0));
  return Array.from({ length: n }, (_, i) => i + 1);
}
function isFullRowComponent(type: string) {
  return ['TEXTAREA', 'TITLE', 'RICH_TEXT', 'FILE', 'DIVIDER', 'RADIO', 'DATA_VIEW', 'TABLE', '3D_VIEW'].includes(type);
}
function isTemplateBrowse3DItem(item: any) {
  return item?.componentType === '3D_VIEW' && item?.customProps?.threeDSubtype === 'TEMPLATE_BROWSE';
}
function isModelSelect3DItem(item: any) {
  return item?.componentType === '3D_VIEW' && item?.customProps?.threeDSubtype === 'MODEL_SELECT';
}
function isFixedTemplate3DItem(item: any) {
  return item?.componentType === '3D_VIEW' && item?.customProps?.threeDSubtype === 'FIXED_TEMPLATE';
}
/** 兼容后端/配置里常见 Java 日期格式到 dayjs（Antd DatePicker）格式 */
function normalizeDateFormatForPicker(raw: unknown) {
  const fmt = String(raw ?? '').trim();
  if (!fmt) return 'YYYY-MM-DD';
  return fmt.replace(/yyyy/g, 'YYYY').replace(/yy/g, 'YY').replace(/dd/g, 'DD');
}
watch(
  previewList,
  list => {
    const next: Record<string, string> = {};
    list.forEach((item: any, index: number) => {
      if (item?.componentType !== 'RADIO') return;
      const key = getPreviewItemKey(item, index);
      const opts = getRadioOptions(item);
      const oldVal = radioPreviewValueMap.value[key];
      const paramVal = String(item?.paramValue ?? '');
      if (oldVal && opts.includes(oldVal)) {
        next[key] = oldVal;
      } else if (paramVal && opts.includes(paramVal)) {
        next[key] = paramVal;
      } else {
        next[key] = opts[0] ?? '';
      }
    });
    radioPreviewValueMap.value = next;
  },
  { immediate: true, deep: true },
);
function getFixedTableHeaderLabel(item: any, colIndex: number) {
  const firstType = item?.customProps?.firstColumnType || 'INDEX';
  if (colIndex === 1) {
    if (firstType === 'INDEX') return '序号';
    return '';
  }
  const raw = item?.customProps?.tableColDefs?.[colIndex - 1]?.columnName;
  if (raw != null && String(raw).trim() !== '') return String(raw).trim();
  return `列名${colIndex - 1}`;
}
</script>

<template>
  <a-modal
    v-model:visible="visible"
    class="activity-preview-fullscreen-modal"
    wrap-class-name="activity-preview-fullscreen-wrap"
    :centered="false"
    :footer="null"
    :mask-closable="false"
    width="100%"
    :style="{ top: 0, paddingBottom: 0 }"
    title="页面预览">
    <div class="activity-preview-layout">
      <div class="activity-preview-panel-title">组件列表</div>
      <div class="activity-preview-canvas">
        <div v-if="previewList.length === 0" class="activity-preview-empty">暂无组件配置</div>
        <div v-else class="component-list">
          <div
            v-for="(item, index) in previewList"
            :key="item.id || `${item.componentType}-${index}`"
            class="component-card"
            :class="{ 'full-row-item': isFullRowComponent(item.componentType) }">
            <div class="component-preview-wrap">
              <div
                v-if="
                  item.componentType !== 'TITLE' &&
                  item.componentType !== 'RADIO' &&
                  item.componentType !== 'FILE' &&
                  item.componentType !== 'DIVIDER' &&
                  item.componentType !== 'DATA_VIEW' &&
                  item.componentType !== 'TABLE' &&
                  !isTemplateBrowse3DItem(item) &&
                  !isFixedTemplate3DItem(item) &&
                  !isModelSelect3DItem(item)
                "
                class="component-title">
                {{ item.paramName || '未命名组件' }}
              </div>

              <template v-if="item.componentType === 'TITLE'">
                <div class="title-preview-text">{{ item.paramName || '标题' }}</div>
                <div v-if="item.customProps?.hasDivider === 1 || item.customProps?.hasDivider === '1' || item.customProps?.hasDivider === true" class="title-divider-line"></div>
              </template>

              <a-input v-else-if="item.componentType === 'INPUT'" :value="item.paramValue || ''" :placeholder="item.customProps?.placeholder || '请输入'" class="preview-field" />

              <a-textarea
                v-else-if="item.componentType === 'TEXTAREA'"
                :value="item.paramValue || ''"
                :rows="item.customProps?.rows || 4"
                :placeholder="item.customProps?.placeholder || '请输入'"
                class="preview-field" />

              <a-date-picker
                v-else-if="item.componentType === 'DATE'"
                :show-time="normalizeDateFormatForPicker(item.customProps?.format).includes('HH:mm:ss')"
                :format="normalizeDateFormatForPicker(item.customProps?.format)"
                :placeholder="normalizeDateFormatForPicker(item.customProps?.format).includes('HH:mm:ss') ? '请选择日期时间' : '请选择日期'"
                class="preview-field" />

              <div v-else-if="item.componentType === 'DIVIDER'" class="divider-preview-line"></div>

              <div v-else-if="item.componentType === 'DATA_VIEW'" class="data-view-preview">
                <div class="component-title">{{ item.paramName || '数据浏览' }}</div>
                <div class="data-view-preview-row">
                  <a-input :value="item.paramValue || ''" :placeholder="item.customProps?.inputPlaceholder || '请输入设计参数1'" class="data-view-preview-input browse-adjoined-input" />
                  <a-button type="primary" class="data-view-assemble-btn">{{ item.customProps?.assembleButtonText || '装配' }}</a-button>
                </div>
              </div>

              <div v-else-if="item.componentType === 'FILE'" class="file-preview-wrap">
                <div class="component-title">{{ item.paramName || '未命名组件' }}</div>
                <div class="file-preview-box">
                  <div class="file-preview-icon">📷</div>
                  <div class="file-preview-hint">图片格式为jpg, jpeg, png, 且图片最大不超过2M</div>
                </div>
              </div>

              <a-select
                v-else-if="item.componentType === 'SELECT'"
                :value="item.paramValue"
                :options="getSelectOptions(item).map(v => ({ label: v, value: v }))"
                placeholder="请选择"
                class="preview-field" />

              <div v-else-if="item.componentType === 'RADIO'" class="radio-preview-wrap">
                <div class="component-title">{{ item.paramName || '单选项' }}</div>
                <div v-if="getRadioOptions(item).length === 0" class="radio-preview-empty">暂无选项</div>
                <a-radio-group v-else v-model:value="radioPreviewValueMap[getPreviewItemKey(item, index)]" class="radio-preview-grid">
                  <a-radio v-for="(opt, optIdx) in getRadioOptions(item)" :key="`${opt}-${optIdx}`" :value="opt" class="radio-preview-item">
                    {{ opt }}
                  </a-radio>
                </a-radio-group>
              </div>

              <div v-else-if="item.componentType === 'RICH_TEXT'" class="rich-preview-wrap">
                <CkeditorPlugin height="180" />
              </div>

              <div v-else-if="item.componentType === 'TABLE'" class="fixed-table-preview">
                <div v-if="(item.customProps?.tableTitle || '').trim() !== ''" class="fixed-table-preview-title-row">
                  <span class="fixed-table-preview-title-text">{{ item.customProps.tableTitle }}</span>
                </div>
                <table class="fixed-table-preview-grid">
                  <thead>
                    <tr>
                      <th v-for="c in tableDimensionRange(item.customProps?.tableColCount || 1)" :key="`h-${c}`">{{ getFixedTableHeaderLabel(item, c) }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="r in tableDimensionRange(item.customProps?.tableBodyRows || 1)" :key="`b-${r}`">
                      <td v-for="c in tableDimensionRange(item.customProps?.tableColCount || 1)" :key="`b-${r}-${c}`" class="fixed-table-preview-td">
                        <template v-if="c === 1">
                          <span v-if="(item.customProps?.firstColumnType || 'INDEX') === 'INDEX'">{{ r }}</span>
                        </template>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div v-else-if="isTemplateBrowse3DItem(item)" class="template-browse-3d-preview">
                <div class="template-browse-3d-row">
                  <div class="template-browse-3d-group">
                    <div class="template-browse-3d-label">模板名称：</div>
                    <div class="template-browse-3d-controls">
                      <a-input :value="item.customProps?.templateName" placeholder="请输入" class="template-browse-3d-input template-browse-3d-input--grey" />
                      <a-button type="primary" size="small" class="template-browse-3d-action-btn">浏览</a-button>
                    </div>
                  </div>
                  <div class="template-browse-3d-group">
                    <div class="template-browse-3d-label">模型名称：</div>
                    <div class="template-browse-3d-controls">
                      <a-input :value="item.customProps?.modelName" placeholder="请输入" class="template-browse-3d-input" />
                      <a-button type="primary" size="small" class="template-browse-3d-action-btn">生成模型</a-button>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="isFixedTemplate3DItem(item)" class="template-browse-3d-preview">
                <div class="template-browse-3d-row">
                  <div class="template-browse-3d-group">
                    <div class="template-browse-3d-label">模板名称：</div>
                    <div class="template-browse-3d-controls">
                      <a-input :value="item.customProps?.templateName" placeholder="请输入" class="template-browse-3d-input template-browse-3d-input--grey" />
                    </div>
                  </div>
                  <div class="template-browse-3d-group">
                    <div class="template-browse-3d-label">模型名称：</div>
                    <div class="template-browse-3d-controls">
                      <a-input :value="item.customProps?.modelName" placeholder="请输入" class="template-browse-3d-input" />
                      <a-button type="primary" size="small" class="template-browse-3d-action-btn">生成模型</a-button>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="isModelSelect3DItem(item)" class="model-select-3d-preview">
                <div class="model-select-3d-label">模型名称：</div>
                <div class="model-select-3d-controls">
                  <a-input :value="item.customProps?.modelSelectName" placeholder="请输入" class="template-browse-3d-input template-browse-3d-input--grey" />
                  <a-button type="primary" size="small" class="template-browse-3d-action-btn">浏览</a-button>
                  <a-button type="primary" size="small" class="template-browse-3d-action-btn">装配模型</a-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="activity-preview-footer">
        <a-button @click="emit('close')">关闭</a-button>
      </div>
    </div>
  </a-modal>
</template>

<style lang="less">
.activity-preview-fullscreen-wrap {
  padding: 0 !important;
}
.activity-preview-fullscreen-wrap .ant-modal {
  top: 0 !important;
  width: 100vw !important;
  max-width: 100vw !important;
  margin: 0 !important;
  padding: 0 !important;
}
.activity-preview-fullscreen-wrap .ant-modal-content {
  height: 100vh;
  border-radius: 0;
  display: flex;
  flex-direction: column;
}
.activity-preview-fullscreen-wrap .ant-modal-body {
  flex: 1;
  overflow: hidden;
  padding: 0;
}
.activity-preview-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.activity-preview-panel-title {
  font-size: 14px;
  font-weight: 600;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}
.activity-preview-canvas {
  flex: 1;
  overflow: auto;
  padding: 12px 16px;
}
.component-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}
.component-card {
  border: none;
  border-radius: 4px;
  padding: 10px 0;
  display: block;
}
.component-card.full-row-item {
  grid-column: 1 / -1;
}
.component-preview-wrap {
  flex: 1;
  min-width: 0;
}
.component-title {
  font-size: 12px;
  color: #444;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}
.title-preview-text {
  font-size: 14px;
  color: #333;
  margin-bottom: 6px;
}
.title-divider-line {
  height: 1px;
  background: #d9d9d9;
  width: 100%;
}
.activity-preview-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
  background: #fff;
}
.activity-preview-empty {
  text-align: center;
  color: #999;
  padding: 40px 0;
}
.preview-field {
  width: 420px;
  max-width: 100%;
}
.divider-preview-line {
  height: 1px;
  background: #d9d9d9;
  margin: 10px 0;
}
.model-select-3d-preview {
  width: 100%;
  max-width: 848px;
}
.model-select-3d-label {
  font-size: 12px;
  color: #444;
  margin-bottom: 8px;
}
.model-select-3d-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.template-browse-3d-preview {
  width: 100%;
  max-width: 848px;
}
.template-browse-3d-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.template-browse-3d-group {
  min-width: 0;
}
.template-browse-3d-label {
  font-size: 12px;
  color: #444;
  margin-bottom: 8px;
}
.template-browse-3d-controls {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
}
.data-view-preview-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.data-view-preview-input {
  width: 420px;
  max-width: 100%;
}
.file-preview-box {
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.file-preview-hint {
  color: #999;
  font-size: 12px;
}
.radio-preview-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  max-width: 520px;
}
.radio-preview-item {
  display: flex;
  align-items: center;
  gap: 6px;
}
.radio-preview-empty {
  color: #999;
  font-size: 12px;
}
.rich-preview-wrap {
  max-width: 760px;
}
.fixed-table-preview-grid {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  background: #fff;
  font-size: 13px;
}
.fixed-table-preview-grid th,
.fixed-table-preview-grid td {
  border: 1px solid #e8e8e8;
  padding: 10px 12px;
  text-align: left;
}
.fixed-table-preview-grid th {
  font-weight: 600;
  background: #fafafa;
}
.template-browse-3d-input {
  width: 100%;
  max-width: none;
}
.template-browse-3d-input :deep(.ant-input) {
  text-align: left;
}
.template-browse-3d-input--grey :deep(.ant-input) {
  background: #f5f7fa;
}
.template-browse-3d-action-btn {
  flex-shrink: 0;
}
.data-view-assemble-btn,
.template-browse-3d-action-btn {
  min-width: 64px;
  height: 32px;
  padding: 0 10px;
  border-radius: 4px;
}
</style>
