import { defineStore } from "pinia";
import { computed, ref } from "vue";

const useNavStore = defineStore("vrdm-nav-store", () => {
  const navList = ref([]);
  /** 是否已完成一次「拉菜单 + 按勾选注册动态路由」；菜单为空时也必须为 true，避免守卫死循环 */
  const navReady = ref(false);
  const hasNav = computed(() => navList.value.length > 0);
  const setNavList = (list) => {
    navList.value = list;
    navReady.value = true;
  };
  const resetForLogin = () => {
    navList.value = [];
    navReady.value = false;
  };
  return { navList, hasNav, navReady, setNavList, resetForLogin };
});

export default useNavStore;
