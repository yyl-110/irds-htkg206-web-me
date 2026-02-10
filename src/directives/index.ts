import type { App } from 'vue';
import { hasRole } from './permission/hasRole';
import { hasPermi } from './permission/hasPermi';
import { dragModal } from './permission/dragModal';
/**
 * 导出指令：v-xxx
 * @param app
 * - hasRole 用户权限，用法: v-hasRole
 * - hasPermi 按钮权限，用法: v-hasPermi
 */
export function setupAuth(app: App<Element>) {
  hasRole(app);
  hasPermi(app);
  dragModal(app);
}
