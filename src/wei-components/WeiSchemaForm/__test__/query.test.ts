import { describe, expect, it } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import type { FormInstance } from 'ant-design-vue'
import { props as queryProps } from './data/query'
import WeiSchemaForm from '@/wei-components/WeiSchemaForm/index.vue'

describe('[WeiSchemaForm] 查询表单', () => {
  it('存在 expose 的 compnent 属性', () => {
    const wrapper = shallowMount(WeiSchemaForm, { props: queryProps as any })
    const component = (wrapper.vm as any).component as FormInstance
    expect(component).toBeDefined()
  })
  it('布局应该是 inline 样式', () => {
    const wrapper = mount(WeiSchemaForm, { props: queryProps as any })
    const form = (wrapper.vm as any).component as HTMLFormElement
    expect(form.attributes.getNamedItem('layout')?.value).toBe('inline')
  })
  it('查询表单应该不包含 pageNo 和 pageSize 字段', () => {
    const wrapper = mount(WeiSchemaForm, { props: queryProps as any })
    expect(wrapper.find('div.ant-form-item[dataindex="pageNo"]').exists()).toBe(false)
    expect(wrapper.find('div.ant-form-item[dataindex="pageSize"]').exists()).toBe(false)
  })
})
