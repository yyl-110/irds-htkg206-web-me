/**
 * 自定义拖拽指令
 */
// PC端
const dragSwitch = {

  beforeMount(el: any, binding: any) {
    // 判断是否可拖拽
    if (!binding.value) {
      return
    }

    // const dragging = ref(false)
    const handleDrag = (event: string) => {
      binding.value.handleDrag(event)
    }

    // 时间计算
    const startTime = ref(0)

    // 获取相关元素
    const container = el.querySelector('.d_container')
    const header = el.querySelector('.d_container_header')
    header.style.cssText += ';cursor:move;'

    // 获取元素原有属性
    const sty = (function () {
      if ((document.body as any).currentStyle) {
        return (dom: any, attr: any) => dom.currentStyle[attr] // 兼容IE写法
      }
      return (dom: any, attr: any) => getComputedStyle(dom, null)[attr]
    })()

    /**
     * 鼠标按下事件
     * @param e
     */
    header.onmousedown = (e: any) => {
      startTime.value = new Date().getTime()
      const disX = e.clientX - header.offsetLeft
      const disY = e.clientY - header.offsetTop
      const screenWidth = document.body.clientWidth // document.body的可见区域宽度
      const screenHeight = document.documentElement.clientHeight // 可见区域高度(应为body高度，可某些环境下无法获取)

      const containerWidth = container.offsetWidth // 对话框宽度
      const containerheight = container.offsetHeight // 对话框高度

      const minContainerLeft = container.offsetLeft
      const maxContainerLeft = screenWidth - container.offsetLeft - containerWidth

      const minContainerTop = container.offsetTop
      const maxContainerTop = screenHeight - container.offsetTop - containerheight

      // 左偏移距离
      let styL = sty(container, 'left')
      if (styL === 'auto') {
        styL = '0px' // 兼容IE写法
      }

      // 上偏移距离
      let styT = sty(container, 'top')

      // 注意在IE中，第一次获取到的值为组件自带50%，移动之后赋值为px
      if (styL.includes('%')) {
        styL = +document.body.clientWidth * (+styL.replace(/%/g, '') / 100)
        styT = +document.body.clientHeight * (+styT.replace(/%/g, '') / 100)
      }
      else {
        styL = +styL.replace(/px/g, '')
        styT = +styT.replace(/px/g, '')
      }

      /**
       * 鼠标移动事件
       * @param e
       */
      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离
        let left = e.clientX - disX
        let top = e.clientY - disY

        // 边界处理
        if (-(left) > minContainerLeft) {
          left = -(minContainerLeft)
        }
        else if (left > maxContainerLeft) {
          left = maxContainerLeft
        }

        if (-(top) > minContainerTop) {
          top = -(minContainerTop)
        }
        else if (top > maxContainerTop) {
          top = maxContainerTop
        }

        // 移动当前元素
        container.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`
      }

      /**
       * 鼠标松开事件
       * @param e
       */
      document.onmouseup = function (e: any) {
        document.onmousemove = null
        document.onmouseup = null
        const endTime = new Date().getTime()
        const duration = endTime - startTime.value
        handleDrag(duration < 200 ? 'click' : 'drag')
      }

      return false
    }
  },
}
// 移动端
const MovedragSwitch = {

  beforeMount(el: any, binding: any) {
    // 判断是否可拖拽
    if (!binding.value) {
      return
    }

    // const dragging = ref(false)
    const MovehandleDrag = (event: string) => {
      binding.value.MovehandleDrag(event)
    }

    // 时间计算
    const startTime = ref(0)

    // 获取相关元素
    const container = el.querySelector('.d_container')
    const header = el.querySelector('.d_container_header')
    header.style.cssText += ';cursor:move;'

    // 获取元素原有属性
    const sty = (function () {
      if ((document.body as any).currentStyle) {
        return (dom: any, attr: any) => dom.currentStyle[attr] // 兼容IE写法
      }
      return (dom: any, attr: any) => getComputedStyle(dom, null)[attr]
    })()

    /**
     * 鼠标按下事件
     * @param e
     */
    header.ontouchstart = (e: any) => {
      startTime.value = new Date().getTime()
      const disX = e.changedTouches[0].clientX - header.offsetLeft
      const disY = e.changedTouches[0].clientY - header.offsetTop
      const screenWidth = document.body.clientWidth // document.body的可见区域宽度
      const screenHeight = document.documentElement.clientHeight // 可见区域高度(应为body高度，可某些环境下无法获取)

      const containerWidth = container.offsetWidth // 对话框宽度
      const containerheight = container.offsetHeight // 对话框高度

      const minContainerLeft = container.offsetLeft
      const maxContainerLeft = screenWidth - container.offsetLeft - containerWidth

      const minContainerTop = container.offsetTop
      const maxContainerTop = screenHeight - container.offsetTop - containerheight

      // 左偏移距离
      let styL = sty(container, 'left')
      if (styL === 'auto') {
        styL = '0px' // 兼容IE写法
      }

      // 上偏移距离
      let styT = sty(container, 'top')

      // 注意在IE中，第一次获取到的值为组件自带50%，移动之后赋值为px
      if (styL.includes('%')) {
        styL = +document.body.clientWidth * (+styL.replace(/%/g, '') / 100)
        styT = +document.body.clientHeight * (+styT.replace(/%/g, '') / 100)
      }
      else {
        styL = +styL.replace(/px/g, '')
        styT = +styT.replace(/px/g, '')
      }

      /**
       * 鼠标移动事件
       * @param e
       */
      document.ontouchmove = function (e) {
        // 通过事件委托，计算移动的距离
        let left = e.changedTouches[0].clientX - disX
        let top = e.changedTouches[0].clientY - disY

        // 边界处理
        if (-(left) > minContainerLeft) {
          left = -(minContainerLeft)
        }
        else if (left > maxContainerLeft) {
          left = maxContainerLeft
        }

        if (-(top) > minContainerTop) {
          top = -(minContainerTop)
        }
        else if (top > maxContainerTop) {
          top = maxContainerTop
        }

        // 移动当前元素
        container.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`
      }

      /**
       * 鼠标松开事件
       * @param e
       */
      document.ontouchend = function (e: any) {
        document.ontouchmove = null
        document.ontouchend = null
        const endTime = new Date().getTime()
        const duration = endTime - startTime.value
        MovehandleDrag(duration < 200 ? 'click' : 'drag')
      }

      return false
    }
  },
}
/**
 * 定义指令集
 */
export const diyVueDirectives = {
  install(app: any) {
    app.directive('dragSwitch', dragSwitch) // 注册自定义拖拽指令
  },
}
/**
 * 定义指令集
 */
export const MovediyVueDirectives = {
  install(app: any) {
    app.directive('MovedragSwitch', MovedragSwitch) // 注册自定义拖拽指令
  },
}
