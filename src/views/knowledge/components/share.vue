<script setup lang="ts">
import Cookies from "js-cookie";
import { shareDetail, knowledgeShare, userList } from "@/api/knowledge";
import { message } from "ant-design-vue";
import { useUserStore } from "@/store/modules/user";
import draggableModal from "@/components/DraggableModal/index.vue";

const props = defineProps({
  shareDialogVisible: {
    type: Boolean,
    default: false,
  },
  docId: String,
  questFlag: Number,
  tabFlag: Number,
});

const emit = defineEmits(["closeShare"]);

const userStore = useUserStore();

// 本地可见性状态，替代 prop 直接绑定
const visible = ref(false);

// 默认选中状态
const radioVal = ref(3);

// 默认禁止
const redioFlag = ref(true);

// 指定人员
const appoint = ref("");

// 用户列表
const userData = ref([]);

// 确认选中的用户列表
const confirmUser = ref([]);

const data = ref([]);
const value = ref([]);

const shareDialogVisible1 = ref(false);

const initData = async () => {
  const params = {
    kldFileId: props.docId,
    loginUserId: userStore.getUser.id,
    kldType: props.tabFlag === 4 ? 2 : 1,
  };
  try {
    const res = await shareDetail(params);
    if (res.data && res.data.code === "0") {
      // console.log(res, 'etwegewrg');
      radioVal.value = Number(res.data.data?.userType);
    }
  } catch (error) {
    console.log("error", error);
  }
};

watch(
  () => props.shareDialogVisible,
  (val) => {
    visible.value = val;
    if (val) {
      initData();
    }
  }
);

// 人员用户列表
const generateData = () => {
  data.value = userData.value.map((item: any, index) => {
    return {
      title: `${item.name}(${item.username})`,
      key: item.id,
      initial: item.name,
    };
  });
};

const getRadio = () => {
  if (radioVal.value && radioVal.value === 2) {
    redioFlag.value = false;
    shareDialogVisible1.value = true;
    getUserList();
  } else {
    redioFlag.value = true;
  }
};

// 穿梭框右侧数据
const rightData = (val) => {
  confirmUser.value = [];
  confirmUser.value = val;
};

// 获取用户列表
const getUserList = () => {
  const params = {
    type: radioVal.value,
    kldFileId: props.docId,
    kldType: props.tabFlag === 4 ? 2 : 1,
    userId: userStore.getUser.id,
  };
  userList(params).then((res) => {
    if (res.data && res.data.code === "0") {
      userData.value = res.data.data;
      generateData();
    }
  });
};

const filterMethod = (query, item) => {
  return item.initial.toLowerCase().includes(query.toLowerCase());
};
// 保存
const submit = () => {
  radioVal.value = 3
  emit("closeShare");
};

// 提交
const handleClose = () => {
  if (!radioVal.value || (radioVal.value === 2 && !appoint.value)) {
    message.warning("请指定人员");
  } else {
    const params = {
      id: "",
      kldFileId: String(props.docId),
      loginUserId: userStore.getUser.id,
      userType: String(radioVal.value),
      userIds: confirmUser.value.toString() || "",
      userNames: userStore.getUser.userName,
      status: "1",
      kldType: props.questFlag === 2 ? 2 : 1,
    };
    knowledgeShare(params).then((res) => {
      if (res.data && res.data.code === "0") {
        appoint.value = "";
        message.success(res.data.msg);
      }
    });
    emit("closeShare");
  }
};

// 穿梭框确认按钮
const submitShare = () => {
  let arr = [];
  confirmUser.value.map((v) => {
    userData.value.map((k) => {
      // 筛选出对应的名称
      if (v === k.id) {
        arr.push(k.name);
      }
    });
  });
  appoint.value = arr.toString();
  // console.log(appoint.value, 'appoint.value');
  shareDialogVisible1.value = false;
};

// 穿梭框取消按钮
const handleCloseShare = () => {
  shareDialogVisible1.value = false;
};
</script>

<template>
  <draggable-modal
    v-model:visible="visible"
    :closable="false"
    class="dialog"
    centered
    title="分享文档"
    :width="650"
    draggable
  >
    <div class="top">
      <div>可分享者：</div>
      <a-radio-group v-model:value="radioVal" @change="getRadio">
        <!-- <a-radio :value="1">知识专家</a-radio> -->
        <a-radio :value="3">所有人</a-radio>
        <a-radio :value="2">指定人员</a-radio>
      </a-radio-group>
    </div>
    <div class="center">
      <div class="center-text">分享人员：</div>
      <a-input
        :disabled="redioFlag"
        class="center-input"
        v-model:value="appoint"
      ></a-input>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <a-button type="primary" @click="handleClose">提交</a-button>
        <a-button @click="submit">取消</a-button>
      </span>
    </template>
  </draggable-modal>
  <draggable-modal
    v-model:visible="shareDialogVisible1"
    :closable="false"
    centered
    title="站内分享"
    :width="650"
    @after-close="handleCloseShare"
    draggable
  >
    <a-transfer
      v-model:target-keys="value"
      :data-source="data"
      show-search
      :filter-option="filterMethod"
      :render="(item) => item.title"
      @change="rightData"
      :list-style="{
        width: '250px',
        height: '300px',
      }"
    />
    <template #footer>
      <span class="dialog-footer">
        <a-button type="primary" @click="submitShare">确定</a-button>
        <a-button @click="handleCloseShare">取消</a-button>
      </span>
    </template>
  </draggable-modal>
</template>

<style lang="less" scoped>
.dialog {
  .top {
    display: flex;
    line-height: 32px;
  }
  .center {
    margin: 20px 0;
    display: flex;
    &-text {
      width: 100px;
      line-height: 32px;
    }
    &-input {
      width: 100%;
    }
  }
}
:deep(.el-transfer-panel__list.is-filterable) {
  width: 400px;
}
</style>
