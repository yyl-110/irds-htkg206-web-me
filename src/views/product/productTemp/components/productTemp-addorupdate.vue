<script lang="ts" setup>
import { defineComponent, inject, reactive, ref, toRefs } from 'vue';
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn';
import { message, type FormInstance } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import { AdminApiProductTemp } from '@/api/tags/productTemp/产品模板后台';
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
const formData = reactive({
  tempNum: '',
  tempName: '',
  remarks: '',
  status: '',
  versionNum: '',
});
const formRules = {
  tempNum: [{ required: true, message: '请输入模板编号', trigger: 'blur' }],
  tempName: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
};

const id = ref(0);

/** handle close */
function handleClose() {
  formRef.value?.resetFields();
  emit('close');
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
function noticeInfoAddOrUpdate(record: any) {
  if (record) {
    id.value = record.id;
    formData.tempNum = record.tempNum;
    formData.tempName = record.tempName;
    formData.remarks = record.remarks;
    formData.status = record.status;
    formData.versionNum = record.versionNum;
    title.value = '产品模板编辑';
  } else {
    id.value = 0;
    formData.tempNum = '';
    formData.tempName = '';
    formData.remarks = '';
    formData.status = '';
    formData.versionNum = '';
    title.value = '产品模板创建';
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
      :width="1200"
      :style="{ top: '150px' }"
      :title="title"
      :confirm-loading="$isPending()"
      :mask-closable="false"
      @ok="savePageInfo"
      @cancel="handleClose">
      <div class="product-temp-content">
        <a-form ref="formRef" :model="formData" :rules="formRules" layout="vertical" class="product-temp-form">
          <div class="row-fields">
            <a-form-item :label="$t('模板编号')" name="tempNum" class="row-item">
              <a-input v-model:value="formData.tempNum" :placeholder="$t('请输入...')" />
            </a-form-item>
            <a-form-item :label="$t('模板名称')" name="tempName" class="row-item">
              <a-input v-model:value="formData.tempName" :placeholder="$t('请输入...')" />
            </a-form-item>
          </div>
          <a-form-item :label="$t('备注')" name="code" class="remark-item">
            <a-textarea v-model:value="formData.remarks" :placeholder="$t('请输入...')" :rows="3" :maxlength="500" show-count />
          </a-form-item>
        </a-form>
      </div>
      <template #footer>
        <div class="footer-actions">
          <a-button type="primary" @click="savePageInfo">
            {{ $t('确定') }}
          </a-button>
          <a-button @click="handleClose">
            {{ $t('取消') }}
          </a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
.notice-addorUpdate {
  position: relative;
}

:deep(.product-temp-modal .ant-modal-header) {
  border-bottom: 0;
}

.product-temp-content {
  padding: 12px 24px 6px;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.product-temp-form {
  margin-top: 4px;
}

.row-fields {
  display: flex;
  gap: 44px;
}

.row-item {
  flex: 1;
}

:deep(.row-item .ant-form-item-label > label),
:deep(.remark-item .ant-form-item-label > label) {
  color: #333;
  font-size: 14px;
}

:deep(.row-item .ant-form-item-label),
:deep(.remark-item .ant-form-item-label) {
  padding-bottom: 12px;
}

:deep(.row-item .ant-input) {
  height: 33px;
}

.remark-item {
  margin-top: 8px;
  margin-bottom: 0;
}

:deep(.remark-item .ant-input-textarea textarea) {
  min-height: 86px;
  resize: none;
}

.footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  width: 100%;
}
</style>
