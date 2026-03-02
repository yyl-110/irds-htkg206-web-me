import { resolve } from 'node:path';
import process from 'node:process';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// import Components from 'unplugin-vue-components/vite' // antd 按需加载
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import legacy from '@vitejs/plugin-legacy';
import AutoImport from 'unplugin-auto-import/vite';
import { VxeResolver, lazyImport } from 'vite-plugin-lazy-import';
import { vitePluginVersionOutput } from './src/plugins/checkUpdate';
import { CheckUpdateConfig } from './src/plugins/checkUpdate/config';
import { addCharsetToCssPlugin } from './src/plugins/addCharsetToCss/index';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // Components({
    //   // dts: true, // enabled by default if `typescript` is installed
    //   // resolvers: [ AntDesignVueResolver() ],
    // }),
    AutoImport({
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/],
      eslintrc: {
        enabled: true,
      },
      imports: [
        'vue',
        'vue-router',
        // 'vitest',
        // '@vueuse/core',
        {
          '@/utils/WeiI18n': ['WeiI18n'],
          '@/httpRequest/typings.ts': ['HttpRequestResponse', 'isHttpRequestResponse', 'ResponseError'],
          '@/httpRequest/pending.ts': ['isPending'],
          '@/hooks/usePagination': ['usePagination'],
          '@/hooks/useModelData': ['useModelData', 'UseModelDataOptions', 'UseModelDataReturnData'],
          axios: ['AxiosResponse'],
        },
      ],
      dts: 'src/auto-imports.d.ts',
    }),
    lazyImport({
      resolvers: [VxeResolver({ libraryName: 'vxe-table' }), VxeResolver({ libraryName: 'vxe-pc-ui' })],
    }),
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), '.', 'src/assets/svgs')],
      symbolId: 'icon-[dir]-[name]',
      svgoOptions: true,
    }),
    addCharsetToCssPlugin({}),
    // 参考自 https://github.com/intlify/vue-i18n-next/issues/789#issuecomment-1356782726
    VueI18nPlugin({
      include: resolve(__dirname, 'src/locales/**'), // PUT YOUR OWN PATH TO LOCALES HERE
    }),
    vitePluginVersionOutput({
      json: {
        enable: true,
        fileName: CheckUpdateConfig.VERSION_FILE_NAME,
      },
      html: {
        enable: true,
        toMeta: true,
        toConsole: true,
        toGlobal: true,
      },
    }),
    legacy({
      targets: ['edge >= 16', 'chrome >= 61'],
      renderLegacyChunks: true,
      modernPolyfills: ['es.global-this'],
      polyfills: [
        'es.symbol',
        'es.array.filter',
        'es.promise',
        'es.promise.finally',
        'es/map',
        'es/set',
        'es.array.for-each',
        'es.object.define-properties',
        'es.object.define-property',
        'es.object.get-own-property-descriptor',
        'es.object.get-own-property-descriptors',
        'es.object.keys',
        'es.object.to-string',
        'es.global-this',
        'web.dom-collections.for-each',
        'esnext.global-this',
        'esnext.string.match-all',
      ],
    }),
  ],
  resolve: {
    // 添加别名
    alias: {
      '@': resolve(__dirname, 'src'),
      // 修复 bpmn-js-token-simulation 对 ids 的默认导入：ids 仅提供命名导出
      ids: resolve(__dirname, 'src/shims/ids.js'),
      // 'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
    },
  },
  server: {
    // 端口号
    port: 5173,
    // port: 80,
    host: '0.0.0.0',
    proxy: {
      '/Api': {
        // target: 'http://39.106.130.85:9328',
        // target: 'http://10.151.129.89:9328',
        target: 'http://127.0.0.1:9327',
        ws: false,
        changeOrigin: true,
        /**
         * rewrite path
         * @param path path
         */
        rewrite: path => path.replace(/^\/Api/, ''),
        configure: (proxy, options) => {
          // 配置此项可在响应头中看到请求的真实地址
          proxy.on('proxyRes', (proxyRes, req) => {
            proxyRes.headers['x-real-url'] = new URL(req.url || '', options.target as string)?.href || '';
          });
        },
      },
      '/Lang': {
        target: 'http://172.16.7.44',
        ws: false,
        changeOrigin: true,
        /**
         * rewrite path
         * @param path path
         */
        rewrite: path => path.replace(/^\/Lang/, ''),
        configure: (proxy, options) => {
          // 配置此项可在响应头中看到请求的真实地址
          proxy.on('proxyRes', (proxyRes, req) => {
            proxyRes.headers['x-real-url'] = new URL(req.url || '', options.target as string)?.href || '';
          });
        },
      },
      '/iconify': {
        target: '',
        ws: false,
        changeOrigin: true,
        /**
         * rewrite path
         * @param path path
         */
        // rewrite: path => path.replace(/^\/iconify/, ''),
      },
    },
  },

  preview: {
    // 端口号
    port: 58585,
    host: '0.0.0.0',
    proxy: {
      '/Api': {
        target: 'http://127.0.0.1:9327',
        ws: false,
        changeOrigin: true,
        /**
         * rewrite path
         * @param path path
         */
        rewrite: path => path.replace(/^\/Api/, ''),
      },
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        // 将pinia全局库实例打包到vendor
        manualChunks(id) {
          if (id.includes(resolve(__dirname, './src/store/index.ts'))) return 'vnedor';
        },
      },
    },
    outDir: './dist',
    assetsDir: 'assets',
    target: 'es2015',
  },
});
