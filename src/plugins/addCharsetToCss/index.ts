import type { Plugin } from 'vite';
import chalk from 'chalk';

const CSS_CHARSET_DECLARATION = `@charset "UTF-8";\n`;

export enum AddCharsetToCssPluginExt {
  css = '.css',
  less = '.less',
}

/**
 * AddCharsetToCssPluginParams
 */
export class AddCharsetToCssPluginParams {
  /** 根据扩展名筛选使用此 `plugin` 的文件 */
  ext: Array<AddCharsetToCssPluginExt> = [AddCharsetToCssPluginExt.css];
  /**
   * 自定义文件筛选逻辑, 优先级高于 `ext`
   * @param id
   * @description 目前只适用于 ant-design-vue 相关的 css 文件
   */
  customFilter?: (id: string) => boolean = (id: string) => {
    if ([AddCharsetToCssPluginExt.css, AddCharsetToCssPluginExt.less].some(ext => id.endsWith(ext))) return id.includes('antd.variable.min.css') || id.includes('ant-design-vue');
  };

  /**
   * from
   * @param params
   */
  static from(params: Partial<AddCharsetToCssPluginParams>) {
    const _params = new AddCharsetToCssPluginParams();
    Object.assign(_params, params);
    return _params;
  }
}

const name = 'add-charset-to-css';

let command = '';

/**
 * 在所有的 css 文件顶部增加 charset utf-8
 * @param options
 * @description fixed
 */
export const addCharsetToCssPlugin: (options?: Partial<AddCharsetToCssPluginParams>) => Plugin = (options?: Partial<AddCharsetToCssPluginParams>) => {
  const _options = AddCharsetToCssPluginParams.from(options || {});
  return {
    name,
    config(config, env) {
      command = env.command;
    },
    transform(code: string, id: string) {
      if (command !== 'build') return null; // 只在 build 时应用
      let isApply = false;
      if (_options.customFilter) isApply = _options.customFilter(id);
      else if (_options.ext.length) isApply = _options.ext.every(ext => id.endsWith(ext));

      if (isApply) {
        console.log(chalk.cyan(`[${name}]`), id);
        return {
          code: CSS_CHARSET_DECLARATION + code,
          map: null,
        };
      }
      return null;
    },
  };
};
