<script lang="ts" setup>
import { CheckOutlined, CloseOutlined, RedoOutlined } from '@ant-design/icons-vue'
import { Modal, message } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectUiStore } from '@/store/modules/layout/projectUi'
import type { WeiThemeKey } from '@/utils/WeiTheme'
import { useUserStore } from '@/store/modules/user'
import { toLogin } from '@/httpRequest'
import { removeWatermark } from '@/utils/watermark'

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

const router = useRouter()
const userStore = useUserStore()

const themeKeys = computed(() => Object.keys(projectUi.themeSwatches) as WeiThemeKey[])

const MENU_SWATCH_EXTRA = [
  { label: '白', value: '#ffffff' },
  { label: '深蓝', value: '#1a3677' },
  { label: '暗色', value: '#001529' },
]

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

async function onClearAndLogout() {
  Modal.confirm({
    title: '保持配置',
    content: '确认要保存当前配置？',
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      try {
        localStorage.removeItem('project-ui-settings')
        localStorage.removeItem('wei-theme')
        localStorage.removeItem('asideWidth')
        localStorage.removeItem('layout')
        projectUi.resetToDefaults()
        projectUi.closeSettings()
        await userStore.loginOut()
      } catch {
        /* ignore */
      } finally {
        await toLogin()
        await router.replace('/login')
        removeWatermark()
        location.reload()
      }
    },
  })
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
            v-for="k in themeKeys"
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
            v-for="k in themeKeys"
            :key="`h-${k}`"
            type="button"
            class="color-dot"
            :class="{ ring: headerBg === projectUi.themeSwatches[k] }"
            :style="{ background: projectUi.themeSwatches[k] }"
            @click="pickHeader(projectUi.themeSwatches[k])" />
          <button
            v-for="ex in MENU_SWATCH_EXTRA"
            :key="`hex-h-${ex.value}`"
            type="button"
            class="color-dot"
            :class="{ ring: headerBg === ex.value, 'color-dot--light-surface': isLightSurfaceHex(ex.value) }"
            :style="{ background: ex.value }"
            @click="pickHeader(ex.value)" />
        </div>
      </section>

      <section>
        <div class="mb-2 text-sm text-gray-600">菜单主题</div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="k in themeKeys"
            :key="`m-${k}`"
            type="button"
            class="color-dot"
            :class="{ ring: menuBg === projectUi.themeSwatches[k] }"
            :style="{ background: projectUi.themeSwatches[k] }"
            @click="pickMenu(projectUi.themeSwatches[k])" />
          <button
            v-for="ex in MENU_SWATCH_EXTRA"
            :key="`hex-m-${ex.value}`"
            type="button"
            class="color-dot"
            :class="{ ring: menuBg === ex.value, 'color-dot--light-surface': isLightSurfaceHex(ex.value) }"
            :style="{ background: ex.value }"
            @click="pickMenu(ex.value)" />
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
        <a-button type="primary"  @click="onClearAndLogout">
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
  background: #fbbf24 !important;
  border-color: #f59e0b !important;
  color: #111827 !important;
}
.reset-btn:hover {
  filter: brightness(0.95);
}
</style>
