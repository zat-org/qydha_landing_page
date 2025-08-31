import { useMyClientInfoStore } from "~/store/ClientInfo";

export default defineNuxtPlugin((nuxtApp) => {
  const clientInfoStore = useMyClientInfoStore();
  clientInfoStore.Init();
  console.log(clientInfoStore.clientInfo)
});
