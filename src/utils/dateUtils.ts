/**
 * 将毫秒，转换成时间字符串。例如说，xx 分钟
 *
 * @param ms 毫秒
 * @returns {string} 字符串
 */
export function getDate(ms) {
  const day = Math.floor(ms / (24 * 60 * 60 * 1000));
  const hour = Math.floor((ms / (60 * 60 * 1000) - day * 24));
  const minute = Math.floor(((ms / (60 * 1000)) - day * 24 * 60 - hour * 60));
  const second = Math.floor((ms / 1000 - day * 24 * 60 * 60 - hour * 60 * 60 - minute * 60));
  if (day > 0) {
    return day + "天" + hour + "小时" + minute + "分钟";
  }
  if (hour > 0) {
    return hour + "小时" + minute + "分钟";
  }
  if (minute > 0) {
    return minute + "分钟";
  }
  if (second > 0) {
    return second + "秒";
  } else {
    return 0 + "秒";
  }
}

export function beginOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function endOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

export function betweenDay(date1, date2) {
  date1 = convertDate(date1);
  date2 = convertDate(date2);
  // 计算差值
  return Math.floor((date2.getTime() - date1.getTime()) / (24 * 3600 * 1000));
}

export function formatDate(date, fmt) {
  date = convertDate(date);
  const o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "H+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) { // 年份
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}

export function addTime(date, time) {
  date = convertDate(date);
  return new Date(date.getTime() + time);
}

export function convertDate(date) {
  if (typeof date === 'string') {
    return new Date(date);
  }
  return date;
}


// 防抖
export function debounce(fn, delay = 500) {
  let timer;
  return function (args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, ...args);
    }, delay)
  }
}

// 节流
export function throttle(fn, delay = 500) {
  let timer, last
  return function () {
    let th = this;
    let args = arguments
    let now = +new Date()
    if (last && now - last < delay) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        last = now
        fn.apply(th, args)
      }, delay)
    } else {
      last = now
      fn.apply(th, args)
    }
  }
}

// 生成uuid
export function uuid(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [], i;
  radix = radix || chars.length;

  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    var r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}

// 时间戳转时分秒
export function getTimes(timestamp) {
  const date = new Date(parseInt(timestamp))
  const Year = date.getFullYear()
  const Moth = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
  const Day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
  // const Hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
  // const Minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
  // const Sechond = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
  const YMD = Year + "-" + Moth + "-" + Day
  return YMD
}

export function getAllTimes(timestamp) {
  const date = new Date(parseInt(timestamp))
  const Year = date.getFullYear()
  const Moth = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
  const Day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
  const Hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
  const Minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
  const Sechond = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
  const YMD = Year + "-" + Moth + "-" + Day + " " + Hour + ":" + Minute + ":" + Sechond
  return YMD
}