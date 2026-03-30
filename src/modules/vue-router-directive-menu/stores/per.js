import { defineStore } from "pinia";
import { ref } from "vue";
import http from "../utils/request";

const usePerStore = defineStore("vrdm-per-store", () => {
  const perList = ref([]);

  async function initPer() {
    const res = await http.get("/sys/menu/nav");
    perList.value = res.data.data.authoritys || [];
  }

  function hasPer(per) {
    return perList.value.includes(per);
  }

  function setPerList(list) {
    perList.value = [...new Set(list)];
  }

  return { perList, initPer, hasPer, setPerList };
});

export default usePerStore;
