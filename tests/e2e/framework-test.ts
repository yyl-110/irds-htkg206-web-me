import { test as base } from '@playwright/test'
import { CrudPage } from 'tests/fixtures/CrudPage'
import { FrameworkPage } from '../fixtures/FrameworkPage'

// Declare the types of your fixtures.
interface MyFixtures {
  /** 与具体业务或页面无关的应用级的操作 fixture */
  frameworkPage: FrameworkPage
  /** CRUD 操作 fixture */
  crudPage: CrudPage
}

/**
 * 提供用于测试框架功能的 test / expect
 * @description 此处的 test 中扩展了封装的 [fixtures](https://playwright.dev/docs/test-fixtures) / [parameters](https://playwright.dev/docs/test-parameterize)
 */
export const test = base.extend<MyFixtures>({
  /**
   * framework page fixture
   * @param root0
   * @param root0.page
   * @param root0.context
   * @param use
   */
  frameworkPage: async ({ page, context }, use) => {
    // Set up the fixture.
    const todoPage = new FrameworkPage(page, context)

    // Use the fixture value in the test.
    await use(todoPage)
  },
  /**
   * crud fixture
   * @param root0
   * @param root0.page
   * @param root0.context
   * @param root0.frameworkPage
   * @param use
   */
  crudPage: async ({ page, frameworkPage, context }, use) => {
    const crudPage = new CrudPage(page, frameworkPage, context)
    await use(crudPage)
  },
})

export { expect } from '@playwright/test'
