<script lang="ts">
import { defineComponent, inject, reactive, ref, toRefs } from 'vue';
import { BoardInfoRequestDTOModel } from '@/api/models/board/BoardInfoRequestDTOModel';
import { AdminApiSystemBoard } from '@/api/tags/board/平台看板管理';
const requestParams = reactive(new BoardInfoRequestDTOModel());

export default defineComponent({
  name: 'NoticeData',
  props: {
    modalVisible: {
      type: Boolean,
    },
  },
  setup(props, context) {
    /** 弹窗状态 */
    const visible = computed(() => {
      return props.modalVisible;
    });
    const id = ref(0);
    const reportName = ref('');
    const reportIndex = ref('');
    const reportJSON = ref('1');
    /** handle close */
    const handleClose = () => {
      // 通过事件传过去
      visible.value = false;
      context.emit('close');
    };

    /** handle close */
    async function savePageInfo() {
      requestParams.id = id.value;
      requestParams.reportIndex = reportIndex.value;
      requestParams.reportName = reportName.value;
      requestParams.reportJSON = reportJSON.value;
      // 保存页面信息
      const res = await AdminApiSystemBoard.reportinfoGetReportInfoSaveOrUpdate({
        ...requestParams,
      });
      //刷新父页面列表数据
      context.emit('refresh-table-data');
      //关闭当前窗口
      context.emit('close');
    }

    //初始化数据
    const infoReload = (data: any) => {
      if (data != undefined) {
        id.value = data.id;
        reportName.value = data.reportName;
        reportIndex.value = data.reportIndex;
        reportJSON.value = data.reportJSON;
      } else {
        id.value = 0;
        reportName.value = '';
        reportIndex.value = '';
        reportJSON.value = '';
      }
    };
    function customGetContainer() {
      // 返回自定义挂载节点
      return document.querySelector('.modal-container');
    }
    return {
      visible,
      customGetContainer,
      infoReload,
      handleClose,
      savePageInfo,
      id,
      reportName,
      reportIndex,
      reportJSON,
    };
  },
});
</script>

<template>
  <div class="modal-container" v-dragModal>
    <a-modal
      :getContainer="customGetContainer"
      v-model:visible="visible"
      style="width: 700px"
      :style="{ top: '5%' }"
      :title="$t('报表管理')"
      :confirm-loading="$isPending()"
      :mask-closable="false"
      @ok="savePageInfo"
      @cancel="handleClose">
      <a-form model="formData" style="margin-top: 20px" :label-col="{ style: { width: '80px' } }">
        <a-form-item :label="$t('报表名称')">
          <a-input v-model:value="reportName" placeholder="请输入" name="reportName" />
        </a-form-item>
        <a-form-item :label="$t('报表区域')">
          <a-select placeholder="请选择报表区域" v-model:value="reportIndex" show-search name="reportIndex">
            <a-select-option value="1">1</a-select-option>
            <a-select-option value="2">2</a-select-option>
            <a-select-option value="3">3</a-select-option>
            <a-select-option value="4">4</a-select-option>
            <a-select-option value="5">5</a-select-option>
            <a-select-option value="6">6</a-select-option>
            <a-select-option value="7">7</a-select-option>
            <a-select-option value="8">8</a-select-option>
            <a-select-option value="9">9</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('执行JSON')" name="code">
          <a-textarea v-model:value="reportJSON" placeholder="请输入" name="reportJSON" style="height: 400px" />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button type="primary" @click="savePageInfo">
          {{ $t('确定') }}
        </a-button>
        <a-button @click="handleClose">
          {{ $t('取消') }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<style scoped lang="less"></style>
