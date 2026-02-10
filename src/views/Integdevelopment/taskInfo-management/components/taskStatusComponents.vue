<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes';
import { inject, nextTick, reactive, ref, watch, onMounted } from 'vue';
import type { TableColumnType, TreeProps } from 'ant-design-vue';
import { Modal, Popconfirm, message, Tabs as ATabs } from 'ant-design-vue';
const { TabPane: ATabPane } = ATabs;
import { WeiI18n } from '@/utils/WeiI18n';
import DesignTree from '@/components/tree/DesignTree.vue';
import { EpcIcon } from '@/components/icon/EpcIcon';
import { AdminApiSystemProductSpecification } from '@/api/tags/productSpecification/产品规划后台';

const props = defineProps({
  /** 保存按钮状态 */
  keepDisabled: {
    require: false,
    type: Boolean,
    default: '',
  },
  /** 提交按钮状态 */
  submitDisabled: {
    require: false,
    type: Boolean,
    default: '',
  },
  /** 编辑按钮状态 */
  updateDisabled: {
    require: false,
    type: Boolean,
    default: '',
  },
  submitDisplay: {
    require: false,
    type: Boolean,
    default: true,
  },
});

const planTaskInfo = ref<any>({});
const productInfo = ref<any>({});
async function initInfo(node: any, product: any) {
  planTaskInfo.value = node;
  productInfo.value = product;
}

const emit = defineEmits(['submitOk', 'getTaskWorkStatus', 'getDeliverablesFileInfo', 'refreshTree']);
async function submitOk() {
  //调取父节点单独保存页面逻辑方法
  emit('submitOk', 0);
}

async function submitAdd() {
  //父节点回滚调取子保存方法
  const res = await AdminApiSystemProductSpecification.updateTaskWorkStatus({ id: planTaskInfo.value.id, type: 0, progress: planTaskInfo.value.progress });
  if (res.data.code == 200) {
    message.success(WeiI18n.t('保存成功').value);
    emit('getTaskWorkStatus');
    if (
      planTaskInfo.value.associatePageUrl == '020-Gsgcdy' ||
      planTaskInfo.value.associatePageUrl == '030-Gszcdy' ||
      planTaskInfo.value.associatePageUrl == '070-Jpfx' ||
      planTaskInfo.value.associatePageUrl == '150-Tzhgfx' ||
      planTaskInfo.value.associatePageUrl == '200-Cpjzlss' ||
      planTaskInfo.value.associatePageUrl == '220-Jswwkfxq' ||
      planTaskInfo.value.associatePageUrl == '230-Zdcghzcl' ||
      planTaskInfo.value.associatePageUrl == '260-Tzphss' ||
      planTaskInfo.value.associatePageUrl == '320-Zdyxcl' ||
      planTaskInfo.value.associatePageUrl == '330-Zdfbfa' ||
      planTaskInfo.value.associatePageUrl == '340-Gctzgh' ||
      planTaskInfo.value.associatePageUrl == '350-Tzyshgs'
    ) {
      emit('getDeliverablesFileInfo');
    }
  }
}
async function submitCommit() {
  //父节点回滚调取子提交方法
  const res = await AdminApiSystemProductSpecification.updateTaskWorkStatus({ id: planTaskInfo.value.id, type: 1 });
  if (res.data.code == 200) {
    message.success(WeiI18n.t('提交成功').value);
    emit('getTaskWorkStatus');
    emit('refreshTree', planTaskInfo.value.id);
    if (
      planTaskInfo.value.associatePageUrl == '020-Gsgcdy' ||
      planTaskInfo.value.associatePageUrl == '030-Gszcdy' ||
      planTaskInfo.value.associatePageUrl == '070-Jpfx' ||
      planTaskInfo.value.associatePageUrl == '150-Tzhgfx' ||
      planTaskInfo.value.associatePageUrl == '200-Cpjzlss' ||
      planTaskInfo.value.associatePageUrl == '220-Jswwkfxq' ||
      planTaskInfo.value.associatePageUrl == '230-Zdcghzcl' ||
      planTaskInfo.value.associatePageUrl == '260-Tzphss' ||
      planTaskInfo.value.associatePageUrl == '320-Zdyxcl' ||
      planTaskInfo.value.associatePageUrl == '330-Zdfbfa' ||
      planTaskInfo.value.associatePageUrl == '340-Gctzgh' ||
      planTaskInfo.value.associatePageUrl == '350-Tzyshgs'
    ) {
      emit('getDeliverablesFileInfo');
    }
  }
}
function submit() {
  Modal.confirm({
    title: `确定要提交该页面吗？`,
    okText: WeiI18n.t('确定').value,
    cancelText: WeiI18n.t('取消').value,
    async onOk() {
      submitStatus();
    },
  });
}
async function submitStatus() {
  //提交逻辑
  if (
    planTaskInfo.value.associatePageUrl == '020-Gsgcdy' ||
    planTaskInfo.value.associatePageUrl == '030-Gszcdy' ||
    planTaskInfo.value.associatePageUrl == '070-Jpfx' ||
    planTaskInfo.value.associatePageUrl == '150-Tzhgfx' ||
    planTaskInfo.value.associatePageUrl == '200-Cpjzlss' ||
    planTaskInfo.value.associatePageUrl == '220-Jswwkfxq' ||
    planTaskInfo.value.associatePageUrl == '230-Zdcghzcl' ||
    planTaskInfo.value.associatePageUrl == '260-Tzphss' ||
    planTaskInfo.value.associatePageUrl == '320-Zdyxcl' ||
    planTaskInfo.value.associatePageUrl == '330-Zdfbfa' ||
    planTaskInfo.value.associatePageUrl == '340-Gctzgh' ||
    planTaskInfo.value.associatePageUrl == '350-Tzyshgs' ||
    planTaskInfo.value.associatePageUrl == '270-Zdbfqcpzhclps' ||
    planTaskInfo.value.associatePageUrl == '360-Dybfqzhcpghbgps' ||
    planTaskInfo.value.associatePageUrl == '040-Zlmbfj' ||
    planTaskInfo.value.associatePageUrl == '080-Jsqxfx' ||
    planTaskInfo.value.associatePageUrl == '100-Scqxfx' ||
    planTaskInfo.value.associatePageUrl == '110-Yhtdfx' ||
    planTaskInfo.value.associatePageUrl == '120-Flfgfx' ||
    planTaskInfo.value.associatePageUrl == '140-Wgbjfx' ||
    planTaskInfo.value.associatePageUrl == '160-Dybfqcpzhqdpc' ||
    planTaskInfo.value.associatePageUrl == '180-Qdcpzhpx' ||
    planTaskInfo.value.associatePageUrl == '240-Xlyc' ||
    planTaskInfo.value.associatePageUrl == '250-Srylryc' ||
    planTaskInfo.value.associatePageUrl == '270-Zdbfqcpzhclps' ||
    planTaskInfo.value.associatePageUrl == '300-Zdcplb' ||
    planTaskInfo.value.associatePageUrl == '390-Zdcpkfjh' ||
    planTaskInfo.value.associatePageUrl == '310-Yftzys' ||
    planTaskInfo.value.associatePageUrl == 'XQ050-Xqfx' ||
    planTaskInfo.value.associatePageUrl == '190-Ssgdph' ||
    planTaskInfo.value.associatePageUrl == '210-Zdcpzhsmzqcl'
  ) {
    emit('submitOk', 1);
  } else {
    const res = await AdminApiSystemProductSpecification.updateTaskWorkStatus({ id: planTaskInfo.value.id, type: 1 });
    if (res.data.code == 200) {
      message.success(WeiI18n.t('提交成功').value);
      emit('getTaskWorkStatus');
      emit('refreshTree', planTaskInfo.value.id);
    }
  }
}
async function editStatus() {
  //编辑逻辑
  const res = await AdminApiSystemProductSpecification.updateTaskWorkStatus({ id: planTaskInfo.value.id, type: 2 });
  if (res.data.code == 200) {
    message.success(WeiI18n.t('编辑成功').value);
    emit('getTaskWorkStatus');
  }
}

defineExpose({ initInfo, submitAdd, submitCommit });
</script>

<template>
  <div class="foot-btn" v-if="planTaskInfo.headUserId == productInfo.headUserId && planTaskInfo.parentNodeName == productInfo.parentNodeName">
    <div class="backBtn">
      <a-button @click="submitOk()" type="primary" :disabled="keepDisabled">
        <EpcIcon type="icon-baocun" style="font-size: 15px" />
        保存</a-button
      >
      <a-button v-if="submitDisplay" class="btn_left" @click="submit()" type="primary" :disabled="submitDisabled">
        <EpcIcon type="icon-tijiaoqueren" style="font-size: 12px" />
        提交</a-button
      >
      <a-button class="btn_left" @click="editStatus()" type="primary" :disabled="updateDisabled">
        <EpcIcon type="icon-edit" style="font-size: 15px" />
        编辑</a-button
      >
    </div>
  </div>
</template>

<style lang="less" scoped>
.foot-btn {
  width: 100%;
  height: 60px;
  background-color: #fff;
  margin-left: 16px;
  margin-bottom: 30px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 20px;
  .btn_left {
    margin-left: 15px;
  }
}
</style>
