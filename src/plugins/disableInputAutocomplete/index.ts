import type { App, Plugin } from 'vue'
import { Input, Textarea } from 'ant-design-vue'

type InputLikeComponent = {
  props?: Record<string, unknown>
}

/** 为 ant-design-vue 输入类组件设置 autocomplete 默认值 */
function patchComponentAutocompleteDefault(component: InputLikeComponent) {
  if (!component?.props) {
    return
  }
  component.props.autocomplete = {
    type: String,
    default: 'off',
  }
}

function disableNativeInputAutocomplete(el: EventTarget | null) {
  if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) {
    return
  }
  const current = el.getAttribute('autocomplete')
  if (current == null || current === 'on') {
    el.setAttribute('autocomplete', 'off')
  }
  const form = el.closest('form')
  if (form && !form.getAttribute('autocomplete')) {
    form.setAttribute('autocomplete', 'off')
  }
}

const disableInputAutocomplete: Plugin = {
  install(_app: App) {
    patchComponentAutocompleteDefault(Input)
    patchComponentAutocompleteDefault(Input.Password)
    patchComponentAutocompleteDefault(Input.Search)
    patchComponentAutocompleteDefault(Textarea)

    document.addEventListener(
      'focusin',
      (event) => {
        disableNativeInputAutocomplete(event.target)
      },
      true,
    )
  },
}

export default disableInputAutocomplete
