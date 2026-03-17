<template>
  <div class="p-[16px] pb-0 card">
    <div class="title">
      <span class="text-[#313133] font-bold text-[16px]">侯福勇测试-ES传不上问题</span>
      <span class="text-[#555D6D] text-[16px]">【V1】</span>
      <span class="text-[#555D6D] text-[16px]">【已发布】</span>
    </div>
    <div class="desc text-[#555D6D] mt-[20px]">
      <span>测试者</span>
      <span>2024-10-1</span>
    </div>
    <div class="options mt-[16px] flex items-center">
      <div class="item">
        <EyeOutlined />
        <span class="num">5</span>
      </div>
      <div class="item">
        <MessageOutlined />
        <span class="num">5</span>
      </div>
      <div class="item">
        <StarOutlined />
        <span class="num">5</span>
      </div>
      <div class="item">
        <ShareAltOutlined />
        <span class="num">5</span>
      </div>
      <div class="item">
        <ArrowDownOutlined />
        <span class="num">5</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowDownOutlined, EyeOutlined, MessageOutlined, ShareAltOutlined, StarOutlined } from '@ant-design/icons-vue';


</script>

<style lang="less" scoped>
.card {
  border-bottom: 1px solid #EAEAF1;
  cursor: pointer;

  .options {
    .item {
      cursor: pointer;
      padding: 5px 10px;

      :hover {
        color: red;
      }

      &:not(:last-child) {
        border-right: 1px solid #E7EAEE;
      }

      >.num {
        margin-left: 8px;
      }
    }
  }
}
</style>