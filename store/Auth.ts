import { defineStore } from 'pinia'
import type { IUserData, Privilege } from '~/models/user'

export const useMyAuthStore = defineStore('myAuthStore',()=>{
const  user = ref <IUserData|null>(null)
const  logedin =  computed(()=>{
  return user.value?.jwtToken?  true: false 
})

const permissions =ref<string []>([])
const privilege = ref<Privilege>() 

return {logedin,user,permissions ,privilege }
},{
persist: {
  storage: piniaPluginPersistedstate.cookies(),
}})
