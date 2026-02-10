<script lang="ts" setup>
import type { TableProps, FormInstance } from 'ant-design-vue';
import { ref } from 'vue';
import { Modal, Switch, message } from 'ant-design-vue';
import { WeiI18n } from '@/utils/WeiI18n';
import { useUserStore } from '@/store/modules/user';
import { RolePageRequestDTOModel } from '@/api/models/RolePageRequestDTOModel';
import { AdminApiSystemUser } from '@/api/tags/管理后台用户';
import { CommonStatusEnum } from '@/utils/constants';
const props = defineProps({
  /** 弹窗状态 */
  modalVisible: {
    require: false,
    type: Boolean,
    default: false,
  },
  userRow: {
    require: false,
    type: Object,
    default: '',
  },
});
const emit = defineEmits<{
  /** 点击取消按钮 */
  onClose: [visible: boolean];
}>();
const userData = reactive({
  userForm: {
    id: '',
    username: '',
    nickname: '',
    mobile: '',
  },
});
const userStore = useUserStore();
const formRef = ref<FormInstance>();
// eslint-disable-next-line jsdoc/check-indentation
/**  获取共同的 operation 操作属性  */
const operationWidth = computed<number>(() => {
  const root = document.querySelector(':root');
  const width = getComputedStyle(root).getPropertyValue('--main-operation1-width');
  return Number(width);
});
const abroadcolumns = ref([
  {
    title: WeiI18n.t('昵称').value,
    dataIndex: 'nickname',
    key: 'nickname',
    width: 230,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('手机号').value,
    dataIndex: 'mobile',
    key: 'mobile',
    width: 230,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('状态').value,
    dataIndex: 'status',
    key: 'status',
    width: 100,
    sortDirections: ['descend', 'ascend'],
    customRender: ({ record }) => {
      return h(Switch, {
        checked: Number(record.status) === CommonStatusEnum.ENABLE,
        onChange: () => {
          // 修改状态的二次确认
          const _text = record.status === CommonStatusEnum.ENABLE ? WeiI18n.t('启用').value : WeiI18n.t('停用').value;
          Modal.confirm({
            title: `确认要"${_text}""${record.nickname}"用户吗?`,
            okText: WeiI18n.t('确定').value,
            cancelText: WeiI18n.t('取消').value,
            async onOk() {
              // 发起修改状态
              await AdminApiSystemUser.updateaccount({ ...record, status: record.status === 0 ? 1 : 0 });
              // 刷新列表
              await getListData();
            },
          });
        },
      });
    },
  },
  {
    title: WeiI18n.t('操作').value,
    dataIndex: 'operation',
    key: 'operation',
    align: 'left',
    width: operationWidth.value,
  },
]);
const chinacolumns = ref([
  {
    title: WeiI18n.t('登录名').value,
    dataIndex: 'username',
    key: 'username',
    width: 230,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('昵称').value,
    dataIndex: 'nickname',
    key: 'nickname',
    width: 230,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: WeiI18n.t('状态').value,
    dataIndex: 'status',
    key: 'status',
    width: 100,
    sortDirections: ['descend', 'ascend'],
    customRender: ({ record }) => {
      return h(Switch, {
        checked: Number(record.status) === CommonStatusEnum.ENABLE,
        onChange: () => {
          // 修改状态的二次确认
          const _text = record.status === CommonStatusEnum.ENABLE ? WeiI18n.t('停用').value : WeiI18n.t('启用').value;
          Modal.confirm({
            title: `确认要"${_text}""${record.nickname}"用户吗?`,
            okText: WeiI18n.t('确定').value,
            cancelText: WeiI18n.t('取消').value,
            async onOk() {
              // 发起修改状态
              await AdminApiSystemUser.updateaccount({ ...record, status: record.status === 0 ? 1 : 0 });
              // 刷新列表
              await getListData();
            },
          });
        },
      });
    },
  },
  {
    title: WeiI18n.t('操作').value,
    dataIndex: 'operation',
    key: 'operation',
    align: 'left',
    width: operationWidth.value,
  },
]);

/** 表格列属性 */
const columns = ref<any>([]);
/** 弹窗状态 */
const visible = computed(() => {
  if (props.modalVisible) {
    userData.userForm.id = '';
    userData.userForm.username = '';
    userData.userForm.nickname = '';
    userData.userForm.mobile = '';
    if (props.userRow.type != '2') {
      columns.value = abroadcolumns.value;
    } else {
      columns.value = chinacolumns.value;
    }
    getListData();
  }
  return props.modalVisible;
});

/** 下单弹窗 */
const phoneVisible = ref<boolean>(false);

/** 数据 定义 */
const dataSource = ref<Array<any>>([]);

/** 列表请求参数 */
const requestParams = reactive(new RolePageRequestDTOModel());
requestParams.condition = undefined;

/** 初始化绑定分页请求参数 */
const { pagination } = usePagination(requestParams, getListData);
pagination.buildOptionText = pageSizeOptions => `${pageSizeOptions.value}${WeiI18n.$t('条/页')}`;
pagination.showTotal = total => `${WeiI18n.$t('共') + total + WeiI18n.$t('条')}`;
pagination.showQuickJumper = false;
/** 表格高度 */
const tableHXH = ref(600);
const loading = ref(false);
/** 勾选表格数据源  */
const selectedRowList = ref<any[]>([]);
const formrow = ref<any>({});
/** 主表格勾选事件 */
const rowSelection: TableProps['rowSelection'] = {
  /**
   * @param selectedRowKeys 选中的行数量
   * @param selectedRows  选中的行数据
   */
  onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
    selectedRowList.value = selectedRows;
  },
};
/**
 * @description 点击取消事件
 */
function cancel() {
  emit('onClose', false);
}
/**
 * @description 导出数据
 */
async function AddData() {
  phoneVisible.value = true;
}
/**
 * @param id
 * @description 删除
 */
async function handleDelete(id: string) {
  const res = await AdminApiSystemUser.deleteaccountUser({ id });
  if (res.data.code === 200) {
    message.success(WeiI18n.t('删除成功').value);
    getListData();
  }
}

/**
 * @description
 */
async function getListData() {
  // loading.value = true;
  // try {
  //   const res = await AdminApiSystemUser.getListByUser({ userId: props.userRow.id });
  //   if (res.data.code === 200) {
  //     dataSource.value = res.data.data || [];
  //   }
  // } finally {
  //   loading.value = false;
  // }
}
const handleSubaccount = async () => {
  // 调用保存接口
  await formRef.value?.validate();
  if (userData.userForm.id) {
    const res = await AdminApiSystemUser.updateaccount({
      userId: props.userRow.id,
      ...userData.userForm,
    });
    if (res.data.code === 200) {
      message.success(WeiI18n.t('编辑成功').value);
      getListData();
      phoneVisible.value = false;
    } else {
      message.error(res.data.msg);
    }
  } else {
    const res = await AdminApiSystemUser.createUserSubaccount({
      userId: props.userRow.id,
      mobile: userData.userForm.mobile,
      username: userData.userForm.username,
      nickname: userData.userForm.nickname,
    });
    if (res.data.code === 200) {
      message.success(WeiI18n.t('添加成功').value);
      getListData();
      userData.userForm.mobile = '';
      userData.userForm.username = '';
      userData.userForm.nickname = '';
      userData.userForm.id = '';
      phoneVisible.value = false;
    } else {
      message.error(res.data.msg);
    }
  }
};

async function handleAddOrUpdate(row: any) {
  phoneVisible.value = true;
  formrow.value = row;
  userData.userForm.username = row && row.username ? row.username : '';
  userData.userForm.nickname = row && row.nickname ? row.nickname : '';
  userData.userForm.mobile = row && row.mobile ? row.mobile : '';
  userData.userForm.id = row && row.id ? row.id : '';
}
</script>

<template>
  <a-modal
    v-model:visible="visible"
    width="70%"
    footer
    :title="$t('子账号管理')"
    :confirm-loading="$isPending('list')"
    :ok-text="$t('提交')"
    :cancel-text="$t('取消')"
    :mask-closable="false"
    @cancel="cancel">
    <div class="info-body">
      <a-row type="flex">
        <a-col flex="1 1 200px" style="height: 100%">
          <a-button type="primary" class="m-right" @click="AddData">
            {{ $t('新增 ') }}
          </a-button>
        </a-col>
      </a-row>
      <div style="padding-top: 20px">
        <a-table
          :scroll="{ x: 800 }"
          :pagination="false"
          :loading="loading"
          row-key="id"
          :data-source="dataSource"
          :columns="columns"
          :row-selection="rowSelection"
          :row-class-name="(record, index) => (index % 2 === 0 ? 'odd' : 'even')">
          <template #bodyCell="{ column, text, record }">
            <template v-if="column.dataIndex === 'operation'">
              <a @click.stop="handleAddOrUpdate(record)">{{ $t('编辑') }}</a>
              <!-- <span>
                <a-popconfirm :ok-text="WeiI18n.t('确认').value" :cancel-text="WeiI18n.t('取消').value" :title="`${$t('确定要删除吗')}?`" @confirm="handleDelete(record.id)">
                  <a class="del-text" style="color: red">{{ $t('删除') }}</a>
                </a-popconfirm>
              </span> -->
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </a-modal>
  <a-modal
    v-model:visible="phoneVisible"
    style="width: 520px"
    :title="$t('添加子账号')"
    :confirm-loading="$isPending()"
    :mask-closable="false"
    :ok-text="$t('提交')"
    :cancel-text="$t('取消')"
    @ok="handleSubaccount()"
    @cancel="phoneVisible = false">
    <div class="w-[462px] my-[30px]">
      <a-form ref="formRef" :label-col="{ span: 5 }" :model="userData.userForm" name="basic" autocomplete="off">
        <a-form-item v-if="userRow.type == 2" :label="$t('登录名')" name="username" :rules="[{ required: true, message: `${$t('请输入登录名')}` }]">
          <a-input-group compact>
            <a-input v-model:value="userData.userForm.username" :placeholder="$t('请输入登录名')">
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input>
          </a-input-group>
        </a-form-item>
        <a-form-item :label="$t('昵称')" name="nickname" :rules="[{ required: true, message: `${$t('请输入昵称')}` }]">
          <a-input-group compact>
            <a-input v-model:value="userData.userForm.nickname" :placeholder="$t('请输入昵称')">
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input>
          </a-input-group>
        </a-form-item>
        <a-form-item
          v-if="userRow.type != 2"
          :label="$t('手机号')"
          name="mobile"
          :rules="[
            {
              required: true,
              message: `${$t('请输入正确的联系电话')}`,
              pattern: /^(1[3456789]\d{9}|0\d{2,3}-\d{7,8})$/,
            },
          ]">
          <a-input v-model:value="userData.userForm.mobile" allow-clear :placeholder="$t('请输入手机号')">
            <template #prefix>
              <PhoneOutlined />
            </template>
          </a-input>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<style lang="less" scoped>
:deep(.ant-input-number-handler-wrap) {
  background-color: #f7f7f7 !important;
  color: #407fff !important;
}
</style>
