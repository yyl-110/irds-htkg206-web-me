<script lang="ts">
import { defineComponent, inject, reactive, ref, toRefs } from 'vue';
import { ParameterInfoRequestDTOModel } from '@/api/models/parameter/ParameterInfoRequestDTOModel';
import { ParameterUnitRequestDTOModel } from '@/api/models/parameter/ParameterUnitRequestDTOModel';
import { AdminApiSystemParameter } from '@/api/tags/parameter/系统参数管理';
import { useUserStore } from '@/store/modules/user';
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
    const userStore = useUserStore();
    const id = ref(0);
    const parameterName = ref('');
    const parameterNum = ref('');
    const parameterType = ref('1');
    const remarks = ref('');
    const dimension = ref('');
    const categoryid = ref('');
    const unitId = ref('');
    const dimensionList = ref([]); //大小量纲
    const unitNameList = ref([]); //参数单位

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
      requestParams.id = id.value;
      requestParams.parameterName = parameterName.value;
      requestParams.parameterNum = parameterNum.value;
      requestParams.remarks = remarks.value;
      requestParams.unitId = unitId.value;
      requestParams.dimension = dimension.value;
      requestParams.parameterType = parameterType.value;
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
    const infoReload = (data: any, categoryidStr: string) => {
      if (data != undefined) {
        id.value = data.id;
        parameterName.value = data.parameterName;
        parameterNum.value = data.parameterNum;
        parameterType.value = data.parameterType;
        remarks.value = data.remarks;
        unitId.value = data.unitId;
        dimension.value = data.dimension;
        categoryid.value = categoryidStr;
      } else {
        id.value = 0;
        parameterName.value = '';
        parameterNum.value = '';
        parameterType.value = '';
        remarks.value = '';
        unitId.value = '';
        dimension.value = '';
        categoryid.value = categoryidStr;
      }
      //获取量纲
      getUnitParent();
    };
    function customGetContainer() {
      // 返回自定义挂载节点
      return document.querySelector('.paramter-update');
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
      if (unitId.value != null && unitId.value != '') {
        requestDimension.id = unitId.value;
        //获取量纲
        const res = await AdminApiSystemParameter.getUnitChildrenApi({
          ...requestDimension,
        });
        dimensionList.value = res.data.data || [];
      }
    }

    async function onChangeFun() {
      if (parameterType.value == '1' || parameterType.value == '2') {
        unitId.value = '';
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
      id,
      parameterName,
      parameterNum,
      parameterType,
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
  <div class="paramter-update" v-dragModal>
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
      <a-form model="formData" style="margin-top: 20px" :label-col="{ style: { width: '80px' } }">
        <a-form-item :label="$t('参数名称')">
          <a-input v-model:value="parameterName" placeholder="请输入参数名称" name="parameterName" />
        </a-form-item>
        <a-form-item :label="$t('参数代号')">
          <a-input v-model:value="parameterNum" placeholder="请输入参数代号" name="parameterNum" />
        </a-form-item>
        <a-form-item :label="$t('参数类型')">
          <a-select placeholder="请选择参数类型" v-model:value="parameterType" show-search name="parameterType" @change="onChangeFun()">
            <a-select-option v-for="item in propTypeList" :value="item.value" :key="item.label">{{ item.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('单位名称')" v-if="parameterType != '1' && parameterType != '2'">
          <a-select placeholder="请选择参数类型" v-model:value="unitId" show-search name="unitId" @change="getUnitChildren()">
            <a-select-option v-for="item in unitNameList" :value="item.id" :key="item.name">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('大小量纲')" v-if="parameterType != '1' && parameterType != '2'">
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
