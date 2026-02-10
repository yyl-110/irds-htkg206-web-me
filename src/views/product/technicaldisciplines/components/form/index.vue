<script lang="ts">
import { defineComponent, defineEmits, inject, nextTick, reactive, ref } from 'vue';
import type { UnwrapRef } from 'vue';
import { message } from 'ant-design-vue';
import type { TreeSelectProps } from 'ant-design-vue';
import { findParentNode } from '@/utils/tools';
import { useUserStore } from '@/store/modules/user';
import { AdminApiSystemTechnicaldisciplines } from '@/api/tags/technicaldisciplines/管理后台技术学科管理';
import { AdminApiSystemUser } from '@/api/tags/管理后台用户';
interface formData {
  id: string | number; // 数据id
  parentId: string | number;
  roleName: string;
  categoryName: string;
  userId: string | number;
}
export default defineComponent({
  props: {
    modalVisible: {
      type: Boolean,
    },
    treeData: {
      require: true,
      type: Array,
      default: [],
    },
    selectedRowList: {
      require: true,
      type: Array,
      default: [],
    },
  },
  setup(props, context) {
    const formRef = ref();
    // 注册自定义事件
    defineEmits(['close']);
    defineEmits(['refreshTableData']);
    const visible = ref(false);
    const formData: UnwrapRef<formData> = reactive({
      id: '',
      parentId: '',
      roleName: '',
      userId: '',
      categoryName: '',
    });
    interface userData {
      value: string | number;
      label: string;
    }
    const userData = ref<userData[]>([]);
    const systemIdList = ref([]);
    const menuTreeData = ref<TreeSelectProps[]>([]);
    /** 获取用户下拉列表数据 */
    function getUsergroupData() {
      try {
        AdminApiSystemUser.getSimpleUsers().then((res: any) => {
          userData.value = res.data.data?.map((item: any) => ({ label: `${item.nickname}  （${item.username}）`, value: item.id })) || [];
        });
      } catch (error) {}
    }
    /** close */
    const handleClose = () => {
      // 通过事件传过去
      visible.value = false;
      context.emit('close');
    };

    /**
     * handle
     * @param row 行数据
     */
    const handleModalAddOrUpdate = async (row: any) => {
      visible.value = true;
      await nextTick();
      getUsergroupData();
      formRef.value.resetFields();
      formData.id = row && row.id ? row.id : 0;
      if (row) {
        let rootNode = findParentNode(props.treeData, row.id, null, 'id');
        formData.parentId = rootNode && rootNode.id ? rootNode.id : 0;
        formData.roleName = rootNode && rootNode.name ? rootNode.name : '根节点';
        formData.categoryName = row.categoryName;
        formData.userId = row.userId;
      } else {
        formData.parentId = props.selectedRowList[0] ? props.selectedRowList[0].id : 0;
        formData.roleName = props.selectedRowList[0] ? props.selectedRowList[0].categoryName : '根节点 ';
        formData.categoryName = '';
        formData.userId = '';
      }
    };
    /** 表单提交 */
    const onSubmitFormData = async () => {
      try {
        // 调用保存接口
        await formRef.value?.validate();
        const data: any = {
          id: formData.id,
          parentId: formData.parentId,
          categoryName: formData.categoryName,
          userId: formData.userId,
        };
        if (formData.id) {
          // 修改 保存
          AdminApiSystemTechnicaldisciplines.updatetechnicaldisciplines(data).then(() => {
            visible.value = false;
            message.success('操作成功');
            context.emit('refreshTableData');
          });
        } else {
          AdminApiSystemTechnicaldisciplines.createtechnicaldisciplines(data).then(() => {
            visible.value = false;
            message.success('操作成功');
            context.emit('refreshTableData');
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    const filterselectOption = (input: string, option: any) => {
      return option.key.indexOf(input) >= 0;
    };
    function customGetContainer() {
      // 返回自定义挂载节点
      return document.querySelector('.modal-technicaldisciplines');
    }
    return {
      customGetContainer,
      labelCol: { style: { width: '100px' } },
      visible,
      formRef,
      systemIdList, // 系统列表
      menuTreeData, // 权限列表
      formData,
      userData,
      filterselectOption,
      getUsergroupData,
      handleModalAddOrUpdate,
      onSubmitFormData, // 表单提交
      handleClose, // 关闭弹窗
    };
  },
});
</script>

<template>
  <div class="modal-technicaldisciplines" v-dragModal>
    <a-modal
      :getContainer="customGetContainer"
      v-model:visible="visible"
      style="width: 45%"
      :title="!formData.id ? $t('新增') : $t('编辑')"
      :confirm-loading="$isPending()"
      :ok-text="$t('提交')"
      :cancel-text="$t('取消')"
      :mask-closable="false"
      @close="handleClose">
      <a-form ref="formRef" :model="formData" :label-col="labelCol">
        <a-form-item :label="$t('父节点')" name="roleName">
          <a-input v-model:value="formData.roleName" disabled />
        </a-form-item>
        <a-form-item :label="$t('名称')" name="categoryName" :rules="[{ required: true, message: `${$t('请输入名称')}` }]">
          <a-input maxlength="15" show-count v-model:value="formData.categoryName" :placeholder="$t('请输入名称')" />
        </a-form-item>
        <a-form-item :label="$t('学科负责人')" name="userId" :rules="[{ required: true, message: `${$t('请选择学科负责人')}` }]">
          <a-select v-model:value="formData.userId" allow-clear :placeholder="$t('请选择学科负责人')" style="text-align: left" show-search :filter-option="filterselectOption">
            <a-select-option v-for="item in userData" :key="item.label" :value="item.value">
              <a-tooltip>
                <template #title>
                  {{ item.label }}
                </template>
                {{ item.label }}
              </a-tooltip>
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
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
