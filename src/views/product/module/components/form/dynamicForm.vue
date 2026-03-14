<script lang="ts">
import { defineComponent, ref, watch, PropType } from 'vue';
// 定义模式列表项的类型（TypeScript接口）
interface ModeTypeItem {
  id: string | number;
  name: string;
}
export default defineComponent({
  name: 'dynamicForm', // 组件名（ PascalCase 规范）
  // 定义Props（TypeScript类型强化）
  props: {
    modeTypeList: {
      type: Array as PropType<ModeTypeItem[]>, // 明确数组元素类型
      required: true,
      default: () => [],
    },
    modeTypeVal: {
      type: String,
      default: '',
    },
    redFlag: {
      type: Boolean,
      default: false,
    },
    labelWidth: {
      type: Number,
      default: 50, // 单位：px（模板中转为字符串）
    },
    prop: {
      type: String,
      required: true, // 表单校验的字段名（对应a-form-item的name）
    },
    label: {
      type: String,
      default: '',
    },
    type: {
      type: Number, // 原逻辑中用type == 1判断，改为Number更准确
      default: 0, // 默认输入框类型
    },
    typeKey: {
      type: String,
      default: '',
    },
    inputWidth: {
      type: Number,
      default: 192, // 输入框宽度（单位：px）
    },
  },
  // 定义Emit事件类型（TypeScript类型提示）
  emits: {
    onEnter: () => true, // 无参数事件
    inputChange: (newData: string, typeKey: string) => true, // 带参数事件（需验证参数类型）
  },
  setup(props, { emit }) {
    const labelCol = ref({ style: { width: '120px' } });
    // 响应式变量（替代原data）
    const newModeTypeVal = ref(props.modeTypeVal);

    // 监听modeTypeVal变化（同步父组件传入的值）
    watch(
      () => props.modeTypeVal,
      newVal => {
        newModeTypeVal.value = newVal;
      },
      { immediate: true, deep: true }, // 立即执行 + 深度监听
    );

    // 监听newModeTypeVal变化（触发inputChange事件）
    watch(newModeTypeVal, (newData, oldData) => {
      if (newData !== oldData) {
        emit('inputChange', newData, props.typeKey);
      }
    });

    // 处理回车键事件（触发onEnter事件）
    const onEnter = () => {
      emit('onEnter');
    };

    // 暴露给模板的变量/方法
    return {
      labelCol,
      newModeTypeVal,
      onEnter,
    };
  },
});
</script>

<template>
  <div>
    <a-form ref="formRef" layout="vertical" style="display: flex; flex-wrap: wrap" :label-col="labelCol">
      <a-form-item :label="label" :label-width="`${labelWidth}px`" :name="prop" style="word-break: break-all">
        <template v-if="type === 2">
          <a-select v-model:value="newModeTypeVal" :disabled="redFlag" :style="{ width: '200px' }" placeholder="请选择" allowClear>
            <a-select-option v-for="item in modeTypeList" :key="item.id" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </template>
        <template v-else>
          <a-input v-model:value="newModeTypeVal" :disabled="redFlag" :style="{ width: `200px` }" placeholder="请输入" allowClear @keyup.enter="onEnter" />
        </template>
      </a-form-item>
    </a-form>
  </div>
</template>
<style scoped>
/* AntD 表单项标签样式 */
.ant-form-item-label {
  padding: 10px 0 !important;
  min-width: 84px !important; /* 最小宽度（覆盖默认样式） */
}

/* AntD 表单项内容区域样式 */
.ant-form-item-control {
  margin-left: 85px !important; /* 与标签的间距（需与label-width配合） */
}
</style>
