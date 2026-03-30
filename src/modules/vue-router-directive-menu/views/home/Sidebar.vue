<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import useNavStore from "../../stores/nav";
import ForItem from "../../components/sidbar/ForItem.vue";

const navStore = useNavStore();
const route = useRoute();
const router = useRouter();

const activePath = computed(() => route.path);

const handleSelect = (index) => {
  if (index && index.startsWith("/")) {
    router.push(index);
  }
};
</script>

<template>
  <el-scrollbar class="first">
    <el-menu :default-active="activePath" class="menu" @select="handleSelect">
      <el-menu-item index="/projects/vue-router/home">首页</el-menu-item>
      <ForItem
        v-for="item in navStore.navList"
        :key="item.name"
        :name="item.name"
        :title="item.title"
        :path="item.path"
        :children="item.children"
      />
    </el-menu>
  </el-scrollbar>
</template>

<style scoped>
.first {
  height: 100%;
}

.menu {
  border-right: none;
  min-height: 100%;
}
</style>
