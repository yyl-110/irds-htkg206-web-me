<script lang="ts" setup>
import { reactive, ref } from 'vue';
// import { OpenApiActions } from '@wei/openapi-codegen/es/src/OpenApiTags'
import { cloneDeep } from 'lodash-es';
import { WeiSchemaForm, WeiSchemaModal, WeiSchemaTable } from '@/wei-components';
import { AdminApiSystemUser } from '@/api/tags/管理后台用户'; // tag class
import type { UserPageRequestDTOModel } from '@/api/models/UserPageRequestDTOModel'; // 分页请求的请求参数 Model
import type { UserPageItemResponseDTOModel } from '@/api/models/UserPageItemResponseDTOModel'; // 分页请求返回值中每一项的 Model
import type { UserCreateRequestDTOModel } from '@/api/models/UserCreateRequestDTOModel'; // 创建资源请求请求参数的 Model
import type { UserUpdateRequestDTOModel } from '@/api/models/UserUpdateRequestDTOModel'; // 更新资源请求请求参数的 Model
import getParamsSchema from '@/api/ui-schemas/UserPageRequestDTO'; // 分页请求请求参数的 UI Schema
import getResourceSchema from '@/api/ui-schemas/UserPageItemResponseDTO'; // 分页请求返回值中每一项的 UI Schema
import getCreateSchema from '@/api/ui-schemas/UserCreateRequestDTO'; // 创建资源请求请求参数的 UI Schema
import getUpdateSchema from '@/api/ui-schemas/UserUpdateRequestDTO'; // 更新资源请求请求参数的 UI Schema
import { BaseSchemaPage } from '@/api/BaseSchemaPage';
import { encryptValue } from '@/utils/AES';

/** 分页请求参数的 UI Scheam */
const paramsSchema = reactive(getParamsSchema());
/** 当前资源的 UI Schema */
const resourceSchema = reactive(getResourceSchema());
/** 创建资源的 UI Schema */
const createSchema = reactive(getCreateSchema());
/** 更新资源的 UI Schema */
const updateSchema = reactive(getUpdateSchema());

/** 当前页面数据处理类实例 */
const page = new BaseSchemaPage<UserPageRequestDTOModel, UserPageItemResponseDTOModel, UserCreateRequestDTOModel, UserUpdateRequestDTOModel>(
  AdminApiSystemUser.$tagName, // 资源名称
  paramsSchema,
  resourceSchema,
  AdminApiSystemUser.getUserPage, // 资源分页请求方法
  createSchema,
  AdminApiSystemUser.createUser, // 创建资源请求方法
  updateSchema,
  AdminApiSystemUser.updateUser, // 更新资源请求方法
  undefined, // ID 字段名
  AdminApiSystemUser.deleteUser1 // 删除资源请求方法
);

const createModalProps = page.generateCreateModalProps();
const updateModalProps = page.generateUpdateModalProps();

/** 创建资源表单 ref */
const createFormRef = ref();
page.createFormRef = createFormRef;
/** 更新资源表单 ref */
const updateFormRef = ref();
page.updateFormRef = updateFormRef;

page.onBeforeCreate = (record: UserCreateRequestDTOModel) => {
  const params = cloneDeep(record);
  params.isAd = undefined;
  params.password = encryptValue(params.password);
  return params;
};

page.getResources(); // 发起分页请求
</script>

<template>
  <!-- 查询表单 -->
  <WeiSchemaForm v-bind="paramsSchema" :schema-action-type="OpenApiActions.page" @submit="page.getResources(true)" @create="page.toCreate()" />

  <!-- 数据表格 -->
  <WeiSchemaTable v-bind="resourceSchema">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === '$$action'">
        <a-button type="link" @click="page.toUpdate(record)"> edit </a-button>
        <a-button type="link" danger @click="page.toDelete(record)"> delete </a-button>
      </template>
    </template>
  </WeiSchemaTable>

  <!-- 新增弹窗 -->
  <WeiSchemaModal v-if="createModalProps" v-bind="createModalProps">
    <WeiSchemaForm
      ref="createFormRef"
      v-bind="createSchema"
      :schema-action-type="OpenApiActions.create"
      @submit="page.createResource()"
      @cancel="createModalProps.visible = false" />
  </WeiSchemaModal>

  <!-- 编辑弹窗 -->
  <WeiSchemaModal v-if="updateModalProps" v-bind="updateModalProps">
    <WeiSchemaForm
      ref="updateFormRef"
      v-bind="updateSchema"
      :schema-action-type="OpenApiActions.update"
      @submit="page.updateResource()"
      @cancel="updateModalProps.visible = false" />
  </WeiSchemaModal>
</template>
