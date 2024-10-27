<template>
<UCard :ui="{base:'flex flex-col h-full ' ,body:{base:'grow'}}">
  
    <UTable :rows="rows" :columns="cols" :ui="{td:{padding:'py-1'}}">
      <template #link-data="{row}">
        <UButton icon="majesticons:open" :to="row.link"  target="_blank"/>
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
  {name:'live with zat theme for obs',link:`${boardlink.value}/?theme=zat&orienation=landscape&showPlayers=false`},
  {name:'live with qydha theme for obs ' ,link:`${boardlink.value}/?theme=qydha&orienation=landscape&showPlayers=false`},
  {name:'live with qydha theme for mobiles  without player image' ,link:`${boardlink.value}/?theme=qydha&orienation=portrait&showPlayers=false`},
  {name:'live with qydha theme for mobiles  with  player image',link:`${boardlink.value}/?theme=qydha&orienation=portrait&showPlayers=true`},
  {name:'player Image top ',link:`${boardlink.value}/cam/top`},
  {name:'player Image bottom ',link:`${boardlink.value}/cam/bottom`},
  {name:'player Image right ',link:`${boardlink.value}/cam/right`},
  {name:'player Image left ',link:`${boardlink.value}/cam/left`},
]

const cols= [
  { key:'name',label:'Name'},
  { key:'link',label:'Link'},

]

</script>

<style></style>