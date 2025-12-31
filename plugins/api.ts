import { type FetchOptions } from "ofetch";
import { jwtDecode } from "jwt-decode";
import { useMyAuthStore } from "~/store/Auth";
import type { IUserData } from "~/models/user";
import type { NuxtError } from "#app";
import { useMyClientInfoStore } from "~/store/ClientInfo";

interface DecodedToken {
  exp: number;
}

// Helper function to create a signature
async function createSignature(
  timestamp: string,
  xInfo: string,
  secret: string
): Promise<string> {
  const message = `${timestamp}:${xInfo}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const key = encoder.encode(secret);
  
  // Use Web Crypto API for HMAC
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, data);
  const hashArray = Array.from(new Uint8Array(signature));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
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
      const xInfo = JSON.stringify(ClientInfoStore.clientInfo ?? {});
      
      // Create signature using qydhaToken as secret
      // Note: For better security, use a separate secret that's known to both client and server
      const clientSecret = config.public.qydhaToken || 'default-secret';
      let signature = '';
      
      try {
        signature = await createSignature(timestamp, xInfo, clientSecret);
      } catch (error) {
        console.error('Failed to create signature:', error);
      }
      
      try {
        const token = authStore.user?.jwtToken;
        if (token) {
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`,
            "x-info": xInfo,
            "x-timestamp": timestamp,
            "x-signature": signature, // Add signature header
          };
          return;
        }
      } catch (e) {
        // fallthrough to anonymous headers below
      }
      
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${config.public.qydhaToken}`,
        "x-info": xInfo,
        "x-timestamp": timestamp,
        "x-signature": signature, // Add signature header
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
