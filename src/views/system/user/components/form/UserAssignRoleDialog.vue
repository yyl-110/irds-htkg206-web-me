<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue/es/form/Form'
import type { DefaultOptionType } from 'ant-design-vue/lib/select'
import { computed, ref, watch } from 'vue'
import { WeiMessage } from '@/utils/WeiMessage'
import type { UserVO } from '@/api/system/user'
import type { PermissionAssignUserRoleRequestDTO } from '@/api/tags/data-contracts'
import { AdminApiSystemRole } from '@/api/tags/管理后台角色'
import { AdminApiSystemPermission } from '@/api/tags/管理后台权限'

interface ComponentProps {
  user: UserVO
  visible: boolean
}
const props = defineProps<ComponentProps>()
const emit = defineEmits<{
  'update:visible': [visible: boolean]
  /** 提交完成 */
  'submit': []
}>()

const visibleModal = computed({
  get() {
    return props.visible
  },
  set(visible: boolean) {
    emit('update:visible', visible)
  },
})

const roleList = ref<Array<DefaultOptionType>>([])
// const roleList = ref<Array<RoleSimpleResponseDTO>>([])
/** get role list */
async function getRoleList() {
  const res = await AdminApiSystemRole.getSimpleRoleList()
  roleList.value = res.data.data?.map(item => ({ label: item.name, value: item.id })) || []
}
getRoleList()

const formRef = ref<FormInstance>()
const formData = ref<Partial<PermissionAssignUserRoleRequestDTO>>({
  userId: 0,
  roleIds: [],
})
watch(() => props.user, async () => {
  formData.value.roleIds = []
  if (props.user) {
    formData.value.userId = props.user.id
    if (props.user.id) {
      const res = await AdminApiSystemPermission.listAdminRoles({ userId: props.user.id })
      formData.value.roleIds = res.data.data || []
    }
  }
}, { immediate: true })
const loading = ref(false)
/** submit */
async function submit() {
  loading.value = true
  try {
    await AdminApiSystemPermission.assignUserRole(formData.value as PermissionAssignUserRoleRequestDTO).then(
      (res) => {
        if (res.data.code === 200)
          WeiMessage.success('修改成功')
      },
    )
    visibleModal.value = false
    emit('submit')
  }
  finally {
    loading.value = false
  }
}
const username = computed({
  get() {
    return props.user.username
  },
  set() {},
})
const nickname = computed({
  get() {
    return props.user.nickname
  },
  set() {},
})
</script>

<template>
  <a-modal v-model:visible="visibleModal" :mask-closable="false" title="分配角色" :footer="null">
    <a-form ref="formRef" :model="formData" :label-col="{ style: { width: '80px' } }">
      <a-form-item :label="$t('用户名称')" name="username">
        <a-input v-model:value="username" disabled="" />
      </a-form-item>
      <a-form-item :label="$t('用户姓名')" name="nickname">
        <a-input v-model:value="nickname" disabled="" />
      </a-form-item>
      <a-form-item :label="$t('角色')" name="roleIds">
        <a-select v-model:value="formData.roleIds" :options="roleList" mode="multiple" placeholder="请选择角色" show-search />
      </a-form-item>
      <a-form-item>
        <div class="flex justify-end">
          <a-button :loading="$isPending()" type="primary" style="margin-right: 10px;" @click="submit">
            {{ $t('确定') }}
          </a-button>
          <a-button style="float: right" @click="emit('update:visible', false)">
            {{ $t('取消') }}
          </a-button>
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
