import { expect, Locator, Page } from "@playwright/test"
import type { FrameworkPage } from "../FrameworkPage"

/** 需要填充的表单字段值 */
export type E2eFormValue = string | Array<string> | null | undefined
/**
 * 需要填充的表单数据
 * @description `key` 为字段名称, `value` 为需要填充的值
 */
export type E2eFormData = Record<string, E2eFormValue>

export interface E2eFormValueCheckResult {
  /** 当前表单元素值 */
  formItemValue: E2eFormValue,
  /** 预期表单元素值 */
  value: E2eFormValue,
  /** 当前表单元素值是否与预期值相等 */
  result: boolean
}

/**
 * e2e 测试中的表单元素的操作类
 * @description 用于定义为表单元素填充值时的具体操作
 */
export abstract class E2eFormItemHandler {
  constructor(
    /** page fixture */
    public page: Page,
    /** framework page fixture */
    public frameworkPage: FrameworkPage,
  ) {}
  /**
   * 
   * @param formItemWrapper 表单项元素或表单项元素的 wrapper 元素
   * @param value 表单项的值
   * @param page page fixture
   * @param frameworkPage framework page fixture
   */
  public abstract clear?(formItemWrapper: Locator, value: E2eFormValue): Promise<void>
  /**
   * 将指定的值填充到表单元素中
   * @param formItemWrapper 表单项元素或表单项元素的 wrapper 元素
   * @param value 表单项的值
   * @param page page fixture
   * @param frameworkPage framework page fixture
   */
  public abstract fill(formItemWrapper: Locator, value: E2eFormValue): Promise<void>
  /**
   * 获取表单项的值
   */
  public abstract getValue(formItemWrapper: Locator, value: E2eFormValue): Promise<E2eFormValue>
  /**
   * 获取表单项数据并验证是否符合要求
   */
  public async check(formItemWrapper: Locator, value: E2eFormValue): Promise<E2eFormValueCheckResult> {
    const formItemValue = await this.getValue(formItemWrapper, value)
    const result = await E2eFormItemHandler.checkValue(formItemValue, value)
    return { formItemValue, value, result }
  }
  /**
   * 是否是当前指定的表单元素
   * @description 优先级高于 {@link selector}
   * @param formItemWrapper 表单项的 wrapper 元素
   */
  public abstract isCurrentFormItem?(formItemWrapper: Locator): Promise<boolean>
  /**
   * 当前表单元素的 selector
   * @description 当需要更精准和复杂的选择逻辑时应该使用 {@link isCurrentFormItem}
   */
  public abstract selector?: string
  /**
   * 点击清空图标按钮
   * @param formItemWrapper 表单项元素或表单项元素的 wrapper 元素
   */
  public async toClickClearButton(formItemWrapper: Locator) {
    const clearIconButton = await this.frameworkPage.waitForSelectorSlient(formItemWrapper.locator('.ant-select-clear'), 300)
    if (clearIconButton) await clearIconButton.click()
  }
  /** 所有表单元素操作集合 */
  private static _handlers: Array<E2eFormItemHandler> = []
  /** 所有表单元素操作集合 */
  private static getHandlers(page: Page, frameworkPage: FrameworkPage): Array<E2eFormItemHandler> {
    return this._initHandlers(page, frameworkPage)
    // return E2eFormItemHandler._handlers.length
    //   ? E2eFormItemHandler._handlers
    //   : (E2eFormItemHandler._handlers = E2eFormItemHandler._initHandlers(page, frameworkPage))
  }
  private static _initHandlers(page: Page, frameworkPage: FrameworkPage) {
    const headers: Array<E2eFormItemHandler> = [
      new E2eWeiUserTransferSelectorFormItemHandler(page, frameworkPage),
      new E2eAntTreeFormItemHandler(page, frameworkPage),
      new E2eAntRadioFormItemHandler(page, frameworkPage),
      new E2eAntTreeSelectFormItemHandler(page, frameworkPage),
      new E2eAntSelectFormItemHandler(page, frameworkPage),
      new E2eAntInputFormItemHandler(page, frameworkPage),
    ]
    return headers
  }
  // /** 所有表单元素操作集合 */
  // static handlers: Array<E2eFormItemHandler> = [
  //   // wei-user-transfer-selector-component-tree-transfer(用户部门选择器)
  //   E2eFormItemHandler.createByIncludeSelector(
  //     '.wei-user-transfer-selector-component-tree-transfer',
  //     async (formItem: Locator, value: E2eFormValue, page: Page) => {
  //       if (!value) { // 清空
  //         return await formItem.locator('.ant-select-clear').click()
  //       }
  //       const selection: Array<string> = Array.isArray(value) ? value : [value]
        
  //       await formItem.locator('button.ant-btn').last().click()
  //       const modal = await page.locator('.wei-user-transfer-selector-component-modal').last()
  //       await modal.getByPlaceholder('请输入搜索内容').first().click()
  //       for (const selectItem of selection) {
  //         await modal.getByPlaceholder('请输入搜索内容').first().fill(selectItem)
  //         await modal.getByText(selectItem).first().dblclick()
  //       }
  //       await modal.locator('button', { hasText: /确\s*定/ }).click()
  //     },
  //     true,
  //   ),
  //   // ant-tree 可选择的 tree 组件选择器
  //   new E2eFormItemHandler(
  //     async (formItem: Locator, value: E2eFormValue, page: Page, frameworkPage: FrameworkPage) => {
  //       if (!value) return
  //       const selection = Array.isArray(value) ? value : [value]
  //       let selectionCount: number = 0
  //       const selectionMap: Record<string, boolean> = {}
  //       for (const item of selection) {
  //         selectionMap[item] = false
  //       }
  //       await frameworkPage.scrollToBottom(formItem.locator('.ant-tree-list-holder'), 500, async () => {
  //         if (selectionCount >= selection.length) {
  //           console.log('[ant-tree] form item handler: All elements have been processed')
  //           return true
  //         }
  //         const currentSelectionList = await formItem.locator('.ant-tree-list-holder-inner').evaluate(async (list, selectionMap) => {
  //           const _selectionList: Array<string> = []
  //           function delay(timeout: number) {
  //             return new Promise(resolve => setTimeout(resolve, timeout))
  //           }
  //           const items = Array.from<HTMLElement>(list.querySelectorAll('.ant-tree-treenode'))
  //           for (const item of items) {
  //             if (selectionMap[item.innerText] === false) {
  //               console.log('innerTexxt: ', item.innerText, item.querySelector<HTMLElement>('.ant-tree-checkbox'))
  //               const checkbox = item.querySelector<HTMLElement>('.ant-tree-checkbox')
  //               if (checkbox) {
  //                 checkbox.click()
  //                 await delay(300) // 每次点击后增加延迟机制
  //               }
  //               selectionMap[item.innerText] = true
  //               _selectionList.push(item.innerText)
  //             }
  //           }
  //           return _selectionList
  //         }, selectionMap)
  //         for (const item of currentSelectionList) {
  //           selectionMap[item] = true
  //           selectionCount++
  //         }
  //       })
  //     },
  //     async (formItemWrapper: Locator, page: Page) => {
  //       const checkbox = await formItemWrapper.locator('.ant-tree')
  //       const count = await checkbox.count()
  //       return count > 0
  //     }
  //   ),
  //   // ant-radio-group 单选
  //   E2eFormItemHandler.createByIncludeSelector(
  //     '.ant-radio-group',
  //     async (formItem: Locator, value: E2eFormValue, page: Page) => {
  //       if (!value) return
  //       await formItem.locator('.ant-radio-wrapper', { hasText: value.toString() }).click()
  //     },
  //   ),
  //   // a-tree-selector 树选择器
  //   E2eFormItemHandler.createByIncludeSelector(
  //     '.ant-select.ant-tree-select',
  //     async (formItem: Locator, value: E2eFormValue, page: Page) => {
  //       if (!value) return
  //       await formItem.locator('.ant-select-selection-search-input').last().fill(value.toString())
  //       await page.locator('span.ant-select-tree-node-content-wrapper').filter({ hasText: value.toString() }).first().click()
  //     },
  //   ),
  //   // a-selector 普通选择器
  //   E2eFormItemHandler.createByIncludeSelector(
  //     '.ant-select',
  //     async (formItem: Locator, value: E2eFormValue, page: Page) => {
  //       await formItem.click()
  //       await page.locator('.ant-select-item:visible > .ant-select-item-option-content').filter({ hasText: value!.toString() }).last().click()
  //     },
  //   ),
  //   // 可以直接通过 `getByRole` 选中(基本所有的 `antdv` 表单元素都支持) 并且应该直接 `fill(value)` 的表单项元素
  //   // E2eFormItemHandler.create('.ant-input-number-input'),
  //   // E2eFormItemHandler.create('.ant-input'),
  // ]
  /**
   * 处理表单数据的填充和验证
   * @param formItemWrapper 表单项元素或表单项元素的 wrapper 元素
   * @param value 表单项的值
   * @param page page fixture
   * @param frameworkPage framework page fixture
   */
  static async handle(formItemWrapper: Locator, value: E2eFormValue, page: Page, frameworkPage: FrameworkPage) {
    for (const handler of E2eFormItemHandler.getHandlers(page, frameworkPage)) {
      let isCurrentFormItem = false
      if (handler.isCurrentFormItem) {
        isCurrentFormItem = await handler.isCurrentFormItem(formItemWrapper)
      } else if (handler.selector) {
        const count = await formItemWrapper.locator(handler.selector).count()
        isCurrentFormItem = count === 1
      }
      if (!isCurrentFormItem) continue
      await handler.fill(formItemWrapper, value)
      break
    }
  }
  /**
   * 处理表单数据的填充和验证
   * @param formItemWrapper 表单项元素或表单项元素的 wrapper 元素
   * @param value 表单项的值
   * @param page page fixture
   * @param frameworkPage framework page fixture
   */
  static async check(formItemWrapper: Locator, value: E2eFormValue, page: Page, frameworkPage: FrameworkPage) {
    for (const handler of E2eFormItemHandler.getHandlers(page, frameworkPage)) {
      let isCurrentFormItem = false
      if (handler.isCurrentFormItem) {
        isCurrentFormItem = await handler.isCurrentFormItem(formItemWrapper)
      } else if (handler.selector) {
        const count = await formItemWrapper.locator(handler.selector).count()
        isCurrentFormItem = count === 1
      }
      if (!isCurrentFormItem) continue
      const result = await handler.check(formItemWrapper, value)
      if (!result.result) {
        return result
      }
      break
    }
  }
  /**
   * 检查表单项的值是否符合预期
   * @param formItemValue 当前表单项的值
   * @param value 预期的值
   * @returns 表单项的值是否符合预期
   */
  static checkValue(formItemValue: E2eFormValue, value: E2eFormValue) {
    if (formItemValue === value) return true
    if (Array.isArray(formItemValue) && Array.isArray(value)) {
      if (formItemValue.length !== value.length) return false
      const dataMap: Record<string, boolean> = {}
      for (const item of formItemValue) {
        dataMap[item] = true
      }
      for (const item of formItemValue) {
        if (dataMap[item] !== true) return false
      }
      return true
    }
    return true
  }
}

class E2eWeiUserTransferSelectorFormItemHandler extends E2eFormItemHandler {
  public selector: string = '.wei-user-transfer-selector-component-tree-transfer'
  public isCurrentFormItem = undefined
  public clear = undefined
  async fill(formItem: Locator, value: E2eFormValue) {
    if (!value) { // 清空
      return await formItem.locator('.ant-select-clear').click()
    }
    const selection: Array<string> = Array.isArray(value) ? value : [value]
    
    await formItem.locator('button.ant-btn').last().click()
    const modal = await this.page.locator('.wei-user-transfer-selector-component-modal').last()
    await modal.getByPlaceholder('请输入搜索内容').first().click()
    for (const selectItem of selection) {
      await modal.getByPlaceholder('请输入搜索内容').first().fill(selectItem)
      await modal.getByText(selectItem).first().dblclick()
    }
    await modal.locator('button', { hasText: /确\s*定/ }).click()
  }
  public async getValue(formItemWrapper: Locator, value: E2eFormValue): Promise<E2eFormValue> {
    // TODO 处理树结构选中项太过复杂, 暂不实现
    const selectionEl = await formItemWrapper.locator('.ant-select-selection-overflow').innerText()
    return selectionEl.split('\n')
  }
}
class E2eAntTreeFormItemHandler extends E2eFormItemHandler {
  public clear = undefined
  async fill(formItem: Locator, value: E2eFormValue) {
    if (!value) return
    const selection = Array.isArray(value) ? value : [value]
    let selectionCount: number = 0
    const selectionMap: Record<string, boolean> = {}
    for (const item of selection) {
      selectionMap[item] = false
    }
    await this.frameworkPage.scrollToBottom(formItem.locator('.ant-tree-list-holder'), 500, async () => {
      if (selectionCount >= selection.length) {
        console.log('[ant-tree] form item handler: All elements have been processed')
        return true
      }
      const currentSelectionList = await formItem.locator('.ant-tree-list-holder-inner').evaluate(async (list, selectionMap) => {
        const _selectionList: Array<string> = []
        function delay(timeout: number) {
          return new Promise(resolve => setTimeout(resolve, timeout))
        }
        const items = Array.from<HTMLElement>(list.querySelectorAll('.ant-tree-treenode'))
        for (const item of items) {
          if (selectionMap[item.innerText] === false) {
            console.log('innerTexxt: ', item.innerText, item.querySelector<HTMLElement>('.ant-tree-checkbox'))
            const checkbox = item.querySelector<HTMLElement>('.ant-tree-checkbox')
            if (checkbox) {
              checkbox.click()
              await delay(300) // 每次点击后增加延迟机制
            }
            selectionMap[item.innerText] = true
            _selectionList.push(item.innerText)
          }
        }
        return _selectionList
      }, selectionMap)
      for (const item of currentSelectionList) {
        selectionMap[item] = true
        selectionCount++
      }
    })
  }
  public async getValue(formItemWrapper: Locator, value: E2eFormValue): Promise<E2eFormValue> {
    // TODO 处理树结构选中项太过复杂, 暂不实现
    return []
  }
  public async check(formItemWrapper: Locator, value: E2eFormValue): Promise<E2eFormValueCheckResult> {
    // TODO 处理树结构选中项太过复杂, 暂不实现
    return { formItemValue: [], value, result: true }
  }
  public async isCurrentFormItem(formItemWrapper: Locator): Promise<boolean> {
    const tree = await formItemWrapper.locator('.ant-tree')
    const count = await tree.count()
    return count === 1
  }
  public selector?: string | undefined
}

class E2eAntRadioFormItemHandler extends E2eFormItemHandler {
  public clear = undefined
  public isCurrentFormItem = undefined
  public selector: string = '.ant-radio-group'
  public async fill(formItemWrapper: Locator, value: E2eFormValue): Promise<void> {
    if (!value) return
    await formItemWrapper.locator('.ant-radio-wrapper', { hasText: value.toString() }).click()
  }
  public async getValue(formItemWrapper: Locator, value: E2eFormValue): Promise<E2eFormValue> {
    const checkedItem = await formItemWrapper.locator('.ant-radio-button-checked')
    return await checkedItem.innerText()
  }
}

class E2eAntTreeSelectFormItemHandler extends E2eFormItemHandler {
  public selector: string = '.ant-select.ant-tree-select'
  public isCurrentFormItem = undefined
  public clear = undefined
  public async fill(formItemWrapper: Locator, value: E2eFormValue): Promise<void> {
    if (!value) return await this.toClickClearButton(formItemWrapper)
    await formItemWrapper.locator('.ant-select-selection-search-input').last().fill(value.toString())
    await this.page.locator('span.ant-select-tree-node-content-wrapper').filter({ hasText: value.toString() }).first().click()
  }
  public async getValue(formItemWrapper: Locator, value: E2eFormValue): Promise<E2eFormValue> {
    const select = await formItemWrapper.locator('.ant-select')
    const classList = Array.from(await select.evaluate(el => el.classList))
    if (classList.includes('ant-select-single')) {
      return await formItemWrapper.locator('.ant-select-selection-item').innerText()
    } else {
      return (await formItemWrapper.locator('.ant-select-selection-overflow').innerText()).split('\n')
    }
  }
}

class E2eAntSelectFormItemHandler extends E2eFormItemHandler {
  public selector: string = '.ant-select'
  public isCurrentFormItem = undefined
  public async clear(formItemWrapper: Locator, value: E2eFormValue): Promise<void> {
    const closeButtons = await formItemWrapper.locator('.anticon.anticon-close, .ant-select-clear').all()
    for (const button of closeButtons) {
      await button.click()
      await this.page.waitForTimeout(300)
    }
  }
  public async fill(formItemWrapper: Locator, value: E2eFormValue): Promise<void> {
    await this.clear(formItemWrapper, value)
    if (value !== null) {
      await formItemWrapper.locator('.ant-select').click()
      const valueList = Array.isArray(value) ? value : [value]
      for (const _value of valueList) {
        await this.page.locator('.ant-select-item:visible > .ant-select-item-option-content').filter({ hasText: _value }).last().click()
        await this.page.waitForTimeout(300)
      }
    }
  }
  public async getValue(formItemWrapper: Locator, value: E2eFormValue): Promise<E2eFormValue> {
    const select = await formItemWrapper.locator('.ant-select')
    const classList = Array.from(await select.evaluate(el => el.classList))
    if (classList.includes('ant-select-single')) {
      return await formItemWrapper.locator('.ant-select-selection-item').innerText()
    } else {
      return (await formItemWrapper.locator('.ant-select-selection-overflow').innerText()).split('\n')
    }
  }
}

/**
 * 包含 a-input 的元素, 作为兜底的数据填充策略
 */
class E2eAntInputFormItemHandler extends E2eFormItemHandler {
  public clear = undefined
  public async fill(formItemWrapper: Locator, value: E2eFormValue): Promise<void> {
    const el = await formItemWrapper.locator(this.selector)
    const count = await el.count()
    if (count === 0) return
    await el.fill(value ? value.toString() : '')
  }
  public async getValue(formItemWrapper: Locator, value: E2eFormValue): Promise<E2eFormValue> {
    const el = await formItemWrapper.locator(this.selector)
    const _value = await el.inputValue()
    return _value
  }
  public isCurrentFormItem = undefined
  public selector: string = '.ant-input'
}
