import { test } from '../framework-test'
import { TestConfig } from '../../fixtures/TestConfig'

/** 一级部门 ID */
const parentName = TestConfig.generateUniqueId()

/** 子部门数据 */
const testData = {
  上级部门: parentName,
  部门名称: TestConfig.generateUniqueId(),
  显示排序: '23',
  负责人: 'codegen6',
  状态: '开启',
}

/** 一级部门数据 */
const parentTestData = {
  上级部门: '',
  部门名称: parentName,
  显示排序: '23',
  负责人: 'codegen6',
  状态: '开启',
}

const includes: Array<keyof typeof testData> = ['部门名称', '状态']

console.log('一级部门数据', parentTestData)
console.log('子部门数据', testData)

test.describe.serial('系统管理 - 部门管理', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TestConfig.SYSTEM_DEPT_PAGE_URL)
  })
  test('新增(一级)部门', async ({ crudPage }) => {
    await crudPage.toAdd()
    await crudPage.fillFormData(parentTestData)
    await crudPage.toSubmit() // 点击确定按钮
    await crudPage.waitForHiddeAllModal()
    // await frameworkPage.waitForTableLoading() // 等待表格数据更新
    await crudPage.fillFormData(parentTestData, { includes }) // 填充表单数据
    await crudPage.toQuery() // 点击查询按钮
    await crudPage.checkTableData({ data: parentTestData, includes, count: 1 }) // 检测查询到的数据是否符合查询条件
  })
  test('新增(下级)部门', async ({ crudPage }) => {
    await crudPage.toAdd()
    await crudPage.fillFormData(testData)
    await crudPage.toSubmit() // 点击查询按钮
    await crudPage.waitForHiddeAllModal()
    // await frameworkPage.waitForTableLoading() // 等待表格数据更新
    await crudPage.fillFormData(testData, { includes }) // 填充表单数据
    await crudPage.toQuery() // 点击查询按钮
    await crudPage.checkTableData({ data: testData, includes, count: 1 }) // 检测查询到的数据是否符合查询条件
  })
  test('查询(按部门筛选)', async ({ crudPage }) => {
    await crudPage.fillFormData(testData, { includes }) // 填充表单数据
    await crudPage.toQuery() // 点击查询按钮
    await crudPage.checkTableData({ data: testData, includes, count: 1 }) // 检测查询到的数据是否符合查询条件
  })
  test('修改(下级)部门', async ({ crudPage }) => {
    await crudPage.fillFormData(testData, { includes }) // 填充表单数据
    await crudPage.toQuery() // 点击查询按钮
    await crudPage.checkTableData({ data: testData, includes, count: 1 }) // 检测查询到的数据是否符合查询条件
    await crudPage.toEdit() // 点击编辑按钮
    const modifyData = await crudPage.fillFormData(testData, { modifyFields: ['部门名称'] })
    await crudPage.toSubmit() // 点击提交按钮
    await crudPage.waitForHiddeAllModal()
    await crudPage.fillFormData(modifyData, { includes }) // 填充表单数据
    await crudPage.toQuery() // 点击查询按钮
    await crudPage.checkTableData({ data: modifyData, includes, count: 1 }) // 检测查询到的数据是否符合查询条件
  })
  test('删除下级部门', async ({ crudPage }) => {
    // 删除下级部门
    await crudPage.fillFormData(testData, { modifyFields: ['部门名称'] }) // 填充表单数据
    await crudPage.toQuery() // 点击查询按钮
    await crudPage.checkTableData({ data: testData, modifyFields: ['部门名称'], count: 1 }) // 检测查询到的数据是否符合查询条件
    await crudPage.toDelete() // 点击编辑按钮
    await crudPage.fillFormData(testData, { modifyFields: ['部门名称'] }) // 填充表单数据
    await crudPage.toQuery() // 点击查询按钮
    await crudPage.checkTableData({ count: 0 }) // 检测查询到的数据是否符合查询条件
  })
  test('删除一级部门', async ({ crudPage }) => {
    // 删除一级部门
    await crudPage.fillFormData(parentTestData, { includes: ['部门名称'] }) // 填充表单数据
    await crudPage.toQuery() // 点击查询按钮
    await crudPage.checkTableData({ data: parentTestData, includes: ['部门名称'], count: 1 }) // 检测查询到的数据是否符合查询条件
    await crudPage.toDelete() // 点击编辑按钮
    await crudPage.fillFormData(parentTestData, { includes: ['部门名称'] }) // 填充表单数据
    await crudPage.toQuery() // 点击查询按钮
    await crudPage.checkTableData({ count: 0 }) // 检测查询到的数据是否符合查询条件
  })
})
