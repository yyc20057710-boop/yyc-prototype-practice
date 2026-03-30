import { createRouter, createWebHistory } from 'vue-router'
import WangEditorView from '@/views/WangEditorView.vue'
import EchartsView from '@/views/EchartsView.vue'
import VirtualScrollingView from '@/views/VirtualScrollingView.vue'
import {
  vueRouterDirectiveMenuRoutes,
  setupVueRouterDirectiveMenu,
} from '@/modules/vue-router-directive-menu'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/projects/wangeditor',
    },
    {
      path: '/projects/wangeditor',
      component: WangEditorView,
    },
    {
      path: '/projects/vue-router',
      redirect: '/projects/vue-router/login',
    },
    {
      path: '/projects/echarts',
      component: EchartsView,
    },
    {
      path: '/projects/virtual-scrolling',
      component: VirtualScrollingView,
    },
    ...vueRouterDirectiveMenuRoutes,
  ],
})

setupVueRouterDirectiveMenu(router)

export default router
