# 权限
> 参考自 [权限控制](https://doc.iocoder.cn/vue3/route/#_4-%E6%9D%83%E9%99%90%E6%8E%A7%E5%88%B6)

## v-hasPermi 指令
`v-hasPermi` 指令, 基于权限字符, 进行权限的控制

```html
<!-- 单个 -->
<el-button v-hasPermi="['system:user:create']">存在权限字符串才能看到</el-button>

<!-- 多个，满足任一一个即可 -->
<el-button v-hasPermi="['system:user:create', 'system:user:update']">包含权限字符串才能看到</el-button>
```

## v-hasRole 指令
`v-hasRole` 指令, 基于角色标识, 机进行的控制

```html
<!-- 单个 -->
<el-button v-hasRole="['admin']">管理员才能看到</el-button>

<!-- 多个，满足任一一个即可 -->
<el-button v-hasRole="['role1', 'role2']">包含角色才能看到</el-button>
```

## 结合 v-if 指令
在某些情况下, 它是不适合使用 `v-hasPermi` 或 `v-hasRole` 指令, 如元素标签组件, 此时, 只能通过手动设置 `v-if` 通过使用全局权限判断函数, 用法是基本一致的

```vue
<script setup lang="ts">
import { checkPermi, checkRole } from '@/utils/permission' // 权限判断函数
</script>

<template>
  <el-tabs>
    <el-tab-pane v-if="checkPermi(['system:user:create'])" label="用户管理" name="user">
      用户管理
    </el-tab-pane>
    <el-tab-pane v-if="checkPermi(['system:user:create', 'system:user:update'])" label="参数管理" name="menu">
      参数管理
    </el-tab-pane>
    <el-tab-pane v-if="checkRole(['admin'])" label="角色管理" name="role">
      角色管理
    </el-tab-pane>
    <el-tab-pane v-if="checkRole(['admin', 'common'])" label="定时任务" name="job">
      定时任务
    </el-tab-pane>
  </el-tabs>
</template>
```
