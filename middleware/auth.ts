import { useMyAuthStore } from '~/store/Auth';
export default defineNuxtRouteMiddleware((to, from) => {
const AuthStore = useMyAuthStore()

if (!AuthStore.logedin && to.path != "/login"){
       
    return navigateTo("/login")
}
if (AuthStore.logedin && to.path == "login"){
    return navigateTo("/tournament")
}

})
