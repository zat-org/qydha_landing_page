import { useMyClientInfoStore } from "~/store/ClientInfo";

export default defineNuxtPlugin(() => {
  const clientInfoStore = useMyClientInfoStore();

  const runInit = () => clientInfoStore.Init();

  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(runInit);
  } else {
    setTimeout(runInit, 0);
  }
});
