<script setup>
import { computed, ref } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";

const projectLinks = [
  { name: "富文本插入变量", to: "/projects/wangeditor" },
  { name: "RBAC动态路由与directive", to: "/projects/vue-router" },
  { name: "echarts数据展示", to: "/projects/echarts" },
  { name: "tanstack虚拟滚动", to: "/projects/virtual-scrolling" },
];

const drawerVisible = ref(false);
const route = useRoute();
const router = useRouter();

const activeName = computed(() => {
  const match = projectLinks.find((item) => route.path.startsWith(item.to));
  return match?.name || "";
});

const activeMenuIndex = computed(() => {
  const match = projectLinks.find((item) => route.path.startsWith(item.to));
  return match?.to || "";
});

const handleRoute = (to) => {
  router.push(to);
  drawerVisible.value = false;
};
</script>

<template>
  <div class="layout">
    <header class="header">
      <el-tooltip content="打开导航" placement="bottom">
        <el-button
          class="menu-btn"
          type="primary"
          circle
          aria-label="打开项目导航菜单"
          @click="drawerVisible = true"
        >
          <span class="hamburger" aria-hidden="true">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </span>
        </el-button>
      </el-tooltip>
      <h1 class="title">YYC Prototype Practice</h1>
      <el-tag v-if="activeName" size="small" type="info">{{
        activeName
      }}</el-tag>
    </header>
    <main class="main">
      <RouterView />
    </main>

    <el-drawer
      v-model="drawerVisible"
      title="项目导航"
      direction="ltr"
      size="260px"
    >
      <el-menu :default-active="activeMenuIndex">
        <el-menu-item
          v-for="item in projectLinks"
          :key="item.to"
          :index="item.to"
          @click="handleRoute(item.to)"
        >
          {{ item.name }}
        </el-menu-item>
      </el-menu>
    </el-drawer>
  </div>
</template>

<style scoped>
.layout {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  /* background: #f6f8fb; */
}

.header {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  height: 52px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.menu-btn {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  padding: 0;
  box-shadow: 0 2px 8px rgba(54, 104, 224, 0.35);
}

.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 22px;
}

.hamburger-line {
  display: block;
  width: 20px;
  height: 2px;
  border-radius: 1px;
  background: #fff;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
}

.title {
  margin: 0;
  font-size: 17px;
  flex: 1;
}

.main {
  flex: 1;
  padding: 12px;
  height: calc(100vh - 64px);
}

ul {
  border: none;
}
</style>
