<script setup lang="ts">
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { useLayoutStore } from '@/store/modules/layout/layout';
// import { CollectRequestDTOModel } from '@/api/models/personal-center/collect/CollectPageRequestDTOModel';

/** parentNode : 基础机树节点第一条数据key */
const props = defineProps(['showName', 'searchValue', 'node', 'dhhNumber', 'effDate', 'operateshowFlag', 'parentNode']);

const emit = defineEmits(['handleAddCollect']);

const layoutStore = useLayoutStore();

/**
 *
 * @param imageName 获取图片地址
 * @param imageUrl
 */
function getAsseteUrl(imageName: string) {
  return new URL(`../../assets/home/${imageName}`, import.meta.url).href;
}

/** 加购点击类型 */
const purchaseType = ref('');
/** 加购余量数据 */
const PurchaseselectedRowList = ref<any>([]);

/** 加购提示弹窗 */
const MaPartvisible = ref<boolean>(false);

/** 加购弹窗 */
const addModalVisible = ref<boolean>(false);

/** 勾选数据列表 */
const selectedRowList = ref<any>([]);

/**
 * @description 添加购物车事件处理函数
 * @param row 当前行数据
 *
 */
async function handleAddShoppingCart(row: any) {
  if (!row.buyFlag) {
    return message.warning(WeiI18n.t('当前零件不可添加购物车').value);
  }
  row.dhhNumber = props.node.partNumber;
  row.effDate = props.effDate;
  purchaseType.value = '0';
  PurchaseselectedRowList.value = [];
  // selectedRowList.value = []
  // selectedRowList.value.push(row)
  const res = await AdminApiSystemMachiningallowance.getNoByMaPartList([{ maPart: row.partNumber, partName: row.partName }]);
  const data: any = res.data?.data;
  // 使用加工余量数据的件号来加购
  if (data.length > 0) {
    PurchaseselectedRowList.value = [
      {
        maPart: data[0].maPart,
        noMaPart: data[0].noMaPart,
        partName: data[0].partName,
        partNumber: data[0].noMaPart,
        oldPartNumber: row.oldPartNumber,
        epcType: row.epcType,
      },
    ];
    MaPartvisible.value = true;
  } else {
    // 使用当前数据的件号来加购
    AddpurchaseMethod(row);
  }
}

function AddpurchaseMethod(row: any) {
  if (!row.buyFlag) {
    return message.warning(WeiI18n.t('当前零件不可添加购物车').value);
  } else {
    selectedRowList.value = [];
    selectedRowList.value.push(row);
    addModalVisible.value = true;
  }
}

function BatchAddPurchaseMethod(arr: any) {
  const flag = arr.every((item: any) => {
    return ['part', 'PART'].includes(item.epcType) && item.buyFlag;
  });
  if (!flag) {
    message.warning(WeiI18n.t('包含不能加购零件，请重新选择').value);
    return;
  }
  selectedRowList.value = arr;
  addModalVisible.value = true;
}

/**
 *@description 行内数据点击事件
 * @param data
 * @param selectedRowList 全部勾选数据
 */
function batchhandleOk(data: Array<object>[]) {
  if (purchaseType.value === '0') {
    AddpurchaseMethod(data[0]);
  } else {
    BatchAddPurchaseMethod(data);
  }
  MaPartvisible.value = false;
}
function batchcancel(data: Array<object>[]) {
  if (purchaseType.value === '0') {
    AddpurchaseMethod(data[0]);
  } else {
    BatchAddPurchaseMethod(data);
  }
  MaPartvisible.value = false;
}

/** 收藏添加  */
// const requestCollectParams = reactive(new CollectRequestDTOModel());

const $router = useRouter();

/**
 * @description 添加收藏事件处理函数
 * @param row 当前行数据
 *
 */
// async function handleAddCollect(row: any) {
//   row.favoriteFlag = !row.favoriteFlag;
//   // 收藏
//   if (row.favoriteFlag) {
//     requestCollectParams.objType = row.epcType;
//     requestCollectParams.objName = row.partName;
//     requestCollectParams.objNumber = row.partNumber;
//     requestCollectParams.oldNumber = row.oldPartNumber ? row.oldPartNumber : '';
//     requestCollectParams.objId = row.id;
//     requestCollectParams.favoriteFrom = '零件图册';
//     requestCollectParams.url = $router.currentRoute.value.path;
//     requestCollectParams.params = JSON.stringify({
//       id: row.id,
//       partNumber: row.partNumber,
//       masterId: row.masterId,
//     });
//     const res = await AdminApiSystemCollect.createCollect({
//       ...requestCollectParams,
//     });
//     if (res.data.code === 200) {
//       message.success(WeiI18n.t('收藏成功').value);
//     }
//   } else {
//     // 取消收藏
//     requestCollectParams.objType = row.epcType;
//     requestCollectParams.objNumber = row.partNumber;
//     requestCollectParams.objId = row.id;
//     requestCollectParams.oldNumber = row.oldPartNumber ? row.oldPartNumber : '';
//     const res = await AdminApiSystemCollect.unCollect({
//       ...requestCollectParams,
//     });
//     if (res.data.code === 200) {
//       message.success(WeiI18n.t('取消成功').value);
//     }
//   }
// }
</script>

<template>
  <div>
    <span v-if="showName.indexOf(searchValue) > -1">
      {{ showName.substring(0, showName.indexOf(searchValue)) }}
      <span style="color: #f50">{{ searchValue }}</span>
      {{ showName.substring(showName.indexOf(searchValue) + searchValue.length) }}
      <!-- 基础机显示视图 -->
      <span v-if="parentNode">
        <img
          v-if="parentNode === node.key && operateshowFlag"
          :src="getAsseteUrl(`headerMenu/购物车${node.buyFlag ? '-selected' : ''}.png`)"
          alt=""
          :style="{
            width: '12px',
            height: '12px',
            margin: '0 10px',
            cursor: node.buyFlag ? 'pointer' : 'not-allowed',
            display: layoutStore.systemType === 'system' ? 'inline-block' : 'none',
          }"
          @click.stop="handleAddShoppingCart(node)" />
        <img
          v-if="parentNode === node.key && operateshowFlag"
          :src="getAsseteUrl(`headerMenu/收藏${node.favoriteFlag ? '-selected' : ''}.png`)"
          alt=""
          :style="{ width: '12px', height: '12px', cursor: 'pointer', display: layoutStore.systemType === 'system' ? 'inline-block' : 'none' }"
          @click.stop="handleAddCollect(node)"
      /></span>
      <!-- 修理包  专用工具显示视图 -->
      <span v-else>
        <img
          v-show="operateshowFlag"
          :src="getAsseteUrl(`headerMenu/购物车${node.buyFlag ? '-selected' : ''}.png`)"
          alt=""
          :style="{
            width: '12px',
            height: '12px',
            margin: '0 10px',
            cursor: node.buyFlag ? 'pointer' : 'not-allowed',
            display: layoutStore.systemType === 'system' ? 'inline-block' : 'none',
          }"
          @click.stop="handleAddShoppingCart(node)" />
        <img
          v-show="operateshowFlag"
          :src="getAsseteUrl(`headerMenu/收藏${node.favoriteFlag ? '-selected' : ''}.png`)"
          alt=""
          :style="{ width: '12px', height: '12px', cursor: 'pointer', display: layoutStore.systemType === 'system' ? 'inline-block' : 'none' }"
          @click.stop="handleAddCollect(node)"
      /></span>
    </span>
    <span v-else>{{ showName }}</span>
  </div>
</template>

<style scoped lang="less"></style>
