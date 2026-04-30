import { ref, onMounted, onBeforeUnmount } from 'vue';
import dayjs from 'dayjs';

export default function (format = 'YYYY-MM-DD HH:mm:ss') {
  let timer: any;
  const time = ref('');
  const setTime = () => {
    time.value = dayjs().format(format);
  };
  onMounted(() => {
    setTime();
    timer = setInterval(() => {
      setTime();
    }, 1000);
  });
  onBeforeUnmount(() => {
    if (timer) clearInterval(timer);
  });

  return {
    time,
  };
}
