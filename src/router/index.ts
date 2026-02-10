import type { Router } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './routes'

export const router: Router = createRouter({
  history: createWebHashHistory(),
  routes,
})
