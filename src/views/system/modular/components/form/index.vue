<script lang="ts">
import { defineComponent, defineEmits, inject, nextTick, reactive, ref } from 'vue';
import type { UnwrapRef } from 'vue';
import { message } from 'ant-design-vue';
import type { TreeSelectProps } from 'ant-design-vue';
import { AdminApiSystemModular } from '@/api/tags/管理后台模块';

interface formData {
  id: any; // 数据id
  name: any; // 模块名称
  type: any;
  path: any; // 路由地址
  sort: any; // 排序
  typeList: any;
  status: any;
  permission: any;
}

export default defineComponent({
  props: {
    sysIdName: {
      type: String,
    },
    modalVisible: {
      type: Boolean,
    },
  },
  setup(props, context) {
    // const $http: any = inject('$http')
    const treeDataTranslate: any = inject('treeDataTranslate');
    const formRef = ref();
    // 注册自定义事件
    defineEmits(['close']);
    defineEmits(['refreshTableData']);
    const visible = ref(false);
    const formData: UnwrapRef<formData> = reactive({
      id: 0,
      name: '',
      type: 2,
      path: '',
      permission: '',
      sort: 0,
      status: 0,
      typeList: ['目录', '模块', '按钮'],
    });
    const systemIdList = ref([]);
    const menuTreeData = ref<TreeSelectProps[]>([]);
    /** close */
    const handleClose = () => {
      // 通过事件传过去
      visible.value = false;
      context.emit('close');
    };
    /** 获取下拉列表 */
    const getParSelectData = () => {
      const parMenuData = AdminApiSystemModular.getSimpleModularList({});
      parMenuData.then((res: any) => {
        const data = res.data;
        menuTreeData.value = treeDataTranslate(data.data, 'id');
      });
    };
    /**
     * handle
     * @param id
     * @param parentId
     */
    const handleModalAddOrUpdate = async (id: any, parentId?: number) => {
      formData.id = id || 0;
      visible.value = true;
      await nextTick();
      formRef.value.resetFields();
      if (formData.id) {
        // 弹窗--修改
        AdminApiSystemModular.getModular({ id: formData.id }).then((res: any) => {
          const data = res.data;
          formData.id = data.data.id;
          formData.name = data.data.name;
          formData.type = data.data.type;
          formData.path = data.data.path;
          formData.sort = data.data.sort;
          formData.status = data.data.status;
          formData.permission = data.data.permission;
        });
      }
      // getParSelectData()
    };
    /** 表单提交 */
    const onSubmitFormData = () => {
      const data = {
        id: formData.id,
        name: formData.name,
        type: formData.type,
        path: formData.path,
        sort: formData.sort,
        status: formData.status,
        permission: formData.permission,
      };
      if (formData.id) {
        // 修改 保存
        AdminApiSystemModular.updateModular(data).then(() => {
          visible.value = false;
          message.success('操作成功');
          context.emit('refreshTableData');
        });
      } else {
        data.type = 2;
        AdminApiSystemModular.createModular(data).then(() => {
          visible.value = false;
          message.success('操作成功');
          context.emit('refreshTableData');
        });
      }
    };
    return {
      labelCol: { style: { width: '70px' } },
      visible,
      formRef,
      systemIdList, // 系统列表
      menuTreeData, // 权限列表
      formData,
      handleModalAddOrUpdate,
      getParSelectData, // 获取模块列表
      onSubmitFormData, // 表单提交
      handleClose, // 关闭弹窗
    };
  },
});
</script>

<template>
  <a-modal
    v-model:visible="visible"
    style="width: 45%"
    :title="!formData.id ? $t('新增') : $t('编辑')"
    :confirm-loading="$isPending()"
    :mask-closable="false"
    @close="handleClose"
    @ok="onSubmitFormData()"
    @cancel="handleClose">
    <a-form ref="formRef" :model="formData" :label-col="labelCol">
      <a-form-item :label="$t(`${formData.typeList[formData.type - 1]}名称`)" name="name">
        <a-input v-model:value="formData.name" :placeholder="`${formData.typeList[formData.type - 1]}名称`" />
      </a-form-item>

      <a-form-item :label="$t('显示排序')" name="sort">
        <a-input-number v-model:value="formData.sort" />
      </a-form-item>
      <a-form-item :label="$t('路由地址')" name="path">
        <a-input v-model:value="formData.path" :placeholder="$t('请输入路由地址')" class="login-form-forgot" />
      </a-form-item>
      <!--      <a-form-item> -->
      <!--        <a-button @click="onSubmitFormData()" type="primary" style="float: right;margin-left: 10px">确定</a-button> -->
      <!--        <a-button @click="handleClose" style="float: right">取消</a-button> -->
      <!--      </a-form-item> -->
    </a-form>
  </a-modal>
</template>

<style scoped></style>
