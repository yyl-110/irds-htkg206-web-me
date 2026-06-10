import { computed, getCurrentInstance, nextTick, ref } from 'vue';
import { useCustomPageTaskParamMap } from '../../_shared/composables/useCustomPageTaskParamMap';
import { message } from 'ant-design-vue';
import type { Key } from 'ant-design-vue/es/table/interface';
import { assembleAdapterModule, regenerateAdapterModel } from './assemblyOperations';
import { applyAdapterInitData } from './initData';
import { extractAdapterSaveParamValues, loadAdapterPageParameters } from './loadPageParameters';
import {
  createDefaultAdapterParameterList,
  getAdapterTableRows,
  NUMERIC_REG,
  type AdapterDesignRow,
  type AdapterPageConfig,
  type AdapterParameterItem,
} from './parameterDefaults';
import {
  createAdapterColumnMap,
  createAdapterTableColumns,
  createFormLeftFields,
  createFormRightFields,
  type AdapterAntColumn,
} from './tableColumns';
import { addAdapterTableRow, deleteAdapterTableRows, TYPE_OPTIONS, updateAdapterRowType } from './tableOperations';

export function useAdapterPage(
  pageConfig: AdapterPageConfig,
  props: {
    pageid?: string;
    parameterTempList?: AdapterParameterItem[];
  },
  emit: (event: 'setSaveBtnEnable', value: boolean) => void,
) {
  const tabHeight = 400;
  const formLabelCol = { style: { width: '170px' } };
  const formLabelColWide = { style: { width: '200px' } };
  const tableColumns = createAdapterTableColumns();
  const columnMap = createAdapterColumnMap(tableColumns);
  const formLeftFields = createFormLeftFields(pageConfig);
  const formRightFields = createFormRightFields(pageConfig);

  const selectedRowKeys = ref<Key[]>([]);
  const selectedRows = ref<AdapterDesignRow[]>([]);

  function cloneParameterList(source: AdapterParameterItem[]): AdapterParameterItem[] {
    return source.map(item => ({
      ...item,
      tableMap: item.tableMap
        ? {
            ...item.tableMap,
            rowData: item.tableMap.rowData?.map(row => ({ ...row })),
          }
        : item.tableMap,
    }));
  }

  function createInitialParameterList(): AdapterParameterItem[] {
    if (!props.parameterTempList || props.parameterTempList.length <= 0) {
      return createDefaultAdapterParameterList(pageConfig, props.pageid);
    }
    return cloneParameterList(props.parameterTempList);
  }

  const parameterTempList = ref<AdapterParameterItem[]>(createInitialParameterList());
  const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
    useCustomPageTaskParamMap({
      props,
      parameterTempList,
      cloneItem: cloneParameterList,
      loadPageParameters: async (pageId, saved) => {
        let list = await loadAdapterPageParameters(pageConfig, pageId);
        if (pageConfig.hasInitData) {
          applyAdapterInitData(list);
        }
        return list;
      },
    });
  const tableRows = computed(() => getAdapterTableRows(parameterTempList.value));
  const assemblingFlag = computed(() => selectedRows.value.length !== 1);
  const deleteDisabled = computed(() => selectedRows.value.length <= 0);

  const rowSelection = computed(() => ({
    selectedRowKeys: selectedRowKeys.value,
    onChange: (keys: Key[], rows: AdapterDesignRow[]) => {
      selectedRowKeys.value = keys;
      selectedRows.value = rows;
    },
  }));

  function resolveColumn(column: { dataIndex?: string | number }): AdapterAntColumn | undefined {
    return columnMap.get(String(column.dataIndex ?? ''));
  }

  function tableRowKey(record: AdapterDesignRow, index?: number) {
    if (record.id != null && record.id !== '') return String(record.id);
    return String(record.delIndex ?? record.p0 ?? index ?? '');
  }

  function setSaveBtnEnable(inputOrOutput?: string, parameterId?: string, parameterValue?: string) {
    emit('setSaveBtnEnable', true);
    if (inputOrOutput === undefined || inputOrOutput === '1') return;
    if (parameterId === undefined || parameterId === null || Number(parameterId) <= 0) return;
    if (parameterValue === undefined || parameterValue === null) return;

    parameterTempList.value.forEach(item => {
      if (item.ifSingleLine !== 't') {
        if (item.parameterId === parameterId) {
          item.defaultValue = parameterValue;
        }
      } else {
        const colNums = Number(item.tableMap?.colNums ?? 0);
        if (colNums > 0) {
          item.tableMap?.rowData?.forEach(row => {
            for (let i = 0; i < colNums; i++) {
              if (row[`cellParameterId${i}`] === parameterId) {
                row[`p${i}`] = parameterValue;
              }
            }
          });
        }
      }
    });
  }

  function handleNumberBlur(record: AdapterDesignRow, field: string, event: FocusEvent) {
    const value = (event.target as HTMLInputElement | null)?.value ?? '';
    if (value && !NUMERIC_REG.test(value)) {
      message.error('请输入数字');
      return;
    }
    record[field] = value;
    parameterTempList.value = [...parameterTempList.value];
    setSaveBtnEnable();
  }

  function handleTypeChange(record: AdapterDesignRow, value: string) {
    updateAdapterRowType(pageConfig, record, value);
    parameterTempList.value = [...parameterTempList.value];
    setSaveBtnEnable();
  }

  function handleInitData() {
    const ok = applyAdapterInitData(parameterTempList.value);
    parameterTempList.value = [...parameterTempList.value];
    if (!ok) {
      message.warning('未能从流程上下文读取数据，请确认前置页面上适配器设计已保存');
      return;
    }
    setSaveBtnEnable();
  }

  function handleAddRow() {
    addAdapterTableRow(pageConfig, parameterTempList.value);
    parameterTempList.value = [...parameterTempList.value];
    setSaveBtnEnable();
  }

  function handleDeleteRow() {
    if (selectedRows.value.length <= 0) return;
    deleteAdapterTableRows(parameterTempList.value, selectedRows.value);
    selectedRowKeys.value = [];
    selectedRows.value = [];
    parameterTempList.value = [...parameterTempList.value];
    setSaveBtnEnable();
  }

  function getSingleSelectedRow(): AdapterDesignRow | null {
    if (selectedRows.value.length <= 0) {
      message.info('请选择模型');
      return null;
    }
    if (selectedRows.value.length > 1) {
      message.info('请只选择一个模型');
      return null;
    }
    return selectedRows.value[0];
  }

  async function handleAssembleModule() {
    const row = getSingleSelectedRow();
    if (!row) return;
    const instance = getCurrentInstance()?.proxy;
    if (!instance) return;

    const result = await assembleAdapterModule(instance, pageConfig, parameterTempList.value, row);
    if (!result.ok) {
      if (result.message?.includes('模型号')) message.warning(result.message);
      else if (result.message) message.error(result.message);
      else message.info(result.message ?? '操作失败');
      return;
    }
    setSaveBtnEnable();
  }

  async function handleRegenModel() {
    const row = getSingleSelectedRow();
    if (!row) return;

    const result = await regenerateAdapterModel(pageConfig, parameterTempList.value, row);
    if (!result.ok) {
      if (result.message?.includes('模型号')) message.warning(result.message);
      else if (result.message) message.error(result.message);
      else message.info(result.message ?? '操作失败');
      return;
    }
    setSaveBtnEnable();
  }

  function updateEl() {
    nextTick(() => {
      if (pageConfig.hasInitData) {
        applyAdapterInitData(parameterTempList.value);
      }
      applyTaskParamMapToList();
    });
  }

  setupParameterWatch(updateEl);
  mountWithTaskParamMap(updateEl);

  function getCurrentSaveParamValues() {
    return extractAdapterSaveParamValues(parameterTempList.value);
  }

  return {
    pageConfig,
    tabHeight,
    formLabelCol,
    formLabelColWide,
    tableColumns,
    formLeftFields,
    formRightFields,
    typeOptions: TYPE_OPTIONS,
    parameterTempList,
    tableRows,
    assemblingFlag,
    deleteDisabled,
    rowSelection,
    resolveColumn,
    tableRowKey,
    setSaveBtnEnable,
    handleNumberBlur,
    handleTypeChange,
    handleInitData,
    handleAddRow,
    handleDeleteRow,
    handleAssembleModule,
    handleRegenModel,
    updateEl,
    getCurrentSaveParamValues,
  };
}
