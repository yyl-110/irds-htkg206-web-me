<template>
  <div class="knowledge-container flex flex-col">
    <div class="w-full flex items-center justify-between header">
      <a-radio-group v-model:value="value">
        <a-radio-button value="1">文档</a-radio-button>
        <a-radio-button value="2">问答</a-radio-button>
        <a-radio-button value="3">视频</a-radio-button>
        <a-radio-button value="4">图片</a-radio-button>
      </a-radio-group>
      <div class="flex items-center">
        <a-input-search v-model:value="searchValue" placeholder="输入关键字进行搜索" @search="onSearch" class="w-[300px]">
          <template #enterButton>
            <div class="flex items-center">
              <SearchOutlined />
              <span class="ml-[4px]">搜索</span>
            </div>
          </template>
        </a-input-search>
        <a-checkbox-group v-model:value="searchType" :options="searchOptions" class="ml-[8px]" />
      </div>
    </div>
    <div class="flex items-center mt-[16px]">
      <span>所属分类：</span>
      <a-checkbox-group v-model:value="type" :options="typeOptions" />
    </div>
    <main class="flex-1 h-0">
      <div class="list h-full">
        <text-card />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import textCard from '../components/textCard.vue'
import { SearchOutlined } from '@ant-design/icons-vue';


const value = ref('1')
const type = ref('')
const searchType = ref('')
const searchValue = ref('')

const searchOptions = [
  {
    label: '关键字',
    value: '1',
  },
  {
    label: '下载项',
    value: '2',
  },
];
const typeOptions = ['Apple', 'Pear', 'Orange'];

const onSearch = () => { }

</script>

<style lang="less" scoped>
.knowledge-tab {
  :deep(.ant-radio-group) {
    display: inline-flex;
    gap: 6px;

    .ant-radio-button-wrapper {
      border-radius: 0 !important;
    }
  }

  .header {
    border-bottom: 1px solid #EAEAF1;
  }

}
</style>