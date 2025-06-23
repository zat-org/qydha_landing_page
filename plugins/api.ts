import { type FetchOptions } from 'ofetch';
import {jwtDecode} from 'jwt-decode';
import { useMyAuthStore } from '~/store/Auth';
import type { IUserData } from '~/models/user';
import type { NuxtError } from '#app';
interface DecodedToken {
  exp: number;
}

export default defineNuxtPlugin(() => {
  // get user data if it exist or not
  const authStore =useMyAuthStore()
      const {user} =storeToRefs(authStore)
  const config = useRuntimeConfig();
  const $api = $fetch.create({
    baseURL: config.public.qydhaapiBase,
    onRequest:async({options}:{options:FetchOptions})=>{
      
      let token = authStore.user?.jwtToken
      if (token){
        // const decodedToken = jwtDecode<DecodedToken>(token);
        // // Check if the token is expired.
        // const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds.
        // if (decodedToken.exp < currentTime) { 
        //   try {
        //     // Call your refresh token endpoint.
        //     const response = await $fetch<{data:IUserData,message:string}>(`${config.public.qydhaapiBase}/auth/refresh-token`, {
        //       method: 'POST',
        //       headers: {
        //         Authorization: `Bearer ${token}`, // Send the expired token if required for refresh.
        //       },
        //       body:{
        //         RefreshToken:authStore.user?.refreshToken,
        //         JwtToken: token
        //       }
        //     });

        //     console.log(response)
        //     authStore.user =response.data
        //     console.log('Token refreshed successfully.');

        //   } catch (error) {
        //     console.error('Failed to refresh token:', error);
        //     authStore.user=null
        //     navigateTo("/login");
        //   }
        // } 

        options.headers= {...options.headers,Authorization:`Bearer ${ authStore.user?.jwtToken}`}
      
    }else{
      options.headers= {...options.headers,Authorization:`Bearer ${config.public.qydhaToken}`}
    }
  },onResponseError:(error)=>{
    if(error.response.status ==403 || error.response.status ==401){
      user.value = null;
      navigateTo("/")
    }

  }})

  return {
    provide: {
      api: $api,
    },
  };
});
