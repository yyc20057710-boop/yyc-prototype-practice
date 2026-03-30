import { ref, toValue, watch, onScopeDispose } from "vue";

export default function useVirtualComputed(optionsRef) {
  const instance = { range: null };
  const renderEpoch = ref(0);

  function getOptions() {
    return toValue(optionsRef);
  }

  function recalcRange() {
    const opts = getOptions();
    const el = opts.getScrollElement?.();
    const count = opts.count;
    const h = opts.estimateSize?.(0) ?? 52;
    const overscan = opts.overscan ?? 0;
    if (!el || count <= 0) {
      instance.range = null;
      return;
    }
    const scrollTop = el.scrollTop;
    const viewH = el.clientHeight;
    let start = Math.floor(scrollTop / h);
    let end = Math.min(count - 1, start + Math.ceil(viewH / h) + 1);
    start = Math.max(0, start - overscan);
    end = Math.min(count - 1, end + overscan);
    instance.range = { startIndex: start, endIndex: end };
  }

  function notify() {
    recalcRange();
    renderEpoch.value++;
    getOptions().onChange?.(instance);
  }

  function onScroll() {
    notify();
  }

  watch(
    () => getOptions().getScrollElement?.(),
    (el, prev, onCleanup) => {
      prev?.removeEventListener("scroll", onScroll);
      el?.addEventListener("scroll", onScroll, { passive: true });
      onCleanup(() => el?.removeEventListener("scroll", onScroll));
      notify();
    },
    { flush: "post" },
  );

  watch(
    () => [getOptions().count, toValue(optionsRef)],
    () => notify(),
    { flush: "post" },
  );

  onScopeDispose(() => {
    const el = getOptions().getScrollElement?.();
    el?.removeEventListener("scroll", onScroll);
  });

  return {
    getTotalSize() {
      const opts = getOptions();
      return opts.count * (opts.estimateSize?.(0) ?? 52);
    },
    getVirtualItems() {
      void renderEpoch.value;
      const opts = getOptions();
      recalcRange();
      const r = instance.range;
      if (!r) return [];
      const h = opts.estimateSize?.(0) ?? 52;
      const list = [];
      for (let i = r.startIndex; i <= r.endIndex; i++) {
        list.push({
          key: opts.getItemKey ? opts.getItemKey(i) : i,
          index: i,
          start: i * h,
          end: (i + 1) * h,
          size: h,
        });
      }
      return list;
    },
  };
}
