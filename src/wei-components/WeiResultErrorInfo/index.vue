<script lang="ts" setup>
import { HttpStatusCode } from 'axios';
import { computed } from 'vue';
import ErrorResultIcon from '@/assets/zc-images/error-result-icon.png';
import ErrorResultIcon404 from '@/assets/zc-images/error-result-icon-404-new.png';
import ErrorResultIcon403 from '@/assets/zc-images/error-result-icon-403.png';
import { WeiI18n } from '@/utils/WeiI18n';

interface ResultErrorItem {
  code?: string;
  description: string;
  icon?: string;
}

const props = defineProps<ComponentProps>();

/**
 * 错误信息
 */
const ResultError = computed<Partial<Record<keyof typeof HttpStatusCode, ResultErrorItem>>>(() => {
  return {
    InternalServerError: {
      description: WeiI18n.$t('抱歉, 服务器出错了'),
      // icon: ErrorResultIcon,
    },
    NotFound: {
      description: WeiI18n.$t('非常抱歉，你访问的页面不存在'),
      icon: ErrorResultIcon404,
    },
    Forbidden: {
      description: WeiI18n.$t('非常抱歉，您无权访问该页面'),
      icon: ErrorResultIcon403,
    },
  };
});

/** 错误类型 */
interface ComponentProps {
  /** 结果类型 */
  result?: keyof typeof HttpStatusCode;
  /** 标题底部提示信息 */
  tips?: string;
  /** 错误信息标题 */
  title?: string;
  /** 错误信息图标 */
  errorIcon?: string;
  /** 详细错误信息 */
  description?: string;
}

/** 错误结果信息, 默认使用 InternalServerError */
const resultStatus = computed(() => props.result || 'InternalServerError');
const resultError = computed(() => ResultError.value[resultStatus.value]);
const code = computed(() => (resultError.value?.code || HttpStatusCode[resultStatus.value]).toString());
const icon = computed(() => props.errorIcon || resultError.value?.icon || ErrorResultIcon);
</script>

<template>
  <div class="wei-result-info-component w-full flex justify-center items-center mt-[15vh] space-x-[40px]">
    <a-image :src="icon" :width="230" :preview="false" alt="error result icon" />
    <section>
      <div v-if="title" class="text-main text-[80px]">
        {{ title }}
      </div>
      <div v-else class="text-main text-[100px]">
        {{ code }}
      </div>
      <div class="text-secondary text-[20px] mb-[10px]">
        {{ description || resultError?.description }}
      </div>
      <footer>
        <slot name="footer" />
      </footer>
    </section>
  </div>
</template>

<style lang="less" scoped></style>
