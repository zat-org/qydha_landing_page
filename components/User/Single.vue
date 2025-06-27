<template>

<UCard >

  <div class="grid grid-cols-2 grid-rows-2 h-full" style="grid-template-rows:150px 1fr;">
      <div class="  row-span-1 col-start-1 col-end-2 flex flex-col gap-3 ">
        <p> الاسم :{{ userData?.user.username }}</p>
        <p>رقم الهاتف :{{ userData?.user.phone}}</p>
        <p>
          الفئة
          :
        </p>
          <USelect :popper="{ placement: 'left-end' }" value-attribute="value" option-attribute="value"
            v-if="userStore.user?.user.roles.includes('SuperAdmin')||userStore.user?.user.roles.includes('StaffAdmin')"
            v-model="roles" multiple :items="rolesOption"/>
          <span v-else>
            {{ userData?.user.roles.join(' , ')}}
          </span>


      </div>
      <div class=" row-span-1  col-start-2 col-end-3  grid justify-items-end">
        <img v-if="userData?.user.avatarUrl" class="w-[150px] h-[150px]" :src="userData?.user.avatarUrl" />
        <UIcon v-else name="mdi:user" class="text-[150px] bg-gradient-to-r from-amber-300" />
      </div>
      <div class="row-span-2  col-start-1 col-end-3">
        <UTabs :items="tabsItems" dir="rtl" >
          <template #promo>
            <UTable :data="userData?.promoCodes"  :columns="promocols" />
          </template>
          <template #purchase>
            <UTable :data="userData?.purchases"  :columns="purchaseCols" />

          </template>
          <template #influncer>
            <UTable :data="userData?.influencerCodes"  :columns="influncerCols" >
            <template #category-cell="{row}">
              <p>{{ row.original.categoryName }}</p>
            </template>
            </UTable>
          </template>
        </UTabs>
      </div>
    </div>

  <template #footer>
      <div class="flex justify-between">
        <UButton color="error" @click="router.back()"> عودة</UButton>
      </div>
    </template>

  </UCard >
  
</template>

<script lang="ts" setup>
import { useMyAuthStore } from '~/store/Auth';
const router  = useRouter()
const props = defineProps<{ id: string }>()
const userApi = useUsers()
const getREQ = await userApi.getSingleUser()
const updateREQ = await userApi.updateUser()
const toast = useToast()
const userStore = useMyAuthStore()
await getREQ.fetchREQ(props.id)
if (getREQ.status.value == "error") {
  navigateTo('/user')
}
const userData = computed(() => {
  return getREQ.data.value?.data
})
const roles = ref<string[]>(userData.value?.user.roles!)

const rolesOption = [
  { label: 'SuperAdmin', value: 'SuperAdmin', disabled: true },
  { label: 'StaffAdmin', value: 'StaffAdmin', disabled: false },
  { label: 'Streamer', value: 'Streamer', disabled: false },
  { label: 'User', value: 'User', disabled: true },
]
watch(roles, async (newValue, oldValue) => {
  await updateREQ.fetchREQ(userData.value?.user.id!, newValue)
  if (updateREQ.status.value == "success") {
    toast.add({ title: "update role done " })
  }
})
const tabsItems = [
  { slot: 'promo', label: 'الاكواد' },
  { slot: 'purchase', label: 'المشتريات' },
  { slot: 'influncer', label: 'اكواد المؤثريين' },
]
const promocols = [
  { accessorKey: 'code', header: 'الاسم ' },
  { accessorKey: 'numberOfDays', header: 'عدد الايام' },
  { accessorKey: 'usedAt', header: 'استخدم في ' },
]
const purchaseCols = [
  { accessorKey: 'type', header: 'النوع' },
  { accessorKey: 'numberOfDays', header: 'عدد الايام' },
  { accessorKey: 'purchaseDate', header: 'تاريخ الشراء' },
]
const influncerCols = [
  { accessorKey: 'influencerCodeName', header: 'الكود' },
  { accessorKey: 'numberOfDays', header: 'عدد الايام' },
  { accessorKey: 'category', header: ' النوع' },

]


</script>

<style></style>