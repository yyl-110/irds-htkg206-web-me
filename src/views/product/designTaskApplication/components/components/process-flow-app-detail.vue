<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { AdminApiSystemProcessTask } from '@/api/tags/processTask/管理后台流程任务';
import { useUserStore } from '@/store/modules/user';
const route = useRoute();
const router = useRouter();
const detailData = ref<Record<string, any>>({});
const userStore = useUserStore();

function getConfidentialLevelText(level: unknown) {
  const map: Record<string, string> = {
    '0': '公开',
    '1': '内部',
    '2': '秘密',
    '3': '机密',
  };
  const key = String(level ?? '');
  if (!key) return '公开';
  return map[key] ?? key;
}

function loadDetailData() {
  const cacheKey = String(route.query.cacheKey ?? '');
  if (!cacheKey) return;
  const raw = sessionStorage.getItem(cacheKey);
  if (!raw) return;
  try {
    detailData.value = JSON.parse(raw);
  } catch {
    detailData.value = {};
  }
}

const projectNo = ref('');
const projectName = computed(() => String(detailData.value?.processName ?? detailData.value?.categoryName ?? ''));
const confidentialLevel = computed(() => getConfidentialLevelText(detailData.value?.confidentialLevel));
const appName = ref('');

//申请编号
async function getAppCode() {
  const res = await AdminApiSystemProcessTask.nextAppCode({});
  projectNo.value = res.data.data;
}
function goBack() {
  router.back();
}

loadDetailData();
</script>

<template>
  <div class="detail-page">
    <div class="detail-page__content">
      <div class="detail-page__name">{{ projectName || '未命名流程' }}</div>

      <div class="detail-page__form">
        <div class="detail-page__row">
          <span class="detail-page__label">独立应用编号:</span>
          <a-input class="detail-page__input" :value="projectNo" disabled />
          <a-button type="primary"><EpcIcon type="icon-liulan" style="font-size: 12px" />浏览</a-button>
          <a-button type="primary" @click="getAppCode"><EpcIcon type="icon-tianjia1" style="font-size: 12px" />申请编号</a-button>
        </div>
        <div class="detail-page__row">
          <span class="detail-page__label">独立应用名称:</span>
          <a-input class="detail-page__input" v-model:value="appName" />
        </div>
        <div class="detail-page__row">
          <span class="detail-page__label">密级:</span>
          <a-select class="detail-page__input" v-model:value="confidentialLevel" placeholder="请选择密级" allow-clear>
            <a-select-option v-for="item in userStore.getConfidentialLevel" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
      </div>

      <div class="detail-page__actions">
        <a-button disabled><EpcIcon type="icon-wenjiandaoru" style="font-size: 12px" />创建流程</a-button>
        <a-button type="primary"><EpcIcon type="icon-paixujiantou" style="font-size: 12px" />下一步</a-button>
        <a-button type="primary" @click="goBack"><EpcIcon type="icon-fanhui" style="font-size: 12px" />返回</a-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.detail-page {
  min-height: calc(100vh - 140px);
  padding: 24px;
  background: #fff;
  box-sizing: border-box;
}

.detail-page__content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.detail-page__image {
  width: 360px;
  height: 180px;
  object-fit: cover;
  border-radius: 4px;
}

.detail-page__name {
  margin: 14px 0 18px;
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
}

.detail-page__form {
  width: 630px;
}

.detail-page__row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 10px;
}

.detail-page__label {
  width: 90px;
  text-align: right;
  color: #1f2937;
}

.detail-page__input {
  width: 320px;
}

.detail-page__actions {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
