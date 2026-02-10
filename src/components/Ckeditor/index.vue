<script lang="ts" setup>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-vue';
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn';
import MyUploadAdapter from './uploadAdapter';

// const props = defineProps(['initContentSon', 'initDataListSon',])
const props = defineProps({
  initContentSon: {
    require: false,
    type: Boolean,
    default: false,
  },
  initDataListSon: {
    require: false,
    type: Boolean,
    default: false,
  },

  /** 富文本高度 */
  height: {
    require: false,
    type: String,
    default: '240',
  },
  disabled: {
    require: false,
    type: Boolean,
    default: false,
  },
});
const editor = ref(ClassicEditor);
const editorData = ref('');
const editorConfig = ref({
  language: 'zh-cn',
  mediaEmbed: {
    providers: [
      {
        name: 'myprovider',
        url: [/^lizzy.*\.com.*\/media\/(\w+)/, /^www\.lizzy.*/, /^.*/],
        html: match => {
          // 获取媒体url
          const input = match.input;
          // console.log(input, 'input')
          // console.log('input' + match['input']);
          return (
            '<div style="position: relative; padding-bottom: 100%; height: 0; padding-bottom: 70%;">' +
            `<iframe src="${input}" ` +
            'style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" ' +
            'frameborder="0" allowtransparency="true" allow="encrypted-media">' +
            '</iframe>' +
            '</div>'
          );
        },
      },
    ],
  },
});

document.querySelectorAll('oembed[url]').forEach(element => {
  const videoLable = document.createElement('video');

  videoLable.setAttribute('src', element.getAttribute('url'));
  videoLable.setAttribute('controls', 'controls');
  videoLable.setAttribute('style', ' width: 100%;height: 100%; ');

  element.appendChild(videoLable);
});

function onReady(editor: any) {
  document.documentElement.style.setProperty('--ck-height', `${props.height}px`);
  // 自定义上传图片插件
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new MyUploadAdapter(loader);
  };
}

function setData(val: any) {
  editorData.value = val;
}

function getData() {
  return editorData.value;
}

watch(
  () => props.initContentSon,
  (newValue, oldValue) => {
    // setData(props.initContentSon)

    sessionStorage.setItem('initDataList', JSON.stringify(props.initDataListSon));
  },
  { deep: true }
);

defineExpose({ setData, getData });
</script>

<template>
  <div id="ck-editer">
    <Ckeditor v-model="editorData" :disabled="disabled" :editor="editor" class="ck" :config="editorConfig" @ready="onReady" />
  </div>
</template>

<style lang="less">
/* 全局修改生效 */
#ck-editer {
  .ck.ck-editor__editable_inline {
    p {
      line-height: 1.5;
    }
    // min-height: 240px;
    height: var(--ck-height);
    // max-height: 240px;
  }
  // 版权隐藏
  :deep(.ck-body-wrapper .ck-balloon-panel .ck-powered-by) {
    display: none !important;
  }
  :deep(.table) {
    margin: 0 auto;
    th {
      border-collapse: collapse;
      border: 1px solid black;
      background-color: #ededed;
    }
    td {
      border-collapse: collapse;
      border: 1px solid black;
    }
  }
}
</style>
