```
  message.primary('primary...');

  message.info('加载中...');

  message.success('操作成功');

  message.warning('警告');

  message.error('错误');

  // 删除确认示例
  Modal.confirm({
    title: `确定要执行该操作吗？`,
    okText: WeiI18n.t('确定').value,
    cancelText: WeiI18n.t('取消').value,
    onOk() {

    },
  });

  notification.open({
    message: 'Notification Title',
    description:'',
    duration: 0,
  });

```

## 1. 代码风格规范

### 1.1 JavaScript/TypeScript

- **优先使用vue3+ts 语法**

* **缩进**：2个空格（禁用Tab）
* **引号**：单引号（'）优先，JSX属性使用双引号（"）
* **分号**：禁止行尾分号（除非必要）
* **最大行宽**：120字符
* **命名规范**：如下

#### 命名规范

| 类型                       | 规则                                                         | 示例                                 |
| -------------------------- | ------------------------------------------------------------ | ------------------------------------ |
| **变量 & 函数**            | 小驼峰（camelCase）                                          | `userName`, `fetchUserData`          |
| **常量（全局/模块级）**    | 全大写 + 下划线（SCREAMING_SNAKE_CASE）                      | `MAX_RETRY_COUNT`, `API_BASE_URL`    |
| **组件名（Vue / React）**  | 大驼峰（PascalCase）                                         | `UserCard`, `DataTable`              |
| **Props / 参数**           | 小驼峰（camelCase）                                          | `isLoading`, `onSubmit`              |
| **枚举（enum）**           | PascalCase 命名，成员使用 SCREAMING_SNAKE_CASE 或 PascalCase | `UserRole.ADMIN`, `HttpMethod.GET`   |
| **接口（interface）**      | 以 `I` 开头（可选）或直接 PascalCase（推荐后者）             | `User`, `ApiResponse`                |
| **类型别名（type）**       | PascalCase                                                   | `UserId`, `StatusType`               |
| **布尔值变量/属性**        | 以 `is` / `has` / `should` / `can` 等助动词开头              | `isVisible`, `hasError`, `canEdit`   |
| **事件处理函数**           | 以 `handle` 开头 + 事件名                                    | `handleSubmit`, `handleClickOutside` |
| **回调函数参数**           | 使用 `onXxx` 命名                                            | `onChange`, `onClose`                |
| **私有成员（类内）**       | 以下划线 `_` 开头（仅限必要场景）                            | `_internalCache`                     |
| **弹窗显示和隐藏（类内）** | 以 `Visible`结尾                                             | `manualVisible`                      |

### 1.2 页面方法名称

**方法名称使用小驼峰命名**

- **数据获取方法** fetchData
- **数据列表获取方法** getListData
- **点击搜索方法名：** handleSearch
- **点击重置方法名：** handleReset
- **跳转详情方法名：** handleDetail
- **点击删除方法名：** handleDelete
- \*\*跳转创建、编辑方法名：handleAddOrUpdate （创建编辑公用一个页面时使用）&#x20;
- \*\*页面分开方法名：handleAdd、handleEdit
- **打开对应弹窗方法名：**handle对应英文名Modal

### 1.3 Vue 页面组件规范

#### vu页面结构

```javascript

📂 views
├── 📂 system                    -------- 系统配置
│  ├── 📂 menu                   -------- 菜单管理
│  │  │  ├── 📂 components       -------- 当前页面下引用的组件
│  │  │  │  └──  📂 form         -------- 提交表单，例如创建修改
│  │  │  │  └──  📂 detail       -------- 详情表单，例如查看详情
│  │  │  │  └──  📂 modal        -------- 详情表单、或其他操作弹窗
│  │  │  │  └──  📂 config       -------- 配置信息常量等
│  │  │  ├── 📃 index.vue        -------- 主页面
│  │  │  └── 📃 menu.scss        -------- 主页面css文件

```

#### 文件结构

```javascript
// 组件选项顺序
export default {
  name: 'ComponentName',
  components: {},
  mixins: [],
  props: {},
  emits: [],
  setup() {}, // Composition API
  data() {},
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
}
```

#### 模板规范

```html
<!-- html 结构 -->
<template>
  <div data-component="user-card">
    <!-- v-for 必须带 key -->
    <li v-for="item in list" :key="item.id">{{ item.name }}</li>

    <!-- 多属性换行对齐,使用代码配置的格式化 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="60%" @close="handleClose" />
  </div>
</template>
<!-- JS结构 -->
<script lang="ts" setup></script>
<!-- css结构 -->
<style lang="scss" scoped></style>
```

### 1.4 CSS/SCSS

```css

// BEM 命名规范（示例）
.user-card {
  &__header { ... }
  &--disabled {
    .user-card__button { ... }
  }
}

// 媒体查询顺序：Mobile First
.container {
  width: 100%;
  @media (min-width: 768px) { width: 750px; }
}

```

---

## 2. 注释规范

### 2.1 组件定义注释（推荐）

在 `<script setup>` 或 `defineComponent` 上方添加组件用途说明。

```
/**
 * 用户信息卡片组件
 * - 支持编辑/只读模式切换
 * - 自动加载用户头像并处理加载失败
 */
```

---

### 2.2 Props 注释（必选）

使用 JSDoc 格式为 `defineProps` 中的每个 prop 添加说明，尤其是类型、是否必填、默认值和用途。

```
interface Props {
  /**
   * 用户 ID，用于请求用户详情
   * @required
   */
  userId: string

  /**
   * 是否启用编辑模式
   * @default false
   */
  editable?: boolean

  /**
   * 自定义保存回调函数
   * @param data 更新后的用户数据
   */
  onSave?: (data: User) => void
}

const props = defineProps<Props>()
```

💡 提示：若使用运行时声明，也需注释：

```
const props = defineProps({
  /** 用户唯一标识 */
  userId: { type: String, required: true },
  /** 是否可编辑 */
  editable: { type: Boolean, default: false }
})
```

---

### 2.3 响应式变量 & 计算属性注释（按需）

对非自解释的响应式数据或复杂计算逻辑添加注释。

```
// 当前用户是否为管理员（用于控制按钮显隐）
const isAdmin = computed(() => currentUser.value?.role === 'admin')

// 表单校验状态（true 表示所有字段有效）
const isFormValid = ref(false)
```

✅ 简单变量（如 `loading`, `list`）可不注释；复杂逻辑必须注释。

---

### 2.4 函数注释（重要函数必注）

对 `methods`、`setup` 中的函数，尤其是公共或复杂逻辑，使用 JSDoc。

```
/**
 * 提交用户信息更新
 * - 触发表单校验
 * - 调用 API 并处理成功/失败反馈
 * @returns Promise<void>
 */
async function handleSubmit() {
  if (!isFormValid.value) return
  try {
    await updateUser(props.userId, formData.value)
    message.success('保存成功')
    emit('saved')
  } catch (error) {
    message.error('保存失败，请重试')
  }
}
```

---

### 2.5 模板（Template）内注释（谨慎使用）

仅在逻辑复杂或需要特别说明时使用 HTML 注释，避免过度注释。

```
<template>
  <!-- 编辑模式下显示保存按钮，否则显示只读提示 -->
  <div v-if="props.editable">
    <a-button type="primary" @click="handleSubmit">保存</a-button>
  </div>
  <div v-else class="read-only-tip">
    当前为只读模式
  </div>

  <!-- 特殊处理：当用户无头像时显示默认图标 -->
  <img
    v-if="user.avatar"
    :src="user.avatar"
    alt="用户头像"
    class="avatar"
  />
  <DefaultAvatar v-else />
</template>
```

⚠️ 注意：避免在模板中写冗余注释，如 `<div> <!-- 用户信息 -->`。

---

### 2.6 样式（Style）注释（按需）

对特殊样式、hack 写法或业务强相关的 CSS 添加注释。

```
.user-card {
  /* 使用 aspect-ratio 保证头像比例，兼容 Safari 15+ */
  .avatar {
    aspect-ratio: 1 / 1;
    object-fit: cover;
  }

  /* 临时方案：覆盖第三方组件 z-index，待组件库升级后移除 */
  ::v-deep(.and-dialog) {
    z-index: 3000 !important;
  }
}
```

---

## 3. 目录结构规范

### 3.1 标准Vue项目结构

```shell
src/
├─ assets/           # 静态资源（需压缩）
│  ├─ images/        # 图片按模块分类
│  └─ styles/        # 全局样式
├─ components/       # 公共组件
│  └─ BaseButton.vue # 基础组件加 Base 前缀
├─ views/            # 路由页面组件
├─ router/           # 路由配置（按模块拆分）
├─ store/            # Vuex/Pinia（modules模式）
├─ utils/            # 工具函数（分类存放）
├─ api/              # 接口管理（按模块划分）
└─ directives/       # 自定义指令

```

---

## 4. Git协作规范

### 4.1 分支管理（Git Flow变体）

- pro：生产环境代码（保护分支）
- uat：测试分支
- `dev`：开发分支
- `feature/xxx`：功能开发分支
- `hotfix/xxx`：紧急修复分支

### 4.2 **类型前缀**

- `feat`: 新功能
- `fix`: Bug修复
- `docs`: 文档变更
- `style`: 代码样式调整
- `refactor`: 重构（非功能修改）
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具变更

**示例**：

```
feat: 新增手机号登录功能
fix: 修复价格计算精度问题 #JIRA-123

```

---
