<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { AdminApiCompetitor } from '@/api/tags/competitor/竞品数据库管理';
import { Uploado_draggerFile } from '@/components/UploadFile';
import { Uploado_draggerMoreFile } from '@/components/UploadFile';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { number } from 'mathjs';
import { useUserStore } from '@/store/modules/user';
const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },
});
const userStore = useUserStore();
/** 弹窗状态 */
const visible = computed(() => {
  return props.modalVisible;
});
const formRef = ref();
const loadingTree = ref<boolean>(false);
const loading = ref<boolean>(false);
const datasource = ref<any>([]);
const updateId = ref<number>(0);
const fileList = ref<any>([]);
const imgFiled = ref<any>([]);
const competitorId = ref<number>(0);
const fileList2 = ref<any>([]);
const fileList3 = ref<any>([]);
const activeKey = ref(['1']);
const treeId = ref<number>(0);
const draggerMoreFile2 = ref();
// 表单数据
const formData = reactive({
  competitorName: '',
  sortIndex: 0,
});

/** 列表数据 */
const dataSource = ref<Array<any>>([]);
/** 获取分类数据 */
async function getListData(id: any, treeIds: any) {
  loadingTree.value = true;
  competitorId.value = id;
  try {
    //根据ID查询分类数据
    if (treeIds) {
      treeId.value = treeIds;
    }
    AdminApiCompetitor.getCompetitorTreeById({ id: id, treeId: treeId.value }).then(res => {
      if (res && res.data.code == 200) {
        datasource.value = res.data.data;
      }
    });
    let type = '1';
    AdminApiCompetitor.getCompetitorFileList({ id: id, type: type }).then(res => {
      if (res && res.data.code == 200) {
        fileList.value = res.data.data;
      }
    });
    type = '2';
    AdminApiCompetitor.getCompetitorFileList({ id: id, type: type }).then(res => {
      if (res && res.data.code == 200) {
        fileList2.value = res.data.data;
      }
    });
    type = '3';
    AdminApiCompetitor.getCompetitorFileList({ id: id, type: type }).then(res => {
      if (res && res.data.code == 200) {
        fileList3.value = res.data.data;
      }
    });
  } catch (error) {
    message.error('获取数据失败！');
  } finally {
    loadingTree.value = false;
  }
}

function customGetContainer() {
  // 返回自定义挂载节点
  return document.querySelector('.TreeModuleModal');
}

// 增加编辑弹窗
async function confirm() {
  //循环获取数据
  const checkList: any[] = [];
  for (let i = 0; i < datasource.value.length; i++) {
    const element = datasource.value[i];
    for (let j = 0; j < element.children.length; j++) {
      const element2 = element.children[j];
      checkList.push(element2);
    }
  }

  const params = {
    checkList: checkList,
    imgFiled: imgFiled.value,
    fileIdstr: [],
    fileImgIdstr: [],
    id: competitorId.value,
  };
  if (fileList.value !== undefined && fileList.value.length > 0) {
    if (fileList.value[0].fileid !== undefined && fileList.value[0].fileid !== '') {
      params.imgFiled = fileList.value[0].fileid;
    } else {
      params.imgFiled = fileList.value[0].id;
    }
  } else {
    params.imgFiled = '';
  }
  if (fileList2.value !== undefined && fileList2.value.length > 0) {
    const fileId2: any = [];
    for (let i = 0; i < fileList2.value.length; i++) {
      const element = fileList2.value[i];
      if (element.fileid !== undefined && element.fileid !== '') {
        fileId2.push(element.fileid);
      } else {
        fileId2.push(element.id);
      }
    }
    params.fileIdstr = fileId2;
  } else {
    params.fileIdstr = [];
  }
  if (fileList3.value !== undefined && fileList3.value.length > 0) {
    const fileId3: any = [];
    for (let i = 0; i < fileList3.value.length; i++) {
      const element = fileList3.value[i];
      if (element.fileid !== undefined && element.fileid !== '') {
        fileId3.push(element.fileid);
      } else {
        fileId3.push(element.id);
      }
    }
    params.fileImgIdstr = fileId3;
  } else {
    params.fileImgIdstr = [];
  }
  AdminApiCompetitor.competitorInfoDataUpdate(params).then(res => {
    if (res && res.data.code == 200) {
      //调用父页面刷新数据
      emit('refresh-table-data');
      emit('close');
    }
  });
}

function filechange(file: any) {
  fileList.value[0] = file;
  console.log(fileList.value[0]);
}
function filechange2(file: any) {
  fileList2.value = fileList2.value.filter((item: any) => item.id !== file.id);
}

function filechange3(file: any) {
  fileList3.value = fileList3.value.filter((item: any) => item.id !== file.id);
}

async function customRequest(options: any) {
  loading.value = true;
  fileList.value[0] = options.file;
  try {
    const res = await AdminApiSystemUploadFile.uploadFile({ file: options.file as File, userId: userStore.getUser.id });
    if (res.data.code === 200) {
      const file: any = { ...res.data.data, name: res.data.data?.oldFileName };
      fileList.value[0] = file;
      console.log(fileList.value[0]);
      message.success(WeiI18n.t('上传成功').value);
    } else {
      message.error(WeiI18n.t('上传失败').value);
    }
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
}
async function customRequest2(options: any) {
  loading.value = true;
  try {
    const res = await AdminApiSystemUploadFile.uploadFile({ file: options.file as File, userId: userStore.getUser.id });
    if (res.data.code === 200) {
      const file: any = { ...res.data.data, name: res.data.data?.oldFileName };
      fileList2.value.push(file);
      message.success(WeiI18n.t('上传成功').value);
    } else {
      message.error(WeiI18n.t('上传失败').value);
    }
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
}

async function customRequest3(options: any) {
  loading.value = true;
  try {
    const res = await AdminApiSystemUploadFile.uploadFile({ file: options.file as File, userId: userStore.getUser.id });
    if (res.data.code === 200) {
      const file: any = { ...res.data.data, name: res.data.data?.oldFileName };
      fileList3.value.push(file);
      message.success(WeiI18n.t('上传成功').value);
    } else {
      message.error(WeiI18n.t('上传失败').value);
    }
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
}

const emit = defineEmits(['close', 'refresh-table-data']);

defineExpose({ getListData });
</script>

<template>
  <a-modal title="竞品数据修改" class="modelstyle" v-model:visible="visible" width="100%" wrapClassName="full-modal" :confirm-loading="$isPending()" @cancel="emit('close')">
    <a-spin :spinning="loading" tip="加载中...">
      <div class="model-content">
        <a-collapse class="custom-collapse" v-model:activeKey="activeKey">
          <a-collapse-panel :header="item.categoryName" :key="item.id" v-for="item in datasource">
            <a-form :label-col="{ style: { width: '370px' } }" layout="vertical" ref="formRef" style="display: flex; flex-wrap: wrap; margin-left: 20px">
              <a-form-item
                :label="
                  itemc.unit != null && itemc.unit != '' && itemc.unit != ' ' && itemc.unit != undefined && itemc.unit != 'null'
                    ? itemc.categoryName + '(' + itemc.unit + ')'
                    : itemc.categoryName
                "
                :key="itemc.id"
                :name="itemc.categoryName"
                v-for="itemc in item.children"
                style="width: 370px">
                <a-input v-model:value="itemc.value" :placeholder="'请输入' + itemc.categoryName" style="width: 220px" v-if="itemc.compType == 1 && itemc.paraType != 2" />
                <a-input-number v-model:value="itemc.value" :placeholder="'请输入' + itemc.categoryName" style="width: 220px" v-if="itemc.compType == 1 && itemc.paraType == 2" />
                <a-select v-model:value="itemc.value" :placeholder="'请选择' + itemc.categoryName" style="width: 220px" v-if="itemc.compType == 2">
                  <a-select-option v-for="itemd in itemc.optionStr.split(',')" :key="itemd">{{ itemd }}</a-select-option>
                </a-select>
                <a-date-picker v-model:value="itemc.value" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 220px" v-if="itemc.compType == 3" />
              </a-form-item>
            </a-form>
          </a-collapse-panel>
          <a-collapse-panel key="filePanel" header="上传车辆示意图">
            <div style="display: flex; flex-wrap: wrap">
              <!-- 添加上传示意图区域 -->
              <div class="upload-area" style="margin-left: 20px">
                上传示意图:
                <Uploado_draggerFile width="560px" :file-list="fileList" @change="filechange" :fileTypesImg="true" @custom-request="customRequest" />
              </div>
              <!-- 添加上传示意图区域 -->
              <div class="upload-area" style="margin-left: 40px">
                上传文件附件：
                <Uploado_draggerMoreFile width="560px" ref="draggerMoreFile2" :file-list="fileList2" @change="filechange2" @custom-request="customRequest2" />
              </div>
              <!-- 添加上传图片 -->
              <div class="upload-area" style="margin-left: 20px">
                上传图片：
                <Uploado_draggerMoreFile width="560px" ref="draggerMoreFile3" :file-list="fileList3" @change="filechange3" @custom-request="customRequest3" />
              </div>
            </div>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </a-spin>
    <template #footer>
      <div class="dialog-footer">
        <a-button type="primary" @click="confirm">确定</a-button>
        <a-button @click="emit('close')">取消</a-button>
      </div>
    </template>
  </a-modal>
</template>

<style lang="less" scoped>
@import '../../../../sheets/collapse.less';
:deep(.ant-collapse-content-box) {
  padding: 0px !important;
  padding-top: 16px !important;
}
.model-content {
  height: calc(100vh - 130px);
  overflow: auto;
}
</style>
