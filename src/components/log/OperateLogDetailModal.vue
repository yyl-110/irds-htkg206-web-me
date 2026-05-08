<script setup lang="ts">
import { computed } from 'vue';
import { WeiI18n } from '@/utils/WeiI18n';

/** 与后台操作日志接口行数据兼容的通用字典，其他页面可传入同结构对象 */
export type OperateLogDetailRecord = Record<string, any>;

const props = withDefaults(
  defineProps<{
    /** 与 a-modal 的 visible 同步 */
    visible: boolean;
    /** 详情数据；为 null 时不渲染描述列表 */
    detail: OperateLogDetailRecord | null;
    /** 弹窗标题，默认「操作详情」 */
    modalTitle?: string;
    modalWidth?: string;
  }>(),
  {
    modalTitle: undefined,
    modalWidth: '880px',
  },
);

const emit = defineEmits<{
  'update:visible': [open: boolean];
}>();

const modalVisible = computed({
  get: () => props.visible,
  set: (v: boolean) => emit('update:visible', v),
});

/** 已排除：链路追踪ID、类型、内容、扩展信息 */
const fieldMetas = computed(() => [
  { key: 'userId', label: WeiI18n.t('用户ID').value },
  { key: 'module', label: WeiI18n.t('功能分类').value },
  { key: 'name', label: WeiI18n.t('操作内容').value },
  { key: 'requestMethod', label: WeiI18n.t('请求方式').value },
  { key: 'requestUrl', label: WeiI18n.t('请求地址').value },
  { key: 'userIp', label: WeiI18n.t('用户IP').value },
  { key: 'userAgent', label: WeiI18n.t('浏览器标识').value },
  { key: 'javaMethod', label: WeiI18n.t('Java方法').value },
  { key: 'javaMethodArgs', label: WeiI18n.t('方法入参').value },
  { key: 'createTime', label: WeiI18n.t('操作时间').value },
  { key: 'duration', label: `${WeiI18n.t('耗时').value}(ms)` },
  { key: 'resultCode', label: WeiI18n.t('响应码').value },
  { key: 'resultMsg', label: WeiI18n.t('响应消息').value },
  { key: 'resultData', label: WeiI18n.t('响应数据').value },
  { key: 'id', label: WeiI18n.t('日志ID').value },
  { key: 'userNickname', label: WeiI18n.t('操作用户').value },
]);

function formatFieldValue(row: OperateLogDetailRecord, key: string): string {
  const raw = row[key];
  if (raw === null || raw === undefined)
    return '';
  if (typeof raw === 'object') {
    try {
      return JSON.stringify(raw, null, 2);
    }
    catch {
      return String(raw);
    }
  }
  return String(raw);
}

function valueIsBlock(text: string) {
  return text.includes('\n') || text.length > 120;
}

const displayItems = computed(() => {
  const row = props.detail;
  if (!row)
    return [];
  return fieldMetas.value.map(meta => {
    const text = formatFieldValue(row, meta.key);
    return { key: meta.key, label: meta.label, text, block: valueIsBlock(text) };
  });
});
</script>

<template>
  <a-modal
    v-model:visible="modalVisible"
    :title="modalTitle ?? $t('操作详情')"
    :width="modalWidth"
    :footer="null"
    destroy-on-close
    class="operate-log-detail-modal-wrap">
    <div v-if="detail" class="operate-log-detail-body">
      <a-descriptions bordered size="small" :column="1">
        <a-descriptions-item v-for="item in displayItems" :key="item.key" :label="item.label">
          <pre v-if="item.block" class="operate-log-detail-pre">{{ item.text }}</pre>
          <span v-else class="operate-log-detail-text">{{ item.text }}</span>
        </a-descriptions-item>
      </a-descriptions>
    </div>
  </a-modal>
</template>

<style lang="less" scoped>
.operate-log-detail-body {
  max-height: min(70vh, 640px);
  overflow: auto;
  padding-right: 4px;
}

.operate-log-detail-text {
  word-break: break-word;
}

.operate-log-detail-pre {
  margin: 0;
  max-height: 240px;
  overflow: auto;
  padding: 8px 10px;
  font-size: 12px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
  background: #f7f9fc;
  border-radius: 4px;
}
</style>
