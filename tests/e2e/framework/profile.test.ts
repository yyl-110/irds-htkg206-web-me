import { expect, test } from '../framework-test'
import { TestConfig, TestConfigAccount } from '../../fixtures/TestConfig'

test.describe.skip('个人中心', () => {
// test.describe.serial('个人中心', () => {
  test('进入个人中心页面', async ({ frameworkPage }) => {
    await frameworkPage.page.goto(TestConfig.HOME_PAGE_URL)
    await frameworkPage.page.waitForURL(url => url.href !== TestConfig.LOGIN_URL, { timeout: 1500 })
  })
  test('修改密码(重置)', async ({ page, frameworkPage }) => {
    await page.goto(TestConfig.HOME_PAGE_URL)
    await frameworkPage.toLogout()
    await frameworkPage.toLogin(TestConfigAccount.ProfilePageUser)
    await page.goto(TestConfig.HOME_PAGE_URL)
    await page.getByLabel('旧密码').click()
    await page.getByLabel('旧密码').fill(TestConfigAccount.ProfilePageTestUser.username)
    await page.getByLabel('旧密码').press('Tab')
    await page.getByLabel('新密码').fill(TestConfigAccount.ProfilePageTestUser.password)
    await page.getByLabel('新密码').press('Tab')
    await page.getByLabel('确认密码').fill(TestConfigAccount.ProfilePageTestUser.password)
    await page.getByRole('button', { name: '重 置' }).click()
    await expect(await page.getByLabel('旧密码')).toBeEmpty()
    await expect(await page.getByLabel('新密码')).toBeEmpty()
    await expect(await page.getByLabel('确认密码')).toBeEmpty()
  })
  // 后端接口报错, 暂时跳过
  test.fixme('修改密码(提交)', async ({ page, frameworkPage }) => {
    await frameworkPage.toLogin(TestConfigAccount.ProfilePageUser)
    await page.goto(TestConfig.HOME_PAGE_URL)
    await page.getByLabel('旧密码').click()
    await page.getByLabel('旧密码').fill(TestConfigAccount.ProfilePageTestUser.username)
    await page.getByLabel('旧密码').press('Tab')
    await page.getByLabel('新密码').fill(TestConfigAccount.ProfilePageTestUser.password)
    await page.getByLabel('新密码').press('Tab')
    await page.getByLabel('确认密码').fill(TestConfigAccount.ProfilePageTestUser.password)
    await page.getByRole('button', { name: '提 交' }).click()
  })
  // 后端接口报错, 暂时跳过
  test.fixme('验证修改密码是否成功', async ({ frameworkPage }) => {
    await frameworkPage.page.goto(TestConfig.LOGIN_URL)
    await frameworkPage.toLogout()
    await frameworkPage.toLogin(TestConfigAccount.ProfilePageUser)
    // TODO 后端接口报错 ...
  })
  test('重新登录测试账号', async ({ frameworkPage }) => {
    await frameworkPage.page.goto(TestConfig.LOGIN_URL)
    await frameworkPage.toLogout()
    await frameworkPage.toLogin() // 重新使用测试账号登录, 保存用户信息
  })
})
