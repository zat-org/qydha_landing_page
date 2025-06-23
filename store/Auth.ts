import { defineStore } from 'pinia'
import type { IUserData, Privilege } from '~/models/user'

export const useMyAuthStore = defineStore('myAuthStore', () => {
  const user = ref<IUserData | null>(null)
  const logedin = computed(() => {
    return user.value?.jwtToken ? true : false
  })
  const roles = computed(() => {
    return user.value?.user.roles
  })

  const permissions = ref<string[]>([])
  const privilege = ref<Privilege>()

  return { logedin, user, permissions, privilege, roles }
}, {
  persist: {
    storage: piniaPluginPersistedstate.cookies({
      maxAge: 60 * 60 * 24 * 2,
    }),
  }
})