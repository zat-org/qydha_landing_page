<template>
  <UCard :ui="{base:'flex flex-col h-full ',body:{base:'grow flex flex-col'}}">
    <template #header>
     <UInput v-model="query" placeholder="username or id  or phone " />
    </template>

      <UTable :rows="rows" :columns="cols" class="grow " :ui="{td:{padding:'py-2 sm:py-2'}}" @select="select" :loading="usersREQ.status.value=='pending'"></UTable>
      <UPagination v-model="page" :page-count="5" :total="items"  class="mx-auto"/>

  </UCard>
</template>

<script lang="ts" setup>
import type { User } from '~/models/user';

const  query  =ref()
const usersREQ = await useUsers().getAllUsers()
await usersREQ.fetchREQ("")
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
  
})
</script>

<style>

</style>