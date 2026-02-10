import { test } from '../framework-test'
import { TestConfig } from '../../fixtures/TestConfig'

const data = {
  字典名称: `${TestConfig.DATA_PREFIX}DICT_TYPE_1`,
  字典类型: `${TestConfig.DATA_PREFIX}DICT_TYPE_1`,
  状态: '开启',
  备注: `${TestConfig.DATA_PREFIX}DICT_TYPE_1`,
}

/** 需要验证的字段 */
const checkFields: Array<keyof typeof data> = ['字典名称', '字典类型', '状态']

/** 在编辑时需要修改的字段 */
const modifyFields: Array<keyof typeof data> = ['字典名称']

const dictData = {
  数据标签: `${data.字典名称}_DATA_1`,
  数据键值: `${data.字典名称}_DATA_1`,
  显示排序: '23',
  状态: '关闭',
  颜色类型: '成功',
  备注: `${data.字典名称}_DATA_1`,
}

/** 需要验证的字段 */
const dataCheckFields = ['字典标签', '字典键值']

/** 需要验证的字段 */
const dataReplaceFields = { 数据标签: '字典标签', 数据键值: '字典键值' }

/** 在编辑时需要修改的字段 */
const dataModifyFields: Array<keyof typeof dictData> = ['数据键值', '数据标签']

test.describe.serial('系统管理 - 字典管理/字典数据管理', () => {
  test.beforeEach(async ({ page }, { title }) => {
    if (title.includes('字典数据'))
      return
    await page.goto(TestConfig.SYSTEM_DICT_URL)
  })

  test('新增字典类型', async ({ crudPage }) => {
    await crudPage.toAdd() // 点击新增按钮
    await crudPage.fillFormData(data) // 将 user 数据填充到表单中
    await crudPage.toSubmit() // 点击确定按钮
    await crudPage.waitForHiddeAllModal() // 等待弹窗关闭
    await crudPage.checkTableData({ data, includes: checkFields, query: true, count: 1 })
  })
  test('新增字典数据', async ({ page, crudPage }) => {
    await page.goto(TestConfig.SYSTEM_DICT_URL)
    await crudPage.fillFormData(data, { includes: checkFields }) // 填充表单数据
    await crudPage.toQuery() // 点击查询按钮
    await crudPage.checkTableData({ count: 1 }) // 获取表格数据
    const dataButton = await crudPage.clickFirstRowButton('数据')
    await dataButton.click()
    await page.waitForURL(`${TestConfig.SYSTEM_DICT_TYPE_DATA_URL}?dictType=${data.字典类型}`) // 等待跳转到字典数据页

    await crudPage.toAdd() // 点击新增按钮
    await crudPage.fillFormData(dictData) // 将数据填充到表单中
    await crudPage.toSubmit() // 点击确定按钮
    await crudPage.waitForHiddeAllModal() // 等待弹窗关闭
    await crudPage.checkTableData({
      data: dictData,
      replaceFields: dataReplaceFields,
      includes: dataCheckFields as any,
      count: 1,
      query: true,
    })
  })
  test('修改字典数据', async ({ page, crudPage }) => {
    await page.goto(`${TestConfig.SYSTEM_DICT_TYPE_DATA_URL}?dictType=${data.字典类型}`) // 等待跳转到字典数据页
    await crudPage.fillFormData(
      dictData,
      {
        includes: ['字典标签'] as any,
        replaceFields: dataReplaceFields,
      },
    ) // 填充表单数据
    await crudPage.toQuery() // 点击查询按钮
    await crudPage.toEdit() // 点击编辑按钮
    const modifyData = await crudPage.fillFormData(dictData, { modifyFields: dataModifyFields })
    await crudPage.toSubmit() // 点击提交按钮
    await crudPage.waitForHiddeAllModal()
    await crudPage.checkTableData({
      data: modifyData,
      replaceFields: dataReplaceFields,
      includes: ['字典标签'] as any,
      count: 1,
      query: true,
    }) // 检测查询到的数据是否符合查询条件
  })
  test('删除字典数据', async ({ page, crudPage }) => {
    await page.goto(`${TestConfig.SYSTEM_DICT_TYPE_DATA_URL}?dictType=${data.字典类型}`) // 等待跳转到字典数据页
    await crudPage.fillFormData(
      dictData,
      {
        modifyFields: dataModifyFields,
        replaceFields: dataReplaceFields,
        includes: ['字典标签'] as any,
      },
    ) // 填充表单数据
    await crudPage.toQuery() // 点击查询按钮
    await crudPage.checkTableData({ data: dictData, modifyFields: dataModifyFields, count: 1 }) // 检测查询到的数据是否符合查询条件
    await crudPage.toDelete() // 点击删除按钮
    await crudPage.fillFormData(
      dictData,
      {
        modifyFields: dataModifyFields,
        replaceFields: dataReplaceFields,
        includes: ['字典标签'] as any,
      },
    ) // 填充表单数据
    await crudPage.toQuery() // 点击查询按钮
    await crudPage.checkTableData({ count: 0 }) // 检测查询到的数据是否符合查询条件
  })
  test('修改字典类型', async ({ crudPage }) => {
    await crudPage.fillFormData(data, { includes: checkFields }) // 填充表单数据
    await crudPage.toQuery() // 点击查询按钮
    await crudPage.toEdit() // 点击编辑按钮
    const modifyData = await crudPage.fillFormData(data, { modifyFields })
    await crudPage.toSubmit() // 点击提交按钮
    await crudPage.waitForHiddeAllModal()
    await crudPage.checkTableData({ data: modifyData, includes: checkFields, query: true, count: 1 }) // 检测查询到的数据是否符合查询条件
  })
  test('删除用户', async ({ crudPage }) => {
    await crudPage.fillFormData(data, { modifyFields, includes: checkFields }) // 填充表单数据
    await crudPage.toQuery() // 点击查询按钮
    await crudPage.checkTableData({ data, modifyFields, count: 1 }) // 检测查询到的数据是否符合查询条件
    await crudPage.toDelete() // 点击删除按钮
    await crudPage.fillFormData(data, { modifyFields, includes: checkFields }) // 填充表单数据
    await crudPage.toQuery() // 点击查询按钮
    await crudPage.checkTableData({ count: 0 }) // 检测查询到的数据是否符合查询条件
  })
})
