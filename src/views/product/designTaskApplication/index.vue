<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue';
import { usePlatformPickerDrawerLifecycle } from '@/composables/usePlatformPickerDrawerLifecycle';
import {
  consumeSkipPlatformPickerDrawerOnTab,
  createPlatformPickerDrawerStyle,
  normalizePlatformPickerList,
  shouldAutoSelectSinglePlatform,
} from '@/utils/platformPickerDrawerNav';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { fetchPlatformPickerList } from '@/utils/platformPickerList';
import { PermissionAssignUsersRoleRequestDTOmenuModel } from '@/api/models/menu/PermissionAssignUsersRoleRequestDTOmenuModel';
import { ProductModuleTreeInfoRequestDTOModel } from '@/api/models/product/ProductModuleTreeInfoRequestDTOModel';
import { useUserStore } from '@/store/modules/user';
import { useLayoutStore } from '@/store/modules/layout/layout';
import ProjectInfoList from './components/index.vue';
import ProductPlatformPicker from '@/components/ProductPlatformPicker/index.vue';
const PROJECT_LIST_SKIP_DRAWER_ON_RETURN = 'project-info-list-skip-drawer-on-return';

const layoutStore = useLayoutStore();
const router = useRoute();
const loadingTree = ref<boolean>(false);
const userStore = useUserStore();
const titleVisible = ref<boolean>(false);
const shouldShowDrawer = ref<boolean>(false);
const projectListVisible = ref<boolean>(false);
const titleList = ref<any>([]);
const designTaskComRef = ref();
const menuId = ref<string>('');
const drawerStyle = ref<any>({
  marginLeft: '201px',
  marginTop: '0px',
  width: 'calc(100% - 201px)',
  height: 'calc(100vh)',
});
function resetDrawerStyle() {
  drawerStyle.value = {};
}

/** 列表请求参数 */
const requestParams = reactive(new PermissionAssignUsersRoleRequestDTOmenuModel());
requestParams.condition = undefined;
const treeRequestParams = reactive(new ProductModuleTreeInfoRequestDTOModel());
treeRequestParams.creator = userStore.getUser.id;

/** 新功能----------------------------------------------------- */
const updateMenu = async (item: any) => {
  menuId.value = item.id;
  projectListVisible.value = true;
  onClose();
  await nextTick();
  designTaskComRef.value?.initInfoList(menuId.value, item.categoryName);
};

/** 获取分类数据 */
async function getMenuListData(options?: { forceOpenDrawer?: boolean }) {
  try {
    titleList.value = await fetchPlatformPickerList({ force: options?.forceOpenDrawer });
    const skipDrawerOnReturn = sessionStorage.getItem(PROJECT_LIST_SKIP_DRAWER_ON_RETURN) === '1';
    if (skipDrawerOnReturn) {
      sessionStorage.removeItem(PROJECT_LIST_SKIP_DRAWER_ON_RETURN);
      if (titleList.value.length > 0) {
        shouldShowDrawer.value = false;
        menuId.value = titleList.value[0].id;
        titleVisible.value = false;
        projectListVisible.value = true;
        resetDrawerStyle();
        await nextTick();
        designTaskComRef.value?.initInfoList(menuId.value, titleList.value[0].categoryName);
      }
      return;
    }
    if (!options?.forceOpenDrawer && consumeSkipPlatformPickerDrawerOnTab()) {
      shouldShowDrawer.value = false;
      titleVisible.value = false;
      resetDrawerStyle();
      if (menuId.value) {
        projectListVisible.value = true;
        return;
      }
      if (titleList.value.length > 0) {
        menuId.value = titleList.value[0].id;
        projectListVisible.value = true;
        await nextTick();
        designTaskComRef.value?.initInfoList(menuId.value, titleList.value[0].categoryName);
      }
      return;
    }
    if (shouldAutoSelectSinglePlatform(titleList.value)) {
      shouldShowDrawer.value = false;
      await updateMenu(titleList.value[0]);
      return;
    }
    projectListVisible.value = false;
    drawerStyle.value = createPlatformPickerDrawerStyle(layoutStore.asideWidthStyle);
    shouldShowDrawer.value = true;
    titleVisible.value = true;
  } catch (error) {
    console.error('获取平台分类失败:', error);
  }
}
function onClose() {
  resetDrawerStyle();
  titleVisible.value = false;
}

onMounted(() => {
  drawerStyle.value = createPlatformPickerDrawerStyle(layoutStore.asideWidthStyle);
});

usePlatformPickerDrawerLifecycle(getMenuListData, {
  onTabSkip: () => {
    shouldShowDrawer.value = false;
    titleVisible.value = false;
    resetDrawerStyle();
    if (menuId.value)
      projectListVisible.value = true;
  },
});
</script>

<template>
  <div class="drawerContent h-full">
    <ProjectInfoList v-if="projectListVisible" ref="designTaskComRef" :menuId="menuId" />
  </div>
  <ProductPlatformPicker
    v-if="shouldShowDrawer"
    :visible="titleVisible"
    :drawer-style="drawerStyle"
    :list="titleList"
    @select="updateMenu"
    @close="onClose" />
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
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
  background-color: #ffffff !important;
  overflow: hidden;
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
  overflow: hidden;
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
