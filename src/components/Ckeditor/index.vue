<script lang="ts" setup>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-vue';
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn';
import MyUploadAdapter from './uploadAdapter';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { useUserStore } from '@/store/modules/user';

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
const userId = useUserStore().getUser.id;
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

function escapeHtmlForPaste(v: string): string {
  return v
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeClipboardTextForPaste(v: string): string {
  return String(v ?? '')
    .replace(/\u00a0/g, ' ')
    .replace(/\r\n/g, '\n');
}

function getPlainTextFromHtml(html: string): string {
  return String(html ?? '')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function insertPlainTextAsParagraphs(editor: any, text: string) {
  const lines = normalizeClipboardTextForPaste(text).split('\n');
  const htmlFromText = lines.map(line => `<p>${escapeHtmlForPaste(line) || '&nbsp;'}</p>`).join('');
  const viewFragment = editor.data.processor.toView(htmlFromText);
  const modelFragment = editor.data.toModel(viewFragment);
  editor.model.change(() => {
    editor.model.insertContent(modelFragment, editor.model.document.selection);
  });
}

function insertImageDataUrl(editor: any, dataUrl: string) {
  if (!dataUrl) return;
  editor.model.change((writer: any) => {
    const imageEl = writer.createElement('imageBlock', { src: dataUrl });
    editor.model.insertContent(imageEl, editor.model.document.selection);
  });
}

function insertImageUrl(editor: any, url: string) {
  if (!url) return;
  editor.model.change((writer: any) => {
    const imageEl = writer.createElement('imageBlock', { src: url });
    editor.model.insertContent(imageEl, editor.model.document.selection);
  });
}

function insertHtmlContent(editor: any, html: string) {
  const safeHtml = String(html ?? '').trim();
  if (!safeHtml) return;
  const viewFragment = editor.data.processor.toView(safeHtml);
  const modelFragment = editor.data.toModel(viewFragment);
  editor.model.change(() => {
    editor.model.insertContent(modelFragment, editor.model.document.selection);
  });
}

async function uploadImageFileAndGetUrl(file: File): Promise<string> {
  const res: any = await AdminApiSystemUploadFile.uploadFile({ file, userId, confidentialLevel: 1 });
  const code = res?.data?.code;
  if (!(code === 0 || code === '0')) return '';
  return String(res?.data?.fileUrl ?? '').trim();
}

async function uploadDataUrlImageAndGetUrl(dataUrl: string): Promise<string> {
  const src = String(dataUrl ?? '').trim();
  if (!src.startsWith('data:image/')) return '';
  const blob = await fetch(src).then(r => r.blob());
  const ext = (blob.type.split('/')[1] || 'png').replace(/[^a-zA-Z0-9]/g, '');
  const file = new File([blob], `pasted-${Date.now()}.${ext || 'png'}`, { type: blob.type || 'image/png' });
  return uploadImageFileAndGetUrl(file);
}

async function uploadPastedImageAndInsert(editor: any, file: File) {
  try {
    const url = await uploadImageFileAndGetUrl(file);
    if (!url) return;
    insertImageUrl(editor, url);
  } catch {
    // 失败时回退为 dataURL 预览，至少保证可见
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? '');
      if (result.startsWith('data:image/')) insertImageDataUrl(editor, result);
    };
    reader.readAsDataURL(file);
  }
}

function onReady(editor: any) {
  document.documentElement.style.setProperty('--ck-height', `${props.height}px`);
  // 自定义上传图片插件
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new MyUploadAdapter(loader);
  };
  // 兜底处理：高优先级接管 CKEditor 粘贴链路，修复 Word/WPS 文字/图片粘贴异常
  const viewDoc = editor?.editing?.view?.document;
  if (!viewDoc?.on) return;
  const takeoverPaste = (evt: any, data: any) => {
    evt?.stop?.();
    data?.preventDefault?.();
    if (data && editor?.data?.processor?.toView) {
      data.content = editor.data.processor.toView('');
    }
  };
  viewDoc.on(
    'clipboardInput',
    (evt: any, data: any) => {
      const dt = data?.dataTransfer;
      if (!dt) return;
      const files = Array.from(dt.files || []);
      const imageFile = files.find((f: any) => String(f?.type ?? '').startsWith('image/'));
      if (imageFile) {
        takeoverPaste(evt, data);
        void uploadPastedImageAndInsert(editor, imageFile as File);
        return;
      }
      const html = String(dt.getData('text/html') ?? '').trim();
      const text = normalizeClipboardTextForPaste(dt.getData('text/plain'));
      const hasImageInHtml = /<img[\s\S]*?>/i.test(html);
      if (hasImageInHtml) {
        takeoverPaste(evt, data);
        void (async () => {
          try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const images = Array.from(doc.querySelectorAll('img'));
            for (const img of images) {
              const src = String(img.getAttribute('src') ?? '').trim();
              if (!src) continue;
              let uploadedUrl = '';
              if (src.startsWith('data:image/')) {
                uploadedUrl = await uploadDataUrlImageAndGetUrl(src);
              } else {
                // 对于 http/https/file/cid 等来源，先尝试按原地址保留
                uploadedUrl = src;
              }
              if (uploadedUrl) img.setAttribute('src', uploadedUrl);
            }
            insertHtmlContent(editor, doc.body.innerHTML || html);
          } catch {
            if (text.trim()) insertPlainTextAsParagraphs(editor, text);
          }
        })();
        return;
      }
      if (!text.trim()) return;
      const htmlText = getPlainTextFromHtml(html);
      const looksLikeWordHtml = /class="?Mso|mso-|urn:schemas-microsoft-com|w:worddocument/i.test(html);
      if (!html || !htmlText || looksLikeWordHtml) {
        takeoverPaste(evt, data);
        insertPlainTextAsParagraphs(editor, text);
      }
    },
    { priority: 'high' },
  );
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

/* 全局隐藏 Powered by CKEditor（有时会挂在编辑器容器外层） */
.ck-powered-by,
.ck.ck-powered-by,
.ck.ck-balloon-panel.ck-powered-by-balloon,
.ck-body-wrapper .ck-powered-by {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
}
</style>
