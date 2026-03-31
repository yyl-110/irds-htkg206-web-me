// vite.config.ts
import { resolve } from "node:path";
import process from "node:process";
import { defineConfig } from "file:///D:/ideaspace/htkg-206/v2/irds-htkg206-web/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/ideaspace/htkg-206/v2/irds-htkg206-web/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { createSvgIconsPlugin } from "file:///D:/ideaspace/htkg-206/v2/irds-htkg206-web/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import VueI18nPlugin from "file:///D:/ideaspace/htkg-206/v2/irds-htkg206-web/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
import legacy from "file:///D:/ideaspace/htkg-206/v2/irds-htkg206-web/node_modules/@vitejs/plugin-legacy/dist/index.mjs";
import AutoImport from "file:///D:/ideaspace/htkg-206/v2/irds-htkg206-web/node_modules/unplugin-auto-import/dist/vite.js";
import { VxeResolver, lazyImport } from "file:///D:/ideaspace/htkg-206/v2/irds-htkg206-web/node_modules/vite-plugin-lazy-import/dist/index.cjs";

// src/plugins/checkUpdate/plugin.ts
import { writeFile } from "node:fs";
import path from "node:path";

// package.json
var package_default = {
  name: "framework4.0",
  type: "module",
  version: "3.0.6",
  private: true,
  scripts: {
    dev: "vite",
    build: "vite build --mode development",
    "build:pro": "node --max_old_space_size=8000 ./node_modules/vite/bin/vite.js build --mode production",
    "build:demo": "node --max_old_space_size=8000 ./node_modules/vite/bin/vite.js build --mode demo",
    "build:dev": "node --max_old_space_size=8000 ./node_modules/vite/bin/vite.js build --mode development",
    "build:stage": "node --max_old_space_size=8000 ./node_modules/vite/bin/vite.js build --mode stage",
    "build:test": "node --max_old_space_size=8000 ./node_modules/vite/bin/vite.js build --mode test",
    "build:static": "node --max_old_space_size=8000 ./node_modules/vite/bin/vite.js build --mode static",
    "build:front": "node --max_old_space_size=8000 ./node_modules/vite/bin/vite.js build --mode front",
    preview: "vite preview",
    commit: "git-cz",
    lint: "eslint . --cache",
    "lint:report": "eslint ./src  --format html > lint-report.html  || exit 0",
    "lint:fix": "eslint . --fix --cache",
    "lint:quiet": "eslint . --quiet --cache",
    "generate-dark-theme-css": "esno ./scripts/generate-dark-theme-css.ts",
    "download-openapi": "esno ./scripts/download-openapi.ts",
    codegen: "esno ./scripts/openapi-codegen.ts",
    "codegen:clean": "esno ./scripts/openapi-codegen.ts && rm src/api/ui-schemas/* && git checkout -- src/api/ui-schemas",
    "codegen:views": "esno ./scripts/openapi-views-codegen.ts",
    "docs:dev": "vitepress dev docs --port 45000",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs --port 45000",
    test: "vitest",
    "test:codegen": "npx esno ./scripts/openapi-codegen.ts",
    "test:spec:captch-image": "vitest tests/utils/CaptchaImage.test.ts",
    "test:e2e:prepare": "npm run build && npm run preview",
    "test:e2e": "playwright test ./tests/e2e/ --workers=3",
    "test:e2e:headed": "playwright test --headed --workers=3",
    "test:e2e:ui": "playwright test --ui --workers=1",
    "test:e2e:report": 'echo "\u67E5\u770B\u6D4B\u8BD5\u62A5\u544A" && playwright show-report',
    "test:e2e:codegen": "playwright codegen http://localhost:58585"
  },
  dependencies: {
    "@ant-design/icons-vue": "^6.1.0",
    "@ckeditor/ckeditor5-build-classic": "^43.3.1",
    "@ckeditor/ckeditor5-vue": "^7.2.0",
    "@codemirror/lang-xml": "^6.1.0",
    "@codemirror/theme-one-dark": "^6.1.3",
    "@handsontable/vue3": "^12.3.3",
    "@iconify/iconify": "^3.1.0",
    "@vue-office/docx": "^1.6.3",
    "@vue-office/excel": "^1.7.14",
    "@vue-office/pdf": "^2.0.10",
    "@vueuse/core": "10.1.2",
    "animate.css": "^4.1.1",
    "ant-design-vue": "^3.2.20",
    axios: "^1.4.0",
    "bpmn-js": "^18.9.1",
    "bpmn-js-properties-panel": "^5.44.0",
    "bpmn-js-token-simulation": "^0.38.2",
    "camunda-bpmn-moddle": "^7.0.1",
    "class-transformer": "^0.5.1",
    "codemirror-editor-vue3": "^2.8.0",
    "crypto-js": "^4.1.1",
    dayjs: "^1.11.7",
    "dhtmlx-gantt": "^9.1.0",
    "diagram-js": "^15.4.0",
    "diagram-js-minimap": "^5.2.0",
    echarts: "^5.4.2",
    "form-data": "^4.0.0",
    "framework4.0": "file:",
    handsontable: "^12.2.0",
    jsencrypt: "^3.3.2",
    "lodash-es": "^4.17.21",
    mathjs: "^11.10.0",
    mp4box: "^0.5.3",
    "pinia-plugin-persistedstate": "^3.1.0",
    qs: "^6.11.2",
    "reflect-metadata": "^0.1.13",
    sass: "^1.77.8",
    sortablejs: "^1.15.2",
    splitpanes: "^3.1.5",
    "svg-pan-zoom": "^3.6.2",
    vant: "^4.9.17",
    vconsole: "^3.15.1",
    vue: "~3.5.0",
    "vue-echarts": "^6.5.5",
    "vue-i18n": "^9.2.2",
    "vue-router": "^4.1.6",
    "vue-svg-pan-zoom": "^2.1.0",
    vuedraggable: "^2.24.3",
    "vxe-pc-ui": "^4.1.22",
    "vxe-table": "^4.7.77",
    "web-storage-cache": "^1.1.1"
  },
  devDependencies: {
    "@antfu/eslint-config": "^2.27.3",
    "@babel/types": "^7.22.5",
    "@commitlint/cli": "^17.6.3",
    "@commitlint/config-conventional": "^17.6.3",
    "@eslint/js": "^9.17.0",
    "@iconify/json": "^2.2.80",
    "@intlify/unplugin-vue-i18n": "^0.11.0",
    "@playwright/test": "^1.46.1",
    "@purge-icons/generated": "^0.9.0",
    "@stoplight/json-ref-resolver": "^3.1.5",
    "@types/crypto-js": "^4.2.2",
    "@types/fs-extra": "^11.0.1",
    "@types/get-pixels": "^3.3.2",
    "@types/lodash-es": "^4.17.7",
    "@types/node": "^18.16.6",
    "@types/qs": "^6.9.7",
    "@types/semver": "^7.5.0",
    "@types/sortablejs": "^1.15.7",
    "@typescript-eslint/eslint-plugin": "^8.3.0",
    "@typescript-eslint/parser": "^8.3.0",
    "@vitejs/plugin-legacy": "^4.1.1",
    "@vitejs/plugin-vue": "^4.6.2",
    "@vue/test-utils": "^2.4.1",
    autoprefixer: "^10.4.14",
    chalk: "^5.3.0",
    commitizen: "^4.3.0",
    "commitlint-config-cz": "^0.13.3",
    "cz-conventional-changelog": "^3.3.0",
    "cz-custom": "^0.0.2",
    "dereference-json-schema": "^0.2.1",
    dotenv: "^16.3.1",
    eslint: "~9.9.1",
    "eslint-plugin-format": "^0.1.2",
    "eslint-plugin-jsdoc": "^46.10.1",
    "eslint-plugin-vue": "^9.32.0",
    esmo: "^0.17.0",
    "fs-extra": "^11.1.1",
    "get-pixels": "^3.3.3",
    globals: "^15.14.0",
    "happy-dom": "^10.9.0",
    husky: "^8.0.3",
    "js-cookie": "^2.2.0",
    less: "^4.1.3",
    "lint-staged": "^15.2.0",
    "openapi-types": "^12.1.3",
    pinia: "^2.0.36",
    "pont-engine": "^1.5.10",
    postcss: "^8.4.23",
    "postcss-import": "^15.1.0",
    semver: "^7.5.4",
    "swagger-autogen": "^2.23.1",
    "swagger-typescript-api": "^12.0.4",
    tailwindcss: "^3.3.2",
    "ts-node": "^10.9.1",
    typescript: "^5.5.4",
    "typescript-eslint": "^8.19.0",
    "unplugin-auto-import": "^0.17.5",
    "unplugin-vue-components": "^0.24.1",
    vite: "^4.4.4",
    "vite-plugin-lazy-import": "^1.0.7",
    "vite-plugin-svg-icons": "^2.0.1",
    vitepress: "1.0.0-beta.2",
    vitest: "^2.0.5",
    "vue-tsc": "^2.0.13",
    "vue-types": "^5.1.1"
  },
  config: {
    commitizen: {
      path: "./node_modules/cz-custom"
    },
    "cz-custom": {
      config: ".cz-config.cjs"
    }
  },
  "lint-staged": {
    "*.{vue,js,ts,jsx,tsx}": "eslint --fix --quiet --cache"
  }
};

// src/plugins/checkUpdate/config.ts
var CheckUpdateConfig = class {
  /** 注入到全局变量中的版本号字段名称 */
  static NAME = "WEI_APP_VERSION";
  /** 用于记录版本信息的 json 文件名 */
  static VERSION_FILE_NAME = "update.json";
};

// src/plugins/checkUpdate/plugin.ts
var generateVersion = () => `${package_default.version}.${Date.now()}`;
var vitePluginVersionOutput = (input = {}) => {
  const {
    name: name2 = CheckUpdateConfig.NAME,
    version = generateVersion(),
    html = { enable: true, toMeta: true, toConsole: true, toGlobal: true },
    json = { enable: true, fileName: CheckUpdateConfig.VERSION_FILE_NAME }
  } = input;
  let config;
  const writeVersion = (versionFile, content) => {
    writeFile(versionFile, content, (err) => {
      if (err)
        throw err;
    });
  };
  let _mode = "production";
  return {
    name: "vite-plugin-version-output",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    async transformIndexHtml() {
      const els = [];
      if (!(html == null ? void 0 : html.enable))
        return els;
      const printName = name2;
      const printInfo = `${printName}: ${version}`;
      html.toMeta && els.push({
        tag: "meta",
        injectTo: "head-prepend",
        attrs: {
          name: printName,
          content: printInfo
        }
      });
      html.toConsole && els.push({
        tag: "script",
        injectTo: "body",
        children: `console.log("${printInfo}")`
      });
      html.toGlobal && els.push({
        tag: "script",
        injectTo: "body",
        children: `var ${printName} = "${version}";`
      });
      return els;
    },
    buildStart() {
      if (!(json == null ? void 0 : json.enable))
        return;
      const file = path.resolve(config.root, config.publicDir, json.fileName);
      const content = JSON.stringify({ version });
      writeVersion(file, content);
    },
    config(config2, env) {
      _mode = env.mode || "";
    }
  };
};

// src/plugins/addCharsetToCss/index.ts
import chalk from "file:///D:/ideaspace/htkg-206/v2/irds-htkg206-web/node_modules/chalk/source/index.js";
var CSS_CHARSET_DECLARATION = `@charset "UTF-8";
`;
var AddCharsetToCssPluginParams = class _AddCharsetToCssPluginParams {
  /** 根据扩展名筛选使用此 `plugin` 的文件 */
  ext = [".css" /* css */];
  /**
   * 自定义文件筛选逻辑, 优先级高于 `ext`
   * @param id
   * @description 目前只适用于 ant-design-vue 相关的 css 文件
   */
  customFilter = (id) => {
    if ([".css" /* css */, ".less" /* less */].some((ext) => id.endsWith(ext)))
      return id.includes("antd.variable.min.css") || id.includes("ant-design-vue");
  };
  /**
   * from
   * @param params
   */
  static from(params) {
    const _params = new _AddCharsetToCssPluginParams();
    Object.assign(_params, params);
    return _params;
  }
};
var name = "add-charset-to-css";
var command = "";
var addCharsetToCssPlugin = (options) => {
  const _options = AddCharsetToCssPluginParams.from(options || {});
  return {
    name,
    config(config, env) {
      command = env.command;
    },
    transform(code, id) {
      if (command !== "build")
        return null;
      let isApply = false;
      if (_options.customFilter)
        isApply = _options.customFilter(id);
      else if (_options.ext.length)
        isApply = _options.ext.every((ext) => id.endsWith(ext));
      if (isApply) {
        console.log(chalk.cyan(`[${name}]`), id);
        return {
          code: CSS_CHARSET_DECLARATION + code,
          map: null
        };
      }
      return null;
    }
  };
};

// vite.config.ts
var __vite_injected_original_dirname = "D:\\ideaspace\\htkg-206\\v2\\irds-htkg206-web";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    // Components({
    //   // dts: true, // enabled by default if `typescript` is installed
    //   // resolvers: [ AntDesignVueResolver() ],
    // }),
    AutoImport({
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/],
      eslintrc: {
        enabled: true
      },
      imports: [
        "vue",
        "vue-router",
        // 'vitest',
        // '@vueuse/core',
        {
          "@/utils/WeiI18n": ["WeiI18n"],
          "@/httpRequest/typings.ts": ["HttpRequestResponse", "isHttpRequestResponse", "ResponseError"],
          "@/httpRequest/pending.ts": ["isPending"],
          "@/hooks/usePagination": ["usePagination"],
          "@/hooks/useModelData": ["useModelData", "UseModelDataOptions", "UseModelDataReturnData"],
          axios: ["AxiosResponse"]
        }
      ],
      dts: "src/auto-imports.d.ts"
    }),
    lazyImport({
      resolvers: [VxeResolver({ libraryName: "vxe-table" }), VxeResolver({ libraryName: "vxe-pc-ui" })]
    }),
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), ".", "src/assets/svgs")],
      symbolId: "icon-[dir]-[name]",
      svgoOptions: true
    }),
    addCharsetToCssPlugin({}),
    // 参考自 https://github.com/intlify/vue-i18n-next/issues/789#issuecomment-1356782726
    VueI18nPlugin({
      include: resolve(__vite_injected_original_dirname, "src/locales/**")
      // PUT YOUR OWN PATH TO LOCALES HERE
    }),
    vitePluginVersionOutput({
      json: {
        enable: true,
        fileName: CheckUpdateConfig.VERSION_FILE_NAME
      },
      html: {
        enable: true,
        toMeta: true,
        toConsole: true,
        toGlobal: true
      }
    }),
    legacy({
      targets: ["edge >= 16", "chrome >= 61"],
      renderLegacyChunks: true,
      modernPolyfills: ["es.global-this"],
      polyfills: [
        "es.symbol",
        "es.array.filter",
        "es.promise",
        "es.promise.finally",
        "es/map",
        "es/set",
        "es.array.for-each",
        "es.object.define-properties",
        "es.object.define-property",
        "es.object.get-own-property-descriptor",
        "es.object.get-own-property-descriptors",
        "es.object.keys",
        "es.object.to-string",
        "es.global-this",
        "web.dom-collections.for-each",
        "esnext.global-this",
        "esnext.string.match-all"
      ]
    })
  ],
  resolve: {
    // 添加别名
    alias: {
      "@": resolve(__vite_injected_original_dirname, "src"),
      // 修复 bpmn-js-token-simulation 对 ids 的默认导入：ids 仅提供命名导出
      ids: resolve(__vite_injected_original_dirname, "src/shims/ids.js")
      // 'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
    }
  },
  server: {
    // 端口号
    port: 5173,
    // port: 80,
    host: "0.0.0.0",
    proxy: {
      "/Api": {
        // target: 'http://39.106.130.85:9328',
        // target: 'http://10.151.129.89:9328',
        target: "http://127.0.0.1:9327",
        ws: false,
        changeOrigin: true,
        /**
         * rewrite path
         * @param path path
         */
        rewrite: (path2) => path2.replace(/^\/Api/, ""),
        configure: (proxy, options) => {
          proxy.on("proxyRes", (proxyRes, req) => {
            var _a;
            proxyRes.headers["x-real-url"] = ((_a = new URL(req.url || "", options.target)) == null ? void 0 : _a.href) || "";
          });
        }
      },
      "/Lang": {
        target: "http://172.16.7.44",
        ws: false,
        changeOrigin: true,
        /**
         * rewrite path
         * @param path path
         */
        rewrite: (path2) => path2.replace(/^\/Lang/, ""),
        configure: (proxy, options) => {
          proxy.on("proxyRes", (proxyRes, req) => {
            var _a;
            proxyRes.headers["x-real-url"] = ((_a = new URL(req.url || "", options.target)) == null ? void 0 : _a.href) || "";
          });
        }
      },
      "/iconify": {
        target: "",
        ws: false,
        changeOrigin: true
        /**
         * rewrite path
         * @param path path
         */
        // rewrite: path => path.replace(/^\/iconify/, ''),
      }
    }
  },
  preview: {
    // 端口号
    port: 58585,
    host: "0.0.0.0",
    proxy: {
      "/Api": {
        target: "http://127.0.0.1:9327",
        ws: false,
        changeOrigin: true,
        /**
         * rewrite path
         * @param path path
         */
        rewrite: (path2) => path2.replace(/^\/Api/, "")
      }
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        // 将pinia全局库实例打包到vendor
        manualChunks(id) {
          if (id.includes(resolve(__vite_injected_original_dirname, "./src/store/index.ts")))
            return "vnedor";
        }
      }
    },
    outDir: "./dist",
    assetsDir: "assets",
    target: "es2015"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL3BsdWdpbnMvY2hlY2tVcGRhdGUvcGx1Z2luLnRzIiwgInBhY2thZ2UuanNvbiIsICJzcmMvcGx1Z2lucy9jaGVja1VwZGF0ZS9jb25maWcudHMiLCAic3JjL3BsdWdpbnMvYWRkQ2hhcnNldFRvQ3NzL2luZGV4LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcaWRlYXNwYWNlXFxcXGh0a2ctMjA2XFxcXHYyXFxcXGlyZHMtaHRrZzIwNi13ZWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGlkZWFzcGFjZVxcXFxodGtnLTIwNlxcXFx2MlxcXFxpcmRzLWh0a2cyMDYtd2ViXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9pZGVhc3BhY2UvaHRrZy0yMDYvdjIvaXJkcy1odGtnMjA2LXdlYi92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdub2RlOnBhdGgnO1xyXG5pbXBvcnQgcHJvY2VzcyBmcm9tICdub2RlOnByb2Nlc3MnO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnO1xyXG4vLyBpbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJyAvLyBhbnRkIFx1NjMwOVx1OTcwMFx1NTJBMFx1OEY3RFxyXG5pbXBvcnQgeyBjcmVhdGVTdmdJY29uc1BsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLXN2Zy1pY29ucyc7XHJcbmltcG9ydCBWdWVJMThuUGx1Z2luIGZyb20gJ0BpbnRsaWZ5L3VucGx1Z2luLXZ1ZS1pMThuL3ZpdGUnO1xyXG5pbXBvcnQgbGVnYWN5IGZyb20gJ0B2aXRlanMvcGx1Z2luLWxlZ2FjeSc7XHJcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnO1xyXG5pbXBvcnQgeyBWeGVSZXNvbHZlciwgbGF6eUltcG9ydCB9IGZyb20gJ3ZpdGUtcGx1Z2luLWxhenktaW1wb3J0JztcclxuaW1wb3J0IHsgdml0ZVBsdWdpblZlcnNpb25PdXRwdXQgfSBmcm9tICcuL3NyYy9wbHVnaW5zL2NoZWNrVXBkYXRlJztcclxuaW1wb3J0IHsgQ2hlY2tVcGRhdGVDb25maWcgfSBmcm9tICcuL3NyYy9wbHVnaW5zL2NoZWNrVXBkYXRlL2NvbmZpZyc7XHJcbmltcG9ydCB7IGFkZENoYXJzZXRUb0Nzc1BsdWdpbiB9IGZyb20gJy4vc3JjL3BsdWdpbnMvYWRkQ2hhcnNldFRvQ3NzL2luZGV4JztcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW1xyXG4gICAgdnVlKCksXHJcbiAgICAvLyBDb21wb25lbnRzKHtcclxuICAgIC8vICAgLy8gZHRzOiB0cnVlLCAvLyBlbmFibGVkIGJ5IGRlZmF1bHQgaWYgYHR5cGVzY3JpcHRgIGlzIGluc3RhbGxlZFxyXG4gICAgLy8gICAvLyByZXNvbHZlcnM6IFsgQW50RGVzaWduVnVlUmVzb2x2ZXIoKSBdLFxyXG4gICAgLy8gfSksXHJcbiAgICBBdXRvSW1wb3J0KHtcclxuICAgICAgaW5jbHVkZTogWy9cXC5bdGpdc3g/JC8sIC9cXC52dWUkLywgL1xcLnZ1ZVxcP3Z1ZS9dLFxyXG4gICAgICBlc2xpbnRyYzoge1xyXG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICAgIGltcG9ydHM6IFtcclxuICAgICAgICAndnVlJyxcclxuICAgICAgICAndnVlLXJvdXRlcicsXHJcbiAgICAgICAgLy8gJ3ZpdGVzdCcsXHJcbiAgICAgICAgLy8gJ0B2dWV1c2UvY29yZScsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgJ0AvdXRpbHMvV2VpSTE4bic6IFsnV2VpSTE4biddLFxyXG4gICAgICAgICAgJ0AvaHR0cFJlcXVlc3QvdHlwaW5ncy50cyc6IFsnSHR0cFJlcXVlc3RSZXNwb25zZScsICdpc0h0dHBSZXF1ZXN0UmVzcG9uc2UnLCAnUmVzcG9uc2VFcnJvciddLFxyXG4gICAgICAgICAgJ0AvaHR0cFJlcXVlc3QvcGVuZGluZy50cyc6IFsnaXNQZW5kaW5nJ10sXHJcbiAgICAgICAgICAnQC9ob29rcy91c2VQYWdpbmF0aW9uJzogWyd1c2VQYWdpbmF0aW9uJ10sXHJcbiAgICAgICAgICAnQC9ob29rcy91c2VNb2RlbERhdGEnOiBbJ3VzZU1vZGVsRGF0YScsICdVc2VNb2RlbERhdGFPcHRpb25zJywgJ1VzZU1vZGVsRGF0YVJldHVybkRhdGEnXSxcclxuICAgICAgICAgIGF4aW9zOiBbJ0F4aW9zUmVzcG9uc2UnXSxcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgICBkdHM6ICdzcmMvYXV0by1pbXBvcnRzLmQudHMnLFxyXG4gICAgfSksXHJcbiAgICBsYXp5SW1wb3J0KHtcclxuICAgICAgcmVzb2x2ZXJzOiBbVnhlUmVzb2x2ZXIoeyBsaWJyYXJ5TmFtZTogJ3Z4ZS10YWJsZScgfSksIFZ4ZVJlc29sdmVyKHsgbGlicmFyeU5hbWU6ICd2eGUtcGMtdWknIH0pXSxcclxuICAgIH0pLFxyXG4gICAgY3JlYXRlU3ZnSWNvbnNQbHVnaW4oe1xyXG4gICAgICBpY29uRGlyczogW3Jlc29sdmUocHJvY2Vzcy5jd2QoKSwgJy4nLCAnc3JjL2Fzc2V0cy9zdmdzJyldLFxyXG4gICAgICBzeW1ib2xJZDogJ2ljb24tW2Rpcl0tW25hbWVdJyxcclxuICAgICAgc3Znb09wdGlvbnM6IHRydWUsXHJcbiAgICB9KSxcclxuICAgIGFkZENoYXJzZXRUb0Nzc1BsdWdpbih7fSksXHJcbiAgICAvLyBcdTUzQzJcdTgwMDNcdTgxRUEgaHR0cHM6Ly9naXRodWIuY29tL2ludGxpZnkvdnVlLWkxOG4tbmV4dC9pc3N1ZXMvNzg5I2lzc3VlY29tbWVudC0xMzU2NzgyNzI2XHJcbiAgICBWdWVJMThuUGx1Z2luKHtcclxuICAgICAgaW5jbHVkZTogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvbG9jYWxlcy8qKicpLCAvLyBQVVQgWU9VUiBPV04gUEFUSCBUTyBMT0NBTEVTIEhFUkVcclxuICAgIH0pLFxyXG4gICAgdml0ZVBsdWdpblZlcnNpb25PdXRwdXQoe1xyXG4gICAgICBqc29uOiB7XHJcbiAgICAgICAgZW5hYmxlOiB0cnVlLFxyXG4gICAgICAgIGZpbGVOYW1lOiBDaGVja1VwZGF0ZUNvbmZpZy5WRVJTSU9OX0ZJTEVfTkFNRSxcclxuICAgICAgfSxcclxuICAgICAgaHRtbDoge1xyXG4gICAgICAgIGVuYWJsZTogdHJ1ZSxcclxuICAgICAgICB0b01ldGE6IHRydWUsXHJcbiAgICAgICAgdG9Db25zb2xlOiB0cnVlLFxyXG4gICAgICAgIHRvR2xvYmFsOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgfSksXHJcbiAgICBsZWdhY3koe1xyXG4gICAgICB0YXJnZXRzOiBbJ2VkZ2UgPj0gMTYnLCAnY2hyb21lID49IDYxJ10sXHJcbiAgICAgIHJlbmRlckxlZ2FjeUNodW5rczogdHJ1ZSxcclxuICAgICAgbW9kZXJuUG9seWZpbGxzOiBbJ2VzLmdsb2JhbC10aGlzJ10sXHJcbiAgICAgIHBvbHlmaWxsczogW1xyXG4gICAgICAgICdlcy5zeW1ib2wnLFxyXG4gICAgICAgICdlcy5hcnJheS5maWx0ZXInLFxyXG4gICAgICAgICdlcy5wcm9taXNlJyxcclxuICAgICAgICAnZXMucHJvbWlzZS5maW5hbGx5JyxcclxuICAgICAgICAnZXMvbWFwJyxcclxuICAgICAgICAnZXMvc2V0JyxcclxuICAgICAgICAnZXMuYXJyYXkuZm9yLWVhY2gnLFxyXG4gICAgICAgICdlcy5vYmplY3QuZGVmaW5lLXByb3BlcnRpZXMnLFxyXG4gICAgICAgICdlcy5vYmplY3QuZGVmaW5lLXByb3BlcnR5JyxcclxuICAgICAgICAnZXMub2JqZWN0LmdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvcicsXHJcbiAgICAgICAgJ2VzLm9iamVjdC5nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3JzJyxcclxuICAgICAgICAnZXMub2JqZWN0LmtleXMnLFxyXG4gICAgICAgICdlcy5vYmplY3QudG8tc3RyaW5nJyxcclxuICAgICAgICAnZXMuZ2xvYmFsLXRoaXMnLFxyXG4gICAgICAgICd3ZWIuZG9tLWNvbGxlY3Rpb25zLmZvci1lYWNoJyxcclxuICAgICAgICAnZXNuZXh0Lmdsb2JhbC10aGlzJyxcclxuICAgICAgICAnZXNuZXh0LnN0cmluZy5tYXRjaC1hbGwnLFxyXG4gICAgICBdLFxyXG4gICAgfSksXHJcbiAgXSxcclxuICByZXNvbHZlOiB7XHJcbiAgICAvLyBcdTZERkJcdTUyQTBcdTUyMkJcdTU0MERcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdAJzogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcclxuICAgICAgLy8gXHU0RkVFXHU1OTBEIGJwbW4tanMtdG9rZW4tc2ltdWxhdGlvbiBcdTVCRjkgaWRzIFx1NzY4NFx1OUVEOFx1OEJBNFx1NUJGQ1x1NTE2NVx1RkYxQWlkcyBcdTRFQzVcdTYzRDBcdTRGOUJcdTU0N0RcdTU0MERcdTVCRkNcdTUxRkFcclxuICAgICAgaWRzOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9zaGltcy9pZHMuanMnKSxcclxuICAgICAgLy8gJ3Z1ZS1pMThuJzogJ3Z1ZS1pMThuL2Rpc3QvdnVlLWkxOG4uY2pzLmpzJyxcclxuICAgIH0sXHJcbiAgfSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIC8vIFx1N0FFRlx1NTNFM1x1NTNGN1xyXG4gICAgcG9ydDogNTE3MyxcclxuICAgIC8vIHBvcnQ6IDgwLFxyXG4gICAgaG9zdDogJzAuMC4wLjAnLFxyXG4gICAgcHJveHk6IHtcclxuICAgICAgJy9BcGknOiB7XHJcbiAgICAgICAgLy8gdGFyZ2V0OiAnaHR0cDovLzM5LjEwNi4xMzAuODU6OTMyOCcsXHJcbiAgICAgICAgLy8gdGFyZ2V0OiAnaHR0cDovLzEwLjE1MS4xMjkuODk6OTMyOCcsXHJcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovLzEyNy4wLjAuMTo5MzI3JyxcclxuICAgICAgICB3czogZmFsc2UsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHJld3JpdGUgcGF0aFxyXG4gICAgICAgICAqIEBwYXJhbSBwYXRoIHBhdGhcclxuICAgICAgICAgKi9cclxuICAgICAgICByZXdyaXRlOiBwYXRoID0+IHBhdGgucmVwbGFjZSgvXlxcL0FwaS8sICcnKSxcclxuICAgICAgICBjb25maWd1cmU6IChwcm94eSwgb3B0aW9ucykgPT4ge1xyXG4gICAgICAgICAgLy8gXHU5MTREXHU3RjZFXHU2QjY0XHU5ODc5XHU1M0VGXHU1NzI4XHU1NENEXHU1RTk0XHU1OTM0XHU0RTJEXHU3NzBCXHU1MjMwXHU4QkY3XHU2QzQyXHU3Njg0XHU3NzFGXHU1QjlFXHU1NzMwXHU1NzQwXHJcbiAgICAgICAgICBwcm94eS5vbigncHJveHlSZXMnLCAocHJveHlSZXMsIHJlcSkgPT4ge1xyXG4gICAgICAgICAgICBwcm94eVJlcy5oZWFkZXJzWyd4LXJlYWwtdXJsJ10gPSBuZXcgVVJMKHJlcS51cmwgfHwgJycsIG9wdGlvbnMudGFyZ2V0IGFzIHN0cmluZyk/LmhyZWYgfHwgJyc7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICAnL0xhbmcnOiB7XHJcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovLzE3Mi4xNi43LjQ0JyxcclxuICAgICAgICB3czogZmFsc2UsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHJld3JpdGUgcGF0aFxyXG4gICAgICAgICAqIEBwYXJhbSBwYXRoIHBhdGhcclxuICAgICAgICAgKi9cclxuICAgICAgICByZXdyaXRlOiBwYXRoID0+IHBhdGgucmVwbGFjZSgvXlxcL0xhbmcvLCAnJyksXHJcbiAgICAgICAgY29uZmlndXJlOiAocHJveHksIG9wdGlvbnMpID0+IHtcclxuICAgICAgICAgIC8vIFx1OTE0RFx1N0Y2RVx1NkI2NFx1OTg3OVx1NTNFRlx1NTcyOFx1NTRDRFx1NUU5NFx1NTkzNFx1NEUyRFx1NzcwQlx1NTIzMFx1OEJGN1x1NkM0Mlx1NzY4NFx1NzcxRlx1NUI5RVx1NTczMFx1NTc0MFxyXG4gICAgICAgICAgcHJveHkub24oJ3Byb3h5UmVzJywgKHByb3h5UmVzLCByZXEpID0+IHtcclxuICAgICAgICAgICAgcHJveHlSZXMuaGVhZGVyc1sneC1yZWFsLXVybCddID0gbmV3IFVSTChyZXEudXJsIHx8ICcnLCBvcHRpb25zLnRhcmdldCBhcyBzdHJpbmcpPy5ocmVmIHx8ICcnO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAgJy9pY29uaWZ5Jzoge1xyXG4gICAgICAgIHRhcmdldDogJycsXHJcbiAgICAgICAgd3M6IGZhbHNlLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiByZXdyaXRlIHBhdGhcclxuICAgICAgICAgKiBAcGFyYW0gcGF0aCBwYXRoXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgLy8gcmV3cml0ZTogcGF0aCA9PiBwYXRoLnJlcGxhY2UoL15cXC9pY29uaWZ5LywgJycpLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG5cclxuICBwcmV2aWV3OiB7XHJcbiAgICAvLyBcdTdBRUZcdTUzRTNcdTUzRjdcclxuICAgIHBvcnQ6IDU4NTg1LFxyXG4gICAgaG9zdDogJzAuMC4wLjAnLFxyXG4gICAgcHJveHk6IHtcclxuICAgICAgJy9BcGknOiB7XHJcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovLzEyNy4wLjAuMTo5MzI3JyxcclxuICAgICAgICB3czogZmFsc2UsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHJld3JpdGUgcGF0aFxyXG4gICAgICAgICAqIEBwYXJhbSBwYXRoIHBhdGhcclxuICAgICAgICAgKi9cclxuICAgICAgICByZXdyaXRlOiBwYXRoID0+IHBhdGgucmVwbGFjZSgvXlxcL0FwaS8sICcnKSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBjc3M6IHtcclxuICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcclxuICAgICAgbGVzczoge1xyXG4gICAgICAgIGphdmFzY3JpcHRFbmFibGVkOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIC8vIFx1NUMwNnBpbmlhXHU1MTY4XHU1QzQwXHU1RTkzXHU1QjlFXHU0RjhCXHU2MjUzXHU1MzA1XHU1MjMwdmVuZG9yXHJcbiAgICAgICAgbWFudWFsQ2h1bmtzKGlkKSB7XHJcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMocmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9zdG9yZS9pbmRleC50cycpKSkgcmV0dXJuICd2bmVkb3InO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgb3V0RGlyOiAnLi9kaXN0JyxcclxuICAgIGFzc2V0c0RpcjogJ2Fzc2V0cycsXHJcbiAgICB0YXJnZXQ6ICdlczIwMTUnLFxyXG4gIH0sXHJcbn0pO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXGlkZWFzcGFjZVxcXFxodGtnLTIwNlxcXFx2MlxcXFxpcmRzLWh0a2cyMDYtd2ViXFxcXHNyY1xcXFxwbHVnaW5zXFxcXGNoZWNrVXBkYXRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxpZGVhc3BhY2VcXFxcaHRrZy0yMDZcXFxcdjJcXFxcaXJkcy1odGtnMjA2LXdlYlxcXFxzcmNcXFxccGx1Z2luc1xcXFxjaGVja1VwZGF0ZVxcXFxwbHVnaW4udHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2lkZWFzcGFjZS9odGtnLTIwNi92Mi9pcmRzLWh0a2cyMDYtd2ViL3NyYy9wbHVnaW5zL2NoZWNrVXBkYXRlL3BsdWdpbi50c1wiO2ltcG9ydCB7IHdyaXRlRmlsZSB9IGZyb20gJ25vZGU6ZnMnXHJcbmltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCdcclxuaW1wb3J0IHR5cGUgeyBDb25maWdFbnYsIEluZGV4SHRtbFRyYW5zZm9ybVJlc3VsdCwgUGx1Z2luLCBVc2VyQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHBhY2thZ2VKU09OIGZyb20gJy4uLy4uLy4uL3BhY2thZ2UuanNvbidcclxuaW1wb3J0IHsgQ2hlY2tVcGRhdGVDb25maWcgfSBmcm9tICcuL2NvbmZpZydcclxuXHJcbmludGVyZmFjZSBIdG1sIHtcclxuICBlbmFibGU/OiBib29sZWFuXHJcbiAgdG9NZXRhPzogYm9vbGVhblxyXG4gIHRvQ29uc29sZT86IGJvb2xlYW5cclxuICB0b0dsb2JhbD86IGJvb2xlYW5cclxufVxyXG5cclxuaW50ZXJmYWNlIEpzb24ge1xyXG4gIGVuYWJsZT86IGJvb2xlYW5cclxuICBmaWxlTmFtZTogc3RyaW5nXHJcbn1cclxuXHJcbmludGVyZmFjZSBWaXRlUGx1Z2luVmVyc2lvbklucHV0IHtcclxuICBuYW1lPzogc3RyaW5nXHJcbiAgdmVyc2lvbj86IHN0cmluZ1xyXG4gIGh0bWw/OiBIdG1sXHJcbiAganNvbj86IEpzb25cclxufVxyXG5cclxuLyoqXHJcbiAqIFx1ODNCN1x1NTNENlx1NzI0OFx1NjcyQ1x1NTNGN1xyXG4gKiBAZGVzY3JpcHRpb24gXHU3MjQ4XHU2NzJDXHU1M0Y3XHU1M0Q2XHU4MUVBIGBwYWNrYWdlLmpzb25gIGB2ZXJzaW9uYCwgXHU1RTc2XHU1MkEwXHU1MTY1XHU2NUY2XHU5NUY0XHU2MjMzXHU0RjVDXHU0RTNBXHU1NDBFXHU3RjAwXHJcbiAqXHJcbiAqIFx1OEZEOVx1OTFDQ1x1NkNBMVx1NjcwOVx1NEY3Rlx1NzUyOFx1ODFFQVx1NTg5RVx1NzY4NFx1NzI0OFx1NjcyQ1x1NTNGNywgXHU1NkUwXHU0RTNBXHU1NzI4XHU0RTkxXHU0RTBBXHU2MjUzXHU1MzA1XHU2NUY2XHU2NUUwXHU2Q0Q1XHU1QzA2XHU4MUVBXHU1ODlFXHU1NDBFXHU3Njg0XHU3MjQ4XHU2NzJDXHU1M0Y3XHU2M0QwXHU0RUE0XHU1MjMwIGdpdCBcdTRFRDNcdTVFOTM7XHJcbiAqIFx1NEUwQlx1NkIyMVx1NjI1M1x1NTMwNVx1NjVGNlx1NjVFMFx1NkNENVx1ODNCN1x1NTNENlx1NjcwMFx1NjVCMFx1NzY4NFx1NzI0OFx1NjcyQ1x1NTNGNywgXHU2MjQwXHU0RUU1XHU1NzI4XHU3MjQ4XHU2NzJDXHU1M0Y3XHU0RTJEXHU1ODlFXHU1MkEwXHU0RTg2XHU2NUY2XHU5NUY0XHU2MjMzXHU1NDBFXHU3RjAwXHJcbiAqL1xyXG5jb25zdCBnZW5lcmF0ZVZlcnNpb24gPSAoKSA9PiBgJHtwYWNrYWdlSlNPTi52ZXJzaW9ufS4ke0RhdGUubm93KCl9YFxyXG5cclxuZXhwb3J0IGNvbnN0IHZpdGVQbHVnaW5WZXJzaW9uT3V0cHV0OiAoaW5wdXQ/OiBWaXRlUGx1Z2luVmVyc2lvbklucHV0KSA9PiBQbHVnaW4gPSAoaW5wdXQgPSB7fSkgPT4ge1xyXG4gIGNvbnN0IHtcclxuICAgIG5hbWUgPSBDaGVja1VwZGF0ZUNvbmZpZy5OQU1FLFxyXG4gICAgdmVyc2lvbiA9IGdlbmVyYXRlVmVyc2lvbigpLFxyXG4gICAgaHRtbCA9IHsgZW5hYmxlOiB0cnVlLCB0b01ldGE6IHRydWUsIHRvQ29uc29sZTogdHJ1ZSwgdG9HbG9iYWw6IHRydWUgfSxcclxuICAgIGpzb24gPSB7IGVuYWJsZTogdHJ1ZSwgZmlsZU5hbWU6IENoZWNrVXBkYXRlQ29uZmlnLlZFUlNJT05fRklMRV9OQU1FIH0sXHJcbiAgfSA9IGlucHV0XHJcbiAgbGV0IGNvbmZpZzogYW55XHJcblxyXG4gIGNvbnN0IHdyaXRlVmVyc2lvbiA9ICh2ZXJzaW9uRmlsZTogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcpID0+IHtcclxuICAgIHdyaXRlRmlsZSh2ZXJzaW9uRmlsZSwgY29udGVudCwgKGVycikgPT4ge1xyXG4gICAgICBpZiAoZXJyKVxyXG4gICAgICAgIHRocm93IGVyclxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIC8qKiBcdTVGNTNcdTUyNERcdThGRDBcdTg4NENcdTczQUZcdTU4ODMgKi9cclxuICBsZXQgX21vZGU6IHN0cmluZyA9ICdwcm9kdWN0aW9uJ1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgbmFtZTogJ3ZpdGUtcGx1Z2luLXZlcnNpb24tb3V0cHV0JyxcclxuXHJcbiAgICBjb25maWdSZXNvbHZlZChyZXNvbHZlZENvbmZpZykge1xyXG4gICAgICBjb25maWcgPSByZXNvbHZlZENvbmZpZ1xyXG4gICAgfSxcclxuXHJcbiAgICBhc3luYyB0cmFuc2Zvcm1JbmRleEh0bWwoKSB7XHJcbiAgICAgIGNvbnN0IGVsczogSW5kZXhIdG1sVHJhbnNmb3JtUmVzdWx0ID0gW11cclxuXHJcbiAgICAgIGlmICghaHRtbD8uZW5hYmxlKVxyXG4gICAgICAgIHJldHVybiBlbHNcclxuXHJcbiAgICAgIGNvbnN0IHByaW50TmFtZSA9IG5hbWVcclxuICAgICAgY29uc3QgcHJpbnRJbmZvID0gYCR7cHJpbnROYW1lfTogJHt2ZXJzaW9ufWBcclxuXHJcbiAgICAgIGh0bWwudG9NZXRhICYmIGVscy5wdXNoKHtcclxuICAgICAgICB0YWc6ICdtZXRhJyxcclxuICAgICAgICBpbmplY3RUbzogJ2hlYWQtcHJlcGVuZCcsXHJcbiAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgIG5hbWU6IHByaW50TmFtZSxcclxuICAgICAgICAgIGNvbnRlbnQ6IHByaW50SW5mbyxcclxuICAgICAgICB9LFxyXG4gICAgICB9KVxyXG4gICAgICBodG1sLnRvQ29uc29sZSAmJiBlbHMucHVzaCh7XHJcbiAgICAgICAgdGFnOiAnc2NyaXB0JyxcclxuICAgICAgICBpbmplY3RUbzogJ2JvZHknLFxyXG4gICAgICAgIGNoaWxkcmVuOiBgY29uc29sZS5sb2coXCIke3ByaW50SW5mb31cIilgLFxyXG4gICAgICB9KVxyXG4gICAgICBodG1sLnRvR2xvYmFsICYmIGVscy5wdXNoKHtcclxuICAgICAgICB0YWc6ICdzY3JpcHQnLFxyXG4gICAgICAgIGluamVjdFRvOiAnYm9keScsXHJcbiAgICAgICAgY2hpbGRyZW46IGB2YXIgJHtwcmludE5hbWV9ID0gXCIke3ZlcnNpb259XCI7YCxcclxuICAgICAgfSlcclxuXHJcbiAgICAgIHJldHVybiBlbHNcclxuICAgIH0sXHJcblxyXG4gICAgYnVpbGRTdGFydCgpIHtcclxuICAgICAgaWYgKCFqc29uPy5lbmFibGUpXHJcbiAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICAvLyAvLyBcdTVGMDBcdTUzRDFcdTczQUZcdTU4ODNcdTRFMERcdTUxOTlcdTUxNjUganNvbiBcdTY1ODdcdTRFRjZcclxuICAgICAgLy8gaWYgKG1vZGUgPT09ICdkZXZlbG9wbWVudCcpIHJldHVyblxyXG4gICAgICBjb25zdCBmaWxlID0gcGF0aC5yZXNvbHZlKGNvbmZpZy5yb290LCBjb25maWcucHVibGljRGlyLCBqc29uLmZpbGVOYW1lKVxyXG4gICAgICBjb25zdCBjb250ZW50ID0gSlNPTi5zdHJpbmdpZnkoeyB2ZXJzaW9uIH0pXHJcbiAgICAgIHdyaXRlVmVyc2lvbihmaWxlLCBjb250ZW50KVxyXG4gICAgfSxcclxuICAgIGNvbmZpZyhjb25maWc6IFVzZXJDb25maWcsIGVudjogQ29uZmlnRW52KSB7XHJcbiAgICAgIF9tb2RlID0gZW52Lm1vZGUgfHwgJydcclxuICAgIH0sXHJcbiAgfVxyXG59XHJcbiIsICJ7XHJcbiAgXCJuYW1lXCI6IFwiZnJhbWV3b3JrNC4wXCIsXHJcbiAgXCJ0eXBlXCI6IFwibW9kdWxlXCIsXHJcbiAgXCJ2ZXJzaW9uXCI6IFwiMy4wLjZcIixcclxuICBcInByaXZhdGVcIjogdHJ1ZSxcclxuICBcInNjcmlwdHNcIjoge1xyXG4gICAgXCJkZXZcIjogXCJ2aXRlXCIsXHJcbiAgICBcImJ1aWxkXCI6IFwidml0ZSBidWlsZCAtLW1vZGUgZGV2ZWxvcG1lbnRcIixcclxuICAgIFwiYnVpbGQ6cHJvXCI6IFwibm9kZSAtLW1heF9vbGRfc3BhY2Vfc2l6ZT04MDAwIC4vbm9kZV9tb2R1bGVzL3ZpdGUvYmluL3ZpdGUuanMgYnVpbGQgLS1tb2RlIHByb2R1Y3Rpb25cIixcclxuICAgIFwiYnVpbGQ6ZGVtb1wiOiBcIm5vZGUgLS1tYXhfb2xkX3NwYWNlX3NpemU9ODAwMCAuL25vZGVfbW9kdWxlcy92aXRlL2Jpbi92aXRlLmpzIGJ1aWxkIC0tbW9kZSBkZW1vXCIsXHJcbiAgICBcImJ1aWxkOmRldlwiOiBcIm5vZGUgLS1tYXhfb2xkX3NwYWNlX3NpemU9ODAwMCAuL25vZGVfbW9kdWxlcy92aXRlL2Jpbi92aXRlLmpzIGJ1aWxkIC0tbW9kZSBkZXZlbG9wbWVudFwiLFxyXG4gICAgXCJidWlsZDpzdGFnZVwiOiBcIm5vZGUgLS1tYXhfb2xkX3NwYWNlX3NpemU9ODAwMCAuL25vZGVfbW9kdWxlcy92aXRlL2Jpbi92aXRlLmpzIGJ1aWxkIC0tbW9kZSBzdGFnZVwiLFxyXG4gICAgXCJidWlsZDp0ZXN0XCI6IFwibm9kZSAtLW1heF9vbGRfc3BhY2Vfc2l6ZT04MDAwIC4vbm9kZV9tb2R1bGVzL3ZpdGUvYmluL3ZpdGUuanMgYnVpbGQgLS1tb2RlIHRlc3RcIixcclxuICAgIFwiYnVpbGQ6c3RhdGljXCI6IFwibm9kZSAtLW1heF9vbGRfc3BhY2Vfc2l6ZT04MDAwIC4vbm9kZV9tb2R1bGVzL3ZpdGUvYmluL3ZpdGUuanMgYnVpbGQgLS1tb2RlIHN0YXRpY1wiLFxyXG4gICAgXCJidWlsZDpmcm9udFwiOiBcIm5vZGUgLS1tYXhfb2xkX3NwYWNlX3NpemU9ODAwMCAuL25vZGVfbW9kdWxlcy92aXRlL2Jpbi92aXRlLmpzIGJ1aWxkIC0tbW9kZSBmcm9udFwiLFxyXG4gICAgXCJwcmV2aWV3XCI6IFwidml0ZSBwcmV2aWV3XCIsXHJcbiAgICBcImNvbW1pdFwiOiBcImdpdC1jelwiLFxyXG4gICAgXCJsaW50XCI6IFwiZXNsaW50IC4gLS1jYWNoZVwiLFxyXG4gICAgXCJsaW50OnJlcG9ydFwiOiBcImVzbGludCAuL3NyYyAgLS1mb3JtYXQgaHRtbCA+IGxpbnQtcmVwb3J0Lmh0bWwgIHx8IGV4aXQgMFwiLFxyXG4gICAgXCJsaW50OmZpeFwiOiBcImVzbGludCAuIC0tZml4IC0tY2FjaGVcIixcclxuICAgIFwibGludDpxdWlldFwiOiBcImVzbGludCAuIC0tcXVpZXQgLS1jYWNoZVwiLFxyXG4gICAgXCJnZW5lcmF0ZS1kYXJrLXRoZW1lLWNzc1wiOiBcImVzbm8gLi9zY3JpcHRzL2dlbmVyYXRlLWRhcmstdGhlbWUtY3NzLnRzXCIsXHJcbiAgICBcImRvd25sb2FkLW9wZW5hcGlcIjogXCJlc25vIC4vc2NyaXB0cy9kb3dubG9hZC1vcGVuYXBpLnRzXCIsXHJcbiAgICBcImNvZGVnZW5cIjogXCJlc25vIC4vc2NyaXB0cy9vcGVuYXBpLWNvZGVnZW4udHNcIixcclxuICAgIFwiY29kZWdlbjpjbGVhblwiOiBcImVzbm8gLi9zY3JpcHRzL29wZW5hcGktY29kZWdlbi50cyAmJiBybSBzcmMvYXBpL3VpLXNjaGVtYXMvKiAmJiBnaXQgY2hlY2tvdXQgLS0gc3JjL2FwaS91aS1zY2hlbWFzXCIsXHJcbiAgICBcImNvZGVnZW46dmlld3NcIjogXCJlc25vIC4vc2NyaXB0cy9vcGVuYXBpLXZpZXdzLWNvZGVnZW4udHNcIixcclxuICAgIFwiZG9jczpkZXZcIjogXCJ2aXRlcHJlc3MgZGV2IGRvY3MgLS1wb3J0IDQ1MDAwXCIsXHJcbiAgICBcImRvY3M6YnVpbGRcIjogXCJ2aXRlcHJlc3MgYnVpbGQgZG9jc1wiLFxyXG4gICAgXCJkb2NzOnByZXZpZXdcIjogXCJ2aXRlcHJlc3MgcHJldmlldyBkb2NzIC0tcG9ydCA0NTAwMFwiLFxyXG4gICAgXCJ0ZXN0XCI6IFwidml0ZXN0XCIsXHJcbiAgICBcInRlc3Q6Y29kZWdlblwiOiBcIm5weCBlc25vIC4vc2NyaXB0cy9vcGVuYXBpLWNvZGVnZW4udHNcIixcclxuICAgIFwidGVzdDpzcGVjOmNhcHRjaC1pbWFnZVwiOiBcInZpdGVzdCB0ZXN0cy91dGlscy9DYXB0Y2hhSW1hZ2UudGVzdC50c1wiLFxyXG4gICAgXCJ0ZXN0OmUyZTpwcmVwYXJlXCI6IFwibnBtIHJ1biBidWlsZCAmJiBucG0gcnVuIHByZXZpZXdcIixcclxuICAgIFwidGVzdDplMmVcIjogXCJwbGF5d3JpZ2h0IHRlc3QgLi90ZXN0cy9lMmUvIC0td29ya2Vycz0zXCIsXHJcbiAgICBcInRlc3Q6ZTJlOmhlYWRlZFwiOiBcInBsYXl3cmlnaHQgdGVzdCAtLWhlYWRlZCAtLXdvcmtlcnM9M1wiLFxyXG4gICAgXCJ0ZXN0OmUyZTp1aVwiOiBcInBsYXl3cmlnaHQgdGVzdCAtLXVpIC0td29ya2Vycz0xXCIsXHJcbiAgICBcInRlc3Q6ZTJlOnJlcG9ydFwiOiBcImVjaG8gXFxcIlx1NjdFNVx1NzcwQlx1NkQ0Qlx1OEJENVx1NjJBNVx1NTQ0QVxcXCIgJiYgcGxheXdyaWdodCBzaG93LXJlcG9ydFwiLFxyXG4gICAgXCJ0ZXN0OmUyZTpjb2RlZ2VuXCI6IFwicGxheXdyaWdodCBjb2RlZ2VuIGh0dHA6Ly9sb2NhbGhvc3Q6NTg1ODVcIlxyXG4gIH0sXHJcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xyXG4gICAgXCJAYW50LWRlc2lnbi9pY29ucy12dWVcIjogXCJeNi4xLjBcIixcclxuICAgIFwiQGNrZWRpdG9yL2NrZWRpdG9yNS1idWlsZC1jbGFzc2ljXCI6IFwiXjQzLjMuMVwiLFxyXG4gICAgXCJAY2tlZGl0b3IvY2tlZGl0b3I1LXZ1ZVwiOiBcIl43LjIuMFwiLFxyXG4gICAgXCJAY29kZW1pcnJvci9sYW5nLXhtbFwiOiBcIl42LjEuMFwiLFxyXG4gICAgXCJAY29kZW1pcnJvci90aGVtZS1vbmUtZGFya1wiOiBcIl42LjEuM1wiLFxyXG4gICAgXCJAaGFuZHNvbnRhYmxlL3Z1ZTNcIjogXCJeMTIuMy4zXCIsXHJcbiAgICBcIkBpY29uaWZ5L2ljb25pZnlcIjogXCJeMy4xLjBcIixcclxuICAgIFwiQHZ1ZS1vZmZpY2UvZG9jeFwiOiBcIl4xLjYuM1wiLFxyXG4gICAgXCJAdnVlLW9mZmljZS9leGNlbFwiOiBcIl4xLjcuMTRcIixcclxuICAgIFwiQHZ1ZS1vZmZpY2UvcGRmXCI6IFwiXjIuMC4xMFwiLFxyXG4gICAgXCJAdnVldXNlL2NvcmVcIjogXCIxMC4xLjJcIixcclxuICAgIFwiYW5pbWF0ZS5jc3NcIjogXCJeNC4xLjFcIixcclxuICAgIFwiYW50LWRlc2lnbi12dWVcIjogXCJeMy4yLjIwXCIsXHJcbiAgICBcImF4aW9zXCI6IFwiXjEuNC4wXCIsXHJcbiAgICBcImJwbW4tanNcIjogXCJeMTguOS4xXCIsXHJcbiAgICBcImJwbW4tanMtcHJvcGVydGllcy1wYW5lbFwiOiBcIl41LjQ0LjBcIixcclxuICAgIFwiYnBtbi1qcy10b2tlbi1zaW11bGF0aW9uXCI6IFwiXjAuMzguMlwiLFxyXG4gICAgXCJjYW11bmRhLWJwbW4tbW9kZGxlXCI6IFwiXjcuMC4xXCIsXHJcbiAgICBcImNsYXNzLXRyYW5zZm9ybWVyXCI6IFwiXjAuNS4xXCIsXHJcbiAgICBcImNvZGVtaXJyb3ItZWRpdG9yLXZ1ZTNcIjogXCJeMi44LjBcIixcclxuICAgIFwiY3J5cHRvLWpzXCI6IFwiXjQuMS4xXCIsXHJcbiAgICBcImRheWpzXCI6IFwiXjEuMTEuN1wiLFxyXG4gICAgXCJkaHRtbHgtZ2FudHRcIjogXCJeOS4xLjBcIixcclxuICAgIFwiZGlhZ3JhbS1qc1wiOiBcIl4xNS40LjBcIixcclxuICAgIFwiZGlhZ3JhbS1qcy1taW5pbWFwXCI6IFwiXjUuMi4wXCIsXHJcbiAgICBcImVjaGFydHNcIjogXCJeNS40LjJcIixcclxuICAgIFwiZm9ybS1kYXRhXCI6IFwiXjQuMC4wXCIsXHJcbiAgICBcImZyYW1ld29yazQuMFwiOiBcImZpbGU6XCIsXHJcbiAgICBcImhhbmRzb250YWJsZVwiOiBcIl4xMi4yLjBcIixcclxuICAgIFwianNlbmNyeXB0XCI6IFwiXjMuMy4yXCIsXHJcbiAgICBcImxvZGFzaC1lc1wiOiBcIl40LjE3LjIxXCIsXHJcbiAgICBcIm1hdGhqc1wiOiBcIl4xMS4xMC4wXCIsXHJcbiAgICBcIm1wNGJveFwiOiBcIl4wLjUuM1wiLFxyXG4gICAgXCJwaW5pYS1wbHVnaW4tcGVyc2lzdGVkc3RhdGVcIjogXCJeMy4xLjBcIixcclxuICAgIFwicXNcIjogXCJeNi4xMS4yXCIsXHJcbiAgICBcInJlZmxlY3QtbWV0YWRhdGFcIjogXCJeMC4xLjEzXCIsXHJcbiAgICBcInNhc3NcIjogXCJeMS43Ny44XCIsXHJcbiAgICBcInNvcnRhYmxlanNcIjogXCJeMS4xNS4yXCIsXHJcbiAgICBcInNwbGl0cGFuZXNcIjogXCJeMy4xLjVcIixcclxuICAgIFwic3ZnLXBhbi16b29tXCI6IFwiXjMuNi4yXCIsXHJcbiAgICBcInZhbnRcIjogXCJeNC45LjE3XCIsXHJcbiAgICBcInZjb25zb2xlXCI6IFwiXjMuMTUuMVwiLFxyXG4gICAgXCJ2dWVcIjogXCJ+My41LjBcIixcclxuICAgIFwidnVlLWVjaGFydHNcIjogXCJeNi41LjVcIixcclxuICAgIFwidnVlLWkxOG5cIjogXCJeOS4yLjJcIixcclxuICAgIFwidnVlLXJvdXRlclwiOiBcIl40LjEuNlwiLFxyXG4gICAgXCJ2dWUtc3ZnLXBhbi16b29tXCI6IFwiXjIuMS4wXCIsXHJcbiAgICBcInZ1ZWRyYWdnYWJsZVwiOiBcIl4yLjI0LjNcIixcclxuICAgIFwidnhlLXBjLXVpXCI6IFwiXjQuMS4yMlwiLFxyXG4gICAgXCJ2eGUtdGFibGVcIjogXCJeNC43Ljc3XCIsXHJcbiAgICBcIndlYi1zdG9yYWdlLWNhY2hlXCI6IFwiXjEuMS4xXCJcclxuICB9LFxyXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcclxuICAgIFwiQGFudGZ1L2VzbGludC1jb25maWdcIjogXCJeMi4yNy4zXCIsXHJcbiAgICBcIkBiYWJlbC90eXBlc1wiOiBcIl43LjIyLjVcIixcclxuICAgIFwiQGNvbW1pdGxpbnQvY2xpXCI6IFwiXjE3LjYuM1wiLFxyXG4gICAgXCJAY29tbWl0bGludC9jb25maWctY29udmVudGlvbmFsXCI6IFwiXjE3LjYuM1wiLFxyXG4gICAgXCJAZXNsaW50L2pzXCI6IFwiXjkuMTcuMFwiLFxyXG4gICAgXCJAaWNvbmlmeS9qc29uXCI6IFwiXjIuMi44MFwiLFxyXG4gICAgXCJAaW50bGlmeS91bnBsdWdpbi12dWUtaTE4blwiOiBcIl4wLjExLjBcIixcclxuICAgIFwiQHBsYXl3cmlnaHQvdGVzdFwiOiBcIl4xLjQ2LjFcIixcclxuICAgIFwiQHB1cmdlLWljb25zL2dlbmVyYXRlZFwiOiBcIl4wLjkuMFwiLFxyXG4gICAgXCJAc3RvcGxpZ2h0L2pzb24tcmVmLXJlc29sdmVyXCI6IFwiXjMuMS41XCIsXHJcbiAgICBcIkB0eXBlcy9jcnlwdG8tanNcIjogXCJeNC4yLjJcIixcclxuICAgIFwiQHR5cGVzL2ZzLWV4dHJhXCI6IFwiXjExLjAuMVwiLFxyXG4gICAgXCJAdHlwZXMvZ2V0LXBpeGVsc1wiOiBcIl4zLjMuMlwiLFxyXG4gICAgXCJAdHlwZXMvbG9kYXNoLWVzXCI6IFwiXjQuMTcuN1wiLFxyXG4gICAgXCJAdHlwZXMvbm9kZVwiOiBcIl4xOC4xNi42XCIsXHJcbiAgICBcIkB0eXBlcy9xc1wiOiBcIl42LjkuN1wiLFxyXG4gICAgXCJAdHlwZXMvc2VtdmVyXCI6IFwiXjcuNS4wXCIsXHJcbiAgICBcIkB0eXBlcy9zb3J0YWJsZWpzXCI6IFwiXjEuMTUuN1wiLFxyXG4gICAgXCJAdHlwZXNjcmlwdC1lc2xpbnQvZXNsaW50LXBsdWdpblwiOiBcIl44LjMuMFwiLFxyXG4gICAgXCJAdHlwZXNjcmlwdC1lc2xpbnQvcGFyc2VyXCI6IFwiXjguMy4wXCIsXHJcbiAgICBcIkB2aXRlanMvcGx1Z2luLWxlZ2FjeVwiOiBcIl40LjEuMVwiLFxyXG4gICAgXCJAdml0ZWpzL3BsdWdpbi12dWVcIjogXCJeNC42LjJcIixcclxuICAgIFwiQHZ1ZS90ZXN0LXV0aWxzXCI6IFwiXjIuNC4xXCIsXHJcbiAgICBcImF1dG9wcmVmaXhlclwiOiBcIl4xMC40LjE0XCIsXHJcbiAgICBcImNoYWxrXCI6IFwiXjUuMy4wXCIsXHJcbiAgICBcImNvbW1pdGl6ZW5cIjogXCJeNC4zLjBcIixcclxuICAgIFwiY29tbWl0bGludC1jb25maWctY3pcIjogXCJeMC4xMy4zXCIsXHJcbiAgICBcImN6LWNvbnZlbnRpb25hbC1jaGFuZ2Vsb2dcIjogXCJeMy4zLjBcIixcclxuICAgIFwiY3otY3VzdG9tXCI6IFwiXjAuMC4yXCIsXHJcbiAgICBcImRlcmVmZXJlbmNlLWpzb24tc2NoZW1hXCI6IFwiXjAuMi4xXCIsXHJcbiAgICBcImRvdGVudlwiOiBcIl4xNi4zLjFcIixcclxuICAgIFwiZXNsaW50XCI6IFwifjkuOS4xXCIsXHJcbiAgICBcImVzbGludC1wbHVnaW4tZm9ybWF0XCI6IFwiXjAuMS4yXCIsXHJcbiAgICBcImVzbGludC1wbHVnaW4tanNkb2NcIjogXCJeNDYuMTAuMVwiLFxyXG4gICAgXCJlc2xpbnQtcGx1Z2luLXZ1ZVwiOiBcIl45LjMyLjBcIixcclxuICAgIFwiZXNtb1wiOiBcIl4wLjE3LjBcIixcclxuICAgIFwiZnMtZXh0cmFcIjogXCJeMTEuMS4xXCIsXHJcbiAgICBcImdldC1waXhlbHNcIjogXCJeMy4zLjNcIixcclxuICAgIFwiZ2xvYmFsc1wiOiBcIl4xNS4xNC4wXCIsXHJcbiAgICBcImhhcHB5LWRvbVwiOiBcIl4xMC45LjBcIixcclxuICAgIFwiaHVza3lcIjogXCJeOC4wLjNcIixcclxuICAgIFwianMtY29va2llXCI6IFwiXjIuMi4wXCIsXHJcbiAgICBcImxlc3NcIjogXCJeNC4xLjNcIixcclxuICAgIFwibGludC1zdGFnZWRcIjogXCJeMTUuMi4wXCIsXHJcbiAgICBcIm9wZW5hcGktdHlwZXNcIjogXCJeMTIuMS4zXCIsXHJcbiAgICBcInBpbmlhXCI6IFwiXjIuMC4zNlwiLFxyXG4gICAgXCJwb250LWVuZ2luZVwiOiBcIl4xLjUuMTBcIixcclxuICAgIFwicG9zdGNzc1wiOiBcIl44LjQuMjNcIixcclxuICAgIFwicG9zdGNzcy1pbXBvcnRcIjogXCJeMTUuMS4wXCIsXHJcbiAgICBcInNlbXZlclwiOiBcIl43LjUuNFwiLFxyXG4gICAgXCJzd2FnZ2VyLWF1dG9nZW5cIjogXCJeMi4yMy4xXCIsXHJcbiAgICBcInN3YWdnZXItdHlwZXNjcmlwdC1hcGlcIjogXCJeMTIuMC40XCIsXHJcbiAgICBcInRhaWx3aW5kY3NzXCI6IFwiXjMuMy4yXCIsXHJcbiAgICBcInRzLW5vZGVcIjogXCJeMTAuOS4xXCIsXHJcbiAgICBcInR5cGVzY3JpcHRcIjogXCJeNS41LjRcIixcclxuICAgIFwidHlwZXNjcmlwdC1lc2xpbnRcIjogXCJeOC4xOS4wXCIsXHJcbiAgICBcInVucGx1Z2luLWF1dG8taW1wb3J0XCI6IFwiXjAuMTcuNVwiLFxyXG4gICAgXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50c1wiOiBcIl4wLjI0LjFcIixcclxuICAgIFwidml0ZVwiOiBcIl40LjQuNFwiLFxyXG4gICAgXCJ2aXRlLXBsdWdpbi1sYXp5LWltcG9ydFwiOiBcIl4xLjAuN1wiLFxyXG4gICAgXCJ2aXRlLXBsdWdpbi1zdmctaWNvbnNcIjogXCJeMi4wLjFcIixcclxuICAgIFwidml0ZXByZXNzXCI6IFwiMS4wLjAtYmV0YS4yXCIsXHJcbiAgICBcInZpdGVzdFwiOiBcIl4yLjAuNVwiLFxyXG4gICAgXCJ2dWUtdHNjXCI6IFwiXjIuMC4xM1wiLFxyXG4gICAgXCJ2dWUtdHlwZXNcIjogXCJeNS4xLjFcIlxyXG4gIH0sXHJcbiAgXCJjb25maWdcIjoge1xyXG4gICAgXCJjb21taXRpemVuXCI6IHtcclxuICAgICAgXCJwYXRoXCI6IFwiLi9ub2RlX21vZHVsZXMvY3otY3VzdG9tXCJcclxuICAgIH0sXHJcbiAgICBcImN6LWN1c3RvbVwiOiB7XHJcbiAgICAgIFwiY29uZmlnXCI6IFwiLmN6LWNvbmZpZy5janNcIlxyXG4gICAgfVxyXG4gIH0sXHJcbiAgXCJsaW50LXN0YWdlZFwiOiB7XHJcbiAgICBcIioue3Z1ZSxqcyx0cyxqc3gsdHN4fVwiOiBcImVzbGludCAtLWZpeCAtLXF1aWV0IC0tY2FjaGVcIlxyXG4gIH1cclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXGlkZWFzcGFjZVxcXFxodGtnLTIwNlxcXFx2MlxcXFxpcmRzLWh0a2cyMDYtd2ViXFxcXHNyY1xcXFxwbHVnaW5zXFxcXGNoZWNrVXBkYXRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxpZGVhc3BhY2VcXFxcaHRrZy0yMDZcXFxcdjJcXFxcaXJkcy1odGtnMjA2LXdlYlxcXFxzcmNcXFxccGx1Z2luc1xcXFxjaGVja1VwZGF0ZVxcXFxjb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2lkZWFzcGFjZS9odGtnLTIwNi92Mi9pcmRzLWh0a2cyMDYtd2ViL3NyYy9wbHVnaW5zL2NoZWNrVXBkYXRlL2NvbmZpZy50c1wiO2V4cG9ydCBjbGFzcyBDaGVja1VwZGF0ZUNvbmZpZyB7XHJcbiAgLyoqIFx1NkNFOFx1NTE2NVx1NTIzMFx1NTE2OFx1NUM0MFx1NTNEOFx1OTFDRlx1NEUyRFx1NzY4NFx1NzI0OFx1NjcyQ1x1NTNGN1x1NUI1N1x1NkJCNVx1NTQwRFx1NzlGMCAqL1xyXG4gIHN0YXRpYyBOQU1FOiBzdHJpbmcgPSAnV0VJX0FQUF9WRVJTSU9OJ1xyXG4gIC8qKiBcdTc1MjhcdTRFOEVcdThCQjBcdTVGNTVcdTcyNDhcdTY3MkNcdTRGRTFcdTYwNkZcdTc2ODQganNvbiBcdTY1ODdcdTRFRjZcdTU0MEQgKi9cclxuICBzdGF0aWMgVkVSU0lPTl9GSUxFX05BTUU6IHN0cmluZyA9ICd1cGRhdGUuanNvbidcclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXGlkZWFzcGFjZVxcXFxodGtnLTIwNlxcXFx2MlxcXFxpcmRzLWh0a2cyMDYtd2ViXFxcXHNyY1xcXFxwbHVnaW5zXFxcXGFkZENoYXJzZXRUb0Nzc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcaWRlYXNwYWNlXFxcXGh0a2ctMjA2XFxcXHYyXFxcXGlyZHMtaHRrZzIwNi13ZWJcXFxcc3JjXFxcXHBsdWdpbnNcXFxcYWRkQ2hhcnNldFRvQ3NzXFxcXGluZGV4LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9pZGVhc3BhY2UvaHRrZy0yMDYvdjIvaXJkcy1odGtnMjA2LXdlYi9zcmMvcGx1Z2lucy9hZGRDaGFyc2V0VG9Dc3MvaW5kZXgudHNcIjtpbXBvcnQgdHlwZSB7IFBsdWdpbiB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgY2hhbGsgZnJvbSAnY2hhbGsnO1xyXG5cclxuY29uc3QgQ1NTX0NIQVJTRVRfREVDTEFSQVRJT04gPSBgQGNoYXJzZXQgXCJVVEYtOFwiO1xcbmA7XHJcblxyXG5leHBvcnQgZW51bSBBZGRDaGFyc2V0VG9Dc3NQbHVnaW5FeHQge1xyXG4gIGNzcyA9ICcuY3NzJyxcclxuICBsZXNzID0gJy5sZXNzJyxcclxufVxyXG5cclxuLyoqXHJcbiAqIEFkZENoYXJzZXRUb0Nzc1BsdWdpblBhcmFtc1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEFkZENoYXJzZXRUb0Nzc1BsdWdpblBhcmFtcyB7XHJcbiAgLyoqIFx1NjgzOVx1NjM2RVx1NjI2OVx1NUM1NVx1NTQwRFx1N0I1Qlx1OTAwOVx1NEY3Rlx1NzUyOFx1NkI2NCBgcGx1Z2luYCBcdTc2ODRcdTY1ODdcdTRFRjYgKi9cclxuICBleHQ6IEFycmF5PEFkZENoYXJzZXRUb0Nzc1BsdWdpbkV4dD4gPSBbQWRkQ2hhcnNldFRvQ3NzUGx1Z2luRXh0LmNzc107XHJcbiAgLyoqXHJcbiAgICogXHU4MUVBXHU1QjlBXHU0RTQ5XHU2NTg3XHU0RUY2XHU3QjVCXHU5MDA5XHU5MDNCXHU4RjkxLCBcdTRGMThcdTUxNDhcdTdFQTdcdTlBRDhcdTRFOEUgYGV4dGBcclxuICAgKiBAcGFyYW0gaWRcclxuICAgKiBAZGVzY3JpcHRpb24gXHU3NkVFXHU1MjREXHU1M0VBXHU5MDAyXHU3NTI4XHU0RThFIGFudC1kZXNpZ24tdnVlIFx1NzZGOFx1NTE3M1x1NzY4NCBjc3MgXHU2NTg3XHU0RUY2XHJcbiAgICovXHJcbiAgY3VzdG9tRmlsdGVyPzogKGlkOiBzdHJpbmcpID0+IGJvb2xlYW4gPSAoaWQ6IHN0cmluZykgPT4ge1xyXG4gICAgaWYgKFtBZGRDaGFyc2V0VG9Dc3NQbHVnaW5FeHQuY3NzLCBBZGRDaGFyc2V0VG9Dc3NQbHVnaW5FeHQubGVzc10uc29tZShleHQgPT4gaWQuZW5kc1dpdGgoZXh0KSkpIHJldHVybiBpZC5pbmNsdWRlcygnYW50ZC52YXJpYWJsZS5taW4uY3NzJykgfHwgaWQuaW5jbHVkZXMoJ2FudC1kZXNpZ24tdnVlJyk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogZnJvbVxyXG4gICAqIEBwYXJhbSBwYXJhbXNcclxuICAgKi9cclxuICBzdGF0aWMgZnJvbShwYXJhbXM6IFBhcnRpYWw8QWRkQ2hhcnNldFRvQ3NzUGx1Z2luUGFyYW1zPikge1xyXG4gICAgY29uc3QgX3BhcmFtcyA9IG5ldyBBZGRDaGFyc2V0VG9Dc3NQbHVnaW5QYXJhbXMoKTtcclxuICAgIE9iamVjdC5hc3NpZ24oX3BhcmFtcywgcGFyYW1zKTtcclxuICAgIHJldHVybiBfcGFyYW1zO1xyXG4gIH1cclxufVxyXG5cclxuY29uc3QgbmFtZSA9ICdhZGQtY2hhcnNldC10by1jc3MnO1xyXG5cclxubGV0IGNvbW1hbmQgPSAnJztcclxuXHJcbi8qKlxyXG4gKiBcdTU3MjhcdTYyNDBcdTY3MDlcdTc2ODQgY3NzIFx1NjU4N1x1NEVGNlx1OTg3Nlx1OTBFOFx1NTg5RVx1NTJBMCBjaGFyc2V0IHV0Zi04XHJcbiAqIEBwYXJhbSBvcHRpb25zXHJcbiAqIEBkZXNjcmlwdGlvbiBmaXhlZFxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGFkZENoYXJzZXRUb0Nzc1BsdWdpbjogKG9wdGlvbnM/OiBQYXJ0aWFsPEFkZENoYXJzZXRUb0Nzc1BsdWdpblBhcmFtcz4pID0+IFBsdWdpbiA9IChvcHRpb25zPzogUGFydGlhbDxBZGRDaGFyc2V0VG9Dc3NQbHVnaW5QYXJhbXM+KSA9PiB7XHJcbiAgY29uc3QgX29wdGlvbnMgPSBBZGRDaGFyc2V0VG9Dc3NQbHVnaW5QYXJhbXMuZnJvbShvcHRpb25zIHx8IHt9KTtcclxuICByZXR1cm4ge1xyXG4gICAgbmFtZSxcclxuICAgIGNvbmZpZyhjb25maWcsIGVudikge1xyXG4gICAgICBjb21tYW5kID0gZW52LmNvbW1hbmQ7XHJcbiAgICB9LFxyXG4gICAgdHJhbnNmb3JtKGNvZGU6IHN0cmluZywgaWQ6IHN0cmluZykge1xyXG4gICAgICBpZiAoY29tbWFuZCAhPT0gJ2J1aWxkJykgcmV0dXJuIG51bGw7IC8vIFx1NTNFQVx1NTcyOCBidWlsZCBcdTY1RjZcdTVFOTRcdTc1MjhcclxuICAgICAgbGV0IGlzQXBwbHkgPSBmYWxzZTtcclxuICAgICAgaWYgKF9vcHRpb25zLmN1c3RvbUZpbHRlcikgaXNBcHBseSA9IF9vcHRpb25zLmN1c3RvbUZpbHRlcihpZCk7XHJcbiAgICAgIGVsc2UgaWYgKF9vcHRpb25zLmV4dC5sZW5ndGgpIGlzQXBwbHkgPSBfb3B0aW9ucy5leHQuZXZlcnkoZXh0ID0+IGlkLmVuZHNXaXRoKGV4dCkpO1xyXG5cclxuICAgICAgaWYgKGlzQXBwbHkpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5jeWFuKGBbJHtuYW1lfV1gKSwgaWQpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBjb2RlOiBDU1NfQ0hBUlNFVF9ERUNMQVJBVElPTiArIGNvZGUsXHJcbiAgICAgICAgICBtYXA6IG51bGwsXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH0sXHJcbiAgfTtcclxufTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF1VCxTQUFTLGVBQWU7QUFDL1UsT0FBTyxhQUFhO0FBQ3BCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUVoQixTQUFTLDRCQUE0QjtBQUNyQyxPQUFPLG1CQUFtQjtBQUMxQixPQUFPLFlBQVk7QUFDbkIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUyxhQUFhLGtCQUFrQjs7O0FDVG1WLFNBQVMsaUJBQWlCO0FBQ3JaLE9BQU8sVUFBVTs7O0FDRGpCO0FBQUEsRUFDRSxNQUFRO0FBQUEsRUFDUixNQUFRO0FBQUEsRUFDUixTQUFXO0FBQUEsRUFDWCxTQUFXO0FBQUEsRUFDWCxTQUFXO0FBQUEsSUFDVCxLQUFPO0FBQUEsSUFDUCxPQUFTO0FBQUEsSUFDVCxhQUFhO0FBQUEsSUFDYixjQUFjO0FBQUEsSUFDZCxhQUFhO0FBQUEsSUFDYixlQUFlO0FBQUEsSUFDZixjQUFjO0FBQUEsSUFDZCxnQkFBZ0I7QUFBQSxJQUNoQixlQUFlO0FBQUEsSUFDZixTQUFXO0FBQUEsSUFDWCxRQUFVO0FBQUEsSUFDVixNQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsSUFDZixZQUFZO0FBQUEsSUFDWixjQUFjO0FBQUEsSUFDZCwyQkFBMkI7QUFBQSxJQUMzQixvQkFBb0I7QUFBQSxJQUNwQixTQUFXO0FBQUEsSUFDWCxpQkFBaUI7QUFBQSxJQUNqQixpQkFBaUI7QUFBQSxJQUNqQixZQUFZO0FBQUEsSUFDWixjQUFjO0FBQUEsSUFDZCxnQkFBZ0I7QUFB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T0FBTyxJQUFJLFFBQVEsTUFBZ0IsTUFBL0MsbUJBQWtELFNBQVE7QUFBQSxVQUM3RixDQUFDO0FBQUEsUUFDSDtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFNBQVM7QUFBQSxRQUNQLFFBQVE7QUFBQSxRQUNSLElBQUk7QUFBQSxRQUNKLGNBQWM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBS2QsU0FBUyxDQUFBQSxVQUFRQSxNQUFLLFFBQVEsV0FBVyxFQUFFO0FBQUEsUUFDM0MsV0FBVyxDQUFDLE9BQU8sWUFBWTtBQUU3QixnQkFBTSxHQUFHLFlBQVksQ0FBQyxVQUFVLFFBQVE7QUF6SWxEO0FBMElZLHFCQUFTLFFBQVEsWUFBWSxNQUFJLFNBQUksSUFBSSxJQUFJLE9BQU8sSUFBSSxRQUFRLE1BQWdCLE1BQS9DLG1CQUFrRCxTQUFRO0FBQUEsVUFDN0YsQ0FBQztBQUFBLFFBQ0g7QUFBQSxNQUNGO0FBQUEsTUFDQSxZQUFZO0FBQUEsUUFDVixRQUFRO0FBQUEsUUFDUixJQUFJO0FBQUEsUUFDSixjQUFjO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BTWhCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUVBLFNBQVM7QUFBQTtBQUFBLElBRVAsTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsSUFBSTtBQUFBLFFBQ0osY0FBYztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFLZCxTQUFTLENBQUFBLFVBQVFBLE1BQUssUUFBUSxVQUFVLEVBQUU7QUFBQSxNQUM1QztBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSCxxQkFBcUI7QUFBQSxNQUNuQixNQUFNO0FBQUEsUUFDSixtQkFBbUI7QUFBQSxNQUNyQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUE7QUFBQSxRQUVOLGFBQWEsSUFBSTtBQUNmLGNBQUksR0FBRyxTQUFTLFFBQVEsa0NBQVcsc0JBQXNCLENBQUM7QUFBRyxtQkFBTztBQUFBLFFBQ3RFO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLFFBQVE7QUFBQSxFQUNWO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsibmFtZSIsICJjb25maWciLCAicGF0aCJdCn0K
