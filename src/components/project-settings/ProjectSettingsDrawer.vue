<script lang="ts" setup>
import { CheckOutlined, CloseOutlined, RedoOutlined, SaveOutlined } from '@ant-design/icons-vue'
import { Modal, message } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useProjectUiStore } from '@/store/modules/layout/projectUi'
import { WeiThemeKey } from '@/utils/WeiTheme'
import { AdminApiSystemUser } from '@/api/tags/管理后台用户'
import { useUserStore } from "@/store/modules/user";
import { toSnowflakeIdStr } from '@/utils/snowflakeId';
const userStore = useUserStore();

const projectUi = useProjectUiStore()
const {
  settingsDrawerOpen,
  systemThemeKey,
  headerBg,
  menuBg,
  menuCollapsePosition,
  showTabs,
  grayscale,
  colorWeak,
} = storeToRefs(projectUi)

const drawerVisible = computed({
  get: () => settingsDrawerOpen.value,
  set: (v: boolean) => {
    if (!v) projectUi.closeSettings()
  },
})

/** 系统主题色板顺序（不含藏青/黑色 gold） */
const THEME_KEY_ORDER: WeiThemeKey[] = [
  WeiThemeKey.deepBlue,
  WeiThemeKey.brand,
  WeiThemeKey.red,
  WeiThemeKey.orange,
  WeiThemeKey.lime,
  WeiThemeKey.cyan,
  WeiThemeKey.purple,
  WeiThemeKey.magenta,
  WeiThemeKey.gray,
]

/** 系统主题：不含藏青/黑色 gold */
const systemThemeKeys = computed(() => THEME_KEY_ORDER)

type HeaderMenuSwatch =
  | { kind: 'theme'; key: WeiThemeKey }
  | { kind: 'hex'; value: string; label: string }

/** 顶栏/菜单：末尾为 …深蓝 → 藏青 #232440(倒数第三) → 暗色(倒数第二) → 白 */
const headerMenuSwatchItems = computed<HeaderMenuSwatch[]>(() => {
  const themeKeys: WeiThemeKey[] = [
    WeiThemeKey.deepBlue,
    WeiThemeKey.brand,
    WeiThemeKey.red,
    WeiThemeKey.orange,
    WeiThemeKey.lime,
    WeiThemeKey.cyan,
    WeiThemeKey.purple,
    WeiThemeKey.magenta,
    WeiThemeKey.gray,
  ]
  const items: HeaderMenuSwatch[] = themeKeys.map(key => ({ kind: 'theme', key }))
  items.push(
    { kind: 'hex', value: '#1a3677', label: '深蓝' },
    { kind: 'theme', key: WeiThemeKey.gold },
    { kind: 'hex', value: '#001529', label: '暗色' },
    { kind: 'hex', value: '#ffffff', label: '白' },
  )
  return items
})

const saving = ref(false)

function onClose() {
  projectUi.closeSettings()
}

function pickSystemTheme(k: WeiThemeKey) {
  projectUi.setSystemThemeKey(k)
}

function pickHeader(hex: string) {
  projectUi.setHeaderBg(hex)
}

function pickMenu(hex: string) {
  projectUi.setMenuBg(hex)
}

/** 浅/白色块：需在白底抽屉内描边，否则与背景融为一体 */
function isLightSurfaceHex(hex: string) {
  const n = hex.trim().replace(/^#/, '').toLowerCase()
  return n === 'ffffff' || n === 'fff'
}

function onReset() {
  Modal.confirm({
    title: '重置',
    content: '将界面配置恢复为默认，是否继续？',
    okText: '确定',
    cancelText: '取消',
    onOk: () => {
      projectUi.resetToDefaults()
      message.success('已恢复默认配置')
    },
  })
}

/** 与 pinia persist `project-ui-settings` 字段一致，便于服务端同步 */
function buildPageStylePayload() {
  return {
    systemThemeKey: projectUi.systemThemeKey,
    headerBg: projectUi.headerBg,
    menuBg: projectUi.menuBg,
    menuCollapsePosition: projectUi.menuCollapsePosition,
    showTabs: projectUi.showTabs,
    grayscale: projectUi.grayscale,
    colorWeak: projectUi.colorWeak,
  }
}

async function onSavePageStyle() {
  saving.value = true
  try {
    const payload = buildPageStylePayload()
    //JSON转string
    const res = await AdminApiSystemUser.savePageStyle({
      userId: toSnowflakeIdStr(userStore.getUser.id),
      styleJson: JSON.stringify(payload),
    })
    const code = res?.data?.code
    if (code === 0 || code === 200) {
      message.success(res?.data?.msg || '配置已保存')
    } else {
      message.error(res?.data?.msg || '保存失败')
    }
  } catch {
    message.error('保存失败')
  } finally {
    saving.value = false
  }
}

watch(
  () => [grayscale.value, colorWeak.value, headerBg.value, menuBg.value, systemThemeKey.value],
  () => projectUi.applyDomEffects(),
  { deep: true },
)
</script>

<template>
  <a-drawer
    v-model:visible="drawerVisible"
    placement="right"
    :width="360"
    :closable="false"
    :body-style="{ paddingTop: 8 }"
    class="project-settings-drawer"
    @close="onClose">
    <template #title>
      <div class="flex items-center justify-between gap-2">
        <span class="text-base font-medium">样式配置</span>
        <a-button type="text" size="small" @click="onClose">
          <CloseOutlined />
        </a-button>
      </div>
    </template>

    <div class="space-y-6">
      <section>
        <div class="mb-2 text-sm text-gray-600">系统主题</div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="k in systemThemeKeys"
            :key="k"
            type="button"
            class="color-dot"
            :class="{ ring: systemThemeKey === k }"
            :style="{ background: projectUi.themeSwatches[k] }"
            :title="k"
            @click="pickSystemTheme(k)">
            <CheckOutlined v-if="systemThemeKey === k" class="check-ico" />
          </button>
        </div>
      </section>

      <section>
        <div class="mb-2 text-sm text-gray-600">顶栏主题</div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="item in headerMenuSwatchItems"
            :key="item.kind === 'theme' ? `h-${item.key}` : `hex-h-${item.value}`"
            type="button"
            class="color-dot"
            :class="{
              ring: item.kind === 'theme'
                ? headerBg === projectUi.themeSwatches[item.key]
                : headerBg === item.value,
              'color-dot--light-surface': item.kind === 'hex' && isLightSurfaceHex(item.value),
            }"
            :style="{ background: item.kind === 'theme' ? projectUi.themeSwatches[item.key] : item.value }"
            :title="item.kind === 'theme' ? item.key : item.label"
            @click="pickHeader(item.kind === 'theme' ? projectUi.themeSwatches[item.key] : item.value)" />
        </div>
      </section>

      <section>
        <div class="mb-2 text-sm text-gray-600">菜单主题</div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="item in headerMenuSwatchItems"
            :key="item.kind === 'theme' ? `m-${item.key}` : `hex-m-${item.value}`"
            type="button"
            class="color-dot"
            :class="{
              ring: item.kind === 'theme'
                ? menuBg === projectUi.themeSwatches[item.key]
                : menuBg === item.value,
              'color-dot--light-surface': item.kind === 'hex' && isLightSurfaceHex(item.value),
            }"
            :style="{ background: item.kind === 'theme' ? projectUi.themeSwatches[item.key] : item.value }"
            :title="item.kind === 'theme' ? item.key : item.label"
            @click="pickMenu(item.kind === 'theme' ? projectUi.themeSwatches[item.key] : item.value)" />
        </div>
      </section>

      <section>
        <div class="mb-3 text-sm text-gray-600">界面设置</div>
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between gap-2">
            <span class="text-sm">菜单折叠按钮</span>
            <a-select v-model:value="menuCollapsePosition" size="small" class="!w-[120px]">
              <a-select-option value="header">顶部</a-select-option>
              <a-select-option value="bottom">底部</a-select-option>
            </a-select>
          </div>
          <div class="flex items-center justify-between gap-2">
            <span class="text-sm">标签页</span>
            <a-switch v-model:checked="showTabs" />
          </div>
          <div class="flex items-center justify-between gap-2">
            <span class="text-sm">灰色模式</span>
            <a-switch v-model:checked="grayscale" />
          </div>
          <div class="flex items-center justify-between gap-2">
            <span class="text-sm">色弱模式</span>
            <a-switch v-model:checked="colorWeak" />
          </div>
        </div>
      </section>

      <div class="flex flex-col gap-2 pt-2">
        <a-button type="primary" class="reset-btn" @click="onReset">
          <RedoOutlined />
          重置
        </a-button>
        <a-button type="primary" :loading="saving" @click="onSavePageStyle">
          <SaveOutlined />
          保存配置
        </a-button>
      </div>
    </div>
  </a-drawer>
</template>

<style scoped lang="less">
.color-dot {
  width: 26px;
  height: 26px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
}
.color-dot.color-dot--light-surface {
  border: 1px solid rgba(15, 23, 42, 0.14);
}
.color-dot.ring {
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--ant-primary-color);
}
.check-ico {
  color: #fff;
  font-size: 12px;
  filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.6));
}
.reset-btn {
  background: #232440 !important;
  border-color: #232440 !important;
  color: #ffffff !important;
}
.reset-btn:hover {
  filter: brightness(0.95);
}
</style>
