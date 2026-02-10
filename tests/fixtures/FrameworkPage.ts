import type { BrowserContext, Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { CaptchaImage } from '../utils/CaptchaImage';
import { TestConfig, TestConfigAccount } from './TestConfig';

/**
 * 与具体业务或页面无关的应用级的操作 fixture
 *
 * 此类封装了针对于此框架的常用操作, 特别是简化了 `ant-design-vue` 的操作
 *
 * ## 使用
 * ```typescript
 * import { test, expect } from '../framework-test'
 *
 * test('test title', async ({ page, frameworkPage }) => {
 *   // 等待并断言弹窗关闭
 *   await frameworkPage.waitForModalClose()
 * })
 * ```
 */
export class FrameworkPage {
  /** 当前登录用户 */
  account?: TestConfigAccount;
  constructor(
    public readonly page: Page,
    public readonly context: BrowserContext
  ) {}

  /**
   * 填充登录表单字段并点击登录
   * @param account 账号
   * @param showCodeImage 是否显示验证码(将输入错误的密码)
   */
  private async _fillLoginForm(account: TestConfigAccount = TestConfigAccount.Tester, showCodeImage: boolean = false) {
    await this.page.goto(TestConfig.LOGIN_URL);
    await this.page.locator('#basic_tenantName').click();
    await this.page.getByTitle('动力').getByText('动力').click();
    await this.page.getByPlaceholder('用户名').click();
    await this.page.getByPlaceholder('用户名').fill(account.username);
    await this.page.getByPlaceholder('用户名').press('Tab');
    await this.page.getByPlaceholder('密码').fill(showCodeImage ? account.password + '1' : account.password);
    await this.page.getByRole('button', { name: '登 录' }).click();
  }
  /** 获取验证码元素 */
  private async _getVerifyImage() {
    try {
      const codeImageEl = await this.page.waitForSelector('.verify-img-panel > img', { timeout: 2333 });
      return codeImageEl;
    } catch (err) {
      return null;
    }
  }

  /**
   * 执行登录操作
   * @param account 账号
   * @param showCodeImage 是否显示验证码(将输入错误的密码)
   */
  async toLogin(account: TestConfigAccount = TestConfigAccount.Tester, showCodeImage: boolean = false) {
    this.account = account;
    await this._fillLoginForm(account, showCodeImage);

    // 若出现验证码, 则拖动验证码滑块
    const codeImageEl = await this._getVerifyImage();
    if (codeImageEl) {
      await this._dragCodeImage(); // 拖动验证码滑块
      await this.page.waitForTimeout(2000);
      if (showCodeImage) {
        expect(this.page.url(), '输入错误的密码后应该还停留在登录页').toBe(TestConfig.LOGIN_URL);
        // 输入正确的密码并点击登录
        await this.page.getByPlaceholder('密码').fill(account.password);
        await this.page.getByRole('button', { name: '登 录' }).click();
        await this._dragCodeImage(); // 等待验证码出现并拖动验证码滑块
      }
    }

    await this.page.waitForURL(url => url.href !== TestConfig.LOGIN_URL);
    // 保存登录状态
    await this.page.context().storageState({ path: TestConfig.STORAGE_STATE_FILE_PATH });
  }

  /** 拖动验证码滑块 */
  private async _dragCodeImage() {
    /** 验证码 */
    const codeImageEl = await this.page.locator('.verify-img-panel > img');
    const codeImage = await codeImageEl!.getAttribute('src');

    // 自动拖动验证码
    const puzzleImage = await this.page.locator('.verify-sub-block > img').getAttribute('src');
    const codeImageBox = await this.page.locator('.verify-img-panel > img').boundingBox();
    const moveElementBox = await this.page.locator('.verify-move-block').boundingBox();

    await expect(moveElementBox).not.toBe(null);
    await expect(codeImage).not.toBe(null);
    await expect(puzzleImage).not.toBe(null);

    const captchImage = new CaptchaImage(codeImage || '', puzzleImage || '');
    const distance = await captchImage.getMoveLeftDistance(codeImageBox?.width);
    await this.page.locator('.verify-move-block').hover();
    await this.page.mouse.down();
    await this.page.mouse.move(moveElementBox!.width / 2 + moveElementBox!.x + distance, moveElementBox!.y);
    await this.page.mouse.up();
  }

  /** 退出登录 */
  async toLogout() {
    await this.page.locator('button .text-secondary').click();
    // await this.page.getByRole('button', { name: 'c codegen6' }).click();
    await this.page.getByText('退出登录').click();
    await this.page.getByRole('button', { name: '确 定' }).click();
    await this.page.waitForURL(TestConfig.LOGIN_URL);
  }

  /**
   * 获取并解析指定的 table 中包含的数据
   * @param wrapperLocator wrapper 元素
   * @returns 表格数据
   */
  async getTableData(wrapperLocator?: Locator): Promise<FrameworkPageTableInfo> {
    const hasVxeTable = await this.hasVxeTable();
    /** 表格 locator */
    const table = await (wrapperLocator || this.page).locator(hasVxeTable ? '.vxe-table:visible' : '.ant-table:visible');
    const tableEl = await table.all();
    expect(tableEl.length, '当前 selector / page 应该只存在一个表格').toBe(1); // 当前 selector 只能选中一个表格
    const thead = await table.locator(hasVxeTable ? '.vxe-table--header thead tr' : 'thead.ant-table-thead > tr').first(); // 获取包含标题行的 row
    const rows = await table.locator(hasVxeTable ? '.vxe-table--main-wrapper .vxe-table--body tbody tr' : 'tbody > tr.ant-table-row').all(); // 获取包含标题行的 row
    // expect(rows.length).toBeGreaterThan(0) // 表格至少包含标题
    // const thead = rows[0] // 标题行
    const titleElements = await thead.locator('th').all();
    const titles: Array<string> = [];
    for (const t of titleElements) titles.push((await t.textContent()) || '');

    const body: FrameworkPageTableInfo['body'] = [];
    const tableBody: FrameworkPageTableInfo['tableBody'] = [];

    /**
     * 左侧固定列中的 tr
     * @description vxe-table 的固定列元素并不在 tbody 中, 需要在 tbody 之外单独获取; ant-design-vue 不需要这样处理
     */
    const fixedLeftRows = hasVxeTable ? await table.locator('.vxe-table--body-wrapper.fixed-left--wrapper tr').all() : [];

    /**
     * 右侧固定列中的 tr
     * @description vxe-table 的固定列元素并不在 tbody 中, 需要在 tbody 之外单独获取; ant-design-vue 不需要这样处理
     */
    const fixedRightRows = hasVxeTable ? await table.locator('.vxe-table--body-wrapper.fixed-right--wrapper tr').all() : [];

    for (const row of rows) {
      const _row: TBodyInfo = {};
      const _dataRow: TBodyData = {};
      for (const [index, title] of titles.entries()) {
        let cells = await row.getByRole('cell').all();
        if (hasVxeTable) {
          cells = [...fixedLeftRows, ...cells, ...fixedRightRows];
        }
        _row[title] = cells[index];
        _dataRow[title] = (await _row[title].textContent()) || '';
      }
      body.push(_row);
      tableBody.push(_dataRow);
    }
    return {
      titles,
      tableBody,
      body,
    };
  }

  /**
   * 当前页面或指定元素内是否存在 vxe-table
   * @returns 是否存在 vxe-table
   */
  async hasVxeTable(timeout: number = 500, locator?: Locator) {
    const vxeTable = await this.waitForSelectorSlient((locator || this.page).locator('.vxe-table'), timeout);
    return !!vxeTable;
  }

  /**
   * 等待表格加载完数据并渲染完成
   * @param tableWrapperSelector 表格 wrapper 元素选择器
   */
  async waitForTableLoading(renderTimeout: number = TestConfig.WAIT_TABLE_LOAD_TIME) {
    const hasVxeTable = await this.hasVxeTable();
    if (hasVxeTable) {
      await this.page.waitForSelector(`.vxe-table:visible .vxe-loading.is--visible.vxe-table--loading`, { timeout: 1000 });
      await this.page.locator(`.vxe-table:visible .vxe-loading.is--visible.vxe-table--loading`).waitFor({ timeout: 1000, state: 'detached' });
    } else {
      // 等待显示表格的 loading 元素
      await this.page.waitForSelector(`.ant-table-wrapper .ant-spin-container.ant-spin-blur`, { timeout: 1000 });
      await this.page.waitForSelector(`.ant-table-wrapper .ant-spin-container:not(.ant-spin-blur)`, { timeout: 1000 });
    }
    await this.page.waitForTimeout(renderTimeout);
  }

  /**
   * 等待一个或连续多个请求完毕并延迟 `timeout` ms
   * @description 如果是等待表格数据加载完成, 应该优先使用 {@link waitForTableLoading}, 除非没有为 `<a-table>` 绑定 `loading` 事件
   * @param urlOrPredicate 请求 URL - 如果传入则会等待对应请求收到响应, 未传入则等待所有请求完毕
   * @param timeout 请求完毕后的等待时间
   */
  async waitForLoad(urlOrPredicate?: Parameters<Page['waitForResponse']>[0], timeout: number = 1200) {
    if (urlOrPredicate) await this.page.waitForResponse(urlOrPredicate);
    else await this.page.waitForLoadState('networkidle');

    await this.page.waitForTimeout(timeout);
  }

  /**
   * 等待并断言弹窗关闭
   * @param modalSelector 弹窗 locator
   */
  async waitForModalClose(modalSelector: string | Locator = '.ant-modal') {
    await expect(typeof modalSelector === 'string' ? this.page.locator(modalSelector) : modalSelector, '弹窗关闭').toBeVisible({ visible: false });
  }

  /**
   * 等待元素可见, 若元素不存在或不可见, 则返回 null
   * @param selectorOrLocator 选择器 / locator
   * @param timeout 超时时间
   * @returns locator
   */
  async waitForSelectorSlient(selectorOrLocator: string | Locator, timeout: number = 1000) {
    try {
      if (typeof selectorOrLocator === 'string') {
        const _locator = await this.page.waitForSelector(selectorOrLocator, { timeout, state: 'visible' });
        return _locator ? await this.page.locator(selectorOrLocator) : null;
      } else {
        await selectorOrLocator.waitFor({ state: 'visible', timeout });
        return selectorOrLocator;
      }
    } catch (err) {
      console.log('[waitForSelectorSlient] get locator failed: ', selectorOrLocator);
      if (err && (err as any).name !== 'TimeoutError') console.log(err);
      return null;
    }
  }

  /**
   * 滚动到定位元素的底部
   * @param locator 需要滚动的元素定位器
   * @param timeout 每次滚动的时间间隔，默认 200 毫秒
   */
  async scrollToBottom(locator: Locator, timeout: number = 200, callback: () => Promise<any>) {
    // 确认 locator 匹配到的是单个元素
    const elementCount = await locator.count();
    if (elementCount !== 1) {
      throw new Error(`Locator should match exactly one element, but found ${elementCount}`);
    }

    // 直接执行第一次 callback
    await locator.page().waitForTimeout(timeout / 2);
    const isFinished = await callback();
    await locator.page().waitForTimeout(timeout / 2);
    if (isFinished === true) return;

    // 判断元素是否可滚动
    const isScrollable = await locator.evaluate(el => el.scrollHeight > el.clientHeight);
    if (!isScrollable) {
      // 如果元素不可滚动，直接返回
      return;
    }

    // 获取元素的可视区域高度（clientHeight）
    const elementHeight = await locator.evaluate(el => el.clientHeight);

    // 使用 Playwright 的 hover() 和 mouse.wheel() 进行滚动
    await locator.hover(); // 聚焦到元素上
    let scrollTop = 0;
    let scrollHeight = await locator.evaluate(el => el.scrollHeight);

    // 持续滚动直到滚动到底部
    while (scrollTop + elementHeight < scrollHeight) {
      // 进行鼠标滚动操作
      await locator.page().mouse.wheel(0, elementHeight);

      // 延迟一段时间，避免滚动过快
      await locator.page().waitForTimeout(timeout / 2);
      // 执行 callback
      const isFinished = await callback();
      if (isFinished === true) return;
      // 延迟一段时间，避免滚动过快
      await locator.page().waitForTimeout(timeout / 2);

      // 更新 scrollTop 和 scrollHeight 值，检查是否到达底部
      scrollTop = await locator.evaluate(el => el.scrollTop);
      scrollHeight = await locator.evaluate(el => el.scrollHeight);
    }
  }

  /**
   * 在多个元素中获取首个可见的 selector / Locator
   * @example
   * ```typescript
   * const editButton = await frameworkPage.waitForAllSelectorRaceSlient([ '.edit-button', page.locator('button:has-text("编辑")') ])
   * ```
   * @param selectorsOrLocator 多个 selector / Locator
   * @param timeout 超时时间
   * @returns 首个获取到的 selector / locator
   */
  waitForAllSelectorRaceSlient(selectorsOrLocator: Array<string | Locator>, timeout: number = 1000) {
    let resultCount = selectorsOrLocator.length;
    return new Promise<Locator | null>((resolve, reject) => {
      selectorsOrLocator.forEach(async selector => {
        const locator = await this.waitForSelectorSlient(selector, timeout);
        if (locator) {
          resolve(locator);
        } else {
          if (--resultCount === 0) resolve(null);
        }
      });
    });
  }
  /**
   * 将鼠标移入所有指定元素中
   * @param locator locator
   */
  async mouseMoveLocator(locator: Locator) {
    const locators = await locator.all();
    for (const child of locators) {
      const moveElementBox = await child.boundingBox();
      if (!moveElementBox) continue; // 忽略不可见的元素
      await this.page.mouse.move(moveElementBox.x + 10, moveElementBox.y);
      await child.evaluate(el => el.dispatchEvent(new Event('mouseenter')));
    }
  }
}

/** 单元格 Locator */
interface TBodyInfo {
  [title: string]: Locator;
}
/** 单元格内容 */
interface TBodyData {
  [title: string]: string;
}

/** 获取到的表格数据 */
export interface FrameworkPageTableInfo {
  /** 表格标题数组 */
  titles: Array<string>;
  /** 表格元素(body) */
  body: Array<TBodyInfo>;
  /** 表格内容(body) */
  tableBody: Array<TBodyData>;
}
