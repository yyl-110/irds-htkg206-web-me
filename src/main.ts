import { createApp } from 'vue';
import 'ant-design-vue/dist/antd.variable.min.css';
import './sheets/tailwind.css';
import './sheets/index.css';
import { createPinia } from 'pinia';
import Antd from 'ant-design-vue';
import Vant from 'vant';
import 'vant/lib/index.css';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
// import { installOverlayScrollbar } from '@wei/vue-hooks'
import Iconify from '@purge-icons/generated';
import { CkeditorPlugin } from '@ckeditor/ckeditor5-vue';
import App from './App.vue';
import '@/plugins/svgIcon';
import requestPlugin from './plugins/request';
import { WeiI18n } from './utils/WeiI18n';
import 'reflect-metadata';
// import { includeWeiComponents } from './wei-components'
// 引入 wei-ui-vue 样式文件
// import 'wei-ui-vue/dist/styles/index.css';
// import { handleWeiUiVue } from './utils/handleWeiUiVue';
import httpRequest from './httpRequest';
import { treeDataTranslate } from './utils/TreeDataTranslate';
import VConsole from 'vconsole';

// 引入 Vue 自定义指令集并配置为全局属性

import { MovediyVueDirectives, diyVueDirectives } from '@/utils/diyVueDirectives';

// import 'ant-design-vue/dist/antd.less'
// import 'ant-design-vue/dist/antd.dark.less'
// import 'ant-design-vue/dist/antd.variable.min.css'

// 全局样式入口文件
import './sheets/index.less';
import { VueEchartsHandler } from './utils/echarts';
import { initRouteGrauds } from './router/guards';
import { WeiVxe } from './plugins/vxe';
import { router } from '@/router';
import { setupAuth } from '@/directives/index';
import { registerStore } from '@/store';
import { useProjectUiStore } from '@/store/modules/layout/projectUi';
import { initAccessTokenRefreshSchedule } from '@/utils/accessTokenRefresh';

import 'splitpanes/dist/splitpanes.css';
import 'animate.css';

const app = createApp(App);
// const vConsole = new VConsole()
// vConsole.destroy()
const pinia = createPinia();

// iconify 图标使用内网代理的地址
// if (import.meta.env.VITE_APP_ICONIFY_RESOURCES) {
//   Iconify.addAPIProvider('', {
//     resources: [import.meta.env.VITE_APP_ICONIFY_RESOURCES],
//   });
// }

pinia.use(piniaPluginPersistedstate);

WeiI18n.init(app);
app.use(pinia);
registerStore(); // 注册pinia状态库
useProjectUiStore().applyDomEffects();
app.use(router);
app.use(Antd);
app.use(Vant);
app.use(CkeditorPlugin);
app.use(diyVueDirectives);
app.use(MovediyVueDirectives);

// handleWeiUiVue(app); // 初始化 wei-ui-vue 组件库
app.provide('$http', httpRequest);
app.provide('treeDataTranslate', treeDataTranslate); // 全局挂载
setupAuth(app);

WeiVxe.init(app);
// installOverlayScrollbar(app, WeiTheme.overlayScrollbarsOptions);

VueEchartsHandler.init(app);
initRouteGrauds(router);

app.use(requestPlugin);
// app.component('VChart', VChart)
// includeWeiComponents(app)
app.mount('#app');
initAccessTokenRefreshSchedule();
