<script lang="ts">
import { defineComponent, inject, reactive, ref, toRefs, computed } from 'vue';
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn';
import { useUserStore } from '@/store/modules/user';
import { NoticeInfoRequestDTOModel } from '@/api/models/notice/NoticePOModel';
import { ProductPlatformParameterInfoUpdateDTOModel } from '@/api/models/product/ProductPlatformParameterInfoUpdateDTOModel';

export default defineComponent({
  props: {
    modalVisible: {
      type: Boolean,
    },
  },
  setup(props, context) {
    /** 弹窗状态 */
    const visible = computed(() => {
      return props.modalVisible;
    });
    const listVisible = ref(false);
    const userStore = useUserStore();
    function customGetContainer() {
      // 返回自定义挂载节点
      return document.querySelector('.modal-container1');
    }

    function customParamGetContainer() {
      // 返回自定义挂载节点
      return document.querySelector('.updateParameter');
    }

    const updatePlatformParameter = reactive(new ProductPlatformParameterInfoUpdateDTOModel());
    const id = ref(0);
    const parameterName = ref('');
    const parameterNum = ref('');
    const parameterType = ref('');
    const major = ref('');
    const keyIndicators = ref('');
    const customString = ref('');
    const note = ref('');
    // 确保type变量始终存储字符串类型的值
    const type = ref('3');
    const value = ref('');
    // 范围相关变量
    const bigType = ref('');
    const bigValue = ref('');
    const smallType = ref('');
    const smallValue = ref('');
    const levels = ref('');
    function handleClose() {
      context.emit('close');
    }

    // 创建一个formData对象，用于表单数据绑定
    const formData = reactive({
      parameterNum: '',
      parameterName: '',
      parameterType: '',
      major: '',
      keyIndicators: '',
      type: '3',
      value: '',
      customString: '',
      note: '',
    });

    // 列表相关变量
    const listItems = ref<Array<{ id: number; value: string }>>([]);
    let listItemIdCounter = 0;

    async function updateParaneterInfo() {
      updatePlatformParameter.id = id.value;
      // 如果是范围类型，格式化范围字符串
      if (type.value === '1') {
        updatePlatformParameter.bigType = bigType.value;
        updatePlatformParameter.bigValue = bigValue.value;
        updatePlatformParameter.smallType = smallType.value;
        updatePlatformParameter.smallValue = smallValue.value;
        updatePlatformParameter.tabulationVoList = [];
      } else if (type.value === '2') {
        updatePlatformParameter.bigType = '';
        updatePlatformParameter.bigValue = '';
        updatePlatformParameter.smallType = '';
        updatePlatformParameter.smallValue = '';
      } else {
        updatePlatformParameter.customString = customString.value;
        updatePlatformParameter.bigType = '';
        updatePlatformParameter.bigValue = '';
        updatePlatformParameter.smallType = '';
        updatePlatformParameter.smallValue = '';
        updatePlatformParameter.tabulationVoList = [];
      }
      updatePlatformParameter.type = type.value;
      updatePlatformParameter.value = value.value;
      updatePlatformParameter.note = note.value;
      updatePlatformParameter.userId = userStore.getUser.id;
      if (levels.value == 3) {
        updatePlatformParameter.major = major.value;
        if (keyIndicators.value == 0) {
          updatePlatformParameter.keyIndicators = false;
        } else {
          updatePlatformParameter.keyIndicators = true;
        }
      }
      context.emit('updateParaneterInfo', updatePlatformParameter);
    }

    // 添加新的列表项
    function addListItem() {
      listItems.value.push({ id: ++listItemIdCounter, value: '' });
    }

    // 删除列表项
    function removeListItem(id: number) {
      listItems.value = listItems.value.filter(item => item.id !== id);
    }

    // 保存列表项
    async function updateParaneterInfoList() {
      updatePlatformParameter.tabulationVoList = [];
      // 过滤掉空值
      const validItems = listItems.value.filter(item => item.value.trim() !== '');
      updatePlatformParameter.tabulationVoList = validItems.map(item => item.value);
      listVisible.value = false;
    }

    async function handleCloseList() {
      listVisible.value = false;
    }

    async function handleKeyIndicatorChange(checked: boolean) {
      try {
        // 更新本地数据以立即反映变化
        keyIndicators.value = checked ? '1' : '0';
      } catch (error) {
        // 如果更新失败，恢复原始状态
        keyIndicators.value = checked ? '0' : '1';
      }
    }

    // 初始化数据
    function editParameterInfoData(data: any, level: string) {
      levels.value = level;
      console.log(data);
      id.value = data.id;
      parameterNum.value = data.parameterNum;
      parameterName.value = data.parameterName;
      parameterType.value = data.parameterType;
      if (levels.value == 3) {
        major.value = data.major;
        keyIndicators.value = data.keyIndicators;
      }
      customString.value = data.customString;
      // 确保始终设置为字符串类型
      type.value = String(data.type);
      if (data.type == null) {
        type.value = '3';
      }
      value.value = data.value;
      note.value = data.note;
      // 处理范围值数据
      if (type.value === '1') {
        bigType.value = String(data.bigType);
        smallType.value = String(data.smallType);
        bigValue.value = data.bigValue;
        smallValue.value = data.smallValue;
        listItems.value = [{ id: 1, value: '' }];
        listItemIdCounter = 1;
      } else if (type.value === '2') {
        // 处理列表类型数据
        customString.value = data.rangeValue || '';
        console.log(customString.value);
        // 解析字符串为列表项
        if (customString.value) {
          const values = customString.value.split('/');
          listItems.value = values.map((val, index) => ({
            id: index + 1,
            value: val,
          }));
          listItemIdCounter = values.length;
        } else {
          // 如果没有数据，初始化一个空列表项
          listItems.value = [{ id: 1, value: '' }];
          listItemIdCounter = 1;
        }
        bigType.value = '';
        smallType.value = '';
        bigValue.value = '';
        smallValue.value = '';
      } else {
        customString.value = data.customString;
        listItems.value = [{ id: 1, value: '' }];
        listItemIdCounter = 1;
        bigType.value = '';
        smallType.value = '';
        bigValue.value = '';
        smallValue.value = '';
      }
      // 同步更新formData
      formData.parameterNum = data.parameterNum;
      formData.parameterName = data.parameterName;
      formData.parameterType = data.parameterType;
      if (levels.value == 3) {
        formData.major = data.major;
        formData.keyIndicators = data.keyIndicators;
      }
      formData.type = String(data.type);
      formData.value = data.value;
      formData.customString = data.customString;
      formData.note = data.note;
    }

    function listOpen() {
      listVisible.value = true;
    }
    return {
      levels,
      visible,
      listVisible,
      parameterNum,
      parameterName,
      parameterType,
      major,
      keyIndicators,
      type,
      value,
      customString,
      note,
      formData,
      bigType,
      bigValue,
      smallType,
      smallValue,
      listItems,
      updateParaneterInfoList,
      handleCloseList,
      listOpen,
      customGetContainer,
      customParamGetContainer,
      updateParaneterInfo,
      handleClose,
      editParameterInfoData,
      handleKeyIndicatorChange,
      addListItem,
      removeListItem,
    };
  },
});
</script>

<template>
  <div class="modal-container1" v-dragModal>
    <a-modal
      v-model:visible="visible"
      :getContainer="customGetContainer"
      style="width: 30%"
      :title="$t('编辑参数')"
      :mask-closable="false"
      @ok="updateParaneterInfo"
      @cancel="handleClose">
      <a-form model="formData" style="margin-top: 20px">
        <a-form-item :label="$t('参数代号')" name="name">
          <a-input v-model:value="parameterNum" disabled="true" placeholder="请输入" />
        </a-form-item>
        <a-form-item :label="$t('参数名称')" name="name">
          <a-input v-model:value="parameterName" disabled="true" placeholder="请输入" />
        </a-form-item>
        <a-form-item :label="$t('参数类型')" name="code">
          <a-select v-model:value="parameterType" disabled="true" style="flex: 1">
            <a-select-option value="0">实数</a-select-option>
            <a-select-option value="1">字符串</a-select-option>
            <a-select-option value="2">布尔类型</a-select-option>
            <a-select-option value="9">整数</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('属性类型')" name="code">
          <a-select v-model:value="type" style="flex: 1">
            <a-select-option value="1">范围</a-select-option>
            <a-select-option value="2">列表</a-select-option>
            <a-select-option value="3">自定义</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('所属专业')" name="name" v-if="levels == 3">
          <a-input v-model:value="major" disabled="true" />
        </a-form-item>
        <a-form-item :label="$t('关键指标')" name="name" v-if="levels == 3">
          <a-switch :checked="keyIndicators === '1' || keyIndicators === 1" @change="handleKeyIndicatorChange($event)" style="margin-left: 10px" />
        </a-form-item>
        <a-form-item :label="$t('默认值')" name="name">
          <a-input v-model:value="value" placeholder="请输入" />
        </a-form-item>
        <a-form-item :label="$t('参数值')" name="name" v-if="type === '1' || type === '3'">
          <!-- 当属性类型为范围时显示范围选择结构 -->
          <div v-if="type === '1'" style="display: flex; flex-direction: column; gap: 8px">
            <div style="display: flex; align-items: center; gap: 8px">
              <a-select
                style="width: 100px"
                v-model:value="bigType"
                :options="[
                  { value: '0', label: '大于' },
                  { value: '1', label: '大于等于' },
                ]" />
              <a-input style="flex: 1" v-model:value="bigValue" placeholder="请输入" />
            </div>
            <div style="display: flex; align-items: center; gap: 8px">
              <a-select
                style="width: 100px"
                v-model:value="smallType"
                :options="[
                  { value: '0', label: '小于' },
                  { value: '1', label: '小于等于' },
                ]" />
              <a-input style="flex: 1" v-model:value="smallValue" placeholder="请输入" />
            </div>
          </div>
          <!-- 其他情况显示普通输入框 -->
          <a-input v-else v-model:value="customString" placeholder="请输入" />
        </a-form-item>
        <a-form-item :label="$t('列表')" name="name" v-else>
          <a @click="listOpen">打开列表</a>
        </a-form-item>
        <a-form-item :label="$t('备注')" name="name">
          <a-textarea v-model:value="note" placeholder="请输入" show-word-limit />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button type="primary" @click="updateParaneterInfo">
          {{ $t('确定') }}
        </a-button>
        <a-button @click="handleClose">
          {{ $t('取消') }}
        </a-button>
      </template>
    </a-modal>
  </div>
  <div class="updateParameter" v-dragModal>
    <a-modal
      v-model:visible="listVisible"
      :getContainer="customParamGetContainer"
      style="width: 30%"
      :style="{ top: '5%' }"
      :title="$t('列表参数配置')"
      :mask-closable="false"
      @ok="updateParaneterInfoList"
      @cancel="handleCloseList">
      <div style="max-height: 300px; overflow-y: auto">
        <div v-if="listItems.length === 0" style="text-align: center; padding: 20px; color: #999">暂无数据</div>
        <div v-else>
          <div style="display: flex; font-weight: bold; padding: 8px 0; border-bottom: 1px solid #f0f0f0">
            <div style="flex: 1">参数值</div>
            <div style="width: 60px">操作</div>
          </div>
          <div v-for="item in listItems" :key="item.id" style="display: flex; align-items: center; margin-bottom: 12px">
            <a-input v-model:value="item.value" style="flex: 1; margin-right: 8px" placeholder="请输入参数值" />
            <a-button type="text" danger @click="removeListItem(item.id)" :disabled="listItems.length <= 1"> 删除 </a-button>
          </div>
        </div>
        <a-button type="dashed" block @click="addListItem" style="margin-top: 8px; color: blue"> 添加参数 </a-button>
      </div>
      <template #footer>
        <a-button type="primary" @click="updateParaneterInfoList">
          {{ $t('确定') }}
        </a-button>
        <a-button @click="handleCloseList">
          {{ $t('取消') }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
.modal-container1 {
  position: relative;
}
/deep/ .ant-modal-mask {
}
/deep/ .ant-form {
  width: 100%;
}
/deep/ .ant-form-item {
  margin-bottom: 16px;
}
/deep/ .ant-form-item-label {
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 32px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
  width: 100px; /* 固定label宽度 */
}
/deep/ .ant-form-item-control {
  position: relative;
  flex: 1;
  min-width: 0;
}
/deep/ .ant-form-item-control-input {
  position: relative;
  display: flex;
  align-items: center;
}
/deep/ .ant-input,
/deep/ .ant-select-selector {
  width: 100%; /* 确保输入框宽度占满剩余空间 */
  box-sizing: border-box;
}

/* 确保下拉菜单可以正确显示，不会被Modal遮挡 */
/deep/ .ant-select-dropdown {
}
</style>
