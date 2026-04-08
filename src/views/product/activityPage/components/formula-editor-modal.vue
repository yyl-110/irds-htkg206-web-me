<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';

const props = defineProps({
  visible: { type: Boolean, default: false },
  initialValue: { type: String, default: '' },
  zIndex: { type: Number, default: 1100 },
});

const emit = defineEmits<{
  'update:visible': [value: boolean];
  confirm: [value: string];
  'insert-parameter': [];
}>();

const formulaText = ref('');
const formulaFunctionValue = ref('');
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const caret = ref({ start: 0, end: 0 });

function cacheCaret() {
  const el = textareaRef.value;
  if (!el) return;
  caret.value = {
    start: el.selectionStart ?? 0,
    end: el.selectionEnd ?? 0,
  };
}
function placeCaret(pos: number) {
  nextTick(() => {
    const el = textareaRef.value;
    if (!el) return;
    el.focus();
    el.setSelectionRange(pos, pos);
    caret.value = { start: pos, end: pos };
  });
}
function insertText(snippet: string) {
  const text = formulaText.value ?? '';
  const start = Math.max(0, Math.min(caret.value.start, text.length));
  const end = Math.max(start, Math.min(caret.value.end, text.length));
  formulaText.value = `${text.slice(0, start)}${snippet}${text.slice(end)}`;
  placeCaret(start + snippet.length);
}
function insertOperator(op: string) {
  insertText(op);
}
function insertFunction(v: string) {
  if (!v) return;
  insertText(v);
  formulaFunctionValue.value = '';
}
function openParameterPicker() {
  emit('insert-parameter');
}
function handleOk() {
  emit('confirm', formulaText.value);
  emit('update:visible', false);
}
function handleClose() {
  emit('update:visible', false);
}
function getSelectPopupContainer() {
  return document.body;
}

watch(
  () => props.visible,
  v => {
    if (!v) return;
    formulaText.value = String(props.initialValue ?? '');
    formulaFunctionValue.value = '';
    nextTick(() => {
      const len = formulaText.value.length;
      placeCaret(len);
    });
  },
);

defineExpose({
  insertText,
});
</script>

<template>
  <a-modal :visible="visible" title="公式定义" :mask-closable="false" :width="1000" :footer="null" :z-index="zIndex" @update:visible="(v:boolean) => emit('update:visible', v)">
    <div class="formula-editor-wrap">
      <div class="formula-editor-toolbar">
        <a-button @click="insertOperator('+')">+</a-button>
        <a-button @click="insertOperator('-')">-</a-button>
        <a-button @click="insertOperator('*')">×</a-button>
        <a-button @click="insertOperator('/')">÷</a-button>
        <a-button @click="insertOperator('^')">^</a-button>
        <a-button @click="insertOperator('()')">( )</a-button>
        <span class="formula-editor-fx">fx：</span>
        <a-select
          :value="formulaFunctionValue"
          placeholder="请选择"
          style="width: 170px"
          :getPopupContainer="getSelectPopupContainer"
          :dropdown-style="{ zIndex: zIndex + 20 }"
          @change="(v: string) => insertFunction(v)">
          <a-select-option value="min()">min</a-select-option>
          <a-select-option value="max()">max</a-select-option>
          <a-select-option value="sum()">sum</a-select-option>
          <a-select-option value="size()">size</a-select-option>
          <a-select-option value="log()">log</a-select-option>
          <a-select-option value="log10()">log10</a-select-option>
          <a-select-option value="sin()">sin</a-select-option>
          <a-select-option value="cos()">cos</a-select-option>
          <a-select-option value="tan()">tan</a-select-option>
          <a-select-option value="atan()">atan</a-select-option>
          <a-select-option value="sinh()">sinh</a-select-option>
          <a-select-option value="cosh()">cosh</a-select-option>
          <a-select-option value="tanh()">tanh</a-select-option>
          <a-select-option value="rad()">rad</a-select-option>
          <a-select-option value="deg()">deg</a-select-option>
          <a-select-option value="abs()">abs</a-select-option>
          <a-select-option value="round()">round</a-select-option>
          <a-select-option value="floor()">floor</a-select-option>
          <a-select-option value="ceiling()">ceiling</a-select-option>
        </a-select>
        <a-button type="primary" @click="openParameterPicker">插入参数</a-button>
      </div>
      <textarea ref="textareaRef" v-model="formulaText" class="formula-editor-textarea" @click="cacheCaret" @keyup="cacheCaret" @select="cacheCaret" />
    </div>
    <div class="formula-editor-actions">
      <a-button type="primary" @click="handleOk">确定</a-button>
      <a-button @click="handleClose">关闭</a-button>
    </div>
  </a-modal>
</template>

<style scoped lang="less">
.formula-editor-wrap {
  width: 100%;
}
.formula-editor-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #dbdcdc;
  border-radius: 4px;
  flex-wrap: wrap;
}
.formula-editor-fx {
  margin-left: 8px;
  color: #333;
}
.formula-editor-textarea {
  width: 100%;
  min-height: 340px;
  margin-top: 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 10px;
  resize: vertical;
  font-size: 14px;
  line-height: 1.6;
}
.formula-editor-actions {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
