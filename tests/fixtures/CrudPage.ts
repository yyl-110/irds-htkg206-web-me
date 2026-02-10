import type { BrowserContext, Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { CaptchaImage } from '../utils/CaptchaImage'
import { TestConfig, TestConfigAccount } from './TestConfig'
import type { FrameworkPage } from './FrameworkPage'
import { E2eFormData, E2eFormItemHandler, E2eFormValue } from './utils/form'

/**
 * CRUD 操作 fixture
 *
 * 此类封装了针对于此框架的 CRUD 操作
 *
 * ## 使用
 * ```typescript
 * import { test, expect } from '../framework-test'
 *
 * test('test title', async ({ page, crudPage }) => {
 *   // 等待并断言弹窗关闭
 *   await crudPage.waitForModalClose()
 * })
 * ```
 */
export class CrudPage {
  constructor(
    public readonly page: Page,
    public readonly frameworkPage: FrameworkPage,
    public readonly context: BrowserContext,
  ) {}
  /**
   * 获取指定字段对应的表单元素(包含表单元素的 .ant-form-item-control 的子元素)
   * @param label 字段名
   * @param fieldName 字段名
   * @returns 包含表单元素的 .ant-form-item-control 的子元素
   */
  private async _getFormElement(label: Locator, fieldName: string) {
    const formItem = await this.page.locator('.ant-form-item:visible').filter({ has: label }).last()
    const formInputElement = await formItem.locator('.ant-form-item-control > *')
    return formInputElement
  }
  /**
   * 断言指定 locator 元素的数量(大于或等于)
   * @param locator 元素
   * @param locatorCount 预期的元素数量
   * @param gt 大于
   */
  async expectLocatorCount(locator: Locator, message: string, locatorCount: number = 1, gt?: boolean) {
    const count = await locator.count()
    if (gt) {
      await expect(count, message).toBeGreaterThan(locatorCount)
    } else {
      await expect(count, message).toBe(locatorCount)
    }
  }
  /**
   * 填充指定字段
   * @param fieldName 字段
   * @param value 值
   */
  async fillFormDataField<D extends E2eFormData>(fieldName: string, value: E2eFormValue, options?: CrudPageFillFormDataOptions<D>) {
    // 等待内容为 fieldName 的 label 元素渲染完毕
    await this.page.waitForSelector(`label:has-text("${fieldName}")`)
    /** 内容为 fieldName 的 label 元素 */
    const labels = this.page.locator(`label:has-text("${fieldName}")`)
    await this.expectLocatorCount(labels,  `应该存在内容为 ${fieldName} 的 label 元素`, 0, true)
    const label = await (options && options.first) ? labels.first() : labels.last()

    const formInputElement = await this._getFormElement(label, fieldName)
    await E2eFormItemHandler.handle(formInputElement, value, this.page, this.frameworkPage)
  }
  /**
   * 填充指定字段
   * @param fieldName 字段
   * @param value 值
   */
  async checkFormDataField<D extends E2eFormData>(fieldName: string, value: E2eFormValue, options?: CrudPageFillFormDataOptions<D>) {
    // 等待内容为 fieldName 的 label 元素渲染完毕
    await this.page.waitForSelector(`label:has-text("${fieldName}")`)
    /** 内容为 fieldName 的 label 元素 */
    const labels = this.page.locator(`label:has-text("${fieldName}")`)
    await this.expectLocatorCount(labels,  `应该存在内容为 ${fieldName} 的 label 元素`, 0, true)
    const label = await (options && options.first) ? labels.first() : labels.last()

    const formInputElement = await this._getFormElement(label, fieldName)
    return await E2eFormItemHandler.check(formInputElement, value, this.page, this.frameworkPage)
  }
  /**
   * 按指定规则过滤数据
   * @param data 数据
   * @param options 过滤选项
   * @returns 过滤后的数据
   */
  private _filterData<D extends E2eFormData>(data: D, options?: CrudPageDataOptions<D>): Partial<D> {
    if (!options) return data
    const resultData: Partial<D> = {}
    for (const fieldName in data) {
      if (options.replaceFields) {
        if (options.replaceFields[fieldName]) {
          const value = data[fieldName]
          Reflect.deleteProperty(data, fieldName)
          data[options.replaceFields[fieldName]] = value
        }
      }
      if (options.modifyFields) {
        if (options.modifyFields.includes(fieldName)) {
          if (typeof data[fieldName] === 'string') resultData[fieldName] = TestConfig.MODIFY_DATA_SUFFIX + data[fieldName] as any
        }
      } else if (options.includes || options.excludes) {
        if (options.includes && !options.includes.includes(fieldName)) continue
        if (options.excludes && options.excludes.includes(fieldName)) continue
        resultData[fieldName] = data[fieldName]
      }
    }
    return resultData
  }
  /**
   * 填充表单数据
   * @param formData 表单数据
   */
  async fillFormData<D extends E2eFormData>(formData: D, options?: CrudPageFillFormDataOptions<D>) {
    const data = this._filterData(formData, options)
    for (const fieldName in data) {
      await this.fillFormDataField(fieldName, data[fieldName], options)
    }
    return data
  }
  /**
   * 验证表单数据
   * @param formData 表单数据
   */
  async checkFormData<D extends E2eFormData>(formData: D, options?: CrudPageFillFormDataOptions<D>) {
    const data = this._filterData(formData, options)
    for (const fieldName in data) {
      const result = await this.checkFormDataField(fieldName, data[fieldName], options)
      expect(result, `${fieldName} 字段值应该为 ${data[fieldName]}, 实际值为 ${result?.formItemValue}`).toBeUndefined
      if (!result) result
    }
  }
  // async getVisibleLocator(locator: Locator) {
  //   for (const el of await locator.all()) {
  //     const isVisible = await el.isVisible()
  //     if (isVisible) return el
  //   }
  // }
  async toClickButton(text: string | RegExp) {
    const buttons = this.page.locator('.ant-btn:visible', { hasText: text })
    // const button = await this.getVisibleLocator(buttons)
    const button = buttons.first()
    expect(button, 'button not found').not.toBeUndefined()
    if (button) await button.click()
  }
  /** 点击查询按钮并等待表格数据更新 */
  async toQuery() {
    await this.toClickButton(/查\s*询/)
  }
  /** 点击新增按钮 */
  async toAdd() {
    await this.toClickButton(/新\s*增/)
  }
  /** 点击确定按钮 */
  async toSubmit() {
    await this.toClickButton(/确\s*定/)
  }
  /** 获取第一行的最后一个 td */
  private async _getRirstRowLastCell() {
    const hasVxeTable = await this.frameworkPage.hasVxeTable()
    let td: Locator | null = null
    if (hasVxeTable) {
      const fixedRightTd = await this.frameworkPage.waitForSelectorSlient(this.page.locator('.vxe-table--fixed-wrapper .vxe-table--body-wrapper .vxe-table--body tr:visible').first().locator('td').last(), 200)
      if (fixedRightTd) td = fixedRightTd
      const bodyTd = await this.frameworkPage.waitForSelectorSlient(this.page.locator('.vxe-table--main-wrapper .vxe-table--body-wrapper .vxe-table--body tr:visible').first().locator('td').last(), 200)
      if (bodyTd) td = bodyTd
    } else {
      td = await this.page.locator('tr.ant-table-row:visible').first().locator('td').last()
    }
    // expect(td, '应该存在首行的最后一个 td').not.toBeNull()
    if (td === null) throw new Error('应该存在首行的最后一个 td')
    await td.evaluate(item => item.scrollIntoView()) // 将 td 移动到可视区域
    return td
  }
  /**
   * 在点击表格中的操作按钮之前执行, 用于使操作列(最后一列)出现在可视区域内, 并将鼠标移入每个子元素(触发可能存在的 `dropdown`)
   * @returns td locator
   */
  private async _beforeClickTableButton() {
    const hasVxeTable = await this.frameworkPage.hasVxeTable(100)
    const td = await this._getRirstRowLastCell()
    // 在点击之前将鼠标移入 td 的所有子元素中, 以触发可能存在的 dropdown 组件
    await this.frameworkPage.mouseMoveLocator(td.locator(hasVxeTable ? '.vxe-cell > *' : '> *'))
    return td
  }
  /**
   * 点击表格操作列(最后一列) 中的包含指定内容的按钮
   * @param hasText 按钮的内容
   */
  async toClickTableButton(hasText: string | RegExp) {
    const td = await this._beforeClickTableButton()
    const button = td.locator('a, button', { hasText })
    await button.click()
    return button
  }
  /** 点击修改按钮(首行) */
  async toEdit() {
    const td = await this._beforeClickTableButton()
    const editButton = await this.frameworkPage.waitForAllSelectorRaceSlient([
      td.locator('a, button', { hasText: /(修改|编辑)/ }).first(), // td 中可能存在的编辑按钮
      this.page.locator('.ant-dropdown-menu-item', { hasText: /(修改|编辑)/ }).first(), // dropdown 中的编辑按钮
    ])
    expect(editButton, '应该存在 修改 / 编辑 按钮').not.toBeNull()
    /** td 中的 dropdown 触发后渲染的下拉菜单中的内容为编辑的菜单 */
    if (editButton) await editButton.click()
  }
  /** 点击删除按钮(首行) */
  async toDelete() {
    const td = await this._beforeClickTableButton()
    // 点击删除按钮, 再点击 popover 中的确定按钮
    const tdButtonPromise = new Promise(async (resolve) => {
      /** td 中可能存在的编辑按钮 */
      const tdButton = await this.frameworkPage.waitForSelectorSlient(td.locator('a, button', { hasText: '删除' }).first())
      if (tdButton === null) return
      await tdButton.click()
      const popover = await this.frameworkPage.waitForSelectorSlient('.ant-popover.ant-popconfirm:visible')
      if (!popover) return
      const confirmButton = await popover.locator('button', { hasText: /确\s*定/ })
      const c = await confirmButton.count()
      await confirmButton.click()
      resolve(0)
    })
    const dropdownPromise = new Promise(async (resolve) => {
      /** dropdown 中可能存在的删除按钮 */
      const dropdownButton = await this.frameworkPage.waitForSelectorSlient(
        this.page.locator('.ant-dropdown-menu-item', { hasText: '删除' }).first()
      )
      if (dropdownButton === null) return
      dropdownButton.click()
      const confirmTitle = this.frameworkPage.waitForSelectorSlient(
        this.page.locator('.ant-modal-confirm-body', { hasText: '删除' })
      )
      if (confirmTitle === null) throw new Error('Missing the expected deletion confirmation pop-up')
      await this.page.locator('.ant-modal-confirm-body-wrapper .ant-btn', { hasText: /确\s*定/ }).click()
      await this.waitForHiddeAllModal()
      resolve(0)
    })
    await Promise.race([
      tdButtonPromise,
      dropdownPromise,
    ])
  }
  /** 等待所有 a-modal 关闭 */
  async waitForHiddeAllModal() {
    const modals = await this.page.locator('.ant-modal').all()
    for (const modal of modals) {
      await modal.waitFor({ state: 'hidden' })
    }
  }
  /** 等待表格数据加载并渲染完毕 */
  async waitForTableLoaded() {
    await this.frameworkPage.waitForTableLoading() // 等待表格加载数据并渲染完毕
  }
  /**
   * 验证表格数据是否满足要求
   * @description 可验证表格中的数据是否符合预期, 可断言 数据条数 / 数据内容 等, 详见 {@link CrudPageCheckTableDataOption}
   */
  async checkTableData<D extends E2eFormData>(options: CrudPageCheckTableDataOption<D>) {
    // 等待弹窗关闭
    if (options.modal) await expect(this.page.locator('.ant-modal'), '弹窗关闭').toBeVisible({ visible: false })
    // 先将传入的 data 填充到查询表单中进行查询
    if (options.query && options.data) {
      await this.fillFormData(options.data, options) // 填充表单数据
      await this.toQuery() // 点击查询按钮
    }
    try {
      // 等待表格数据加载完毕
      await this.frameworkPage.waitForTableLoading() // 等待表格加载数据并渲染完毕
    } catch(err) {
      console.log('[warning] 未监听到表格的 loading 状态, 可能是表格数据未更新')
      if (err && (err as any).name !== 'TimeoutError') console.log(err) // 错误原因不是 timeout 时打印 err
    }
    const tableInfo = await this.frameworkPage.getTableData()
    // 验证数据量
    if (typeof options.count === 'number') {
      expect(tableInfo.body.length).toBe(options.count)
    } else if (typeof options.lt === 'number') {
      expect(tableInfo.body.length).toBeLessThan(0)
    } else if (typeof options.gt === 'number') {
      expect(tableInfo.body.length).toBeGreaterThan(0)
    }
    // 验证表格数据
    if (options.data) {
      const _data = this._filterData(options.data, options)
      let fields = Object.keys(_data)
      for (const row of tableInfo.body) {
        for (const fieldName of fields) {
          const content = await row[fieldName].textContent()
          expect(content).toContain(_data[fieldName])
        }
      }
    }
    return tableInfo
  }
  /**
   * 获取表格中首行最后一列(操作列)中的包含指定内容的按钮
   * @param text 按钮包含的文本内容
   */
  async clickFirstRowButton(text: string | RegExp) {
    const td = await this._beforeClickTableButton()
    const button = await this.frameworkPage.waitForSelectorSlient(
      td.locator('a, button', { hasText: text }).first(), // td 中可能存在的编辑按钮
    )
    if (!button) throw new Error( `应该存在 ${text} 按钮`)
    return button
  }
}

export interface CrudPageDataOptions<D extends E2eFormData> {
  /** 包含的字段 */
  includes?: Array<keyof D>
  /** 排除的字段 */
  excludes?: Array<keyof D>
  /** 在编辑时需要修改的字段, **将忽略其余字段** */
  modifyFields?: Array<keyof D>
  /** 需要替换字段名的字段 */
  replaceFields?: Partial<Record<keyof D, string>>,
}

export interface CrudPageFillFormDataOptions<D extends E2eFormData> extends CrudPageDataOptions<D> {
  /** 当存在多个元素时, 选择第一个元素 */
  first?: boolean
}

export interface CrudPageCheckTableDataOption<D extends E2eFormData> extends CrudPageDataOptions<D> {
  /**
   * 所有表格数据的检测匹配规则
   * @description 用于验证每一个字段值的内容是否符合预期
   */
  data?: D
  /** 数据量 */
  count?: number
  /** 数据量(小于) */
  lt?: number
  /** 数据量(大于) */
  gt?: number
  /** 是否等待 modal 关闭 */
  modal?: boolean
  /** 是否在验证数据之前先进行查询 */
  query?: boolean
}
