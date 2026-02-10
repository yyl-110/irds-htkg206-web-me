import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVNode } from 'vue'
import { props as customItemProps } from './data/customItem'
import WeiSchemaForm from '@/wei-components/WeiSchemaForm/index.vue'

describe('[WeiSchemaForm] 自定义表单项', () => {
  it('渲染传入的自定义表单项', () => {
    const wrapper = mount(WeiSchemaForm, {
      props: customItemProps as any,
      slots: {
        $username: createVNode('div', {
          'data-test': 'test',
        }),
      },
    })
    expect(wrapper.find('[data-test="test"]').exists()).toBe(true)
  })
})
