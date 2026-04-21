import type { RouteRecordRaw } from 'vue-router';
import { UserOutlined } from '@ant-design/icons-vue';
import { demoRoutes } from './demoRoutes';
// import Main from '@/views/Main.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true,
      title: '登录页',
    },
  },

  {
    name: 'checkPassWord',
    path: '/checkPassWord',
    component: () => import('@/views/system/checkPassWord/index.vue'),
    meta: {
      hidden: true,
      title: '密码修改页',
    },
  },
  {
    name: 'sysReport',
    path: '/sysReport',
    component: () => import('@/views/Main.vue'),
    meta: {
      hidden: true,
      title: '报表页面',
    },
  },
  // {
  //   name: '/404',
  //   path: '/404',
  //   component: () => import('@/views/wei-demo/error/404.vue'),
  // },
  {
    // 空白页，刷新tab页时用来做中转
    path: '/_empty',
    name: '_empty',
    component: () => import('@/views/Main.vue'),
    children: [
      {
        path: '/_empty/index',
        name: '_empty/index',
        component: () => import('@/views/Empty.vue'),
      },
    ],
  },
  {
    name: '/home',
    path: '/home',
    component: () => import('@/views/Main.vue'),
    meta: {
      title: '首页',
      // icon: ExclamationCircleOutlined,
      keepAlive: false,
      hidden: true,
      alwaysShow: false,
    },
    children: [
      // {
      //   name: '/home-main/HomeMain',
      //   path: '/home-main/HomeMain',
      //   component: () => import('@/views/home-main/HomeMain.vue'),
      //   meta: {
      //     title: '首页',
      //     icon: UserOutlined,
      //     keepAlive: false,
      //   },
      // },
      {
        name: 'OuterSso',
        path: '/OuterSso',
        component: () => import('@/views/login/OuterSso.vue'),
        meta: {
          title: '首页',
          icon: UserOutlined,
          keepAlive: false,
        },
      },
      {
        name: '/home/workbench',
        path: '/home/workbench',
        component: () => import('@/views/workbench/index.vue'),
        meta: {
          title: '首页',
          icon: UserOutlined,
          keepAlive: false,
        },
      },
      // {
      //   name: '/home/taskFlow',
      //   path: '/home/taskFlow',
      //   component: () => import('@/views/Integdevelopment/taskInfo-management/index.vue'),
      //   meta: {
      //     title: '产品规划设计',
      //     icon: UserOutlined,
      //     keepAlive: false,
      //   },
      // },
      // {
      //   name: '/home/calcpage',
      //   path: '/home/calcpage',
      //   component: () => import('@/views/check/use/components/calcPage.vue'),
      //   meta: {
      //     title: '计算设计',
      //     icon: UserOutlined,
      //     keepAlive: false,
      //   },
      // },
    ],
  },
  /** 知识库：PDF 预览页（兼容 textCard 直接跳转） */
  {
    name: 'KnowledgePdfViewContainer',
    path: '/knowledge/pdfView',
    component: () => import('@/views/Main.vue'),
    meta: {
      hidden: true,
      title: 'PDF预览',
    },
    children: [
      {
        path: '',
        name: '/knowledge/pdfView',
        component: () => import('@/views/knowledge/pdfView.vue'),
        meta: {
          hidden: true,
          title: 'PDF预览',
          noCache: true,
        },
      },
    ],
  },

  {
    name: 'KnowledgeCreateTaskContainer',
    path: '/knowledge/taskMapDetail',
    component: () => import('@/views/Main.vue'),
    meta: {
      hidden: true,
      title: '知识学习',
    },
    children: [
      {
        path: '',
        name: '/knowledge/taskMapDetail',
        component: () => import('@/views/knowledge/createTaskMap.vue'),
        meta: {
          hidden: true,
          title: '知识学习',
          noCache: true,
        },
      },
    ],
  },
  {
    name: 'KnowledgeMgtCreateTaskContainer',
    path: '/knowledgemgt/createTaskMap',
    component: () => import('@/views/Main.vue'),
    meta: {
      hidden: true,
      title: '任务流程图创建',
    },
    children: [
      {
        path: '',
        name: '/knowledge/createTaskMap',
        component: () => import('@/views/product/knowledge/sys/createTaskMap.vue'),
        meta: {
          hidden: true,
          title: '任务流程图创建',
          noCache: true,
        },
      },
    ],
  },

  /** 不在菜单中展示：项目信息创建/编辑全页 */
  {
    name: 'InternalApp',
    path: '/internal',
    component: () => import('@/views/Main.vue'),
    meta: {
      hidden: true,
      title: '内部',
    },
    children: [
      {
        path: 'project-info-editor',
        name: 'ProductProjectEditor',
        component: () => import('@/views/product/project/components/form/ProjectInfoEditor.vue'),
        meta: {
          hidden: true,
          title: '项目信息创建',
          noCache: true,
        },
      },
      {
        path: 'design-task-app-detail',
        name: 'DesignTaskAppDetail',
        component: () => import('@/views/product/designTaskApplication/components/components/process-flow-app-detail.vue'),
        meta: {
          hidden: true,
          title: '设计任务应用',
          noCache: true,
        },
      },
    ],
  },
];

// 当在开发环境或构建为 Demo 站点时加入 Demo 路由页面
if (['development', 'demo'].includes(import.meta.env.MODE)) routes.push(...demoRoutes);
