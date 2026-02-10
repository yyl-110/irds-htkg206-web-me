<script setup lang="ts">
import { TableProps, message, Modal, Switch } from 'ant-design-vue';
import { ref } from 'vue';
import { WeiI18n } from '@/utils/WeiI18n';
import AddModal from '@/views/business/information/form/index.vue';
import DetailModal from '@/views/business/information/detailpdf/index.vue';
import VideoModal from '@/views/business/information/detailvideo/index.vue';
import { AdminApiInformation } from '@/api/tags/information/管理后台资料管理';
import { InformationPageRequestDTOModel } from '@/api/models/information/InformationPageRequestDTOModel';
import { useDictStore } from '@/store/modules/dict';
import { AdminApiSystemCommon } from '@/api/tags/管理后台通用管理';
import { WeiMessage } from '@/utils/WeiMessage';
import { sortermethod } from '@/utils/tools';
import { dePreviewFile, handlePreviewFile, kkFilePreview } from '@/utils/file';
import { EpcIcon } from '@/components/icon/EpcIcon';
import Empty from '@/components/Empty/index.vue';
const props = defineProps({
  rootKey: {
    require: false,
    type: String,
    default: '',
  },
});

/** 表格高度 */
const tableHXH = ref(document.body.clientHeight - 450); //

/** 添加弹窗状态 */
const addModalVisible = ref<boolean>(false);

const loading = ref(false);

/**  按钮是否可用 */
const btnUsedFlag = ref(true);

/**  文件路径 */
const fileRootUrl = ref(import.meta.env.VITE_BASE_PREVIEW_URL);

/** 系列 字典参数 */
const seriesOption = ref<any>([]);

/** 型号 字典参数 */
const modelOption = ref<any>([]);

/** 排放 字典参数 */
const emissionOption = ref<any>([]);

/** 批量删除ID数组 */
const ids = ref<any>([]);

/** 附件URL */
const fileUrl = ref<any>('');

/** 页面视图类型 1：列表；0：图表*/
const pageView = ref<any>('1');

const current = ref<number>(1);
const pageSize = ref<number>(10);

// 声明key 类型
type Key = string | number;
// 声明表格类型
interface DataType {
  // id: Key
  objType: string;
  objId: string;
  amount: number;
  buyFlag: boolean;
}

/** 升序降序提示  */
const locale = ref({
  cancelSort: WeiI18n.t('点击取消排序').value,
  triggerAsc: WeiI18n.t('点击升序').value,
  triggerDesc: WeiI18n.t('点击降序').value,
  emptyText: h(Empty, {
    description: '数据为空',
    style: { paddingBottom: '50px' },
  }),
});

/** 获取字典 */
const useDict = useDictStore();
/** 页面下拉字典 page_combo_config 字典常量定义 */
const categoryList = computed(() => {
  return useDict.getDictOptions('page_combo_config');
});

/** 业务范围 下拉参数 */
const bizRangeOption = computed(() => {
  return useDict.getDictOptions('biz_range');
});

/** 燃料类型 下拉参数 */
const fuelTypeOption = ref<any>([]);

/** 行业下拉 下拉参数 */
const industryOption = ref<any>([]);

/**
 * @param category
 * @description 获取字典
 */
async function initDictionaryList() {
  const parm = <Array<string>>[];
  const list = categoryList.value;
  if (list) {
    list.forEach(item => {
      parm.push(item?.value + '');
    });
  }
  if (parm.length > 0) {
    const res = await AdminApiSystemCommon.getDictionaryList({
      categoryList: parm,
    });
    if (res.data.code === 200) {
      const list = res.data.data;
      list?.forEach((item: any) => {
        if (item.category === 'Series') {
          seriesOption.value = item.dict;
        } else if (item.category === 'sim.emission') {
          emissionOption.value = item.dict;
        } else if (item.category === 'Model') {
          modelOption.value = item.dict;
        } else if (item.category === 'ProductType') {
          industryOption.value = item.dict;
        } else if (item.category === 'ext.fueltype') {
          fuelTypeOption.value = item.dict;
        }
      });
    }
  }
}

onActivated(() => [reloadPageSelect()]);

/** 勾选表格数据源  */
const selectedRowList = ref<DataType[]>([]);

/** 表格勾选事件 */
const rowSelection: TableProps['rowSelection'] = {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  onChange: (selectedRowKeys: string[], selectedRows: DataType[]) => {
    selectedRowList.value = selectedRows;
    //修改批量操作按钮状态
    if (selectedRowList.value.length > 0) {
      btnUsedFlag.value = false;
    } else {
      btnUsedFlag.value = true;
    }
  },
};

/** 表单数据  */
const modelData = ref<any>({
  id: '', //id
  name: '', //名称
  docNumber: '', //件号
  model: '', //型号
  industry: '', //行业
  series: '', //系列
  fuelType: '', //燃料类型
  emission: '', //排放
  lang: '', //语言
  bizRange: '', //业务范围
  power: '', //功率
  fileId: '', //附件ID
  docName: '', //附件名称
  docType: '', //附件类型
});

/** 列表请求参数 */
const requestParams = reactive(new InformationPageRequestDTOModel());

/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, getListData);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;

/** 表格列属性 */
const columns2 = computed<any>(() => [
  {
    title: '',
    dataIndex: 'icon',
    key: 'icon',
    width: 25,
  },
  {
    title: WeiI18n.t('名称').value,
    dataIndex: 'name',
    key: 'name',
    width: 160,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('件号').value,
    dataIndex: 'docNumber',
    key: 'docNumber',
    width: 160,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('系列').value,
    dataIndex: 'series',
    key: 'series',
    width: 120,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('燃料类型').value,
    dataIndex: 'fuelType',
    key: 'fuelType',
    width: 130,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('行业').value,
    dataIndex: 'industry',
    key: 'industry',
    width: 80,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('排放').value,
    dataIndex: 'emission',
    key: 'emission',
    width: 80,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('型号').value,
    dataIndex: 'model',
    key: 'model',
    width: 110,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('语言').value,
    dataIndex: 'langDesc',
    key: 'langDesc',
    width: 150,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('业务范围').value,
    dataIndex: 'bizRange',
    key: 'bizRange',
    width: 100,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('创建者').value,
    dataIndex: 'creator',
    key: 'creator',
    width: 100,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('创建时间').value,
    dataIndex: 'createTime',
    key: 'createTime',
    width: 150,
    sorter: (a: any, b: any) => sortermethod(a.createTime, b.createTime),
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('修改者').value,
    dataIndex: 'updater',
    key: 'updater',
    width: 100,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('修改时间').value,
    dataIndex: 'updateTime',
    key: 'updateTime',
    width: 150,
    sorter: (a: any, b: any) => sortermethod(a.updateTime, b.updateTime),
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('状态').value,
    dataIndex: 'fileStatus',
    key: 'fileStatus',
    width: 80,
    sorter: false,
    customRender({ text, record, index }) {
      return h(Switch, {
        checked: record.fileStatus === '1',
        onChange() {
          // 修改状态的二次确认
          const _text = record.fileStatus === '0' ? '启用' : '停用';
          Modal.confirm({
            title: WeiI18n.$t(`确认要"${_text}"数据吗`) + '?',
            async onOk() {
              // 发起修改状态
              await AdminApiInformation.updateInformationType({
                id: record.id as string,
                type: record.fileStatus == 0 ? 1 : 0,
              });
              // 刷新列表
              await getListData();
            },
          });
        },
      });
    },
  },
  {
    title: WeiI18n.t('操作').value,
    align: 'left',
    dataIndex: 'operation',
    width: 150,
    fixed: 'right',
  },
]);

/** 表格列属性 */
const columns = computed<any>(() => [
  {
    title: '',
    dataIndex: 'icon',
    key: 'icon',
    width: 25,
  },
  {
    title: WeiI18n.t('ECU针脚图').value,
    dataIndex: 'name',
    key: 'name',
    width: 160,
    sorter: (a: any, b: any) => sortermethod(a.name, b.name),
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('ECU硬件件号').value,
    dataIndex: 'ecuPartNumber',
    key: 'ecuPartNumber',
    width: 160,
    sorter: (a: any, b: any) => sortermethod(a.ecuPartNumber, b.ecuPartNumber),
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('ECU硬件型号').value,
    dataIndex: 'ecuPartModel',
    key: 'ecuPartModel',
    width: 110,
    sorter: (a: any, b: any) => sortermethod(a.model, b.model),
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('件号').value,
    dataIndex: 'docNumber',
    key: 'docNumber',
    width: 110,
    sorter: (a: any, b: any) => sortermethod(a.docNumber, b.docNumber),
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('行业').value,
    dataIndex: 'industry',
    key: 'industry',
    width: 120,
    sorter: (a: any, b: any) => sortermethod(a.industry, b.industry),
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('系列').value,
    dataIndex: 'series',
    key: 'series',
    width: 120,
    sorter: (a: any, b: any) => sortermethod(a.series, b.series),
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('排放').value,
    dataIndex: 'emission',
    key: 'emission',
    width: 80,
    sorter: (a: any, b: any) => sortermethod(a.emission, b.emission),
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('燃料类型').value,
    dataIndex: 'fuelType',
    key: 'fuelType',
    width: 130,
    sorter: (a: any, b: any) => sortermethod(a.fuelType, b.fuelType),
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('创建者').value,
    dataIndex: 'creator',
    key: 'creator',
    width: 100,
    sorter: (a: any, b: any) => sortermethod(a.creator, b.creator),
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('创建时间').value,
    dataIndex: 'createTime',
    key: 'createTime',
    width: 150,
    sorter: (a: any, b: any) => sortermethod(a.createTime, b.createTime),
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('修改者').value,
    dataIndex: 'updater',
    key: 'updater',
    width: 100,
    sorter: (a: any, b: any) => sortermethod(a.updater, b.updater),
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('修改时间').value,
    dataIndex: 'updateTime',
    key: 'updateTime',
    width: 150,
    sorter: (a: any, b: any) => sortermethod(a.updateTime, b.updateTime),
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('操作').value,
    align: 'left',
    dataIndex: 'operation',
    width: 150,
    fixed: 'right',
  },
]);

/** 数据 定义 */
const dataSource = ref<Array<any>>([]);

/** 表单对象 */
const formRef = ref();
const selectedKeys: any = ref();

/** 表单样式 label对象 */
const labelCol = ref({ style: { width: '100px' } });

/** 表单 布局对象 */
const wrapperCol = ref({ span: 14 });

/** PDF预览页面  */
const detailModalVisible = ref<boolean>(false);

/** 视频播放页面  */
const detailVideoVisible = ref<boolean>(false);

/** 详情id */
const detailId = ref<string>('');

/**
 * @description 获取数据列表
 */
async function getListData() {
  requestParams.name = requestParams.name; // 查询条件名称
  requestParams.docNumber = requestParams.docNumber; // 查询条件件号
  requestParams.ecuPartNumber = requestParams.ecuPartNumber; //ECU硬件件号
  requestParams.model = requestParams.model; // 查询条件型号
  requestParams.industry = requestParams.industry; // 查询条件行业
  requestParams.series = requestParams.series; // 系列
  requestParams.fuelType = requestParams.fuelType; // 燃料类型
  requestParams.emission = requestParams.emission; // 排放
  requestParams.dirId = selectedKeys.value; // 左侧树节点ID
  requestParams.type = 1;
  loading.value = true;
  try {
    const res = await AdminApiInformation.getInformationPage(requestParams);
    if (res.data.code === 200) {
      dataSource.value = res.data.data?.list || [];
      pagination.total = res.data.data?.total;
    }
  } finally {
    loading.value = false;
  }
}

/**
 * @description 重置搜索条件
 */
function handleReset() {
  formRef.value.resetFields();
  requestParams.pageNo = 1;
  pagination.current = 1;
  getListData();
}

/**
 * @param id
 * @description 切换树节点查询表格内容
 */
function reloadTableData(id: string) {
  //重置查询条件
  formRef.value.resetFields();
  selectedKeys.value = id;
  //查询数据
  getListData();
}

/**
 * @description 添加、编辑 确认事件，关闭弹窗初始化列表
 */
function handleSubmit() {
  addModalVisible.value = false;
  getListData();
}

function handleAdd() {
  detailId.value = '';
  addModalVisible.value = true;
  initDictionaryList();
}

/**
 * @param id
 * @description 跳转修改
 */
function handleUpdate(id: string) {
  detailId.value = id;
  addModalVisible.value = true;
}

/**
 * @param id
 * @description 跳转删除
 */
async function handleDelete(id: string) {
  Modal.confirm({
    title: `${WeiI18n.t('确认删除当前数据吗').value + '?'}`,
    okText: WeiI18n.t('确定').value,
    cancelText: WeiI18n.t('取消').value,
    async onOk() {
      ids.value = [];
      if (id === '') {
        //批量删除
        selectedRowList.value.forEach((selectedRow: any) => {
          ids.value.push(selectedRow.id);
        });
      } else {
        //单条删除
        ids.value.push(id);
      }
      const res = await AdminApiInformation.deleteInformation({
        ids: ids.value,
      });
      if (res.data.code === 200) {
        message.success(WeiI18n.t('删除成功').value);
        getListData();
      }
    },
  });
}

/**
 * @description 下载数据
 */
async function downloadFile() {
  selectedRowList.value.forEach((selectedRow: any) => {
    if (selectedRow.previewUrl != null) {
      window.open(`${import.meta.env.VITE_BASE_PREVIEW_URL + selectedRow.previewUrl}`);
    }
  });
}

const isPdf = (fileExt: string) => {
  const tmpFileExt = fileExt || '';
  return tmpFileExt.toLowerCase() === 'pdf';
};
const isMp4 = (fileExt: string) => {
  const tmpFileExt = fileExt || '';
  return tmpFileExt.toLowerCase() === 'mp4';
};
/**
 * @description 跳转详情
 */
async function handleDetail(row: any) {
  if (row.id != '') {
    const res = await AdminApiInformation.getInformationDetail({ id: row.id });
    if (res.data.code === 200) {
      if (res.data.data) {
        //反写表单信息
        modelData.value = res.data.data;
        if (modelData.value?.fileInfo) {
          if (isPdf(modelData.value.fileInfo.fileExt) || isMp4(modelData.value.fileInfo.fileExt)) {
            // fileUrl.value = `${import.meta.env.VITE_BASE_PREVIEW_URL + modelData.value.fileInfo.previewUrl}`;
            fileUrl.value = dePreviewFile(modelData.value?.fileInfo?.id);
          } else {
            fileUrl.value = await kkFilePreview(modelData.value?.fileInfo?.id);
            window.open(fileUrl.value);
          }
        } else {
          WeiMessage.error('此文件不存在!');
        }
      } else {
        WeiMessage.error('请求成功,但未获取到数据!');
        return;
      }
    }
  }
  if (isPdf(modelData.value.fileInfo.fileExt)) {
    detailModalVisible.value = true;
  } else if (isMp4(modelData.value.fileInfo.fileExt)) {
    //视频格式
    detailVideoVisible.value = true;
  }
}
function changePageView(type: string) {
  pageView.value = type;
}

/**
 * @description 添加、编辑 确认事件，关闭弹窗初始化列表
 */
function reloadPageSelect() {
  //读取集成下拉
  initDictionaryList();
}

/**
 * @description 添加、编辑 确认事件，关闭弹窗初始化列表
 */
function onChange() {
  getListData();
}

function columnsFun() {
  if (props.rootKey === '1867472048072781825') {
    return columns.value;
  } else {
    return columns2.value;
  }
}
/** 查询表格数据 */
function handleFinish() {
  requestParams.pageNo = 1;
  pagination.current = 1;
  getListData();
}
/**
 * @description 通过item判断icon路径
 */
function DynamicIcon(item: any) {
  let str = '';
  if (item.docType == 'pdf' || item.docType == 'PDF') {
    str = 'icon-pdf';
  } else if (item.docType == 'docx' || item.docType == 'doc') {
    str = 'icon-docx';
  } else if (item.docType == 'xlsx' || item.docType == 'xls') {
    str = 'icon-xlsx';
  } else if (item.docType == 'pptx' || item.docType == 'ppt') {
    str = 'icon-pptx';
  } else if (item.docType == 'mp4' || item.docType == 'wmv' || item.docType == 'avi' || item.docType == 'flv' || item.docType == 'mkv') {
    str = 'icon-shipin2';
  } else {
    str = 'icon-wushuju';
  }
  return str;
}
//发布接口供父窗口调用
defineExpose({ reloadTableData });
</script>

<template>
  <a-card>
    <a-form ref="formRef" class="form_css" layout="inline" :label-col="labelCol" :wrapper-col="wrapperCol" :model="requestParams">
      <a-form-item :label="$t('名称')" name="name">
        <a-input v-model:value="requestParams.name" style="width: 220px; text-align: left; margin-top: 5px" :placeholder="$t('请输入')" />
      </a-form-item>
      <a-form-item v-if="rootKey === '1867472048072781825'" :label="$t('ECU硬件件号')" name="ecuPartNumber">
        <a-input v-model:value="requestParams.ecuPartNumber" style="width: 220px; text-align: left; margin-top: 5px" :placeholder="$t('请输入')" />
      </a-form-item>

      <a-form-item v-if="rootKey !== '1867472048072781825'" :label="$t('件号')" name="docNumber">
        <a-input v-model:value="requestParams.docNumber" style="width: 220px; text-align: left; margin-top: 5px" :placeholder="$t('请输入')" />
      </a-form-item>
      <a-form-item :label="$t('型号')" name="model">
        <a-select v-model:value="requestParams.model" style="width: 220px; text-align: left; margin-top: 5px" :placeholder="$t('请选择型号')" allow-clear show-search>
          <a-select-option v-for="item in modelOption" :key="item.dicKey" :value="item.dicValue">
            {{ item.dicValueLang }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('行业')" name="industry">
        <a-select v-model:value="requestParams.industry" style="width: 220px; text-align: left; margin-top: 5px" :placeholder="$t('请选择行业')" allow-clear show-search>
          <a-select-option v-for="item in industryOption" :key="item.dicKey" :value="item.dicValue">
            {{ item.dicValueLang }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('系列')" name="series">
        <a-select v-model:value="requestParams.series" style="width: 220px; text-align: left; margin-top: 5px" :placeholder="$t('请选择系列')" allow-clear show-search>
          <a-select-option v-for="item in seriesOption" :key="item.dicKey" :value="item.dicValue">
            {{ item.dicValueLang }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('燃料类型')" name="fuelType">
        <a-select v-model:value="requestParams.fuelType" style="width: 220px; text-align: left; margin-top: 5px" :placeholder="$t('请选择燃料类型')" allow-clear show-search>
          <a-select-option v-for="item in fuelTypeOption" :key="item.dicKey" :value="item.dicValue">
            {{ item.dicValueLang }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('排放')" name="emission">
        <a-select v-model:value="requestParams.emission" style="width: 220px; text-align: left; margin-top: 5px" :placeholder="$t('请选择排放')" allow-clear show-search>
          <a-select-option v-for="item in emissionOption" :key="item.dicKey" :value="item.dicValue">
            {{ item.dicValueLang }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item style="margin-top: 5px">
        <a-button @click="handleFinish" type="primary">
          <EpcIcon type="primary" style="font-size: 12px" />
          {{ $t('查询') }}
        </a-button>
      </a-form-item>
      <a-form-item style="margin-top: 5px">
        <a-button type="primary" @click="handleAdd" v-hasPermi="['system:doc:create']">
          <EpcIcon type="icon-tianjia1" style="font-size: 12px" />
          {{ $t('添加') }}
        </a-button>
      </a-form-item>
      <a-form-item style="margin-top: 5px" v-if="pageView == '1'">
        <a-button type="primary" danger :disabled="btnUsedFlag" v-hasPermi="['system:doc:delete']" @click="handleDelete('')">
          {{ $t('删除') }}
        </a-button>
      </a-form-item>
      <a-form-item style="margin-top: 5px" v-if="pageView == '1'">
        <a-button type="primary" :disabled="btnUsedFlag" v-hasPermi="['system:doc:download']" @click="downloadFile()">
          {{ $t('下载') }}
        </a-button>
      </a-form-item>
    </a-form>
    <div class="changeDivStyle">
      <span :class="pageView == '1' ? 'changeDivChecked' : 'changeDivUnChecked'" style="border-radius: 3px 0 0 3px" :title="$t('列表视图')" @click="changePageView('1')">
        <UnorderedListOutlined />
      </span>
      <span :class="pageView == '1' ? 'changeDivUnChecked' : 'changeDivChecked'" style="border-radius: 0 3px 3px 0" :title="$t('图表视图')" @click="changePageView('0')">
        <FundOutlined />
      </span>
    </div>
  </a-card>
  <a-card style="margin-top: 10px" v-show="pageView == '1'" class="b-body3">
    <a-table
      :scroll="{ x: 1200 }"
      :pagination="pagination"
      :loading="loading"
      row-key="id"
      :locale="locale"
      :data-source="dataSource"
      :columns="columnsFun()"
      :rowClassName="(record, index) => (index % 2 === 0 ? 'odd' : 'even')"
      :row-selection="rowSelection">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operation'">
          <div style="height: 22px; display: flex; align-items: center">
            <a @click.stop="handleUpdate(record.id)" v-hasPermi="['system:doc:update']">{{ $t('编辑') }}</a>
            <a-divider type="vertical" v-hasPermi="['system:doc:update']" />
            <a @click.stop="handleDelete(record.id)" v-hasPermi="['system:doc:delete']" style="color: red">{{ $t('删除') }}</a>
            <a-divider type="vertical" v-hasPermi="['system:doc:delete']" />
            <a @click.stop="handleDetail(record)">{{ $t('查看') }}</a>
          </div>
        </template>
        <template v-if="column.dataIndex === 'icon'">
          <EpcIcon :type="DynamicIcon(record)" />
        </template>
        <template v-if="column.dataIndex === 'createTime'">
          <div>
            {{ record.createTime.substring(0, 10) }}
          </div>
        </template>
        <template v-if="column.dataIndex === 'updateTime'">
          <div>
            {{ record.updateTime.substring(0, 10) }}
          </div>
        </template>
      </template>
    </a-table>
  </a-card>
  <a-card style="margin-top: 10px" v-show="pageView == '0'">
    <div>
      <div class="calculateItem" v-for="item in dataSource" :key="item.id" @click="handleDetail(item)">
        <div class="Img-box">
          <EpcIcon :type="DynamicIcon(item)" class="iconfont-size" />
          <!-- <img
            src="@/assets/images/pdf.png"
            style="width: 100%; height: 100%"
            v-if="item.docType == 'pdf' || item.docType == 'PDF'"
          />
          <video
            class="videolist"
            :src="fileRootUrl + item.previewUrl"
            style="width: 100%; height: 100%"
            v-if="item.docType === 'mp4' || item.docType === 'MP4'"
          ></video> -->
        </div>
        <div class="calclation-content">
          <b>{{ item.name }}</b
          ><br />
          <span v-if="item.langDesc != ''">{{ item.langDesc }},</span>
          <span v-if="item.bizRange != ''"> {{ item.bizRange }},</span>
          <span v-if="item.industry != ''">{{ item.industry }},</span>
          <span v-if="item.series != ''">{{ item.series }},</span>
          <span v-if="item.fuelType != ''"> {{ item.fuelType }},</span>
          <span v-if="item.power != ''"> {{ item.power }},</span>
          <span v-if="item.emission != ''">{{ item.emission }}</span>
        </div>
      </div>
    </div>
    <br />
    <!-- 分页组件 -->
    <div style="position: absolute; bottom: 5px; right: 20px">
      <a-pagination
        v-model:current="pagination.current"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-size-options="pagination.pageSizeOptions"
        show-size-changer
        show-quick-jumper
        @change="onChange" />
    </div>
  </a-card>
  <AddModal
    :id="detailId"
    :modal-visible="addModalVisible"
    :dirId="selectedKeys"
    :bizRange-option="bizRangeOption"
    :emission-option="emissionOption"
    :fuelType-option="fuelTypeOption"
    :industry-option="industryOption"
    :series-option="seriesOption"
    :model-option="modelOption"
    :rootKey="rootKey"
    @handle-submit="handleSubmit"
    @cancel="addModalVisible = false" />
  <DetailModal :fileUrl="fileUrl" :modal-visible="detailModalVisible" @cancel="detailModalVisible = false" />
  <VideoModal :fileUrl="fileUrl" :modal-visible="detailVideoVisible" @cancel="detailVideoVisible = false" />
</template>

<style lang="less" scoped>
.del-text {
  color: var(--ant-error-color);
}

.card_css {
  margin-top: 10px;
}

.card_css .ant-form {
  margin-bottom: -20px;
}

.changeDivStyle {
  position: absolute;
  bottom: 10px;
  right: 0px;
  width: 70px;
  float: left;
}
.changeDivChecked {
  color: #407fff;
  border: 1px solid #407fff;
  padding: 0 6px;
  cursor: pointer;
}

.changeDivUnChecked {
  border: 1px solid #c1c5ce;
  padding: 0 6px;
  cursor: pointer;
}

.calculateItem {
  position: relative;
  width: 256px;
  float: left;
  margin-top: 10px;
  margin-bottom: 25px;
  margin-right: 25px;
  transition: all 0.3s ease;
  overflow: hidden;
  display: block;
  background: #cbdcf5;
  box-shadow: 0 0 15px 6px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  text-decoration: none;
  outline: 0;
  cursor: pointer;
}
.calculateItem:hover {
  transform: translateY(-10px);
  background: #1971ff;
  color: #fff;
  .calclation-content {
    background: #1971ff;
    color: #fff;
  }
}

.Img-box {
  position: relative;
  display: block;
  width: 100%;
  height: 192px;
  overflow: hidden;
  border-radius: 10px 10px 0 0;
  .iconfont-size {
    font-size: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
}

.calclation-content {
  width: 100%;
  padding: 10px 20px 15px 20px;
  text-align: left;
  color: #222222;
  height: 80px;
  background: #fff;
}

.videolist {
  border-radius: 5px;
  overflow: hidden;
  background: #ccc;
}

:deep(.ant-form-item) {
  padding-top: 10px;
}

:deep(.ant-form-item-label > label) {
  height: 40px;
}

/** 表格固定 **/
.b-body3 {
  height: calc(100vh - 280px);
  overflow: auto;
}
</style>
