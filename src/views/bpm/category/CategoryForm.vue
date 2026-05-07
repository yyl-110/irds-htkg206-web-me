<script setup lang="ts">
import { useI18n } from 'vue-i18n' // 国际化
import { message } from 'ant-design-vue'
import type { CategoryVO } from '@/api/bpm/category'
import { CategoryApi } from '@/api/bpm/category'
import { CommonStatusEnum } from '@/utils/constants'
/** BPM 流程分类 表单 */
defineOptions({ name: 'CategoryForm' })

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success'])
const { t } = useI18n() // 路由对象

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  name: undefined,
  code: undefined,
  description: undefined,
  status: CommonStatusEnum.ENABLE,
  sort: undefined,
})
const formRules = reactive({
  name: [{ required: true, message: t('分类名不能为空'), trigger: 'blur' }],
  code: [{ required: true, message: t('分类标志不能为空'), trigger: 'blur' }],
  status: [{ required: true, message: t('分类状态不能为空'), trigger: 'blur' }],
  sort: [{ required: true, message: t('分类排序不能为空'), trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

function getIntDictOptions(): any[] {
  // 获得通用的 DictDataType 列表
  const dictOption: any[] = [
    { label: t('开启'), value: 0 },
    { label: t('关闭'), value: 1 },
  ]
  return dictOption
}

/**
 * 打开弹窗
 * @param type
 * @param id
 */
async function open(type: string, id?: number) {
  dialogVisible.value = true
  dialogTitle.value = t(`action.${type}`)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await CategoryApi.getCategory(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 定义 success 事件，用于操作成功后的回调
async function submitForm() {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as CategoryVO
    if (formType.value === 'create') {
      await CategoryApi.createCategory(data)
      message.success(t('新增成功'))
    } else {
      await CategoryApi.updateCategory(data)
      message.success(t('修改成功'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
function resetForm() {
  formData.value = {
    id: undefined,
    name: undefined,
    code: undefined,
    description: undefined,
    status: CommonStatusEnum.ENABLE,
    sort: undefined,
  }
  formRef.value?.resetFields()
}
</script>

<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules" label-width="100px">
      <el-form-item :label="$t('分类名')" prop="name">
        <el-input v-model="formData.name" :placeholder="$t('请输入分类名')" />
      </el-form-item>
      <el-form-item :label="$t('分类标志')" prop="code">
        <el-input v-model="formData.code" :placeholder="$t('请输入分类标志')" />
      </el-form-item>
      <el-form-item :label="$t('分类描述')" prop="description">
        <el-input v-model="formData.description" type="textarea" :placeholder="$t('请输入分类描述')" />
      </el-form-item>
      <el-form-item :label="$t('分类状态')" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio v-for="dict in getIntDictOptions()" :key="dict.value" :value="dict.value">
            {{ $t(dict.label) }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('分类排序')" prop="sort">
        <el-input-number v-model="formData.sort" :placeholder="$t('请输入分类排序')" class="!w-1/1" :precision="0" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" :disabled="formLoading" @click="submitForm">
        {{ $t('确 定') }}
      </el-button>
      <el-button @click="dialogVisible = false">
        {{ $t('取 消') }}
      </el-button>
    </template>
  </Dialog>
</template>
