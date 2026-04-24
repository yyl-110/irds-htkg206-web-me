<script setup lang="ts">
import { defineProps, nextTick } from "vue";
import draggableModal from "@/components/DraggableModal/index.vue";

const props = defineProps({
  videoHide: Boolean,
  fileUrlPlay: String,
  dialogType: String,
  titleType: String,
  textData: String,
});

const emit = defineEmits("getVideoHide");
const visible = ref(false);

const pauseFun = () => {
  nextTick(() => {
    let videoElement = document.getElementById("videoId");
    if (videoElement) {
      videoElement.pause();
    }
  });
};

const getFlag = () => {
  pauseFun();
  emit("getVideoHide", false);
};

const closeDialog = () => {
  pauseFun();
  emit("getVideoHide", false);
};

watch(
  () => props.videoHide,
  () => {
    visible.value = props.videoHide;
  }
);
</script>

<template>
  <draggable-modal v-model:visible="visible" :closable="false" centered :title="titleType" :width="1100"
    @cancel="closeDialog">
    <div class="max-h-[70vh] overflow-y-auto wei-scrollbar">
      <div v-html="textData" class="whitespace-pre-wrap"></div>
      <video v-if="dialogType === '2'" id="videoId" autoPlay :src="fileUrlPlay" width="1000" height="500" controls />
      <div v-if="dialogType === '3'" style="height: 550px; overflow-y: auto; text-align: center">
        <a-image style="width: 500px; height: 500px; margin: 0 auto" :width="500" :src="fileUrlPlay" fit="contain" v-if="fileUrlPlay" />
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <a-button type="primary" @click="getFlag">关闭</a-button>
      </div>
    </template>
  </draggable-modal>
</template>