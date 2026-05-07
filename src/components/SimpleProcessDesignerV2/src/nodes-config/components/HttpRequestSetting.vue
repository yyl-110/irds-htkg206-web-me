<script setup lang="ts">
import { useFormFields } from '../../node'
import HttpRequestParamSetting from './HttpRequestParamSetting.vue'

const props = defineProps({
  setting: {
    type: Object,
    required: true,
  },
  responseEnable: {
    type: Boolean,
    required: true,
  },
  formItemPrefix: {
    type: String,
    required: true,
  },
})
const emits = defineEmits(['update:setting'])
const { setting } = toRefs(props)
watch(
  () => setting,
  (val) => {
    emits('update:setting', val)
  },
)

/** 流程表单字段 */
const formFields = useFormFields()

/**
 * 添加 HTTP 请求返回值设置项
 * @param responseSetting
 */
function addHttpResponseSetting(responseSetting: Record<string, string>[]) {
  responseSetting.push({
    key: '',
    value: '',
  })
}

/**
 * 删除 HTTP 请求返回值设置项
 * @param responseSetting
 * @param index
 */
function deleteHttpResponseSetting(responseSetting: Record<string, string>[], index: number) {
  responseSetting.splice(index, 1)
}
</script>

<template>
  <el-form-item>
    <el-alert title="仅支持 POST 请求，以请求体方式接收参数" type="warning" show-icon :closable="false" />
  </el-form-item>
  <!-- 请求地址 -->
  <el-form-item
    label-position="top"
    label="请求地址"
    :prop="`${formItemPrefix}.url`"
    :rules="{
      required: true,
      message: '请求地址不能为空',
      trigger: 'blur',
    }"
  >
    <el-input v-model="setting.url" />
  </el-form-item>
  <!-- 请求头，请求体设置 -->
  <HttpRequestParamSetting :header="setting.header" :body="setting.body" :bind="formItemPrefix" />
  <!-- 返回值设置 -->
  <div v-if="responseEnable">
    <el-form-item label="返回值" label-position="top">
      <el-alert title="通过请求返回值, 可以修改流程表单的值" type="warning" show-icon :closable="false" />
    </el-form-item>
    <el-form-item>
      <div v-for="(item, index) in setting.response" :key="index" class="flex pt-2">
        <div class="mr-2">
          <el-form-item
            :prop="`${formItemPrefix}.response.${index}.key`"
            :rules="{
              required: true,
              message: '表单字段不能为空',
              trigger: 'blur',
            }"
          >
            <el-select v-model="item.key" class="w-160px!" placeholder="请选择表单字段">
              <el-option
                v-for="(field, fIdx) in formFields"
                :key="fIdx"
                :label="field.title"
                :value="field.field"
                :disabled="!field.required"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="mr-2">
          <el-form-item
            :prop="`${formItemPrefix}.response.${index}.value`"
            :rules="{
              required: true,
              message: '请求返回字段不能为空',
              trigger: 'blur',
            }"
          >
            <el-input v-model="item.value" class="w-160px" placeholder="请求返回字段" />
          </el-form-item>
        </div>
        <div class="mr-1 pt-1 cursor-pointer">
          <Icon icon="ep:delete" :size="18" @click="deleteHttpResponseSetting(setting.response!, index)" />
        </div>
      </div>
      <el-button type="primary" text @click="addHttpResponseSetting(setting.response!)">
        <Icon icon="ep:plus" class="mr-5px" />添加一行
      </el-button>
    </el-form-item>
  </div>
</template>

<style lang="scss" scoped></style>
