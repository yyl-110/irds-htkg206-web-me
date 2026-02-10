import { TestConfig } from '../fixtures/TestConfig'
import { expect, test as setup } from './framework-test'

setup('登录', async ({ frameworkPage }) => {
  await frameworkPage.toLogin()
  expect(frameworkPage.page.url()).not.toBe(TestConfig.LOGIN_URL)
})
