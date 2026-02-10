/**
 *水印添加方法
 * @param str1
 * @param str2
 */
// function setWatermark(str1: any, str2: any) {
//   const id = 'watermark_id'
//   if (document.getElementById(id) !== null) {
//     document.body.removeChild(document.getElementById(id))
//   }
//   const can = document.createElement('canvas')
//   // 设置canvas画布大小
//   can.width = 400
//   can.height = 280
//   const cans = can.getContext('2d')
//   if (cans) {
//     cans.rotate(-20 * Math.PI / 180) // 水印旋转角度
//     cans.font = 'bold 15px  微软雅黑'

//     cans.fillStyle = 'rgb(222,122,122)'
//     cans.textAlign = 'center'
//     cans.textBaseline = 'middle'

//     cans.fillText('WEICHΛI', can.width / 2, can.height - 22) // 水印在画布的位置x，y轴
//     // 稍微偏移后绘制第二遍以实现加粗效果
//     // cans.fillText('', can.width / 2 - 1, can.height - 22 + 1)
//     // cans.fillText('', can.width / 2 + 1, can.height - 22 - 1)
//     // cans.fillText('', can.width / 2 - 1, can.height - 22 - 1)
//     // cans.fillText('', can.width / 2 + 1, can.height - 22 + 1)

//     cans.font = 'bold 15px  微软雅黑'
//     cans.fillText(str1, can.width / 2, can.height) // 水印在画布的位置x，y轴
//     cans.fillText(str2, can.width / 2, can.height + 22)
//   }

//   const div = document.createElement('div')
//   div.id = id
//   div.style.pointerEvents = 'none'
//   div.style.top = '40px'
//   div.style.left = '0px'
//   div.style.opacity = '0.15'
//   div.style.position = 'fixed'
//   div.style.zIndex = '100000'
//   div.style.width = `${document.documentElement.clientWidth}px`
//   div.style.height = `${document.documentElement.clientHeight}px`
//   div.style.background = `url(${can.toDataURL('image/png')}) left top repeat`
//   document.body.appendChild(div)
//   return id
// }

function setWatermark(str1: any, str2: any) {
  const id = 'watermark_id';
  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id));
  }
  const can = document.createElement('canvas');
  // 设置canvas画布大小
  can.width = 400;
  can.height = 280;
  const cans = can.getContext('2d');
  if (cans) {
    // 加载图片
    // const img = new Image()
    // img.src = getUrl()
    // img.onload = function () {
    //   // 绘制图片
    //   cans.drawImage(img, 30, 50, can.width, can.height)
    // }

    cans.rotate((-20 * Math.PI) / 180); // 水印旋转角度
    cans.font = 'bold 24px Arial, sans-serif';
    cans.fillStyle = 'rgb(222,122,122)';
    cans.textAlign = 'center';
    cans.textBaseline = 'middle';
    cans.fillText('CRRC', can.width / 2, can.height - 22); // 水印在画布的位置x，y轴

    cans.font = 'bold 16px  微软雅黑';
    cans.fillText(str1, can.width / 2, can.height); // 水印在画布的位置x，y轴
    cans.fillText(str2, can.width / 2, can.height + 22);
  }

  const div = document.createElement('div');
  div.id = id;
  div.style.pointerEvents = 'none';
  div.style.top = '40px';
  div.style.left = '0px';
  div.style.opacity = '0.15';
  div.style.position = 'fixed';
  div.style.zIndex = '100000';
  div.style.width = `${document.documentElement.clientWidth}px`;
  div.style.height = `${document.documentElement.clientHeight}px`;
  div.style.background = `url(${can.toDataURL('image/png')}) left top repeat`;
  document.body.appendChild(div);
  return id;
}

// 添加水印方法
export function setWaterMark(str1: any, str2: any) {
  let id = setWatermark(str1, str2);
  if (document.getElementById(id) === null) {
    id = setWatermark(str1, str2);
  }
}

// 移除水印方法
export function removeWatermark() {
  const id = 'watermark_id';
  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id));
  }
}

/**
 *
 * @param imageName 获取图片地址
 * @param imageUrl
 */
/**
 * 获取图片资源的URL地址
 *
 * @returns 图片资源的URL地址
 */
function getUrl() {
  return new URL(`@/assets/images/watermark.png`, import.meta.url).href;
}
