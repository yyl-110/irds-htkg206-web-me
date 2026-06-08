<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';
import { AdminApiReportPreparation, type ReportPreparationTemplateDTO } from '@/api/tags/product/报告编制';
import { createEmptyImageNode, EMPTY_IMAGE_STYLE } from '@/utils/emptyState';

const router = useRouter();

const keyword = ref('');
const loading = ref(false);
const taskList = ref<ReportPreparationTemplateDTO[]>([]);

const bgImages = [
  new URL('@/assets/images/process-bg-1.png', import.meta.url).href,
  new URL('@/assets/images/process-bg-2.png', import.meta.url).href,
  new URL('@/assets/images/process-bg-3.png', import.meta.url).href,
  new URL('@/assets/images/process-bg-6.png', import.meta.url).href,
];

const CONFIDENTIAL_LEVEL_LABELS: Record<number, string> = {
  0: '公开',
  1: '内部',
  2: '秘密',
  3: '机密',
};

type TaskCard = {
  id: string | number;
  title: string;
  authorText: string;
  dateText: string;
  statusTag: string;
  fileTypeLabel: string;
  heroBgUrl: string;
  raw: ReportPreparationTemplateDTO;
};

function pickFirstText(record: ReportPreparationTemplateDTO, keys: string[]) {
  const row = record as Record<string, unknown>;
  for (const key of keys) {
    const v = row[key];
    if (v != null && String(v).trim() !== '') {
      return String(v).trim();
    }
  }
  return '';
}

function fileExtFromName(name: string) {
  const s = String(name ?? '').trim();
  const i = s.lastIndexOf('.');
  return i >= 0 ? s.slice(i + 1).toLowerCase() : '';
}

function resolveCreatorName(record: ReportPreparationTemplateDTO) {
  return pickFirstText(record, ['creatorName', 'createUserName', 'createName', 'createUser']);
}

function resolveCreateTime(record: ReportPreparationTemplateDTO) {
  return pickFirstText(record, ['createTime', 'createData', 'gmtCreate']);
}

function resolvePublishStatus(record: ReportPreparationTemplateDTO) {
  const row = record as Record<string, unknown>;
  const raw = row.status ?? row.publishStatus ?? row.publish_status;
  if (raw == null || String(raw).trim() === '') {
    return 0;
  }
  return Number(raw) === 1 ? 1 : 0;
}

function isPublished(record: ReportPreparationTemplateDTO) {
  return resolvePublishStatus(record) === 1;
}

function resolveFileType(record: ReportPreparationTemplateDTO) {
  const row = record as Record<string, unknown>;
  const direct = row.fileType ?? row.suffix ?? row.fileExtension;
  if (direct != null && String(direct).trim() !== '') {
    return String(direct).trim();
  }
  const name = record.oldFileName || record.fileName || '';
  return fileExtFromName(name) || 'docx';
}

function formatConfidentialTag(record: ReportPreparationTemplateDTO) {
  const raw = record.confidentialLevel;
  const n = Number(raw);
  if (Number.isFinite(n) && CONFIDENTIAL_LEVEL_LABELS[n]) {
    return CONFIDENTIAL_LEVEL_LABELS[n];
  }
  const text = String(raw ?? '').trim();
  if (['公开', '内部', '秘密', '机密'].includes(text)) {
    return text;
  }
  return text || '公开';
}

function normalizeRecord(record?: ReportPreparationTemplateDTO | null): ReportPreparationTemplateDTO | null {
  if (!record) {
    return null;
  }
  return {
    ...record,
    id: record.id,
    fileId: record.fileId != null ? String(record.fileId) : undefined,
  };
}

function unwrapList(res: any): ReportPreparationTemplateDTO[] {
  const data = res?.data?.data ?? res?.data ?? res;
  return Array.isArray(data) ? data : [];
}

function getCardBackground(index: number) {
  return bgImages[index % bgImages.length];
}

function mapItemToCard(item: ReportPreparationTemplateDTO, index: number): TaskCard {
  const title = pickFirstText(item, ['para2', 'fileName', 'oldFileName', 'para1']) || '--';
  const createTime = resolveCreateTime(item);
  const fileType = resolveFileType(item);
  return {
    id: item.id ?? `row-${index}`,
    title,
    authorText: resolveCreatorName(item) || '--',
    dateText: createTime ? dayjs(createTime).format('YYYY-MM-DD') : '--',
    statusTag: formatConfidentialTag(item),
    fileTypeLabel: fileType.toUpperCase(),
    heroBgUrl: getCardBackground(index),
    raw: item,
  };
}

const taskCards = computed<TaskCard[]>(() => {
  const kw = keyword.value.trim().toLowerCase();
  const published = taskList.value.filter(isPublished);
  console.log(published);
  const mapped = published.map((item, index) => mapItemToCard(item, index));
  if (!kw) {
    return mapped;
  }
  return mapped.filter(
    card =>
      card.title.toLowerCase().includes(kw) ||
      card.authorText.toLowerCase().includes(kw) ||
      card.dateText.includes(kw) ||
      card.statusTag.toLowerCase().includes(kw) ||
      card.fileTypeLabel.toLowerCase().includes(kw) ||
      pickFirstText(card.raw, ['para1']).toLowerCase().includes(kw),
  );
});

async function loadPublishedTasks() {
  loading.value = true;
  try {
    const res = await AdminApiReportPreparation.getTemplateList({
      keyword: keyword.value.trim() || undefined,
    });
    taskList.value = unwrapList(res)
      .map((item: ReportPreparationTemplateDTO) => normalizeRecord(item))
      .filter((item): item is ReportPreparationTemplateDTO => !!item);
    console.log(taskList.value);
  } catch (e) {
    console.error(e);
    taskList.value = [];
    message.error('获取报告编制任务失败');
  } finally {
    loading.value = false;
  }
}

function onSearch() {
  void loadPublishedTasks();
}

function openTaskCard(card: TaskCard) {
  const record = card.raw;
  if (record.id == null) {
    message.warning('缺少模板ID');
    return;
  }
  if (!record.fileId) {
    message.warning('暂无模板文件');
    return;
  }
  router.push({
    name: 'ReportPreparationSetting',
    query: {
      templateId: String(record.id),
      fileId: String(record.fileId),
      templateName: record.para2 || record.para1 || '',
    },
  });
}

onMounted(() => {
  void loadPublishedTasks();
});
</script>

<template>
  <div class="report-preparation-page">
    <div class="task-panel">
      <div class="task-panel__toolbar">
        <a-input v-model:value="keyword" placeholder="请输入查询条件" allow-clear class="task-panel__search-input" @press-enter="onSearch">
          <template #prefix>
            <SearchOutlined class="task-panel__search-icon" />
          </template>
        </a-input>
      </div>

      <div class="task-panel__content">
        <a-spin :spinning="loading" tip="加载中...">
          <div v-if="taskCards.length" class="task-panel__cards">
            <div v-for="card in taskCards" :key="String(card.id)" class="task-card" @click="openTaskCard(card)">
              <div class="task-card__hero" :style="{ backgroundImage: `url(${card.heroBgUrl})` }">
                <span class="task-card__file-type">{{ card.fileTypeLabel }}</span>
                <div class="task-card__hero-stack">
                  <span class="task-card__hero-title" :title="card.title">{{ card.title }}</span>
                </div>
              </div>
              <div class="task-card__footer">
                <span class="task-card__footer-left" :title="card.authorText">{{ card.authorText }}</span>
                <span class="task-card__footer-center">{{ card.dateText }}</span>
                <span class="task-card__footer-right">{{ card.statusTag }}</span>
              </div>
            </div>
          </div>
          <a-empty
            v-else-if="!loading"
            class="task-panel__empty"
            description="暂无已发布的报告编制任务"
            :image="createEmptyImageNode('暂无数据')"
            :image-style="EMPTY_IMAGE_STYLE" />
        </a-spin>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.report-preparation-page {
  width: 100%;
  min-height: 100%;
  padding: 20px;
  box-sizing: border-box;
  overflow-x: hidden;
  background: #fff;
}

.task-panel {
  width: 100%;
  min-height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
}

.task-panel__toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  flex-shrink: 0;
}

.task-panel__search-input {
  width: 260px;
  max-width: 260px;
  flex-shrink: 0;
}

.task-panel__search-input :deep(.ant-input-affix-wrapper) {
  width: 260px;
  max-width: 260px;
  border-radius: 10px;
  padding: 6px 14px;
  min-height: 40px;
  font-size: 14px;
  border: 1px solid #d9d9d9;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.task-panel__search-input :deep(.ant-input-affix-wrapper:hover) {
  border-color: #69b1ff;
  box-shadow: 0 2px 8px rgba(22, 119, 255, 0.08);
}

.task-panel__search-input :deep(.ant-input-affix-wrapper-focused),
.task-panel__search-input :deep(.ant-input-affix-wrapper:focus-within) {
  border-color: #1677ff;
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.15);
}

.task-panel__search-icon {
  color: #8c8c8c;
  font-size: 15px;
  transition: color 0.2s ease;
}

.task-panel__search-input :deep(.ant-input-affix-wrapper-focused) .task-panel__search-icon,
.task-panel__search-input :deep(.ant-input-affix-wrapper:focus-within) .task-panel__search-icon {
  color: #1677ff;
}

.task-panel__content {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.task-panel__cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, 256px);
  gap: 18px 20px;
  align-content: start;
  justify-content: start;
  padding-bottom: 8px;
}

.task-card {
  box-sizing: border-box;
  width: 256px;
  height: 223px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition:
    transform 0.28s ease,
    box-shadow 0.28s ease;
  will-change: transform;
}

.task-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
}

.task-card__hero {
  position: relative;
  box-sizing: border-box;
  height: 179px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 8px;
  background-color: #1a6bb8;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.task-card__hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0, 40, 90, 0.35) 0%, rgba(0, 0, 0, 0.12) 100%);
  pointer-events: none;
  transition:
    opacity 0.28s ease,
    background 0.28s ease;
}

.task-card:hover .task-card__hero::before {
  opacity: 0.55;
  background: linear-gradient(135deg, rgba(0, 40, 90, 0.18) 0%, rgba(0, 0, 0, 0.06) 100%);
}

.task-card__file-type {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  min-width: 36px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.92);
  color: #389e0d;
  font-size: 11px;
  font-weight: 600;
  line-height: 18px;
  text-align: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}

.task-card__hero-stack {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  max-height: 100%;
}

.task-card__hero-title {
  font-size: 18px;
  font-weight: 400;
  line-height: 1.3;
  color: #fff;
  text-align: center;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
  transition:
    color 0.28s ease,
    text-shadow 0.28s ease;
  width: 100%;
  padding: 0 8px;
}

.task-card:hover .task-card__hero-title {
  color: #0052d9;
  text-shadow: none;
}

.task-card__footer {
  box-sizing: border-box;
  height: 44px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  padding: 0 10px;
  background: #fff;
  font-size: 12px;
  color: #262626;
}

.task-card__footer-left {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-card__footer-center {
  flex-shrink: 0;
  color: #595959;
}

.task-card__footer-right {
  flex-shrink: 0;
  color: #262626;
}

.task-panel__empty {
  margin-top: 48px;
}
</style>
