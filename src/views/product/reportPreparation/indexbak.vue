<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from 'vue';
import { DownOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import {
  AdminApiReportPreparation,
  type ReportPreparationPlaceholderDTO,
  type ReportPreparationTemplateDTO,
} from '@/api/tags/product/报告编制';
import { ContentType, httpClient } from '@/api/tags/http-client';
import { parseUploadFileResponse } from '@/utils/file';
import { useUserStore } from '@/store/modules/user';

const userStore = useUserStore();

const tempName = ref('');
const fileId = ref<string | number>('');
const showTemplateModal = ref(false);
const templateList = ref<ReportPreparationTemplateDTO[]>([]);
const templateLoading = ref(false);
const selectedTemplateKeys = ref<(string | number)[]>([]);
const selectedTemplate = ref<ReportPreparationTemplateDTO | null>(null);

const inputHtmlList = ref<ReportPreparationPlaceholderDTO[]>([]);
const formDynamic = ref<Record<string, string>>({});
const formDynamicFileName = ref<Record<string, string>>({});
const parseLoading = ref(false);
const exportLoading = ref(false);
const collapsedSections = ref<Record<string, boolean>>({});

type FormSection = {
  key: string;
  title?: ReportPreparationPlaceholderDTO;
  titleText: string;
  rows: ReportPreparationPlaceholderDTO[][];
};

const templateColumns = [
  { title: '模版编号', dataIndex: 'para1', key: 'para1', align: 'center' as const, width: 200 },
  { title: '模版名称', dataIndex: 'para2', key: 'para2', align: 'center' as const },
];

const rowSelection = computed(() => ({
  type: 'radio' as const,
  selectedRowKeys: selectedTemplateKeys.value,
  onChange: (keys: (string | number)[], rows: ReportPreparationTemplateDTO[]) => {
    selectedTemplateKeys.value = keys;
    selectedTemplate.value = rows.length > 0 ? rows[0] : null;
  },
}));

const isTitleType = (para3?: string) => {
  const t = (para3 ?? '').toString().toLowerCase();
  return t === 'title' || t.includes('title') || t.includes('标题');
};

const buildParamRows = (list: ReportPreparationPlaceholderDTO[]) => {
  const isTextarea = (para3?: string) => {
    const t = (para3 ?? '').toString().toLowerCase();
    return t.includes('textarea') || t.includes('文本域');
  };
  const textareaList: ReportPreparationPlaceholderDTO[] = [];
  const normalList: ReportPreparationPlaceholderDTO[] = [];
  list.forEach(item => {
    if (item && isTextarea(item.para3)) {
      textareaList.push(item);
    } else if (item) {
      normalList.push(item);
    }
  });
  const merged = normalList.concat(textareaList);
  const size = 4;
  const rows: ReportPreparationPlaceholderDTO[][] = [];
  for (let i = 0; i < merged.length; i += size) {
    rows.push(merged.slice(i, i + size));
  }
  return rows;
};

const formSections = computed<FormSection[]>(() => {
  const list = Array.isArray(inputHtmlList.value) ? inputHtmlList.value : [];
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

  list.forEach(item => {
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
});

const toggleSection = (key: string, event?: MouseEvent) => {
  event?.stopPropagation();
  const nextCollapsed = collapsedSections.value[key] !== true;
  collapsedSections.value = {
    ...collapsedSections.value,
    [key]: nextCollapsed,
  };
};

const isSectionExpanded = (key: string) => collapsedSections.value[key] !== true;

const unwrapList = <T,>(res: any): T[] => {
  const data = res?.data?.data ?? res?.data ?? res;
  return Array.isArray(data) ? data : [];
};

const unwrapData = <T,>(res: any): T | undefined => res?.data?.data ?? res?.data;

const openTemplateModal = async () => {
  selectedTemplateKeys.value = [];
  selectedTemplate.value = null;
  templateList.value = [];
  showTemplateModal.value = true;
  templateLoading.value = true;
  try {
    const res = await AdminApiReportPreparation.getTemplateList();
    templateList.value = unwrapList<ReportPreparationTemplateDTO>(res);
    if (!res || templateList.value.length === 0) {
      message.info('暂无报告模板');
    }
  } catch (e) {
    console.error(e);
    message.error('获取模板列表失败');
    showTemplateModal.value = true;
  } finally {
    templateLoading.value = false;
  }
};

const cancelTemplateModal = () => {
  showTemplateModal.value = false;
  selectedTemplateKeys.value = [];
  selectedTemplate.value = null;
};

const confirmTemplate = () => {
  if (!selectedTemplate.value) {
    message.warning('请选择一个模板');
    return;
  }
  tempName.value = selectedTemplate.value.para2 ?? '';
  fileId.value = selectedTemplate.value.fileId ?? '';
  showTemplateModal.value = false;
};

function onTemplateRow(record: ReportPreparationTemplateDTO) {
  return {
    onClick: () => {
      if (record.id == null) {
        return;
      }
      selectedTemplateKeys.value = [record.id];
      selectedTemplate.value = record;
    },
    style: { cursor: 'pointer' },
  };
}

const parseReport = async () => {
  if (!fileId.value) {
    message.warning('请选择模板');
    return;
  }
  parseLoading.value = true;
  try {
    const res = await AdminApiReportPreparation.parseTemplateHtml(fileId.value);
    inputHtmlList.value = unwrapList<ReportPreparationPlaceholderDTO>(res);
    const next: Record<string, string> = {};
    const nextFileName: Record<string, string> = {};
    inputHtmlList.value.forEach(item => {
      if (item?.para2 && !isTitleType(item.para3)) {
        next[item.para2] = '';
        nextFileName[item.para2] = '';
      }
    });
    formDynamic.value = next;
    formDynamicFileName.value = nextFileName;
    collapsedSections.value = {};
    clearTextareaObservers();
    if (inputHtmlList.value.length === 0) {
      message.info('模板中未解析到占位符');
    }
  } catch (e) {
    console.error(e);
  } finally {
    parseLoading.value = false;
  }
};

const exportReport = async () => {
  if (!inputHtmlList.value.length) {
    message.warning('请先解析报告');
    return;
  }
  if (!fileId.value) {
    message.warning('请选择模板');
    return;
  }
  const params: Record<string, string> = {};
  inputHtmlList.value.forEach(item => {
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
    const data = unwrapData<{ fileUrl?: string }>(res);
    if (data?.fileUrl) {
      window.open(data.fileUrl);
      message.success('报告已生成');
    } else {
      message.success('报告已生成');
    }
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
    onError?.(e);
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

const bindTextareaWrap = (el: Element | null) => {
  if (!el || !(el instanceof HTMLElement)) {
    return;
  }
  if (el.dataset.textareaObserved === '1') {
    return;
  }
  nextTick(() => {
    if (el.dataset.textareaObserved === '1') {
      return;
    }
    const textarea = el.querySelector('textarea');
    if (!textarea) {
      return;
    }
    el.dataset.textareaObserved = '1';
    const observer = new ResizeObserver(() => {
      syncSectionBodyHeight(el);
    });
    observer.observe(textarea);
    textareaObserverEntries.push({ wrap: el, observer });
    syncSectionBodyHeight(el);
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

onBeforeUnmount(() => {
  clearTextareaObservers();
});
</script>

<template>
  <div class="report-preparation-page">
    <div class="toolbar-card">
      <a-form :label-col="{ style: { width: '130px' } }" class="toolbar-form">
        <a-form-item label="报告模版选取">
          <a-input v-model:value="tempName" style="width: 200px" disabled />
          <a-button type="primary" class="ml-btn" @click="openTemplateModal">选取模版00</a-button>
          <a-button type="primary" class="ml-btn" :loading="parseLoading" @click="parseReport">解析报告</a-button>
          <a-button type="primary" class="ml-btn" :loading="exportLoading" @click="exportReport">生成报告</a-button>
        </a-form-item>
      </a-form>
    </div>

    <a-form v-if="formSections.length > 0" layout="vertical" class="dynamic-form">
      <div
        v-for="section in formSections"
        :key="section.key"
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
              <a-col v-for="item in row" :key="item.para2" :span="6">
                <a-form-item
                  :label="item.para1"
                  :class="{ 'dynamic-form-item--textarea': normalizeInputType(item.para3) === 'textarea' }">
                  <div v-if="isImgType(item.para3)" class="img-upload-wrap">
                    <a-upload
                      :show-upload-list="false"
                      accept=".jpg,.jpeg,.png"
                      :custom-request="customImgUpload(item)">
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
                      v-model:value="formDynamic[item.para2!]"
                      placeholder="请输入"
                      :rows="3"
                      @mouseup="onTextareaResizeEnd" />
                  </div>
                  <a-input
                    v-else
                    v-model:value="formDynamic[item.para2!]"
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

    <a-modal
      v-model:visible="showTemplateModal"
      title="选择报告模板"
      :width="900"
      :mask-closable="false"
      destroy-on-close
      @cancel="cancelTemplateModal">
      <a-table
        row-key="id"
        :columns="templateColumns"
        :data-source="templateList"
        :loading="templateLoading"
        :pagination="false"
        :scroll="{ y: 400 }"
        :row-selection="rowSelection"
        :custom-row="onTemplateRow"
        bordered
        size="small" />
      <template #footer>
        <a-button type="primary" @click="confirmTemplate">确定</a-button>
        <a-button @click="cancelTemplateModal">取消</a-button>
      </template>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
.report-preparation-page {
  width: 100%;
  min-height: 100%;
  padding: 20px;
  box-sizing: border-box;
  overflow-x: hidden;
}

.toolbar-card {
  margin-bottom: 16px;
  padding: 16px 16px 0;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.toolbar-form {
  margin-bottom: 0;
}

.ml-btn {
  margin-left: 16px;
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
  height: auto;
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
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.section-title-arrow {
  color: #666;
  font-size: 12px;
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
  // padding: 0 4px 8px;
}

.form-section-card.is-collapsed {
  .section-card-header {
    border-bottom: none;
  }
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
  }
}

.dynamic-form-item--textarea {
  :deep(.ant-form-item-control) {
    flex: none;
    height: auto;
  }

  :deep(.ant-form-item-control-input) {
    display: block;
    width: 100%;
    height: auto;
    min-height: 32px;
  }

  :deep(.ant-form-item-control-input-content) {
    display: block;
    overflow: visible;
    height: auto;
  }
}

.dynamic-textarea-wrap {
  display: block;
  width: 100%;
  height: auto;
  min-height: 72px;

  :deep(textarea.ant-input) {
    display: block;
    width: 100%;
    box-sizing: border-box;
    resize: vertical;
    min-height: 72px;
    max-height: none;
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
