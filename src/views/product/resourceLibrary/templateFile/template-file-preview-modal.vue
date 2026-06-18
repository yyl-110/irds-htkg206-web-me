<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, type ComponentPublicInstance } from 'vue';
import { DownOutlined, FileOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import {
  AdminApiReportPreparation,
  type ReportPreparationClassificationDetailItem,
  type ReportPreparationClassificationDetailTreeNode,
  type ReportPreparationPlaceholderDTO,
} from '@/api/tags/product/报告编制';
import { ContentType, httpClient } from '@/api/tags/http-client';
import { downloadGeneratedFile, parseUploadFileResponse } from '@/utils/file';
import { useUserStore } from '@/store/modules/user';

const userStore = useUserStore();

const visible = ref(false);
const templateId = ref('');
const fileId = ref('');
const templateName = ref('');
const parseLoading = ref(false);
const exportLoading = ref(false);
const selectedSectionKey = ref('');
const formDynamic = ref<Record<string, string>>({});
const formDynamicFileName = ref<Record<string, string>>({});
const collapsedSections = ref<Record<string, boolean>>({});

type SidebarSection = {
  key: string;
  titleText: string;
  items: ReportPreparationPlaceholderDTO[];
};

type FormSection = {
  key: string;
  title?: ReportPreparationPlaceholderDTO;
  titleText: string;
  rows: ReportPreparationPlaceholderDTO[][];
};

const sidebarSections = ref<SidebarSection[]>([]);

const isTitleType = (para3?: string) => {
  const t = (para3 ?? '').toString().toLowerCase();
  return t === 'title' || t.includes('title') || t.includes('标题');
};

const isTextareaType = (para3?: string) => {
  const t = (para3 ?? '').toString().toLowerCase();
  return t.includes('textarea') || t.includes('文本域');
};

const buildParamRows = (list: ReportPreparationPlaceholderDTO[]) => {
  const rows: ReportPreparationPlaceholderDTO[][] = [];
  let normalBatch: ReportPreparationPlaceholderDTO[] = [];
  const flushNormalBatch = () => {
    const size = 4;
    for (let i = 0; i < normalBatch.length; i += size) {
      rows.push(normalBatch.slice(i, i + size));
    }
    normalBatch = [];
  };
  list.forEach(item => {
    if (!item) {
      return;
    }
    if (isTextareaType(item.para3)) {
      flushNormalBatch();
      rows.push([item]);
      return;
    }
    normalBatch.push(item);
  });
  flushNormalBatch();
  return rows;
};

const activeSection = computed(() => {
  if (!sidebarSections.value.length) {
    return null;
  }
  return sidebarSections.value.find(section => section.key === selectedSectionKey.value) ?? sidebarSections.value[0];
});

const activeFormSections = computed<FormSection[]>(() => {
  if (!activeSection.value) {
    return [];
  }
  return buildFormSectionsFromItems(activeSection.value.items);
});

const allPlaceholderItems = computed(() =>
  sidebarSections.value.flatMap(section => section.items).filter(item => !isTitleType(item.para3)),
);

const modalTitle = computed(() => templateName.value || '模板预览');

function sectionLabel(section: SidebarSection, index: number) {
  return section.titleText?.trim() || `区块${index + 1}`;
}

/** 导出参数键：标题#类型#编号 */
function resolveExportParamKey(title: string, parameterNum: string, formType: string) {
  if (title && parameterNum && formType) {
    return `${title}#${formType}#${parameterNum}`;
  }
  if (title && parameterNum) {
    return `${title}#text#${parameterNum}`;
  }
  return parameterNum;
}

function mapDetailToPlaceholder(detail: ReportPreparationClassificationDetailItem): ReportPreparationPlaceholderDTO {
  const completeParts = String(detail.completeStr ?? '')
    .split('#')
    .map(part => part.trim());
  const type = String(detail.type ?? '').toLowerCase();
  const title = String(detail.title ?? completeParts[0] ?? detail.para1 ?? '').trim();
  const parameterNum = String(detail.parameterNum ?? completeParts[1] ?? detail.para2 ?? '').trim();
  const formType = String(detail.formType ?? completeParts[2] ?? detail.para3 ?? 'text').trim();
  const para3 = type === 'title' ? 'title' : formType;

  return {
    para1: title,
    para2: parameterNum,
    para3,
    para4: resolveExportParamKey(title, parameterNum, formType),
  };
}

function buildFormSectionsFromItems(items: ReportPreparationPlaceholderDTO[]): FormSection[] {
  const sections: FormSection[] = [];
  let currentTitle: ReportPreparationPlaceholderDTO | undefined;
  let currentItems: ReportPreparationPlaceholderDTO[] = [];

  const flush = () => {
    if (currentItems.length === 0 && !currentTitle) {
      return;
    }
    const sectionIndex = sections.length;
    sections.push({
      key: `section-${sectionIndex}`,
      title: currentTitle,
      titleText: currentTitle?.para1 ?? '',
      rows: buildParamRows(currentItems),
    });
    currentItems = [];
    currentTitle = undefined;
  };

  items.forEach(item => {
    if (!item) {
      return;
    }
    if (isTitleType(item.para3)) {
      flush();
      currentTitle = item;
      return;
    }
    currentItems.push(item);
  });
  flush();

  return sections;
}

/** 左侧仅展示第一级目录，标题取 contents，明细取 detailList */
function normalizeFirstLevelToSections(nodes: ReportPreparationClassificationDetailTreeNode[]): SidebarSection[] {
  return nodes.map((node, index) => {
    const detailList = node.detailList ?? node.details ?? [];
    return {
      key: node.id != null ? String(node.id) : `section-${index}`,
      titleText: String(node.contents ?? '').trim() || `区块${index + 1}`,
      items: detailList.map(mapDetailToPlaceholder),
    };
  });
}

const toggleSection = (key: string, event?: MouseEvent) => {
  event?.stopPropagation();
  const nextCollapsed = collapsedSections.value[key] !== true;
  collapsedSections.value = {
    ...collapsedSections.value,
    [key]: nextCollapsed,
  };
};

const isSectionExpanded = (key: string) => collapsedSections.value[key] !== true;

const unwrapTree = (res: any): ReportPreparationClassificationDetailTreeNode[] => {
  const data = res?.data?.data ?? res?.data ?? res;
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === 'object') {
    return [data as ReportPreparationClassificationDetailTreeNode];
  }
  return [];
};

const unwrapData = <T,>(res: any): T | undefined => res?.data?.data ?? res?.data;

function resetFormState(
  list: ReportPreparationPlaceholderDTO[],
  sourceDetails?: ReportPreparationClassificationDetailItem[],
) {
  const next: Record<string, string> = {};
  const nextFileName: Record<string, string> = {};
  const valueByParameterNum = new Map<string, string>();
  sourceDetails?.forEach(detail => {
    const placeholder = mapDetailToPlaceholder(detail);
    if (placeholder.para2 && detail.value != null && String(detail.value).trim() !== '') {
      valueByParameterNum.set(placeholder.para2, String(detail.value).trim());
    }
  });
  list.forEach(item => {
    if (item?.para2 && !isTitleType(item.para3)) {
      next[item.para2] = valueByParameterNum.get(item.para2) ?? '';
      nextFileName[item.para2] = '';
    }
  });
  formDynamic.value = next;
  formDynamicFileName.value = nextFileName;
}

function resetState() {
  templateId.value = '';
  fileId.value = '';
  templateName.value = '';
  selectedSectionKey.value = '';
  sidebarSections.value = [];
  formDynamic.value = {};
  formDynamicFileName.value = {};
  collapsedSections.value = {};
  clearTextareaObservers();
}

async function loadClassificationDetailTree() {
  if (!templateId.value) {
    message.warning('缺少模板ID');
    return;
  }
  parseLoading.value = true;
  try {
    const res = await AdminApiReportPreparation.getClassificationDetailTree(templateId.value);
    const treeNodes = unwrapTree(res);
    sidebarSections.value = normalizeFirstLevelToSections(treeNodes);
    const sourceDetails = treeNodes.flatMap(node => node.detailList ?? node.details ?? []);
    resetFormState(
      sidebarSections.value.flatMap(section => section.items).filter(item => !isTitleType(item.para3)),
      sourceDetails,
    );
    clearTextareaObservers();
    if (!sidebarSections.value.length) {
      message.info('暂无目录明细数据');
      selectedSectionKey.value = '';
      return;
    }
    selectedSectionKey.value = sidebarSections.value[0]?.key ?? '';
  } catch (e) {
    console.error(e);
  } finally {
    parseLoading.value = false;
  }
}

const exportReport = async () => {
  if (!allPlaceholderItems.value.length) {
    message.warning('暂无可导出的报告内容');
    return;
  }
  if (!fileId.value) {
    message.warning('缺少模板文件');
    return;
  }
  const params: Record<string, string> = {};
  allPlaceholderItems.value.forEach(item => {
    if (!item?.para4 || !item.para2 || isTitleType(item.para3)) {
      return;
    }
    params[item.para4] = formDynamic.value[item.para2] ?? '';
  });
  exportLoading.value = true;
  try {
    const res = await AdminApiReportPreparation.exportReport({
      fileId: fileId.value,
      params: JSON.stringify(params),
      userId: userStore.getUser?.id,
    });
    const data = unwrapData<{ fileUrl?: string; fileId?: string; id?: string; oldFileName?: string; fileName?: string }>(res);
    if (data?.fileUrl || data?.fileId || data?.id) {
      await downloadGeneratedFile({
        fileUrl: String(data.fileUrl ?? '').trim(),
        fileId: String(data.fileId ?? data.id ?? '').trim(),
        fileName: String(data.oldFileName ?? data.fileName ?? '').trim(),
      });
    }
    message.success('报告已生成');
  } catch (e) {
    console.error(e);
  } finally {
    exportLoading.value = false;
  }
};

const normalizeInputType = (para3?: string) => {
  const t = (para3 ?? '').toString().toLowerCase();
  if (t.includes('textarea') || t.includes('文本域')) {
    return 'textarea';
  }
  if (t === 'text' || t.includes('文本')) {
    return 'text';
  }
  if (['number', 'int', 'integer', 'float', 'decimal'].some(k => t.includes(k))) {
    return 'number';
  }
  return 'text';
};

const isImgType = (para3?: string) => {
  const t = (para3 ?? '').toString().toLowerCase();
  return t === 'img' || t.includes('img') || t.includes('图片') || t.includes('image');
};

const customImgUpload = (item: ReportPreparationPlaceholderDTO) => async (options: any) => {
  const { file, onSuccess, onError } = options;
  try {
    const uploadRes = await httpClient.request(
      {
        path: 'system-service/fileManagerController/upload.json',
        method: 'POST',
        body: {
          file,
          userId: Number(userStore.getUser?.id ?? 0),
          confidentialLevel: '1',
        },
        secure: true,
        type: ContentType.FormData,
      },
      Object,
    );
    const { ok, fileUrl, oldFileName, errMsg } = parseUploadFileResponse(uploadRes?.data);
    if (!ok || !fileUrl) {
      onError?.(new Error(errMsg || '上传失败'));
      return;
    }
    if (item.para2) {
      formDynamic.value[item.para2] = fileUrl;
      formDynamicFileName.value = {
        ...formDynamicFileName.value,
        [item.para2]: oldFileName || file?.name || '',
      };
    }
    onSuccess?.(uploadRes);
  } catch (e) {
    onError?.(e as Error);
  }
};

const getFileNameFromUrl = (url?: string) => {
  if (!url) {
    return '';
  }
  const u = url.toString();
  const queryMatch = u.match(/[?&](?:oldfileName|filename|fileName)=([^&]+)/i);
  if (queryMatch?.[1]) {
    try {
      return decodeURIComponent(queryMatch[1]).replace(/\+/g, ' ');
    } catch {
      return queryMatch[1];
    }
  }
  const cleanPath = u.split('?')[0].replace(/\/+$/, '');
  const parts = cleanPath.split('/');
  return parts[parts.length - 1] || '';
};

const getImgDisplayName = (para2?: string) => {
  if (!para2) {
    return '';
  }
  return formDynamicFileName.value[para2] || getFileNameFromUrl(formDynamic.value[para2]);
};

type TextareaObserverEntry = {
  wrap: HTMLElement;
  observer: ResizeObserver;
};

const textareaObserverEntries: TextareaObserverEntry[] = [];

const clearTextareaObservers = () => {
  textareaObserverEntries.forEach(({ observer }) => observer.disconnect());
  textareaObserverEntries.length = 0;
};

const syncSectionBodyHeight = (wrap: HTMLElement) => {
  const sectionBody = wrap.closest('.section-card-body') as HTMLElement | null;
  if (!sectionBody) {
    return;
  }
  sectionBody.style.removeProperty('min-height');
  sectionBody.style.minHeight = `${sectionBody.scrollHeight}px`;
};

const bindTextareaWrap = (el: Element | ComponentPublicInstance | null) => {
  const target = el instanceof HTMLElement ? el : (el as ComponentPublicInstance)?.$el;
  if (!target || !(target instanceof HTMLElement)) {
    return;
  }
  const wrap = target;
  if (wrap.dataset.textareaObserved === '1') {
    return;
  }
  nextTick(() => {
    if (wrap.dataset.textareaObserved === '1') {
      return;
    }
    const textarea = wrap.querySelector('textarea');
    if (!textarea) {
      return;
    }
    wrap.dataset.textareaObserved = '1';
    const observer = new ResizeObserver(() => {
      syncSectionBodyHeight(wrap);
    });
    observer.observe(textarea);
    textareaObserverEntries.push({ wrap, observer });
    syncSectionBodyHeight(wrap);
  });
};

const onTextareaResizeEnd = (event: MouseEvent) => {
  const textarea = event.target;
  if (!(textarea instanceof HTMLTextAreaElement)) {
    return;
  }
  const wrap = textarea.closest('.dynamic-textarea-wrap') as HTMLElement | null;
  if (wrap) {
    syncSectionBodyHeight(wrap);
  }
};

function handleCancel() {
  visible.value = false;
}

async function open(payload: { templateId: string | number; fileId: string | number; templateName?: string }) {
  const nextTemplateId = String(payload.templateId ?? '').trim();
  const nextFileId = String(payload.fileId ?? '').trim();
  if (!nextTemplateId) {
    message.warning('缺少模板ID');
    return;
  }
  if (!nextFileId) {
    message.warning('暂无模板文件');
    return;
  }
  resetState();
  templateId.value = nextTemplateId;
  fileId.value = nextFileId;
  templateName.value = String(payload.templateName ?? '').trim();
  visible.value = true;
  await loadClassificationDetailTree();
}

defineExpose({ open });

onBeforeUnmount(() => {
  clearTextareaObservers();
});
</script>

<template>
  <a-modal
    v-model:visible="visible"
    :title="modalTitle"
    :width="1200"
    :mask-closable="false"
    destroy-on-close
    wrap-class-name="template-file-preview-modal-wrap"
    @cancel="handleCancel"
    @after-close="resetState">
    <a-spin :spinning="parseLoading">
      <div class="preview-body">
        <aside class="preview-sidebar">
          <div v-if="sidebarSections.length === 0 && !parseLoading" class="preview-sidebar-empty">暂无区块</div>
          <button
            v-for="(section, index) in sidebarSections"
            :key="section.key"
            type="button"
            class="preview-sidebar-item"
            :class="{ 'is-active': selectedSectionKey === section.key }"
            @click="selectedSectionKey = section.key">
            <FileOutlined class="preview-sidebar-item__icon" />
            <span class="preview-sidebar-item__text">{{ sectionLabel(section, index) }}</span>
          </button>
        </aside>

        <section class="preview-content">
          <a-form v-if="activeFormSections.length" layout="vertical" class="dynamic-form">
            <div
              v-for="section in activeFormSections"
              :key="`${activeSection?.key ?? ''}-${section.key}`"
              class="form-section"
              :class="{
                'form-section-card': section.title,
                'is-collapsed': section.title && !isSectionExpanded(section.key),
              }">
              <div
                v-if="section.title"
                class="section-card-header"
                @click="toggleSection(section.key, $event)">
                <span class="section-title-text">{{ section.titleText || '标题' }}</span>
                <DownOutlined class="section-title-arrow" :class="{ 'is-collapsed': !isSectionExpanded(section.key) }" />
              </div>
              <div
                v-show="!section.title || isSectionExpanded(section.key)"
                :class="section.title ? 'section-card-body' : 'section-plain-body'">
                <div v-for="(row, rowIndex) in section.rows" :key="`${section.key}-${rowIndex}`" class="dynamic-row">
                  <a-row :gutter="20">
                    <a-col
                      v-for="item in row"
                      :key="item.para2"
                      :span="normalizeInputType(item.para3) === 'textarea' ? 24 : 6">
                      <a-form-item
                        :label="item.para1"
                        :class="{ 'dynamic-form-item--textarea': normalizeInputType(item.para3) === 'textarea' }">
                        <div v-if="isImgType(item.para3)" class="img-upload-wrap">
                          <a-upload :show-upload-list="false" accept=".jpg,.jpeg,.png" :custom-request="customImgUpload(item)">
                            <div class="img-upload-input">
                              <img
                                v-if="item.para2 && formDynamic[item.para2]"
                                :src="formDynamic[item.para2]"
                                class="img-upload-preview"
                                alt="" />
                              <span v-if="!item.para2 || !formDynamic[item.para2]" class="img-upload-placeholder">点击上传</span>
                              <span v-if="getImgDisplayName(item.para2)" class="img-upload-filename">
                                {{ getImgDisplayName(item.para2) }}
                              </span>
                            </div>
                          </a-upload>
                        </div>
                        <div
                          v-else-if="normalizeInputType(item.para3) === 'textarea'"
                          :ref="bindTextareaWrap"
                          class="dynamic-textarea-wrap">
                          <a-textarea
                            v-if="item.para2"
                            v-model:value="formDynamic[item.para2]"
                            placeholder="请输入"
                            :rows="3"
                            @mouseup="onTextareaResizeEnd" />
                        </div>
                        <a-input
                          v-else-if="item.para2"
                          v-model:value="formDynamic[item.para2]"
                          :type="normalizeInputType(item.para3) === 'number' ? 'number' : 'text'"
                          placeholder="请输入"
                          allow-clear />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </div>
              </div>
            </div>
          </a-form>
          <a-empty v-else-if="!parseLoading" description="请选择左侧目录或等待加载完成" />
        </section>
      </div>
    </a-spin>

    <template #footer>
      <a-button type="primary" :loading="exportLoading" @click="exportReport">导出报告</a-button>
      <a-button @click="handleCancel">取消</a-button>
    </template>
  </a-modal>
</template>

<style lang="less" scoped>
.preview-body {
  display: flex;
  gap: 16px;
  height: 62vh;
  min-height: 420px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  font-size: 14px;
}

.preview-sidebar {
  flex: 0 0 220px;
  width: 220px;
  border-right: 1px solid #e8e8e8;
  background: #fafafa;
  overflow-y: auto;
}

.preview-sidebar-title {
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
}

.preview-sidebar-empty {
  padding: 16px;
  color: #999;
  font-size: 14px;
}

.preview-sidebar-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 16px;
  border: none;
  border-bottom: 1px solid #f0f0f0;
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #f5f5f5;
  }

  &.is-active {
    background: #e6f4ff;
    color: #1677ff;
  }
}

.preview-sidebar-item__icon {
  flex-shrink: 0;
  margin-right: 8px;
  font-size: 14px;
}

.preview-sidebar-item__text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}

.preview-content {
  flex: 1;
  min-width: 0;
  padding: 16px 16px 16px 6px;
  overflow: auto;
}

.dynamic-form {
  padding: 0;

  :deep(.ant-form-item) {
    margin-bottom: 0;
  }

  :deep(.ant-form-item-row) {
    display: block;
  }

  :deep(.ant-form-item-label) {
    padding: 0 0 8px;
    text-align: left;
    max-width: 100%;

    > label {
      display: block;
      height: 22px;
      line-height: 22px;
      font-size: 14px;
    }
  }

  :deep(.ant-form-item-control) {
    width: 100%;
    max-width: 100%;
  }

  :deep(.ant-form-item-control-input) {
    width: 100%;
    min-height: 32px;
  }

  :deep(.ant-form-item-control-input-content) {
    display: block;
    width: 100%;
    max-width: 100%;
    min-width: 0;
  }

  :deep(.ant-input),
  :deep(.ant-input-affix-wrapper),
  :deep(.ant-input-affix-wrapper input),
  :deep(textarea.ant-input) {
    font-size: 14px;
  }
}

.form-section {
  margin-bottom: 16px;
}

.form-section-card {
  display: flex;
  flex-direction: column;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.form-section-card.is-collapsed {
  .section-card-header {
    border-bottom: none;
  }
}

.section-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 46px;
  padding: 0 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;

  &:hover {
    background: #f5f5f5;
  }
}

.section-title-text {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.section-title-arrow {
  color: #666;
  font-size: 14px;
  transition: transform 0.2s ease;
}

.section-title-arrow.is-collapsed {
  transform: rotate(-90deg);
}

.section-card-body {
  flex: 0 0 auto;
  height: auto;
  min-height: 0;
  padding: 16px;
  box-sizing: border-box;
  overflow: visible;
}

.section-plain-body {
  padding: 0;
}

.dynamic-row {
  margin-bottom: 4px;
  overflow: visible;

  :deep(> .ant-row) {
    align-items: flex-start;
    overflow: visible;
  }

  :deep(.ant-col) {
    min-width: 0;
    overflow: visible;
    align-self: flex-start;
  }

  :deep(.ant-form-item) {
    margin-bottom: 0;
  }

  /* 统一标签区高度，保证同行控件顶部对齐 */
  :deep(.ant-form-item-label) {
    height: 30px;
    min-height: 30px;
    max-height: 30px;
    padding: 0 0 8px;
    margin: 0;
    box-sizing: border-box;
    overflow: hidden;

    > label {
      display: block;
      height: 22px;
      line-height: 22px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  :deep(.ant-form-item-control),
  :deep(.ant-form-item-control-input),
  :deep(.ant-form-item-control-input-content) {
    margin-top: 0;
    padding-top: 0;
  }

  :deep(.ant-form-item-control-input) {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    min-height: 32px;
  }

  :deep(.ant-input) {
    margin-top: 0;
  }

  .img-upload-wrap,
  .dynamic-textarea-wrap {
    margin-top: 0;
  }
}

.dynamic-form-item--textarea {
  :deep(.ant-form-item-label) {
    height: auto;
    min-height: 22px;
    max-height: none;
    padding: 0 0 2px;
    margin: 0;
  }

  :deep(.ant-form-item-control) {
    flex: none;
    height: auto;
  }

  :deep(.ant-form-item-control-input) {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    height: auto;
    min-height: 0;
  }

  :deep(.ant-form-item-control-input-content) {
    display: block;
    width: 100%;
    overflow: visible;
    height: auto;
  }
}

.dynamic-textarea-wrap {
  display: block;
  width: 100%;
  height: auto;
  min-height: 0;
  margin: 0;
  padding: 0;

  :deep(textarea.ant-input) {
    display: block;
    width: 100%;
    box-sizing: border-box;
    resize: vertical;
    min-height: 72px;
    max-height: none;
    margin: 0;
    padding-top: 4px;
    padding-bottom: 4px;
    overflow: auto;
    vertical-align: top;
  }
}

.img-upload-wrap {
  width: 100%;

  :deep(.ant-upload) {
    width: 100%;
  }
}

.img-upload-input {
  width: 100%;
  min-height: 32px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px 10px;
  box-sizing: border-box;
  overflow: hidden;
  margin: 0;
}

.img-upload-preview {
  width: 20px;
  height: 20px;
  border-radius: 2px;
  object-fit: cover;
  margin-right: 8px;
  flex-shrink: 0;
}

.img-upload-filename {
  flex: 1;
  min-width: 0;
  color: #666;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.img-upload-placeholder {
  color: #999;
  font-size: 14px;
}
</style>

<style lang="less">
.template-file-preview-modal-wrap {
  .ant-modal-title,
  .ant-modal-body,
  .ant-btn,
  .ant-empty-description {
    font-size: 14px;
  }
}
</style>
