<template>
  <div class="itemTitle">
    <span>{{ text }}</span>
    <div class="selectWrap" v-if="showSelect">
      <!-- 平台筛选 -->
      <a-select
        @change="changePlatform"
        v-model:value="value0"
        class="select"
        placeholder="选择平台"
        size="large"
        style="width: 197px"
        v-if="props.showPlatform && platformList && platformList.length">
        <a-select-option v-for="item in platformList" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
      </a-select>

      <!-- 系列筛选 -->
      <a-select
        @change="changeSeries"
        v-model:value="value1"
        class="select"
        placeholder="选择系列"
        size="large"
        style="width: 197px"
        v-if="props.showSeries && seriesList && seriesList.length">
        <a-select-option v-for="item in seriesList" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
      </a-select>

      <!-- 项目筛选 -->
      <a-select
        @change="changeProject"
        v-model:value="value2"
        class="select"
        placeholder="选择项目"
        size="large"
        style="width: 197px"
        v-if="props.showProject && filteredProjectList && filteredProjectList.length">
        <a-select-option v-for="item in filteredProjectList" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
      </a-select>
      <a-select @change="changePlan" v-model:value="value3" class="select" placeholder="选择规划" size="large" style="width: 197px" v-if="optionsPlan && optionsPlan.length">
        <a-select-option v-for="item in optionsPlan" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
      </a-select>
      <!-- 阶段筛选 -->
      <a-select @change="changePhase" v-model:value="value4" class="select" placeholder="选择阶段" size="large" style="width: 197px" v-if="showPhase">
        <a-select-option v-for="item in phaseList" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
      </a-select>
      <a-select @change="changeTime" v-model:value="value5" class="select" placeholder="选择时间" size="large" style="width: 197px" v-if="showTime">
        <a-select-option v-for="item in timeOptions" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
      </a-select>
    </div>
    <div class="btnWrap" v-if="showBtn">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useIndexStore } from '@/store/data-screen';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';

const indexStore = useIndexStore();
const { updateSelectProjectId, updatePhaseList, projectList, updateSelectPhaseId, updateSelectPlatformId, updateSelectSeriesId, updateSeriesList, filterProjectList } = indexStore;
const { selectProjectId, phaseList, selectPhaseId, platformList, seriesList, selectPlatformId, selectSeriesId } = storeToRefs(indexStore);

const emits = defineEmits(['changePhase', 'changeTime']);

const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  optionsProject: {
    type: Array,
    default: () => [],
  },
  optionsPlan: {
    type: Array,
    default: () => [],
  },

  optionsPhase: {
    type: Array,
    default: () => [],
  },
  showSelect: {
    type: Boolean,
    default: false,
  },
  // 控制平台筛选框显示
  showPlatform: {
    type: Boolean,
    default: false,
  },
  // 控制系列筛选框显示
  showSeries: {
    type: Boolean,
    default: false,
  },
  // 控制项目筛选框显示
  showProject: {
    type: Boolean,
    default: false,
  },
  showPhase: {
    type: Boolean,
    default: false,
  },
  // 阶段Id
  phaseId: {
    type: Number,
    default: null,
  },
  // 展示按钮
  showBtn: {
    type: Boolean,
    default: false,
  },
  // 时间筛选
  showTime: {
    type: Boolean,
    default: false,
  },
  timeOptions: {
    type: Array,
    default: () => [],
  },
});

const value0 = ref(); // 平台
const value1 = ref(); // 系列
const value2 = ref(); // 项目
const value3 = ref(); // 规划
const value4 = ref(props.phaseId || '-1'); // 阶段
const value5 = ref('1'); // 时间

// 修改平台
const changePlatform = val => {
  updateSelectPlatformId(val);
  // 更新系列列表
  updateSeriesList(projectList, val);
  // 重置项目选择
  value2.value = '';
  updateSelectProjectId('');
};

// 修改系列
const changeSeries = val => {
  updateSelectSeriesId(val);
  // 重置项目选择
  value2.value = '';
  updateSelectProjectId('');
};

// 修改项目
const changeProject = val => {
  updateSelectProjectId(val);

  const phaseList = projectList.find(item => item.value === val)?.phaseList;
  updatePhaseList(phaseList);
  updateSelectPhaseId('-1');
  value4.value = '-1';
};

// 修改规划
const changePlan = val => {
  emits('changePlan', val);
};

// 改变阶段
const changePhase = val => {
  value4.value = val;
  emits('changePhase', val);
};

// 修改时间
const changeTime = val => {
  value5.value = val;
  emits('changeTime', val);
};

// 计算属性：根据平台和系列筛选项目列表
const filteredProjectList = computed(() => {
  return filterProjectList(selectPlatformId.value, selectSeriesId.value);
});

watch(
  selectProjectId.value,
  val => {
    if (val) {
      selectProjectId.value && (value2.value = val);
    }
  },
  { immediate: true },
);

watch(
  () => props.phaseId,
  val => {
    value4.value = val;
  },
);

// 监听平台选择变化
watch(
  selectPlatformId.value,
  val => {
    if (val) {
      selectPlatformId.value && (value0.value = val);
    }
  },
  { immediate: true },
);

// 监听系列选择变化
watch(
  selectSeriesId.value,
  val => {
    if (val) {
      selectSeriesId.value && (value1.value = val);
    }
  },
  { immediate: true },
);
</script>

<style scoped lang="less">
.itemTitle {
  width: 100%;
  height: 51px;
  background-image: url('@/assets/data-screen/common/titleBg.png');
  background-repeat: no-repeat;
  background-size: 597px 100%;
  color: #fff;
  display: flex;
  align-items: center;
  margin-left: -10px;
  padding-left: 76px;
  font-size: 20px;
  font-weight: bold;
  justify-content: space-between;
}

.btnWrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 172px;
  height: 100%;
  background-image: url('@/assets/data-screen/common/btnWrap1.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  text-align: center;
}

.selectWrap {
  display: flex;
  align-items: center;
  gap: 6px;
}

.select {
  :deep(.ant-select-selector) {
    border: none !important;
    box-shadow: none !important;
    border-radius: 2px !important;
    background-color: transparent !important;
    background-image: url('@/assets/data-screen/common/selectBg.png') !important;
    background-size: 100% 100% !important;
    background-repeat: no-repeat !important;
    font-size: 12px;
    font-weight: 400;
    color: #fff !important;
    position: relative;
    height: 49px !important;
    cursor: pointer;

    .ant-select-selection-placeholder,
    .ant-select-selection-item {
      color: #fff !important;
      text-align: center;
      font-size: 20px !important;
      font-weight: bold !important;
      line-height: 49px !important;
    }
  }

  :deep(.ant-select-selection-search-input) {
    height: 49px !important;
    color: #fff !important;
    text-align: center;
    font-size: 20px !important;
    font-weight: bold !important;
  }

  :deep(.ant-select-arrow) {
    right: 21px;
    color: #fff;
  }
}
</style>
