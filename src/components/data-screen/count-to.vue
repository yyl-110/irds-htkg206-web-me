<template>
  <span>{{ displayValue }}</span>
</template>

<script lang="ts">
const defaultEasingFn = (t: number, b: number, c: number, d: number) =>
  (c * (-Math.pow(2, (-10 * t) / d) + 1) * 1024) / 1023 + b;

export default {
  name: 'CountTo',
};
</script>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    startVal?: number;
    endVal?: number;
    duration?: number;
    autoplay?: boolean;
    decimals?: number;
    decimal?: string;
    separator?: string;
    prefix?: string;
    suffix?: string;
    useEasing?: boolean;
    easingFn?: (progress: number, localStartVal: number, intervalVal: number, localDuration: number) => number;
  }>(),
  {
    startVal: 0,
    endVal: 2017,
    duration: 3000,
    autoplay: true,
    decimals: 0,
    decimal: '.',
    separator: ',',
    prefix: '',
    suffix: '',
    useEasing: true,
    easingFn: defaultEasingFn,
  }
);

const emit = defineEmits<{
  (event: 'callback'): void;
  (event: 'mountedCallback'): void;
}>();

const localStartVal = ref(props.startVal);
const displayValue = ref('');
const printVal = ref<number | null>(null);
const paused = ref(false);
const localDuration = ref(props.duration);
const startTime = ref<number | null>(null);
const remaining = ref(0);
const rAF = ref<number | null>(null);

const countDown = computed(() => props.startVal > props.endVal);

const isNumber = (val: unknown) => !Number.isNaN(parseFloat(String(val)));

const formatNumber = (num: number) => {
  const fixed = num.toFixed(props.decimals);
  const x = fixed.split('.');
  let x1 = x[0];
  const x2 = x.length > 1 ? props.decimal + x[1] : '';
  const rgx = /(\d+)(\d{3})/;

  if (props.separator && !isNumber(props.separator)) {
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, `$1${props.separator}$2`);
    }
  }

  return `${props.prefix}${x1}${x2}${props.suffix}`;
};

const cancel = () => {
  if (rAF.value !== null) {
    cancelAnimationFrame(rAF.value);
    rAF.value = null;
  }
};

const count = (timestamp: number) => {
  if (!startTime.value) {
    startTime.value = timestamp;
  }

  const progress = timestamp - startTime.value;
  remaining.value = localDuration.value - progress;

  if (props.useEasing) {
    if (countDown.value) {
      printVal.value = localStartVal.value - props.easingFn(progress, 0, localStartVal.value - props.endVal, localDuration.value);
    } else {
      printVal.value = props.easingFn(progress, localStartVal.value, props.endVal - localStartVal.value, localDuration.value);
    }
  } else if (countDown.value) {
    printVal.value = localStartVal.value - ((localStartVal.value - props.endVal) * progress) / localDuration.value;
  } else {
    printVal.value = localStartVal.value + ((props.endVal - localStartVal.value) * progress) / localDuration.value;
  }

  if (countDown.value) {
    printVal.value = (printVal.value ?? props.endVal) < props.endVal ? props.endVal : printVal.value;
  } else {
    printVal.value = (printVal.value ?? props.endVal) > props.endVal ? props.endVal : printVal.value;
  }

  displayValue.value = formatNumber(printVal.value ?? props.endVal);

  if (progress < localDuration.value) {
    rAF.value = requestAnimationFrame(count);
  } else {
    emit('callback');
  }
};

const start = () => {
  cancel();
  localStartVal.value = props.startVal;
  startTime.value = null;
  localDuration.value = props.duration;
  paused.value = false;
  rAF.value = requestAnimationFrame(count);
};

const pause = () => {
  cancel();
};

const resume = () => {
  startTime.value = null;
  localDuration.value = +remaining.value;
  localStartVal.value = +(printVal.value ?? props.startVal);
  rAF.value = requestAnimationFrame(count);
};

const pauseResume = () => {
  if (paused.value) {
    resume();
    paused.value = false;
    return;
  }

  pause();
  paused.value = true;
};

const reset = () => {
  startTime.value = null;
  cancel();
  displayValue.value = formatNumber(props.startVal);
};

onMounted(() => {
  displayValue.value = formatNumber(props.startVal);

  if (props.autoplay) {
    start();
  }

  emit('mountedCallback');
});

onUnmounted(() => {
  cancel();
});

watch(
  () => props.startVal,
  () => {
    if (props.autoplay) {
      start();
    }
  }
);

watch(
  () => props.endVal,
  () => {
    if (props.autoplay) {
      start();
    }
  }
);

defineExpose({
  start,
  pause,
  resume,
  pauseResume,
  reset,
});
</script>
