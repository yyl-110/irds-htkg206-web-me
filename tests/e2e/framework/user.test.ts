import { test } from '../framework-test'
import { TestConfig } from '../../fixtures/TestConfig'

const user = {
  用户姓名: 'E2E测试账号1',
  归属部门: 'test',
  手机号码: '19012121212',
  邮箱: '19012121212@test.com',
  用户名称: `${TestConfig.DATA_PREFIX}USER_1`,
  用户密码: 'hp2MYg!UMYG$rY',
  用户性别: '男',
  备注: 'E2E测试账号1',
}

/** 需要验证的字段 */
const checkFields: Array<keyof typeof user> = ['用户名称', '用户名称', '手机号码']

/** 在编辑时需要修改的字段 */
const modifyFields: Array<keyof typeof user> = ['用户姓名']

test.describe.serial('系统管理 - 用户管理', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TestConfig.SYSTEM_USER_PAGE_URL)
  })
  test('新增用户', async ({ crudPage }) => {
    await crudPage.toAdd() // 点击新增按钮
    await crudPage.fillFormData(user) // 将 user 数据填充到表单中
    await crudPage.toSubmit() // 点击确定按钮
    await crudPage.waitForHiddeAllModal() // 等待弹窗关闭
    await crudPage.checkTableData({ data: user, includes: checkFields, query: true })
  })
  test('修改用户', async ({ crudPage }) => {
    await crudPage.fillFormData(user, { includes: checkFields }) // 填充表单数据
    await crudPage.toQuery() // 点击查询按钮
    await crudPage.toEdit() // 点击编辑按钮
    await crudPage.fillFormData(user, { modifyFields })
    await crudPage.toSubmit() // 点击提交按钮
    await crudPage.waitForHiddeAllModal()
    await crudPage.checkTableData({ data: user, modifyFields, includes: checkFields, query: true, count: 1 }) // 检测查询到的数据是否符合查询条件
  })

  test('删除用户', async ({ crudPage }) => {
    await crudPage.fillFormData(user, { modifyFields, includes: checkFields }) // 填充表单数据
    await crudPage.toQuery() // 点击查询按钮
    await crudPage.checkTableData({ data: user, includes: checkFields, modifyFields, count: 1 }) // 检测查询到的数据是否符合查询条件
    await crudPage.toDelete() // 点击删除按钮
    await crudPage.fillFormData(user, { modifyFields }) // 填充表单数据
    await crudPage.toQuery() // 点击查询按钮
    await crudPage.checkTableData({ count: 0 }) // 检测查询到的数据是否符合查询条件
  })
})
