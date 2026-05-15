<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { DICT_TYPE } from '@/utils/dict'
import * as FormApi from '@/api/bpm/form'
import { setConfAndFields2 } from '@/utils/formCreate'
import { BpmModelFormType } from '@/utils/constants'
import { useDictStore } from '@/store/modules/dict'
// 国际化
const props = defineProps({
  formList: {
    type: Array,
    required: true,
  },
})
/** 获取字典 */
const useDict = useDictStore()
const { t } = useI18n()
const formRef = ref()

// 创建本地数据副本
const modelData = defineModel<any>()

// 表单预览数据
const formPreview = ref({
  formData: {},
  rule: [],
  option: {
    submitBtn: false,
    resetBtn: false,
    formData: {},
  },
})

// 监听表单ID变化，加载表单数据
watch(
  () => modelData.value.formId,
  async newFormId => {
    if (newFormId && modelData.value.formType === BpmModelFormType.NORMAL) {
      const res = await FormApi.getForm(newFormId)
      if (res.data?.code !== 200) {
        formPreview.value.rule = []
        return
      }
      const row = res.data?.data
      if (!row) {
        formPreview.value.rule = []
        return
      }
      setConfAndFields2(formPreview.value, row.conf, row.fields)
      // 设置只读
      formPreview.value.rule.forEach((item: any) => {
        item.props = { ...item.props, disabled: true }
      })
    } else {
      formPreview.value.rule = []
    }
  },
  { immediate: true },
)

const rules = {
  formType: [{ required: true, message: t('表单类型不能为空'), trigger: 'blur' }],
  formId: [{ required: true, message: t('流程表单不能为空'), trigger: 'blur' }],
  formCustomCreatePath: [{ required: true, message: t('表单提交路由不能为空'), trigger: 'blur' }],
  formCustomViewPath: [{ required: true, message: t('表单查看地址不能为空'), trigger: 'blur' }],
}

/** 表单校验 */
async function validate() {
  await formRef.value?.validate()
}

defineExpose({
  validate,
})
</script>

<template>
  <el-form ref="formRef" :model="modelData" :rules="rules" label-width="120px" class="mt-20px">
    <el-form-item label="表单类型" prop="formType" class="mb-20px">
      <el-radio-group v-model="modelData.formType">
        <el-radio
          v-for="dict in useDict.getIntDictOptions(DICT_TYPE.BPM_MODEL_FORM_TYPE)"
          :key="dict.value"
          :value="dict.value">
          {{ dict.label }}
        </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="modelData.formType === BpmModelFormType.NORMAL" :label="$t('流程表单')" prop="formId">
      <el-select v-model="modelData.formId" clearable style="width: 100%">
        <el-option v-for="form in formList" :key="form.id" :label="form.name" :value="form.id" />
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="modelData.formType === BpmModelFormType.CUSTOM"
      :label="$t('表单提交路由')"
      prop="formCustomCreatePath">
      <el-input v-model="modelData.formCustomCreatePath" :placeholder="$t('请输入表单提交路由')" style="width: 330px" />
      <el-tooltip
        class="item"
        :content="$t('自定义表单的提交路径，使用 Vue 的路由地址，例如说：bpm/oa/leave/create.vue')"
        effect="light"
        placement="top">
        <Icon icon="ep:question" class="ml-5px" />
      </el-tooltip>
    </el-form-item>
    <el-form-item
      v-if="modelData.formType === BpmModelFormType.CUSTOM"
      :label="$t('表单查看地址')"
      prop="formCustomViewPath">
      <el-input
        v-model="modelData.formCustomViewPath"
        :placeholder="$t('请输入表单查看的组件地址')"
        style="width: 330px" />
      <el-tooltip
        class="item"
        :content="$t('自定义表单的查看组件地址，使用 Vue 的组件地址，例如说：bpm/oa/leave/detail.vue')"
        effect="light"
        placement="top">
        <Icon icon="ep:question" class="ml-5px" />
      </el-tooltip>
    </el-form-item>
    <!-- 表单预览 -->
    <div
      v-if="modelData.formType === BpmModelFormType.NORMAL && modelData.formId && formPreview.rule.length > 0"
      class="mt-20px">
      <div class="flex items-center mb-15px">
        <div class="h-15px w-4px bg-[#1890ff] mr-10px" />
        <span class="text-15px font-bold">{{ $t('表单预览') }}</span>
      </div>
      <form-create v-model="formPreview.formData" :rule="formPreview.rule" :option="formPreview.option" />
    </div>
  </el-form>
</template>
