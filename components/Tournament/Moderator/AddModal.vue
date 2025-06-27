<template>
  <UModal prevent-close>
    <UCard>
      <template #header>
       اضافة مدير جديد
      </template>
      <UForm :state="state" :schema="schema" ref="moderatorForm" @submit="onSubmit">
        <UFormField name="username" label=" اسم المدير ">
          <USelectMenu 
          clear-search-on-close
           v-model="state.username"
           :loading="getusers.status.value=='pending'"
            v-if="authStore.user?.user.roles.includes('SuperAdmin') || authStore.user?.user.roles.includes('StaffAdmin')"
            :options="Users" :searchable="search" option-attribute="username" value-attribute="username" />

          <UInput v-model="state.username" v-else />
        </UFormField>
        <UFormField name="permissions" label="الصلاحيات">
          <USelectMenu v-model="state.permissions" :options="permission" multiple />
        </UFormField>
      </UForm>

      <template #footer>
        <div class="flex justify-between items-center">
          <UButton label="اضافة" @click="moderatorForm?.submit()" />
          <UButton color="red" label="اغلاق" @click="emit('close')" />
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import type { IModeratorCreate } from '~/models/tournamentModeratorr';
import { array, object, string } from "yup"
import { useMyAuthStore } from '~/store/Auth';

const route = useRoute()
const tour_id = route.params.id.toString()

const getusers = await useUsers().getAllUsers()
const  authStore =useMyAuthStore()
if (authStore.user?.user.roles.includes('SuperAdmin') || authStore.user?.user.roles.includes('StaffAdmin')) {
  await getusers.fetchREQ('')
}

const Users = computed(() => {
  if (authStore.user?.user.roles.includes('SuperAdmin') || authStore.user?.user.roles.includes('StaffAdmin')) {
    return getusers.data.value?.data.items
  }
})
const search = async (q: string) => {
  await getusers.fetchREQ(q)
  return Users.value!
}


const emit = defineEmits(['close'])
const permissionGetREQ = await useTournamentModerator().getModeratorpermissions()

const permission = computed(() => {
  if (permissionGetREQ.data.value)
    return permissionGetREQ.data.value.data.permissions
})

const moderatorForm = ref()
const state = reactive<IModeratorCreate>({
  username: "",
  permissions: []
})
const schema = object({
  username: string().required("برجاء ادخال اسم المدير"),
  permissions: array().of(string()).min(1, "برجاء اختيار صلاحية واحدة علي الاقل")
})
const addModeratorREQ = await useTournamentModerator().addModerator()
const onSubmit = async () => {
  await addModeratorREQ.fetchREQ(tour_id, state)
  if (addModeratorREQ.status.value == "success") {
    emit('close')
  }
  else if (addModeratorREQ.status.value == "error" && addModeratorREQ.error.value?.statusCode == 404  ){
    moderatorForm.value?.setErrors([{message:"هذا المستخدم غير موجود",path:'username'}])
  }
}
</script>

<style></style>