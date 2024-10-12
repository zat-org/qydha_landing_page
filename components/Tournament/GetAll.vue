<template>
  <div class="flex flex-col   grow ">
    <!-- <div class="flex items-center gap-2 ">
 <UFormGroup label="الاسم" size="xs">

        <UInput v-model="nameQ" />
      </UFormGroup> -->
      <!-- <UFormGroup label="المالك" size="xs">
        <UInput v-model="ownerQ" />
      </UFormGroup>
      <UFormGroup label="قيدها" size="xs">
        <UToggle v-model="QydhaQ" />
      </UFormGroup>
    </div> -->

    
    <UTable :rows="rows" :columns="cols" @select="select" :ui="{td:{padding:'p-1'},th:{padding:'p-1'}}">
      <!-- <template #owner-data="{ row }">
  <p>{{ row.owner }}</p>
      </template> -->
      <template #showInQydha-data="{ row }">
        <UIcon name="healthicons:yes" class="text-3xl"
          :class="{ 'text-green-500': row.showInQydha, 'text-black': !row.showInQydha }" />
      </template>
    </UTable>
    <UPagination v-model="page" :page-count="10" :total="getAllREQ.data.value?.data.totalCount!"  class="mx-auto mt-auto"/>
  </div>
</template>

<script lang="ts" setup>
import type { ITournament } from '~/models/tournament';

const ownerQ = ref()
const nameQ = ref()
const QydhaQ = ref(false)

const tourApi = useTournament()
const getAllREQ = await tourApi.getAllTournament()
await getAllREQ.fetchREQ()
const tournaments = computed(() => {
  if (getAllREQ.status.value == "success" && getAllREQ.data.value) {
    return getAllREQ.data.value?.data.items
  }
})

const rows = computed(() => {
  let results = tournaments.value ?? []
  if (nameQ.value) {
    results = results.filter((t) => {
      return t.name.toLowerCase().includes((nameQ.value as string).toLowerCase())
    })
  }
  // if (ownerQ.value){
  //   results = results.filter((t)=>{
  //     return t.owner.username?.toLowerCase().includes((ownerQ.value as string).toLowerCase())
  //   })
  // }
  // filter with qydha 
  // results = results.filter((t) => {
  //   return t.showInQydha == QydhaQ.value
  // })

  return results
  
  
})
const page = ref(getAllREQ.data.value?.data.currentPage!)
watch(page,()=>{
  getAllREQ.fetchREQ(page.value)
})
const cols = [
  { key: "name", label: "الاسم" },
  { key: "city", label: "المدينة" },
  // {key:"owner",label:"المالك"},
  { key: "showInQydha", label: "قيدها" }
]

const select=(row:ITournament)=>{
  return navigateTo(`/tournament/${row.id}`)
}

</script>

<style></style>