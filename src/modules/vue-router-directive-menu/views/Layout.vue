<script setup>
import Sidebar from "./home/Sidebar.vue";
import Header from "./home/Header.vue";
</script>

<template>
  <Header />
  <el-container class="layout-wrap">
    <el-container class="layout-body">
      <el-aside width="240px" class="aside">
        <Sidebar />
      </el-aside>
      <el-main class="main">
        <el-card shadow="never" class="content-card">
          <RouterView />
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout-wrap {
  min-height: calc(100vh - 170px);
}

.layout-body {
  flex: 1;
}

.aside {
  border-right: 1px solid #ebeef5;
  background: #fff;
}

.main {
  background: #f5f7fa;
}

.content-card {
  min-height: 420px;
}
</style>
