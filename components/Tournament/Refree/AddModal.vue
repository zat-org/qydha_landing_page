<template>
  <UModal prevent-close>

    <UCard>
      <template #header>
        اضافة حكم جديد
      </template>
      <UForm :state="state" :schema="schema" ref="refreeForm" @submit="onSubmit">

        <UFormGroup label="اسم الحكم " name="username">
          <USelectMenu 
          clear-search-on-close
           v-model="state.username"
           :loading="getusers.status.value=='pending'"
            v-if="authStore.user?.user.roles.includes('SuperAdmin') || authStore.user?.user.roles.includes('StaffAdmin')"
            :options="Users" :searchable="search" option-attribute="username" value-attribute="username" />

          <UInput v-model="state.username" v-else />

        </UFormGroup>
      </UForm>
      <template #footer>
        <div class="flex justify-between">
          <UButton label="اغلاق" color="red" @click="modal.close()" />
          <UButton label="اضافة" @click="refreeForm?.submit()" />
        </div>

      </template>
    </UCard>

  </UModal>
</template>

<script lang="ts" setup>
import { object, string } from "yup"
const modal = useModal()
const route = useRoute()
const tour_id = route.params.id.toString()
const refreeAddREQ = await useTournamentRefree().addTourRefree()
import { type Form } from '#ui/types'
import { useMyAuthStore } from "~/store/Auth";
const refreeForm = ref<Form<{ username: string }>>()
const getusers = await useUsers().getAllUsers()
const authStore = useMyAuthStore()

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


const schema = object({
  username: string().required("برجاء ادخال اسم الحكم")
})

const state = reactive({ username: '' })

const onSubmit = async () => {
  await refreeAddREQ.fetchREQ(tour_id, state)

  if (refreeAddREQ.status.value == "success") {
    modal.close()
  }

  else if (refreeAddREQ.status.value == "error" && refreeAddREQ.error.value?.statusCode == 404) {
    refreeForm.value!.setErrors([{ message: 'هذا المستخدم غير موجود ', path: 'username' }])
  }
}

</script>

<style></style>