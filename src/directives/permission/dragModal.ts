import type { App, Directive } from 'vue';

const DRAG_STYLE_ID = 'global-modal-draggable-style';
const DRAG_LISTENER_FLAG = '__global_modal_drag_listener_installed__';

function parseTranslate(target: HTMLElement): { x: number; y: number } {
  const transform = target.style.transform || '';
  const match = transform.match(/translate\(\s*(-?\d+(?:\.\d+)?)px,\s*(-?\d+(?:\.\d+)?)px\)/);
  if (!match) return { x: 0, y: 0 };
  return {
    x: Number(match[1] || 0),
    y: Number(match[2] || 0),
  };
}

function installGlobalStyle() {
  if (document.getElementById(DRAG_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = DRAG_STYLE_ID;
  style.textContent = `
    .ant-modal-header {
      cursor: move;
      user-select: none;
    }
  `;
  document.head.appendChild(style);
}

function installGlobalDragListener() {
  const key = DRAG_LISTENER_FLAG as keyof Window;
  if (window[key]) return;
  window[key] = true;

  document.addEventListener('mousedown', event => {
    if (event.button !== 0) return;

    const header = (event.target as HTMLElement | null)?.closest('.ant-modal-header') as HTMLElement | null;
    if (!header) return;
    if ((event.target as HTMLElement | null)?.closest('.ant-modal-close')) return;

    const modalContent = header.closest('.ant-modal-content') as HTMLElement | null;
    if (!modalContent) return;

    const { x: startTranslateX, y: startTranslateY } = parseTranslate(modalContent);
    const startX = event.clientX;
    const startY = event.clientY;

    const previousUserSelect = document.body.style.userSelect;
    document.body.style.userSelect = 'none';

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      modalContent.style.transform = `translate(${startTranslateX + deltaX}px, ${startTranslateY + deltaY}px)`;
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = previousUserSelect;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  });
}

export function dragModal(app: App<Element>) {
  installGlobalStyle();
  installGlobalDragListener();

  // 保留旧指令名兼容历史模板；拖拽能力已由全局监听统一处理。
  const compatibleDirective: Directive = {
    mounted() {},
    updated() {},
  };
  app.directive('dragModal', compatibleDirective);
}
