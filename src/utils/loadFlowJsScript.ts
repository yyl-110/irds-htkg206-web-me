import { getJsContent } from '@/api/flowData/flowData';

const LOADED_ATTR = 'data-flow-js-filename';

/** 移除已注入的流程 JS（保存脚本后需重新加载） */
export function invalidateFlowJsScript(filename: string) {
  const name = String(filename ?? '').trim();
  if (!name) return;
  document.querySelectorAll(`script[${LOADED_ATTR}="${CSS.escape(name)}"]`).forEach(el => el.remove());
}

/**
 * 通过鉴权 API 拉取 JS 并注入执行。
 * 比 <script src> 更可靠：静态 /flow/*.js 往往无 Token 导致 401/404。
 */
export async function loadFlowJsScript(filename: string, userId: string): Promise<void> {
  const name = String(filename ?? '').trim();
  if (!name) {
    throw new Error('js filename is empty');
  }

  if (document.querySelector(`script[${LOADED_ATTR}="${CSS.escape(name)}"]`)) {
    return;
  }

  const response: any = await getJsContent({ filename: name, userid: userId });
  if (!response) {
    throw new Error('getJsContent: empty response');
  }
  if (String(response.code) !== '0') {
    throw new Error(String(response.msg ?? 'getJsContent failed'));
  }
  if (!response.data?.result) {
    throw new Error('getJsContent: result is false');
  }

  const content = String(response.data.data ?? '');
  if (!content.trim()) {
    throw new Error('js content is empty');
  }

  const script = document.createElement('script');
  script.setAttribute(LOADED_ATTR, name);
  script.textContent = content;
  document.head.appendChild(script);
}
