<script name="VerifyPoints" lang="ts" setup type="text/babel">
/**
 * VerifyPoints
 * @description 点选
 */
import { getCurrentInstance, nextTick, onMounted, reactive, ref, toRefs } from 'vue';
import { resetSize } from './../utils/util';
import { aesEncrypt } from './../utils/ase';
import { AdminApiSystemCaptcha } from '@/api/tags/管理后台验证码';

const props = defineProps({
  // 弹出式pop，固定fixed
  mode: {
    type: String,
    default: 'fixed',
  },
  captchaType: {
    type: String,
    required: true,
  },
  // 间隔
  vSpace: {
    type: Number,
    default: 5,
  },
  imgSize: {
    type: Object,
    default() {
      return {
        width: '310px',
        height: '155px',
      };
    },
  },
  barSize: {
    type: Object,
    default() {
      return {
        width: '310px',
        height: '40px',
      };
    },
  },
});

/**
 * ~~translate~~
 * @param k
 * @param t
 */
const t = (k: string, t: string) => t;
const { mode, captchaType } = toRefs(props);
// const { proxy } = getCurrentInstance()
const currentInstance = getCurrentInstance();

if (!currentInstance || !currentInstance.proxy || !currentInstance.proxy.$parent) throw new Error('Internal Error: Missing currentInstance');

const proxy = currentInstance.proxy;
const secretKey = ref(''); // 后端返回的ase加密秘钥
const checkNum = ref(3); // 默认需要点击的字数
const fontPos = reactive<Array<{ x: number; y: number }>>([]); // 选中的坐标信息
const checkPosArr = reactive<Array<{ x: number; y: number }>>([]); // 用户点击的坐标
const num = ref(1); // 点击的记数
const pointBackImgBase = ref(''); // 后端获取到的背景图片
const poinTextList = ref([]); // 后端返回的点击字体顺序
const backToken = ref(''); // 后端返回的token值
const setSize = reactive({
  imgHeight: 0,
  imgWidth: 0,
  barHeight: 0,
  barWidth: 0,
});
const tempPoints = reactive<Array<{ x: number; y: number }>>([]);
const text = ref('');
const barAreaColor = ref('');
const barAreaBorderColor = ref('');
const showRefresh = ref(true);
const bindingClick = ref(true);

/** init */
function init() {
  // 加载页面
  fontPos.splice(0, fontPos.length);
  checkPosArr.splice(0, checkPosArr.length);
  num.value = 1;
  getPictrue();
  nextTick(() => {
    const { imgHeight, imgWidth, barHeight, barWidth } = resetSize(proxy);
    setSize.imgHeight = imgHeight;
    setSize.imgWidth = imgWidth;
    setSize.barHeight = barHeight;
    setSize.barWidth = barWidth;
    proxy.$parent?.$emit('ready', proxy);
  });
}
onMounted(() => {
  // 禁止拖拽
  init();
  proxy.$el.onselectstart = function () {
    return false;
  };
});
const canvas = ref();
/**
 * canvasClick
 * @param e
 */
function canvasClick(e: MouseEvent) {
  checkPosArr.push(getMousePos(canvas, e));
  if (num.value === checkNum.value) {
    num.value = createPoint(getMousePos(canvas, e));
    // 按比例转换坐标值
    const arr = pointTransfrom(checkPosArr, setSize);
    checkPosArr.length = 0;
    checkPosArr.push(...arr);
    // 等创建坐标执行完
    setTimeout(() => {
      // var flag = this.comparePos(this.fontPos, this.checkPosArr);
      // 发送后端请求
      const captchaVerification = secretKey.value
        ? aesEncrypt(`${backToken.value}---${JSON.stringify(checkPosArr)}`, secretKey.value)
        : `${backToken.value}---${JSON.stringify(checkPosArr)}`;
      const data = {
        captchaType: captchaType.value,
        pointJson: secretKey.value ? aesEncrypt(JSON.stringify(checkPosArr), secretKey.value) : JSON.stringify(checkPosArr),
        token: backToken.value,
      };
      AdminApiSystemCaptcha.check1(data).then(response => {
        const res = response.data;
        if (res.repCode === '0000') {
          barAreaColor.value = '#4cae4c';
          barAreaBorderColor.value = '#5cb85c';
          text.value = t('captcha.success', '验证成功');
          bindingClick.value = false;
          if (mode.value === 'pop') {
            setTimeout(() => {
              (proxy.$parent as any).clickShow = false;
              refresh();
            }, 1500);
          }
          proxy.$parent?.$emit('success', { captchaVerification });
        } else {
          proxy.$parent?.$emit('error', proxy);
          barAreaColor.value = '#d9534f';
          barAreaBorderColor.value = '#d9534f';
          text.value = t('captcha.fail', '验证失败');
          setTimeout(() => {
            refresh();
          }, 700);
        }
      });
    }, 400);
  }
  if (num.value < checkNum.value) num.value = createPoint(getMousePos(canvas, e));
}
/**
 * 获取坐标
 * @param obj
 * @param e
 */
function getMousePos(obj: any, e: MouseEvent) {
  const x = e.offsetX;
  const y = e.offsetY;
  return { x, y };
}
/**
 * 创建坐标点
 * @param pos
 */
function createPoint(pos: any) {
  tempPoints.push(Object.assign({}, pos));
  return num.value + 1;
}
/** refresh */
async function refresh() {
  tempPoints.splice(0, tempPoints.length);
  barAreaColor.value = '#000';
  barAreaBorderColor.value = '#ddd';
  bindingClick.value = true;
  fontPos.splice(0, fontPos.length);
  checkPosArr.splice(0, checkPosArr.length);
  num.value = 1;
  await getPictrue();
  showRefresh.value = true;
}

/** 请求背景图片和验证图片 */
async function getPictrue() {
  const res = await AdminApiSystemCaptcha.get({ type: captchaType.value });
  if (res.data.repCode === '0000') {
    const data = res.data.repData as any;
    pointBackImgBase.value = data.originalImageBase64;
    backToken.value = data.token;
    secretKey.value = data.secretKey;
    poinTextList.value = data.wordList;
    text.value = `${t('captcha.point', '请依次点击')}【${poinTextList.value.join(',')}】`;
  } else {
    text.value = res.data.repMsg || '';
  }
}
/**
 * 坐标转换函数
 * @param pointArr
 * @param imgSize
 */
function pointTransfrom(pointArr: Array<{ x: number; y: number }>, imgSize: any) {
  const newPointArr = pointArr.map(p => {
    const x = Math.round((310 * p.x) / Number.parseInt(imgSize.imgWidth));
    const y = Math.round((155 * p.y) / Number.parseInt(imgSize.imgHeight));
    return { x, y };
  });
  return newPointArr;
}
</script>

<template>
  <div style="position: relative">
    <div class="verify-img-out">
      <div
        :style="{
          width: setSize.imgWidth,
          height: setSize.imgHeight,
          'background-size': `${setSize.imgWidth} ${setSize.imgHeight}`,
          'margin-bottom': `${vSpace}px`,
        }"
        class="verify-img-panel">
        <div v-show="showRefresh" class="verify-refresh" style="z-index: 3" @click="refresh">
          <i class="iconfont icon-refresh" />
        </div>
        <img
          ref="canvas"
          :src="`data:image/png;base64,${pointBackImgBase}`"
          alt=""
          style="width: 100%; height: 100%; display: block"
          @click="bindingClick ? canvasClick($event) : undefined" />

        <div
          v-for="(tempPoint, index) in tempPoints"
          :key="index"
          :style="{
            'background-color': '#1abd6c',
            color: '#fff',
            'z-index': 9999,
            width: '20px',
            height: '20px',
            'text-align': 'center',
            'line-height': '20px',
            'border-radius': '50%',
            position: 'absolute',
            top: `${parseInt((tempPoint.y - 10).toString())}px`,
            left: `${parseInt((tempPoint.x - 10).toString())}px`,
          }"
          class="point-area">
          {{ index + 1 }}
        </div>
      </div>
    </div>
    <!-- 'height': this.barSize.height, -->
    <div
      :style="{
        width: setSize.imgWidth,
        color: barAreaColor,
        'border-color': barAreaBorderColor,
        'line-height': barSize.height,
      }"
      class="verify-bar-area">
      <span class="verify-msg">{{ text }}</span>
    </div>
  </div>
</template>
