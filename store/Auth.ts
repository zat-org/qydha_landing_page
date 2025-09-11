import { defineStore } from "pinia";
import type { IUserData, Privilege } from "~/models/user";

export const useMyAuthStore = defineStore(
  "myAuthStore",
  () => {
    const user = ref<IUserData | null>(null);
    const logedin = computed(() => {
      return user.value?.jwtToken ? true : false;
    });
    const roles = computed(() => {
      return user.value?.user.roles;
    });

    const permissions = ref<string[]>([]);
    const privilege = ref<Privilege>();

    const isSuperAdmin = computed(() => {
      return roles.value?.includes("SuperAdmin");
    });

    const isStaffAdmin = computed(() => {
      return roles.value?.includes("StaffAdmin");
    });

    const isStreamer = computed(() => {
      return roles.value?.includes("Streamer");
    });

    return {
      logedin,
      user,
      permissions,
      privilege,
      roles,
      isSuperAdmin,
      isStaffAdmin,
      isStreamer,
    };
  },
  {
    persist: [
      {
        // storage:piniaPluginPersistedstate.localStorage()
        storage: piniaPluginPersistedstate.cookies({
          maxAge: 60 * 60 * 24 * 2,
        }),
        pick: ["user.jwtToken","user.user.roles","user.boardLink"],
      },
      {
        storage: piniaPluginPersistedstate.localStorage(),
        // storage: piniaPluginPersistedstate.cookies({
        //   maxAge: 60 * 60 * 24 * 2,
        // }),
  
      },
    ],
  }
);
