import { type FetchOptions } from 'ofetch';
import jwtDecode from 'jwt-decode';
import { useMyAuthStore } from '~/store/Auth';
import type { IUserData } from '~/models/user';
interface DecodedToken {
  exp: number;
}

export default defineNuxtPlugin(() => {
  // get user data if it exist or not
  
  const config = useRuntimeConfig();
  const $api = $fetch.create({
    baseURL: config.public.qydhaapiBase,
    onRequest:async({options}:{options:FetchOptions})=>{
      const authStore =useMyAuthStore()
      let token = authStore.user?.jwtToken
      if (token){
        const decodedToken = jwtDecode<DecodedToken>(token);
        // Check if the token is expired.
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds.
        if (decodedToken.exp < currentTime) {
          try {
            // Call your refresh token endpoint.
            const response = await $fetch<{data:IUserData,message:string}>('https://sam-baloot-admin.online/dev/auth/refresh-token', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`, // Send the expired token if required for refresh.
              },
              body:{
                RefreshToken:authStore.user?.refreshToken,
                JwtToken: token
              }
            });

            console.log(response)
            authStore.user =response.data
            console.log('Token refreshed successfully.');
            
          } catch (error) {
            console.error('Failed to refresh token:', error);
            authStore.user=null
            navigateTo("/login");
          }
        } 

        options.headers= {...options.headers,Authorization:`Bearer ${token}`}
      
    }else{
      options.headers= {...options.headers,Authorization:`Bearer ${config.public.qydhaToken}`}
    }
  }})

  return {
    provide: {
      api: $api,
    },
  };
});
