import { ref } from 'vue'

// 自定义loading的icon
const svgDom = `
<g clip-path="url(#paint0_angular_3443_11119_clip_path)" data-figma-skip-parse="true"><g transform="matrix(0.02275 0 0 0.02275 28 28)"><foreignObject x="-1087.91" y="-1087.91" width="2175.82" height="2175.82"><div xmlns="http://www.w3.org/1999/xhtml" style="background:conic-gradient(from 90deg,rgba(255, 255, 255, 0.0001) 0deg,rgba(1, 88, 240, 1) 360deg);height:100%;width:100%;opacity:1"></div></foreignObject></g></g><path fill-rule="evenodd" clip-rule="evenodd" d="M28 43.75C36.6985 43.75 43.75 36.6985 43.75 28C43.75 19.3015 36.6985 12.25 28 12.25C19.3015 12.25 12.25 19.3015 12.25 28C12.25 36.6985 19.3015 43.75 28 43.75ZM28 50.75C40.5645 50.75 50.75 40.5645 50.75 28C50.75 15.4355 40.5645 5.25 28 5.25C15.4355 5.25 5.25 15.4355 5.25 28C5.25 40.5645 15.4355 50.75 28 50.75Z" fill="rgba(1,88,240,1)" data-figma-gradient-fill="{&quot;type&quot;:&quot;GRADIENT_ANGULAR&quot;,&quot;stops&quot;:[{&quot;color&quot;:{&quot;r&quot;:1.0,&quot;g&quot;:1.0,&quot;b&quot;:1.0,&quot;a&quot;:9.9999997473787516e-05},&quot;position&quot;:0.0},{&quot;color&quot;:{&quot;r&quot;:0.0039215688593685627,&quot;g&quot;:0.34509804844856262,&quot;b&quot;:0.94117647409439087,&quot;a&quot;:1.0},&quot;position&quot;:1.0}],&quot;stopsVar&quot;:[{&quot;color&quot;:{&quot;r&quot;:1.0,&quot;g&quot;:1.0,&quot;b&quot;:1.0,&quot;a&quot;:9.9999997473787516e-05},&quot;position&quot;:0.0},{&quot;color&quot;:{&quot;r&quot;:0.0039215688593685627,&quot;g&quot;:0.34509804844856262,&quot;b&quot;:0.94117647409439087,&quot;a&quot;:1.0},&quot;position&quot;:1.0}],&quot;transform&quot;:{&quot;m00&quot;:45.50,&quot;m01&quot;:0.0,&quot;m02&quot;:5.250,&quot;m10&quot;:0.0,&quot;m11&quot;:45.50,&quot;m12&quot;:5.250},&quot;opacity&quot;:1.0,&quot;blendMode&quot;:&quot;NORMAL&quot;,&quot;visible&quot;:true}"/>
<defs><clipPath id="paint0_angular_3443_11119_clip_path"><path fill-rule="evenodd" clip-rule="evenodd" d="M28 43.75C36.6985 43.75 43.75 36.6985 43.75 28C43.75 19.3015 36.6985 12.25 28 12.25C19.3015 12.25 12.25 19.3015 12.25 28C12.25 36.6985 19.3015 43.75 28 43.75ZM28 50.75C40.5645 50.75 50.75 40.5645 50.75 28C50.75 15.4355 40.5645 5.25 28 5.25C15.4355 5.25 5.25 15.4355 5.25 28C5.25 40.5645 15.4355 50.75 28 50.75Z"/></clipPath></defs>
`
// loadingConfig配置类型定义
interface LoadingConfig {
  svg?: string
  svgViewBox?: string
  body?: boolean
  target?: string | HTMLElement
  fullscreen?: boolean
  lock?: boolean
  text?: string
  spinner?: string
  background?: string
  customClass?: string
  size?: string // small 小号(16*16) large 大号(56*56) normal 中号(32*32)【默认中号】
  beforeClose?: Function
  closed?: Function
}

// 通用默认loading样式配置
const defaultLoadingConfig = {
  svg: svgDom,
  svgViewBox: '0 0 56 56'
}

const useLoading = () => {
  const isLoading = ref<boolean | LoadingConfig>(false)

  // 开启loading
  const startLoading = (config: LoadingConfig = {}) => {
    // @ts-ignore
    isLoading.value = { ...defaultLoadingConfig, ...config, customClass: `${config.size} ${config.customClass ?? ''}` }
  }
  // 关闭loading
  const closeLoading = () => {
    // @ts-ignore
    isLoading.value = false
  }

  return {
    isLoading,
    startLoading,
    closeLoading
  }
}

export default useLoading
