import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { props as basicProps } from './data/basic'
import WeiSchemaForm from '@/wei-components/WeiSchemaForm/index.vue'

describe('[WeiSchemaForm] 基础表单', () => {
  it('可自定义显示的操作按钮', () => {
    const wrapper = mount(WeiSchemaForm, { props: {
      ...(basicProps as any),
      schemaActionButtons: ['submit', 'reset'],
    } })
    expect(wrapper.find('[data-test="submit"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="reset"]').exists()).toBe(true)
  })
  it('查询表单应该包含 pageNo 和 pageSize 字段', () => {
    const wrapper = mount(WeiSchemaForm, { props: basicProps as any })
    expect(wrapper.find('[dataindex="pageNo"]').exists()).toBe(true)
    expect(wrapper.find('[dataindex="pageSize"]').exists()).toBe(true)
  })
})
