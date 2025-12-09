import { type FetchOptions } from "ofetch";
import { jwtDecode } from "jwt-decode";
import { useMyAuthStore } from "~/store/Auth";
import type { IUserData } from "~/models/user";
import type { NuxtError } from "#app";
import { useMyClientInfoStore } from "~/store/ClientInfo";
interface DecodedToken {
  exp: number;
}

export default defineNuxtPlugin(() => {
  // get user data if it exist or not
  const ClientInfoStore = useMyClientInfoStore();
  const authStore = useMyAuthStore();
  const { user } = storeToRefs(authStore);
  const config = useRuntimeConfig();
  if (process.client && user.value?.jwtToken) {
    try {
      const decoded = jwtDecode<DecodedToken>(user.value.jwtToken);
      const currentTime = Math.floor(Date.now() / 1000);
      
      // If token is expired, clear user data and redirect
      if (decoded.exp && decoded.exp < currentTime) {
        user.value = null;
        // Only navigate if not already on home page
        if (useRoute().path !== '/') {
          navigateTo("/");
        }
      }
    } catch (error) {
      // If token is invalid, clear user data
      console.error("Invalid token:", error);
      user.value = null;
    }
  }
  


  const $api = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest: async ({ options }: { options: FetchOptions }) => {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      try {
        const token = authStore.user?.jwtToken;
        if (token) {
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`,
            "x-info": JSON.stringify(ClientInfoStore.clientInfo ?? {}),
            // lower-case to avoid any case-matching quirks in some environments
            "x-timestamp": timestamp,
          };
          return;
        }
      } catch (e) {
        // fallthrough to anonymous headers below
      }
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${config.public.qydhaToken}`,
        "x-info": JSON.stringify(ClientInfoStore.clientInfo ?? {}),
        "x-timestamp": timestamp,
      };
    },
    onResponseError: (error) => {
      if ( error.response.status == 401) {
        user.value = null;
        navigateTo("/");
      }else if (error.response.status == 403) {
        // navigateTo("/unauthorized");
        const toast  = useToast()
        toast.add({
          title: "ليس لديك صلاحيات الوصول لهذه الصفحة",
          color: "error",
          icon: "i-heroicons-exclamation-triangle",
        });
        // const router = useRouter()
        // router.back()

      }
    },
  });

  return {
    provide: {
      api: $api,
    },
  };
});
