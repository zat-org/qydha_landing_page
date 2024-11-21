<template>
<UCard :ui="{base:'flex flex-col h-full ' ,body:{base:'grow'}}">
  
    <UTable :rows="rows" :columns="cols" :ui="{td:{padding:'py-1'}}">
      <template #link-data="{row}">
        <UButton :to="row.link"  target="_blank">
          <IconOpen class="text-xl"/>
        </UButton >
      </template>
    </UTable>
</UCard>
</template>

<script lang="ts" setup>
import { useMyAuthStore } from '~/store/Auth';


const authstore = useMyAuthStore()
const boardlink = computed(() => {
  if (authstore.user)
    return authstore.user.boardLink
})
const rows = [
  {name:'ذات   ',link:`${boardlink.value}/?theme=zat&orienation=landscape&showPlayers=false`},
  {name:'قيدها  ' ,link:`${boardlink.value}/?theme=qydha&orienation=landscape&showPlayers=false`},
  {name:'قيدها للهاتف بدون صور الاعبين' ,link:`${boardlink.value}/?theme=qydha&orienation=portrait&showPlayers=false`},
  {name:'قيدها للهاتف بصور الاعبين',link:`${boardlink.value}/?theme=qydha&orienation=portrait&showPlayers=true`},
  {name:'صور الاعبين TOP ',link:`${boardlink.value}/cam/top`},
  {name:'صور الاعبين BOTTOM',link:`${boardlink.value}/cam/bottom`},
  {name:'صور الاعبين RIGHT ',link:`${boardlink.value}/cam/right`},
  {name:'صور الاعبين LEFT',link:`${boardlink.value}/cam/left`},
]

const cols= [
  { key:'name',label:'الاسم'},
  { key:'link',label:'الرابط'},

]

</script>

<style></style>