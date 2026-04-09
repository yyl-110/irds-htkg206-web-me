<script lang="ts" setup>
import { defineComponent, inject, reactive, ref, toRefs } from 'vue';
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn';
import { message } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import { businessApiLibrary } from '@/api/tags/library/基础资源库';
import { re } from 'mathjs';
const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['close', 'refreshtabledata']);
const userStore = useUserStore();
/** 弹窗状态 */
const visible = computed(() => {
  return props.modalVisible;
});
// 基础资源库分类表单
const formData = reactive({
  id: 0,
  menuName: '',
  sort: 1,
  status: true,
  categoryType: 1,
  menuType: 1,
  useCateFlag: 2,
  useCateId: undefined,
  remarks: '',
});

// 参数类型选项（固定列等）
const parameterTypeOptions = [
  { label: '固定列', value: 1 },
  { label: '自定义列', value: 2 },
  { label: '固定列+自定义列', value: 3 },
];
// 资源库类型选项
const resourceLibraryTypeOptions = [
  { label: '模型库', value: 1 },
  { label: 'UDF库', value: 2 },
  { label: '列表数据类', value: 3 },
  { label: '系统集成类', value: 4 },
];
// 是否共享结构树
const shareStructureTreeOptions = [
  { label: '是', value: 1 },
  { label: '否', value: 2 },
];
// 结构树共享库选项
const structureTreeSharedLibraryOptions = ref([{}]);

/** handle close */
function handleClose() {
  Object.assign(formData, {
    id: 0,
    menuName: '',
    sort: 1,
    status: true,
    categoryType: 1,
    menuType: 1,
    useCateFlag: 2,
    useCateId: undefined,
    remarks: '',
  });
  emit('close');
}

async function savePageInfo() {
  if (!formData.menuName) {
    message.error(WeiI18n.$t('基础资源库名称不能为空!'));
    return;
  }
  if (!formData.sort) {
    message.error(WeiI18n.$t('序号不能为空!'));
    return;
  }
  if (formData.id != undefined && formData.id > 0) {
    const data: any = {};
    data.id = formData.id;
    data.menuName = formData.menuName;
    data.sort = formData.sort;
    if (formData.status) {
      data.status = 1;
    } else {
      data.status = 0;
    }
    data.categoryType = formData.categoryType;
    data.menuType = formData.menuType;
    data.useCateFlag = formData.useCateFlag;
    data.useCateId = formData.useCateId;
    data.remarks = formData.remarks;
    const res = await businessApiLibrary.libraryUpdate(data);
  } else {
    const data: any = {};
    data.menuName = formData.menuName;
    data.sort = formData.sort;
    if (formData.status) {
      data.status = 1;
    } else {
      data.status = 0;
    }
    data.categoryType = formData.categoryType;
    data.menuType = formData.menuType;
    data.useCateFlag = formData.useCateFlag;
    data.useCateId = formData.useCateId;
    data.remarks = formData.remarks;
    const res = await businessApiLibrary.libraryAdd(data);
  }
  // TODO: 此处接入基础资源库分类保存接口，使用 formData 提交
  emit('refreshtabledata');
  emit('close');
}

const trueOrFlase = ref<any>(true);
const addOrEdit = ref<any>('');
// 初始化数据
function noticeInfoAddOrUpdate(data: any, resou: any) {
  console.log(resou);
  structureTreeSharedLibraryOptions.value = (resou || []).map(item => ({
    label: item?.menuName || '',
    value: Number(item?.id) || 0,
  }));
  if (resou.length > 0) {
    trueOrFlase.value = true;
  } else {
    trueOrFlase.value = false;
  }
  if (data) {
    Object.assign(formData, {
      id: data.id,
      menuName: data.menuName,
      sort: data.sort,
      status: data.status === 1 ? true : false,
      categoryType: data.categoryType,
      menuType: data.menuType,
      useCateFlag: data.useCateFlag,
      useCateId: data.useCateId,
      remarks: data.remarks,
    });
    addOrEdit.value = 'edit';
  } else {
    Object.assign(formData, {
      id: 0,
      menuName: '',
      sort: resou.length + 1,
      status: true,
      categoryType: 1,
      menuType: 1,
      useCateFlag: 2,
      useCateId: undefined,
      remarks: '',
    });
    addOrEdit.value = 'add';
  }
}
function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.libraryAddOrUpdate');
}

defineExpose({ noticeInfoAddOrUpdate });
</script>

<template>
  <div class="libraryAddOrUpdate" v-dragModal>
    <a-modal
      v-model:visible="visible"
      :getContainer="customGetContainer"
      class="library-category-modal"
      style="width: 560px"
      :style="{ top: '5%' }"
      :title="$t('基础资源库管理')"
      :confirm-loading="$isPending()"
      :mask-closable="false"
      :body-style="{ padding: '24px 32px' }"
      @ok="savePageInfo"
      @cancel="handleClose">
      <a-form
        class="library-category-form"
        :model="formData"
        :label-col="{ style: { width: '180px', minWidth: '180px' } }"
        :wrapper-col="{ style: { flex: 1 } }"
        label-align="left"
        style="margin-top: 20px">
        <a-form-item :label="$t('基础资源库名称')" name="menuName">
          <a-input v-model:value="formData.menuName" placeholder="请输入基础资源库名称" allow-clear />
        </a-form-item>
        <a-form-item :label="$t('序号')" name="sort">
          <a-input v-model:value="formData.sort" placeholder="请输入序号" allow-clear />
        </a-form-item>
        <a-form-item :label="$t('状态')" name="status">
          <a-switch v-model:checked="formData.status" />
        </a-form-item>
        <a-form-item :label="$t('参数类型')" name="categoryType">
          <a-select v-model:value="formData.categoryType" placeholder="请选择参数类型" allow-clear>
            <a-select-option v-for="item in parameterTypeOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('资源库类型')" name="menuType">
          <a-select v-model:value="formData.menuType" placeholder="请选择资源库类型" allow-clear>
            <a-select-option v-for="item in resourceLibraryTypeOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="trueOrFlase" :label="$t('是否共享结构树')" name="useCateFlag">
          <a-select :disabled="addOrEdit == 'edit'" v-model:value="formData.useCateFlag" placeholder="请选择是否共享结构树" allow-clear>
            <a-select-option v-for="item in shareStructureTreeOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="trueOrFlase && formData.useCateFlag == 1" :label="$t('结构树共享库')" name="useCateId">
          <a-select :disabled="addOrEdit == 'edit'" v-model:value="formData.useCateId" placeholder="请选择结构树共享库" allow-clear>
            <a-select-option v-for="item in structureTreeSharedLibraryOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('备注')" name="remarks">
          <a-textarea v-model:value="formData.remarks" placeholder="请输入备注" :rows="4" allow-clear />
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
.libraryAddOrUpdate {
  position: relative;
}

/* 强制表单 label 列固定宽度并左对齐，标题靠近左侧 */
.library-category-form :deep(.ant-form-item) {
  .ant-form-item-label {
    width: 180px !important;
    min-width: 110px !important;
    flex: 0 0 110px !important;
    text-align: left !important;
  }
  .ant-form-item-control {
    flex: 1 !important;
    min-width: 0 !important;
  }
}
</style>
