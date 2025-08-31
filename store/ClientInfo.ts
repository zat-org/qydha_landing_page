import { defineStore } from "pinia";
export const useMyClientInfoStore = defineStore(
  "clientInfo",
  () => {
    const clientInfo = reactive({
      enviroment:
        process.env.NODE_ENV === "production" ? "production" : "staging",
      platform: "web",
      appVersion: process.env.App_VERSION ?? "1.0.0",
      deviceId: "",
    });
    const Init = () => {
      if (!clientInfo.deviceId) {
        clientInfo.deviceId = crypto.randomUUID();
      }
    };
    return { clientInfo, Init };
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
    },
  }
);
