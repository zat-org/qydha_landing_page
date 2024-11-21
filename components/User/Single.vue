<template>

<UCard :ui="{base:'h-full flex flex-col',body:{base:'grow'}}">

  <div class="grid grid-cols-2 grid-rows-2 h-full" style="grid-template-rows:150px 1fr;">
      <div class="  row-span-1 col-start-1 col-end-2 flex flex-col gap-3 ">
        <p> الاسم :{{ userData?.user.username }}</p>
        <p>رقم الهاتف :{{ userData?.user.phone}}</p>
        <p>
          الفئة
          :
        </p>
          <USelectMenu :popper="{ placement: 'left-end' }" value-attribute="value" option-attribute="value"
            v-if="userStore.user?.user.roles.includes('SuperAdmin')||userStore.user?.user.roles.includes('StaffAdmin')"
            v-model="roles" multiple :options="rolesOption">
            <template #label>
              <span>
                {{ roles.join(' , ')}}
              </span>
            </template>

          </USelectMenu>
          <span v-else>
            {{ userData?.user.roles.join(' , ')}}
          </span>


      </div>
      <div class=" row-span-1  col-start-2 col-end-3  grid justify-items-end">
        <img v-if="userData?.user.avatarUrl" class="w-[150px] h-[150px]" :src="userData?.user.avatarUrl" />
        <UIcon v-else name="mdi:user" class="text-[150px] bg-gradient-to-r from-amber-300" />
      </div>
      <div class="row-span-2  col-start-1 col-end-3">
        <UTabs :items="tabsItems">
          <template #promo>
            <UTable :rows="userData?.promoCodes" :columns="promocols" />
          </template>
          <template #purchase>
            <UTable :rows="userData?.purchases" :columns="purchaseCols" />

          </template>
          <template #influncer>
            <UTable :rows="userData?.influencerCodes" :columns="influncerCols" >
            <template #category-name="{row}">
              <p>{{ row.category.name }}</p>
            </template>
            </UTable>
          </template>
        </UTabs>
      </div>
    </div>

  <template #footer>
      <div class="flex justify-between">
        <UButton color="red" @click="router.back()"> back</UButton>
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
  { key: 'code', label: 'الاسم ' },
  { key: 'numberOfDays', label: 'عدد الايام' },
  { key: 'usedAt', label: 'استخدم في ' },
]
const purchaseCols = [
  { key: 'type', label: 'النوع' },
  { key: 'numberOfDays', label: 'عدد الايام' },
  { key: 'purchaseDate', label: 'تاريخ الشراء' },
]
const influncerCols = [
  { key: 'influencerCodeName', label: 'الكود' },
  { key: 'numberOfDays', label: 'عدد الايام' },
  { key: 'category', label: ' النوع' },

]


</script>

<style></style>