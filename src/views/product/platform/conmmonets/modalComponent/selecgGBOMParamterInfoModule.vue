<script lang="ts">
import { defineComponent, inject, reactive, ref, toRefs, computed } from 'vue';
import { message } from 'ant-design-vue';
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn';
import { WeiI18n } from '@/utils/WeiI18n';
import { ProductSeriesGBOMInfoRequestDTOModel } from '@/api/models/product/ProductSeriesGBOMInfoRequestDTOModel';
import type { TableColumnType } from 'ant-design-vue';
export default defineComponent({
  props: {
    modalVisible: {
      type: Boolean,
    },
    resource: {
      trye: Array,
    },
  },
  setup(props, context) {
    /** 弹窗状态 */
    const visible = computed(() => {
      return props.modalVisible;
    });

    const columns = ref<TableColumnType<ProductSeriesGBOMInfoRequestDTOModel>[]>([
      {
        title: WeiI18n.$t('GBOM名称'),
        dataIndex: 'descript',
        key: 'descript',
        align: 'left',
        resizable: true,
        width: 200,
      },
      {
        title: WeiI18n.$t('系统功能分类标识'),
        dataIndex: 'techid',
        key: 'techid',
        align: 'left',
        resizable: true,
        width: 200,
      },
    ]);

    function customGetContainer() {
      // 返回自定义挂载节点
      return document.querySelector('.modal-container8');
    }

    function handleClose() {
      context.emit('close');
    }

    return {
      visible,
      columns,
      customGetContainer,
      handleClose,
    };
  },
});
</script>

<template>
  <div class="modal-container8" v-dragModal>
    <a-modal
      v-model:visible="visible"
      :getContainer="customGetContainer"
      style="width: 50%"
      :style="{ top: '5%' }"
      :title="$t('产品超级构型结构树')"
      :cancel-text="$t('关闭')"
      :ok-button-props="{ hidden: true }"
      :mask-closable="false"
      @cancel="handleClose">
      <a-card>
        <a-table
          :columns="columns"
          row-key="id"
          :data-source="resource"
          :pagination="false"
          style="height: 500px; overflow-y: auto; overflow-x: hidden"
          :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
          <template #emptyText>
            <p>暂无数据</p>
          </template>
        </a-table>
      </a-card>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
.modal-container8 {
  position: relative;
}
/deep/ .ant-modal-mask {
}
/deep/ .ant-form {
  width: 100%;
}
/deep/ .ant-form-item {
  margin-bottom: 16px;
}
/deep/ .ant-form-item-label {
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 32px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
  width: 130px; /* 固定label宽度 */
}
/deep/ .ant-form-item-control {
  position: relative;
  flex: 1;
  min-width: 0;
}
/deep/ .ant-form-item-control-input {
  position: relative;
  display: flex;
  align-items: center;
}
/deep/ .ant-input,
/deep/ .ant-select-selector {
  width: 100%; /* 确保输入框宽度占满剩余空间 */
  box-sizing: border-box;
}

/* 确保下拉菜单可以正确显示，不会被Modal遮挡 */
/deep/ .ant-select-dropdown {
}
</style>
