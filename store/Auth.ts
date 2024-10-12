import { defineStore } from 'pinia'
import type { IUserData, Privilege } from '~/models/user'

export const useMyAuthStore = defineStore('myAuthStore',()=>{
const  user = ref <IUserData|null>(null)
const  logedin =  computed(()=>{
  return user.value?.refreshToken?true: false 
})
const updateToken =(token:string ,refreshToken:string)=>{
  if(!user.value) throw new Error("no user to change token") 
  user.value.jwtToken = token
  user.value.refreshToken = refreshToken

}
const permissions =ref<string []>([])
const privilege = ref<Privilege>() 

return {logedin,user,updateToken,permissions ,privilege }
},{
persist: {
  storage: piniaPluginPersistedstate.cookies(),
}})
