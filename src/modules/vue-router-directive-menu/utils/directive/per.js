import usePerStore from "../../stores/per";

function applyPermission(el, value) {
  const store = usePerStore();
  const hasPermission = store.perList.includes(value);
  el.style.display = hasPermission ? "" : "none";
}

export default {
  mounted(el, binding) {
    applyPermission(el, binding.value);
  },
  updated(el, binding) {
    applyPermission(el, binding.value);
  },
};
