<template>
  <template v-if="svg">
    <svg-icon :icon-class="icon" :svg-class="className" :style="{ color: color, fontSize: size }" />
  </template>
  <template v-else>
    <i
      :class="[iconType, `${iconPrefix}-${icon}`, className]"
      :style="{ color: color, fontSize: size }"
    ></i>
  </template>
</template>

<script>
export default {
  name: 'GsIcon',
  props: {
    icon: {
      type: String,
      require: true
    },
    iconPrefix: {
      type: String,
      default: 'gs-icon'
    },
    iconType: {
      type: String,
      default: 'gsfont'
    },
    size: {
      type: String
    },
    color: {
      type: String
    },
    svg: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ''
    }
  }
}
</script>
