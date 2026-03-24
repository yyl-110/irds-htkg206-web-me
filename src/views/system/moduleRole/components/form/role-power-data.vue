<script lang="ts">
import type { UnwrapRef } from 'vue'
import { defineComponent, inject, onMounted, reactive, ref, toRefs } from 'vue'
import { message } from 'ant-design-vue'
import { getRolePowerData, getRoleUpdatePowerData } from '@/api/system/role/index'

interface formData {
  id: any
  name: any
  code: any
  dataScope: any
  dataScopeList: any
  checkedKeys: any
}

export default defineComponent({
  name: 'RolePowerData',
  props: {
    modalVisible: {
      type: Boolean,
    },
  },
  setup(props, context) {
    onMounted(() => {
      getMenuData()
    })
    const formRef = ref()
    const treeDataTranslate: any = inject('treeDataTranslate')
    const visible = ref(false)
    const expandAll = ref(true)
    const checkStrictly = ref(false)
    const formData: UnwrapRef<formData> = reactive({
      id: 0,
      name: '',
      code: '',
      dataScope: 1,
      dataScopeList: [
        { id: 1, name: '全部数据权限' },
        { id: 2, name: '指定部门数据权限' },
        { id: 3, name: '本部门数据权限' },
        { id: 4, name: '本部门及以下数据权限' },
        { id: 5, name: '仅本人数据权限' },
      ],
      checkedKeys: [],
    })
    const state = reactive({
      checkedAll: false,
      checkedOpen: true,
      checkedLink: true,
    })
    const orgTreeData = ref([])
    const orgCheckData = ref([])
    /** get Menu Data */
    function getMenuData() {
      getRolePowerData({}).then((res: any) => {
        const data = res.data
        orgTreeData.value = treeDataTranslate(data.data, 'id')
        orgCheckData.value = data.data
      })
    }
    /**
     * handle power list data
     * @param val
     */
    const handlePowerListData = (val: any) => {
      visible.value = true
      formData.id = val.id
      formData.name = val.name
      formData.code = val.code
      formData.dataScope = val.dataScope
      getRolePowerData({}).then(() => {
      })
    }
    /** handle close */
    const handleClose = () => {
      // 通过事件传过去
      visible.value = false
      context.emit('close')
    }
    /**
     * 表单提交
     */
    const onSubmitFormData = () => {
      getRoleUpdatePowerData({
        roleId: formData.id,
        dataScope: formData.dataScope,
        dataScopeDeptIds: checkStrictly.value === true ? formData.checkedKeys.checked : formData.checkedKeys,
      }).then(() => {
        visible.value = false
        message.success('操作成功')
        context.emit('refreshTableData')
      })
    }
    /**
     * 全选/全不选
     */
    const handleSwitchCheckAll = () => {
      if (state.checkedAll === true) {
        orgCheckData.value.forEach((item: any) => {
          formData.checkedKeys.push(item.id)
        })
      }
      else {
        formData.checkedKeys = []
      }
    }
    /** 展开/折叠 */
    const handleSwitchCheckOpen = () => {
      expandAll.value = !expandAll.value
    }
    /** 父子联动 */
    const handleSwitchCheckLink = () => {
      checkStrictly.value = !checkStrictly.value
    }
    return {
      visible,
      expandAll,
      checkStrictly,
      formRef,
      labelCol: { style: { width: '100px' } },
      orgTreeData,
      orgCheckData,
      formData,
      ...toRefs(state),
      handlePowerListData,
      handleClose,
      onSubmitFormData,
      handleSwitchCheckAll,
      handleSwitchCheckOpen,
      handleSwitchCheckLink,
    }
  },
})
</script>

<template>
  <a-modal
    v-model:visible="visible"
    style="width: 50%"
    :title="$t('数据权限')"
    :confirm-loading="$isPending()"
    :mask-closable="false"
    @ok="onSubmitFormData()"
    @cancel="handleClose"
  >
    <a-form ref="formRef" :model="formData" :label-col="labelCol">
      <a-form-item :label="$t('用户组名称')" name="name">
        <span>{{ formData.name }}</span>
      </a-form-item>
      <a-form-item :label="$t('用户组标识')" name="code">
        <span>{{ formData.code }}</span>
      </a-form-item>
      <a-form-item :label="$t('权限范围')">
        <a-select v-model:value="formData.dataScope" style="width: 220px" show-search>
          <a-select-option
            v-for="dataS in formData.dataScopeList"
            :key="dataS.id" :label="dataS.name" :value="dataS.id"
          >
            {{ dataS.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-if="formData.dataScope === 2" :label="$t('权限范围')">
        <a-card>
          <template #title>
            <span style="font-size: 14px"> {{ $t('全选/全不选') }}:
              <a-switch
                v-model:checked="checkedAll" checked-children="是"
                un-checked-children="否" @change="handleSwitchCheckAll"
              />
            </span>
            <span style="font-size: 14px"> {{ $t('全部展开/折叠') }}:
              <a-switch
                v-model:checked="checkedOpen" checked-children="展开"
                un-checked-children="折叠" @change="handleSwitchCheckOpen"
              />
            </span>
            <span style="font-size: 14px"> {{ $t('父子联动(选中父节点，自动选择子节点)') }}:
              <a-switch
                v-model:checked="checkedLink" checked-children="是"
                un-checked-children="否" @change="handleSwitchCheckLink"
              />
            </span>
          </template>
          <a-directory-tree
            :key="(record: any) => record.id"
            v-model:checked-keys="formData.checkedKeys"
            v-model:check-strictly="checkStrictly"
            :default-expand-all="expandAll" checkable :show-icon="false"
            :field-names="{ key: 'id', title: 'name' }"
            style="width: 100%"
            :tree-data="orgTreeData"
            :height="300"
          >
            <template #title="{ name }">
              {{ name }}
            </template>
          </a-directory-tree>
        </a-card>
      </a-form-item>
      <!--      <a-form-item> -->
      <!--        <a-button @click="onSubmitFormData()" type="primary" style="float: right;margin-left: 10px">确定</a-button> -->
      <!--        <a-button @click="handleClose" style="float: right">取消</a-button> -->
      <!--      </a-form-item> -->
    </a-form>
  </a-modal>
</template>

<style scoped>

</style>
