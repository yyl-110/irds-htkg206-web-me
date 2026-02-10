<script lang="ts" setup>
import { ref } from 'vue';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import { Upload, message } from 'ant-design-vue';
import MP4Box from 'mp4box';
import { WeiI18n } from '@/utils/WeiI18n';
import { InformationPOModel } from '@/api/models/information/InformationPOModel';
import { AdminApiInformation } from '@/api/tags/information/管理后台资料管理';
import { AdminApiSystemLanguage } from '@/api/tags/管理后台多语言';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { dePreviewFile } from '@/utils/file';

const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },

  /** 资料 id */
  id: {
    require: false,
    type: String,
    default: '',
  },

  /** 分类结构树 id */
  dirId: {
    require: false,
    type: String,
    default: '',
  },
  /** 针脚图id区分 */
  rootKey: {
    require: false,
    type: String,
    default: '',
  },
  /** 业务范围下拉 */
  bizRangeOption: {
    require: false,
    type: Array,
    default: () => [],
  },
  /** 排放 */
  emissionOption: {
    require: false,
    type: Array,
    default: () => [],
  },
  /** 燃料类型 */
  fuelTypeOption: {
    require: false,
    type: Array,
    default: () => [],
  },
  /** 行业下拉 */
  industryOption: {
    require: false,
    type: Array,
    default: () => [],
  },
  /** 系列下拉 */
  seriesOption: {
    require: false,
    type: Array,
    default: () => [],
  },

  /** 型号下拉 */
  modelOption: {
    require: false,
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits<{
  /** 点击取消按钮 */
  onClose: [visible: boolean];
  /** 点击提交 */
  handleSubmit: [resource: any];
}>();

/** 多语言列表 字典参数 */
const languageOption = ref<any>([]);

/** 文件列表 */
const fileList = ref<any>([]);

/** 文件列表 */
const formRef = ref();

/** 弹窗状态 */
const visible = computed(() => {
  // 编辑数据查询基本信息并显示
  if (props.modalVisible) {
    getDetailData(props.id);
  } else {
    // 新建刷新页面
    if (formRef.value) {
      formRef.value.resetFields();
    }
    fileList.value = [];
  }
  // 暂时注释
  bizRangeOptionFunction();
  return props.modalVisible;
});

/**
 * on Custom request
 * @param file
 * @param options
 */
const onCustomRequest: any['onCustomRequest'] = async file => {
  const res = await AdminApiSystemUploadFile.uploadFile({ file });
  // fileList.value.push({ ...res.data.data })
  return res.data.data;
};

/**
 * on file done
 * @param file
 */
const onFileDone: any['onFileDone'] = async file => {
  // await fileList.value.push({ ...file.response })
  // 这里是 `url` 的赋值逻辑, 在此处文件已经上传完毕, `file.response` 就是 `onCustomRequest` 的返回值
  file.url = (file.response as any).url;
};

/**
 * beforeUpload
 * @param file
 */
const beforeUpload: UploadProps['beforeUpload'] = async file => {
  // 正确的视频后缀会有mime信息
  // if (file.type.includes('mp4')) {
  //   const result = await checkVideoCode(file)
  //   if (result?.mime.includes('audio/mp4')) {
  //     message.error(WeiI18n.t('当前视频不可播放，请先转码在进行上传').value)
  //     setTimeout(() => {
  //       fileList.value = []
  //     }, 500)
  //     return false
  //   }
  // }

  const isPdfOrMp4 = true;
  //   = file.type === 'application/pdf' || file.type === 'video/mp4'
  // if (!isPdfOrMp4) {
  //   message.error(WeiI18n.t('只能上传PDF或MP4格式文件！').value)
  // }
  return isPdfOrMp4 || Upload.LIST_IGNORE;
};

/**
 * @description 检查视频是否可以播放
 * @param file  文件对象
 *
 */
async function checkVideoCode(file: any) {
  return new Promise((resolve, reject) => {
    const mp4boxFile = MP4Box.createFile();
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function (e) {
      const arrayBuffer = e.target.result;
      arrayBuffer.fileStart = 0;
      mp4boxFile.appendBuffer(arrayBuffer);
    };
    mp4boxFile.onReady = function (info) {
      resolve(info);
    };
    mp4boxFile.onError = function (info) {
      reject(info);
    };
  });
}

/**
 * handle upload change
 * @param info upload info
 */
function handleUploadChange(info: UploadChangeParam) {}

/** 表单数据  */
const modelData = ref<any>({
  id: '', // id
  name: '', // 名称
  model: '', // 型号
  docNumber: '', // 件号
  industry: '', // 行业
  series: '', // 系列
  fuelType: '', // 燃料类型
  emission: '', // 排放
  lang: '', // 语言
  bizRange: '', // 业务范围
  power: '', // 功率
  fileId: '', // 附件ID
  docName: '', // 附件名称
  docType: '', // 附件类型
  ecuPartNumber: '', // ECU硬件件号
  ecuPartModel: '', // ECU硬件型号
  fileInfo: [],
});
const requestParams = reactive(new InformationPOModel());
/**
 * @description 点击确认
 */
async function handleSubmit() {
  formRef.value?.validate().then(async () => {
    requestParams.id = modelData.value.id;
    requestParams.name = modelData.value.name;
    requestParams.model = modelData.value.model;
    requestParams.docNumber = modelData.value.docNumber;
    requestParams.industry = modelData.value.industry;
    requestParams.series = modelData.value.series;
    requestParams.fuelType = modelData.value.fuelType;
    requestParams.emission = modelData.value.emission;
    requestParams.dirId = props.dirId;
    requestParams.lang = modelData.value.lang;
    requestParams.bizRange = modelData.value.bizRange;
    requestParams.power = modelData.value.power;
    requestParams.ecuPartNumber = modelData.value.ecuPartNumber;
    requestParams.ecuPartModel = modelData.value.ecuPartModel;
    requestParams.fileStatus = '1';
    if (fileList.value.length > 0) {
      requestParams.fileId = fileList.value[0]?.response?.id;
      requestParams.docName = fileList.value[0]?.response?.fileName;
      requestParams.docType = fileList.value[0]?.response?.fileExt;
    } else {
      message.error(WeiI18n.t('请先上传附件！').value);
      return;
    }

    if (modelData.value.id != undefined && modelData.value.id != '') {
      const res = await AdminApiInformation.updateInformation({
        ...requestParams,
      });
      if (res.data.code === 200) {
        message.success(WeiI18n.t('保存成功').value);
        emit('handleSubmit', null);
      }
    } else {
      const res = await AdminApiInformation.saveInformation({
        ...requestParams,
      });
      if (res.data.code === 200) {
        message.success(WeiI18n.t('保存成功').value);
        emit('handleSubmit', null);
      }
    }
  });
}

/**
 * @description 点击取消事件
 */
function cancel() {
  emit('onClose', false);
}

async function getDetailData(id: string) {
  if (id != '') {
    const res = await AdminApiInformation.getInformationDetail({ id });
    if (res.data.code === 200) {
      if (res.data.data) {
        // 反写表单信息
        modelData.value = res.data.data;
        // 清空附件信息
        // fileList.value = []
        // 反写附件信息
        fileList.value.push({
          uid: modelData.value.fileInfo.id,
          name: modelData.value.fileInfo.fileName,
          status: 'done',
          url: dePreviewFile(modelData.value.fileInfo.id),
          // import.meta.env.VITE_BASE_PREVIEW_URL
          // + modelData.value.fileInfo?.previewUrl,
        });
      }
    }
  } else {
    // 反写表单信息
    modelData.value = {
      id: '', // id
      name: '', // 名称
      docNumber: '', // 件号
      model: '', // 型号
      industry: '', // 行业
      series: '', // 系列
      fuelType: '', // 燃料类型
      emission: '', // 排放
      lang: '', // 语言
      bizRange: '', // 业务范围
      power: '', // 功率
      fileId: '', // 附件ID
      docName: '', // 附件名称
      docType: '', // 附件类型
      ecuPartNumber: '', // ECU硬件件号
      ecuPartModel: '', // ECU硬件型号
      fileInfo: [],
    };
    // 清空附件信息
    fileList.value = [];
  }
}

/** 表单label宽度配置  */
const labelCol = ref({ style: { width: '100px' } });

/** 中文key 验证 */
const rules: Partial<Record<keyof any, Array<any> | any>> = {
  name: { required: true, message: WeiI18n.t('请输入名称').value },
  // docNumber: { required: true, message: WeiI18n.t('请输入件号').value },
  fuelType: { required: true, message: WeiI18n.t('请选择燃料类型').value },
  bizRange: { required: true, message: WeiI18n.t('请选择业务范围').value },
  lang: { required: true, message: WeiI18n.t('请选择语言').value },
  industry: { required: true, message: WeiI18n.t('请输入行业').value },
  series: { required: true, message: WeiI18n.t('请输入系列').value },
};

/**
 * @description 获取语言下拉参数
 */
async function bizRangeOptionFunction() {
  languageOption.value = [];
  // await AdminApiSystemLanguage.languageList({}).then(res => {
  //   if (res.data.data != null && res.data.data != undefined) {
  //     res.data.data?.forEach(item => {
  //       languageOption.value.push({ value: item.lang, label: item.langDesc });
  //     });
  //   }
  // });
}
</script>

<template>
  <a-modal
    v-model:visible="visible"
    width="1000px"
    wrap-class-name="wrapClassName"
    :title="$t('添加数据')"
    :confirm-loading="$isPending()"
    :ok-text="$t('确定')"
    :cancel-text="$t('取消')"
    :mask-closable="false"
    @ok="handleSubmit"
    @cancel="cancel">
    <a-form ref="formRef" :model="modelData" :label-col="labelCol" :rules="rules">
      <a-form-item :label="$t('名称')" name="name" width="100px">
        <a-input v-model:value="modelData.name" :placeholder="$t('请输入')" />
      </a-form-item>
      <a-form-item v-if="rootKey !== '1867472048072781825'" :label="$t('件号')" name="docNumber" width="100">
        <a-input v-model:value="modelData.docNumber" :placeholder="$t('请输入')" />
      </a-form-item>
      <a-form-item v-if="rootKey === '1867472048072781825'" :label="$t('ECU硬件件号')" name="ecuPartNumber" width="100">
        <a-input v-model:value="modelData.ecuPartNumber" :placeholder="$t('请输入')" />
      </a-form-item>
      <a-form-item v-if="rootKey === '1867472048072781825'" :label="$t('ECU硬件型号')" name="ecuPartModel" width="100">
        <a-input v-model:value="modelData.ecuPartModel" :placeholder="$t('请输入')" />
      </a-form-item>
      <a-form-item :label="$t('业务范围')" name="bizRange" width="100">
        <a-select v-model:value="modelData.bizRange" allow-clear show-search>
          <a-select-option v-for="item in props.bizRangeOption" :key="item.label" :value="item.value">
            {{ WeiI18n.t(item.label) }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('语言')" name="lang" width="100">
        <a-select v-model:value="modelData.lang" allow-clear show-search>
          <a-select-option v-for="item in languageOption" :key="item.label" :value="item.value">
            {{ WeiI18n.t(item.label) }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('系列')" name="series" width="100">
        <a-select v-model:value="modelData.series" allow-clear show-search>
          <a-select-option v-for="item in props.seriesOption" :key="item?.dicKey" :value="item?.dicKey">
            {{ WeiI18n.t(item?.dicValue) }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('燃料类型')" name="fuelType" width="100">
        <a-select v-model:value="modelData.fuelType" allow-clear show-search>
          <a-select-option v-for="item in props.fuelTypeOption" :key="item.dicKey" :value="item.dicValue">
            {{ WeiI18n.t(item.dicKey) }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('行业')" name="industry" width="100">
        <a-select v-model:value="modelData.industry" allow-clear show-search>
          <a-select-option v-for="item in props.industryOption" :key="item.dicKey" :value="item.dicKey">
            {{ WeiI18n.t(item.dicValue) }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-if="modelData.bizRange === '动力' || modelData.bizRange === '发动机'" :label="$t('排放')" name="emission" width="100">
        <a-select v-model:value="modelData.emission" style="allow-clear" show-search>
          <a-select-option v-for="item in props.emissionOption" :key="item.dicKey" :value="item.dicKey">
            {{ WeiI18n.t(item.dicValue) }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <!-- <a-form-item
        v-if="modelData.bizRange === '动力' || modelData.bizRange === '发动机'"
        :label="$t('功率')"
        name="power"
        width="100"
      >
        <a-input v-model:value="modelData.power" placeholder="请输入" />
      </a-form-item> -->
      <a-form-item v-if="modelData.bizRange != '液压' && modelData.bizRange != '液压传动'" :label="$t('产品型号')" name="model" width="100">
        <a-select v-model:value="modelData.model" allow-clear show-search>
          <a-select-option v-for="item in props.modelOption" :key="item.dicKey" :value="item.dicKey">
            {{ WeiI18n.t(item.dicValue) }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('附件上传')" name="fileList">
        <WeiUpload v-if="visible" v-model:file-list="fileList" :on-custom-request="onCustomRequest" max-count="1" :before-upload="beforeUpload" @change="handleUploadChange">
          <a-button>
            {{ $t('选择') }}
          </a-button>
        </WeiUpload>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style lang="less" scoped></style>
