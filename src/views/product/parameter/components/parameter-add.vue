<script lang="ts">
import { defineComponent, inject, reactive, ref, toRefs } from 'vue';
import { ParameterInfoRequestDTOModel } from '@/api/models/parameter/ParameterInfoRequestDTOModel';
import { ParameterUnitRequestDTOModel } from '@/api/models/parameter/ParameterUnitRequestDTOModel';
import { AdminApiSystemParameter } from '@/api/tags/parameter/系统参数管理';
import { useUserStore } from '@/store/modules/user';
import type { FormInstance } from 'ant-design-vue';
const requestParams = reactive(new ParameterInfoRequestDTOModel());
const requestDimension = reactive(new ParameterUnitRequestDTOModel());

export default defineComponent({
  name: 'NoticeData',
  props: {
    modalVisible: {
      type: Boolean,
    },
  },
  setup(props, context) {
    /** 弹窗状态 */

    const visible = computed(() => {
      return props.modalVisible;
    });
    const formRef = ref<FormInstance>();
    const userStore = useUserStore();
    const id = ref(0);
    const remarks = ref('');
    const dimension = ref('');
    const categoryid = ref('');
    const unitId = ref('');
    const dimensionList = ref([]); //大小量纲
    const unitNameList = ref([]); //参数单位
    const formData = ref({
      parameterName: '',
      parameterNum: '',
      parameterType: '1',
      // remarks: '',
      // unitId: '',
      // dimension: '',
      // categoryid: '',
    });
    const propTypeList = ref([
      {
        value: '0',
        label: '实数',
      },
      {
        value: '1',
        label: '字符串',
      },
      {
        value: '2',
        label: '布尔型',
      },
      {
        value: '9',
        label: '整数',
      },
    ]);

    /** handle close */
    const handleClose = () => {
      // 通过事件传过去
      visible.value = false;
      context.emit('close');
    };

    /** handle close */
    async function savePageInfo() {
      // 调用保存接口
      await formRef.value?.validate();
      requestParams.id = id.value;
      requestParams.parameterName = formData.value.parameterName;
      requestParams.parameterNum = formData.value.parameterNum;
      requestParams.remarks = remarks.value;
      requestParams.unitId = unitId.value;
      requestParams.dimension = dimension.value;
      requestParams.parameterType = formData.value.parameterType;
      requestParams.categoryid = categoryid.value;
      requestParams.userid = userStore.getUser.id + '';
      // 保存页面信息
      const res = await AdminApiSystemParameter.parameterInfoSaveOrUpdate({
        ...requestParams,
      });
      //刷新父页面列表数据
      context.emit('refresh-table-data');
      //关闭当前窗口
      context.emit('close');
    }

    //初始化数据
    const infoReload = (categoryidStr: string) => {
      id.value = 0;
      formData.value.parameterName = '';
      formData.value.parameterNum = '';
      formData.value.parameterType = '1';
      remarks.value = '';
      unitId.value = '';
      dimension.value = '';
      categoryid.value = categoryidStr;
      nextTick(() => {
        formRef.value?.resetFields();
      });
      //获取量纲
      getUnitParent();
    };
    function customGetContainer() {
      // 返回自定义挂载节点
      return document.querySelector('.parameter-add');
    }

    // 请求参数单位
    async function getUnitParent() {
      //获取量纲
      const res = await AdminApiSystemParameter.getUnitParentApi({
        ...requestParams,
      });
      unitNameList.value = res.data.data || [];
      getUnitChildren();
    }

    // 请求量纲
    async function getUnitChildren() {
      if (unitId.value != null && unitId.value != 0) {
        requestDimension.id = unitId.value;
        //获取量纲
        const res = await AdminApiSystemParameter.getUnitChildrenApi({
          ...requestDimension,
        });
        dimensionList.value = res.data.data || [];
      }
    }

    async function onChangeFun() {
      if (formData.value.parameterType == '1' || formData.value.parameterType == '2') {
        unitId.value = 0;
        dimension.value = '';
      }
    }

    return {
      visible,
      customGetContainer,
      infoReload,
      handleClose,
      savePageInfo,
      getUnitParent,
      getUnitChildren,
      onChangeFun,
      formData,
      formRef,
      id,
      propTypeList,
      unitNameList,
      dimensionList,
      remarks,
      unitId,
      dimension,
      categoryid,
    };
  },
});
</script>

<template>
  <div class="parameter-add" v-dragModal>
    <a-modal
      v-model:visible="visible"
      :getContainer="customGetContainer"
      style="width: 700px"
      :style="{ top: '5%' }"
      :title="$t('参数管理')"
      :confirm-loading="$isPending()"
      :mask-closable="false"
      @ok="savePageInfo"
      @cancel="handleClose">
      <a-form ref="formRef" :model="formData" style="margin-top: 20px" :label-col="{ style: { width: '80px' } }">
        <a-form-item :label="$t('参数名称')" name="parameterName" :rules="[{ required: true, message: `${$t('请输入参数名称')}` }]">
          <a-input v-model:value="formData.parameterName" placeholder="请输入参数名称" />
        </a-form-item>
        <a-form-item :label="$t('参数代号')" name="parameterNum" :rules="[{ required: true, message: `${$t('请输入参数代号')}` }]">
          <a-input v-model:value="formData.parameterNum" placeholder="请输入参数代号" />
        </a-form-item>
        <a-form-item :label="$t('参数类型')" name="parameterType" :rules="[{ required: true, message: `${$t('请选择参数类型')}` }]">
          <a-select placeholder="请选择参数类型" v-model:value="formData.parameterType" show-search @change="onChangeFun()">
            <a-select-option v-for="item in propTypeList" :value="item.value" :key="item.label">{{ item.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('单位名称')" v-if="formData.parameterType != '1' && formData.parameterType != '2'">
          <a-select placeholder="请选择参数类型" v-model:value="unitId" show-search name="unitId" @change="getUnitChildren()">
            <a-select-option v-for="item in unitNameList" :value="item.id" :key="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('大小量纲')" v-if="formData.parameterType != '1' && formData.parameterType != '2'">
          <a-select placeholder="请选择参数类型" v-model:value="dimension" show-search name="dimension">
            <a-select-option v-for="item in dimensionList" :value="item.name" :key="item.name">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('备注')">
          <a-textarea type="textarea" style="height: 100px" v-model:value="remarks" placeholder="请输入备注" name="remarks" />
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

<style scoped lang="less"></style>
