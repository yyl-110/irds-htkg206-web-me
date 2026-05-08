<script lang="tsx">
/// <reference types="vue/jsx" />
import { computed, defineComponent, PropType } from 'vue'
import { useDictStore, DictDataType } from '@/store/modules/dict'
import { isHexColor } from '@/utils/color'
import { ElTag } from 'element-plus'
import { isArray, isBoolean, isNumber, isString } from '@/utils/is'

/** 与字典项 value 比较（统一成字符串，兼容接口返回 number 与字典 string） */
function matchDictValue(cellVal: string, dictVal: string | number | boolean): boolean {
  return String(cellVal).trim() === String(dictVal).trim()
}

export default defineComponent({
  name: 'DictTag',
  props: {
    type: {
      type: String as PropType<string>,
      required: true,
    },
    value: {
      type: [String, Number, Boolean, Array],
      required: true,
    },
    // 字符串分隔符 只有当 props.value 传入值为字符串时有效
    separator: {
      type: String as PropType<string>,
      default: ',',
    },
    // 每个 tag 之间的间隔，默认为 5px，参考的 el-row 的 gutter
    gutter: {
      type: String as PropType<string>,
      default: '5px',
    },
  },
  setup(props) {
    const dictStore = useDictStore()

    /** 直接依赖 dictMap，字典异步拉取完成后会触发重渲染（避免仅调 action 未订阅 state） */
    const dictOptions = computed(() => {
      if (!dictStore.isSetDict) {
        void dictStore.setDictMap()
      }
      const list = dictStore.dictMap[props.type]
      return Array.isArray(list) ? list : []
    })

    const valueArr = computed(() => {
      // 1. 是 Number 类型和 Boolean 类型的情况
      if (isNumber(props.value) || isBoolean(props.value)) {
        return [String(props.value)]
      }
      // 2. 是字符串（进一步判断是否有包含分隔符号 -> props.sepSymbol ）
      if (isString(props.value)) {
        return props.value.split(props.separator).map(s => s.trim())
      }
      // 3. 数组
      if (isArray(props.value)) {
        return props.value.map(v => String(v).trim())
      }
      return []
    })

    const renderDictTag = () => {
      if (!props.type) {
        return null
      }
      // 解决自定义字典标签值为零时标签不渲染的问题
      if (props.value === undefined || props.value === null || props.value === '') {
        return null
      }

      const options = dictOptions.value
      if (!options.length) {
        return null
      }

      return (
        <div
          class="dict-tag"
          style={{
            display: 'inline-flex',
            gap: props.gutter,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {options.map((dict: DictDataType) => {
            const hit = valueArr.value.some((val: string) => matchDictValue(val, dict.value))
            if (!hit) return undefined

            let colorType = dict.colorType
            if (String(colorType) === 'primary' || String(colorType) === 'default') {
              colorType = ''
            }
            const hexBg = dict?.cssClass && isHexColor(dict.cssClass) ? dict.cssClass : ''
            return (
              // 仅自定义十六进制背景时使用白字；内置 success/warning 等浅色底保留组件默认深色字，避免白字看不清
              <ElTag
                style={hexBg ? 'color: #fff' : ''}
                type={
                  (colorType ? (colorType as 'primary' | 'success' | 'warning' | 'info' | 'danger') : undefined) as
                    | 'primary'
                    | 'success'
                    | 'warning'
                    | 'info'
                    | 'danger'
                    | undefined
                }
                color={hexBg}
                disableTransitions={true}>
                {dict?.label}
              </ElTag>
            )
          })}
        </div>
      )
    }
    return () => renderDictTag()
  },
})
</script>
