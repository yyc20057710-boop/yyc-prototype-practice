<template>
  <div class="content-wrap">
    <el-empty description="欢迎进入首页，可从左侧进入系统模块">
      <RouterLink to="/projects/vue-router/login">
        <el-button type="primary" plain>返回登录页面</el-button>
      </RouterLink>
    </el-empty>
  </div>
</template>

<style scoped>
.content-wrap {
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
