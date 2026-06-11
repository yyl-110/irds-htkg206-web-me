# 自定义页 componentId 清单

流程工作台保存参数时，表格数据通过 `tables` 字段提交，每条记录需包含唯一的 `componentId`。  
本清单汇总 `custompage` 目录下各页面已分配的 `componentId`，**同一流程内不可复用**。

> 维护约定：新增页面或表格时，在本文件登记后再改代码；常量定义见各页 `parameterDefaults.ts` / `calculations.ts`。

---

## 编号总表（按 componentId 排序）

| componentId | 页面（Vue） | Registry Key | 表格名称 | tableNum | 说明 |
|-------------|-------------|--------------|----------|----------|------|
| 1 | `customizedProcess-page1-1.vue` | `customized-process-page1-1` | 零位（初始位置） | `DJ1-1_T_ZEROINITPOSITION` | page0-5 逻辑 |
| 2 | `customizedProcess-page1-1.vue` | `customized-process-page1-1` | 行程计算表 | `DJ1-1_T_RESULTDATA` | page0-5 逻辑 |
| 3 | `customizedProcess-page1.vue` | `customized-process-page1` | 零位（初始位置） | `DJ1_T_ZEROINITPOSITION` | |
| 4 | `customizedProcess-page1.vue` | `customized-process-page1` | 结果数据 | `DJ1_T_RESULTDATA` | |
| 5 | `customizedProcess-page0-1.vue` | `customized-process-page0-1` | 基本参数 | `DJ0_1_BASEPARAMS` | |
| 6 | `customizedProcess-page0-1.vue` | `customized-process-page0-1` | 工作参数 | `DJ0_1_WORKPARAMS` | |
| 7 | `customizedProcess-page0-1.vue` | `customized-process-page0-1` | 通讯形式 | `DJ0_1_COMMSTYLE` | |
| 8 | `customizedProcess-page0-1.vue` | `customized-process-page0-1` | 幅相参数 | `DJ0_1_XIANGPINPARAM` | |
| 9 | `customizedProcess-page0-4.vue` | `customized-process-page0-4` | 零位（初始位置） | `DJ1-1_T_ZEROINITPOSITION` | 复用 page0-5 结构 |
| 10 | `customizedProcess-page0-4.vue` | `customized-process-page0-4` | 行程计算表 | `DJ1-1_T_RESULTDATA` | 复用 page0-5 结构 |
| 11 | `customizedProcess-page0.vue` | `customized-process-page0` | 基本参数 | `DJ0_BASEPARAMS` | |
| 12 | `customizedProcess-page0.vue` | `customized-process-page0` | 工作参数 | `DJ0_WORKPARAMS` | |
| 13 | `customizedProcess-page0.vue` | `customized-process-page0` | 通讯形式 | `DJ0_COMMSTYLE` | |
| 14 | `customizedProcess-page0.vue` | `customized-process-page0` | 幅相参数 | `DJ0_XIANGPINPARAM` | |
| 15 | `customizedProcess-page2.vue` | `customized-process-page2` | 电机选型 | `DJ2_T_MOTORSELECT` | |
| 16 | `customizedProcess-page2-1.vue` | `customized-process-page2-1` | 减速器选型 | `DJ2-1_T_JSQSELECT` | |
| 17 | `customizedProcess-page3.vue` | `customized-process-page3` | 初始总减速比计算 | `DJ3_T_INITTOTALJSB` | |
| 18 | `customizedProcess-page3-1.vue` | `customized-process-page3-1` | 初始总减速比计算 | `DJ3_T_INITTOTALJSB` | 与 page3 同表号，不同页 |
| 19 | `customizedProcess-page4.vue` | `customized-process-page4` | 组合方案确定 | `DJ4_T_COMBINSCHEME` | |
| 20 | `customizedProcess-page5.vue` | `customized-process-page5` | 齿轮减速比分配 | `DJ5_T_GEARJSBDISPATCH` | |
| 21 | `customizedProcess-page6.vue` | `customized-process-page6` | 确定齿数和最终实际总减速比 | `DJ6_T_FINALTOTALJSB` | |
| 22 | `customizedProcess-page7.vue` | `customized-process-page7` | 性能校核计算 | `DJ7_T_XNCHECK` | |
| 23 | `customizedProcess-page8.vue` | `customized-process-page8` | 初步筛选若干组合方案 | `DJ8_T_INITCOMBINSCHEME` | |
| 24 | `customizedProcess-page9.vue` | `customized-process-page9` | 计算输入参数 | `DJ9_T_INPUTPARAMS` | |
| 25 | `customizedProcess-page9.vue` | `customized-process-page9` | 齿轮应力计算（展示） | `DJ9_T_GEARINTERFORCECAL` | 当前方案展示表 |
| 26 + n | `customizedProcess-page9.vue` | `customized-process-page9` | 齿轮应力计算（按方案） | `DJ9_T_GEARINTERFORCECAL{n}` | n = 方案索引，如 `…CAL0` → 26 |
| 30 | `customizedProcess-page10.vue` | `customized-process-page10` | 计算输入参数 | `DJ10_T_INPUTPARAMS` | |
| 31 | `customizedProcess-page10.vue` | `customized-process-page10` | 角度修正（展示） | `DJ10_T_DEGREERESET` | |
| 32 + n | `customizedProcess-page10.vue` | `customized-process-page10` | 全角度性能校核计算（按方案） | `DJ10_T_ALLDEGREEXNCHECKCAL{n}` | n = 方案索引，如 `…CAL0` → 32 |
| 33 | `customizedProcess-page11.vue` | `customized-process-page11` | 计算输入参数 | `DJ11_T_INPUTPARAMS` | |

**预留 / 未使用编号：** `27`、`28`、`29`（page9 动态表与 page10 之间留空）。

---

## 按页面明细

### page0-5 / page1-1（行程计算）

| componentId | 表格 | tableNum | 代码位置 |
|-------------|------|----------|----------|
| 1 | 零位（初始位置） | `DJ1-1_T_ZEROINITPOSITION` | `page0-5/parameterDefaults.ts` |
| 2 | 行程计算表 | `DJ1-1_T_RESULTDATA` | `page0-5/parameterDefaults.ts` |

- 顶部输入参数表 `DJ1-1_T_INPUTPARAMS` **无 componentId**，可编辑列走 `values`。
- `customizedProcess-page1-1.vue` → `page0-5/calculations.ts`（`extractPage0_5TableSavePayload`）

### page1（机构行程）

| componentId | 表格 | tableNum | 代码位置 |
|-------------|------|----------|----------|
| 3 | 零位（初始位置） | `DJ1_T_ZEROINITPOSITION` | `page1/parameterDefaults.ts` |
| 4 | 结果数据 | `DJ1_T_RESULTDATA` | `page1/parameterDefaults.ts` |

- 计算输入参数 `DJ1_T_INPUTPARAMS` 走 `values`，见 `page1/calculations.ts`。

### page0-1

| componentId | 表格 | tableNum | 常量 |
|-------------|------|----------|------|
| 5 | 基本参数 | `DJ0_1_BASEPARAMS` | `PAGE0_1_BASE_TABLE_COMPONENT_ID` |
| 6 | 工作参数 | `DJ0_1_WORKPARAMS` | `PAGE0_1_WORK_TABLE_COMPONENT_ID` |
| 7 | 通讯形式 | `DJ0_1_COMMSTYLE` | `PAGE0_1_COMM_TABLE_COMPONENT_ID` |
| 8 | 幅相参数 | `DJ0_1_XIANGPINPARAM` | `PAGE0_1_FUXIANG_TABLE_COMPONENT_ID` |

### page0-4

| componentId | 表格 | tableNum | 常量 |
|-------------|------|----------|------|
| 9 | 零位（初始位置） | `DJ1-1_T_ZEROINITPOSITION` | `PAGE0_4_ZERO_TABLE_COMPONENT_ID` |
| 10 | 行程计算表 | `DJ1-1_T_RESULTDATA` | `PAGE0_4_RESULT_TABLE_COMPONENT_ID` |

### page0

| componentId | 表格 | tableNum | 常量 |
|-------------|------|----------|------|
| 11 | 基本参数 | `DJ0_BASEPARAMS` | `PAGE0_BASE_TABLE_COMPONENT_ID` |
| 12 | 工作参数 | `DJ0_WORKPARAMS` | `PAGE0_WORK_TABLE_COMPONENT_ID` |
| 13 | 通讯形式 | `DJ0_COMMSTYLE` | `PAGE0_COMM_TABLE_COMPONENT_ID` |
| 14 | 幅相参数 | `DJ0_XIANGPINPARAM` | `PAGE0_FUXIANG_TABLE_COMPONENT_ID` |

### page2

| componentId | 表格 | tableNum | 常量 |
|-------------|------|----------|------|
| 15 | 电机选型 | `DJ2_T_MOTORSELECT` | `PAGE2_MOTOR_TABLE_COMPONENT_ID` |

### page2-1

| componentId | 表格 | tableNum | 常量 |
|-------------|------|----------|------|
| 16 | 减速器选型 | `DJ2-1_T_JSQSELECT` | `PAGE2_1_REDUCER_TABLE_COMPONENT_ID` |

### page3 / page3-1

| 页面 | componentId | 表格 | tableNum | 常量 |
|------|-------------|------|----------|------|
| page3 | 17 | 初始总减速比计算 | `DJ3_T_INITTOTALJSB` | `PAGE3_TABLE_COMPONENT_ID` |
| page3-1 | 18 | 初始总减速比计算 | `DJ3_T_INITTOTALJSB` | `PAGE3_1_TABLE_COMPONENT_ID` |

### page4 ~ page8（单表页）

| 页面 | componentId | 表格 | tableNum | 常量 |
|------|-------------|------|----------|------|
| page4 | 19 | 组合方案确定 | `DJ4_T_COMBINSCHEME` | `PAGE4_TABLE_COMPONENT_ID` |
| page5 | 20 | 齿轮减速比分配 | `DJ5_T_GEARJSBDISPATCH` | `PAGE5_TABLE_COMPONENT_ID` |
| page6 | 21 | 确定齿数和最终实际总减速比 | `DJ6_T_FINALTOTALJSB` | `PAGE6_TABLE_COMPONENT_ID` |
| page7 | 22 | 性能校核计算 | `DJ7_T_XNCHECK` | `PAGE7_TABLE_COMPONENT_ID` |
| page8 | 23 | 初步筛选若干组合方案 | `DJ8_T_INITCOMBINSCHEME` | `PAGE8_TABLE_COMPONENT_ID` |

### page9（多表 + 按方案动态表）

| componentId | 表格 | tableNum | 常量 / 规则 |
|-------------|------|----------|-------------|
| 24 | 计算输入参数 | `DJ9_T_INPUTPARAMS` | `PAGE9_INPUT_TABLE_COMPONENT_ID` |
| 25 | 齿轮应力计算（展示） | `DJ9_T_GEARINTERFORCECAL` | `PAGE9_GEAR_DISPLAY_TABLE_COMPONENT_ID` |
| 26 + n | 齿轮应力计算（按方案） | `DJ9_T_GEARINTERFORCECAL{n}` | `PAGE9_GEAR_SCHEME_TABLE_COMPONENT_ID_BASE + n` |

- 动态表在「更新数据」后按方案数追加，见 `page9/initData.ts`。
- 提取逻辑：`page9/calculations.ts` → `extractPage9TableSavePayload`

### page10（多表 + 按方案动态表）

| componentId | 表格 | tableNum | 常量 / 规则 |
|-------------|------|----------|-------------|
| 30 | 计算输入参数 | `DJ10_T_INPUTPARAMS` | `PAGE10_INPUT_TABLE_COMPONENT_ID` |
| 31 | 角度修正（展示） | `DJ10_T_DEGREERESET` | `PAGE10_DEGREE_DISPLAY_TABLE_COMPONENT_ID` |
| 32 + n | 全角度性能校核计算（按方案） | `DJ10_T_ALLDEGREEXNCHECKCAL{n}` | `PAGE10_ALL_DEGREE_TABLE_COMPONENT_ID_BASE + n` |

- 动态表规则见 `page10/parameterDefaults.ts`（`allDegreeTableNum`）、`page10/calculations.ts`。
- 提取逻辑：`page10/calculations.ts` → `extractPage10TableSavePayload`

### page11

| componentId | 表格 | tableNum | 常量 |
|-------------|------|----------|------|
| 33 | 计算输入参数 | `DJ11_T_INPUTPARAMS` | `PAGE11_INPUT_TABLE_COMPONENT_ID` |

---

## 尚未分配 componentId 的 custompage 页面

以下页面当前**未**在 `tables` 保存链路中使用 `componentId`（无 `getCurrentTableSavePayload` 或未迁移）：

| 页面目录 / Vue | 说明 |
|----------------|------|
| `page0-2`、`page0-3` | 无 componentId 常量 |
| `page1-2` | 仅 `values`，`extractPage1_2TableSavePayload` 固定返回 `[]` |
| `page1-3`、`page1-4` | 无 componentId 常量 |
| `Process7-*`、`FS*`、`ZT*`、`zq-*`、`zjzcjh*`、`zlkwjc*` | 系列定制页 |
| `ansys`、`jsinvoke`、`tbdemo*`、`programme` 等 | 通用/演示页 |

新增上述页面的表格保存时，请从 **34** 起续编（或先占用预留的 27–29），并更新本清单。

---

## 保存格式说明

- **`values`**：单行 / 标量参数（`paramKey`、`paramName`、`paramValue`）
- **`tables`**：`[{ componentId, tableName, values: [{ c1…cN }] }]`，单元格 `p0…p(N-1)` 对应 `c1…cN`

相关实现：

- 各页 `extract*TableSavePayload` / `ensure*TableComponentIds`
- 工作台：`process-flow-app-workspace.vue` → `getActivePreviewTableSavePayload`
- 自定义页预览：`process-flow-app-custom-node-preview.vue`

---

*最后更新：与 page0 ~ page11 定制流程页 componentId 分配保持一致。*
