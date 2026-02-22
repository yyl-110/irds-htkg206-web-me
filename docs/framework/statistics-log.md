# 日志埋点

## 需求

- 在页面跳转后请求接口传入当前页面路由信息(`/system-service/system/statistics-log/add`), 请求参数示例: `{ "moduleName": "系统管理-角色管理", "logType": "访问页面" }`
- 为所有接口增加请求头 `Module-Name`, 例如 `Module-Name: %E7%B3%BB%E7%BB%9F%E7%AE%A1%E7%90%86-%E8%A7%92%E8%89%B2%E7%AE%A1%E7%90%86`
