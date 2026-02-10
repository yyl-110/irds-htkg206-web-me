<script lang="ts">
import { defineComponent, defineEmits, inject, nextTick, reactive, ref } from 'vue';
import type { UnwrapRef } from 'vue';
import { message } from 'ant-design-vue';
import type { TreeSelectProps } from 'ant-design-vue';
import { AdminApiSystemPosition } from '@/api/tags/position/管理后台岗位管理';
interface formData {
  id: string | number; // 数据id
  roleName: string;
  roleCode: string;
  modifyFlag: boolean;
}
export default defineComponent({
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
    const treeDataTranslate: any = inject('treeDataTranslate');
    const formRef = ref();
    // 注册自定义事件
    defineEmits(['close']);
    defineEmits(['refreshTableData']);
    const visible = ref(false);
    const formData: UnwrapRef<formData> = reactive({
      id: 0,
      roleName: '',
      roleCode: '',
      modifyFlag: false,
    });
    const systemIdList = ref([]);
    const menuTreeData = ref<TreeSelectProps[]>([]);
    /** close */
    const handleClose = () => {
      // 通过事件传过去
      visible.value = false;
      context.emit('close');
    };
    /**
     * handle
     * @param id
     * @param parentId
     */
    const handleModalAddOrUpdate = async (row: any, parentId?: number) => {
      formData.id = row && row.id ? row.id : 0;
      visible.value = true;
      await nextTick();
      formRef.value.resetFields();
      formData.roleName = row && row.roleName ? row.roleName : '';
      formData.roleCode = row && row.roleCode ? row.roleCode : '';
      formData.modifyFlag = row.modifyFlag;
    };
    /** 表单提交 */
    const onSubmitFormData = async () => {
      try {
        // 调用保存接口
        await formRef.value?.validate();
        const data: any = {
          id: formData.id,
          roleName: formData.roleName,
          roleCode: formData.roleCode,
          modifyFlag: formData.modifyFlag,
        };
        if (formData.id) {
          // 修改 保存
          AdminApiSystemPosition.updateposition(data).then(() => {
            visible.value = false;
            message.success('操作成功');
            context.emit('refreshTableData');
          });
        } else {
          AdminApiSystemPosition.createposition(data).then(() => {
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
      return document.querySelector('.modal-position');
    }
    return {
      customGetContainer,
      labelCol: { style: { width: '100px' } },
      visible,
      formRef,
      systemIdList, // 系统列表
      menuTreeData, // 权限列表
      formData,
      handleModalAddOrUpdate,
      onSubmitFormData, // 表单提交
      handleClose, // 关闭弹窗
    };
  },
});
</script>

<template>
  <div class="modal-position" v-dragModal>
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
        <a-form-item :label="$t('岗位名称')" name="roleName" :rules="[{ required: true, message: `${$t('请输入岗位名称')}` }]">
          <a-input maxlength="10" show-count v-model:value="formData.roleName" :placeholder="$t('请输入岗位名称')" />
        </a-form-item>
        <a-form-item :label="$t('岗位编码')" name="roleCode" :rules="[{ required: true, message: `${$t('请输入岗位编码')}` }]">
          <a-input maxlength="10" show-count v-model:value="formData.roleCode" :placeholder="$t('请输入岗位编码')" />
        </a-form-item>
        <!-- <a-form-item :label="$t('编辑标识')" name="modifyFlag" :rules="[{ required: true, message: `${$t('请输入编辑标识')}` }]">
          <a-input v-model:value="formData.modifyFlag" :placeholder="$t('请输入编辑标识')" />
        </a-form-item> -->
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
