# 样式 <Badge type="info" text="待完善" />

- `.ant-tabs`
  - `.wei-round-button-tabs`: 圆角按钮样式的 `tab`, 参考原型图: https://modao.cc/app/Xwfn35xbrs1zuvUaX9X8mi#screen=slfrv1pp2p6w1au
- `.ant-card`
  - `.inner-card`

## 滚动条
> 框架提供了滚动条样式(`.wei-scrollbar`) 和 滚动条指令(`v-overlay-scrollbar`), 并且已经兼容 `dark` 模式

- `.wei-scrollbar`: 实现了简约的滚动条样式, 参考 `src/sheets/scrollbar.less`
- [v-overlay-scrollbar](http://10.0.11.29:8155/api.html#v-overlay-scrollbar-%E6%8C%87%E4%BB%A4): 基于 [OverlayScrollbars](https://kingsora.github.io/OverlayScrollbars/) 封装了滚动条指令, 滚动条默认不占据容器元素的宽度, 在鼠标离开容器时自动隐藏滚动条, 支持全局配置项, 参考 [文档](http://10.0.11.29:8155/api.html#v-overlay-scrollbar-%E6%8C%87%E4%BB%A4)
