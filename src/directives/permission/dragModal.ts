import type { App } from 'vue';
export function dragModal(app: App<Element>) {
  app.directive('dragModal', (el, binding, vnode) => {
    nextTick(() => {
      const { visible } = vnode.children[0] && vnode.children[0].props;
      if (!visible) return;
      const modal = el.querySelector('.ant-modal'); // 弹窗容器
      const header = el.querySelector('.ant-modal-header'); // 拖拽手柄（标题栏）
      if (!header) return;
      // 初始化样式：允许拖拽
      header.style.cursor = 'move';
      header.style.userSelect = 'none'; // 防止拖动时选中文字（解决“自动跟随”问题）
      modal.style.top = '10%';
      modal.style.left = '0.1%';
      // 获取元素原有属性
      const sty = (function () {
        if ((document.body as any).currentStyle) {
          return (dom: any, attr: any) => dom.currentStyle[attr]; // 兼容IE写法
        }
        return (dom: any, attr: any) => getComputedStyle(dom, null)[attr];
      })();
      // 左偏移距离
      let styL = sty(modal, 'left');
      if (styL === 'auto') {
        styL = '0px'; // 兼容IE写法
      }

      // 上偏移距离
      let styT = sty(modal, 'top');

      // 注意在IE中，第一次获取到的值为组件自带50%，移动之后赋值为px
      if (styL.includes('%')) {
        styL = +document.body.clientWidth * (+styL.replace(/%/g, '') / 100);
        styT = +document.body.clientHeight * (+styT.replace(/%/g, '') / 100);
      } else {
        styL = +styL.replace(/px/g, '');
        styT = +styT.replace(/px/g, '');
      }
      // 记录初始位置与鼠标坐标
      let startX, startY, initialLeft, initialTop;
      // 鼠标按下：开始拖拽
      const handleMouseDown = e => {
        startX = e.pageX;
        startY = e.pageY;
        // parseInt(modal.style.top)
        // parseInt(modal.style.left)
        initialLeft = styL || 0;
        initialTop = styT || 0;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      };

      // 鼠标移动：调整弹窗位置
      const handleMouseMove = e => {
        const deltaX = e.pageX - startX;
        const deltaY = e.pageY - startY;
        modal.style.left = `${initialLeft + deltaX}px`;
        modal.style.top = `${initialTop + deltaY}px`;
      };

      // 鼠标松开：结束拖拽
      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      // 绑定标题栏的鼠标按下事件
      header.addEventListener('mousedown', handleMouseDown);
      // if (!vnode.children[0].props.visible) {
      //   header.removeEventListener('mousedown', handleMouseDown);
      // }
    });
  });
}
