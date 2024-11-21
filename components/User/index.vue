<template>
  <UCard :ui="{base:'flex flex-col h-full ',body:{base:'grow flex flex-col'}}">
    <template #header>
      <div class="flex justify-between items-center gap-2 ">
        <UInput v-model="query" placeholder="username or id  or phone " class="grow" />
          <p>البحث الدقيق</p>        
          <UToggle v-model="exactSearch " />

        <p> {{usersNumebr?.toLocaleString()}} مستخدم </p>
      </div>

    </template>

      <UTable :rows="rows" :columns="cols" class="grow " :ui="{td:{padding:'py-1 sm:py-1'},th:{padding:'py-1 sm:py-1'}}" @select="select" :loading="usersREQ.status.value=='pending'"></UTable>
      <UPagination v-model="page" :page-count="10" :total="items"  class="mx-auto"/>

  </UCard>
</template>

<script lang="ts" setup>
import type { User } from '~/models/user';

const  query  =ref()
const exactSearch =ref<boolean>(false)
const usersREQ = await useUsers().getAllUsers()
await usersREQ.fetchREQ("")
const usersNumebr = usersREQ.data.value?.data.totalCount

const rows= computed(()=>{
  return usersREQ.data.value?.data.items
}) 
const cols =[
  { key: 'id',label:'#' },
  { key: 'username',label:'الاسم' },
  { key: 'phone',label:'رقم الهاتف' },
]
const page = ref(usersREQ.data.value?.data.currentPage!)
const items = ref(usersREQ.data.value?.data.totalCount!)

watch(page,async(newValue,oldValue)=>{
  await usersREQ.fetchREQ(query.value,newValue,exactSearch.value)
})

const select=(row:User)=>{ 
  return navigateTo(`/user/${row.id}`)
}
watch(query ,async (newValue,oldValue)=>{
await usersREQ.fetchREQ(newValue,1,exactSearch.value )
  // page.value = usersREQ.data.value?.data.currentPage!
  console.log(usersREQ.data.value?.data.totalCount)
  items.value = usersREQ.data.value?.data.totalCount!
})
watch(exactSearch ,async(newValue,oldaValue)=>{
  await usersREQ.fetchREQ(query.value,1,exactSearch.value)
  items.value = usersREQ.data.value?.data.totalCount!
})
</script>

<style>

</style>