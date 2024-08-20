import { defineStore } from "pinia";

export const useMySidebarStore = defineStore("mySidebarStore", () => {
  const state = ref(false);
  const toggle = () => {
    state.value = !state.value;
  };

  const show = () => {
    state.value = true;
  };
  const hide = () => {
    state.value = false;
  };

  return { state, toggle, show, hide };
});
