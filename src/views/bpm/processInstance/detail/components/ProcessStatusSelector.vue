<template>
  <div>
    <!-- 是否手动更改销售配置 -->
    <el-card
      style="margin: 10px; min-height: 60px; margin-right: 30px"
      v-if="showManualConfig"
    >
      <div class="card-header">
        <span style="margin-right: 20px">{{ $t('是否手动更改销售配置') }}</span>
        <el-radio-group :model-value="isManual" @update:model-value="handleManualChange"  :disabled="disabled">
          <el-radio :label="true">{{ $t('是') }}</el-radio>
          <el-radio :label="false">{{ $t('否') }}</el-radio>
        </el-radio-group>
      </div>
    </el-card>

    <!-- 流程状态选择 -->
    <el-card
      style="margin: 10px; min-height: 60px; margin-right: 30px"
      v-if="showStatusSelector"
    >
      <template #header>
        <div class="card-header">
          <span>{{ $t('流程状态选择') }}</span>
        </div>
      </template>

      <!-- 标配Mbom确认 -->
      <div class="card-header" v-if="todoTaskName === '标配Mbom确认'">
        <div class="mr-20 w-120">{{ $t('标配Mbom确认') }}</div>
        <el-radio-group :model-value="statusValues.areaSaleRelease_genStMbomConfirm" :disabled="disabled">
          <el-radio
            :label="true"
            @click.native.prevent="handleRadioClick(true, 'areaSaleRelease_genStMbomConfirm')"
          >
            {{ $t('无异常通过') }}
          </el-radio>
          <el-radio
            :label="false"
            @click.native.prevent="handleRadioClick(false, 'areaSaleRelease_genStMbomConfirm')"
          >
            {{ $t('重新解算') }}
          </el-radio>
        </el-radio-group>
      </div>

      <!-- 重新推送 -->
      <div class="card-header" v-if="todoTaskName === '重新推送'">
        <div class="mr-20 w-120">{{ $t('重新推送') }}</div>
        <el-radio-group :model-value="statusValues.areaSaleRelease_rePushScpStMbomPre" :disabled="disabled">
          <el-radio
            :label="true"
            @click.native.prevent="handleRadioClick(true, 'areaSaleRelease_rePushScpStMbomPre')"
          >
            {{ $t('完成') }}
          </el-radio>
          <el-radio
            :label="false"
            @click.native.prevent="handleRadioClick(false, 'areaSaleRelease_rePushScpStMbomPre')"
          >
            {{ $t('重新推送') }}
          </el-radio>
        </el-radio-group>
      </div>

      <!-- 正式发布 -->
      <div class="card-header" v-if="todoTaskName === '正式发布'">
        <div class="mr-20 w-120">{{ $t('正式发布') }}</div>
        <el-radio-group :model-value="statusValues.areaSaleRelease_officiallyReleased" :disabled="disabled">
          <el-radio
            :label="true"
            @click.native.prevent="handleRadioClick(true, 'areaSaleRelease_officiallyReleased')"
          >
            {{ $t('正式发布') }}
          </el-radio>
          <el-radio
            :label="false"
            @click.native.prevent="handleRadioClick(false, 'areaSaleRelease_officiallyReleased')"
          >
            {{ $t('重新推送') }}
          </el-radio>
        </el-radio-group>
      </div>

      <!-- crm发布确认 -->
      <div class="card-header" v-if="todoTaskName === 'crm发布确认'">
        <div class="mr-20 w-120">{{ $t('是否发布') }}</div>
        <el-radio-group :model-value="statusValues.crmRelease">
          <el-radio :label="true" @click.native.prevent="handleRadioClick(true, 'crmRelease')">
            {{ $t('发布') }}
          </el-radio>
          <el-radio :label="false" @click.native.prevent="handleRadioClick(false, 'crmRelease')">
            {{ $t('取消') }}
          </el-radio>
        </el-radio-group>
      </div>

      <!-- 研发审核 -->
      <div class="card-header" v-if="todoTaskName === '研发审核'">
        <div class="mr-20 w-120">{{ $t('是否管理员处理') }}</div>
        <el-radio-group :model-value="statusValues.rdOwnerToAdmin" :disabled="disabled">
          <el-radio
            :label="true"
            @click.native.prevent="handleRadioClick(true, 'rdOwnerToAdmin')"
          >
            {{ $t('是') }}
          </el-radio>
          <el-radio
            :label="false"
            @click.native.prevent="handleRadioClick(false, 'rdOwnerToAdmin')"
          >
            {{ $t('否') }}
          </el-radio>
        </el-radio-group>
      </div>

      <!-- 工艺审核 -->
      <div class="card-header" v-if="todoTaskName === '工艺审核'">
        <div style="display: flex; flex-direction: column">
          <div style="display: inline-flex">
            <div class="mr-20 w-120">{{ $t('是否管理员处理') }}</div>
            <el-radio-group :model-value="statusValues.processOwnerToAdmin" :disabled="disabled">
              <el-radio
                :label="true"
                @click.native.prevent="handleRadioClick2(true, 'processOwnerToAdmin')"
              >
                {{ $t('是') }}
              </el-radio>
              <el-radio
                :label="false"
                @click.native.prevent="handleRadioClick2(false, 'processOwnerToAdmin')"
              >
                {{ $t('否') }}
              </el-radio>
            </el-radio-group>
          </div>
          <div style="display: inline-flex">
            <div class="mr-20 w-120">{{ $t('是否驳回研发处理') }}</div>
            <el-radio-group :model-value="statusValues.processOwnerToRdOwner" :disabled="disabled">
              <el-radio
                :label="true"
                @click.native.prevent="handleRadioClick2(true, 'processOwnerToRdOwner')"
              >
                {{ $t('是') }}
              </el-radio>
              <el-radio
                :label="false"
                @click.native.prevent="handleRadioClick2(true, 'processOwnerToRdOwner')"
              >
                {{ $t('否') }}
              </el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  showManualConfig?: boolean
  showStatusSelector?: boolean
  isManual?: boolean
  statusValues: any
  todoTaskName?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:isManual', value: boolean): void
  (e: 'update:statusValues', value: any): void
}>()

const handleManualChange = (value: boolean) => {
  emit('update:isManual', value)
}

const handleRadioClick = (val: boolean, key: string) => {
  const newValues = { ...props.statusValues }
  newValues[key] = newValues[key] === val ? null : val
  emit('update:statusValues', newValues)
}

const handleRadioClick2 = (val: boolean, key: string) => {
  const newValues = { ...props.statusValues }
  if (['processOwnerToAdmin'].includes(key)) {
    newValues['processOwnerToRdOwner'] = val === true ? false : val
  } else {
    newValues['processOwnerToAdmin'] = val === true ? false : val
  }
  newValues[key] = newValues[key] === val ? false : val
  emit('update:statusValues', newValues)
}
</script>

<style lang="scss" scoped>
.card-header {
  font-weight: 600;
  display: flex;
}
</style>
