<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import useNavStore from "../stores/nav";
import { VRDM_DYNAMIC_ROUTE_NAMES } from "../route-names";

const STORAGE_ENABLED = "vrdm-enabled-route-names";
const HOME = "/projects/vue-router/home";

/** 可挂载的业务模块：勾选的才会 addRoute + 出现在侧栏 */
const moduleOptions = [
  {
    name: "SysUser",
    label: "用户管理",
    path: "/projects/vue-router/sys/users",
  },
  {
    name: "SysRole",
    label: "角色管理",
    path: "/projects/vue-router/sys/roles",
  },
  {
    name: "SysMenu",
    label: "菜单管理",
    path: "/projects/vue-router/sys/menus",
  },
  {
    name: "SysDict",
    label: "数字字典",
    path: "/projects/vue-router/sys/dicts",
  },
];

const router = useRouter();
const navStore = useNavStore();

const enabledNames = ref([]);
const landingPath = ref(HOME);

const landingOptions = computed(() => {
  const opts = [{ label: "首页", value: HOME }];
  for (const m of moduleOptions) {
    if (enabledNames.value.includes(m.name))
      opts.push({ label: m.label, value: m.path });
  }
  return opts;
});

function stripDynamicRoutes() {
  VRDM_DYNAMIC_ROUTE_NAMES.forEach((name) => {
    if (router.hasRoute(name))
      router.removeRoute(name);
  });
}

function loadEnabledFromStorage() {
  const raw = sessionStorage.getItem(STORAGE_ENABLED);
  if (raw == null) {
    enabledNames.value = [...VRDM_DYNAMIC_ROUTE_NAMES];
    return;
  }
  try {
    const arr = JSON.parse(raw);
    enabledNames.value = Array.isArray(arr) ? [...arr] : [];
  } catch {
    enabledNames.value = [...VRDM_DYNAMIC_ROUTE_NAMES];
  }
}

function syncLanding() {
  if (!landingOptions.value.some((o) => o.value === landingPath.value))
    landingPath.value = HOME;
}

onMounted(() => {
  stripDynamicRoutes();
  navStore.resetForLogin();
  loadEnabledFromStorage();
  syncLanding();
});

watch(enabledNames, () => syncLanding(), { deep: true });

function handleEnter() {
  sessionStorage.setItem(STORAGE_ENABLED, JSON.stringify(enabledNames.value));
  stripDynamicRoutes();
  navStore.resetForLogin();
  let target = landingPath.value;
  if (!landingOptions.value.some((o) => o.value === target))
    target = HOME;
  router.push(target);
}
</script>

<template>
  <div class="login-page">
    <el-card class="login-card" shadow="hover">
      <template #header>
        <div class="card-header">登录 · 选择要挂载的模块</div>
      </template>

      <p class="hint">
        未勾选的模块<strong>不会</strong>执行 <code>addRoute</code>，也不会出现在侧栏。进入后由导航守卫按勾选结果注册路由。
      </p>

      <div class="section-title">挂载模块</div>
      <el-checkbox-group v-model="enabledNames" class="check-group">
        <el-checkbox
          v-for="opt in moduleOptions"
          :key="opt.name"
          :label="opt.name"
          border
        >
          {{ opt.label }}
        </el-checkbox>
      </el-checkbox-group>

      <div class="section-title">进入后打开</div>
      <el-radio-group v-model="landingPath" class="route-group">
        <el-radio
          v-for="opt in landingOptions"
          :key="opt.value"
          :label="opt.value"
          border
        >
          {{ opt.label }}
        </el-radio>
      </el-radio-group>

      <div class="actions">
        <el-button type="primary" size="large" @click="handleEnter">
          确定并进入
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  width: 480px;
}

.card-header {
  font-weight: 600;
}

.hint {
  margin: 0 0 16px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  line-height: 1.5;
}

.hint code {
  font-size: 12px;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--el-text-color-regular);
}

.check-group,
.route-group {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  margin-bottom: 16px;
}

.check-group :deep(.el-checkbox),
.route-group :deep(.el-radio) {
  margin-right: 0;
  height: auto;
  padding: 8px 12px;
}

.actions {
  display: flex;
  justify-content: flex-end;
}
</style>
