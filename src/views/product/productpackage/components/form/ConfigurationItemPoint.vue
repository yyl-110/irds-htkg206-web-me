<script lang="ts">
import { defineComponent, defineEmits, inject, nextTick, reactive, ref } from 'vue';
import type { UnwrapRef } from 'vue';
import { message } from 'ant-design-vue';
import Empty from '@/components/Empty/index.vue';
import { AdminApiSystemProductpackage } from '@/api/tags/productpackage/管理后台产品包管理';
import { sortermethod } from '@/utils/tools';
import { EpcIcon } from '@/components/icon/EpcIcon.js';
interface formData {
  id: string | number; // 数据id
  vertexName: string;
  remarks: string;
  sortIndex: number;
}
export default defineComponent({
  components: {
    EpcIcon,
  },

  props: {
    sysIdName: {
      type: String,
    },
    modalVisible: {
      type: Boolean,
    },
    /** tab类型 */
    type: {
      require: true,
      type: String,
      default: 'INTER_PART',
    },
  },
  setup(props, context) {
    /** 升序降序提示  */
    const locale = ref({
      cancelSort: WeiI18n.t('点击取消排序').value,
      triggerAsc: WeiI18n.t('点击升序').value,
      triggerDesc: WeiI18n.t('点击降序').value,
      emptyText: h(Empty, {
        description: '数据为空',
        style: {},
      }),
    });
    const loading = ref<boolean>(false);
    const editflag = ref<boolean>(false);
    const formRef = ref();
    // 注册自定义事件
    defineEmits(['close']);
    defineEmits(['refreshTableData']);
    const visible = ref(false);
    const formData: UnwrapRef<formData> = reactive({
      id: 0,
      vertexName: '',
      remarks: '',
      sortIndex: 0,
    });
    /** 列属性key  */
    const columnsKey = ref<Array<string>>(['vertexName', 'remarks', 'sortIndex']);
    const columns = ref([
      {
        title: WeiI18n.t('项点名称').value,
        dataIndex: 'vertexName',
        key: 'vertexName',
        sorter: (a: any, b: any) => sortermethod(a.vertexName, b.vertexName),
        width: 100,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: WeiI18n.t('描述').value,
        dataIndex: 'remarks',
        key: 'remarks',
        sorter: (a: any, b: any) => sortermethod(a.remarks, b.remarks),
        width: 150,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: WeiI18n.t('排序').value,
        dataIndex: 'sortIndex',
        key: 'sortIndex',
        sorter: (a: any, b: any) => sortermethod(a.sortIndex + '', b.sortIndex + ''),
        width: 50,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: WeiI18n.t('操作').value,
        dataIndex: 'operation',
        align: 'center',
        key: 'operation',
        width: 30,
        sortDirections: ['descend', 'ascend'],
      },
    ]);
    const dataSource = ref<any>([]);
    /** close */
    const handleClose = () => {
      // 通过事件传过去
      visible.value = false;
      context.emit('close');
    };
    const AddRow = () => {
      dataSource.value.push({ vertexName: '', remarks: '', sortIndex: dataSource.value.length > 0 ? dataSource.value[dataSource.value.length - 1].sortIndex + 1 : 0 });
    };
    const EditRow = () => {
      editflag.value = true;
    };
    const Cancel = () => {
      editflag.value = false;
    };

    const DeleteRow = (row: any) => {
      dataSource.value = dataSource.value.filter((item: any) => item !== row);
    };

    /**
     * handle
     * @param id
     * @param parentId
     */
    const handleModalAddOrUpdate = async (row: any) => {
      visible.value = true;
      editflag.value = false;
      loading.value = true;
      try {
        formData.id = row && row.id ? row.id : 0;
        AdminApiSystemProductpackage.getpackagedetail({ id: row.id }).then(res => {
          if (res.data.code == 200) {
            let data: any = res.data.data;
            dataSource.value = [];
            dataSource.value = data.packageItemList.sort((a, b) => a.sortIndex - b.sortIndex);
            if (dataSource.value.length == 0) {
              editflag.value = true;
            }
            loading.value = false;
          }
        });
      } finally {
        loading.value = false;
      }
    };
    /** 表单提交 */
    const onSubmitFormData = async () => {
      try {
        // 调用保存接口
        await formRef.value?.validate();
        const data: any = {
          packageTypeId: formData.id,
          packageItemList: [],
        };
        data.packageItemList = dataSource.value;
        if (formData.id) {
          AdminApiSystemProductpackage.updatePackageItem(data).then(() => {
            visible.value = false;
            message.success('操作成功');
            context.emit('refreshTableData');
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    function customGetContainer() {
      // 返回自定义挂载节点
      return document.querySelector('.modal-ConfigurationItemPoint');
    }
    return {
      labelCol: { style: { width: '100px' } },
      visible,
      locale,
      loading,
      columns,
      dataSource,
      formRef,
      columnsKey,
      formData,
      editflag,
      AddRow,
      EditRow,
      DeleteRow,
      Cancel,
      customGetContainer,
      handleModalAddOrUpdate,
      onSubmitFormData, // 表单提交
      handleClose, // 关闭弹窗
      EpcIcon,
    };
  },
});
</script>

<template>
  <div class="modal-ConfigurationItemPoint" v-dragModal>
    <a-modal
      :getContainer="customGetContainer"
      v-model:visible="visible"
      style="width: 50%"
      title="配置项点"
      :confirm-loading="$isPending()"
      :ok-text="$t('提交')"
      :cancel-text="$t('取消')"
      :mask-closable="false"
      @close="handleClose">
      <a-button v-if="editflag" type="primary" style="margin-bottom: 10px" @click="AddRow"> <EpcIcon type="icon-tianjia1" style="font-size: 12px" />{{ $t('添加') }} </a-button>
      <a-button v-if="!editflag" type="primary" style="margin-bottom: 10px" @click="EditRow"> <EpcIcon type="icon-edit" style="font-size: 15px" />{{ $t('编辑') }} </a-button>
      <a-button class="m-left" v-if="editflag" @click="Cancel"> <EpcIcon type="icon-quxiao" style="font-size: 15px" />{{ $t('取消') }} </a-button>
      <a-table
        :pagination="false"
        :loading="loading"
        row-key="itemId"
        :locale="locale"
        :data-source="dataSource"
        :columns="columns"
        :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
        <template #bodyCell="{ column, text, record }">
          <template v-if="columnsKey.includes(column.dataIndex)">
            <div v-if="editflag">
              <a-textarea v-if="column.dataIndex == 'remarks'" class="textarea" v-model:value="record[column.dataIndex]" :rows="1" />
              <a-input v-else maxlength="10" show-count v-model:value="record[column.dataIndex]" />
            </div>
            <div v-else>
              {{ text }}
            </div>
          </template>
          <template v-if="column.dataIndex == 'operation'">
            <a style="color: red" @click.stop="DeleteRow(record)">{{ $t('删除') }}</a>
          </template>
        </template>
      </a-table>
      <template #footer>
        <a-button type="primary" @click="onSubmitFormData">
          {{ $t('确定') }}
        </a-button>
        <a-button @click="handleClose">
          {{ $t('取消') }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<style scoped></style>
