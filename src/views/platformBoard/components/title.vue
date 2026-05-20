<template>
  <div class="itemTitle">
    <span>{{ text }}</span>
    <div class="selectWrap" v-if="showSelect">
      <!-- 项目筛选 -->
      <a-select @change="changeProject" :value="value1" class="select" placeholder="选择项目" size="large"
        style="width: 197px" v-if="optionsProject && optionsProject.length" :dropdownMatchSelectWidth="false">
        <a-select-option v-for="item in optionsProject" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
      </a-select>
      <!-- 阶段筛选 -->
      <a-select @change="changePhase" :value="value2" class="select" placeholder="选择阶段" size="large"
        style="width: 197px" v-if="showPhase" :dropdownMatchSelectWidth="false">
        <a-select-option v-for="item in phaseList" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
      </a-select>
      <a-select @change="changeTime" :value="value3" class="select" placeholder="选择时间" size="large"
        style="width: 197px" v-if="showTime" :dropdownMatchSelectWidth="false">
        <a-select-option v-for="item in timeOptions" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
      </a-select>
    </div>
    <div class="btnWrap" v-if="showBtn">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { useIndexStore } from "@/store/data-screen";
import { storeToRefs } from "pinia";

const indexStore = useIndexStore();
const {
  updateSelectProjectId,
  updatePhaseList,
  projectList,
  updateSelectPhaseId,
} = indexStore;
const { selectProjectId, phaseList, selectPhaseId } = storeToRefs(indexStore);

const emits = defineEmits(["changePhase", "changeTime"]);

const props = defineProps({
  text: {
    type: String,
    default: "",
  },
  optionsProject: {
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
  defaultTime: {
    type: String,
    default: "",
  },
});

const value1 = ref(selectProjectId.value); // 项目
const value2 = ref(props.phaseId || "-1"); // 阶段
const value3 = ref(props.defaultTime || "1"); // 时间

// 修改项目
const changeProject = (val) => {
  updateSelectProjectId(val);

  const phaseList = projectList.find((item) => item.value === val)?.phaseList;
  updatePhaseList(phaseList);
  updateSelectPhaseId("-1");
  value2.value = "-1";
};

// 改变阶段
const changePhase = (val) => {
  value2.value = val;
  emits("changePhase", val);
};

// 修改时间
const changeTime = (val) => {
  value3.value = val;
  emits("changeTime", val);
};

watch(
  () => selectProjectId.value,
  (val) => {
    if (val) {
      value1.value = val;
    }
  },
  { immediate: true }
);

watch(
  () => props.phaseId,
  (val) => {
    value2.value = val;
  }
);
</script>

<style scoped lang="less">
.itemTitle {
  width: 100%;
  height: 51px;
  background-image: url("@/assets/data-screen/common/titleBg.png");
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
  background-image: url("@/assets/data-screen/common/btnWrap1.png");
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
    border: none;
    box-shadow: none;
    border-radius: 2px;
    background-color: transparent;
    background-image: url("@/assets/data-screen/common/selectBg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center center;
    font-size: 12px;
    font-weight: 400;
    color: #fff;
    position: relative;
    height: 49px!important;
    cursor: pointer;
    align-items: center;
    .ant-select-selection-item {
      text-align: center;
    }

    .ant-select-selection-placeholder {
      color: #fff;
      text-align: center;
      font-size: 20px;
      font-weight: bold;
    }

  }
  :deep(.ant-select-arrow) {
    right: 21px;
    color: #fff;
  }

  :deep(.a-input__wrapper) {
    border: none;
    box-shadow: none;
    border-radius: 2px;
    background-color: transparent;
    background-image: url("@/assets/data-screen/common/selectBg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    font-size: 12px;
    font-weight: 400;
    color: #fff;
    position: relative;
    height: 49px;
    cursor: pointer;

    .a-input__inner {
      color: #fff;
      text-align: center;
      font-size: 20px;
      font-weight: bold;
    }

    .a-input__suffix {
      position: absolute;
      right: 21px;
    }
  }
}
</style>