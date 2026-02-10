<template>
  <a-spin :spinning="loading" tip="加载中..." style="margin-top: 10%">
    <a-card>
      <a-form layout="inline" :label-col="{ style: { width: '180px' } }">
        <span style="font-weight: 700; font-size: 18px">十五五-十六五产品规划：</span>
        <a-form-item>
          <a-select v-model:value="addYear" @change="selectchange" style="width: 220px" placeholder="请选择要查询的年度规划">
            <a-select-option v-for="item in addYearList" :key="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card class="card-main">
      <a-card class="card-bottom" bordered="false" v-for="(item, index) in datasource" :key="index">
        <a-card-grid :hoverable="false" style="width: 19%; background-color: #dde6f7">
          <div class="card-list">
            <!-- <EpcIcon type="icon-niandukaohe" class="cardIcon" /> -->
            <div class="Year-text" style="display: flex">{{ item.planYear }}年度规划</div>
          </div>
        </a-card-grid>
        <a-card-grid style="width: 19%; margin-left: 1%" v-for="(ite, idne) in item.planQuarterList" :key="idne">
          <div class="card-list" style="cursor: pointer" @click="handleClick(item, ite)">
            <EpcIcon class="cardIcon" :type="DynamicIcon(ite.planQuarter)" :style="getplanQuarterStyle(ite.planQuarter)" />
            <div class="Quarter-text" :style="getplanQuarterStyle(ite.planQuarter)">{{ ite.planQuarter }}</div>
          </div>
        </a-card-grid>
      </a-card>
    </a-card>
  </a-spin>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { getplanQuarterStyle } from '@/style/StatusStyle';
import { AdminApiSystemProductSpecification } from '@/api/tags/productSpecification/产品规划后台';
const emit = defineEmits(['Enterquarterlylist']);
const addYearList = ref([
  {
    label: WeiI18n.t('十五五产品规划').value,
    value: '5',
  },
  {
    label: WeiI18n.t('十六五产品规划').value,
    value: '10',
  },
]);
const addYear = ref<string>('5');
const loading = ref<boolean>(false);
const datasource = ref<any[]>([]);
function selectchange(value: string) {
  addYear.value = value;
  getListData();
}
async function getListData() {
  loading.value = true;
  try {
    const res = await AdminApiSystemProductSpecification.getproducthomeList({ addYear: addYear.value });
    if (res.data.code == 200) {
      datasource.value = res.data.data || [];
    }
  } finally {
    loading.value = false;
  }
}
function handleClick(item: any, ite: any) {
  emit('Enterquarterlylist', item, ite);
}
/**
 * @param name
 * @description 通过item判断icon路径
 */
function DynamicIcon(value: string) {
  let str = '';
  if (value === 'Q1') {
    str = 'icon-gearFan1';
  } else if (value === 'Q2') {
    str = 'icon-gearFan2';
  } else if (value === 'Q3') {
    str = 'icon-gearFan3';
  } else if (value === 'Q4') {
    str = 'icon-gearFan4';
  }
  return str;
}
onMounted(() => {
  getListData();
});
</script>
<style scoped lang="less">
.card-main {
  height: calc(100vh - 200px);
  overflow: auto;
}
.card-bottom {
  border: none !important; /* !important 强制覆盖默认样式 */
  box-shadow: none; /* 可选：同时移除阴影 */
}
.card-list {
  height: 100px;
  .Year-text {
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    color: #1890ff;
    background: raliceblue;
  }
  .Quarter-text {
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    font-size: 16px;
    font-weight: 500;
    background: raliceblue;
  }
  .cardIcon {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 35px;
    height: 60px;
  }
}
:deep(.card-bottom:not(:first-child)) {
  background-color: white;
  margin-top: 25px;
}
:deep(.card-bottom .ant-card-grid) {
  padding: 0;
  height: 100px;
  border-radius: 10px;
  border: 1px solid #d9d9d9;
  background-color: #f0f2f5;
}
</style>
