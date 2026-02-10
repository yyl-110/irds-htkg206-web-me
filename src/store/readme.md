## 打包
**Vuex的代码分割**:vuex会把3个store合并打包，当首页用到Vuex时，这个包会引入到首页一起打包，最后输出1个js chunk。这样的问题是，其实首页只需要其中1个store，但其他2个无关的store也被打包进来，造成资源浪费。

**Pinia的代码分割**:打包时，Pinia会检查引用依赖，当首页用到job store，打包只会把用到的store和页面合并输出1个js chunk，其他2个store不耦合在其中。Pinia能做到这点，是因为它的设计就是store分离的，解决了项目的耦合问题。

> 但是例如userStore被多个页面引用,会导致userStore被重复打包,所以产生了`./index.ts`文件里面的**全局注册**概念
> 为了让appStore实例与项目解耦，在构建时要把appStore抽取到公共chunk，在vite.config.ts进行了配置

- 使用composition api定义的store需要手动实现$reset方法,实现初始化store状态
- 查看`./modeules/userStore/userStore.ts`文件的数据持久化,以及加解密存储在浏览器

## pinia数据持久化
`pinia-plugin-persistedstate`插件

### 使用
1. 直接开启
  ```js
  export const useStore = defineStore('main', () => {

  }, {
    persit: true, // 开启持久化,所有数据都会被保存到localStorage
  })
  ```

2. 详细配置
  ```js
  export const useStore = defineStore('main', () => {

  }, {
    persist: {
      key: 'main', // 存储的对应键名
      // 修改为 sessionStorage，默认为 localStorage
      storage: window.sessionStorage,
      // 需要持久化状态的符号路径数组,[]表示没有状态被持久化,莫认为undefined,持久化整个状态
      paths: [],
    }
  })
  ```
 -  key 用于引用存储中存储的反序列化数据的密钥。
 -  storage 将数据持久保存到的存储类型。StorageLike类型
 -  paths 持久化属性数组。 [] 表示没有状态被持久化， undefined 或 null 表示整个状态被持久化。
 -  serializer 自定义序列化程序在持久化数据之前序列化数据，并在重新持续化化存储之前反序列化数据。必须同时有 serialize: (value: StateTree) => string 和 deserialize: (value: string) => StateTree 方法。
 -  beforeRestore 钩子函数在恢复持久状态之前运行。该钩子可以访问整个 PiniaPluginContext。这可用于在持续化之前强制执行特定操作。
 -  afterRestore 钩子函数在恢复持久状态后运行。该钩子可以访问整个 PiniaPluginContext。这可用于在持续化后强制执行特定操作。
 -  debug 设置为 true 时，在持久化/水合存储时可能发生的任何错误都将记录为 console.erro
