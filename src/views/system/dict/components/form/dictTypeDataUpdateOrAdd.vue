<script lang="ts">
import { defineComponent, nextTick, readonly, ref } from 'vue';
import { message } from 'ant-design-vue';
import type { DictDataVO } from '@/api/system/dict/dict.data';
import { createDictData, getDictData, updateDictData } from '@/api/system/dict/dict.data';

type FormData = Partial<DictDataVO>;

export default defineComponent({
  name: 'DictUpdateOrAdd',
  props: {
    dictType: {
      type: String,
      required: true,
    },
    modalVisible: {
      type: Boolean,
    },
  },
  setup(props, context) {
    const formRef = ref();
    const visible = ref<boolean>(false);
    const formData = ref<FormData>({
      id: undefined,
      sort: undefined,
      label: '',
      value: '',
      dictType: props.dictType,
      status: 0,
      colorType: '',
      cssClass: '',
      remark: '',
    });
    // 数据标签回显样式
    const colorTypeOptions = readonly([
      {
        value: 'default',
        label: '默认',
      },
      {
        value: 'primary',
        label: '主要',
      },
      {
        value: 'success',
        label: '成功',
      },
      {
        value: 'info',
        label: '信息',
      },
      {
        value: 'warning',
        label: '警告',
      },
      {
        value: 'danger',
        label: '危险',
      },
    ]);
    /**
     * 新增 or 修改  弹窗
     * @param id
     */
    const handleModalAddOrUpdate = (id: any, row: any) => {
      formData.value.id = id;
      visible.value = true;
      nextTick(() => {
        formRef.value.resetFields();
      });
      if (formData.value.id) {
        // 点击 修改 获取弹窗数据
        getDictData(formData.value.id).then((res: any) => {
          const data = res.data;
          formData.value = data.data;
        });
      } else {
        formData.value.cssClass = row.name;
        formData.value.dictType = row.type;
      }
    };
    /** handle close */
    const handleClose = () => {
      // 通过事件传过去
      visible.value = false;
      context.emit('close');
    };
    /** 表单提交 */
    const onSubmitFormData = async () => {
      await formRef.value?.validate();
      const params = formData.value;
      if (formData.value.id) {
        // 修改 保存
        updateDictData(params as any).then(() => {
          visible.value = false;
          message.success('操作成功');
          context.emit('refreshTableData');
        });
      } else {
        // 新增 保存
        createDictData(params as DictDataVO).then(() => {
          visible.value = false;
          message.success('操作成功');
          context.emit('refreshTableData');
        });
      }
    };
    return {
      colorTypeOptions,
      labelCol: { style: { width: '100px' } },
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
    :mask-closable="false"
    style="width: 45%"
    :title="$t(!formData.id ? '新增' : '编辑')"
    :confirm-loading="$isPending()"
    @ok="onSubmitFormData()"
    @cancel="handleClose">
    <a-form ref="formRef" :model="formData" :label-col="labelCol">
      <a-form-item label="字典名称" name="cssClass" :rules="[{ required: true, message: `${$t('请输入')}字典名称` }]">
        <a-input v-model:value="formData.cssClass" :placeholder="`${$t('请输入')}字典名称`" />
      </a-form-item>
      <a-form-item :label="$t('字典类型')" name="dictType" :rules="[{ required: true, message: `${$t('请输入')}字典类型` }]">
        <a-input v-model:value="formData.dictType" :placeholder="$t('请输入字典类型')" />
      </a-form-item>
      <a-form-item :label="$t('字典标签')" name="label" :rules="[{ required: true, message: `${$t('请输入')}字典标签` }]">
        <a-input v-model:value="formData.label" :placeholder="$t('请输入字典标签')" />
      </a-form-item>
      <a-form-item :label="$t('字典键值')" name="value" :rules="[{ required: true, message: `${$t('请输入')}字典键值` }]">
        <a-input v-model:value="formData.value" :placeholder="$t('请输入字典键值')" />
      </a-form-item>
      <a-form-item :label="$t('字典排序')" name="sort" :rules="[{ required: true, message: `${$t('请输入')}字典排序` }]">
        <a-input v-model:value="formData.sort" type="number" :min="0" :placeholder="$t('请输入字典排序')" />
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
      <a-form-item :label="$t('颜色类型')" name="colorType">
        <a-select v-model:value="formData.colorType" :placeholder="$t('请选择颜色类型')" style="max-width: 200px" show-search>
          <a-select-option v-for="item in colorTypeOptions" :key="item.value" :value="item.value">
            {{ item.label }}
          </a-select-option>
        </a-select>
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
