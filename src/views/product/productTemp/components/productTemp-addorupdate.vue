<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn';
import { message, type FormInstance } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import { AdminApiProductTemp } from '@/api/tags/productTemp/产品模板后台';
import { AdminApiSystemProcessTask } from '@/api/tags/processTask/管理后台流程任务';
const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },
});
const title = ref<any>('');
const emit = defineEmits(['close', 'refreshtabledata']);
const userStore = useUserStore();
/** 弹窗状态 */
const visible = computed(() => {
  return props.modalVisible;
});
const formRef = ref<FormInstance>();
const menuId = ref<any>();
const formData = reactive({
  tempNum: '',
  tempName: '',
  remarks: '',
  status: '',
  versionNum: '',
});
const formRules = {
  tempNum: [{ required: true, message: '请等待模板编号请码或点击请码', trigger: 'blur' }],
  tempName: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
};

const id = ref(0);
/** 新建时可请码；编辑仅展示已有编号 */
const canRequestTemplateNum = computed(() => !id.value || id.value <= 0);
const tempNumApplyLoading = ref(false);

/** handle close */
function handleClose() {
  formRef.value?.resetFields();
  emit('close');
}

async function applyTemplateSerialNum() {
  if (!canRequestTemplateNum.value) {
    return;
  }
  tempNumApplyLoading.value = true;
  try {
    const res = await AdminApiSystemProcessTask.nextNo({ ruleCode: 'template' });
    const code = res?.data?.code as number | string | undefined;
    const ok = code === 0 || code === 200 || code === '0' || code === '200';
    if (!ok) {
      message.error(String(res?.data?.msg ?? '请码失败'));
      return;
    }
    const nextVal = String(res?.data?.data ?? '').trim();
    if (!nextVal) {
      message.warning('未返回模板编号');
      return;
    }
    formData.tempNum = nextVal;
    message.success('请码成功');
  }
  catch {
    message.error('请码失败');
  }
  finally {
    tempNumApplyLoading.value = false;
  }
}

async function savePageInfo() {
  try {
    await formRef.value?.validate();
  } catch (error) {
    return;
  }
  const data: any = {};
  data.tempNum = formData.tempNum;
  data.tempName = formData.tempName;
  data.remarks = formData.remarks;
  data.creator = userStore.getUser.id;
  data.menuId = menuId.value;
  // 保存信息
  if (id.value != undefined && id.value > 0) {
    data.id = id.value;
    data.versionNum = formData.versionNum;
    data.status = formData.status;
    // 保存页面信息
    const res = await AdminApiProductTemp.productTempUpdate(data);
  } else {
    data.versionNum = 1;
    data.status = 0;
    // 保存页面信息
    const res = await AdminApiProductTemp.productTempCreate(data);
  }
  // 刷新父页面列表数据
  emit('refreshtabledata');
  emit('close');
}

// 初始化数据
function noticeInfoAddOrUpdate(record: any, menu: any) {
  if (record) {
    id.value = record.id;
    formData.tempNum = record.tempNum;
    formData.tempName = record.tempName;
    formData.remarks = record.remarks;
    formData.status = record.status;
    formData.versionNum = record.versionNum;
    menuId.value = menu;
    title.value = '产品模板编辑';
  } else {
    id.value = 0;
    formData.tempNum = '';
    formData.tempName = '';
    formData.remarks = '';
    formData.status = '';
    formData.versionNum = '';
    title.value = '产品模板创建';
    menuId.value = menu;
    void applyTemplateSerialNum();
  }
}
function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.productTemp-addorUpdate');
}

defineExpose({ noticeInfoAddOrUpdate });
</script>

<template>
  <div class="productTemp-addorUpdate" v-dragModal>
    <a-modal
      v-model:visible="visible"
      :getContainer="customGetContainer"
      class="product-temp-modal"
      style="width: 720px"
      :style="{ top: '5%' }"
      :title="title"
      :confirm-loading="$isPending()"
      :mask-closable="false"
      :body-style="{ padding: '28px 24px 20px', minHeight: '350px' }"
      @cancel="handleClose">
      <a-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        :label-col="{ style: { width: '90px' } }"
        class="product-temp-form">
        <a-form-item :label="$t('模板编号')" name="tempNum">
          <div class="template-num-with-actions">
            <a-input
              v-model:value="formData.tempNum"
              :placeholder="canRequestTemplateNum ? $t('打开弹窗将自动请码，也可手动点击请码') : $t('模板编号')"
              disabled
            />
            <a-button
              v-if="canRequestTemplateNum"
              type="primary"
              :loading="tempNumApplyLoading"
              @click="applyTemplateSerialNum"
            >
              {{ $t('请码') }}
            </a-button>
          </div>
        </a-form-item>
        <a-form-item :label="$t('模板名称')" name="tempName">
          <a-input v-model:value="formData.tempName" :placeholder="$t('请输入...')" allow-clear />
        </a-form-item>
        <a-form-item :label="$t('备注')" name="remarks">
          <a-textarea
            v-model:value="formData.remarks"
            :placeholder="$t('请输入...')"
            :rows="6"
            :maxlength="500"
            show-count
            allow-clear />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button type="primary" @click="savePageInfo">
          {{ $t('确定') }}
        </a-button>
        <a-button @click="handleClose">
          {{ $t('取消') }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
.productTemp-addorUpdate {
  position: relative;
}

.product-temp-form {
  :deep(.ant-form-item) {
    margin-bottom: 20px;
  }

  :deep(.ant-form-item:last-child) {
    margin-bottom: 0;
  }

  :deep(.ant-input-textarea textarea) {
    min-height: 140px;
    max-height: 140px;
    resize: none;
    overflow-y: auto;
  }
}

.template-num-with-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;

  :deep(.ant-input) {
    flex: 1;
    min-width: 0;
  }
}
</style>
