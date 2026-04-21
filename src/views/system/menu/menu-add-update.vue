<script lang="ts">
import { defineComponent, defineEmits, inject, nextTick, reactive, ref } from 'vue';
import type { UnwrapRef } from 'vue';
import { message } from 'ant-design-vue';
import type { TreeSelectProps } from 'ant-design-vue';
import { getMenuAddSaveData, getMenuUpdateData, getMenuUpdateSaveData, getParMenuData } from '@/api/system/menu';
import { WeiIcon, WeiIconSelect } from '@/wei-components';

interface formData {
  id: any;
  parentId: any;
  name: any;
  type: any;
  icon: any;
  path: any;
  component: any;
  componentName: any;
  permission: any;
  sort: any;
  status: any;
  visible: any;
  alwaysShow: any;
  keepAlive: any;
  typeList: any;
}

export default defineComponent({
  components: { WeiIconSelect, WeiIcon },
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
      parentId: '',
      name: '',
      type: 1,
      icon: '',
      path: '',
      component: '',
      componentName: '',
      permission: '',
      sort: 0,
      status: 0,
      visible: true,
      alwaysShow: true,
      keepAlive: true,
      typeList: ['目录', '菜单', '按钮'],
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
      const parMenuData = getParMenuData({});
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
        getMenuUpdateData({ id: formData.id }).then((res: any) => {
          const data = res.data;
          formData.id = data.data.id;
          formData.name = data.data.name;
          formData.type = data.data.type;
          formData.icon = data.data.icon;
          formData.parentId = data.data.parentId;
          formData.path = data.data.path;
          formData.component = data.data.component;
          formData.componentName = data.data.componentName;
          formData.permission = data.data.permission;
          formData.sort = data.data.sort;
          formData.status = data.data.status;
          formData.visible = data.data.visible;
          formData.alwaysShow = data.data.alwaysShow;
          formData.keepAlive = data.data.keepAlive;
        });
      } else {
        formData.parentId = parentId === null || parentId === undefined ? undefined : parentId;
      }
      getParSelectData();
    };
    /** 表单提交 */
    const onSubmitFormData = () => {
      const data = {
        id: formData.id,
        name: formData.name,
        type: formData.type,
        icon: formData.icon,
        parentId: formData.parentId,
        path: formData.path,
        component: formData.component,
        componentName: formData.componentName,
        permission: formData.permission,
        sort: formData.sort,
        status: formData.status,
        visible: formData.visible,
        alwaysShow: formData.alwaysShow,
        keepAlive: formData.keepAlive,
      };
      if (formData.id) {
        // 修改 保存
        getMenuUpdateSaveData(data).then(() => {
          visible.value = false;
          message.success('操作成功');
          context.emit('refreshTableData');
        });
      } else {
        getMenuAddSaveData(data).then(() => {
          visible.value = false;
          message.success('操作成功');
          context.emit('refreshTableData');
        });
      }
    };
    function customGetContainer() {
      // 返回自定义挂载节点
      return document.querySelector('.menu-addorUpdate');
    }
    return {
      labelCol: { style: { width: '70px' } },
      visible,
      formRef,
      systemIdList, // 系统列表
      menuTreeData, // 权限列表
      formData,
      handleModalAddOrUpdate,
      getParSelectData, // 获取菜单列表
      onSubmitFormData, // 表单提交
      handleClose, // 关闭弹窗
      customGetContainer,
    };
  },
});
</script>

<template>
  <!-- <div class="menu-addorUpdate" v-dragModal>      :getContainer="customGetContainer"-->
  <a-modal
    v-model:visible="visible"
    style="width: 45%; top: 10vh; height: 80vh;"
    :body-style="{ height: 'calc(80vh - 108px)', overflowY: 'auto' }"
    :title="$t(!formData.id ? '新增' : '编辑')"
    :confirm-loading="$isPending()"
    :mask-closable="false"
    @close="handleClose"
    @ok="onSubmitFormData()"
    @cancel="handleClose">
    <a-form ref="formRef" :model="formData" :label-col="labelCol">
      <a-form-item :label="$t('上级菜单')" name="parentId">
        <a-tree-select
          v-model:value="formData.parentId"
          show-search
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :placeholder="$t('请选择上级菜单')"
          allow-clear
          tree-default-expand-all
          :tree-data="menuTreeData"
          :height="233"
          tree-node-filter-prop="name"
          :field-names="{ children: 'children', label: 'name', value: 'id' }">
          <template #title="{ name }">
            {{ name }}
          </template>
        </a-tree-select>
      </a-form-item>
      <a-form-item :label="`${formData.typeList[formData.type - 1]}名称`" name="name">
        <a-input v-model:value="formData.name" :placeholder="`${formData.typeList[formData.type - 1]}名称`" />
      </a-form-item>
      <a-form-item :label="$t('菜单类型')" name="type">
        <a-radio-group v-model:value="formData.type">
          <a-radio :value="1">
            {{ $t('目录') }}
          </a-radio>
          <a-radio :value="2">
            {{ $t('菜单') }}
          </a-radio>
          <a-radio :value="3">
            {{ $t('按钮') }}
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-if="formData.type !== 3" :label="`${formData.typeList[formData.type - 1]}图标`" name="icon">
        <!-- <a-input v-model:value="formData.icon" :placeholder="formData.typeList[formData.type - 1] + '图标'" allow-clear></a-input> -->
        <a-input-group compact>
          <a-input v-model:value="formData.icon" :placeholder="$t('请选择图标')" style="width: calc(100% - 200px)" />
          <WeiIconSelect v-model="formData.icon">
            <a-button>
              <template #icon>
                <WeiIcon :icon="formData.icon || 'svg-icon:select'" />
              </template>
            </a-button>
          </WeiIconSelect>
        </a-input-group>
      </a-form-item>
      <a-form-item v-if="formData.type !== 3" :label="$t('路由地址')" name="path">
        <a-input v-model:value="formData.path" :placeholder="$t('请输入路由地址')" />
      </a-form-item>
      <a-form-item v-if="formData.type === 2" :label="$t('组件地址')" name="component">
        <a-input v-model:value="formData.component" placeholder="例如说：system/user/index" />
      </a-form-item>
      <a-form-item v-if="formData.type === 2" :label="$t('组件名称')" name="componentName">
        <a-input v-model:value="formData.componentName" placeholder="例如说：SystemUser" />
      </a-form-item>
      <a-form-item v-if="formData.type !== 1" :label="$t('权限标识')" name="permission">
        <a-input v-model:value="formData.permission" :placeholder="$t('请输入权限标识')" />
      </a-form-item>
      <a-form-item :label="$t('显示排序')" name="sort">
        <a-input-number v-model:value="formData.sort" />
      </a-form-item>
      <a-form-item :label="$t('菜单状态')" name="status">
        <a-radio-group v-model:value="formData.status">
          <a-radio :value="0">
            {{ $t('开启') }}
          </a-radio>
          <a-radio :value="1">
            {{ $t('关闭') }}
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-if="formData.type !== 3" :label="$t('显示状态')" name="visible">
        <a-radio-group v-model:value="formData.visible">
          <a-radio :value="true">
            {{ $t('显示') }}
          </a-radio>
          <a-radio :value="false">
            {{ $t('隐藏') }}
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-if="formData.type !== 3" :label="$t('总是显示')" name="alwaysShow">
        <a-radio-group v-model:value="formData.alwaysShow">
          <a-radio :value="true">
            {{ $t('总是') }}
          </a-radio>
          <a-radio :value="false">
            {{ $t('不是') }}
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-if="formData.type === 2" :label="$t('缓存状态')" name="keepAlive">
        <a-radio-group v-model:value="formData.keepAlive">
          <a-radio :value="true">
            {{ $t('缓存') }}
          </a-radio>
          <a-radio :value="false">
            {{ $t('不缓存') }}
          </a-radio>
        </a-radio-group>
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
  <!-- </div> -->
</template>

<style scoped lang="less">
.menu-addorUpdate {
  position: relative;
}
</style>
