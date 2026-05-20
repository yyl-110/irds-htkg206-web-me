<!--
 @name: index.vue
 @description: 高级自定义弹窗组件，无需单独导入模版，直接方法使用即可(基于element-plus)(支持5种基本类型:error,success,warning,info,''并支持头部、内容、底部自定义插槽方式使用)
-->
<template>
  <el-dialog
    v-for="(item, index) in DIALOG_LIST"
    :key="index"
    v-model="item.visible"
    :width="item.width || '472px'"
    class="custom-dialog"
    :before-close="item.beforeClose"
    @close="() => closeAppDialog(item, index, '', true)"
    :show-close="false"
    align-center
  >
    <template #header>
      <slot name="header" v-if="item.isShowHeader">
        <div class="dialog-header">
          <svg-icon :icon-class="`${prefix}${item.headerIconType}`" v-if="item.headerIconType" :style="{ width: '20px', height: '20px' }" />
          <span class="dialog-title" :style="{ 'margin-left': item.headerIconType ? '8px' : '0px' }">{{ item.headerTitle }}</span>
          <svg-icon
            icon-class="g-x"
            style="margin-left: auto"
            v-if="item.closeable"
            :style="{ cursor: 'pointer', width: '12.99px', height: '12.99px' }"
            @click="() => closeAppDialog(item, index, '', true)"
          />
        </div>
      </slot>
    </template>
    <template #default>
      <slot name="default" v-if="item.isShowContent">
        <div class="dialog-content" :style="{ 'margin-left': item.headerIconType ? '28px' : '0px' }">
          {{ item.content }}
        </div>
      </slot>
      <component :is="item.component" v-bind="item.props" @close="(args: any) => closeAppDialog(item, index, args)" v-else> </component>
    </template>
    <template #footer v-if="item.isShowFooter">
      <slot name="footer">
        <div class="dialog-footer">
          <el-tooltip
            :disabled="item.tooltip?.leftButton?.disabled"
            :placement="item.tooltip?.leftButton?.placement || 'top'"
            :content="item.tooltip?.leftButton?.content"
          >
            <el-button
              v-if="item.isShowLeftButton"
              @click="() => closeAppDialog(item, index, item.footerLeftButtonText, true)"
              :disabled="item.footerLeftButtonDisabled"
              >{{ item.footerLeftButtonText }}</el-button
            >
          </el-tooltip>
          <el-tooltip
            :disabled="item.tooltip?.middleButton?.disabled"
            :placement="item.tooltip?.middleButton?.placement || 'top'"
            :content="item.tooltip?.middleButton?.content"
          >
            <el-button
              v-if="item.isShowMiddleButton"
              :color="getColor(item.headerIconType)"
              @click="() => closeAppDialog(item, index, item.footerMiddleButtonText, true)"
              :disabled="item.footerMiddleButtonDisabled"
              >{{ item.footerMiddleButtonText }}</el-button
            >
          </el-tooltip>
          <el-tooltip
            :disabled="item.tooltip?.rightButton?.disabled"
            :placement="item.tooltip?.rightButton?.placement || 'top'"
            :content="item.tooltip?.rightButton?.content"
          >
            <el-button
              v-if="item.isShowRightButton"
              :color="getColor(item.headerIconType)"
              @click="() => closeAppDialog(item, index, item.footerRightButtonText, true)"
              :disabled="item.footerRightButtonDisabled"
              >{{ item.footerRightButtonText }}</el-button
            >
          </el-tooltip>
        </div>
      </slot>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import useAppDialog, { DIALOG_LIST } from '@/components/BaseDialog/app-dialog'
const { closeAppDialog } = useAppDialog()

const getColor = type => {
  if (type === 'error') {
    return '#F5463D'
  } else if (type === 'success') {
    return '#0158F0'
  } else if (type === 'warning') {
    return '#0158F0'
  } else if (type === 'info') {
    return '#0158F0'
  } else {
    return '#0158F0'
  }
}
const prefix = 'dialog-'
</script>
<style lang="scss">
/* 注意：移除了scoped，让样式全局生效，以覆盖.sie-ecp中的样式 */
.custom-dialog {
  padding: 20px !important;
  .el-dialog__header {
    padding: 0 !important;
  }
  .el-dialog__footer {
    padding: 0 !important;
    margin-top: 16px !important;
  }
}
</style>

<style scoped lang="scss">
.dialog-header {
  display: flex;
  align-items: center;
  padding-bottom: 16px;
  .dialog-title {
    font-size: 20px;
    font-weight: 600;
    line-height: 30px;
    color: #161e2e;
  }
}
.dialog-content {
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #555d6d;
}
</style>
