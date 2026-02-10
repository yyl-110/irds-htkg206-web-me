<script lang="ts">
import { defineComponent, defineEmits, inject, nextTick, reactive, ref } from 'vue'
import type { UnwrapRef } from 'vue'
import type { TreeSelectProps, UploadChangeParam } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import type { RuleObject } from 'ant-design-vue/es/form/interface'
import { AdminApiSystemBasiclanguage } from '@/api/tags/管理基础语言'
import { LanguagePageRequestDTOModel } from '@/api/models/language/BasiclanguageDataRequestDTOModel'

interface formData {
  id: any
  lang: any
  langDesc: any
  langDirection: any
}
/** 当前表单使用的 data 类 */
class DeptCreateRequestDTOFromModel extends LanguagePageRequestDTOModel {
}
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
    },
  },
  setup(props, context) {
    const formRef = ref()
    // 注册自定义事件
    defineEmits(['close'])
    defineEmits(['refreshTableData'])
    const visible = ref(false)
    const formData: UnwrapRef<formData> = reactive({
      id: 0,
      lang: '',
      langDesc: '',
      langDirection: [],
      fileId: 0,
    })
    const systemIdList = ref([])
    const menuTreeData = ref<TreeSelectProps[]>([])
    /** close */
    const handleClose = () => {
      // 通过事件传过去
      visible.value = false
      context.emit('close')
    }
    /**
     * handle
     * @param id
     * @param parentId
     * @param record
     */
    const handleModalAddOrUpdate = async (id: any) => {
      formData.id = id || 0
      visible.value = true
      await nextTick()
      formRef.value.resetFields()
      if (formData.id) {
        // 弹窗--修改
        AdminApiSystemBasiclanguage.getBasiclanguage({ id: formData.id }).then((res: any) => {
          const data = res.data
          formData.id = data.data.id
          formData.lang = data.data.lang
          formData.langDesc = data.data.langDesc
          formData.langDirection = data.data.langDirection
        })
      }
    }
    /** 表单提交 */
    const onSubmitFormData = async () => {
      const data = {
        id: formData.id,
        lang: formData.lang,
        langDesc: formData.langDesc,
        langDirection: formData.langDirection,
      }
      await formRef.value?.validate()
      if (formData.id) {
        // 修改 保存
        AdminApiSystemBasiclanguage.updateBasiclanguage(data).then(() => {
          visible.value = false
          message.success('操作成功')
          context.emit('refreshTableData')
        })
      }
      else {
        AdminApiSystemBasiclanguage.createBasiclanguage(data).then(() => {
          visible.value = false
          message.success('操作成功')
          context.emit('refreshTableData')
        })
      }
    }
    return {
      labelCol: { style: { width: '70px' } },
      visible,
      formRef,
      systemIdList, // 系统列表
      menuTreeData, // 权限列表
      formData,
      handleModalAddOrUpdate,
      onSubmitFormData, // 表单提交
      handleClose, // 关闭弹窗
    }
  },
})
</script>

<template>
  <a-modal
    v-model:visible="visible"
    style="width: 45%"
    :ok-text="$t('确定')"
    :cancel-text="$t('取消')"
    :title="$t(!formData.id ? $t('新增') : $t('编辑'))"
    :confirm-loading="$isPending()"
    :mask-closable="false"
    @close="handleClose"
    @ok="onSubmitFormData()"
    @cancel="handleClose"
  >
    <a-form ref="formRef" :model="formData" :label-col="labelCol">
      <a-form-item :label="$t('语言')" name="lang" prop="lang" :rules="[{ required: true, message: $t('请填写语言') }]">
        <a-input v-model:value="formData.lang" :placeholder="$t('请输入语言')" :disabled="formData.id" />
      </a-form-item>
      <a-form-item :label="$t('语言说明')" name="langDesc" prop="langDesc" :rules="[{ required: true, message: $t('请填写语言说明') }]">
        <a-input v-model:value="formData.langDesc" :placeholder="$t('请输入语言说明')" />
      </a-form-item>
      <a-form-item :label="$t('排版')" name="langDirection" prop="langDirection" :rules="[{ required: true, message: $t('请填写排版') }]">
        <a-select v-model:value="formData.langDirection" :placeholder="$t('请选择排版')" style="width: 200px">
          <a-select-option value="ltr">
            ltr
          </a-select-option>
          <a-select-option value="rtl">
            rtl
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped>
</style>
