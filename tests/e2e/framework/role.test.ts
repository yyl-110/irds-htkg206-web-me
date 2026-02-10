import { test } from '../framework-test'
import { TestConfig } from '../../fixtures/TestConfig'

const id = TestConfig.generateUniqueId()
const data = {
  角色名称: id,
  角色标识: id,
  状态: '关闭',
  备注: id,
}

/** 需要验证的字段 */
const checkFields: Array<keyof typeof data> = ['角色名称', '角色标识', '状态']

/** 在编辑时需要修改的字段 */
const modifyFields: Array<keyof typeof data> = ['角色名称']

test.describe.serial('系统管理 - 角色管理', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TestConfig.SYSTEM_ROLE_PAGE_URL)
  })
  test('新增角色', async ({ crudPage }) => {
    await crudPage.toAdd() // 点击新增按钮
    await crudPage.fillFormData(data) // 将 user 数据填充到表单中
    await crudPage.toSubmit() // 点击确定按钮
    await crudPage.waitForHiddeAllModal() // 等待弹窗关闭
    await crudPage.checkTableData({ data, includes: checkFields, query: true })
  })
  test('修改角色的菜单权限', async ({ page, crudPage }) => {
    await crudPage.fillFormData(data, { includes: checkFields }) // 填充表单数据
    await crudPage.toQuery() // 点击查询按钮
    await crudPage.toClickTableButton('菜单权限')
    await page.waitForTimeout(800) // 等待编辑组件中的动态数据加载并渲染完成
    await crudPage.fillFormData({ 菜单权限: ['流程类型', '角色管理', '用户查询'] })
    await crudPage.toSubmit() // 点击确定按钮
    await crudPage.waitForHiddeAllModal()
    // TODO 读取菜单权限数据并验证是否修改
    await crudPage.toClickTableButton('菜单权限')
    await page.waitForTimeout(800) // 等待编辑组件中的动态数据加载并渲染完成
    await crudPage.checkFormData({ 菜单权限: ['流程类型', '角色管理', '用户查询'] })
  })
  test('修改用户角色', async ({ crudPage }) => {
    await crudPage.fillFormData(data, { includes: checkFields }) // 填充表单数据
    await crudPage.toQuery() // 点击查询按钮
    await crudPage.toEdit() // 点击编辑按钮
    await crudPage.fillFormData(data, { modifyFields })
    await crudPage.toSubmit() // 点击提交按钮
    await crudPage.waitForHiddeAllModal()
    await crudPage.checkTableData({ data, modifyFields, includes: checkFields, query: true, count: 1 }) // 检测查询到的数据是否符合查询条件
  })
  test('删除角色', async ({ crudPage }) => {
    await crudPage.fillFormData(data, { modifyFields, includes: checkFields }) // 填充表单数据
    await crudPage.toQuery() // 点击查询按钮
    await crudPage.checkTableData({ data, modifyFields, count: 1 }) // 检测查询到的数据是否符合查询条件
    await crudPage.toDelete() // 点击删除按钮
    await crudPage.fillFormData(data, { modifyFields }) // 填充表单数据
    await crudPage.toQuery() // 点击查询按钮
    await crudPage.checkTableData({ count: 0 }) // 检测查询到的数据是否符合查询条件
  })
})
