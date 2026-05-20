<template>
  <div class="BaseDataSearchForm">
    <div
      :style="`max-height: ${
        isSearchForm ? '100%' : 'calc(100% - 40px)'
      };  flex-grow: 1; flex-shrink: 1; overflow-y: auto; overflow-x: hidden`"
    >
      <el-form
        ref="ruleFormRef"
        style="width: 100%"
        :model="searchForm"
        :rules="rules"
        :label-width="labelWidth"
        :label-position="labelPosition"
        @submit.native.prevent="isSearchForm ? search(ruleFormRef) : save(ruleFormRef)"
      >
        <el-row :gutter="24" type="flex">
          <el-col :span="24 / colSpan" v-for="formItem in showFormItems">
            <el-form-item :prop="formItem.field" v-if="!formItem.hidden">
              <template #label>
                <autoTooltipText :text="formItem.label"></autoTooltipText>
              </template>
              <el-cascader
                v-if="formItem.componentType === 'el-cascader'"
                v-model="searchForm[formItem.field]"
                v-bind="getConfig(formItem) || {}"
                v-on="formItem.componentEvents || {}"
                clearable
              ></el-cascader>
              <component
                :is="formItem.componentType"
                v-else-if="formItem.componentType !== 'custom'"
                clearable
                v-model="searchForm[formItem.field]"
                v-bind="getConfig(formItem) || {}"
                v-on="formItem.componentEvents || {}"
              >
                <template v-if="formItem.componentType === 'el-select'">
                  <el-option
                    v-for="item in formItem?.componentProps?.options || []"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </template>
                <template v-else-if="formItem.componentType === 'el-radio-group'">
                  <el-radio v-for="item in formItem?.componentProps?.options || []" :value="item.value">
                    {{ item.label }}
                  </el-radio>
                </template>
              </component>
              <slot v-else :name="formItem.renderName" :formItem="formItem" :searchForm="searchForm"></slot>
            </el-form-item>
          </el-col>
          <!-- 新增：自定义内容插槽 -->
          <template v-if="$slots.customContent">
            <slot name="customContent"></slot>
          </template>
          <el-col :span="btnItemSpan" style="margin-left: auto; margin-bottom: 18px" v-if="isSearchForm">
            <div style="float: right">
              <el-button v-if="showMoreBtn" link :icon="isExtend ? ArrowUp : ArrowDown" @click="changeExtend(row, $index)">{{
                isExtend ? `${$t('收起')}` : `${$t('展开')}`
              }}</el-button>
              <el-button @click="reset(ruleFormRef)"> {{ $t('重置') }} </el-button>
              <el-button @click="search(ruleFormRef)" class="searchBtn">{{ $t('查询') }} </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div v-if="!isSearchForm && needBtn" style="display: flex; margin-top: 10px; justify-content: flex-end">
      <div>
        <el-button @click="cancel(ruleFormRef)">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="save(ruleFormRef)">{{ $t('保存') }}</el-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onBeforeMount, computed } from 'vue'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import { cloneDeep } from 'lodash'
import { ElMessage } from 'element-plus'
import autoTooltipText from './auto-tooltip-text.vue'
// 可触发的事件
const emit = defineEmits(['search', 'reset', 'save', 'cancel'])
const ruleFormRef = ref()
const props = defineProps({
  // 表单项
  formItems: { type: Array, default: [] },
  // 表单数据
  searchForm: { type: Object, required: true },
  labelWidth: { type: Number, default: 110 },
  labelPosition: {type: String, default: 'left'},
  rules: {
    type: Object,
    default: () => {
      return {}
    }
  },
  // 是否需要折叠
  needExtend: { type: Boolean, default: true },
  span: { type: Number, default: 4 },
  isSearchForm: { type: Boolean, default: true },
  needBtn: { type: Boolean, default: true }
})
const colSpan = ref(props.span)
// 是否显示展开折叠按钮
const showMoreBtn = computed(() => {
  if (!props.needExtend) {
    return false
  }
  if (props.formItems.length >= colSpan.value) {
    return true
  } else {
    return false
  }
})
const isExtend = ref(false)
const showFormItems = computed(() => {
  if (!props.needExtend) {
    return props.formItems
  }
  if (props.formItems.length >= colSpan.value && !isExtend.value) {
    return props.formItems.slice(0, colSpan.value - 1)
  } else {
    return props.formItems
  }
})
const btnItemSpan = computed(() => {
  if(props.formItems.length < colSpan ){
    return (colSpan - props.formItems.length)*(24/colSpan)
  }else if(isExtend.value){
    return 24/colSpan*(colSpan - props.formItems.length%colSpan)
  }else{
    return 24/colSpan
  }
})
// 默认配置
const defaultConfig = {
  'el-select': { clearable: true, filterable: true, remoteShowSuffix: true, placeholder: '请选择' },
  'el-input': { clearable: true, placeholder: '请输入' },
  'el-date-picker': { clearable: true, placeholder: '请选择', format: 'YYYY-MM-DD', 'value-format': 'YYYY-MM-DD' },
  'el-time-picker': { clearable: true, placeholder: '请选择', format: 'HH:mm:ss', 'value-format': 'HH:mm:ss' },
  'el-radio-group': {}
}
// 组装表单项配置
const getConfig = formItem => {
  const formItemDefaultConfig = defaultConfig[formItem.componentType] || {}
  const componentProps = formItem.componentProps || {}
  const config = { ...formItemDefaultConfig, ...componentProps }
  return config
}
/* 查询 */
const search = formEl => {
  if (!formEl) return
  formEl.validate(valid => {
    if (valid) {
      emit('search', cloneDeep(props.searchForm))
    } else {
      console.log(props.searchForm,'>>>>>>>>>>>>query data')
      ElMessage({ message: '校验未通过，请检查表单输入。', type: 'error' })
    }
  })
}
/* 重置 */
const reset = formEl => {
  if (!formEl) return
  formEl.resetFields()
  emit('search', cloneDeep(props.searchForm))
}
/* 取消 */
const cancel = formEl => {
  if (!formEl) return
  formEl.resetFields()
  emit('cancel', props.searchForm)
}
/* 保存 */
const save = formEl => {
  if (!formEl) return
  formEl.validate(valid => {
    if (valid) {
      emit('save', cloneDeep(props.searchForm))
    } else {
      ElMessage({ message: '校验未通过，请检查表单输入。', type: 'error' })
    }
  })
}
const changeExtend = () => {
  isExtend.value = !isExtend.value
}

onBeforeMount(() => {
  // 请求下拉框服务
  props.formItems.forEach(formItem => {
    if (formItem?.componentProps?.remoteMethod) {
      formItem.componentProps.remoteMethod('')
    }
  })

  if (props.needExtend) {
    const screenWidth = window.screen.width
    if (screenWidth < 1500) {
      colSpan.value = 3
    } else {
      colSpan.value = 4
    }
  }
})
const clearValidate = () => {
  if (!ruleFormRef) return
  ruleFormRef.value.clearValidate()
}
// 暴露给父组件的方法
defineExpose({
  clearValidate
})
</script>
<style lang="scss">
.BaseDataSearchForm {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;

  .el-input-group__prepend {
    background-color: var(--el-fill-color-blank);

    .el-input__wrapper,
    .el-select__wrapper {
      border: 0px !important;
      box-shadow: none !important;
    }
  }
  .searchBtn {
    color: #0158f0;
    border-color: #0158f0;
    &:hover {
      color: #2f7afa;
      border-color: #2f7afa;
    }
    &:active {
      color: #004ec2;
      border-color: #004ec2;
    }
  }
}
</style>
