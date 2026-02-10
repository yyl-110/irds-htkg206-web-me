<script lang="ts" setup>
import type { CarouselProps } from 'ant-design-vue';
import { computed, onMounted, ref } from 'vue';
import { cardProps } from 'ant-design-vue/es/card/Card'; // 引入组件定义的 props
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import { useLayoutStore } from '@/store/modules/layout/layout';
import { NoticePageRequestDTOModel } from '@/api/models/personal-center/notice/NoticePageRequestDTOModel';
import type { NoticePO } from '@/api/tags/data-contracts';
import { useCache } from '@/hooks/web/useCache';
import { encryptValue } from '@/utils/AES';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { debounce } from '@/hooks/useDebonce';
import type { TokenType } from '@/api/login/types';
import { WeiI18n } from '@/utils/WeiI18n';
import { CommonListRequestDTOModulordermanagementModel } from '@/api/models/ModulemanaGement/CommonListRequestDTOModulemanaGementModel';
import _ from 'lodash-es';
const props = defineProps(cardProps());
const router = useRouter();
const layoutStore = useLayoutStore();
const { wsCache } = useCache();

const componentType = ref<boolean>(false);

/** 搜索参数 */
const categoryRequestParams = ref();

/**
 * @description 监听主页类型
 */
watch(
  () => layoutStore.homeType,
  () => {
    categoryRequestParams.value = '';
    componentType.value = layoutStore.homeType !== 'home';
  },
  { immediate: true }
);

onMounted(() => {
  componentType.value = false;
});
</script>

<template>
  <!-- class="home-container" -->
  <div v-if="!componentType">
    <a-layout-content>
      <div class="carousel-header">
        <!--    首页背景图    -->
        <div class="carousel-item">
          <img style="width: 100%; height: 100%" src="../../assets/bg.jpg" />
        </div>
      </div>
    </a-layout-content>
  </div>
</template>

<style lang="less" scoped>
@import './HomeMain.less';
</style>
