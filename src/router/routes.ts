import type { RouteRecordRaw } from 'vue-router'
import { UserOutlined, DashboardOutlined } from '@ant-design/icons-vue'
import { demoRoutes } from './demoRoutes'
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
    name: '/platformBoard',
    path: '/platformBoard',
    component: () => import('@/views/platformBoard/index.vue'),
    meta: {
      hidden: true,
      title: '平台看板',
      icon: DashboardOutlined,
      keepAlive: false,
    },
  },
  {
    name: 'PlatformBoardDemand',
    path: '/demand',
    component: () => import('@/views/platformBoard/subViews/Demand/index.vue'),
    meta: { hidden: true, title: '需求分析' },
  },
  {
    name: 'PlatformBoardBase',
    path: '/base',
    component: () => import('@/views/platformBoard/subViews/Base/index.vue'),
    meta: { hidden: true, title: '基础数据' },
  },
  {
    name: 'PlatformBoardProduct',
    path: '/product',
    component: () => import('@/views/platformBoard/subViews/Product/index.vue'),
    meta: { hidden: true, title: '产品定义' },
  },
  {
    name: 'PlatformBoardSystem',
    path: '/system',
    component: () => import('@/views/platformBoard/subViews/System/index.vue'),
    meta: { hidden: true, title: '系统设置' },
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
        component: () =>
          import('@/views/product/designTaskApplication/components/components/process-flow-app-detail.vue'),
        meta: {
          hidden: true,
          title: '设计任务应用',
          noCache: true,
        },
      },
      {
        path: 'design-task-app-workspace',
        name: 'DesignTaskAppWorkspace',
        component: () =>
          import('@/views/product/designTaskApplication/components/components/process-flow-app-workspace.vue'),
        meta: {
          hidden: true,
          title: '设计任务应用页面',
          noCache: true,
        },
      },
      {
        path: 'product-temp-wbs',
        name: 'ProductTempWbsStructure',
        component: () => import('@/views/product/productTemp/wbs-structure.vue'),
        meta: {
          hidden: true,
          title: 'WBS结构',
          noCache: true,
        },
      },
    ],
  },
  {
    path: '/bpm',
    component: () => import('@/views/Main.vue'),
    name: 'bpm',
    meta: {
      hidden: true,
      title: '流程管理',
    },
    children: [
      {
        path: 'manager/model/create',
        component: () => import('@/views/bpm/model/form/index.vue'),
        name: 'BpmModelCreate',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '创建流程',
          activeMenu: '/bpm/model',
        },
      },
      {
        path: 'manager/model/:type/:id',
        component: () => import('@/views/bpm/model/form/index.vue'),
        name: 'BpmModelUpdate',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '修改流程',
          activeMenu: '/bpm/model',
        },
      },
      {
        path: 'manager/form/edit',
        component: () => import('@/views/bpm/form/editor/index.vue'),
        name: 'BpmFormEditor',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '设计流程表单',
          activeMenu: '/manager/form/edit',
        },
      },
      {
        path: 'process-instance/detail',
        component: () => import('@/views/bpm/processInstance/detail/index.vue'),
        name: 'BpmProcessInstanceDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '流程详情',
          activeMenu: '/bpm/task/my',
        },
        props: route => ({
          id: route.query.id,
          taskId: route.query.taskId,
          activityId: route.query.activityId,
        }),
      },
      {
        path: 'manager/definition',
        component: () => import('@/views/bpm/model/definition/index.vue'),
        name: 'BpmProcessDefinition',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '流程历史',
          activeMenu: '/bpm/manager/category',
        },
      },
      {
        path: 'process-instance/report',
        component: () => import('@/views/bpm/processInstance/report/index.vue'),
        name: 'BpmProcessInstanceReport',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '数据报表',
          activeMenu: '/bpm/manager/model',
        },
      },
      // ------------------------
      {
        path: 'manager/user-group',
        component: () => import('@/views/bpm/group/index.vue'),
        name: 'UserGroup',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '用户分组',
          activeMenu: '/bpm/manager/user-group',
        },
      },
      {
        path: 'manager/process-listener',
        component: () => import('@/views/bpm/processListener/index.vue'),
        name: 'ProcessListener',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '流程监听器',
          activeMenu: '/bpm/manager/process-listener',
        },
      },
      {
        path: 'manager/process-expression',
        component: () => import('@/views/bpm/processExpression/index.vue'),
        name: 'ProcessExpression',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '流程表达式',
          activeMenu: '/bpm/manager/process-expression',
        },
      },

      {
        path: 'task/create',
        component: () => import('@/views/bpm/processInstance/create/index.vue'),
        name: 'TaskCreate',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '发起流程',
          activeMenu: '/bpm/task/create',
        },
      },
      {
        path: 'task/my',
        component: () => import('@/views/bpm/processInstance/index.vue'),
        name: 'My',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '我的流程',
          activeMenu: '/bpm/task/my',
        },
      },
      {
        path: 'task/todo',
        component: () => import('@/views/bpm/task/todo/index.vue'),
        name: 'Todo',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '我的任务',
          activeMenu: '/bpm/task/todo',
        },
      },
      {
        path: 'task/done',
        component: () => import('@/views/bpm/task/done/index.vue'),
        name: 'Done',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '已办任务',
          activeMenu: '/bpm/task/done',
        },
      },
      {
        path: 'task/copy',
        component: () => import('@/views/bpm/task/copy/index.vue'),
        name: 'Copy',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '抄送我的',
          activeMenu: '/bpm/task/copy',
        },
      },

      {
        path: 'oa/leave/create',
        component: () => import('@/views/bpm/oa/leave/create.vue'),
        name: 'OALeaveCreate',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '发起 OA 请假',
          activeMenu: '/bpm/oa/leave',
        },
      },
      {
        path: 'oa/leave/detail',
        component: () => import('@/views/bpm/oa/leave/detail.vue'),
        name: 'OALeaveDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '查看 OA 请假',
          activeMenu: '/bpm/oa/leave',
        },
      },
    ],
  },
]

// 当在开发环境或构建为 Demo 站点时加入 Demo 路由页面
if (['development', 'demo'].includes(import.meta.env.MODE)) routes.push(...demoRoutes)
