<script lang="ts">
import { defineComponent, inject, reactive, ref, toRefs, computed } from 'vue';
import { message } from 'ant-design-vue';
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn';
import { useUserStore } from '@/store/modules/user';
import { WeiI18n } from '@/utils/WeiI18n';
import { NoticeInfoRequestDTOModel } from '@/api/models/notice/NoticePOModel';
import { ProductPlatformParameterInfoUpdateDTOModel } from '@/api/models/product/ProductPlatformParameterInfoUpdateDTOModel';
import { ProductPlatformParameterInfoRequestDTOModel } from '@/api/models/product/ProductPlatformParameterInfoRequestDTOModel';
import { ProductSeriesGBOMInfoRequestDTOModel } from '@/api/models/product/ProductSeriesGBOMInfoRequestDTOModel';
import { AdminApiSystemProduct } from '@/api/tags/product/产品平台后台';
import type { TableColumnType } from 'ant-design-vue';
import { sortermethod } from '@/utils/tools';
export default defineComponent({
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
    const rules = [
      {
        required: true,
        message: WeiI18n.t('名称不能为空').value,
      },
    ];
    const formRef = ref<any>(null);
    const userStore = useUserStore();
    const treeList = ref<Array<any>>([]);
    const originalTreeList = ref<Array<any>>([]);
    const searchText = ref('');
    const selectedRowkeys = ref<Array<string | number>>([]);
    const selectedRowList = ref<Array<any>>([]);
    const tableLoading = ref(false);
    const titleInfo = ref('');
    // GBOM定义表格列配置
    const columns = ref<TableColumnType<ProductSeriesGBOMInfoRequestDTOModel>[]>([
      {
        title: WeiI18n.$t('GBOM名称'),
        dataIndex: 'descript',
        key: 'descript',
        align: 'left',
        resizable: true,
        width: 200,
        sorter: (a: any, b: any) => sortermethod(a.descript, b.descript),
      },
      {
        title: WeiI18n.$t('系统功能分类标识'),
        dataIndex: 'techid',
        key: 'techid',
        align: 'left',
        resizable: true,
        width: 200,
        sorter: (a: any, b: any) => sortermethod(a.techid, b.techid),
      },
    ]);
    const formData = reactive({
      id: '',
      name: '',
      descript: '',
      pdmName: '',
      techid: '',
      isInherit: '3',
      required: false,
      associationId: '',
    });
    const listVisible = ref(false);
    function customGetContainer() {
      // 返回自定义挂载节点
      return document.querySelector('.modal-container2');
    }

    function customGxglGetContainer() {
      // 返回自定义挂载节点
      return document.querySelector('.glgx-modal');
    }
    const updatePlatformParameter = reactive(new ProductSeriesGBOMInfoRequestDTOModel());
    async function updateParaneterInfo() {
      formRef.value
        .validate()
        .then(() => {
          if (titleInfo.value == '编辑GBOM节点') {
            updatePlatformParameter.id = Number(formData.id);
          }
          updatePlatformParameter.associationId = formData.associationId;
          updatePlatformParameter.descript = formData.descript;
          updatePlatformParameter.sign = formData.isInherit;
          updatePlatformParameter.required = formData.required;
          context.emit('updateParaneterInfo', updatePlatformParameter, titleInfo.value);
          // 调用表单验证方法
        })
        .catch(errorInfo => {
          // 验证失败
          console.log('验证失败', errorInfo);
        });
    }
    function handleClose() {
      context.emit('close');
    }
    // 初始化数据
    function addParameterInfoData(data: any) {
      titleInfo.value = '新增GBOM节点';
      if (data != undefined) {
        formData.name = data.descript;
      } else {
        formData.name = '根节点';
      }
      formData.pdmName = '';
      formData.techid = '';
      formData.associationId = '';
      formData.descript = '';
      formData.isInherit = '3';
      formData.required = false;
    }

    // 初始化数据
    function editParameterInfoData(data: any) {
      titleInfo.value = '编辑GBOM节点';
      formData.descript = data.descript;
      formData.pdmName = data.pdmName;
      formData.techid = data.techid;
      formData.associationId = data.associationId;
      formData.isInherit = data.sign;
      formData.id = data.id;
      formData.required = data.required !== undefined ? data.required : false;
    }
    async function getTreeList() {
      selectedRowkeys.value = []; // 清空选中key
      selectedRowList.value = []; // 清空选中数据
      listVisible.value = true; // 先打开弹框
      tableLoading.value = true; // 开始加载
      searchText.value = formData.descript;
      if (titleInfo.value == '编辑GBOM节点') {
        selectedRowkeys.value.push(formData.associationId);
      }
      try {
        const res = await AdminApiSystemProduct.getGBOMTreeList(updatePlatformParameter);
        treeList.value = res.data.data;
        originalTreeList.value = JSON.parse(JSON.stringify(res.data.data)); // 保存原始数据用于搜索重置
        // 默认展开所有节点
        flattenTreeData(treeList.value);
        handleSearch();
      } catch (error) {
        console.error('获取GBOM树列表失败:', error);
        message.error('获取数据失败，请重试');
      } finally {
        tableLoading.value = false; // 无论成功失败，都停止加载
      }
    }

    // 递归扁平树数据，收集所有节点ID
    function flattenTreeData(nodes) {
      if (!Array.isArray(nodes)) return;

      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          flattenTreeData(node.children);
        }
      });
    }

    // 搜索功能
    function handleSearch() {
      if (!searchText.value.trim()) {
        treeList.value = JSON.parse(JSON.stringify(originalTreeList.value));

        flattenTreeData(treeList.value);
        return;
      }

      const keyword = searchText.value.trim();
      // 复制原始数据，避免直接修改
      const filteredList = JSON.parse(JSON.stringify(originalTreeList.value));

      // 对复制的数据进行递归过滤
      const result = filterTreeList(filteredList, keyword);

      treeList.value = result;
    }

    // 递归过滤树结构
    function filterTreeList(nodes, keyword) {
      if (!Array.isArray(nodes)) {
        return [];
      }

      return nodes.reduce((acc, node) => {
        // 检查当前节点是否匹配
        const nodeMatches = (node.descript && node.descript.includes(keyword)) || (node.techid && node.techid.includes(keyword));

        // 检查子节点是否匹配
        let hasMatchingChild = false;
        if (node.children && node.children.length > 0) {
          const filteredChildren = filterTreeList(node.children, keyword);
          if (filteredChildren.length > 0) {
            node.children = filteredChildren;
            hasMatchingChild = true;
          } else {
            // 如果子节点都不匹配，移除children属性
            delete node.children;
          }
        }

        // 如果当前节点匹配或有匹配的子节点，则保留该节点
        if (nodeMatches || hasMatchingChild) {
          acc.push(node);
        }

        return acc;
      }, []);
    }

    // 清空搜索
    function clearSearch() {
      searchText.value = '';
      treeList.value = JSON.parse(JSON.stringify(originalTreeList.value));
    }

    // 未定义的方法实现
    function updateParaneterInfoList() {
      // 实现确认按钮逻辑
      console.log('确认选择');
      listVisible.value = false;
    }

    function handleCloseList() {
      // 关闭弹窗时清空搜索
      clearSearch();
      listVisible.value = false;
    }

    const locale = ref({
      cancelSort: WeiI18n.t('点击取消排序').value,
      triggerAsc: WeiI18n.t('点击升序').value,
      triggerDesc: WeiI18n.t('点击降序').value,
      emptyText: h({
        description: '数据为空',
        style: { paddingBottom: '50px' },
      }),
    });
    /** 表格勾选事件 */
    const rowSelection = computed(() => {
      /**
       * @param selectedRowKeys 选中的行数量
       * @param selectedRows  选中的行数据
       */
      return {
        type: 'radio',
        selectedRowKeys: selectedRowkeys.value,
        onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
          selectedRowList.value = selectedRows;
          selectedRowkeys.value = selectedRowKeys;
          if (selectedRows && selectedRows.length > 0) {
            formData.pdmName = selectedRows[0].descript || '';
            formData.techid = selectedRows[0].techid || '';
            formData.associationId = selectedRows[0].id || '';
          }
        },
      };
    });
    function customRow(record: any) {
      return {
        onClick: () => {
          if (record.id == selectedRowkeys.value[0]) {
            selectedRowkeys.value = [];
            selectedRowList.value = [];
            formData.pdmName = '';
            formData.techid = '';
            formData.associationId = '';
          } else {
            selectedRowkeys.value = [];
            selectedRowList.value = [];
            selectedRowkeys.value.push(record.id);
            selectedRowList.value.push(record);
            formData.pdmName = record.descript || '';
            formData.techid = record.techid || '';
            formData.associationId = record.id || '';
          }
        },
      };
    }

    return {
      visible,
      rules,
      formRef,
      formData,
      listVisible,
      treeList,
      originalTreeList,
      searchText,
      columns,
      rowSelection,
      selectedRowkeys,
      selectedRowList,
      tableLoading,
      titleInfo,
      locale,
      customRow,
      customGetContainer,
      customGxglGetContainer,
      updateParaneterInfo,
      addParameterInfoData,
      editParameterInfoData,
      handleClose,
      handleCloseList,
      getTreeList,
      handleSearch,
      clearSearch,
      updateParaneterInfoList,
    };
  },
});
</script>

<template>
  <div class="modal-container2" v-dragModal>
    <a-modal
      v-model:visible="visible"
      :getContainer="customGetContainer"
      style="width: 40%"
      :title="$t(titleInfo)"
      :mask-closable="false"
      @ok="updateParaneterInfo"
      @cancel="handleClose">
      <a-form ref="formRef" :model="formData" style="margin-top: 20px">
        <a-form-item :label="$t('父节点名称')" v-if="titleInfo == '新增GBOM节点'" name="name">
          <a-input v-model:value="formData.name" disabled="true" placeholder="请输入" />
        </a-form-item>
        <a-form-item :label="$t('名称')" name="descript" :rules="rules">
          <a-input v-model:value="formData.descript" placeholder="请输入" />
        </a-form-item>
        <a-form-item :label="$t('构型项名称')" name="pdmName">
          <div style="display: flex; align-items: center">
            <a-input v-model:value="formData.pdmName" disabled="true" placeholder="请选择" style="width: 85%; margin-right: 10px" />
            <a style="color: blue; cursor: pointer" @click="getTreeList">关联构型</a>
          </div>
        </a-form-item>
        <a-form-item :label="$t('系统功能分类标识')" name="techid">
          <a-input v-model:value="formData.techid" disabled="true" placeholder="请选择" />
        </a-form-item>
        <a-form-item :label="$t('标记')" name="isInherit">
          <a-select v-model:value="formData.isInherit" style="flex: 1">
            <a-select-option value="1">选型</a-select-option>
            <a-select-option value="2">安装</a-select-option>
            <a-select-option value="3">选型&安装</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <a-form-item :label="$t('必选/可选项')" name="required">
        <a-switch v-model:checked="formData.required" checked-children="必选" un-checked-children="可选" style="margin-left: 10px" />
      </a-form-item>
      <template #footer>
        <a-button type="primary" @click="updateParaneterInfo">
          {{ $t('确定') }}
        </a-button>
        <a-button @click="handleClose">
          {{ $t('取消') }}
        </a-button>
      </template>
    </a-modal>
  </div>
  <div class="glgx-modal" v-dragModal>
    <a-modal
      v-model:visible="listVisible"
      :getContainer="customGxglGetContainer"
      style="width: 50%"
      :title="$t('关联GBOM节点')"
      :mask-closable="false"
      @ok="updateParaneterInfoList"
      @cancel="handleCloseList">
      <div>
        <div style="margin-bottom: 16px">
          <a-input v-model:value="searchText" placeholder="请输入GBOM名称或系统功能分类标识" allow-clear style="width: 300px; margin-right: 10px" @pressEnter="handleSearch" />
          <a-button type="primary" @click="handleSearch"> 搜索 </a-button>
        </div>
      </div>
      <a-card>
        <a-table
          :columns="columns"
          row-key="id"
          :data-source="treeList"
          :loading="tableLoading"
          :locale="locale"
          :pagination="false"
          style="height: 500px; overflow-y: auto; overflow-x: hidden"
          :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')"
          :row-selection="rowSelection"
          :customRow="customRow">
          <template #emptyText>
            <p>暂无数据</p>
          </template>
        </a-table>
      </a-card>
      <template #footer>
        <a-button type="primary" @click="updateParaneterInfoList">
          {{ $t('确定') }}
        </a-button>
        <a-button @click="handleCloseList">
          {{ $t('取消') }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
.modal-container2 {
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
