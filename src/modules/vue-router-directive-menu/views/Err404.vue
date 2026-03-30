<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<template>
  <div class="err-wrap">
    <el-result icon="warning" title="404" sub-title="页面不存在或无权限访问">
      <template #extra>
        <el-button type="primary" @click="router.back()"
          >返回上个页面</el-button
        >
      </template>
    </el-result>
  </div>
</template>

<style scoped>
.err-wrap {
  display: flex;
  height: 70vh;
  align-items: center;
  justify-content: center;
}
</style>
