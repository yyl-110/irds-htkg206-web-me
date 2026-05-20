import GsIcon from './index.vue'

GsIcon.install = Vue => {
  window.$vueApp.component(GsIcon.name || '', GsIcon)
}

export default GsIcon
