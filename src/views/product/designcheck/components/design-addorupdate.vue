<script lang="ts">
import { defineComponent, inject, reactive, ref, toRefs } from 'vue';
import { DesignInfoRequestDTOModel } from '@/api/models/designcheck/DesignInfoRequestDTOModel';
import { AdminApiSystemDesign } from '@/api/tags/designcheck/系统设计查核';
import { useUserStore } from '@/store/modules/user';
import { e } from 'mathjs';
import _ from 'lodash';
import { message } from 'ant-design-vue';
const requestParams = reactive(new DesignInfoRequestDTOModel());

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
    const content = ref('');
    const standard = ref('');
    const name = ref('');
    const term = ref([]);
    const text = ref('');
    const categoryid = ref('');
    const termString = ref('');
    const num = ref('');
    const titleName = ref('');
    const requirementLevel = ref('');
    const productPlatform = ref('');
    const sys = ref('');
    const part = ref('');
    const importance = ref('');
    const businessClassification = ref('');
    const requirementsClassification = ref('');
    const requirementLevelOptions = ref([
      // { value: '', label: '请选择需求级别' },
      { value: '一级需求', label: '一级需求' },
      { value: '二级需求', label: '二级需求' },
      { value: '三级需求', label: '三级需求' },
    ]);
    const importanceOptions = ref([
      // { value: '', label: '请选择重要性' },
      { value: '必须', label: '必须' },
      { value: '重要', label: '重要' },
      { value: '建设', label: '建设' },
      { value: '一般', label: '一般' },
    ]);
    const classificationOptions = ref([
      // { value: '', label: '请选择需求级别' },
      { value: '可靠性需求', label: '可靠性需求' },
      { value: '可用性需求', label: '可用性需求' },
      { value: '可维修性需求', label: '可维修性需求' },
      { value: '安全性需求', label: '安全性需求' },
      { value: '可操作性需求', label: '可操作性需求' },
      { value: '降低成本需求', label: '降低成本需求' },
      { value: '包装及运输类需求', label: '包装及运输类需求' },
      { value: '可制造性类需求', label: '可制造性类需求' },
      { value: '质量提升类需求', label: '质量提升类需求' },
      { value: '技术管理类需求', label: '技术管理类需求' },
      { value: '业务价值类需求', label: '业务价值类需求' },
      { value: '人机工程类需求', label: '人机工程类需求' },
      { value: '供应类需求', label: '供应类需求' },
      { value: '替代类需求', label: '替代类需求' },
      { value: '复用类需求', label: '复用类需求' },
    ]);
    const systemOptions = ref([
      // { value: '', label: '请选择系统' },
      { value: '整车', label: '整车' },
      { value: '车体结构', label: '车体结构' },
      { value: '车体前端', label: '车体前端' },
      { value: '车体附件', label: '车体附件' },
      { value: '车内布置', label: '车内布置' },
      { value: '转向架', label: '转向架' },
      { value: '制动', label: '制动' },
      { value: '空调', label: '空调' },
      { value: '车门', label: '车门' },
      { value: '车窗', label: '车窗' },
      { value: '给水卫生', label: '给水卫生' },
      { value: '厨房设备', label: '厨房设备' },
      { value: '车内设备', label: '车内设备' },
      { value: '牵引系统', label: '牵引系统' },
      { value: '高压系统', label: '高压系统' },
      { value: 'PIS系统', label: 'PIS系统' },
      { value: '辅助供电系统', label: '辅助供电系统' },
      { value: '车顶布线', label: '车顶布线' },
      { value: '车上布线', label: '车上布线' },
      { value: '车下布线', label: '车下布线' },
      { value: '车内照明', label: '车内照明' },
      { value: '车外照明', label: '车外照明' },
      { value: '司机台布置', label: '司机台布置' },
      { value: '电气柜', label: '电气柜' },
      { value: '网络系统', label: '网络系统' },
      { value: 'PHM系统', label: 'PHM系统' },
    ]);

    /** handle close */
    const handleClose = () => {
      // 通过事件传过去
      visible.value = false;
      context.emit('close');
    };

    const propTypeList = ref([
      {
        value: '1',
        label: '方案设计',
      },
      {
        value: '2',
        label: '系统设计',
      },
      {
        value: '3',
        label: '详细设计',
      },
    ]);

    /** handle close */
    async function savePageInfo() {
      requestParams.num = num.value;
      requestParams.requirementLevel = requirementLevel.value;
      requestParams.name = name.value;
      requestParams.productPlatform = productPlatform.value;
      requestParams.sys = sys.value;
      requestParams.part = part.value;
      requestParams.importance = importance.value;
      requestParams.businessClassification = businessClassification.value;
      requestParams.requirementsClassification = requirementsClassification.value;
      requestParams.id = id.value;
      requestParams.content = content.value;
      requestParams.standard = standard.value;
      requestParams.text = text.value;
      requestParams.userid = userStore.getUser.id + '';
      requestParams.auditId = categoryid.value;
      requestParams.termString = _.join(term.value, ',');
      try {
        const res =
          id.value != undefined && id.value > 0 ? await AdminApiSystemDesign.designUpdate({ ...requestParams }) : await AdminApiSystemDesign.designSave({ ...requestParams });
        debugger;
        if (res?.code === '-1') {
          message.error(res.msg || '操作失败');
          return;
        }
        context.emit('refresh-table-data');
        context.emit('close');
      } catch (error) {
        message.error(error.response?.data?.msg);
      }
    }

    //初始化数据
    const infoReload = (col: any, categoryidStr: string) => {
      debugger;
      if (!col) {
        titleName.value = '项点添加';
        num.value = '';
        requirementLevel.value = '';
        productPlatform.value = '';
        sys.value = '';
        part.value = '';
        importance.value = '';
        businessClassification.value = '';
        requirementsClassification.value = '';
        id.value = 0;
        content.value = '';
        standard.value = '';
        term.value = [];
        text.value = '';
        name.value = '';
        termString.value = '';
      } else {
        titleName.value = '项点编辑';
        num.value = col.num || '';
        requirementLevel.value = col.requirementLevel || '';
        productPlatform.value = col.productPlatform || '';
        sys.value = col.sys || '';
        part.value = col.part || '';
        name.value = col.name || '';
        importance.value = col.importance || '';
        businessClassification.value = col.businessClassification || '';
        requirementsClassification.value = col.requirementsClassification || '';
        id.value = col.id;
        // content.value = col.content;
        standard.value = col.standard;
        text.value = col.text;
        const termString = col.termString;
        term.value = _.split(termString, ',');
      }
      categoryid.value = categoryidStr;
    };
    function customGetContainer() {
      // 返回自定义挂载节点
      return document.querySelector('.design-addorupdate');
    }

    return {
      titleName,
      visible,
      customGetContainer,
      infoReload,
      handleClose,
      savePageInfo,
      propTypeList,
      id,
      content,
      standard,
      term,
      text,
      termString,
      categoryid,
      num,
      requirementLevel,
      productPlatform,
      sys,
      name,
      part,
      importance,
      businessClassification,
      requirementsClassification,
      requirementLevelOptions,
      importanceOptions,
      classificationOptions,
      systemOptions,
    };
  },
});
</script>

<template>
  <div class="design-addorupdate" v-dragModal>
    <a-modal
      v-model:visible="visible"
      style="width: 700px"
      :style="{ top: '5%' }"
      :title="$t(titleName)"
      :getContainer="customGetContainer"
      :confirm-loading="$isPending()"
      :mask-closable="false"
      :body-style="{ padding: '0' }"
      @ok="savePageInfo"
      @cancel="handleClose">
      <div class="modal-scroll">
        <a-form model="formData" style="margin-top: 16px" :label-col="{ style: { width: '90px' } }">
          <a-form-item label="编号" :rules="[{ required: true, message: '请填写编号' }]">
            <a-input v-model:value="num" placeholder="请输入编号" />
          </a-form-item>
          <a-form-item label="需求级别" :rules="[{ required: true, message: '请选择需求级别' }]">
            <a-select v-model:value="requirementLevel" placeholder="请选择需求级别" allow-clear>
              <a-select-option v-for="option in requirementLevelOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="名称" :rules="[{ required: true, message: '请填写名称' }]">
            <a-input v-model:value="name" placeholder="请输入名称" />
          </a-form-item>
          <a-form-item label="描述" :rules="[{ required: true, message: '请填写描述' }]">
            <a-textarea type="textarea" style="height: 100px" v-model:value="standard" placeholder="请输入描述" name="standard" />
          </a-form-item>
          <a-form-item label="产品平台">
            <a-input v-model:value="productPlatform" placeholder="请输入产品平台" />
          </a-form-item>
          <a-form-item label="重要性" :rules="[{ required: true, message: '请选择重要性' }]">
            <a-select v-model:value="importance" placeholder="请选择重要性" allow-clear>
              <a-select-option v-for="option in importanceOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="系统" :rules="[{ required: true, message: '请选择系统' }]">
            <a-select v-model:value="sys" placeholder="请选择系统" allow-clear>
              <a-select-option v-for="option in systemOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label="$t('适用阶段')" :rules="[{ required: true, message: '请选择适用阶段' }]">
            <a-select placeholder="请选择适用阶段" mode="multiple" show-search name="term" v-model:value="term">
              <a-select-option v-for="item in propTypeList" :value="item.value" :key="item.label">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="部件/部位">
            <a-input v-model:value="part" placeholder="请输入部件/部位" />
          </a-form-item>
          <a-form-item label="专业分类">
            <a-input v-model:value="businessClassification" placeholder="请输入专业分类" />
          </a-form-item>
          <a-form-item label="需求分类">
            <a-select v-model:value="requirementsClassification" placeholder="请选择需求分类" allow-clear>
              <a-select-option v-for="option in classificationOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="备注">
            <a-textarea type="textarea" style="height: 100px" v-model:value="text" placeholder="请输入备注" name="text" />
          </a-form-item>
        </a-form>
      </div>
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
.design-addorupdate .ant-modal-body {
  padding: 0;
}
.modal-scroll {
  max-height: 420px;
  overflow-y: auto;
  padding: 16px 24px 0;
}
</style>
