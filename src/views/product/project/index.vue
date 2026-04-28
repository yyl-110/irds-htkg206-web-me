<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { AdminApiSystemProduct } from '@/api/tags/product/产品平台后台';
import { WeiI18n } from '@/utils/WeiI18n';
import { PermissionAssignUsersRoleRequestDTOmenuModel } from '@/api/models/menu/PermissionAssignUsersRoleRequestDTOmenuModel';
import { ProductModuleTreeInfoRequestDTOModel } from '@/api/models/product/ProductModuleTreeInfoRequestDTOModel';
import { useUserStore } from '@/store/modules/user';
import { decryptValue } from '@/utils';
import { useLayoutStore } from '@/store/modules/layout/layout';
import ProjectInfoList from './components/ProjectInfoListAdm.vue';
const PROJECT_LIST_SKIP_DRAWER_ON_RETURN = 'project-info-list-skip-drawer-on-return';

const layoutStore = useLayoutStore();
const router = useRoute();
const loadingTree = ref<boolean>(false);
const userStore = useUserStore();
const titleVisible = ref<boolean>(false);
const shouldShowDrawer = ref<boolean>(false);
const titleList = ref<any>([]);
const ProjectInfoListRef = ref();
const menuId = ref<string>('');
const drawerStyle = ref<any>({
  marginLeft: '201px',
  marginTop: '0px',
  width: 'calc(100% - 201px)',
  height: 'calc(100vh)',
});

/** 列表请求参数 */
const requestParams = reactive(new PermissionAssignUsersRoleRequestDTOmenuModel());
requestParams.condition = undefined;
const treeRequestParams = reactive(new ProductModuleTreeInfoRequestDTOModel());
treeRequestParams.creator = userStore.getUser.id;

/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, getListData);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;

/** 列表数据 */
const dataSource = ref<Array<any>>([]);
/** 获取分类数据 */
async function getListData(type?: string) {
  loadingTree.value = true;
  try {
    let data: any = {};
    data.id = treeRequestParams.categoryId;
    const res = await AdminApiSystemProduct.getProductModuleTree(data);
    console.log(res);
    if (res.data.code == 200 && res.data.data) {
      loadingTree.value = false;
      const rawData = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
      dataSource.value = rawData[0];
    }
  } catch (error) {
    message.error('获取数据失败!');
  } finally {
    loadingTree.value = false;
  }
}

/** 新功能----------------------------------------------------- */
const updateMenu = async (item: any) => {
  menuId.value = item.id;
  onClose();
  ProjectInfoListRef.value.getResourcesByParent(menuId.value, item.categoryName);
};

/** 获取分类数据 */
async function getMenuListData() {
  try {
    const res = await AdminApiSystemProduct.getProjectTreeList();
    titleList.value = res.data.data;
    const skipDrawerOnReturn = sessionStorage.getItem(PROJECT_LIST_SKIP_DRAWER_ON_RETURN) === '1';
    if (skipDrawerOnReturn) {
      sessionStorage.removeItem(PROJECT_LIST_SKIP_DRAWER_ON_RETURN);
      if (Array.isArray(res.data.data) && res.data.data.length > 0) {
        shouldShowDrawer.value = false;
        menuId.value = res.data.data[0].id;
        titleVisible.value = false;
        drawerStyle.value = {};
        ProjectInfoListRef.value.getResourcesByParent(menuId.value, res.data.data[0].categoryName);
      }
      return;
    }
    if (res.data.data.length == 1) {
      shouldShowDrawer.value = false;
      titleVisible.value = false;
      drawerStyle.value = {};
      menuId.value = res.data.data[0].id;
      ProjectInfoListRef.value.getResourcesByParent(menuId.value, res.data.data[0].categoryName);
    } else {
      shouldShowDrawer.value = true;
      titleVisible.value = true;
    }
  } catch (error) {
    console.error('获取平台分类失败:', error);
  }
}
function onClose() {
  drawerStyle.value = {};
  titleVisible.value = false;
}

onMounted(() => {
  drawerStyle.value = {
    marginLeft: layoutStore.asideWidthStyle,
    marginTop: '0px',
    width: 'calc(100% - 241px)',
    height: 'calc(100vh)',
  };
  getMenuListData();
});
</script>

<template>
  <div class="drawerContent">
    <ProjectInfoList ref="ProjectInfoListRef" :menuId="menuId" @getListData="getListData" />
  </div>
  <a-drawer
    v-if="shouldShowDrawer"
    :title="`产品平台选择`"
    placement="left"
    :style="drawerStyle"
    :closable="false"
    :visible="titleVisible"
    :get-container="false"
    :wrap-style="{ position: 'absolute' }"
    @blur="onClose"
    @close="onClose">
    <div v-for="(item, index) in titleList" :key="index">
      <div style="display: flex; background-color: #ecf5ff; margin: 15px 10px 0 10px; border-radius: 10px; height: 60px; cursor: pointer" @click="updateMenu(item)">
        <img src="@/assets/images/jc.png" v-if="index == 0" alt="menu" style="width: 50px; height: 50px; margin: 5px" />
        <img src="@/assets/images/ct.png" v-else-if="index == 1" alt="menu" style="width: 50px; height: 50px; margin: 5px" />
        <img src="@/assets/images/hj.png" v-else alt="menu" style="width: 50px; height: 50px; margin: 5px" />
        <a-badge>
          <div class="menuLi">{{ item.categoryName }}</div>
        </a-badge>
      </div>
    </div>
  </a-drawer>
</template>

<style lang="less" scoped>
.example {
  position: absolute;
  top: 50%;
  left: 60%;
}
::v-deep(.splitpanes__splitter:after),
::v-deep(.splitpanes__splitter:before) {
  border-left: 1px solid #e6e7e9 !important;
}
::v-deep(.sbom > .splitpanes__splitter) {
  border-left: 1px solid #e6e7e9 !important;
}
::v-deep(.splitpanes.default-theme .splitpanes__pane) {
  background-color: #fff;
}
.splitpane-cls {
  border-top: 3px solid #ffffff !important;
}
.drawerContent {
  position: sticky;
  bottom: 20px !important;
  display: flex;
  background-color: #ffffff !important;
}
:deep(.marginstyle) {
  padding: 10px !important;
  padding-right: 5px !important;
  padding-bottom: 5px !important;
}

:deep(.ant-drawer-content-wrapper) {
  width: 480px !important;
}

:deep(.b-body) {
  height: calc(100vh - 125px);
  overflow: auto;
}
:deep(.ant-drawer-body) {
  padding: 2px;
}

.menuLi {
  display: inline-block;
  margin: 20px 0 0 10px;
  color: rgba(0, 0, 0, 0.85);
}
.menuLi:hover {
  transform: translateY(-2px);
  color: #165dff;
}
</style>
