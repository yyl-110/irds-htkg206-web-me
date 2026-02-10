<script lang="ts">
import type { UnwrapRef } from 'vue';
import { defineComponent, nextTick, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { getDictAddSaveData, getDictUpdateSaveData, getUpdateDictData } from '@/api/system/dict/index';

interface FormData {
  id: any;
  name: string;
  type: string;
  status: any;
  remark: string;
}

export default defineComponent({
  name: 'DictUpdateOrAdd',
  props: {
    modalVisible: {
      type: Boolean,
    },
  },
  setup(props, context) {
    const formRef = ref();
    const visible = ref<boolean>(false);
    const formData: UnwrapRef<FormData> = reactive({
      id: 0,
      name: '',
      type: '',
      status: 0,
      remark: '',
    });
    /**
     * 新增 or 修改  弹窗
     * @param id
     */
    const handleModalAddOrUpdate = (id: any) => {
      formData.id = id || 0;
      visible.value = true;
      nextTick(() => {
        formRef.value.resetFields();
      });
      if (formData.id) {
        // 点击 修改 获取弹窗数据
        getUpdateDictData({ id: formData.id }).then((res: any) => {
          const data = res.data;
          formData.id = data.data.id;
          formData.name = data.data.name;
          formData.type = data.data.type;
          formData.status = data.data.status;
          formData.remark = data.data.remark;
        });
      }
    };
    /** handle close */
    const handleClose = () => {
      // 通过事件传过去
      visible.value = false;
      context.emit('close');
    };
    /** 表单提交 */
    const onSubmitFormData = () => {
      const params = {
        id: formData.id,
        name: formData.name,
        type: formData.type,
        status: formData.status,
        remark: formData.remark,
      };
      if (formData.id) {
        // 修改 保存
        getDictUpdateSaveData(params).then(() => {
          visible.value = false;
          message.success('操作成功');
          context.emit('refreshTableData');
        });
      } else {
        // 新增 保存
        getDictAddSaveData(params).then(() => {
          visible.value = false;
          message.success('操作成功');
          context.emit('refreshTableData');
        });
      }
    };
    return {
      labelCol: { style: { width: '70px' } },
      formRef,
      visible,
      formData,
      handleModalAddOrUpdate,
      handleClose,
      onSubmitFormData,
    };
  },
});
</script>

<template>
  <a-modal
    v-model:visible="visible"
    style="width: 40%"
    :title="!formData.id ? $t('新增') : $t('编辑')"
    :confirm-loading="$isPending()"
    :mask-closable="false"
    @ok="onSubmitFormData()"
    @cancel="handleClose">
    <a-form ref="formRef" :model="formData" :label-col="labelCol">
      <a-form-item :label="$t('字典名称')" name="name">
        <a-input v-model:value="formData.name" :placeholder="$t('请输入字典名称')" />
      </a-form-item>
      <a-form-item :label="$t('字典类型')" name="type">
        <a-input v-model:value="formData.type" :disabled="formData.id ? true : false" :placeholder="$t('请输入参数名称')" />
      </a-form-item>
      <a-form-item :label="$t('状态')" name="status">
        <a-radio-group v-model:value="formData.status">
          <a-radio :value="0">
            {{ $t('开启') }}
          </a-radio>
          <a-radio :value="1">
            {{ $t('关闭') }}
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label="$t('备注')" name="remark">
        <a-textarea v-model:value="formData.remark" :placeholder="$t('请输入备注内容')" />
      </a-form-item>
      <!--      <a-form-item> -->
      <!--        <a-button @click="onSubmitFormData()" type="primary" style="float: right;margin-left: 10px">确定</a-button> -->
      <!--        <a-button style="float: right" @click="handleClose">取消</a-button> -->
      <!--      </a-form-item> -->
    </a-form>
    <template #footer>
      <a-button type="primary" @click="onSubmitFormData">
        {{ $t('确定') }}
      </a-button>
      <a-button @click="handleClose">
        {{ $t('取消') }}
      </a-button>
    </template>
  </a-modal>
</template>

<style scoped></style>
