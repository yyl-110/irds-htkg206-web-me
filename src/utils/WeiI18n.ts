import type { App, ComponentInternalInstance, ComputedRef } from 'vue';
import { computed, unref } from 'vue';

import type { I18n, Path } from 'vue-i18n';
import { createI18n } from 'vue-i18n';
import AntDVZhCN from 'ant-design-vue/es/locale/zh_CN';
import AntDVEnUs from 'ant-design-vue/es/locale/en_US';
import AntDVEEsES from 'ant-design-vue/es/locale/es_ES';
import type { Locale as AntDVLocale } from 'ant-design-vue/es/locale-provider';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';
import type { RouteMeta } from 'vue-router';
import vxeZhCN from 'vxe-pc-ui/lib/language/zh-CN';
import vxeEnUS from 'vxe-pc-ui/lib/language/en-US';
import vxeEsES from 'vxe-pc-ui/lib/language/es-ES';
import { type VxeGlobalI18nLocale, VxeUI } from 'vxe-pc-ui';

// 导入默认的语言
import { AdminApiSystemLanguage } from '@/api/tags/管理后台多语言';
import { useUserStore } from '@/store/modules/user';

const EnUS = ref();
const RuUS = ref();
const FrFR = ref();
const ItIT = ref();
const OTHER = ref();

const messages: any = {};

export enum Locale {
  'zh_CN' = 'zh_CN',
  'en-US' = 'en-US',
  // 'es_ES' = 'es_ES',
}

/** 多语言静态配置 */
interface LocaleInfo {
  /** 语言名称 */
  name: string;
  /**
   * ant design vue 的多语言文件, 在 a-config-provider 组件中使用
   * @see https://github.com/vueComponent/ant-design-vue/tree/main/components/locale
   */
  antdvLocale: AntDVLocale;
  /**
   * dayjs 使用的多语言 key
   * @see https://dayjs.gitee.io/docs/zh-CN/i18n/i18n
   */
  dayjsLocale: string;

  /**
   * vxe-table / vxe-pc-ui 使用的语言包
   */
  vxeLocale: { [key: string]: any };

  /**
   * vxe-table / vxe-pc-ui 使用的多语言 key
   */
  vxeKey: VxeGlobalI18nLocale;
}

/**
 * 当前所有多语言 message
 */
export let Locales: Record<keyof typeof Locale, LocaleInfo> = {
  // zh_CN: {
  //   name: '中文简体',
  //   antdvLocale: AntDVZhCN,
  //   vxeKey: 'zh_CN',
  //   vxeLocale: vxeZhCN,
  //   dayjsLocale: 'zh_cn',
  // },
  // en_US: {
  //   name: 'English',
  //   antdvLocale: AntDVEnUs,
  //   vxeKey: 'en_US',
  //   vxeLocale: vxeEnUS,
  //   dayjsLocale: 'en',
  // },
};
/**
 * 当前所有多语言 message
 */
export let towLocales: Record<keyof typeof Locale, LocaleInfo> = {
  // zh_CN: {
  //   name: '中文简体',
  //   antdvLocale: AntDVZhCN,
  //   vxeKey: 'zh-CN',
  //   vxeLocale: vxeZhCN,
  //   dayjsLocale: 'zh-cn',
  // },
  // en_US: {
  //   name: 'English',
  //   antdvLocale: AntDVEnUs,
  //   vxeKey: 'en-US',
  //   vxeLocale: vxeEnUS,
  //   dayjsLocale: 'en',
  // },
};

/**
 * 多语言处理类
 * @description 提供多语言相关的所有功能
 * @see {@link https://vue-i18n.intlify.dev/guide/installation.html | vue-i18n}
 * @see {@link https://cn.vuejs.org/guide/reusability/plugins.html#writing-a-plugin | vue plugin}
 */

export class WeiI18n {
  /** 默认语言 */
  static readonly DEFAULT_LANGUAGE: keyof typeof Locale = 'zh_CN';
  /** 初始化时获取当前默认语言 */
  static getFallbackLocale() {
    return (localStorage.getItem('wei-language') as keyof typeof Locale) || navigator.language.replace(/-/g, '_') || WeiI18n.DEFAULT_LANGUAGE;
  }

  static i18n?: I18n;
  /**
   * 初始化多语言配置
   * @param app vue app
   */

  static init(app: App<Element>) {
    const Mlanguage = localStorage.getItem('Mlanguage');
    if (Mlanguage) {
      const { localesKey, towLocalesKey } = JSON.parse(Mlanguage);
      Locales = localesKey;
      towLocales = towLocalesKey;
      const _locale = WeiI18n.getFallbackLocale();
      if (Locales[_locale]) {
        this.fetchLocales(Locales[_locale]);
      }
      nextTick(() => {
        WeiI18n.updateHTMLLang(_locale);
      });
    }

    const _locale = WeiI18n.getFallbackLocale();
    WeiI18n.i18n = createI18n({
      legacy: false,
      locale: _locale,
      globalInjection: true,
      fallbackLocale: _locale,
      fallbackWarn: false,
      missingWarn: null,
      silentTranslationWarn: true,
      /**
       * missing text
       * @param locale
       * @param key
       * @param _instance
       * @param _type
       */
      missing: (locale: string, key: Path, _instance?: ComponentInternalInstance, _type?: string) => {
        // 在当前语言下缺少此文案时, 使用默认语言的对应文案做填充, 默认语言也不存在此文案时, 使用文案 `key` 本身
        // return WeiI18n.i18n?.global?.te(key, WeiI18n.DEFAULT_LANGUAGE)
        //   ? (WeiI18n.i18n?.global?.t as Function)(key, '', { locale: WeiI18n.DEFAULT_LANGUAGE })
        //   : key.toString()

        return key.toString();
      },
      messages,
    });

    app.use(WeiI18n.i18n);
    WeiI18n.updateHTMLLang(_locale);

    WeiI18n.initVxe();
    // 初始化时获取当前默认语言
    localStorage.setItem('wei-language', WeiI18n.getFallbackLocale());
  }

  /**
   * 存放语言数据到本地
   * @param key 语言key
   * @returns
   */
  static async setStoreLanguage(key: any) {
    try {
      if (!key) return;
      // const url = import.meta.env.VITE_BASE_PREVIEW_URL
      // const response = await fetch(`${url}${key.previewUrl}`) // 这里直接指向 public 文件夹中的数据 或者预览路径
      const url = import.meta.env.VITE_BASE_HTMLPREVIEW_URL2;
      const response = await fetch(`${`${url}/files/language/`}${key.lang}.json`); // 这里直接指向 /usr/share/nginx/html/manual/languag    文件夹中的数据 或者预览路径
      if (response.status === 200) {
        const data = await response.json();
        await localStorage.setItem(key.lang, JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error fetching style template:-----语言存放------------', error);
    }
  }

  /** 初始化 vxe 多语言配置 */
  static initVxe() {
    for (const k in Locales) {
      const locale = Locales[k as keyof typeof Locale];
      VxeUI.setI18n(locale.vxeKey, locale.vxeLocale);
    }
  }

  /**
   * 异步获取语言包
   *
   * @param key 包含 vxeKey 和 previewUrl 的对象
   */
  static async fetchLocales(key: any) {
    let flag = '0';
    if (key.vxeKey === undefined && !localStorage.getItem(key.vxeKey)) {
      flag = '1';
    }
    if (flag === '0') {
      const list = JSON.parse(localStorage.getItem(key.vxeKey) || '{ }');
      OTHER.value = list;
      messages[key.vxeKey] = OTHER.value;
      nextTick(() => {
        // setTimeout(() => {
        WeiI18n.initVxe();
        VxeUI.setI18n(key.vxeKey, OTHER);
        this.saveLanguage(WeiI18n.getFallbackLocale());
        // }, 100)
      });
    }
  }

  /**
   * 将多语言配置保存到本地, 更新 HTML 的 lang 属性
   * @param locale
   */
  static saveLanguage(locale: keyof typeof Locale) {
    // 调用语言编辑接口
    WeiI18n.updateHTMLLang(locale);
  }

  /**
   * 更新页面语言
   * @param lang language
   */
  static updateHTMLLang(lang: keyof typeof Locale) {
    document.querySelector('html')?.setAttribute('lang', lang);
  }

  /**
   * 访问 `global i18n te()`
   * @description 用于在 `ts` 代码中使用多语言
   * @param locale
   * @param key
   */
  static te(key: string | number, locale?: string): string {
    return (WeiI18n.i18n?.global.te as Function)(key, locale);
  }

  /**
   * 获取翻译后的文案
   *
   * ```typescript
   * import { WeiI18n } from '@/utils/WeiI18n'
   *
   * // tips(无响应式, 切换语言时不会变化)
   * const tips = { tips1: WeiI18n.$t('tips1') } // string
   *
   * // tips(响应式, 切换语言时会变化)
   * const tips = computed(() => { // ComputedRef<string>
   *   return {
   *     tips1: WeiI18n.$t('tips1'),
   *   }
   * })
   * ```
   *
   * @description 与 `<template>` 中使用的 `$t()` 方法相同
   * @param {...any} args
   * @param key
   */
  static $t(key: string | number, ...args: Array<any>): any {
    if (!WeiI18n.i18n) {
      // throw new Error('Missing global i18n')
    } else {
      return (WeiI18n.i18n?.global.t as Function)(key, ...args);
    }
  }

  /**
   * 获取翻译后的文案, 并保持响应式
   *
   * ```typescript
   * import { WeiI18n } from '@/utils/WeiI18n'
   *
   * const tips = WeiI18n.t('tips') // ComputedRef<string>
   * ```
   *
   * @description 适用于 `string` 类型的变量
   * @param {...any} args
   * @param key
   */
  static t(key: string | number, ...args: Array<any>): ComputedRef<string> {
    if (WeiI18n.i18n) {
      //   throw new Error('Missing global i18n')
      const result = computed(() => {
        // 屏蔽 t() 方法的语法报错
        return (WeiI18n.i18n?.global.t as Function)(key, ...args);
      });
      return result;
    }
  }

  static get locale(): keyof typeof Locale {
    if (!WeiI18n.i18n) return WeiI18n.DEFAULT_LANGUAGE;
    return unref(WeiI18n.i18n.global.locale) as keyof typeof Locale;
  }

  /** ant design vue 的多语言文件, 在 a-config-provider 组件中使用 */
  static get antdvLocale(): AntDVLocale {
    const localeInfo = towLocales?.[WeiI18n.locale];

    if (localeInfo?.dayjsLocale) dayjs.locale(localeInfo.dayjsLocale);

    if (WeiI18n.locale !== undefined) VxeUI.setLanguage(WeiI18n.locale);

    if (localeInfo?.antdvLocale) return localeInfo.antdvLocale;

    return WeiI18n.locale === 'en-US' ? AntDVEnUs : AntDVZhCN;
  }

  /** dayjs 使用的多语言 key */
  static get dayjsLocale(): string {
    return towLocales?.[WeiI18n.locale]?.dayjsLocale || (WeiI18n.locale === 'en-US' ? 'en' : 'zh-cn');
  }

  /**
   * 获取保持响应式的路由页面标题
   * @param metaOrKey 路由 meta
   */
  static getRouteTitle(metaOrKey: RouteMeta | string | undefined) {
    if (!WeiI18n.i18n) throw new Error('Missing global i18n');
    return computed(() => {
      const key = (typeof metaOrKey === 'string' ? metaOrKey : metaOrKey?.title) || '';
      const messageKey = `WeiRoutes.${key}`;
      return WeiI18n.$t(messageKey) ? WeiI18n.$t(key) : key;
    });
  }
}
