<template>

    <UCard>
      <template #header>
        اضافة حكم جديد
      </template>
      <UForm :state="state" :schema="schema" ref="refreeForm" @submit="onSubmit">

        <UFormField label="اسم الحكم " name="username">
          <USelectMenu
          :resetSearchTermOnBlur="false"
          :resetSearchTermOnSelect="false"
          clear-search-on-close
           v-model="state.username"
           v-model:search-term="searchTerm"
           :loading="getusers.status.value=='pending'"
            v-if="authStore.user?.user.roles.includes('SuperAdmin') || authStore.user?.user.roles.includes('StaffAdmin')"
            :items="Users"  
            label-key="username" 
            value-key="username"
            searchable
            placeholder="ابحث عن حكم..." />

          <UInput v-model="state.username" v-else />

        </UFormField>
      </UForm>
      <template #footer>
        <div class="flex justify-between">
          <UButton label="اغلاق" color="error" @click="emit('close')" />
          <UButton label="اضافة" @click="refreeForm?.submit()" />
        </div>
      </template>
    </UCard>

</template>

<script lang="ts" setup>
import { object, string } from "yup"
import { refDebounced } from '@vueuse/core'

const emit = defineEmits(['close'])
const route = useRoute()
const tour_id = route.params.id.toString()
const toast = useToast()
const refreeAddREQ = await useTournamentRefree().addTourRefree()
import { useMyAuthStore } from "~/store/Auth";
const refreeForm = ref()
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

const searchTerm = ref("")
const searchTermDebounced = refDebounced(searchTerm, 500)

// Watch for changes in the debounced search term and trigger backend search
watch(searchTermDebounced, async (newSearchTerm) => {
  if (authStore.user?.user.roles.includes('SuperAdmin') || authStore.user?.user.roles.includes('StaffAdmin')) {
    await getusers.fetchREQ(newSearchTerm || "")
  }
})


const schema = object({
  username: string().required("برجاء ادخال اسم الحكم")
})

const state = reactive({ username: '' })

const onSubmit = async () => {
  await refreeAddREQ.fetchREQ(tour_id, state)

  if (refreeAddREQ.status.value == "success") {
    emit('close')
    toast.add({
      title: "تم اضافة الحكم بنجاح",
      color: "success",
      icon: "material-symbols:check",
    })
  }

  else if (refreeAddREQ.status.value == "error" ) {
  if (refreeAddREQ.error.value?.statusCode == 404) {
    refreeForm.value!.setErrors([{ message: 'هذا المستخدم غير موجود ', name: 'username' }])
  } else if (refreeAddREQ.error.value?.statusCode == 400) {
    refreeForm.value!.setErrors([{ message: 'هذا المستخدم موجود بالفعل في البطولة ', name: 'username' }])
  } else if (refreeAddREQ.error.value?.statusCode == 403) {
    refreeForm.value!.setErrors([{ message: 'ليس لديك صلاحية لاضافة الحكم ', name: 'username' }])
  
  }
  }
}

</script>

<style></style>