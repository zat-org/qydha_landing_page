<template>
  <UCard :ui="{base:'flex flex-col h-full ',body:{base:'grow flex flex-col'}}">
    <template #header>
      <div class="flex justify-between items-center gap-2 ">
        <UInput v-model="query" placeholder="username or id  or phone " class="grow" />
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
  await usersREQ.fetchREQ(query.value,newValue)
})

const select=(row:User)=>{ 
  return navigateTo(`/user/${row.id}`)
}
watch(query ,async (newValue,oldValue)=>{
await usersREQ.fetchREQ(newValue)
if (usersREQ.status.value=="success"){

  page.value = usersREQ.data.value?.data.currentPage!
  items.value = usersREQ.data.value?.data.totalCount!
}  
})
</script>

<style>

</style>