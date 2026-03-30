import http from './utils/request'
import useNavStore from './stores/nav'
import usePerStore from './stores/per'
import { VRDM_DYNAMIC_ROUTE_NAMES } from './route-names'
import './mock'

export { VRDM_DYNAMIC_ROUTE_NAMES }

const STORAGE_ENABLED = 'vrdm-enabled-route-names'

function getEnabledNameSet() {
  if (typeof sessionStorage === 'undefined')
    return new Set(VRDM_DYNAMIC_ROUTE_NAMES)
  const raw = sessionStorage.getItem(STORAGE_ENABLED)
  if (raw == null)
    return new Set(VRDM_DYNAMIC_ROUTE_NAMES)
  try {
    const arr = JSON.parse(raw)
    return new Set(Array.isArray(arr) ? arr : [])
  } catch {
    return new Set(VRDM_DYNAMIC_ROUTE_NAMES)
  }
}

function filterNavByEnabled(list, enabled) {
  return list
    .map((node) => {
      const rawChildren = node.children || []
      if (rawChildren.length > 0) {
        const children = filterNavByEnabled(rawChildren, enabled)
        if (children.length === 0)
          return null
        return { ...node, children }
      }
      if (node.component && enabled.has(node.name))
        return { ...node, children: [] }
      return null
    })
    .filter(Boolean)
}

export const vueRouterDirectiveMenuRoutes = [
  {
    path: '/projects/vue-router/login',
    name: 'vrdm-login',
    component: () => import('./views/Login.vue'),
  },
  {
    path: '/projects/vue-router',
    name: 'vrdm-layout',
    component: () => import('./views/Layout.vue'),
    children: [
      {
        path: 'home',
        name: 'vrdm-home',
        component: () => import('./views/home/Content.vue'),
      },
      {
        path: '404',
        name: 'vrdm-404',
        component: () => import('./views/Err404.vue'),
      },
    ],
  },
]

let guardRegistered = false

export function setupVueRouterDirectiveMenu(router) {
  if (guardRegistered) return
  guardRegistered = true

  router.beforeEach(async (to) => {
    if (!to.path.startsWith('/projects/vue-router')) return true

    const navStore = useNavStore()
    const perStore = usePerStore()

    if (!navStore.navReady) {
      const routerList = await buildDynamicRoutes(router)
      navStore.setNavList(routerList)
      return { ...to, replace: true }
    }

    if (perStore.perList.length === 0) {
      await perStore.initPer()
    }

    if (!router.hasRoute(to.name) && to.name) {
      return { path: '/projects/vue-router/404' }
    }

    return true
  })
}

async function buildDynamicRoutes(router) {
  const prePathName = './views/home/'
  const extPathName = '.vue'
  const routerMap = import.meta.glob('./views/home/sys/**/*.vue')
  const rawNav = (await http.get('/sys/menu/nav')).data.data.nav
  const enabled = getEnabledNameSet()
  const navList = filterNavByEnabled(
    JSON.parse(JSON.stringify(rawNav)),
    enabled,
  )

  function walk(list) {
    list.forEach((element) => {
      const key = prePathName + element.component + extPathName
      element.component = routerMap[key] || ''
      if (element.component && enabled.has(element.name)) {
        router.addRoute('vrdm-layout', {
          ...element,
          path: element.path.replace('/projects/vue-router/', '').replace(/^\//, ''),
        })
      }
      if (element.children.length > 0) walk(element.children)
    })
  }

  walk(navList)
  return navList
}
