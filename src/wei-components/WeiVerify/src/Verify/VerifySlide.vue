<script name="VerifySlide" lang="ts" setup type="text/babel">
import { computed, getCurrentInstance, nextTick, onMounted, reactive, ref, toRefs, watch } from 'vue';
/**
 * VerifySlide
 * @description 滑块
 */
import { CaptchaImage } from '../../../../../tests/utils/CaptchaImage';
import { aesEncrypt } from './../utils/ase';
import { resetSize } from './../utils/util';
import { AdminApiSystemCaptcha } from '@/api/tags/管理后台验证码';
// import { swaggerApi } from '@/httpRequest';

const props = defineProps({
  captchaType: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: '1',
  },
  // 弹出式pop，固定fixed
  mode: {
    type: String,
    default: 'fixed',
  },
  vSpace: {
    type: Number,
    default: 5,
  },
  explain: {
    type: String,
    default: '',
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
  blockSize: {
    type: Object,
    default() {
      return {
        width: '50px',
        height: '50px',
      };
    },
  },
  barSize: {
    type: Object,
    default() {
      return {
        width: '310px',
        height: '30px',
      };
    },
  },
});

/**
 * ~~translate~~
 * @param k key
 * @param t text
 */
const t = (k: string, t: string) => t;
const { mode, captchaType, type, blockSize, explain } = toRefs(props);
const currentInstance = getCurrentInstance();

if (!currentInstance || !currentInstance.proxy || !currentInstance.proxy.$parent) throw new Error('Internal Error: Missing currentInstance');

const proxy = currentInstance.proxy;
const secretKey = ref(''); // 后端返回的ase加密秘钥
const passFlag = ref(false); // 是否通过的标识
const backImgBase = ref(''); // 验证码背景图片
const blockBackImgBase = ref(''); // 验证滑块的背景图片
const backToken = ref(''); // 后端返回的唯一token值
const startMoveTime = ref(0); // 移动开始的时间
const endMovetime = ref(0); // 移动结束的时间
const tipWords = ref('');
const text = ref('');
const finishText = ref('');
const setSize = reactive({
  imgHeight: 0,
  imgWidth: 0,
  barHeight: 0,
  barWidth: 0,
});
const moveBlockLeft = ref<string | number>('');
const leftBarWidth = ref<string | number | undefined>(undefined);
// 移动中样式
const moveBlockBackgroundColor = ref('');
const leftBarBorderColor = ref('#ddd');
const iconColor = ref('');
const iconClass = ref('icon-right');
const status = ref(false); // 鼠标状态
const isEnd = ref(false); // 是够验证完成
const showRefresh = ref(true);
const transitionLeft = ref('');
const transitionWidth = ref('');
const startLeft = ref(0);

const barArea = computed(() => {
  return proxy.$el.querySelector('.verify-bar-area');
});

/**
 * init
 */
function init() {
  if (explain.value === '') text.value = t('captcha.slide', '向右滑动完成验证');
  else text.value = explain.value;

  getPictrue();
  nextTick(() => {
    const { imgHeight, imgWidth, barHeight, barWidth } = resetSize(proxy);
    setSize.imgHeight = imgHeight;
    setSize.imgWidth = imgWidth;
    setSize.barHeight = barHeight;
    setSize.barWidth = barWidth;
    proxy.$parent?.$emit('ready', proxy);
  });

  window.removeEventListener('touchmove', e => {
    move(e);
  });
  window.removeEventListener('mousemove', e => {
    move(e);
  });

  // 鼠标松开
  window.removeEventListener('touchend', () => {
    end();
  });
  window.removeEventListener('mouseup', () => {
    end();
  });

  window.addEventListener('touchmove', e => {
    move(e);
  });
  window.addEventListener('mousemove', e => {
    move(e);
  });

  // 鼠标松开
  window.addEventListener('touchend', () => {
    end();
  });
  window.addEventListener('mouseup', () => {
    end();
  });
}
watch(type, () => {
  init();
});
onMounted(() => {
  // 禁止拖拽
  init();
  proxy.$el.onselectstart = function () {
    return false;
  };
});
/**
 * 鼠标按下
 * @param e event
 */
function start(e: MouseEvent | TouchEvent) {
  e = e || window.event;
  const x = (e as TouchEvent).touches ? (e as TouchEvent).touches[0].pageX : (e as MouseEvent).clientX;
  startLeft.value = Math.floor(x - barArea.value.getBoundingClientRect().left);
  startMoveTime.value = +new Date(); // 开始滑动的时间
  if (isEnd.value === false) {
    text.value = '';
    moveBlockBackgroundColor.value = '#337ab7';
    leftBarBorderColor.value = '#337AB7';
    iconColor.value = '#fff';
    e.stopPropagation();
    status.value = true;
  }
}
/**
 * 鼠标移动
 * @param e event
 */
function move(e: MouseEvent | TouchEvent) {
  e = e || window.event;
  if (status.value && isEnd.value === false) {
    const x = (e as TouchEvent).touches ? (e as TouchEvent).touches[0].pageX : (e as MouseEvent).clientX;
    const bar_area_left = barArea.value.getBoundingClientRect().left;
    let move_block_left = x - bar_area_left; // 小方块相对于父元素的left值
    if (move_block_left >= barArea.value.offsetWidth - Number.parseInt((Number.parseInt(blockSize.value.width) / 2).toString()) - 2) {
      move_block_left = barArea.value.offsetWidth - Number.parseInt((Number.parseInt(blockSize.value.width) / 2).toString()) - 2;
    }
    if (move_block_left <= 0) move_block_left = Number.parseInt((Number.parseInt(blockSize.value.width) / 2).toString());

    // 拖动后小方块的left值
    moveBlockLeft.value = `${move_block_left - startLeft.value}px`;
    leftBarWidth.value = `${move_block_left - startLeft.value}px`;
  }
}

/**
 * 鼠标松开
 */
function end() {
  endMovetime.value = +new Date();
  // 判断是否重合
  if (status.value && isEnd.value === false) {
    let moveLeftDistance = Number.parseInt((moveBlockLeft.value || '').toString().replace('px', ''));
    moveLeftDistance = (moveLeftDistance * 310) / Number.parseInt(setSize.imgWidth.toString());
    const data = {
      captchaType: captchaType.value,
      pointJson: secretKey.value ? aesEncrypt(JSON.stringify({ x: moveLeftDistance, y: 5.0 }), secretKey.value) : JSON.stringify({ x: moveLeftDistance, y: 5.0 }),
      token: backToken.value,
    };
    AdminApiSystemCaptcha.check1(data).then(response => {
      const res = response.data;
      if (res.repCode === '0000') {
        moveBlockBackgroundColor.value = '#5cb85c';
        leftBarBorderColor.value = '#5cb85c';
        iconColor.value = '#fff';
        iconClass.value = 'icon-check';
        showRefresh.value = false;
        isEnd.value = true;
        if (mode.value === 'pop') {
          setTimeout(() => {
            (proxy.$parent as any).clickShow = false;
            // refresh();
          }, 1500);
        }
        passFlag.value = true;
        const time = startMoveTime.value ? endMovetime.value - startMoveTime.value : 0;
        tipWords.value = `${(time / 1000).toFixed(2)}s
            ${t('captcha.success', '验证成功')}`;
        const captchaVerification = secretKey.value
          ? aesEncrypt(`${backToken.value}---${JSON.stringify({ x: moveLeftDistance, y: 5.0 })}`, secretKey.value)
          : `${backToken.value}---${JSON.stringify({ x: moveLeftDistance, y: 5.0 })}`;
        setTimeout(() => {
          tipWords.value = '';
          (proxy.$parent as any).closeBox();
          proxy.$parent?.$emit('success', { captchaVerification });
        }, 1000);
      } else {
        moveBlockBackgroundColor.value = '#d9534f';
        leftBarBorderColor.value = '#d9534f';
        iconColor.value = '#fff';
        iconClass.value = 'icon-close';
        passFlag.value = false;
        setTimeout(() => {
          refresh();
        }, 1000);
        proxy.$parent?.$emit('error', proxy);
        tipWords.value = t('captcha.fail', '验证失败');
        setTimeout(() => {
          tipWords.value = '';
        }, 1000);
      }
    });
    status.value = false;
  }
}

/** 刷新验证码 */
async function refresh() {
  showRefresh.value = true;
  finishText.value = '';

  transitionLeft.value = 'left .3s';
  moveBlockLeft.value = 0;

  leftBarWidth.value = undefined;
  transitionWidth.value = 'width .3s';

  leftBarBorderColor.value = '#ddd';
  moveBlockBackgroundColor.value = '#fff';
  iconColor.value = '#000';
  iconClass.value = 'icon-right';
  isEnd.value = false;

  await getPictrue();
  setTimeout(() => {
    transitionWidth.value = '';
    transitionLeft.value = '';
    text.value = explain.value;
  }, 300);
}

const loading = ref(false);

interface RepData {
  originalImageBase64: string;
  jigsawImageBase64: string;
  token: string;
  secretKey: string;
}

/** 是否已执行拖动验证码 */
const autoDragCaptchaImage = ref(false);

/**
 * 请求背景图片和验证图片
 */
async function getPictrue() {
  const data = {
    type: captchaType.value,
  };
  loading.value = true;
  try {
    // const res = await getCode(data)
    // const res = await Service.get(data)
    const res = await AdminApiSystemCaptcha.get(data);
    const repData = res.data.repData as RepData;
    if (res.data.repCode === '0000') {
      backImgBase.value = repData.originalImageBase64;
      blockBackImgBase.value = repData.jigsawImageBase64;
      backToken.value = repData.token;
      secretKey.value = repData.secretKey;

      // 在登录时是否自动拖动验证码
      // if (!autoDragCaptchaImage.value && import.meta.env.VITE_AUTO_DRAG_CAPTCHA_IMAGE && import.meta.env.DEV) {
      //   autoDragCaptchaImage.value = true
      //   nextTick(async () => {
      //     const captchImage = new CaptchaImage(backImgBase.value || '', blockBackImgBase.value || '')
      //     const distance = await captchImage.getMoveLeftDistance(400)
      //     status.value = true
      //     moveBlockLeft.value = `${distance}px`
      //     end()
      //   })
      // }
    } else {
      tipWords.value = res.data.repMsg || '';
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div style="position: relative">
    <a-spin :spinning="loading" tip="加载中...">
      <div v-if="type === '2'" :style="{ height: `${parseInt(setSize.imgHeight.toString()) + vSpace}px` }" class="verify-img-out">
        <div :style="{ width: setSize.imgWidth, height: setSize.imgHeight }" class="verify-img-panel">
          <img v-if="backImgBase" :src="`data:image/png;base64,${backImgBase}`" alt="" style="width: 100%; height: 100%; display: block" />
          <div v-show="showRefresh" class="verify-refresh" @click="refresh">
            <i class="iconfont icon-refresh" />
          </div>
          <transition name="tips">
            <span v-if="tipWords" :class="passFlag ? 'suc-bg' : 'err-bg'" class="verify-tips">
              {{ tipWords }}
            </span>
          </transition>
        </div>
      </div>
      <!-- 公共部分 -->
      <div :style="{ width: setSize.imgWidth, height: barSize.height, 'line-height': barSize.height }" class="verify-bar-area">
        <span class="verify-msg" v-text="text" />
        <div
          :style="{
            width: leftBarWidth !== undefined ? leftBarWidth : barSize.height,
            height: barSize.height,
            'border-color': leftBarBorderColor,
          }"
          class="verify-left-bar">
          <span class="verify-msg" v-text="finishText" />
          <div
            :style="{
              width: barSize.height,
              height: barSize.height,
              'background-color': moveBlockBackgroundColor,
              left: moveBlockLeft,
              transition: transitionLeft,
            }"
            class="verify-move-block"
            @mousedown="start"
            @touchstart="start">
            <i class="verify-icon iconfont" :class="[iconClass]" :style="{ color: iconColor }" />
            <div
              v-if="type === '2'"
              :style="{
                width: `${Math.floor((parseInt(setSize.imgWidth.toString()) * 47) / 310)}px`,
                height: setSize.imgHeight,
                top: `-${parseInt(setSize.imgHeight.toString()) + vSpace}px`,
                'background-size': `${setSize.imgWidth} ${setSize.imgHeight}`,
              }"
              class="verify-sub-block">
              <img v-if="backImgBase" :src="`data:image/png;base64,${blockBackImgBase}`" alt="" style="width: 100%; height: 100%; display: block; -webkit-user-drag: none" />
            </div>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>
